import React, { useState } from "react";
import "./Auth.css";
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
      <div className="signup_container">
        <div className="left_side_content">
          <img src={img1} alt="signup" />
        </div>

        <div className="right_side_content">
          <h2>Sign up to the Chat App </h2>
          <section>
            <button>
              <FcGoogle />
              Sign in with Google
            </button>
            <hr />
            <span>
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </span>

            <span>
              <label>Email</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </span>
            <span>
              <label>Password</label>
              <input
                type="text"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </span>
          </section>
          <button onClick={handleSubmit}>Submit</button>

          <span>
            Already a member :){" "}
            <strong onClick={() => handleSignin()}>Sign in Now</strong>
          </span>
        </div>
      </div>
    </>
  );
};

export default Signup;
