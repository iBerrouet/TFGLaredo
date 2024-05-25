from model_strategies import *
import pandas as pd
from flask import Flask, jsonify, request, request
import mlflow
from flask_restful import Api
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.neighbors import KNeighborsRegressor
from sklearn.neighbors import KNeighborsClassifier
from sklearn import tree
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import f1_score, mean_squared_error, recall_score, silhouette_score, r2_score
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
    filtered_models = [{
        'model_id': model.latest_versions[0].version,
        'model_name': model.latest_versions[0].name,
        'creation_time': model.creation_timestamp,
        'development_stage': model.latest_versions[0].current_stage
    } for model in registered_models]
    return jsonify(filtered_models), 200


@app.route("/models/<model_name>", methods=["GET"])
def get_model(model_name):
    model = mlflow.search_registered_models(filter_string=f"name='{model_name}'")
    run_id = model[0].latest_versions[0].run_id
    run = mlflow.get_run(run_id)
    estimator_uri = run.info.artifact_uri + "/estimator.html"

    html = mlflow.artifacts.load_text(estimator_uri)
    dataset = run.inputs.dataset_inputs[0].dataset.schema

    response_data = {
        "html_content": html,
        "metrics" : run.data.metrics,
        "dataset" : dataset,
    }

    return jsonify(response_data), 200
    
@app.route('/train_model', methods=['POST'])
def train_model():

    data = request.json

    model_name = data.get('modelName')
    problem_type = data.get('problemType')
    dataset_json = data.get('datasetJSON')
    columns_data_type = data.get('columnsDataType')
    target = data.get('target')
    algorithm = data.get('algorithm')
    strategy = data.get('strategy')
    parameters_value = data.get('parametersValue')

    dataset = pd.DataFrame.from_dict(dataset_json)
    dataset.loc[((dataset.machine_status == 'BROKEN') | (dataset.machine_status == 'RECOVERING')), 'machine_status'] = 'BROKEN'

    dataset = dataset.drop(columns=['sensor_15', '', 'timestamp'])

    dataset = dataset[~dataset.map(lambda x: x == "").any(axis=1)] 

    x = dataset.drop(columns=[target])
    y = dataset[target]

    #kfold cross validation
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

    #training = mlflow.data.from_pandas(_,targets='label')

    strategy_class = globals().get(strategy)
    if strategy_class is None:
        return jsonify({"message": "Invalid strategy"}), 400

    mlflow.sklearn.autolog()

    with mlflow.start_run():

        #mlflow.log_input(training, "training")
        
        model = strategy_class().create_model(parameters_value)

        model.fit(x_train, y_train)

        predictions = model.predict(x_test)

        #sklearn.utils.estimator_html_repr

        mlflow.log_param("algorithm", algorithm)
        mlflow.log_params(parameters_value)
        metrics = get_metrics(problem_type, model, x_test, y_test, predictions)
        mlflow.log_metrics(metrics)


        mlflow.sklearn.log_model(sk_model=model, artifact_path="model", registered_model_name=model_name)

    return jsonify(metrics), 200


def get_metrics(problem_type, model, x_test, y_test, predictions):
    metrics = {}
    if problem_type == "classifier":
        accuracy = model.score(x_test, y_test)
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
    app.run(port=5050)