import { Router } from "express";

import { signup, login, logout } from "../controllers/auth.controller.js";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema.ts";
import { validateResource } from "../middlwares/validateResource.ts";

const router = Router();

router.post("/signup", validateResource(createUserSchema), signup);

router.post("/login", validateResource(loginUserSchema), login);

router.post("/logout", logout);

export default router;
