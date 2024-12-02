import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import React from 'react'

const Header = () => {
  return (<>

  <div className='flex justify-end p-5 shadow-sm'>
       <UserButton />
  </div>
    </>
  )
}

export default Header