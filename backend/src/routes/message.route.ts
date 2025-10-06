import { Router } from "express";

import { protectedRoute } from "../middlwares/auth.middleware.js";
import {
  getAllUsers,
  getMessages,
  sendMessage,
} from "../controllers/messages.controller.js";
import { validateResource } from "../middlwares/validateResource.middleware.js";
import { getMessagesSchema } from "../schemas/messages.schema.js";

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
