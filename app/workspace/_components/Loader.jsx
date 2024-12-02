
import { Circle } from 'lucide-react'
import React, { useState, useEffect } from 'react'


const Loader = () => {

    return (
        <div className='flex items-center justify-center animate-bounce h-screen'>
            <Circle fill={"red"} className='transition-all shadow-2xl'/>
        </div>
    )
}

export default Loader