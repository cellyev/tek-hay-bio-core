/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { LoginForm } from './LoginForm'
import { CreateFirstUserForm } from './CreateFirstUserForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Check if ANY user exists in the database
  let totalUsers = 0
  try {
    const countResult = await payload.count({ collection: 'users' })
    totalUsers = countResult.totalDocs
  } catch {
    // If DB is offline, we can't do much but show login error later
  }

  // 2. Check if currently logged in
  const { user } = await payload.auth({ headers: await headers() })

  if (user) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {totalUsers === 0 ? 'Setup Awal' : 'Login Admin'}
        </h1>
        {totalUsers === 0 ? <CreateFirstUserForm /> : <LoginForm />}
      </div>
    </div>
  )
}
