
import Marks from "../Models/marks.models.js";
import Student, { studentValidationSchema } from "../Models/student.models.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asynchandler } from "../Utils/asynchandler.js";

export const createStudent = asynchandler(async (req, res, next) => {
    try {
        // Validate the request body
        const { error, value } = studentValidationSchema.validate(req.body);

        if (error) {
            throw new ApiError(400, error.details[0].message);  // Corrected to use error.details
        }

        console.log("Validated value:", value);

        // Check if student with the same email already exists
        const isStudentPresent = await Student.findOne({ email: value?.email });

        if (isStudentPresent) {
            throw new ApiError(400, 'Student with this email already exists');
        }

        // Create new student record
        const student = new Student(value);
        await student.save();

        // Return success response
        return res.status(201).json(
            new ApiResponse(201, student, "Student created successfully")
        );
    } catch (error) {
        console.error("Error:", error);
        next(error)

    }
})
export const getStudent = asynchandler(async (req, res, next) => {

    const { pages, limits, email } = req.query

    const query = {};
    if (email) {
        query.email = new RegExp(email, "i");
    }

    try {
        const page = parseInt(pages) || 1;
        const limit = parseInt(limits) || 10;
        const skip = (page - 1) * limit;

        const [count, students] = await Promise.all([
            Student.countDocuments(query),
            Student.find(query).skip(skip).limit(limit)
        ]);

        const studens = {
            data: students,
            meta: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        }
        return res.status(200).json(
            new ApiResponse(200, studens, "Studens fetched succes.")
        );
    } catch (error) {
        next(error)
    }
})

export const getSingle = asynchandler(async (req, res, next) => {

    const { id } = req.query
    try {
        const [student, marks] = await Promise.all([
            Student.findById(id),
            Marks.find({ student_id: id })
        ]);
        if (!student) { throw new ApiError(404, "Student Not Found"); }

        return res.status(200).json(
            new ApiResponse(200, { ...student.toObject(), marks }, "Student fetched successfully ")
        );
    } catch (error) {
        next(error)
    }
})
export const updateStudent = asynchandler(async (req, res, next) => {

    const { id } = req.query

    if (!id) {
        throw new ApiError(404, 'Student not Found');
    }
    const { error, value } = studentValidationSchema.validate(req.body);

    if (error) {
        throw new ApiError(400, error.details[0].message);  // Corrected to use error.details
    }

    try {
        const student = await Student.findByIdAndUpdate(
            id,
            value,
            { new: true, runValidators: true }
        );
        if (!student) { throw new ApiError(404, "Student Not Found"); }

        return res.status(200).json(
            new ApiResponse(200, student, "Studens update succesfully.")
        );
    } catch (error) {
        next(error)
    }
})
export const deleteStudent = asynchandler(async (req, res, next) => {

    const { id } = req.query
    try {
        const student = await Student.findByIdAndDelete(id);
        if (!student) { throw new ApiError(404, "Student Not Found"); }

        await Marks.deleteMany({ student_id: id });
        // res.json({ message: 'Student and associated marks deleted' });
        return res.status(200).json(
            new ApiResponse(200, {}, 'Student and associated marks deleted')
        );
    } catch (error) {
        next(error)
    }
})







