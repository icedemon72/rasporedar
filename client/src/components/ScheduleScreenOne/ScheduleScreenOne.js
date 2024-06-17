import { useRef, useState } from 'react';
import { addItemToArrayOnKey, deleteItemFromArray } from '../../utils/updateArray';
import { Trash, PlusCircle } from 'lucide-react';
import ModalDelete from '../ModalDelete/ModalDelete';
import Input from '../Input/Input';
import SelectComponent from '../Input/SelectComponent';
import { scheduleStyles, scheduleTypes } from '../../models/SelectModels';

const ScheduleScreenOne = ({
  setTitle, setSubtitle, setComment, setDepartment,
  isInstitutionLoading, isInstitutionSuccess, institutionData,
  setStyle, systemType, setSystemType, setValidUntil, groups, setGroups,
  handleDeleteGroup, ...props
}) => {

  // const [ groupsArray, setGroupsArray ] = useState(groups || ['Grupa 1']);
  const [ group, setGroup ] = useState('');
  const [ added, setAdded ] = useState(false);
  const [ clickedIndex, setClickedIndex ] = useState(null);
  const [ isDeleteGroupOpen, setIsDeleteGroupOpen ] = useState(false);
  const inputRef = useRef(null);

  const handleAddGroup = (elem, key = 'Enter') => {
    const toAdd = addItemToArrayOnKey(groups, elem, key, true);

    if(!added && groups.length === 1) {
      if(elem.key === 'Enter' || !elem.key) {
        setGroups(prev => [ group ]);
        setGroup('');
        setAdded(true);
      }
    } else if(toAdd.changed) {
      setGroup(prev => prev = '');
      setGroups(toAdd.result);
      setGroup('');
      setAdded(false);
    }
  }

  const handleOpenModal = (index) => {
    setClickedIndex(index);
    setIsDeleteGroupOpen(true);
  }

  const handleDeleteGroupFunc = () => {
    handleDeleteGroup(clickedIndex);
    setClickedIndex(null);
    setIsDeleteGroupOpen(false);
  }
	  return (
    <>
			{ 
				isInstitutionSuccess && 
				<>

					<h1 className="text-center text-xl font-bold py-5">Novi raspored</h1>
					<div className="mb-4">
						<Input id="title" type="text" name="Naslov rasporeda" inputVal={props.title} setVal={(elem) => setTitle(elem.target.value)} placeholder="Raspored predavanja i vežbi" />
					</div>

					<div className="mb-4">
						<Input id="subtitle" type="text" name="Podnaslov rasporeda" inputVal={props.subtitle} setVal={(elem) => setSubtitle(elem.target.value)} placeholder="Raspored na odseku za informatiku u letnjem semestru 2023/24" />
					</div>

					<div className="mb-4">
						<Input id="comment" type="text" name="Komentar nakon rasporeda" inputVal={props.comment} setVal={(elem) => setComment(elem.target.value)} placeholder="Nastava po ovom rasporedu održavaće se svake dve nedelje" />
					</div>

					<div className="mb-4">
						<label className="label-primary">Odsek, razred, odeljenje...</label>
						<SelectComponent data={institutionData.departments.map((item) => ({
							value: item, label: item
							}))} 
							placeholder={`Izaberite ${systemType.value === 'school' ? 'razred, odeljenje' : 'odsek, katedru'}`}
							value={props.department}
							setVal={(e) => setDepartment(e)}
							required={true} 
							isClearable={false}
						/>
					</div>

					<div className="mb-4">
						<label className="label-primary">Stil rasporeda</label>
						<SelectComponent 
							data={scheduleStyles} 
							value={props.style}
							setVal={(e) => setStyle(e)}
							required={true} 
							isClearable={false}
							placeholder="Izaberite stil rasporeda"
						/>
					</div>

					<div className="mb-4">
						<label className="label-primary">Tip rasporeda</label>
						<SelectComponent data={scheduleTypes}
							placeholder={`Izaberite tip rasporeda`}
							value={systemType}
							setVal={(e) => setSystemType(e)}
							required={true} 
							isClearable={false}
						/>
					</div>

					
					{ added || groups.length > 1 ? 
						groups.map((gr, i) => <>
							<div className="flex flex-row justify-between mt-2">
								<div>{i + 1}</div>
								<p>{gr}</p>
								<div className="flex justify-center cursor-pointer hover:bg-red-200 text-red-500 rounded-sm" onClick={() => handleOpenModal(i)}><Trash /></div> 
							</div>
						</>)
					: null }

					<div className="mb-4">
						<label htmlFor="groups" className="label-primary">Grupe</label>
						<div className="w-full flex mb-4 gap-1">
							<input id="groups" className="input-primary w-1/2 md:w-2/3 lg:w-3/4 xl:w-4/5" type="text" onChange={(elem) => setGroup(elem.target.value)} ref={inputRef} value={group} onKeyUp={(elem) => handleAddGroup(elem)} placeholder="Unesite godine, razrede, odeljenja..."/>
							<button className="input-primary w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 btn-plus" onClick={() => handleAddGroup(inputRef.current, null)}><PlusCircle /></button>
						</div>
					</div>

					<div className="mb-4">
						<label htmlFor="date" className="label-primary">Važi do: </label>
						<input id="date" className="input-primary" type="date" onChange={(elem) => setValidUntil(elem.target.value)} value={props.validUntil} />
						<span className="block text-xs font-bold text-muted">*Ostavite prazno ukoliko ne želite da naznačite</span>
					</div>
				</>
			}

      { isDeleteGroupOpen ? 
        <ModalDelete title={'Brisanje grupe'} text={`Obrisaćete grupu '${groups[clickedIndex]}' i sve informacije o njoj (predmete u rasporedu, termine itd.). Da li ste sigurni?`} closeFunc={() => setIsDeleteGroupOpen(false)}>
          <button className="btn-primary bg-primary " onClick={() => setIsDeleteGroupOpen(false)}>Odustani</button>
          <button className="btn-primary btn-red" onClick={handleDeleteGroupFunc}>Potvrdi</button>
        </ModalDelete>
        : null
      }
    </>
  )
}

export default ScheduleScreenOne;