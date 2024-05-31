from sklearn.pipeline import Pipeline
from preprocessing_strategy import *
import os
from flask import Flask, jsonify, request
import mlflow
from flask_restful import Api
from flask_cors import CORS
import pandas as pd
from sklearn import tree
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score, recall_score
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
    
@app.route('/models', methods=['POST'])
def train_model():

    data = request.json

    dataset_json = data.get('datasetJSON')
    columns_data_type = data.get('columnsDataType')
    preprocessing_methods = data.get('preprocessingMethods')
    algorithm = data.get('algorithm')
    parameters_value = data.get('parametersValue')

    dataset = pd.DataFrame.from_dict(dataset_json)

    dataset.loc[((dataset.machine_status == 'BROKEN') | (dataset.machine_status == 'RECOVERING')), 'machine_status'] = 'BROKEN'

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
        

    x = dataset.drop(columns=['machine_status'])
    y = dataset['machine_status']

    #kfold cross validation
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

    #training = mlflow.data.from_pandas(_,targets='label')


    with mlflow.start_run():

        #mlflow.log_input(training, "training")

        if algorithm == "random_forest" :
            model = RandomForestClassifier(**parameters_value)
        elif algorithm == "decision_tree" :
            model = tree.DecisionTreeClassifier(**parameters_value)
        else:
            return jsonify({"message": "Invalid algorithm"}), 400
        
        steps.append(("model", model))
        pipeline = Pipeline(steps)
        pipeline.fit(x_train, y_train)

        predictions = pipeline.predict(x_test)

        accuracy = pipeline.score(x_test, y_test)

        tpr = recall_score(y_test, predictions, pos_label='BROKEN')
        fpr = 1 - recall_score(y_test, predictions, pos_label='NORMAL')
        f1 = f1_score(y_test, predictions, pos_label='BROKEN')

        #sklearn.utils.estimator_html_repr


        #model_evaluation.html sklearn
        mlflow.log_param("algorithm", algorithm)
        mlflow.log_params(parameters_value)
        mlflow.log_metric('accuracy', accuracy)
        mlflow.log_metric('tpr', tpr)
        mlflow.log_metric('fpr', fpr)
        mlflow.log_metric('f1_score', f1)


        mlflow.sklearn.log_model(sk_model=pipeline, artifact_path="model", registered_model_name="model_name")


    return jsonify({"message": "Model trained successfully"}), 200


if __name__ == "__main__":
    app.run(port=5050)