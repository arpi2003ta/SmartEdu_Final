import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import Chat from '@/components/Chat'
import { useSelector } from 'react-redux'

const AccountLayout = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const enrolledCourses = user?.enrolledCourses || [];

    return (
        <>
        
        <div className="flex min-h-screen bg-slate-50/50 dark:bg-zinc-950">
            {user?.role !== "instructor" && (
            <StudentSidebar
                canChat={enrolledCourses.length > 0}
                onOpenChat={() => setIsChatOpen(true)}
            />
            )}
            <Chat open={isChatOpen} onOpenChange={setIsChatOpen} hideTrigger />
            
            <div className="flex-1 lg:ml-64 flex flex-col pt-16">
                <div className="max-w-7xl mx-auto w-full p-4 md:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
        
        </>
    )
    
}

export default AccountLayout
