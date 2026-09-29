/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CreateFirstUserForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // 1. Create User using First User Endpoint (Requires no auth if 0 users exist)
      const res = await fetch('/api/users/first-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role: 'super_admin' }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Gagal membuat pengguna pertama.')
        setIsLoading(false)
        return
      }

      // 2. Login
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (loginRes.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        router.push('/admin/login')
        router.refresh()
      }
      
    } catch {
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-md border border-blue-200 mb-4">
        Sistem mendeteksi bahwa belum ada pengguna. Silakan buat akun Super Admin pertama Anda.
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700">Nama</label>
        <input 
          type="text" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" 
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input 
          type="email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" 
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Password</label>
        <input 
          type="password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" 
          disabled={isLoading}
        />
      </div>
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 mt-4"
      >
        {isLoading ? 'Memproses...' : 'Buat Super Admin & Login'}
      </button>
    </form>
  )
}
