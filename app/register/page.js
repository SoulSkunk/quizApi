"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  const [pseudo, setPseudo] = useState("");

  const handleRegister = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pseudo: pseudo, score: parseInt(score, 10) }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(`Error: ${errorData.message}`);
      return;
    }

    const data = await res.json();
    if (data.result) {
      alert("Score enregistré avec succès!");
      // Redirige vers la page leaderboard
      router.push(`/leaderboard`);
    } else {
      alert("Erreur lors de l'enregistrement du score.");
    }
  };

  return (
    <div className="min-h-screen flex mt-20 justify-center">
      <div className="p-8 rounded-lg text-center">
        <h1 className="text-4xl font-bold mb-4">
          Bravo ! Vous avez eu{" "}
          <span className="bg-purple-500 p-1">{score}/10 </span>
        </h1>
        <div className="flex mt-32 items-center justify-center space-x-4">
          <p className="text-lg">J'enregistre mon score</p>
          <input
            type="text"
            placeholder="pseudo"
            className="ml-4 p-2 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <button
            className="bg-purple-500 text-white p-2 rounded-lg"
            onClick={handleRegister}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
