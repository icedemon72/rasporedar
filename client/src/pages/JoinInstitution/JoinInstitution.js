import { useState, useEffect } from 'react';
import { useJoinModeratorMutation, useJoinMutation } from '../../app/api/institutionsApiSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
			<CardContainer containerBgClass='bg-image-primary'>
				<h1 className="text-xl font-black text-center py-5">Pridruži se grupi kao <span className="underline">{mod ? 'moderator' : 'korisnik' }</span></h1>
				<CodeInput className="pb-4 mb-2" codeFunc={(code) => setCode(code)} />
				<div className="flex justify-center gap-2">
					<button className="btn-primary bg-primary" onClick={() => setMod(prev => !prev)}>{mod ? 'Kao korisnik?' : 'Kao moderator?'}</button>
					<button className="btn-primary btn-green" onClick={submit}>Pridruži se!</button>
				</div>

				<p className="text-sm text-center my-4">Želiš svoju grupu? <Link className="underline hover:no-underline" to='/institutions/create'>Napravi je</Link></p>
			</CardContainer>
      {/* <input type="text" maxLength={8} onChange={(elem) => setCode(elem.target.value)} placeholder="Unesi kod" value={code} /> */}
      
    </>
  )
}

export default JoinInstitution;