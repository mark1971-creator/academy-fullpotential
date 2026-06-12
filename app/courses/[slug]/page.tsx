import { notFound } from "next/navigation";

export default function CourseDetailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-600 mb-4">✅ TEST PAGE</h1>
        <p className="text-xl">If you see this, the route is working.</p>
        <p className="mt-8 text-sm text-gray-500">Human Potential Coach Certification should appear here soon.</p>
      </div>
    </div>
  );
}