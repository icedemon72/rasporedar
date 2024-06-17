import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import { Slide, toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const MutationState = ({
  isLoading, isSuccess, successMessage = 'Uspešna izmena!', 
  isError, errorMessage = 'Došlo je do greške!', error, timeout = 300
}) => {
  let content = null;
  const [ showLoader, setShowLoader ] = useState(false);
	const theme = useSelector(state => state.settings.theme);
	
  useEffect(() => {
		if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoader(true);
      }, timeout);
      return () => clearTimeout(timer); 
    } else {
      setShowLoader(false);
    }
  }, [ isLoading ]);

	useEffect(() => {
		if (isSuccess) {
			toast.success(successMessage, {
				className: "border-2 border-black rounded-none",
				position: "bottom-right",
				autoClose: 2500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: "light",
				style: { 
					backgroundColor: theme === 'dark' ? 'rgb(55, 65, 81)' : 'white',
					color: theme === 'dark' ? 'white' : 'black'
				 },
				transition: Slide,
			});
		}
	}, [ isSuccess ]);
	
	useEffect(() => {
		if(isError) {
			let autoClose = 2500;
			if(error?.data?.message) {
				errorMessage = error.data.message;
			} else if (error?.data?.errors) {
				errorMessage = 
					<>
						<p>Došlo je do greške</p>
						<ul className="list-disc ml-2">
							{error.data.errors.map((err) => <li>{ err.msg }</li>)}
						</ul>
					</>
				autoClose = error.data.errors.length * 2500;
			}
			
			toast.error(errorMessage, {
				className: "border-2 border-black rounded-none",
				position: "bottom-right",
				autoClose,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: "light",
				transition: Slide,
			});
		}
	}, [ isError ]);

  if(isLoading && showLoader) {
    content = <Loader />
  } 

  return (    
    <>
			{ content }
		</>
  );
}

export default MutationState;