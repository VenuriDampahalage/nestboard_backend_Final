import { Router } from "express";
import { z } from "zod";
import { Role } from "../generated/enums.js";
import { verifyJwt, requireRole } from "../middleware/auth.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { createReviewSchema } from "../schemas/review.js";
import * as ctrl from "../controllers/review-controller.js";

export const reviewsRouter: Router = Router();

// Apply JWT authentication middleware
reviewsRouter.use(verifyJwt);

// Validate propertyId parameter format
const propertyParam = z.object({
  propertyId: z.string().uuid("Invalid property ID format"),
});

// POST /properties/:propertyId/reviews
reviewsRouter.post(
  "/properties/:propertyId/reviews",
  requireRole(Role.USER),
  validateParams(propertyParam),
  validateBody(createReviewSchema),
  ctrl.createOrUpdate
);
