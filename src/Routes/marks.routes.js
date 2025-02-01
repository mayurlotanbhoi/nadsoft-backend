import { Router } from "express";
import { addMarks, deleteMarks, updateMarks } from "../Controllers/marks.controller.js";

const router = Router()


router.route("/students-addmarks").post(addMarks)
// router.route("/students-get").get(getStudent)
// router.route("/students-get-single").get(getSingle)
router.route("/marks-update").put(updateMarks)
router.route("/marks-delete").delete(deleteMarks)



export default router