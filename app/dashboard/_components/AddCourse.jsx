"use client"
import { useUser } from '@clerk/nextjs';
import React, { useContext } from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCourseListContext } from '@/app/_context/UserCourseListContext';

function AddCourse() {
    const {user} =useUser();
    const {userCourseList, setUserCourseList}=useContext(UserCourseListContext)
  return (
    <div className='flex items-center justify-between'>
        <div>
            <h2 className='text-3xl'>Hello,<span className='font-bold'>{user?.fullName}</span></h2>
            <p className='text-sm text-gray-500'>Create new course with AI, Share with friends and Earn from it</p>
        </div>
        <Link href={userCourseList>=5? '/dashboard/upgrade':'/create-course'}>
        <Button>+Create AI Course</Button>
        </Link>
    </div>
  )
}

export default AddCourse