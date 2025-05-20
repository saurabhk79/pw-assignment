import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("jwt_token", data.token);
        navigate("/");
      } else {
        console.error("Login failed:", data.message);
        alert(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An unexpected error occurred during login. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center gap-40 h-screen bg-gray-50">
      <div className="text-9xl mb-6 text-[#620000]">πSync</div>

      <div className="p-8 rounded-lg w-[400px] text-center">
        <h1 className="text-xl font-bold mb-6 text-[#620000]">
          PiSync Admin Dashboard
        </h1>

        <input
          type="text"
          placeholder="Enter username"
          className="w-full mb-3 p-2 border border-gray-300 rounded outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          className="w-full mb-3 p-2 border border-gray-300 rounded outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white py-2 w-full rounded hover:bg-gray-800"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
