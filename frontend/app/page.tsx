'use client';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    alcohol: 10.5,
    fixed_acidity: 7.4,
    pH: 3.3,
    sulphates: 0.65
  });
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // IMPORTANT: Change this URL to your Render URL after you deploy the backend!
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'; 
      
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data.predicted_quality);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to the prediction server.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Wine Quality Predictor</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="capitalize text-sm font-semibold text-gray-600 mb-1">
                {key.replace('_', ' ')}
              </label>
              <input
                type="number"
                step="0.01"
                name={key}
                value={formData[key as keyof typeof formData]}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>
          ))}
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-4 rounded"
          >
            {loading ? 'Analyzing...' : 'Predict Quality'}
          </button>
        </form>
        
        {result !== null && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-700 font-semibold mb-1">Classification Result</p>
            <h2 className="text-3xl font-bold text-green-900">Quality: {result} / 10</h2>
          </div>
        )}
      </div>
    </main>
  );
}