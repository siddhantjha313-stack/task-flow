import { Router } from "express";
import { getMe, login, signup, updateMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { authSchemas } from "../validators/schemas.js";

const router = Router();

router.post("/signup", validate(authSchemas.signup), signup);
router.post("/login", validate(authSchemas.login), login);
router.get("/me", protect, getMe);
router.patch("/me", protect, validate(authSchemas.profile), updateMe);

export default router;
