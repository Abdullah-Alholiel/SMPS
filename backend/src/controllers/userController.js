const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../middleware/auth');
const cookies = require('universal-cookie');

// Register a new user
exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ message: 'User registered successfully', user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send({ error: 'Login failed: user not found.' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).send({ error: 'Login failed: incorrect password.' });
        }

        const token = jwt.sign({ _id: user._id.toString(), role: user.role }, process.env.JWT_SECRET);
        //res.cookie('TOKEN', token, { httpOnly: true });
        res.send({ message: 'User logged in successfully', user, token });
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
          return res.status(401).send({ error: 'Invalid credentials' });
        }
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenData) {
          return res.status(401).send({ error: 'Invalid token' });
        }
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { tokens: [] } }, { new: true });
        if (!updatedUser) {
          return res.status(401).send({ error: 'Invalid user' });
        }
        res.clearCookie('TOKEN');
        res.clearCookie('userId');
        res.send({ message: 'User logged out successfully' });
      } catch (error) {
        res.status(400).send(error);
      }
};


// Update user needs to updated to take token in consideration
exports.updateUser = async (req, res) => {
    // Extracting the username and other update fields from the request body
    const { username, email,  phoneNumber } = req.body;

    try {
        // Validate email
        if (email && !email.includes('@')) {
            return res.status(400).send({ error: 'Invalid email format' });
        }


        // Validate phone number
        if (phoneNumber && !phoneNumber.match(/^\d{10,}$/)) {
            return res.status(400).send({ error: 'Phone number must be more than 10 digits' });
        }

        // Find the user with the given username
        const user = await User.findOne({ username });

        // Check if the user exists
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
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
        res.send({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).send({ error: 'Update failed', details: error.message });
    }
};

// Get user profile by userId
exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.userId; // Get userId from URL parameters
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const profile = {
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
        };
        res.send(profile);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching the profile.' });
    }
};

