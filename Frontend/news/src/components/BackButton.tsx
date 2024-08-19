'use client'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'

const BackButton = () => {
    const router = useRouter()
    
    return (
      <Button 
        onClick={() => router.back()} 
        className="absolute top-4 left-4 p-2 rounded-full bg-gray-800 hover:bg-red-800 transition-colors duration-200"
      >
        <ArrowLeft size={24} />
      </Button>
    )
}

export default BackButton