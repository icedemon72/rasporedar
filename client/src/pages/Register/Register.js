import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRegisterMutation } from '../../app/api/userApiSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const session = useSelector(state => state.session);
  const navigate = useNavigate();
  const [ 
    fetchRegister,
    {
      isLoading: isFetchRegisterLoading,
      isSuccess: isFetchRegisterSuccess,
      isError: isFetchRegisterError
    }
   ] = useRegisterMutation();

  /* States */
  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ name, setName ] = useState('');

  const handleRegister = async () => {
    try {
      // check input here!!!
      const body = { username, email, password, name };
      const result = await fetchRegister(body).unwrap();
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    document.title = 'Registracija | Rasporedar'

    if(session.accessToken) {
      navigate('/');
    }
  })

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full md:w-1/2 lg:w-1/4 mt-10">
          <input className="input-field mb-4" type="text" placeholder="Korisnicko ime" onChange={(elem) => setUsername(elem.target.value)} />
          <input className="input-field mb-4" type="email" placeholder="E-adresa" onChange={(elem) => setEmail(elem.target.value)} />
          <input className="input-field mb-4" type="password" placeholder="Lozinka" onChange={(elem) => setPassword(elem.target.value)} />
          <input className="input-field mb-4" type="text" placeholder="Ime i prezime" onChange={(elem) => setName(elem.target.value)} />
          <div className="w-full flex justify-center">
            <button className="btn-green w-full md:w-1/2 lg:w-1/3" onClick={handleRegister}>Registruj se!</button>
          </div>
          { isFetchRegisterLoading ? <>Loading...</> : null }
          { isFetchRegisterSuccess ? <>Uspesna registracija!</> : null }
          { isFetchRegisterError ? <>Greska!</> : null }
        </div>
      </div>
    </>
  )
}

export default Register;