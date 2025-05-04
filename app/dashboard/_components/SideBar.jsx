"use client";
import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiHome,
  HiMagnifyingGlass,
  HiMiniArrowUpOnSquare,
  HiMiniArrowRightStartOnRectangle,
} from "react-icons/hi2";
import { usePathname } from "next/navigation";
import * as Progress from "@radix-ui/react-progress";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";

function SideBar() {
  
  const { userCourseList, setUserCourseList } = useContext(
    UserCourseListContext
  );
  const Menu = [
    { id: 1, name: "Home", icon: <HiHome />, path: "/dashboard" },
    {
      id: 2,
      name: "Explore",
      icon: <HiMagnifyingGlass />,
      path: "/dashboard/explore",
    },
    {
      id: 3,
      name: "Upgrade",
      icon: <HiMiniArrowUpOnSquare />,
      path: "/dashboard/upgrade",
    },
    {
      id: 4,
      name: "Logout",
      icon: <HiMiniArrowRightStartOnRectangle />,
      path: "/dashboard/logout",
    },
  ];
  const progressValue = Math.min((userCourseList?.length / 5) * 100, 100);

  const path = usePathname();

  return (
    <div className="fixed h-full md:w-64 p-5 shadow-md">
      <Image src={"/logo.svg"} alt="Company Logo" width={50} height={50} />
      <hr className="my-5" />

      <ul>
        {Menu.map((item, index) => (
          <Link key={item.id} href={item.path}>
            <div
              className={`flex items-center gap-2 text-gray-600 p-3 cursor-pointer
                            hover:bg-gray-100 hover:text-black rounded-lg mb-2
                            ${item.path == path && "bg-gray-100 text-black"}`}
            >
              <div className="text-2xl">{item.icon}</div>
              <h2>{item.name}</h2>
            </div>
          </Link>
        ))}
      </ul>
      <div className="absolute bottom-10 w-[80%]">
        <Progress.Root
          value={progressValue}
          className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2"
        >
          <Progress.Indicator
            className="bg-black h-full transition-transform duration-300"
            style={{ transform: `translateX(-${100 - progressValue}%)` }}
          />
        </Progress.Root>
        <h2 className="text-sm my-2 text-gray-600">
          {userCourseList?.length} out of 5 courses created
        </h2>
      </div>
    </div>
  );
}

export default SideBar;
