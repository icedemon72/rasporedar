import React from 'react';
import './Loader.css';

const Loader = () => {
	return (
		<div className="fixed top-0 left-0 flex flex-col justify-center items-center w-screen h-screen bg-black/70 z-10 overflow-hidden">
			<div className="loader relative z-20"></div>
		</div>
	)
}

export default Loader;