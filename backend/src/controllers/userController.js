const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../middleware/auth");
const {generateAuthToken}= require("../models/User.js");
const cookies = require("universal-cookie");
const nodemailer = require("nodemailer");

// Register a new user
exports.register = async (req, res) => {
  try {
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ message: "User registered successfully", user, token });
  } catch (error) {
      if (error.code === 11000) {
          // Handle duplicate key error
          res.status(400).send({ error: "Username or email already exists" });
      } else {
          // Handle other errors
          res.status(400).send({ error: error.message });
      }
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send({ error: "Login failed: user not found." });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .send({ error: "Login failed: incorrect password." });
    }

    const token = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET
    );
    //res.cookie('TOKEN', token, { httpOnly: true });
    res.send({ message: "User logged in successfully", user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.TOKEN;
    const userId = req.cookies.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(401).send({ error: "Invalid credentials" });
    }
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenData) {
      return res.status(401).send({ error: "Invalid token" });
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { tokens: [] } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(401).send({ error: "Invalid user" });
    }
    res.clearCookie("TOKEN");
    res.clearCookie("userId");
    res.send({ message: "User logged out successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update user needs to updated to take token in consideration
exports.updateUser = async (req, res) => {
  // Extracting the username and other update fields from the request body
  const { username, email, phoneNumber } = req.body;

  try {
    // Validate email
    if (email && !email.includes("@")) {
      return res.status(400).send({ error: "Invalid email format" });
    }

    // Validate phone number
    if (phoneNumber && !phoneNumber.match(/^\d{10,}$/)) {
      return res
        .status(400)
        .send({ error: "Phone number must be more than 10 digits" });
    }

    // Find the user with the given username
    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // // Check if the authenticated user matches the user being updated
    // if (req.user.token !== req.user.token) {
    //     return res.status(401).send({ error: 'Unauthorized: You are not allowed to update this user' });
    // }

    // Update the user's information
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    // Save the user to the database
    await user.save();

    // Return the updated user
    res.send({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).send({ error: "Update failed", details: error.message });
  }
};

// Get user profile by userId
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from URL parameters
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const profile = {
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    res.send(profile);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the profile." });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send email logic using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "a.alholaiel@gmail.com",        
        pass: "wxwb xvsw zmbk pvri",
        clientId:
          "675652664769-h04gj7uu9kvtgg5u4adtsph1dk9j08uo.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken:
          "1//04h-0XMuDAQnCCgYIARAAGAQSNwF-L9IroFr7HWdMUGjfyertqnrLcIYe1bpQpR7K8VsvJngX8wTU4OCdB9pajF77ux1gimuVKm0",
      },
    });
    const mailOptions = {
      from: '"SPMS" <albertcatsby@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Password Reset", // Subject line
      text: `Please use the following token to reset your password: ${token}`, // plain text body
      html: `<b>Please use the following token to reset your password: ${token}</b>`, // html body
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });
    res.send({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Error sending email: ", err);
    res.status(500).send({ error: "Error sending password reset email" });
  }
};

exports.resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded._id });
  
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 8);
      user.password = hashedPassword;
      await user.save();
  
      res.send({ message: "Password reset successfully" });
    } catch (error) {
      res.status(400).send({ error: "Error resetting password" });
    }
  };
  