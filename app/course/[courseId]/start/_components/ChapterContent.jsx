import React from "react";
import YouTube from "react-youtube";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from 'next/link'; // if you're using Next.js

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: 0,
  },
};

function ChapterContent({ chapter, content }) {
  console.log('Contents prop:', content);
  console.log('Chapter prop:', chapter);
  
  // Parse the JSON content if it's a string
  let parsedContent = null;
  if (content?.content) {
    try {
      parsedContent = typeof content.content === 'string'
        ? JSON.parse(content.content)
        : content.content;
    } catch (error) {
      console.error("Failed to parse content:", error);
    }
  }

  const courseId = chapter?.courseId;

  return (
    <div className="p-10">
      <h2 className="font-medium text-2xl">{chapter?.name}</h2>
      <p className="text-gray-500">{chapter?.about}</p>
      
      <div className="flex justify-center my-6">
        <YouTube videoId={content?.videoId} opts={opts} />
      </div>
      
      {/* Display the chapter and topic info */}
      {parsedContent && (
        <div className="mb-4">
          <h3 className="font-medium text-xl text-green-600">Topic: {parsedContent.topic}</h3>
          {parsedContent.chapter && (
            <h4 className="font-medium text-lg mb-6">{parsedContent.chapter}</h4>
          )}
        </div>
      )}
      
      {/* Display the details content with titles, explanations, and code examples */}
      {parsedContent?.details?.map((item, i) => (
        <section key={i} className="p-5 border rounded-lg shadow-sm">
          <h2 className="font-medium text-xl text-green-500 mb-2">
            {item.title}
          </h2>

          {item.explanation && (
            <div className="my-3 prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.explanation}
              </ReactMarkdown>
            </div>
          )}

          {item["Code Example"] && (
            <pre className="mt-3 bg-gray-900 text-green-400 p-4 rounded-md overflow-auto">
              {item["Code Example"]}
            </pre>
          )}
        </section>
      ))}

      {/* Take Quiz button that uses current URL structure */}
      <div className="mt-6">
        {courseId ? (
          <Link href={`/course/${courseId}/start/quiz`}>
            <button className="bg-primary hover:bg-purple-300 text-white font-bold py-2 px-4 rounded">
              Take Quiz
            </button>
          </Link>
        ) : (
          <button
            className="bg-primary hover:bg-purple-300 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              const currentPath = window.location.pathname;
              const cleanPath = currentPath.endsWith('/')
                ? currentPath.slice(0, -1)
                : currentPath;
              window.location.href = `${cleanPath}/quiz`;
            }}
          >
            Take Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default ChapterContent;
