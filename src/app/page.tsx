// src/app/page.tsx

import Link from "next/link";

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

export default async function Main() {
  try {
    const posts = await fetchPosts();

    return (
      <div className="container mx-auto px-4">
        <div className="mt-4">
          <h2 className="mb-2 text-2xl font-semibold">Posts:</h2>
          <ul className="editor-container space-y-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded-md border border-gray-700 p-4"
              >
                <h3 className="mb-2 text-3xl font-semibold">{post.title}</h3>

                <p className="text-sm text-gray-400">
                  By{" "}
                  <Link
                    href={`user/${post.user?.id}` || "Unknown"}
                    className="cursor-pointer text-blue-400"
                  >
                    {post.user?.name || "Unknown"}
                  </Link>
                </p>
                {/* <hr className="mb-2 mt-4 h-px border-0 bg-gray-200 dark:bg-gray-700" /> */}
                <hr className="mb-6 mt-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }} // Render HTML content
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-xl">Posts:</h2>
        <p className="text-red-500">
          Failed to load posts. Please try again later.
        </p>
      </div>
    );
  }
}
