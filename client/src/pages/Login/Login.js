import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoginMutation } from '../../app/api/sessionApiSlice';
import { Link } from 'react-router-dom';
import Input from './../../components/Input/Input';
import MutationState from '../../components/MutationState/MutationState';
import CardContainer from '../../components/CardContainer/CardContainer';

const Login = () => {
  const { location } = useParams();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  
  // const userRef = useRef();
  
  const session = useSelector(state => state.session)
  const navigate = useNavigate();
  
  const [ 
    fetchLogin,
    {
      isLoading: isFetchLoginLoading,
      isSuccess: isFetchLoginSuccess,
      isError: isFetchLoginError,
			error: fetchLoginError,
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

      setTimeout(() => {
        resetRef.current();
      }, 3000)
    }
  }
  
  useEffect(() => {
    document.title = 'Prijavljivanje | Rasporedar';
    // userRef.current.focus();

    if(session.refreshToken) {
      location ? navigate(`/${location}`) : navigate('/institutions');
    }

  }, [ session.refreshToken ]);

  return (
    <>
			<MutationState 
				isLoading={isFetchLoginLoading}
				isSuccess={isFetchLoginSuccess}
				isError={isFetchLoginError}
				error={fetchLoginError}
				successMessage="Uspešno prijavljivanje!"
			/>
      <CardContainer containerBgClass='bg-main-pattern'>
				<h1 class="text-xl font-bold py-5 text-center">Prijava</h1>
        <form onSubmit={handleLogin}>
					<div class="mb-2">
						<Input id="username" type="text" name="Korisničko ime ili e-adresa" placeholder="marko.markovic" setVal={(elem) => setUsername(elem.target.value)} inputVal={username} />
					</div>
					<div class="mb-2">
						<Input id="password" type="password" name="Lozinka" placeholder="•••••••" setVal={(elem) => setPassword(elem.target.value)} inputVal={password} />
					</div>
          <div className='w-full flex justify-center my-3'>
            <button className="w-full btn-primary btn-green">Uloguj se!</button>
          </div>
          <p className="block text-sm">Nemaš nalog? <Link class="underline hover:no-underline cursor-pointer" to="/register">Registruj se!</Link></p>
        </form>
      </CardContainer>
    </>
  )
}

export default Login;