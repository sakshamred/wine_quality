import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Load the dataset
df = pd.read_csv('winequality-red.csv')

# Select Features and Target
features = ['alcohol', 'fixed acidity', 'pH', 'sulphates']
X = df[features]
y = df['quality']

# Split and Train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Print Accuracy
y_pred = rf_model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")

# Save the model
joblib.dump(rf_model, 'wine_quality_model.pkl')
print("Model saved as 'wine_quality_model.pkl'")