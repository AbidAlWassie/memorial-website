// src/app/user/[id]/profile.tsx
"use client";
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

async function fetchUserPosts(userId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/users/${userId}/posts`;
  console.log("Client: Fetching posts from:", url);

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Client: Error response:", errorText);
      throw new Error(`Failed to fetch user posts: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Client: Fetched posts:", data.length);
    return data;
  } catch (error) {
    console.error("Client: Error in fetchUserPosts:", error);
    throw error;
  }
}

export default function Profile({ userId }: { userId: string }) {
  const { data: session, status } = useSession();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Client: Fetching posts for user ID:", userId);
        const posts = await fetchUserPosts(userId);
        setUserPosts(posts);
        if (posts.length > 0) {
          setUser(posts[0].user);
        }
        console.log("Client: Posts fetched successfully:", posts.length);
      } catch (error) {
        console.error("Client: Error fetching user posts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mt-4">
        <h2 className="mb-2 text-2xl font-semibold">
          {user ? `${user.name}'s Posts:` : "User Posts:"}
        </h2>
        <ul className="editor-container space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <li
                key={post.id}
                className="rounded-md border border-gray-700 p-4"
              >
                <div className="flex">
                  <h3 className="mb-2 text-3xl font-semibold">{post.title}</h3>
                  {session?.user?.email === user?.email && (
                    <div className="ml-auto">
                      <Link href={`/editPost/${post.id}`}>Edit</Link>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  By{" "}
                  <span className="cursor-pointer text-blue-400">
                    {user?.name || "Unknown"}
                  </span>
                </p>
                <hr className="mb-6 mt-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </li>
            ))
          ) : (
            <p className="text-gray-500">User has no posts yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
