import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoginMutation } from '../../app/api/sessionApiSlice';
import { Link } from 'react-router-dom';

const Login = () => {
  const { location } = useParams();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  
  const userRef = useRef();
  
  const session = useSelector(state => state.session)
  const navigate = useNavigate();
  
  const [ 
    fetchLogin,
    {
      isLoading: isFetchLoginLoading,
      isSuccess: isFetchLoginSucces,
      isError: isFetchLoginError,
      reset: resetFetchLogin
    }
  ] = useLoginMutation();

  const resetRef = useRef(resetFetchLogin)
  resetRef.current = resetFetchLogin
  
  const handleLogin = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const body = { username, password };
    try {
      const result = await fetchLogin(body).unwrap();
    } catch (err) {
      console.log(err);
      setTimeout(() => {
        resetRef.current();
      }, 3000)
    }
  }
  
  useEffect(() => {
    document.title = 'Prijavljivanje | Rasporedar';
    userRef.current.focus();

    if(session.accessToken) {
      location ? navigate(`/${location}`) : navigate('/institutions');
    }

  }, [ session.accessToken ]);

  return (
    <>
      <div className="w-full flex justify-center">
        <form className="w-full md:w-1/2 lg:w-1/4 mt-10" onSubmit={handleLogin}>
          <label className="block text-gray-700 text-sm font-bold mb-2" for="username">Korisnicko ime</label>
          <input className="w-full py-2 px-3" id="username" name="username" type="text" ref={userRef} placeholder="Korisnicko ime" onChange={(elem) => setUsername(elem.target.value)} required/>
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4" for="password">Lozinka</label>
          <input className="w-full py-2 px-3" id="password" type="password" placeholder="Lozinka" onChange={(elem) => setPassword(elem.target.value)} required/>
          <div className='w-full flex justify-center my-3'>
            <button className="btn-red w-full lg:w-3/4">Uloguj se!</button>
          </div>
          <p className="block text-sm">Nemate nalog? <Link to="/register">Registrujte se!</Link></p>
          <div className="w-full flex justify-center mt-2">
            { isFetchLoginLoading ? <>Loading</> : null }
            { isFetchLoginSucces ? <p className="bg-green-200 text-center p-2">Uspesno prijavljivanje!</p> : null }
            { isFetchLoginError ? <p className="bg-red-200 text-center p-2">Greška prilikom prijavljivanja: Uneti su netačni podaci!</p> : null}
          </div>
        </form>
      </div>
    </>
  )
}

export default Login;