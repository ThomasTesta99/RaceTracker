import Sidebar from '@/components/Sidebar'
import React, { ReactNode } from 'react'

const layout = ({children} : {children : ReactNode}) => {
  return (
    <main className="flex flex-col md:flex-row w-full min-h-dvh overflow-x-hidden">

        <div>
            <Sidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
            {children}
        </div>
    </main>
  )
}

export default layout
