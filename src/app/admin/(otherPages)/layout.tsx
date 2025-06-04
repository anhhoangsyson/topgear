'use client'
import AdminHeader from '@/app/admin/layout/HeaderAdmin'
import SidebarAdmin from '@/app/admin/layout/SidebarAdmin'
import { useSidebar } from '@/context/admin/SidebarContext'
import { ThemeProvider } from '@/context/admin/ThemeContext'
import React from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <ThemeProvider>
      <div className="min-h-screen xl:flex">
        {/* Sidebar and Backdrop */}
        <SidebarAdmin />
        {/* <Backdrop /> */}
        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AdminHeader />
          {/* Page Content */}
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:ps-6 bg-white">
            <div className='min-h-screen overflow-y-auto'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
