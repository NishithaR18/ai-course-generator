'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter, usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = () => {
    router.push('/signin')
  }

  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <div className='flex justify-between p-5 shadow-sm'>
      <Image src='/logo.svg' alt="Logo" width={60} height={60} />
      {isDashboard ? (
        <UserButton />
      ) : (
        <Button onClick={handleClick}></Button>
      )}
    </div>
  )
}

export default Header
