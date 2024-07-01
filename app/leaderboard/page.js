"use client";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        if (!data.error) {
          setUsers(data.users);
        } else {
          console.error("Error fetching users:", data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Leaderboard</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Pseudo</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{user.pseudo}</td>
                  <td className="px-4 py-2 bg-purple-500">{user.score}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
