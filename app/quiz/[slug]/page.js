"use client";
import React, { useEffect, useState } from "react";
import { useStore } from "@/store/store";
import categoriesData from "@/data/categories.json";

export default function QuizPage({ params }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://quizzapi.jomoreschi.fr/api/v1/quiz?category=${params.slug}`
        );
        const data = await response.json();
        setQuestions(data.quizzes);
      } catch (error) {
        console.error("Erreur lors de la récupération des questions :", error);
      }
    };

    if (params) {
      fetchQuestions();
    }
  }, [params]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const getCategoryName = (slug) => {
    const category = categoriesData.find((cat) => cat.slug === slug);
    return category ? category.name : "";
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Quiz - {getCategoryName(params.slug)}
      </h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Question {currentQuestionIndex + 1}: {currentQuestion.question}
        </h2>
        <ul>
          {currentQuestion.badAnswers.map((answer, index) => (
            <li key={index} className="ml-4 list-disc">
              {answer}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between">
        {currentQuestionIndex > 0 && (
          <button onClick={handlePreviousQuestion}>Question précédente</button>
        )}
        {currentQuestionIndex < questions.length - 1 && (
          <button onClick={handleNextQuestion}>Question suivante</button>
        )}
      </div>
    </div>
  );
}
