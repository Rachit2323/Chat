

import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useDispatch ,useSelector } from "react-redux";
import img1 from "../Image/bg.jpeg";
import { signupUser } from "../Reducers/auth.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 
  const { errorsignup,successsignup } = useSelector((state) => state.user);

  useEffect(() => {
    if (!successsignup&&errorsignup) {

      toast.error(errorsignup);
      // dispatch(signupUser(formData));
    }
  }, [successsignup,errorsignup]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    dispatch(signupUser(formData));
  };

  const handleSignin = () => {
    navigate("/signin");
  };

  return (
    <div className="signup_container flex flex-col md:flex-row w-full h-screen fixed overflow-auto">
      <div className="left_side_content md:w-1/2 h-full">
        <img src={img1} alt="signup" className="w-full h-full object-cover" />
      </div>

      <div className="right_side_content md:w-1/2 bg-white p-8 flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-4">Sign up to the Chat App</h2>
        <section className="w-full">
          <button className="flex items-center justify-center w-full py-2 px-4 border border-gray-700 rounded-lg">
            <FcGoogle className="mr-2" />
            Sign in with Google
          </button>

          <hr className="mb-4" />
          <span className="flex flex-col gap-2">
            <label className="font-semibold text-black">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full py-2 px-4 border border-gray-700 rounded-md"
            />
          </span>

          <span className="flex flex-col gap-2">
            <label className="font-semibold text-black">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full py-2 px-4 border border-gray-700 rounded-md"
            />
          </span>
          <span className="flex flex-col gap-2">
            <label className="font-semibold text-black">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full py-2 px-4 border border-gray-700 rounded-md"
            />
          </span>
        </section>
        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 mt-4 border border-gray-700 rounded-lg bg-transparent text-black mb-4 hover:bg-red-500 hover:text-white"
        >
          Submit
        </button>

        <span className="w-full text-xs font-semibold text-black">
          Already a member :){" "}
          <strong
            onClick={handleSignin}
            className="text-red-600 cursor-pointer hover:text-red-800"
          >
            Sign in Now
          </strong>
        </span>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
