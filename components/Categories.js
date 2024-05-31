"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/store/store";

import categoriesData from "@/data/categories.json";

export default function Categories() {
  //Tableaux d'objet des catégories
  const [categories, setCategories] = useState([]);

  const { setSelectedCategory } = useStore();

  //categories contient maintenant toutes les catégories
  useEffect(() => {
    setCategories(categoriesData);
  }, []);

  //Function qui capte la catégorie cliquée
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Catégorie enregistré dans le store = " + category.slug); //C'est good, juste on a pas le temps de voir parceque ca redirige
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Choisis la catégorie du quizz
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link key={category.slug} href={`/quiz/${category.slug}`}>
            <div
              className="cursor-pointer border rounded-lg p-4 text-center"
              onClick={() => handleCategorySelect(category)}
            >
              <div className="text-2xl">{category.emoji}</div>
              <div className="mt-2 text-xl font-semibold">{category.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
