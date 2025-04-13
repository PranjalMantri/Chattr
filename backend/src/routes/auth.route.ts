import { Router } from "express";

import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema.ts";
import { validateResource } from "../middlwares/validateResource.middleware.ts";
import { protectedRoute } from "../middlwares/auth.middleware.ts";

const router = Router();

router.post("/signup", validateResource(createUserSchema), signup);
router.post("/login", validateResource(loginUserSchema), login);
router.post("/logout", logout);

router.put("update-profile", protectedRoute, updateProfile);

export default router;
