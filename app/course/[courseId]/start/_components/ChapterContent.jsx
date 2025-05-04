import React from "react";
import YouTube from "react-youtube";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
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
      // If content.content is already an object (from DB driver), use it directly
      // Otherwise, try to parse it from a string
      parsedContent = typeof content.content === 'string'
        ? JSON.parse(content.content)
        : content.content;
    } catch (error) {
      console.error("Failed to parse content:", error);
    }
  }

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

          {/* render explanation as Markdown */}
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
    </div>
  );
}
export default ChapterContent;