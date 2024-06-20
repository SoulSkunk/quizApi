"use client";
import React, { useEffect, useState } from "react";
import categoriesData from "@/data/categories.json";

export default function QuizPage({ params }) {
  ////////////////////////////////////////////////////////
  //Stock les questions en fonction de la catégorie cliqué
  const [questions, setQuestions] = useState([]);

  //Pagination des questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  //Stock la réponse choisi par l'user
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  //Boolean isCorrect = true => good answer
  const [isCorrect, setIsCorrect] = useState(null);

  // Stocke le score
  const [score, setScore] = useState(0);

  // Stocke si la question a été répondue
  const [isAnswered, setIsAnswered] = useState(false);

  //////////////////////////////////////////////////
  // Sélectionne 10 questions random
  const selectRandomQuestions = (allQuestions) => {
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  //Fetch des questions en fonction de la categorie
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://quizzapi.jomoreschi.fr/api/v1/quiz?category=${params.slug}`
        );
        const data = await response.json();
        const randomQuestions = selectRandomQuestions(data.quizzes);
        setQuestions(randomQuestions);
      } catch (error) {
        console.error("Erreur lors de la récupération des questions :", error);
      }
    };

    if (params) {
      fetchQuestions();
    }
  }, [params]);

  //Fait spawn les prochaines questions
  const handleNextQuestion = () => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setIsAnswered(false);
  };

  //Fait spawn les précédentes questions
  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setIsAnswered(false);
  };

  // Gère la sélection d'une réponse
  const handleAnswerClick = (answer) => {
    if (isAnswered) return; // Empêche de sélectionner une autre réponse
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  //On recup et stock la categorie choisi (via l'url) on find dans le json
  const getCategoryInfo = (slug) => {
    const category = categoriesData.find((cat) => cat.slug === slug);
    return category ? { name: category.name, emoji: category.emoji } : {};
  };

  //Si c'est long => loading
  if (questions.length === 0) {
    return <div className="text-center text-4xl">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const { name, emoji } = getCategoryInfo(params.slug);

  return (
    <div className="flex items-center justify-center ">
      <div className=" p-4">
        <h1 className="text-5xl font-bold mb-4">
          {name} {emoji}
        </h1>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">
            Question {currentQuestionIndex + 1} : {currentQuestion.question}
          </h2>
          <ul>
            {currentQuestion.badAnswers
              .concat(currentQuestion.answer)
              .map((answer, index) => (
                <li
                  key={index}
                  className={`ml-4 list-disc text-xl cursor-pointer ${
                    selectedAnswer === answer
                      ? isCorrect
                        ? "text-green-500"
                        : "text-red-500"
                      : ""
                  }`}
                  onClick={() => handleAnswerClick(answer)}
                >
                  {answer}
                </li>
              ))}
          </ul>
        </div>
        <div className="flex justify-between">
          {currentQuestionIndex > 0 && (
            <button
              className="p-2 bg-teal-600 rounded-md"
              onClick={handlePreviousQuestion}
            >
              Question précédente
            </button>
          )}
          {currentQuestionIndex < questions.length - 1 && (
            <button
              className="p-2 bg-teal-600 rounded-md"
              onClick={handleNextQuestion}
            >
              Question suivante
            </button>
          )}
        </div>
        <div className="pt-12">
          <p className="text-slate-600">
            Attention, une fois cliqué vous ne pourrez pas modifier votre
            réponse
          </p>

          <br />
          <p className="text-xl font-semibold ">
            {" "}
            Vous avez {score}/{questions.length} bonnes réponses
          </p>
        </div>
      </div>
    </div>
  );
}
