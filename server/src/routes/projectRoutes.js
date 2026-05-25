import { Router } from "express";
import {
  createProject,
  deleteProject,
  getDashboard,
  getProjectById,
  getProjects,
  updateProject
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { projectSchemas } from "../validators/schemas.js";

const router = Router();

router.use(protect);

router.get("/dashboard", getDashboard);
router.get("/", getProjects);
router.post("/", authorize("admin"), validate(projectSchemas.create), createProject);
router.get("/:id", getProjectById);
router.patch("/:id", authorize("admin"), validate(projectSchemas.update), updateProject);
router.delete("/:id", authorize("admin"), deleteProject);

export default router;
