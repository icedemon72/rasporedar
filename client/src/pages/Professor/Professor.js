import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useGetProfessorQuery, useGetProfessorSubjectsQuery } from '../../app/api/professorsApiSlice';
import { useEffect, useState } from 'react';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { Pencil } from 'lucide-react';


const Professor = () => {
  const session = useSelector(state => state.session);
  const { id, institution } = useParams();

  const [ professor, setProfessor ] = useState([]);
  const [ assistent, setAssistent ] = useState([]);

  const {
    data: professorData, 
    isLoading: isProfessorLoading,
    isSuccess: isProfessorSuccess,
    isError: isProfessorError
  } = useGetProfessorQuery(id, {
    skip: !session.accessToken || !id || !institution
  });

  const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    isSuccess: isSubjectsSuccess
  } = useGetProfessorSubjectsQuery(id, {
    skip: !session.accessToken || !professorData
  })

  const { 
    data: getRole, 
    isLoading: isGetRoleLoading, 
    isSuccess: isGetRoleSuccess, 
    isError: isGetRoleError,
    error: getRoleError 
  } = useGetRoleQuery(institution, { skip: !session.accessToken  });
  
  let content;

  if(isSubjectsLoading) {
    content = <>Loading</>
  } else if (isSubjectsSuccess && isProfessorSuccess && isGetRoleSuccess) {
    content = 
    <>
      <p className="input-field mb-4 flex">{professorData.title} {professorData.name}  
        { getRole.role !== 'User' ?
          <Link className="mx-2" to={`/institutions/${institution}/professors/${id}/edit`}><Pencil size={16} /></Link> 
          : null }
      </p>
      <p className="input-field mb-4">{professorData.bio || 'Profesor nema biografiju'}</p>
      <p className="input-field mb-4">{professorData.education?.bachelor?.institution || '-'}</p>
      <div className="flex justify-center gap-3 w-full">
        <p className="input-field mb-4 w-full md:w-1/2">{ professorData.education?.bachelor?.from || '-' }</p>
        <p className="input-field mb-4 w-full md:w-1/2">{ professorData.education?.bachelor?.to || '-' }</p>
      </div>

      <p className="input-field mb-4">{professorData.education?.master?.institution || '-'}</p>
      <div className="flex justify-center gap-3 w-full">
        <p className="input-field mb-4 w-full md:w-1/2">{ professorData.education?.master?.from || '-' }</p>
        <p className="input-field mb-4 w-full md:w-1/2">{ professorData.education?.master?.to || '-'}</p>
      </div>

      <p className="input-field mb-4">{professorData.education?.doctorate?.institution || '-'}</p>
      <div className="flex justify-center gap-3 w-full">
        <p className="input-field mb-4 w-full md:w-1/2">{ professorData.education?.doctorate?.from || '-' }</p>
        <p className="input-field mb-4 w-full md:w-1/2">{ professorData.education?.doctorate?.to || '-'}</p>
      </div>

      <p className="block">Reference:</p>
      
      { professorData?.references.length ? 
        professorData.references.map((elem, i) => {
          return (
            <div className="flex flex-row justify-start gap-2 mt-2">
              <div>{i + 1}</div>
              <p>{ elem }</p>
            </div>
          );
        })
        : <p className="block">-</p>
      }

      Profesor:
      { subjectsData?.professor.length ?
        subjectsData.professor.map(elem => {
          return <p>{elem.name}</p>
        })
      : null}

      { subjectsData?.assistent.length ? 
        <>
        Asistent:
        {  subjectsData.assistent.map(elem => {
          return <p>{elem.name}</p>
        }) }
        </>
       
      : null}
  
    </>
  }

  useEffect(() => {
    document.title = professorData ? `Profesor ${professorData.name} | Rasporedar` : `Profesor | Rasporedar`;
  }, [ isProfessorSuccess ]);
  
  
  return (
    <>      
      <div className="w-full flex justify-center">
        <div className="w-full md:w-1/2 lg:w-1/3 mt-5">
          { content }
        </div>
      </div>
    </>
  )
}

export default Professor;