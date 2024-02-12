import React, { useEffect, useState } from "react";
import img1 from "../Image/bg.jpeg";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useDispatch ,useSelector} from "react-redux";
import { signinUser } from "../Reducers/auth.js";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const { successsignin } = useSelector((state) => state.user);

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

  useEffect(()=>{
   if(successsignin)
   navigate('/dash');
  },[successsignin])

  return (
    <>
      <div className="flex w-screen h-screen">
        <div className=" h-full flex w-1/2">
          <img src={img1} alt="signup" className="w-full h-full" />
        </div>

        <div className=" flex flex-col items-center justify-center w-1/2 bg-white p-8">
          <h2 className="text-xl font-semibold mb-4">Sign in to the Chat App</h2>
          <section className="w-full">
            <button className="flex items-center w-full py-2 px-4 border border-gray-700 rounded-lg mb-4">
              <FcGoogle className="mr-2" />
              Sign in with Google
            </button>
            <hr className="mb-4" />

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
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full py-2 px-4 border border-gray-700 rounded-md"
              />
            </span>
          </section>
          <button onClick={handleSubmit} className="w-full py-2 px-4 border border-gray-700 rounded-lg bg-transparent text-black mb-4">
            Submit
          </button>

          <span className="w-full text-xs font-semibold text-black">
            Not a Member?{" "}
            <strong onClick={() => handleSignin()} className="text-red-600 cursor-pointer hover:text-red-800">
              Signup Now
            </strong>
          </span>
        </div>
      </div>
    </>
  );
};

export default Signup;
