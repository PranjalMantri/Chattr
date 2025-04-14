import { Router } from "express";

import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import {
  createUserSchema,
  loginUserSchema,
  updateProfileSchema,
} from "../schemas/user.schema.ts";
import { validateResource } from "../middlwares/validateResource.middleware.ts";
import { protectedRoute } from "../middlwares/auth.middleware.ts";

const router = Router();

router.post("/signup", validateResource(createUserSchema), signup);
router.post("/login", validateResource(loginUserSchema), login);
router.get("/logout", protectedRoute, logout);

router.put(
  "update-profile",
  protectedRoute,
  validateResource(updateProfileSchema),
  updateProfile
);

router.get("/check", protectedRoute, checkAuth);

export default router;
