"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

async function fetchPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${baseUrl}/api/getPost`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

export default function Dashboard() {
  const { data: session, status } = useSession(); // Get the session
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = session?.user?.email;

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const posts = await fetchPosts();
        const filteredPosts = posts.filter(
          (post) => post.user?.email === userEmail,
        );
        setUserPosts(filteredPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchUserPosts();
    }
  }, [userEmail]);

  // Handle the loading states for session and posts
  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to see your posts.</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mt-4">
        <h2 className="mb-2 text-2xl font-semibold">Your Posts:</h2>
        <ul className="editor-container space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <li
                key={post.id}
                className="rounded-md border border-gray-700 p-4"
              >
                <h3 className="mb-2 text-3xl font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-400">
                  By{" "}
                  <span className="cursor-pointer text-blue-400">
                    {post.user?.name || "Unknown"}
                  </span>
                </p>
                <hr className="mb-6 mt-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
                <div dangerouslySetInnerHTML={{ __html: post.content }} />{" "}
                {/* Render HTML content */}
              </li>
            ))
          ) : (
            <p className="text-gray-500">You havent created any posts yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
