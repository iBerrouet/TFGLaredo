from sklearn.base import BaseEstimator, TransformerMixin
import pandas as pd

class FfillTransformer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return X.ffill()

class BfillTransformer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return X.bfill()
