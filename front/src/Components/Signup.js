import React, { useState } from "react";

// import img1 from "../Image/img.jpeg";
import img1 from "../Image/bg.jpeg";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../Reducers/auth.js";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const { errorsignin, successsignin, errorsignup, successsignup } =
    useSelector((state) => state.user);

  const handleSignin = () => {
    navigate("/signin");
  };

  const handleSubmit = () => {
    dispatch(signupUser(formData));
  };

  return (
    <>
      <div className="signup_container flex w-full h-full fixed">
        <div className="left_side_content h-full flex w-1/2">
          <img src={img1} alt="signup" className="w-full h-full" />
        </div>

        <div className="right_side_content flex flex-col items-center justify-center w-1/2 bg-white p-8">
          <h2 className="text-xl font-semibold mb-4">Sign up to the Chat App</h2>
          <section className="w-full">
            <button className="flex items-center w-full py-2 px-4 border border-gray-700 rounded-lg mb-4">
              <FcGoogle className="mr-2" />
              Sign in with Google
            </button>
            <hr className="mb-4" />
            <span className="flex flex-col gap-2 w-full">
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

            <span className="flex flex-col gap-2 w-full">
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
            <span className="flex flex-col gap-2 w-full">
              <label className="font-semibold text-black">Password</label>
              <input
                type="text"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full py-2 px-4 border border-gray-700 rounded-md"
              />
            </span>
          </section>
          <button onClick={handleSubmit} className="mt-3 w-full py-2 px-4 border border-gray-700 rounded-lg bg-transparent text-black mb-4 hover:bg-red">
            Submit
          </button>

          <span className="w-full text-xs font-semibold text-black">
            Already a member :){" "}
            <strong onClick={() => handleSignin()} className="text-red-600 cursor-pointer hover:text-red-800">
              Sign in Now
            </strong>
          </span>
        </div>
      </div>
    </>
  );
};

export default Signup;
