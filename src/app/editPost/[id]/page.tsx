import SessionWrapper from "@/components/client/SessionWrapper";
import EditPostForm from "./editPost";

export default async function EditPostPage() {
  return (
    <SessionWrapper>
      <EditPostForm />
    </SessionWrapper>
  );
}
