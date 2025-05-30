"use client"
import Image from "next/image";
import React from "react";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { HiMiniEllipsisVertical } from "react-icons/hi2";
import DropdownOption from "./DropdownOption";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

function CourseCard({ course, refreshData ,displayUser=false}) {
  const handleOnDelete = async () => {
    const resp = await db
      .delete(CourseList)
      .where(eq(CourseList.id, course?.id))
      .returning({ id: CourseList?.id });
    if (resp) {
      refreshData();
    }
  };
  const validateImageUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const imageSrc =
    course?.courseBanner && validateImageUrl(course.courseBanner)
      ? course.courseBanner
      : "/placeholder.jpg";

  return (
    <div className="shadow-sm rounded-lg border p-2 cursor-pointer mt-4 ">
      <Link href={'/course/'+course?.courseId}>
      <Image
        src={imageSrc}
        width={300}
        height={200}
        className="w-full h-[200px] object-cover rounded-lg"
        alt={course?.courseOutput?.Topic || "Course banner"}
        onError={(e) => {
          e.target.src = "/placeholder.jpg";
        }}
      /></Link>
      <div className="p-2">
        <h2 className="font-bold  text-lg flex justify-between items-center">
          {course?.courseOutput?.course?.name}
          {!displayUser && <DropdownOption handleOnDelete={() => handleOnDelete()}>
            <HiMiniEllipsisVertical />
          </DropdownOption>}
        </h2>
        <p className="text-sm text-gray-400 my-1">{course?.category}</p>
        <div className="flex items-center justify-between">
          <h2 className="flex gap-2 items-center p-1 bg-purple-50  text-sm rounded-sm">
            <HiOutlineBookOpen />
            {course?.courseOutput?.course?.numberOfChapters} Chapters
          </h2>
          <h2 className="font-medium text-sm bg-purple-50 p-1 rounded-sm">
            {course?.level}
          </h2>
        </div>
        {displayUser && <div className="flex gap-2 items-center mt-2">
          <Image className="rounded-full" src={course?.userProfileImage} width={35} height={35}/>
          <h2 className="text-sm">{course?.userName}</h2>
        </div>}
      </div>
    </div>
  );
}
export default CourseCard;
