const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
     tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
     ]
     
    // Include any other user fields you need
}, { timestamps: true });

// Hashing the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Generating auth token
userSchema.methods.generateAuthToken = async function () {
    return jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
};

// Update the generateAuthToken method
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
