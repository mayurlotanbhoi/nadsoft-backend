
import Joi from 'joi';
import mongoose, { Schema } from 'mongoose';

const studentSchema = new Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    phone: { type: String },

}, { timestamps: true });


const studentValidationSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Name is required.',
            'string.min': 'Name must be at least 3 characters long.',
            'string.max': 'Name cannot exceed 50 characters.'
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } }) // Validates email format
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Invalid email format. Please enter a valid email.'
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/) // Ensures 10-digit phone number
        .optional()
        .messages({
            'string.pattern.base': 'Phone number must be exactly 10 digits.'
        }),


});

export { studentValidationSchema }
export default mongoose.model('Student', studentSchema);

