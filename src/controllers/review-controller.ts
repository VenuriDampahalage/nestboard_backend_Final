import type { RequestHandler } from "express";
import * as svc from "../services/review-service.js";

export const createOrUpdate: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { propertyId } = req.params;

    const result = await svc.createOrUpdateReview(
      userId,
      String(propertyId),
      req.body
    );

    const statusCode = result.isEdit ? 200 : 201;
    const message = result.isEdit
      ? `Review updated successfully. You have ${result.remainingEdits} edit(s) remaining.`
      : "Review submitted successfully.";

    res.status(statusCode).json({
      message,
      review: result.review,
      remainingEdits: result.remainingEdits,
    });
  } catch (err) {
    next(err);
  }
};
