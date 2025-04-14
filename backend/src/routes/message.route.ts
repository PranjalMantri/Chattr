import { Router } from "express";

import { protectedRoute } from "../middlwares/auth.middleware.ts";
import {
  getAllUsers,
  getMessages,
  sendMessage,
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

router.post("/send/:id", protectedRoute, sendMessage);

export default router;
