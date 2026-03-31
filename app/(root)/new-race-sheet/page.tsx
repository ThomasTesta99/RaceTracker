import CreateRaceForm from '@/components/CreateRaceForm';
import React from 'react'

const page = () => {
    const today = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    return (
        <div>
            <div className='flex flex-row items-center gap-4 justify-center'>
                <h1 className="text-3xl font-bold">
                    Create a New Race Sheet for
                </h1>
                <div>
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-5 py-2 text-lg font-medium text-white shadow-sm backdrop-blur-sm">
                    {today}
                    </span>
                </div>
            </div>
            
            <div className="mx-auto border-b border-white mt-6 mb-6 rounded-xl" />

            <div className='flex justify-center mt-20'>
                <CreateRaceForm />

            </div>


        </div>
    )
}

export default page
