// src/app/user/[id]/page.tsx
import SessionWrapper from "@/components/client/SessionWrapper";
import { notFound } from "next/navigation";
import Profile from "./profile";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    notFound();
  }

  console.log("Page: Rendering profile for user ID:", params.id);

  return (
    <SessionWrapper>
      <Profile userId={params.id} />
    </SessionWrapper>
  );
}
