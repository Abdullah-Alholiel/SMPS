const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator'); // Add this to use validators

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Removes whitespace from both ends of a string
        minlength: 3, // Ensures username has at least 3 characters
        validate: [validator.isAlphanumeric, 'Username must contain only letters and numbers']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email format'] // Validates email format
    },
    password: {
        type: String,
        required: true,
        minlength: 3 // Sets a minimum length for the password
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: [validator.isMobilePhone, 'Invalid phone number'] // Validates phone number format
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true });

// Hashing the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // Generate a new salt for each password hash
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Generating an auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
