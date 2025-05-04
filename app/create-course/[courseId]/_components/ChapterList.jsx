import React from "react";
import { HiOutlineClock , HiOutlineCheckCircle} from "react-icons/hi2";
import EditChapters from "./EditChapters";

function ChapterList({ course, refreshData ,edit=true}) {
  return (
    <div className="mt-3">
      <h2 className="text-xl font-bold">Chapters</h2>
      <div className="mt-2 space-y-4">
        {course?.courseOutput?.course?.chapters.map((chapter, index) => (
          <div className="border p-5 rounded-lg mb-2 flex items-center justify-between">
          <div className="flex gap-5 items-start p-4 rounded-lg mb-2 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 bg-primary flex-none h-10 w-10 text-white rounded-full flex items-center justify-center">
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg">{chapter?.name}{edit && <EditChapters course={course} index={index} refreshData={refreshData}/>}</h3>
              <p className="text-sm text-gray-500">{chapter?.about}</p>
              <p className="flex gap-2 items-center"><HiOutlineClock />{chapter?.duration}</p>
            </div>
          </div>
          <HiOutlineCheckCircle className="flex-none text-4xl text-gray-300"/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
