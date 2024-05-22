import os
import pandas as pd
from flask import Flask, jsonify, request
import mlflow
from flask_restful import Api
from flask_cors import CORS


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

    mlflow.artifacts.download_artifacts(artifact_uri=estimator_uri, dst_path="C:\\Users\\isaac\\Downloads")
    html = mlflow.artifacts.load_text(estimator_uri)
    dataset = run.inputs.dataset_inputs[0].dataset.schema

    response_data = {
        "html_content": html,
        "metrics" : run.data.metrics,
        "dataset" : dataset,
    }

    return jsonify(response_data), 200
    
@app.route("/column-types" , methods=["POST"])
def get_column_types():
    data = request.json

    dataset_json = data.get('datasetJSON')
    dataset = pd.DataFrame.from_dict(dataset_json)

    column_types = dataset.dtypes.apply(lambda x: x.name).to_dict()
    
    return jsonify(column_types), 200


if __name__ == "__main__":
    app.run(port=5050)