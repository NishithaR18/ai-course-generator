// "use client";
// import { db } from "@/configs/db";
// import { Chapters, CourseList } from "@/configs/schema";
// import { useUser } from "@clerk/nextjs";
// import { and, eq } from "drizzle-orm";
// import React, { useEffect, useState } from "react";
// import CourseBasicInfo from "./_components/CourseBasicInfo";
// import CourseDetail from "./_components/CourseDetail";
// import ChapterList from "./_components/ChapterList";
// import { Button } from "@/components/ui/button";
// import { index } from "drizzle-orm/gel-core";
// import { GenerateChapterContent_AI } from "@/configs/AiModel";
// import LoadingDialog from "../_components/LoadingDialog";
// import { useRouter } from "next/navigation";
// import service from "@/configs/service";

// function CourseLayout({ params }) {
//   const { user } = useUser();
//   const [course, setCourse] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     console.log(params);
//     params && GetCourse();
//   }, [params, user]);
//   const GetCourse = async () => {
//     const result = await db
//       .select()
//       .from(CourseList)
//       .where(
//         and(
//           eq(CourseList.courseId, params?.courseId),
//           eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress)
//         )
//       );
//     setCourse(result[0]);

//     console.log(result);
//   };

//   const GenerateChapterContent = () => {
//     setLoading(true);
//     const chapters = course?.courseOutput?.course?.chapters;

//     chapters?.forEach(async (chapter, index) => {
//       const PROMPT = `Explain the concept in detail on Topic: ${course?.name}, Chapter: ${chapter?.name}, in JSON Format jivith list of array with field as title, explanation on give chapter in detail, Code Example(Code field in <precode> format) if applicable`;
//       console.log(PROMPT);

//       try {
//         let videoId = "";
//         service.getVideos(course?.name + ":" + chapter.name).then((resp) => {
//           console.log(resp);
//           videoId = resp[0]?.id?.videoId;
//         });

//         const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
//         const rawText = await result?.response?.text();
//         const cleanedText = rawText.replace(/```json|```/g, "").trim();
//         const content = JSON.parse(cleanedText);

//         await db.insert(Chapters).values({
//           chapterId: index,
//           courseId: course?.courseId,
//           content: content,
//           videoId: videoId,
//         });

//         setLoading(false);
//       } catch (e) {
//         setLoading(false);
//         console.log(e);
//       }
//       await db.update(CourseList).set({
//         publish:true
//       })
//       router.replace("/create-course/" + course?.courseId + "/finish");
//     });
//   };

//   return (
//     <div className="mt-10 px-7 md:px-20 lg:px-44">
//       <h2 className="font-bold text-center text-2xl">Course Layout</h2>
//       <LoadingDialog loading={loading} />
//       <CourseBasicInfo course={course} refreshData={() => GetCourse()} />
//       <CourseDetail course={course} />
//       <ChapterList course={course} refreshData={() => GetCourse()} />
//       <Button onClick={GenerateChapterContent} className="my-10">
//         Generate Course Content
//       </Button>
//     </div>
//   );
// }

// export default CourseLayout;
"use client";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { Button } from "@/components/ui/button";
import { GenerateChapterContent_AI } from "@/configs/AiModel";
import LoadingDialog from "../_components/LoadingDialog";
import { useRouter } from "next/navigation";
import service from "@/configs/service";

function CourseLayout({ params }) {
  const { user } = useUser();
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log(params);
    params && GetCourse();
  }, [params, user]);

  const GetCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(
        and(
          eq(CourseList.courseId, params?.courseId),
          eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );
    setCourse(result[0]);
    console.log(result);
  };

  const GenerateChapterContent = async () => {
    setLoading(true);
    try {
      const chapters = course?.courseOutput?.course?.chapters;
      if (!chapters || chapters.length === 0) {
        console.error("No chapters found");
        setLoading(false);
        return;
      }

      // Process chapters sequentially using for...of loop to ensure proper async handling
      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index];
        console.log(`Processing chapter ${index + 1}/${chapters.length}: ${chapter.name}`);
        
        // Get video ID first
        let videoId = "";
        try {
          const videoResp = await service.getVideos(course?.name + ":" + chapter.name);
          console.log("Video response:", videoResp);
          if (videoResp && videoResp.length > 0) {
            videoId = videoResp[0]?.id?.videoId || "";
          }
        } catch (videoError) {
          console.error("Error fetching video:", videoError);
        }

        // Generate content with AI
        const PROMPT = `Explain the concept in detail on Topic: ${course?.name}, Chapter: ${chapter?.name}, in JSON Format with list of array with field as title, explanation on give chapter in detail, Code Example(Code field in format) if applicable`;
        console.log("AI Prompt:", PROMPT);
        
        const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
        const rawText = await result?.response?.text();
        const cleanedText = rawText.replace(/```json|```/g, "").trim();
        let content;
        
        try {
          content = JSON.parse(cleanedText);
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError);
          console.log("Raw AI response:", rawText);
          // Create a fallback content structure
          content = [{ title: chapter.name, explanation: "Content generation failed" }];
        }

        // Insert chapter into database
        console.log(`Inserting chapter ${index} into database`);
        await db.insert(Chapters).values({
          chapterId: String(index),
          courseId: course?.courseId,
          content: content,
          videoId: videoId,
        });
        
        console.log(`Chapter ${index + 1} successfully processed and stored`);
      }
      
      // Update course to published status
      await db.update(CourseList)
        .set({ publish: true })
        .where(eq(CourseList.courseId, course?.courseId));
      
      console.log("All chapters processed successfully!");
      router.replace("/create-course/" + course?.courseId + "/finish");
    } catch (e) {
      console.error("Error in chapter generation process:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-4">
      <LoadingDialog open={loading} onOpenChange={setLoading} />
      <CourseBasicInfo course={course} onUpdate={() => GetCourse()} />
      <CourseDetail course={course} onUpdate={() => GetCourse()} />
      <ChapterList course={course} />
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
        onClick={GenerateChapterContent}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Course Content"}
      </Button>
    </div>
  );
}

export default CourseLayout;