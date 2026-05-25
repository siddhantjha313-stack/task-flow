import { Router } from "express";
import {
  addComment,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask
} from "../controllers/taskController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { taskSchemas } from "../validators/schemas.js";

const router = Router();

router.use(protect);

router.get("/", getTasks);
router.post("/", authorize("admin"), validate(taskSchemas.create), createTask);
router.get("/:id", getTaskById);
router.patch("/:id", validate(taskSchemas.update), updateTask);
router.delete("/:id", authorize("admin"), deleteTask);
router.post("/:id/comments", validate(taskSchemas.comment), addComment);

export default router;
