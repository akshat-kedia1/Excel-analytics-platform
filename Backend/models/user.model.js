import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: [true, 'First Name is required'],
            minlength: [3, 'First Name should be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last Name should be at least 3 characters long'],
        },
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        minlength: [5, 'Email should be at least 5 characters long'],
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false, // excluded by default in queries
    },
});

// 🔒 Generate JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '7d', // optional: add expiry for better control
    });
};

// 🔐 Compare password during login
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// 🔐 Hash password before saving or manually
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

// Optional: hash password before saving (can remove if handled manually)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
