import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import React, { ReactNode } from 'react'

const layout = ({children} : {children : ReactNode}) => {
  return (
    <main className="flex flex-col md:flex-row w-full min-h-dvh overflow-x-hidden">
      <div className="md:hidden">
        <Topbar />
      </div>

        <div className='hidden md:flex md:flex-col'>
            <Sidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0 p-10">
            {children}
        </div>
    </main>
  )
}

export default layout
