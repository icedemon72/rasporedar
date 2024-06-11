import { useState, useEffect } from 'react';
import { useJoinModeratorMutation, useJoinMutation } from '../../app/api/institutionsApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import CodeInput from './../../components/CodeInput/CodeInput';
import MutationState from '../../components/MutationState/MutationState';
import CardContainer from '../../components/CardContainer/CardContainer';

const JoinInstitution = () => {
	const navigate = useNavigate();

  const [ code, setCode ] = useState('');
  const [ mod, setMod ] = useState(false);
  const [ 
		join, 
		{ 
			isLoading: isJoinLoading, 
			isSuccess: isJoinSuccess,
			isError: isJoinError,
			error: joinError
		} 
	] = useJoinMutation();
  const [ 
		joinModerator, 
		{ 
			isLoading: isJoinModeratorLoading, 
			isSuccess: isJoinModeratorSuccess,
			isError: isJoinModeratorError,
			error: joinModeratorError
	 	}
	] = useJoinModeratorMutation();

  const { type, jCode } = useParams();

  const submit = async () => {
    if(code.length === 8) {
      const body = { code };
      try {
        const result = (mod) 
					? await joinModerator(body).unwrap() 
					: await join(body).unwrap();
				
				setTimeout(() => {
					navigate(`/institutions/${result._id}`);
				}, 1000);
				
      } catch (err) {
        console.log('Pogresan kod! ')
      }
    }
  }

  // remove this one if joining will be in modal
  useEffect(() => {
    if(type === 'mod') {
      setMod(true);
    }

    if(jCode?.length === 8) {
      setCode(jCode);
    }

  }, [])

  return (
    <>
			<MutationState
				isLoading={isJoinLoading || isJoinModeratorLoading}
				isSuccess={isJoinSuccess || isJoinModeratorSuccess}
				isError={isJoinError}
				error={joinError}
				successMessage='Uspešno ste se učlanili u grupu!'
			/>
			<MutationState
				isError={isJoinModeratorError}
				error={joinModeratorError}
			/>
			<Helmet>
				<title>Pridruži se grupi | Rasporedar</title>
			</Helmet>
			<CardContainer>
				<h1 className="text-xl font-black text-center py-5">Pridruži se grupi {mod ? 'kao moderator' : 'kao korisnik' }</h1>
				<CodeInput className="pb-4 mb-2" codeFunc={(code) => setCode(code)} />
				<div class="flex justify-center gap-2">
					<button class="p-2 border-2 border-black hover:box-shadow" onClick={() => setMod(prev => !prev)}>{mod ? 'Kao korisnik?' : 'Kao moderator?'}</button>
					<button class="p-2 border-2 border-black bg-green-400 hover:box-shadow" onClick={submit}>Pridruži se!</button>
				</div>
			</CardContainer>
      {/* <input type="text" maxLength={8} onChange={(elem) => setCode(elem.target.value)} placeholder="Unesi kod" value={code} /> */}
      
    </>
  )
}

export default JoinInstitution;