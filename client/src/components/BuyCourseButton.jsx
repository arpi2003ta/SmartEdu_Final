import React, { useState } from "react";
import { Button } from "./ui/button";
import { useFreeEnrollMutation } from "@/features/api/purchaseApi";
import { Loader2, ShoppingCart, CheckCircle2, GraduationCap, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BuyCourseButton = ({ courseId, courseTitle, coursePrice }) => {
  const [freeEnroll, { isLoading }] = useFreeEnrollMutation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handlePurchase = async () => {
    try {
      const result = await freeEnroll(courseId).unwrap();
      setShowModal(false);
      toast.success("🎉 Enrolled successfully! Happy learning!", {
        duration: 3000,
      });
      // Small delay so toast is visible before navigating
      setTimeout(() => {
        navigate(`/course-progress/${courseId}`);
      }, 800);
    } catch (err) {
      setShowModal(false);
      const msg = err?.data?.message || "Enrollment failed. Please try again.";
      toast.error(msg);
    }
  };

  const displayPrice = coursePrice
    ? `₹${coursePrice.toLocaleString("en-IN")}`
    : "Free";

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setShowModal(true)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-5 rounded-xl shadow-md transition-all"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Purchase Course · {displayPrice}
      </Button>

      {/* Confirmation Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-orange-500" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1">
              Confirm Enrollment
            </h2>
            {courseTitle && (
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4 px-4">
                {courseTitle}
              </p>
            )}

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 mb-5 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Course Price
              </span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {displayPrice}
              </span>
            </div>

            <div className="flex items-start gap-2 mb-5 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Instant access to all lectures. Learn at your own pace.</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                onClick={handlePurchase}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Enroll Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyCourseButton;

