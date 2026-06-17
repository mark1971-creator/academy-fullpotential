import { redirect } from "next/navigation";

import { MY_LEARNING_URL } from "@/lib/clerk/routes";

export default function DashboardPage() {
  redirect(MY_LEARNING_URL);
}
