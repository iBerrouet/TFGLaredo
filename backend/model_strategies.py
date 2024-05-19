from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.svm import SVC

class ModelStrategy:
    def create_model(self, parameters):
        pass

class RandomForestClassifierSklearnStrategy(ModelStrategy):
    def create_model(self, parameters):
        return RandomForestClassifier(**parameters)

class DecisionTreeClassifierSklearnStrategy(ModelStrategy):
    def create_model(self, parameters):
        return DecisionTreeClassifier(**parameters)
    
class SupportVectorMachineClassifierSklearnStrategy(ModelStrategy):
    def create_model(self, parameters):
        return SVC(**parameters)

class KNeighborsClassifierSklearnStrategy(ModelStrategy):
    def create_model(self, parameters):
        return KNeighborsClassifier(**parameters)

class KNeighborsRegressorSklearnStrategy(ModelStrategy):
    def create_model(self, parameters):
        return KNeighborsRegressor(**parameters)
