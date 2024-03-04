import React, { useState } from 'react'
import { useGetAllQuery } from '../../app/api/institutionsApiSlice';
import { useParams } from 'react-router-dom';
import { clsx } from 'clsx';
const Sidebar = ({ open, btn }) => {

  const {
    data: institutions,
    isLoading: isInstitutionsLoading,
    isSuccess: isInstitutionSuccess,
    isError: isInstitutionError,
    error: institutionsError
  } = useGetAllQuery();

  const { institution } = useParams();

  let content;

  if(isInstitutionSuccess) {
    content = <>
      { institutions.map(x => {
        return <p class="block">{ x.name }</p>
      }) }
    </>
  }

  return (
    <>
    { open ? 
      <nav className="fixed left-0 top-[56px] bg-slate-500 h-full z-[1000] min-w-[300px] max-w-full animate-in slide-in-from-left duration-300 ">
        <div className='flex flex-col'>
          { content }
        </div>
      </nav>
    : null }
    </>
  )
}

export default Sidebar;