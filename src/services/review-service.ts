import { prisma } from "../lib/prisma.js";
import { Errors } from "../lib/errors.js";
import { BookingStatus } from "../generated/enums.js";
import type { CreateReviewInput } from "../schemas/review.js";

const MAX_EDIT_ATTEMPTS = 3;

/* Verifies that the tenant has a CONFIRMED booking for a room in this property */

async function verifyUserBooking(
  tenantId: string,
  propertyId: string,
  bookingId: string
): Promise<boolean> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      tenantId: tenantId,
      bookingStatus: BookingStatus.CONFIRMED,
      room: {
        roomType: {
          propertyId: propertyId,
        },
      },
    },
    select: { id: true },
  });
  return !!booking;
}

/* Handles review creation & replacement with max 3 edit attempts. */

export async function createOrUpdateReview(
  userId: string,
  propertyId: string,
  input: CreateReviewInput
) {
  // 1. Security Check: Verify confirmed booking
  const hasValidBooking = await verifyUserBooking(
    userId,
    propertyId,
    input.bookingId
  );

  if (!hasValidBooking) {
    throw Errors.forbidden(
      "You can only review properties where you have a confirmed booking."
    );
  }

  // 2. Check if a review already exists for this tenant & property
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_propertyId: { userId, propertyId },
    },
  });

  // CASE A: User is EDITING an existing review
  if (existingReview) {
    // Block if max 3 edit attempts reached
    if (existingReview.editCount >= MAX_EDIT_ATTEMPTS) {
      throw Errors.forbidden(
        `Maximum edit limit reached. You cannot edit this review more than ${MAX_EDIT_ATTEMPTS} times.`
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id: existingReview.id },
      data: {
        rating: input.rating,
        comment: input.comment ?? null,
        bookingId: input.bookingId,
        editCount: { increment: 1 }, // Increments edit_count by +1
      },
    });

    const remainingEdits = MAX_EDIT_ATTEMPTS - updatedReview.editCount;

    return {
      isEdit: true,
      review: updatedReview,
      remainingEdits,
    };
  }

  // CASE B: Initial Review Submission

  const newReview = await prisma.review.create({
    data: {
      userId,
      propertyId,
      bookingId: input.bookingId,
      rating: input.rating,
      comment: input.comment ?? null,
      editCount: 0,
    },
  });

  return {
    isEdit: false,
    review: newReview,
    remainingEdits: MAX_EDIT_ATTEMPTS,
  };
}
