import { Router } from "express";

import { protectedRoute } from "../middlwares/auth.middleware.ts";
import {
  getAllUsers,
  getMessages,
} from "../controllers/messages.controller.ts";
import { validateResource } from "../middlwares/validateResource.middleware.ts";
import { getMessagesSchema } from "../schemas/messages.schema.ts";

const router = Router();

router.get("/users", protectedRoute, getAllUsers);
router.get(
  "/:id",
  protectedRoute,
  validateResource(getMessagesSchema),
  getMessages
);

export default router;
