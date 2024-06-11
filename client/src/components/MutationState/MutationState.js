import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import { Slide, toast } from 'react-toastify';

const MutationState = ({
  isLoading, isSuccess, successMessage = 'Uspešna izmena!', 
  isError, errorMessage = 'Došlo je do greške!', error, timeout = 300
}) => {
  let content = null;
  const [ showLoader, setShowLoader ] = useState(false);

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
				transition: Slide,
			});
		}
	}, [ isSuccess ]);
	
	useEffect(() => {
		if(isError) {
			if(error?.data?.message) {
				errorMessage = error.data.message;
			}
			
			toast.error(errorMessage, {
				className: "border-2 border-black rounded-none",
				position: "bottom-right",
				autoClose: 2500,
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