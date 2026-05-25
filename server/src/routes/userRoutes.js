import { Router } from "express";
import {
  deleteUser,
  getTeam,
  inviteUser,
  updateUserRole
} from "../controllers/userController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { userSchemas } from "../validators/schemas.js";

const router = Router();

router.use(protect);

router.get("/", getTeam);
router.post("/invite", authorize("admin"), validate(userSchemas.invite), inviteUser);
router.patch("/:id", authorize("admin"), validate(userSchemas.updateRole), updateUserRole);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
