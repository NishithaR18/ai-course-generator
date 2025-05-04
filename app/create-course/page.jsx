"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useContext } from "react";
import {
  HiClipboardDocumentCheck,
  HiLightBulb,
  HiMiniSquares2X2,
} from "react-icons/hi2";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "../_context/UserInputContext";
import { GenerateCourseLayout_AI } from "@/configs/AiModel";
import LoadingDialog from "./_components/LoadingDialog";
import { CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import uuid4 from "uuid4";
import { db } from "@/configs/db";
import { useRouter } from 'next/navigation';

function CreateCourse() {
  const StepperOptions = [
    { id: 1, name: "Category", icon: <HiMiniSquares2X2 /> },
    { id: 2, name: "Topic & Desc", icon: <HiLightBulb /> },
    { id: 3, name: "Options", icon: <HiClipboardDocumentCheck /> },
  ];
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
   
  const [loading, setLoading] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const {user}=useUser();
  const router=useRouter();
  useEffect(()=>{
    console.log(userCourseInput);
  },[userCourseInput])
  const checkStatus=()=>{
    if(userCourseInput?.length==0)
    {
      return true;
    }
    if(activeIndex==0 && (userCourseInput?.category?.length==0||userCourseInput?.category==undefined))
    {
      return true;
    }
    if(activeIndex==1 && (userCourseInput?.topic?.length==0 ||userCourseInput?.topic==undefined))
    {
      return true;
    }else if(activeIndex==2 && (userCourseInput?.level==undefined || userCourseInput?.duration==undefined || userCourseInput?.displayVideo==undefined || userCourseInput?.noOfChapter==undefined))
    {
      return true;
    }
    return false;
  }

  const GenerateCourseLayout=async()=>{
    setLoading(true)
    const BASIC_PROMPT='Generate A Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration'
    const USER_INPUT_PROMPT='Category: '+userCourseInput?.category+', Topic: '+userCourseInput?.topic+', Level: '+userCourseInput?.level+', Duration:'+userCourseInput?.duration+', NoOf Chapters: '+userCourseInput?.noOfChapter+', in JSON format'
    const FINAL_PROMPT= BASIC_PROMPT+USER_INPUT_PROMPT;
    console.log(FINAL_PROMPT);
    const result=await GenerateCourseLayout_AI.sendMessage(FINAL_PROMPT);
    const rawText = result.response?.text();
    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    console.log(JSON.parse(cleanJson));
    setLoading(false)
    SaveCourseLayoutInDb(JSON.parse(cleanJson));
  }

  const SaveCourseLayoutInDb=async(courseLayout)=>{
    var id=uuid4();
    setLoading(true)
    const result=await db.insert(CourseList).values({
      courseId: id,
      name: userCourseInput?.topic,
      level: userCourseInput?.level,
      category: userCourseInput?.category,
      courseOutput: courseLayout,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      userName: user?.fullName,
      userProfileImage: user?.imageUrl,

    })
    console.log("Finish");
    setLoading(false);
    router.replace('/create-course/'+id)
  }
  
  return (
    <div className="flex flex-col items-center mt-10 w-full">
      <h2 className="text-4xl text-primary font-medium">Create Course</h2>

      {/* Stepper */}
      <div className="flex mt-10">
        {StepperOptions.map((item, index) => (
          <div className="flex items-center" key={item.id}>
            <div className="flex flex-col items-center w-[50px] md:w-[100px]">
              <div
                className={`p-3 rounded-full ${
                  activeIndex >= index
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {item.icon}
              </div>
              <h2 className="hidden md:block md:text-sm">{item.name}</h2>
            </div>
            {index !== StepperOptions.length - 1 && (
              <div
                className={`h-1 w-[50px] md:w-[100px] lg:w-[170px] rounded-full ${
                  activeIndex - 1 >= index ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Page Content */}
      <div className="w-full px-4 mt-20">
        {activeIndex === 0 ? <SelectCategory />:
        activeIndex==1? <TopicDescription/>:<SelectOption/>}
        {/* Here you can add other steps' components later */}
      </div>

      {/* Buttons */}
      <div className="flex justify-between w-full px-4 mt-10">
        <Button
          disabled={activeIndex === 0}
          variant="outline"
          onClick={() => setActiveIndex(activeIndex - 1)}
        >
          Previous
        </Button>

        {activeIndex < 2 && (
          <Button
            disabled={checkStatus()}
            onClick={() => setActiveIndex(activeIndex + 1)}
          >
            Next
          </Button>
        )}

        {activeIndex === 2 && (
          <Button disabled={checkStatus()} onClick={() => GenerateCourseLayout()}>
            Generate Course Layout
          </Button>
        )}
      </div>
      <LoadingDialog loading={loading}/>
    </div>
  );
}

export default CreateCourse;
