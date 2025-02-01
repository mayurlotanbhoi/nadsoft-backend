import mongoose, { Schema } from 'mongoose';

const markSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subject: { type: String, required: true },
    marks: {
        type: Number,
        required: true,
        min: [0, 'Marks cannot be negative'],
        max: [100, 'Marks cannot exceed 100']
    },

}, {
    timestamps: true
});

export default mongoose.model('Mark', markSchema);