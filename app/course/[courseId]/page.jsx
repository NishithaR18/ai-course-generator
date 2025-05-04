"use client"
import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema'
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import CourseBasicInfo from '@/app/create-course/[courseId]/_components/CourseBasicInfo';
import Header from '@/app/_components/Header';
import CourseDetail from '@/app/create-course/[courseId]/_components/CourseDetail';
import ChapterList from '@/app/create-course/[courseId]/_components/ChapterList';

function Course() {
    const params = useParams();
    const [course, setCourse] = useState();
    
    useEffect(() => {
        if(params?.courseId) {
            GetCourse();
        }
    }, [params?.courseId])

    const GetCourse = async () => {
        const result = await db.select()
            .from(CourseList)
            .where(eq(CourseList.courseId, params.courseId));
        
        setCourse(result[0]);
        console.log(result);
    }

    return (
        <div>
            <Header/>
            <div className='px-10 p-10 md:px-20 lg:px-44'>
            <CourseBasicInfo course={course} edit={false}/>
            <CourseDetail course={course}/>
            <ChapterList course={course} edit={false}/>
            </div>
        </div>
    )
}

export default Course