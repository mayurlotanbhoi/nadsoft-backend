
import { Types } from "mongoose";
import Marks from "../Models/marks.models.js";
import Student, { studentValidationSchema } from "../Models/student.models.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asynchandler } from "../Utils/asynchandler.js";


export const addMarks = asynchandler(async (req, res, next) => {
    try {
        const { marks, subject } = req.body;
        const { id } = req.query;


        if (!marks) {
            throw new ApiError(400, 'Marks are required');
        }
        if (!subject) {
            throw new ApiError(400, 'Subject is required');
        }
        if (!id) {
            throw new ApiError(400, 'Student ID is required');
        }


        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid student ID');
        }

        // Find student by ID
        const student = await Student.findById(id);
        if (!student) {
            throw new ApiError(400, 'Student not found');
        }


        const newMarks = new Marks({
            marks,
            subject,
            student_id: student._id,
        });
        await newMarks.save();

        return res.status(201).json(
            new ApiResponse(201, newMarks, 'Marks added successfully')
        );
    } catch (error) {
        console.error('Error adding marks:', error);
        next(error);
    }
});


export const updateMarks = asynchandler(async (req, res, next) => {
    try {
        const { id } = req.query;
        const { marks, subject } = req.body;


        if (!id) {
            throw new ApiError(400, 'Marks ID is required');
        }
        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid Marks ID');
        }


        if (marks === undefined) {
            throw new ApiError(400, 'Marks are required');
        }
        if (!subject) {
            throw new ApiError(400, 'Subject is required');
        }

        const updatedMarks = await Marks.findByIdAndUpdate(
            id,
            { marks, subject },
            { new: true, runValidators: true }
        );

        if (!updatedMarks) {
            throw new ApiError(404, 'Marks record not found');
        }

        return res.status(200).json(
            new ApiResponse(200, updatedMarks, 'Marks updated successfully')
        );
    } catch (error) {
        console.error('Error updating marks:', error);
        next(error);
    }
});

export const deleteMarks = asynchandler(async (req, res, next) => {
    try {
        const { id } = req.query;


        if (!id) {
            throw new ApiError(400, 'Marks ID is required');
        }
        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid Marks ID');
        }


        const deletedMarks = await Marks.findByIdAndDelete(id);

        if (!deletedMarks) {
            throw new ApiError(404, 'Marks record not found');
        }

        return res.status(200).json(
            new ApiResponse(200, {}, 'Marks deleted successfully')
        );
    } catch (error) {
        console.error('Error deleting marks:', error);
        next(error);
    }
});







