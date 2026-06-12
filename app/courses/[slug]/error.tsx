"use client";

export default function CourseDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("🔴 FULL COURSE ERROR:", error);
  console.error("🔴 Error Stack:", error.stack);

  return (
    <div className="p-10 text-center">
      <h1 className="text-red-600 text-2xl font-bold mb-4">Server Error</h1>
      <p className="mb-6">Check the browser console for details.</p>
      <button 
        onClick={reset}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Try Again
      </button>
    </div>
  );
}