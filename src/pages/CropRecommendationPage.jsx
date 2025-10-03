"use client";

import { useState } from "react";
import { FaLeaf, FaCloudSun, FaFlask, FaRuler } from "react-icons/fa";

const CropRecommendationPage = () => {
  const [formData, setFormData] = useState({
    weather: "",
    soilType: "",
    landArea: "",
  });

  const [recommendation, setRecommendation] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock recommendation logic
    let crop = "";
    if (formData.weather === "sunny" && formData.soilType === "loamy") {
      crop = "Wheat";
    } else if (formData.weather === "rainy" && formData.soilType === "clay") {
      crop = "Rice";
    } else if (formData.weather === "moderate" && formData.soilType === "sandy") {
      crop = "Maize";
    } else {
      crop = "Tomatoes"; // default
    }

    setRecommendation({
      crop,
      reason: `Based on ${formData.weather} weather and ${formData.soilType} soil, ${crop} is recommended for your ${formData.landArea} acres of land.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-12">
        <FaLeaf className="text-green-500 text-5xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Crop Recommendation</h1>
        <p className="text-lg text-gray-600">
          Get personalized crop recommendations based on your local conditions.
        </p>
      </div>

      <div className="max-w-md mx-auto glass p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCloudSun className="inline mr-2" />
              Weather Condition
            </label>
            <select
              name="weather"
              value={formData.weather}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Weather</option>
              <option value="sunny">Sunny</option>
              <option value="rainy">Rainy</option>
              <option value="moderate">Moderate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFlask className="inline mr-2" />
              Soil Type
            </label>
            <select
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Soil Type</option>
              <option value="loamy">Loamy</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaRuler className="inline mr-2" />
              Land Area (in acres)
            </label>
            <input
              type="number"
              name="landArea"
              value={formData.landArea}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter land area"
              min="0.1"
              step="0.1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            Get Recommendation
          </button>
        </form>

        {recommendation && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Recommended Crop: {recommendation.crop}
            </h3>
            <p className="text-green-700">{recommendation.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendationPage;
