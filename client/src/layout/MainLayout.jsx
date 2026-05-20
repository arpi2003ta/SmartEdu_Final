import Navbar from '@/components/Navbar'

import VoiceNavigation from '@/components/VoiceNavigation'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
        <Navbar/>
        <div className='flex-1 mt-16'>
            <Outlet/>
        </div>
        <VoiceNavigation />
    </div>
  )
}

export default MainLayout

