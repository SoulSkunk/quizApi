"use client";
import React, { useEffect, useState } from "react";
import categoriesData from "@/data/categories.json";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function QuizPage({ params }) {
  const router = useRouter();

  // Stock les questions en fonction de la catégorie cliqué
  const [questions, setQuestions] = useState([]);

  // Pagination des questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Stock la réponse choisie par l'utilisateur
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Boolean isCorrect = true => bonne réponse
  const [isCorrect, setIsCorrect] = useState(null);

  // Stocke le score
  const [score, setScore] = useState(0);

  // Stocke si la question a été répondue
  const [isAnswered, setIsAnswered] = useState(false);

  // Index de la réponse sélectionnée pour appliquer une classe visuelle
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);

  // Stocke les réponses mélangées
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  // Sélectionne 10 questions aléatoires
  const selectRandomQuestions = (allQuestions) => {
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  // Fonction pour mélanger un tableau
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Fetch des questions en fonction de la catégorie
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

  // Mélange les réponses à chaque fois qu'une nouvelle question est affichée
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const answers = shuffleArray(
        currentQuestion.badAnswers.concat(currentQuestion.answer)
      );
      setShuffledAnswers(answers);
    }
  }, [currentQuestionIndex, questions]);

  // Gère la sélection d'une réponse
  const handleAnswerClick = (answer, index) => {
    if (isAnswered) return; // Empêche de sélectionner une autre réponse si déjà répondu
    setSelectedAnswer(answer);
    setSelectedAnswerIndex(index); // Met à jour l'index de la réponse sélectionnée
  };

  const handleValidateAnswer = () => {
    if (selectedAnswer === currentQuestion.answer) {
      setIsCorrect(true);
      setScore((prevScore) => prevScore + 1);
    } else {
      setIsCorrect(false);
    }
    setIsAnswered(true);

    // Aller à la question suivante après un court délai pour afficher la réponse
    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        // Redirige vers la page de registre après la dernière question
        router.push(`/register?score=${score + 1}`);
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setIsAnswered(false);
        setSelectedAnswerIndex(-1); // Réinitialise l'index de la réponse sélectionnée
      }
    }, 1000);
  };

  // On récupère et stocke la catégorie choisie (via l'url) on trouve dans le json
  const getCategoryInfo = (slug) => {
    const category = categoriesData.find((cat) => cat.slug === slug);
    return category ? { name: category.name, emoji: category.emoji } : {};
  };

  // Si c'est long => loading
  if (questions.length === 0) {
    return <div className="text-center text-4xl">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const { name, emoji } = getCategoryInfo(params.slug);

  const formatQuestion = (question) => {
    const words = question.split(" ");
    const lines = [];
    for (let i = 0; i < words.length; i += 10) {
      lines.push(words.slice(i, i + 10).join(" "));
    }
    return lines;
  };

  const formattedQuestion = formatQuestion(currentQuestion.question);

  return (
    <div className="flex items-center justify-center ">
      {/* Left part */}
      <div className="w-2/5 flex items-center justify-center">
        <Image
          src={`/${params.slug}.png`}
          height={950}
          width={800}
          className="w-full"
          alt={`${params.slug}`}
        />
      </div>

      {/* Right part */}
      <div className="w-3/5 flex flex-col justify-center items-center p-4">
        <div className="w-full">
          {/* Score en haut à gauche */}
          <div className=" text-purple-500 text-right font-bold text-3xl">
            <h3>
              {score}/{questions.length}
            </h3>
          </div>

          {/* Contenu centré */}
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-purple-500 text-white mb-20 p-1 rounded-lg inline-block">
                {name} {emoji}
              </h1>
            </div>

            <div className="">
              <h2 className="bg-purple-500 text-white p-1 rounded-lg text-3xl font-semibold text-center mb-12">
                Question {currentQuestionIndex + 1}
              </h2>

              <div>
                {formattedQuestion.map((line, index) => (
                  <p className="text-3xl ml-3 font-bold mb-5" key={index}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
            <ul className="max-w-md">
              {shuffledAnswers.map((answer, index) => (
                <li
                  key={index}
                  className={`ml-4 p-2 text-xl cursor-pointer border-4 border-purple-300 rounded-lg mt-8 ${
                    selectedAnswer === answer && selectedAnswerIndex === index
                      ? "text-xl border-l-4 border-purple-500"
                      : isAnswered && answer === currentQuestion.answer
                      ? "text-green-500"
                      : isAnswered && answer !== currentQuestion.answer
                      ? "text-red-500"
                      : ""
                  }`}
                  onClick={() => handleAnswerClick(answer, index)}
                >
                  {answer}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center mt-8">
            <button
              className="p-2 bg-purple-500 text-white rounded-md"
              onClick={handleValidateAnswer}
              disabled={selectedAnswer === null || isAnswered}
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
