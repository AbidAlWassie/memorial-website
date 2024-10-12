"use client";

import { Button, Editor } from "@/components";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlinePostAdd } from "react-icons/md";

export default function EditPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("<p>Loading content...</p>");
  const { id } = useParams(); // Get the post ID from the URL params
  const router = useRouter();
  const { data: session, status } = useSession();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Highlight.configure({ multicolor: true }),
      Link,
    ],
    content, // Set the fetched content
    immediatelyRender: false,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/getPostById?id=${id}`);
        const postData = await response.json();

        setTitle(postData.title);

        if (editor) {
          // Set the editor content after the editor is fully initialized
          editor.commands.setContent(postData.content);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    // Only fetch the post and set content after the editor is initialized
    if (editor) {
      fetchPost();
    }
  }, [id, editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "authenticated" && session?.user?.email) {
      try {
        const response = await fetch(`/api/updatePost`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            title,
            content: editor?.getHTML(),
            userEmail: session.user.email, // Ensure only the post owner can update
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update post");
        }

        router.push("/"); // Redirect after successful update
      } catch (error) {
        console.error("Error updating post:", error);
      }
    } else {
      console.error("User email not found.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <div className="mb-6 flex flex-col">
        <label htmlFor="title" className="text-xl font-semibold">
          Title:
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Enter the title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-2 rounded-md border border-gray-700 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div className="my-6">
        <Editor editor={editor} />
      </div>
      <Button
        text="Update Post"
        place="end"
        size="large"
        color="primary"
        type="submit"
        icon={<MdOutlinePostAdd />}
        onClick={() => console.log("Button clicked!")}
      />
    </form>
  );
}
