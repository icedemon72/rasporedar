import React, { forwardRef, useEffect, useState } from 'react'
import { useGetAllQuery } from '../../app/api/institutionsApiSlice';
import SidebarItem from './SidebarItem';
import { useSelector } from 'react-redux';
const Sidebar = forwardRef(({ open, btn }, ref) => {
	const session = useSelector(state => state.session);

  const {
    data: institutions,
    isLoading: isInstitutionsLoading,
    isSuccess: isInstitutionSuccess,
    isError: isInstitutionError,
    error: institutionsError
  } = useGetAllQuery(null, {
		skip: !session.refreshToken
	});

  let content;

  if(isInstitutionSuccess) {
    content = <>
      { institutions.map(x => {
        return <SidebarItem text={ x.name } url={`/institutions/${x._id}`}></SidebarItem>
      }) }
    </>
  }

	// TODO: fix fixed responsive problems...
	return (
    <>
    { 
			open &&
				<nav ref={ref} className="min-h-screen h-full w-full lg:w-[500px] fixed left-0 top-[74px] bg-secondary z-[99999] animate-in slide-in-from-left duration-300 lg:border-r-2 border-t-2 border-black overflow-y-auto">
					<div className='min-h-[calc(100vh+76px)] flex flex-col'>
						<SidebarItem url="/" text="Početna"/>
						<SidebarItem url="/about" text="O nama" />
						<SidebarItem url="/contact" text="Kontakt" />
						<hr className="my-2" />
						{
							session.refreshToken 
							? 
								<>
									<SidebarItem url="/institutions" text="Moje grupe" />
									<SidebarItem url="/institutions/join" text="Pridruži se grupi" />
									<SidebarItem url="/institutions/create" text="Nova grupa" />
									<hr className="my-2" />
									{ content }
									<hr className="my-2" />
									<SidebarItem url="/logout" text="Odjavi se" />
								</>
							: 
								<>
									<SidebarItem url="/login" text="Prijava" />
									<SidebarItem url="/register" text="Registracija" />
								</>
						}
						
					</div>
				</nav>
		}
    </>
  )
})
export default Sidebar;