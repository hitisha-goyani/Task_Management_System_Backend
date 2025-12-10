import express from "express";

import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import TaskController from "../controllers/TaskController.js";
import TaskValidation from "../validations/taskValidation.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// All routes require login
router.use(auth);


// ADD TASK
router.post("/add",validate(TaskValidation.TaskValidation),authorize("admin", "user"),TaskController.addTask);


// USER  own tasks
// ADMIN all tasks
router.get("/myTasks",authorize("admin", "user"),TaskController.getMyTasks);


// UPDATE TASK

router.patch("/update/:id",validate(TaskValidation.updateTask),authorize("admin", "user"),TaskController.updateTask);

//  ADMIN ONLY

router.get("/stats",authorize("admin"),TaskController.taskStats);

export default router;
