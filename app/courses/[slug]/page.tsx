import { notFound } from "next/navigation";

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;

  // Hardcoded course data for testing
  const course = {
    id: "test-id",
    title: "Certification – Human Potential Development Coach Training",
    description: "This is a test. If you see this, the page UI works.",
    slug: "human-potential-coach-certification",
    modules: [
      {
        id: "m1",
        title: "Module 1: Authentic introductions",
        sort_order: 1,
        lessons: [
          { id: "l1", title: "Getting to know each other", youtube_url: "https://youtu.be/2XXFEndXKhE", sort_order: 1 }
        ]
      }
    ]
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">✅ Page is rendering!</h1>
      <h2 className="text-2xl mb-6">{course.title}</h2>
      <p className="text-lg mb-8">{course.description}</p>
      
      <h3 className="text-xl font-semibold mb-4">Modules:</h3>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(course.modules, null, 2)}
      </pre>
    </div>
  );
}