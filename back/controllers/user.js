const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const JWT_SECRET = "djbdjbbbhdbh3y3";

const sendMail = (name, email, id) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "atreyrachit23@gmail.com",
        pass: "mqxp dbmz hjmn tpnx",
      },
    });

    const mailOptions = {
      from: "atreyrachit23@gmail.com",
      to: email,
      subject: "Verify your Email",
      html: `<p>Press <a href="http://localhost:4000/users/verify/${id}">verify</a></p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
      } else {
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.signup = async (req, res) => {
  try {
    console.log(req.body);

    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long",
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        error: "Password must contain at least one uppercase letter",
      });
    }

    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(password)) {
      return res.status(400).json({
        success: false,
        error: "Password must contain at least one special symbol",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
      verified: true,
      //update it later
    });

    await newUser.save();

    if (newUser) {
      // sendMail(newUser.username, newUser.email, newUser._id);
      res.status(200).json({
        success: true,
        message: "Email send, Check your Email :) ",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Try again creating account",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while registering the user",
    });
  }
};

exports.verify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
      user.verified = true;
      await user.save();
      res.redirect("http://localhost:3000/signin");
    } else {
      console.log("Invalid user or expired verification token.");
      res.redirect("http://localhost:3000/");
    }
  } catch (error) {
    console.error(error);

    res.redirect("http://localhost:3000/signin");
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userverify = await User.findOne({
      email: email,
    });

    if (!userverify) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (!userverify.verified) {
      return res
        .status(401)
        .json({ success: false, error: "Please verify yourself" });
    }

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({ success: true, message: "User signed in successfully", token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "An error occurred while signing in" });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.send({ data: users, success: true });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.userInformation = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
   console.log("user",user);
    res.status(200).json({ data: user, success: true });
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const client = new OAuth2Client(googleClientId);

// exports.googleSignin = async (req, res) => {
//   try {
//     const { idToken } = req.body;

//     // Verify Google ID token
//     const ticket = await client.verifyIdToken({
//       idToken,
//       audience: googleClientId,
//     });

//     const { email, sub } = ticket.getPayload();

//     // Check if the user's email exists in the database
//     const user = await User.findOne({ email });

//     if (!user) {
//       // You might want to handle this case, maybe create a new user
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Generate a token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res
//       .status(200)
//       .json({ message: "User signed in with Google successfully", token });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "An error occurred while signing in with Google" });
//     console.error(error);
//   }
// };
