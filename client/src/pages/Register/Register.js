import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRegisterMutation } from '../../app/api/userApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { Helmet } from 'react-helmet';
import MutationState from '../../components/MutationState/MutationState';
import CardContainer from '../../components/CardContainer/CardContainer';

const Register = () => {
  const session = useSelector(state => state.session);
  const navigate = useNavigate();
  const [ 
    register,
    {
      isLoading: isRegisterLoading,
      isSuccess: isRegisterSuccess,
      isError: isRegisterError,
			error: registerError
    }
   ] = useRegisterMutation();

  /* States */
  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ name, setName ] = useState('');

  const handleRegister = async (event) => {
    try {
			event.preventDefault();
    	event.stopPropagation();
      const body = { username, email, password, name };
      await register(body).unwrap();

      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if(session.refreshToken) {
      navigate('/');
    }
  })

  return (
    <>
			<Helmet>
				<title>Registracija | Rasporedar</title>
			</Helmet>

			<MutationState 
				isLoading={isRegisterLoading}
				isSuccess={isRegisterSuccess}
				isError={isRegisterError}
				error={registerError}
				successMessage='Uspešna registracija!'
			/>

      <CardContainer containerBgClass='bg-day dark:bg-night bg-cover'>
				<h1 className="text-xl font-bold text-center py-5">Registracija</h1>
        <form onSubmit={handleRegister}>
					<div className="mb-2">
						<Input id="username" type="text" name="Korisničko ime" placeholder="marko.markovic" setVal={(elem) => setUsername(elem.target.value)} inputVal={username} />
					</div>
					<div className="mb-2">
						<Input id="email" type="email" name="E-adresa" placeholder="marko.markovic@primer.com" setVal={(elem) => setEmail(elem.target.value)} inputVal={email} />
					</div>
					<div className="mb-2">
						<Input id="password" type="password" name="Lozinka" placeholder="•••••••" setVal={(elem) => setPassword(elem.target.value)} inputVal={password} />
						<span className="text-xs text-muted">* Lozinka mora sadržati bar 3 karaktera</span>
					</div>
					<div className="mb-2">
						<Input id="name" type="text" name="Ime i prezime" placeholder="Marko Marković" setVal={(elem) => setName(elem.target.value)} inputVal={name} />
					</div>
        
          <div className="w-full flex justify-center my-3">
            <button className="w-full btn-primary btn-green" type="submit">Registruj se!</button>
          </div>

					<p className="block text-sm">Imaš nalog? <Link className="underline hover:no-underline cursor-pointer" to="/login">Prijavi se!</Link></p>
          
        </form>
      </CardContainer>
    </>
  )
}

export default Register;