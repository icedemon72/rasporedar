import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoginMutation } from '../../app/api/sessionApiSlice';


const Login = () => {
  const { location } = useParams();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  
  const [ error, setError ] = useState({});
  const [ success, setSuccess] = useState({});
  //const userRef = useRef();

  const session = useSelector(state => state.session)
  const navigate = useNavigate();

  const [ fetchLogin ] = useLoginMutation();

  const handleLogin = async () => {
    const body = { username, password };
    try {
      const result = await fetchLogin(body).unwrap();
    } catch (err) {
      setError(err.data);
    }
  }

  useEffect(() => {
    document.title = 'Prijavljivanje | Rasporedar';
    //userRef.current.focus();

    if(session.accessToken) {
      location ? navigate(`/${location}`) : navigate('/institutions');
    }

  }, [ session.accessToken ]);

  return (
    <>
      <input type="text" placeholder="Korisnicko ime" onChange={(elem) => setUsername(elem.target.value)}/>
      <input type="password" placeholder="Lozinka" onChange={(elem) => setPassword(elem.target.value)}/>
      <button onClick={handleLogin}>Uloguj se!</button>
      {error.message && <>Greska prilikom prijavljivanja...</>}
    </>
  )
}

export default Login;