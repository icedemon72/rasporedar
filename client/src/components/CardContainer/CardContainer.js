import React from 'react';
import clsx from 'clsx';

const CardContainer = ({ children, large = false, xlarge = false, loaded = true, containerBgClass = '', cardBgClass = 'bg-white' }) => {
	return (
		<div className={
			clsx(
				"w-full h-full min-h-[calc(100vh-76px)] flex md:items-center justify-center p-0 md:p-2 bg-repeat",
				containerBgClass
			)
		}>
			<div className={
				clsx(
					"w-full border-0 border-black", 
					cardBgClass,
					xlarge 
						? 'lg:w-4/5 xl:w-3/4'
						: !large
							? 'md:w-3/4 lg:w-1/2 xl:w-1/3'
							: 'md:w-11/12 lg:w-3/4 xl:w-1/2',
					loaded && 'p-2 md:border-2 md:box-shadow'
				)
			}>
				{ children }
			</div>
		</div>
	)
}

export default CardContainer;