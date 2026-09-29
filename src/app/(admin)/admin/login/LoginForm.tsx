/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login gagal. Periksa kembali email dan password Anda.')
        setIsLoading(false)
        return
      }

      // Successful login sets the HTTP-only cookie automatically
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
          {error}
        </div>
      )}
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
        className="w-full bg-slate-900 text-white p-2 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Memproses...' : 'Login'}
      </button>
    </form>
  )
}
