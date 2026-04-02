import CreateRaceForm from '@/components/CreateRaceForm';
import React from 'react'

const page = () => {
    return (
        <div>
            <div className='flex flex-row items-center gap-4 justify-center'>
                <h1 className="text-3xl font-bold">
                    Create a New Race Sheet
                </h1>
            </div>
            
            <div className="mx-auto border-b border-white mt-6 mb-6 rounded-xl" />

            <div className='flex justify-center mt-20'>
                <CreateRaceForm />

            </div>


        </div>
    )
}

export default page
