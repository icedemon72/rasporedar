import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRegisterMutation } from '../../app/api/userApiSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const session = useSelector(state => state.session);
  const navigate = useNavigate();
  const [ fetchRegister ] = useRegisterMutation();

  /* States */
  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ name, setName ] = useState('');

  const handleRegister = async () => {
    // check input here!!!
    const body = { username, email, password, name };
    await fetchRegister(body);
  }

  useEffect(() => {
    document.title = 'Registracija | Rasporedar'

    if(session.accessToken) {
      navigate('/')
    }
  })

  return (
    <>
      <input type="text" placeholder="Korisnicko ime" onChange={(elem) => setUsername(elem.target.value)} />
      <input type="email" placeholder="E-adresa" onChange={(elem) => setEmail(elem.target.value)} />
      <input type="password" placeholder="Lozinka" onChange={(elem) => setPassword(elem.target.value)} />
      <input type="text" placeholder="Ime i prezime" onChange={(elem) => setName(elem.target.value)} />
      <button onClick={handleRegister}>Registruj se!</button>
    </>
  )
}

export default Register;