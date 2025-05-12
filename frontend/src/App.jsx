import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./login/Login";
import { Route, Routes } from "react-router-dom";
import Register from "./register/Register";
import Home from "./home/Home.jsx";
import { VerifyUser } from "./utils/VerifyUser";

function App() {
  return (
    <>
      <div className="p-2 w-screen h-screen flex items-center justify-center">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<VerifyUser />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
}

export default App;
