import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { setAuthUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [inputdata, setInputdata] = useState({});
  const handleInput = (e) => {
    setInputdata({
      ...inputdata,
      [e.target.id]: e.target.value,
    });
  };
  console.log(inputdata);

  const selectgender = (selected) => {
    setInputdata((prev) => ({
      ...prev,
      gender: selected === inputdata.gender ? "" : selected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (inputdata.password !== inputdata.conformpassword.toLowerCase()) {
      setLoading(false);
      return toast.error("Password Does't Match");
    }
    try {
      const register = await axios.post("/api/auth/register", inputdata);
      const data = register.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
      }
      // toast.success(data?.message);
      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding background-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          <span className="text-gray-950">chatss</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="text-start">
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">
                fullname:
              </span>
            </label>
            <input
              onChange={handleInput}
              id="fullname"
              type="text"
              placeholder="Enter your fullname"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div className="text-start">
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">
                username:
              </span>
            </label>
            <input
              onChange={handleInput}
              id="username"
              type="text"
              placeholder="Enter your username"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div className="text-start">
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">
                Email:
              </span>
            </label>
            <input
              onChange={handleInput}
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div className="text-start">
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">
                Password:
              </span>
            </label>
            <input
              onChange={handleInput}
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div className="text-start">
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">
                Conf.Password:
              </span>
            </label>
            <input
              onChange={handleInput}
              id="conformpassword"
              type="text"
              placeholder="Enter your conform password"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          {/* {loading && <div className="loader">Loading...</div>} */}
          <div id="gender" className="flex ">
            <label className="cursor-pointer label flex gap-2">
              <span className="labek-text font-semibold text-gray-950">
                male
              </span>
              <input
                type="checkbox"
                className="checkbox checkex-info"
                onChange={() => selectgender("male")}
                checked={inputdata.gender === "male"}
              />
            </label>
            <label className="cursor-pointer label flex gap-2">
              <span className="labek-text font-semibold text-gray-950">
                female
              </span>
              <input
                type="checkbox"
                className="checkbox checkex-info"
                onChange={() => selectgender("female")}
                checked={inputdata.gender === "female"}
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 self-center w-auto px-2 py-1 bg-gray-950 hover:bg-gray-900 text-lg text-white rounded-lg hover:scale-105"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "loading.." : "Register"}
          </button>
        </form>
        <div className="pt-2 ">
          <p className="text-sm font-semibold text-gray-800">
            Don't have an Account?{" "}
            <Link to={"/register"}>
              <span className="text-gray-950 font-bold underline cursor-pointer hover:text-gray-950">
                Register Now
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
