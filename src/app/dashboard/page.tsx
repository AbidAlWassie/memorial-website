// src/app/dashboard/page.tsx
import SessionWrapper from "@/components/client/SessionWrapper";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <SessionWrapper>
      <Dashboard />
    </SessionWrapper>
  );
}
