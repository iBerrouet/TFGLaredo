from sklearn.preprocessing import LabelEncoder
from sklearn.base import estimator_html_repr
from sklearn.pipeline import Pipeline
from preprocessing_strategy import *
from model_strategies import *
import pandas as pd
from flask import Flask, jsonify, request, request
import mlflow
from flask_restful import Api
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.metrics import f1_score, mean_squared_error, recall_score, silhouette_score, r2_score, accuracy_score
from sklearn.model_selection import train_test_split


app = Flask(__name__)
CORS(app)
api = Api(app=app)

mlflow.set_tracking_uri("http://localhost:5000")

@app.route("/")
def hello():
    return "Esta es mi API creada para usar los datos de MlFlow en React"

@app.route("/models", methods=["GET"])
def get_models():
    registered_models = mlflow.search_registered_models()

    if not registered_models:
        return jsonify({"error": "No models found"}), 404

    filtered_models = [{
        'version': model.latest_versions[0].version,
        'model_name': model.latest_versions[0].name,
        'creation_time': model.latest_versions[0].creation_timestamp,
    } for model in registered_models]

    sorted_models = sorted(filtered_models, key=lambda x: x['creation_time'], reverse=True)

    return jsonify(sorted_models), 200


@app.route("/models/<model_name>", methods=["GET"])
def get_model(model_name):
    model = mlflow.search_registered_models(filter_string=f"name='{model_name}'")

    if not model:
            return jsonify({"error": "Model not found"}), 404

    run_id = model[0].latest_versions[0].run_id
    run = mlflow.get_run(run_id)
    estimator_uri = run.info.artifact_uri + "/estimator.html"

    estimator = mlflow.artifacts.load_text(estimator_uri)
    dataset = run.inputs.dataset_inputs[0].dataset.schema

    response_data = {
        "estimator": estimator,
        "metrics" : run.data.metrics,
        "dataset" : dataset,
    }

    return jsonify(response_data), 200
    
@app.route('/models', methods=['POST'])
def train_model():

    data = request.json

    model_name = data.get('modelName')
    problem_type = data.get('problemType')
    dataset_json = data.get('datasetJSON')
    columns_data_type = data.get('columnsDataType')
    target = data.get('target')
    preprocessing_methods = data.get('preprocessingMethods')
    algorithm = data.get('algorithm')
    strategy = data.get('strategy')
    parameters_value = data.get('parametersValue')

    dataset = pd.DataFrame.from_dict(dataset_json)
    dataset = dataset.astype(columns_data_type)

    if dataset[target].dtype == "object":
        label_encoder = LabelEncoder()
        dataset[target] = label_encoder.fit_transform(dataset[target])


    steps = []

    for method, method_data in preprocessing_methods.items():
        strategy_name = preprocessing_methods[method]['strategy']
        strategy_class = globals().get(strategy_name) 
        if strategy_class != None:
            if 'params' in method_data:
                step = strategy_class().get_step(method_data['params'])
            else:
                step = strategy_class().get_step({})            
            steps.append(step)
        else:
            return jsonify({"message": f"Invalid strategy {strategy_name}"}), 400
        

    x = dataset.drop(columns=[target])
    y = dataset[target]

    #kfold cross validation
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

    strategy_class = globals().get(strategy)
    if strategy_class is None:
        return jsonify({"message": "Invalid strategy"}), 400


    with mlflow.start_run():

        x_train_mlflow = mlflow.data.from_pandas(x_train)
        x_test_mlflow = mlflow.data.from_pandas(x_test)

        mlflow.log_input(x_train_mlflow, context="train")
        mlflow.log_input(x_test_mlflow, context="test")


        model = strategy_class().create_model(parameters_value)

        
        steps.append(("model", model))
        pipeline = Pipeline(steps)        
        pipeline.fit(x_train, y_train)
        predictions = pipeline.predict(x_test)

        mlflow.log_param("algorithm", algorithm)
        mlflow.log_params(parameters_value)
        metrics = get_metrics(problem_type, x_test, y_test, predictions)
        mlflow.log_metrics(metrics)
        mlflow.sklearn.log_model(sk_model=model, artifact_path="model", registered_model_name=model_name)
        mlflow.log_text(estimator_html_repr(pipeline), "estimator.html")

    return jsonify(metrics), 200


def get_metrics(problem_type, x_test, y_test, predictions):
    metrics = {}
    if problem_type == "classifier":
        accuracy = accuracy_score(y_test, predictions)
        tpr = recall_score(y_test, predictions, average='macro')
        fpr = 1 - recall_score(y_test, predictions, average='macro')
        f1 = f1_score(y_test, predictions, average='macro')
        metrics['accuracy'] = accuracy
        metrics['tpr'] = tpr
        metrics['fpr'] = fpr
        metrics['f1_score'] = f1
    elif problem_type == "cluster":
        silhouette_score_value = silhouette_score(x_test, predictions)
        metrics['silhouette_score'] = silhouette_score_value
    elif problem_type == "regressor":
        mse = mean_squared_error(y_test, predictions)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, predictions)
        metrics['mean_squared_error'] = mse
        metrics['root_mean_squared_error'] = rmse
        metrics['r2_score'] = r2
        
    return metrics


@app.route("/column-types" , methods=["POST"])
def get_column_types():
    data = request.json

    dataset_json = data.get('datasetJSON')
    dataset = pd.DataFrame.from_dict(dataset_json)

    column_types = dataset.dtypes.apply(lambda x: x.name).to_dict()
    
    return jsonify(column_types), 200

if __name__ == "__main__":
    app.run(port=5050, debug=True)