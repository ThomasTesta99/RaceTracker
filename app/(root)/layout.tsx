import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import { getUserSession } from '@/lib/auth-actions/auth-helpers'
import React, { ReactNode } from 'react'

const layout = async ({children} : {children : ReactNode}) => {
  const session = await getUserSession();
  const user = session?.user;
  return (
    <main className="flex flex-col md:flex-row w-full min-h-dvh overflow-x-hidden">
      <div className="md:hidden">
        <Topbar />
      </div>

        <div className='hidden md:flex md:flex-col'>
            <Sidebar user={user} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 md:p-8 lg:p-10">
            {children}
        </div>
    </main>
  )
}

export default layout
