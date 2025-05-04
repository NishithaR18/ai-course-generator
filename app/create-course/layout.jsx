"use client"
import React, { useState } from 'react'
import { UserInputContext } from '../_context/UserInputContext';
import Header from '../_components/Header';

function CreateCourselayout({children}) {
  const [userCourseInput,setUserCourseInput]=useState([]);
  return (
    <div>
        <UserInputContext.Provider value={{userCourseInput,setUserCourseInput}}>
        <>
        <Header/>
        {children}
        </>
        </UserInputContext.Provider>
        </div>
  )
}

export default CreateCourselayout
