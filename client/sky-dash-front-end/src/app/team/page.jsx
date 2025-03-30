import React from 'react'
import Teachers from '../components/Teacher'
import TeacherCard from '../components/TeacherCard'

export default function page() {
  return (
    <div className='bg-white text-black'>
        <Teachers type={"Popular Instructor"}/>
        <TeacherCard />


    </div>
  )
}
