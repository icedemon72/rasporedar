import React from 'react';
import { Link } from 'react-router-dom';

const InstitutionCard = ({ image, url, text, desc }) => {
	return (
		<Link className="flex relative justify-around items-center min-h-[300px] border-2 border-black col-span-1 lg:hover:box-shadow-lg group rounded overflow-hidden bg-white dark:bg-gray-700" to={url}>
			<div className="relative w-full h-full">
				<img className="absolute -bottom-[60px] left-10 h-full w-full scale-110 group-hover:scale-90 transition-all" src={image} />
			</div>
			<div className="w-full text-center">
				<p className="text-xl font-bold uppercase">{ text }</p>
				<p>{ desc }</p>
			</div>
		</Link>
	)
}

export default InstitutionCard;