/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, CalendarDays, Box, Image as ImageIcon, History, Settings, Users, Menu, X, LogOut, Globe, Home } from 'lucide-react'

export function AdminShell({ children, user }: { children: React.ReactNode, user: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const isSuperAdmin = user?.role === 'super_admin'

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Halaman Beranda', href: '/admin/halaman-beranda', icon: Home },
    { label: 'Berita', href: '/admin/berita', icon: FileText },
    { label: 'Kegiatan', href: '/admin/kegiatan', icon: CalendarDays },
    { label: 'Layanan', href: '/admin/layanan', icon: Box },
    { label: 'Galeri', href: '/admin/galeri', icon: ImageIcon },
    { label: 'Sejarah', href: '/admin/sejarah', icon: History },
    { label: 'Informasi Website', href: '/admin/informasi-website', icon: Globe },
  ]

  const adminItems = isSuperAdmin ? [
    { label: 'Pengguna', href: '/admin/pengguna', icon: Users },
    { label: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
  ] : []

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-6">
        <h1 className="text-xl font-bold font-serif text-slate-900 tracking-tight">TEK HAY BIO</h1>
        <p className="text-sm text-slate-500">Custom Admin</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-2">Konten</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-slate-100 text-slate-900' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
              {item.label}
            </Link>
          )
        })}

        {isSuperAdmin && (
          <>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-8 px-2">Sistem</div>
            {adminItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold uppercase">
            {user?.email?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md transition-colors text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 flex items-center justify-between p-4 sticky top-0 z-20">
        <h1 className="text-lg font-bold font-serif text-slate-900">TEK HAY BIO</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2 text-slate-600">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 transform bg-white z-40 transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:shrink-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 shrink-0">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
             <Link href="/id" target="_blank" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2">
               Lihat Website <Globe className="w-4 h-4" />
             </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
