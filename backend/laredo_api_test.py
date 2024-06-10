import unittest
from flask import jsonify
from laredo_api import app

class TestLaredoAPI(unittest.TestCase):

    def setUp(self):
        self.app = app
        self.client = self.app.test_client()
        self.app.testing = True

    def test_missing_params(self):
        data = {
            'modelName': 'testModel',
            'problemType': 'classification',
            # 'datasetJSON': {'col1': [1, 2], 'col2': [3, 4]}, 
            'columnsDataType': {'col1': 'int', 'col2': 'int'},
            'target': 'col1',
            'preprocessingMethods': {},
            'algorithm': 'someAlgorithm',
            'strategy': 'someStrategy',
            'parametersValue': {}
        }

        response = self.client.post('/models', json=data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('Missing parameters', response.json['error'])

    def test_invalid_strategy(self):
        data = {
            'modelName': 'testModel',
            'problemType': 'classification',
            'datasetJSON': {'col1': [1, 2], 'col2': [3, 4]}, 
            'columnsDataType': {'col1': 'int', 'col2': 'int'},
            'target': 'col1',
            'preprocessingMethods': {},
            'algorithm': 'RandomForestClassifier',
            'strategy': 'RandomForestClassifierSinStrategy',
            'parametersValue': {}
        }

        response = self.client.post('/models', json=data)
        self.assertEqual(response.status_code, 409)
        self.assertIn('Invalid strategy', response.json['error'])

    def test_invalid_preprocessing_method(self):
        data = {
            'modelName': 'testModel',
            'problemType': 'classification',
            'datasetJSON': {'col1': [1, 2], 'col2': [3, 4]}, 
            'columnsDataType': {'col1': 'int', 'col2': 'int'},
            'target': 'col1',
            'preprocessingMethods': { "SomeMethod": {
                "strategy": "SomeMethodStrategy"}},
            'algorithm': 'RandomForestClassifier',
            'strategy': 'RandomForestClassifierSklearnStrategy',
            'parametersValue': {}
        }

        response = self.client.post('/models', json=data)
        self.assertEqual(response.status_code, 409)
        self.assertIn('Invalid strategy', response.json['error'])

    def test_successful_request_classifer(self):
        data = {
            'modelName': 'testModel',
            'problemType': 'classifier',
            'datasetJSON': {
                "feature1": [1, 2, 3, 4, 5],
                "feature2": [4, 5, 6, 7, 8],
                "target": [10, 20, 30, 40, 50]
            },
            'columnsDataType': {'feature1': 'int', 'feature2': 'int', 'target': 'int'},
            'target': 'target',
            'preprocessingMethods': {},
            'algorithm': 'RandomForestClassifier',
            'strategy': 'RandomForestClassifierSklearnStrategy',
            'parametersValue': {}
        }

        response = self.client.post('/models', json=data)
        print(response.json) 
        self.assertEqual(response.status_code, 200)
        self.assertIn('accuracy', response.json)

    def test_successful_request_regressor(self):
        data = {
            'modelName': 'testModel',
            'problemType': 'regressor',
            'datasetJSON': {
                "feature1": [1, 2, 3, 4, 5],
                "feature2": [4, 5, 6, 7, 8],
                "target": [10, 20, 30, 40, 50]
            },
            'columnsDataType': {'feature1': 'int', 'feature2': 'int', 'target': 'int'},
            'target': 'target',
            'preprocessingMethods': {},
            'algorithm': 'DecisionTreeRegressor',
            'strategy': 'DecisionTreeRegressorSklearnStrategy',
            'parametersValue': {}
        }

        response = self.client.post('/models', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('r2_score', response.json)

    def test_get_model_not_found(self):
        response = self.client.get('/models/nonexistentModel')
        self.assertEqual(response.status_code, 404)
        self.assertIn('Model not found', response.json['error'])

    def test_get_model_found(self):
        response = self.client.get('/models/knn_pipeline')
        self.assertEqual(response.status_code, 200)
        self.assertIn('metrics', response.json)

    def test_get_column_types_missing_dataset(self):
        response = self.client.post('/column-types', json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn('Missing dataset', response.json['message'])

    def test_get_column_types(self):
        data = {
            'datasetJSON': {'col1': [1, 2], 'col2': ['hello', 'bye']}
        }
        response = self.client.post('/column-types', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('col1', response.json)
        self.assertIn('int', response.json['col1'])
        self.assertIn('col2', response.json)
        self.assertIn('object', response.json['col2'])


if __name__ == '__main__':
    unittest.main()
