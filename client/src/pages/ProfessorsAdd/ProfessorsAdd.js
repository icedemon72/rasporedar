import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAddProfessorMutation } from "../../app/api/professorsApiSlice";
import { useSelector } from "react-redux";
import { PlusCircle, Trash } from "lucide-react";
import { addItemToArrayOnKey, deleteItemFromArray } from "../../utils/updateArray";
import Input from './../../components/Input/Input';
import Textarea from "../../components/Input/Textarea";
import { Helmet } from "react-helmet";
import MutationState from "../../components/MutationState/MutationState";
import CardContainer from "../../components/CardContainer/CardContainer";
import ListItem from "../../components/ListItem/ListItem";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

const ProfessorsAdd = () => {
  const session = useSelector(state => state.session);
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const { institution } = useParams();

  const [ name, setName ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ bachelor, setBachelor ] = useState({});
  const [ master, setMaster ] = useState({});
  const [ doctorate, setDoctorate ] = useState({});
  // const [ education, setEducation ] = useState({});
  const [ bio, setBio ] = useState('');
  const [ referenceItem, setReferenceItem ] = useState('');
  const [ references, setReferences ] = useState([]);

  const [ 
    fetchAddProfessor,
    {
      isLoading: isFetchAddProfessorLoading,
      isSuccess: isFetchAddProfessorSuccess,
      isError: isFetchAddProfessorError,
			error: fetchAddProfessorError
    }
   ] = useAddProfessorMutation();

  const handleChangeBachelor = (val, field) => {
    let toChange = bachelor;
    toChange[field] = val;
    setBachelor(toChange);
  }

  const handleChangeMaster = (val, field) => {
    let toChange = master;
    toChange[field] = val;
    setMaster(toChange);
  }

  const handleChangeDoctorate = (val, field) => {
    let toChange = doctorate;
    toChange[field] = val;
    setDoctorate(toChange);
  }

  const handleAddReference = (elem, key = 'Enter') => {
    const toAdd = addItemToArrayOnKey(references, elem, key, true);
    if(toAdd.changed) {
      setReferences(toAdd.result);
      setReferenceItem('');
    }
  }

  const handleDeleteReference = (index) => {
    let tempReferences = [ ...references ];
    const toDelete = deleteItemFromArray(tempReferences, index);
    if(toDelete) {
      setReferences(toDelete);
    }
  }

  const handleAddProfessor = async (event) => {
    // Add input check here!!!
		event.preventDefault();
		event.stopPropagation();
    try {
      // Add check for bachelor, master and doctorate here
      const education = {
        bachelor: bachelor, master: master, doctorate: doctorate
      };

      const body = {
        name, title, education: education, bio, references
      }
      
      const result = await fetchAddProfessor({institution, body}).unwrap();

			setTimeout(() => {
				navigate(`/institutions/${institution}/professors/${result._id}`)
			}, 1000);

    } catch (err) {
			console.log(err);
    }
  }

  return (
    <>
			<MutationState 
				isLoading={isFetchAddProfessorLoading}
				isSuccess={isFetchAddProfessorSuccess}
				isError={isFetchAddProfessorError}
				error={fetchAddProfessorError}
				successMessage="Uspešno dodat profesor!"
			/>
			<Helmet>
				<title>Dodaj profesora | Rasporedar</title>
			</Helmet>

      <CardContainer large={true} containerBgClass="bg-image-primary">
				<Breadcrumbs />
				<h1 className="text-xl font-bold text-center py-5">Dodaj profesora</h1>
        <div>
					<div className="mb-4">
						<Input id="name" type="text" name="Ime i prezime" placeholder="Marko Marković" setVal={(elem) => setName(elem.target.value)} inputVal={name} />
					</div>

					<div className="mb-4">
						<Input id="title" type="text" name="Zvanje" placeholder="Prof. dr." setVal={(elem) => setTitle(elem.target.value)} inputVal={title} />
					</div>

					<div className="mb-4">
						<Textarea id="bio" name="Stručna biografija profesora" placeholder="Profesionalna biografija" setVal={(elem) => setBio(elem.target.value)} inputVal={bio} />
					</div>

					<div className="mb-4">
						<Input id="bachelor" type="text" name="Osnovne studije" placeholder="Prirodno-matematički fakultet, Univerzitet u Prištini" setVal={(elem) => handleChangeBachelor(elem.target.value, 'institution')} />
						
						<div className="flex justify-center gap-3 w-full mt-2">
							<input className="input-primary" type="number" min={1970} placeholder="Od" onChange={(elem) => handleChangeBachelor(elem.target.value, 'from')} />
							<input className="input-primary" type="number" min={1970} placeholder="Do" onChange={(elem) => handleChangeBachelor(elem.target.value, 'to')} />
						</div>
					</div>
          
					<div className="mb-4">
						<Input id="master" type="text" name="Master studije" placeholder="Prirodno-matematički fakultet, Univerzitet u Prištini" setVal={(elem) => handleChangeMaster(elem.target.value, 'institution')}  />
						
						<div className="flex justify-center gap-3 w-full mt-2">
							<input className="input-primary" type="number" min={1970} placeholder="Od" onChange={(elem) => handleChangeMaster(elem.target.value, 'from')} />
							<input className="input-primary" type="number" min={1970} placeholder="Do" onChange={(elem) => handleChangeMaster(elem.target.value, 'to')} />
						</div>
					</div>

					<div className="mb-4">
						<Input id="master" type="text" name="Doktorske studije" placeholder="Prirodno-matematički fakultet, Univerzitet u Prištini" setVal={(elem) => handleChangeDoctorate(elem.target.value, 'institution')} />

						<div className="flex justify-center gap-3 w-full mt-2">
							<input className="input-primary" type="number" min={1970} placeholder="Od" onChange={(elem) => handleChangeDoctorate(elem.target.value, 'from')} />
							<input className="input-primary" type="number" min={1970} placeholder="Do" onChange={(elem) => handleChangeDoctorate(elem.target.value, 'to')} />
						</div>
					</div>

					<label className="label-primary">Reference</label>
          <div className="w-full flex gap-1 mb-4">
            <input className="input-primary" type="text" placeholder="Reference profesora (Enter za unos)" value={referenceItem} ref={inputRef} onChange={(elem) => setReferenceItem(elem.target.value)} onKeyUp={(elem) => handleAddReference(elem)}/>
            <button type="button" className="btn-plus bg-primary" onClick={() => handleAddReference(inputRef.current, null)}><PlusCircle /></button>
          </div>

          { references.map((elem, i) => {
            return (
							<ListItem text={elem} index={i} deleteFunc={() => handleDeleteReference(i)}/>
            );
          })
          }

          <div className="w-full flex justify-end mt-6">
            <button type="submit" className="btn-primary btn-green w-full md:w-1/2 lg:w-1/3" onClick={handleAddProfessor}>Sačuvaj profesora</button>
          </div>
        </div>
      </CardContainer>
    </>
  )
}

export default ProfessorsAdd;