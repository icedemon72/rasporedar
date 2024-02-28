import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLogoutMutation } from '../../app/api/sessionApiSlice';
import { useGetUserQuery } from '../../app/api/userApiSlice';

const Navbar = () => {
  const session = useSelector(state => state.session);
  const [ fetchLogout ] = useLogoutMutation();

  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await fetchLogout({ refresh_token: session.refreshToken });
    navigate('/login');
  }

  const { data, error, isFetching } = useGetUserQuery('', {
    skip: !session.accessToken
  });

  return (
    <>
      <nav className="flex justify-between gap-1 bg-gray-500">
        <div className="h-full flex justify-center align-middle">
          <p className="p-4 font-bold">RASPOREDAR</p>
          <Link className="p-4 h-auto w-auto hover:bg-black hover:text-white" to="/">Pocetna</Link>
          <Link className="p-4 hover:bg-black hover:text-white" to="/about">O nama</Link>
          <Link className="p-4 hover:bg-black hover:text-white" to="/contact">Kontakt</Link>
        </div>
        <div className="h-full flex justify-center align-middle">
          {session.accessToken ? 
            <>
              <Link className="p-4 hover:bg-black hover:text-white" to="/institutions">Moje grupe</Link>
              <Link className="p-4 hover:bg-black hover:text-white" to="/institutions/create">+</Link>
              <button className="p-4 bg-red-500 hover:bg-red-300 " onClick={handleLogout}>
                Izloguj se!
              </button> 
            </>
            :
            <>
              <Link className="p-4 hover:bg-black hover:text-white justify-self-end" to="/login">Uloguj se!</Link>
            </>
          }
        </div>
      </nav>
    </>
  )
}

export default Navbar;