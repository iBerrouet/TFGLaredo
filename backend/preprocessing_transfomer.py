import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
import pandas as pd

class FfillTransformer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        df = pd.DataFrame(X)
        df.ffill()
        df.bfill()
        X = np.array(df)
        return X

class BfillTransformer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        df = pd.DataFrame(X)
        df.bfill()
        df.ffill()
        X = np.array(df)
        return X