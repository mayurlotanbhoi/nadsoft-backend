import { Router } from "express";
import { createStudent, deleteStudent, getSingle, getStudent, updateStudent } from "../Controllers/sudent.controller.js";

const router = Router()


router.route("/students-Create").post(createStudent)
router.route("/students-get").get(getStudent)
router.route("/students-get-single").get(getSingle)
router.route("/students-update").put(updateStudent)
router.route("/students-delete").delete(deleteStudent)



export default router