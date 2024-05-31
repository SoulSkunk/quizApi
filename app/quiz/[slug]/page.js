"use client";
import React, { useEffect, useState } from "react";
import { useStore } from "@/store/store";

export default function QuizPage() {
  const { selectedCategory } = useStore();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Appelle l'API pour récupérer les questions de la catégorie spécifiée
        const response = await fetch(
          `https://quizzapi.jomoreschi.fr/api/v1/quiz?category=${selectedCategory.slug}`
        );
        const data = await response.json();
        setQuestions(data.quizzes);
      } catch (error) {
        console.error("Erreur lors de la récupération des questions :", error);
      }
    };

    // Vérifie si une catégorie est sélectionnée avant de faire l'appel API
    if (selectedCategory) {
      fetchQuestions();
    }
  }, [selectedCategory]);

  return (
    <div>
      <h1>Quiz - {selectedCategory?.name}</h1>
      {/* Affichage des questions */}
      {questions.map((question, index) => (
        <div key={index}>
          <h2>{question.question}</h2>
          <ul>
            {question.badAnswers.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
