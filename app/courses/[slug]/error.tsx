"use client";

export default function CourseDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("🔴 === FULL ERROR BOUNDARY TRIGGERED ===", error);
  console.error("🔴 Error Name:", error.name);
  console.error("🔴 Error Message:", error.message);
  console.error("🔴 Error Stack:", error.stack);
  console.error("🔴 Digest:", error.digest);

  return (
    <div className="p-12 text-center max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Server Error Occurred</h1>
      <p className="mb-8 text-lg">Check the browser console for full details.</p>
      <button 
        onClick={reset}
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-medium"
      >
        Try Again
      </button>
    </div>
  );
}