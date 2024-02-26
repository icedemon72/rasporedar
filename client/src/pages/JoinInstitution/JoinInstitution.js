import { useState, useEffect } from 'react';
import { useJoinModeratorMutation, useJoinMutation } from '../../app/api/institutionsApiSlice';


const JoinInstitution = () => {
  const [ code, setCode ] = useState('');
  const [ mod, setMod ] = useState(false);
  const [ fetchJoin ] = useJoinMutation();
  const [ fetchJoinModerator ] = useJoinModeratorMutation();

  const submit = async () => {
    if(code.length === 8) {
      const body = { code };
      try {
        const result = (mod) ?
          await fetchJoinModerator(body).unwrap() : await fetchJoin(body).unwrap();
      } catch (err) {
        console.log('Pogresan kod!')
      }
    }
  }

  // remove this one if joining will be in modal
  useEffect(() => {
    document.title = 'Pridruži se grupi | Rasporedar';
  }, [])

  return (
    <>
      <input type="text" maxLength={8} onChange={(elem) => setCode(elem.target.value)} placeholder="Unesi kod" />
      <label>Kao {mod ? 'moderator' : 'korisnik'}?</label>
      <button onClick={() => setMod(prev => !prev)}>{mod ? 'Moderator' : 'Korisnik'}</button>
      <button onClick={submit}>Pridruži se!</button>
    </>
  )
}

export default JoinInstitution;