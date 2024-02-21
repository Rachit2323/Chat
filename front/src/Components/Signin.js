import React, { useEffect, useState } from "react";
import img1 from "../Image/bg.jpeg";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signinUser } from "../Reducers/auth.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { errorsignin, successsignin } = useSelector((state) => state.user);

  useEffect(() => {
    if (!successsignin && errorsignin) {

      toast.error(errorsignin);
      dispatch(signinUser(formData));
    }
  }, [successsignin, errorsignin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignin = () => {
    navigate("/");
  };

  const handleSubmit = () => {
    dispatch(signinUser(formData));
  };

  useEffect(() => {
    if (successsignin) {
      navigate("/dash");
    }
  }, [successsignin]);

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen">
      <div className="lg:w-1/2 relative">
        <img src={img1} alt="signup" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-25"></div>
      </div>

      <div className="lg:w-1/2 bg-white p-8 flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-4">Sign in to the Chat App</h2>
        <section className="w-full">
          <div className="mb-6">
            <button className="flex items-center justify-center w-full py-2 px-4 border border-gray-700 rounded-lg">
              <FcGoogle className="mr-2" />
              Sign in with Google
            </button>
          </div>
          <hr className="mb-4" />

          <div className="mb-4">
            <label className="font-semibold text-black">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full py-2 px-4 border border-gray-700 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-black">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full py-2 px-4 border border-gray-700 rounded-md"
            />
          </div>
        </section>
        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 border border-gray-700 rounded-lg bg-transparent text-black mb-4 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white active:bg-red-500 active:text-white transition-colors duration-300"
        >
          Submit
        </button>

        <span className="text-center text-xs font-semibold text-black">
          Not a Member?{" "}
          <strong
            onClick={() => handleSignin()}
            className="text-red-600 cursor-pointer hover:text-red-800"
          >
            Signup Now
          </strong>
        </span>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signin;
