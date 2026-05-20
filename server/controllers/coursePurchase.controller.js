import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontendUrl}/course-progress/${courseId}`, // once payment successful redirect to course progress page
      cancel_url: `${frontendUrl}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    // Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
    });
  } catch (error) {
    console.log(error);
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
  let event;

  try {
    /*const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);*/
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });

    const isPurchased = !!purchased;

    if (!isPurchased && course && Array.isArray(course.lectures)) {
      course.lectures = course.lectures.map((lecture) => {
        const safeLecture = lecture?.toObject ? lecture.toObject() : lecture;
        if (!safeLecture?.isPreviewFree) {
          safeLecture.videoUrl = undefined;
        }
        safeLecture.publicId = undefined;
        return safeLecture;
      });
    }

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: isPurchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};

export const freePurchase = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found!" });
    }

    // Check if already purchased/enrolled
    const alreadyPurchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });
    if (alreadyPurchased) {
      return res.status(400).json({ success: false, message: "You are already enrolled in this course." });
    }

    // Create completed purchase record (free)
    await CoursePurchase.create({
      courseId,
      userId,
      amount: course.coursePrice || 0,
      status: "completed",
      paymentId: `free_${Date.now()}`,
    });

    // Enroll user in the course
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );

    // Add user to course's enrolledStudents
    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: userId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Enrolled successfully!",
      courseId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Enrollment failed." });
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id;
    const role = req.user?.role;

    let query = { status: "completed" };

    if (role === "student") {
      query.userId = userId;
    }

    const purchasedCourse = await CoursePurchase.find(query).populate("courseId");

    const filteredByInstructor =
      role === "instructor"
        ? purchasedCourse.filter((p) =>
          p?.courseId?.creator?.toString() === userId?.toString()
        )
        : purchasedCourse;

    return res.status(200).json({
      purchasedCourse: filteredByInstructor,
    });
  } catch (error) {
    console.log(error);
  }
};
