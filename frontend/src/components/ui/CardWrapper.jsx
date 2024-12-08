import React from 'react'

export function CardWrapper({ children, dashedBorder }) {
  return (
    <div style={{ borderRadius: '20px' }} className={`p-[22px] sm:p-[48px]  ${dashedBorder ? 'border border-dashed cursor-pointer':'border'} w-full flex flex-col  items-center text-center`}>
      {children}
    </div>
  )
}

export function MainCardWrapper ({children}){
  return(
    <div className='mt-4 card-shadow p-[20px] sm:p-[32px] max-w-[764px] w-[90vw] md:w-[80vw] lg:w-[60vw]'>
      {children}
    </div>
  )
}

export function NoPaddingCardWrapper ({children}){
  return(
    <div className='mt-4 card-shadow max-w-[764px] w-[90vw] md:w-[80vw] lg:w-[60vw]'>
      {children}
    </div>
  )
}
//