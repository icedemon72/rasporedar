import { useState } from 'react'

const ScheduleTimeAdd = ({
  indexes, closeFunc, submitFunc
}) => {
  const [ startTime, setStartTime ] = useState('');
  const [ endTime, setEndTime ] = useState('');

  const handleAdd = () => {
    if(startTime && endTime) {
      if(startTime > endTime) {
        // add error
      } else {
        submitFunc(startTime, endTime);
      }
    }
  }

  
  return (
    <>
      <div className="fixed left-0 top-0 z-[1054] h-full w-full overflow-y-auto overflow-x-outline-none bg-black bg-opacity-80 flex justify-center items-center" >
        <div className="fixed left-0 top-0 h-full w-full z-[1055]" onClick={closeFunc} ></div>
        <div className="w-[400px] h-[500px] z-[1056] bg-white rounded-md py-8 px-16 flex flex-col justify-around">
          { indexes.i + 1}. čas
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Termin</label>
            <div className="flex items-center w-full gap-3 mt-3">
              <div className="flex-col basis-1/2">
                <label className="block text-gray-700 text-xs font-bold uppercase">Od</label>
                <input type="time" className="input-field" step="3600" min="00:00" max="23:59" pattern="[0-2][0-9]:[0-5][0-9]" onChange={(elem) => setStartTime(elem.target.value)}/>
              </div>
              <div className="flex-col basis-1/2">
                <label className="block text-gray-700 text-xs font-bold uppercase">Do</label>
                <input type="time" className="input-field basis-1/2" step="3600" min="00:00" max="23:59" pattern="[0-2][0-9]:[0-5][0-9]" onChange={(elem) => setEndTime(elem.target.value)}/>
              </div>
            </div>
            <span className="text-xs block text-slate-500 mt-2">*AM = prepodne, PM = poslepodne</span>
            <span className="text-xs block text-slate-500">(08:00PM = 20:00)</span>         
          </div>
          <div className="flex w-full gap-5 mt-5">
            <div className="btn-red text-center cursor-pointer w-full" onClick={closeFunc}>Otkaži</div>
            <div className="btn-green text-center cursor-pointer w-full" onClick={handleAdd}>Dodaj termin</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ScheduleTimeAdd;