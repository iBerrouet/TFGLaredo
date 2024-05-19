from sklearn.decomposition import PCA
from sklearn.preprocessing import MinMaxScaler, Normalizer, StandardScaler, OneHotEncoder
from sklearn.feature_selection import SelectKBest
from sklearn.impute import SimpleImputer

class PreprocessingStrategy:
    def preprocess(self, dataset, params):
        pass

class MinMaxScalerStrategy(PreprocessingStrategy):
    def preprocess(self, dataset, params):
        scaler = MinMaxScaler(**params)
        return scaler.fit_transform(dataset)
    
class TargetEncoderStrategy(PreprocessingStrategy):
    def preprocess(self, dataset, params):
        return
    
class NormalizerStrategy(PreprocessingStrategy):
    def preprocess(self, dataset, params):
        normalizer = Normalizer(**params)
        return normalizer.fit_transform(dataset)

class StandardScalerStrategy(PreprocessingStrategy):
    def preprocess(self, dataset, params):
        scaler = StandardScaler(**params)
        return scaler.fit_transform(dataset)

class OneHotEncoderStrategy(PreprocessingStrategy):
    def preprocess(self, dataset, params):
        encoder = OneHotEncoder(**params)
        return encoder.fit_transform(dataset)

class SelectKBestStrategy(PreprocessingStrategy):
    def preprocess(self, dataset, params):
        selector = SelectKBest(**params)
        return selector.fit_transform(dataset)

class PCAStrategy(PreprocessingStrategy):
    def preprocess(self, dataset, params):
        pca = PCA(**params)
        return pca.fit_transform(dataset)
    
class SimpleImputerStrategy(PreprocessingStrategy):
    def preprocess(self, dataset, params):
        imputer = SimpleImputer(**params)
        return imputer.fit_transform(dataset)
    
class FfillStrategy(PreprocessingStrategy):
    def preprocess(self, dataset, params):
        filled_dataset = dataset.fillna(method='ffill', **params)
        return filled_dataset

class BfillStrategy(PreprocessingStrategy):
    def preprocess(self, dataset, params):
        filled_dataset = dataset.fillna(method='bfill', **params)
        return filled_dataset
