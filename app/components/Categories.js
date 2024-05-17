"use client";

import React, { useEffect, useState } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const API_KEY = process.env.NEXT_PUBLIC_QUIZAPI_KEY;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://quizapi.io/api/v1/categories", {
          headers: {
            "X-Api-Key": API_KEY,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("API response:", data); // Ajout du console log pour afficher la réponse de l'API
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [API_KEY]);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Choisis le thème du quizz
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition duration-200"
            >
              <h2 className="text-2xl font-semibold text-gray-700">
                {category.name}
              </h2>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
