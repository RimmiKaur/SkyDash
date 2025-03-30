import React from 'react'
import OurStory from '../components/OurStory'
import Teachers from '../components/Teacher'

export default function page() {
  return (
    <div className='p-20 bg-white'>
        <OurStory/>
        <Teachers type={"Popular Instructor"}/>
    </div>
  )
}
