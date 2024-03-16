import { useRef, useState } from 'react';
import { addItemToArrayOnKey, deleteItemFromArray } from '../../utils/updateArray';
import { Trash, PlusCircle } from 'lucide-react';

const ScheduleScreenOne = ({
  setTitle, setSubtitle, setComment, setDepartment,
  isInstitutionLoading, isInstitutionSuccess, institutionData,
  setStyle, systemType, setSystemType, setValidUntil, groups, setGroups,
  handleDeleteGroup
}) => {

  // const [ groupsArray, setGroupsArray ] = useState(groups || ['Grupa 1']);
  const [ group, setGroup ] = useState('');
  const [ added, setAdded ] = useState(false);
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

  return (
    <>
      <label className="block text-gray-700 text-sm font-bold mb-2">Naslov rasporeda</label>
      <input className="input-field mb-4" placeholder="Unesite naslov..." onChange={(elem) => setTitle(elem.target.value)} />
      <label className="block text-gray-700 text-sm font-bold mb-2">Podnaslov rasporeda</label>
      <input className="input-field mb-4" placeholder="Unesite podnaslov..." onChange={(elem) => setSubtitle(elem.target.value)} />
      <label className="block text-gray-700 text-sm font-bold mb-2">Komentar nakon rasporeda</label>
      <input className="input-field mb-4" placeholder="Unesite komentar..." onChange={(elem) => setComment(elem.target.value)} />
      <select className="input-field mb-4" onChange={(elem) => setDepartment(elem.target.value)}>
        <option value="0">Izaberite { systemType === 'school' ? 'razred, odeljenje' : 'odsek, katedru' }</option>
        { isInstitutionLoading ? <>Loading...</> : null }
        { isInstitutionSuccess ? 
          institutionData.departments.map(dpt => <option value={ dpt }>{ dpt }</option>)
        : null }
      </select>
      <label className="block text-gray-700 text-sm font-bold mb-2">Stil rasporeda</label>
      <select className="input-field mb-4" onChange={(elem) => setStyle(elem.target.value)}>
        <option value="default">Podrazumevni stil</option>
        <option value="ice">Hladni stil</option>
      </select>
      <label className="block text-gray-700 text-sm font-bold mb-2">Tip rasporeda </label>
      <select className="input-field mb-4" onChange={(elem) => setSystemType(elem.target.value)}>
        <option value="school">Skolski</option>
        <option value="college">Fakultetski</option>
      </select>
      { added || groups.length > 1 ? 
        groups.map((gr, i) => <>
          <div class="flex flex-row justify-between mt-2">
            <div>{i + 1}</div>
            <p>{gr}</p>
            <div class="flex justify-center cursor-pointer hover:bg-red-200 text-red-500 rounded-sm" onClick={() => handleDeleteGroup(i)}><Trash /></div> 
          </div>
        </>)
      : null }
      <label className="block text-gray-700 text-sm font-bold mb-2">Grupe</label>
      <div className="w-full flex mb-4">
        <input className="input-field w-1/2 md:w-2/3 lg:w-3/4 xl:w-4/5" type="text" onChange={(elem) => setGroup(elem.target.value)} ref={inputRef} value={group} onKeyUp={(elem) => handleAddGroup(elem)}/>
        <button className="input-field w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex justify-center" onClick={() => handleAddGroup(inputRef.current, null)}><PlusCircle /></button>
      </div>
      <label className="block text-gray-700 text-sm font-bold mb-2">Vazi do: </label>
      <input className="input-field" type="date" onChange={(elem) => setValidUntil(elem.target.value)} />
      <label className="block text-xs font-bold mb-4 text-gray-500">*Ostavite prazno ukoliko ne zelite da naznacite</label>
    </>
  )
}

export default ScheduleScreenOne;