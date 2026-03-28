"use client"
import { deleteSource } from '@/lib/race-actions/sources';
import React from 'react'

const page = () => {

  return (
    <div>
      <button onClick={async () => {
       await deleteSource("9a670421-2f81-46c5-adb3-3887a016a060");
      }}>hey</button>
    </div>
  )
}

export default page
