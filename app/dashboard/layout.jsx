import React from 'react'
import Sidebar from './_components/Sidebar'
import Header from './_components/Header'
import { Menu } from 'lucide-react'
import MobileNav from './_components/MobileNav'

const DashboardLayout = ({ children }) => {
    return (
        <div>

            <div className="hidden max-md:flex max-md:w-5 fixed">
                <MobileNav />
            </div>
            <div className="max-md:hidden md:w-64 h-screen fixed">
                <Sidebar />
            </div>


            <div className="md:ml-64 max-md:ml-5">
                <Header />
                <div className="p-10">
                    {children}
                </div>

            </div>
        </div>
    )
}

export default DashboardLayout