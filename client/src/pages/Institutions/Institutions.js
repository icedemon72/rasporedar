import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllQuery } from '../../app/api/institutionsApiSlice';
import { Link } from 'react-router-dom';
import { CalendarFold, Crown, Shield, CircleUserRound, GraduationCap, LibraryBig } from 'lucide-react';

const Institutions = () => {
  const session = useSelector(state => state.session);

  const { data: institutions, isLoading, isSuccess, isError, error } = useGetAllQuery(undefined, {
    skip: !session.accessToken
  });

  useEffect(() => {
    document.title = 'Moje grupe | Rasporedar';
  }, [ session.accessToken ]);

  let InstitutionsContent;

  if(isLoading) {
    InstitutionsContent = <h1>Loading</h1>
  } else if (isSuccess) {
    
    InstitutionsContent = institutions.map(elem => {
      return (
        <>
          <div className="min-w-full min-h-full rounded overflow-hidden grid content-between place-self-center border-2 border-gray-100">
            <Link to={`/institutions/${elem._id}`}>
              <div className="px-6 py-4">
                <div className="font-bold text-xl hover:underline">{ elem.name.length < 25 ? elem.name : `${elem.name.slice(0, 22)}...` }</div>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Link className="hover:bg-slate-400 p-1 rounded-sm" to={`/institutions/${elem._id}/schedules/`}>
                      <CalendarFold />
                    </Link>
                    <Link className="hover:bg-slate-400 p-1 rounded-sm" to={`/institutions/${elem._id}/professors/`}>
                      <GraduationCap />
                    </Link>
                    <Link className="hover:bg-slate-400 p-1 rounded-sm" to={`/institutions/${elem._id}/subjects/`}>
                      <LibraryBig />
                    </Link>
                  </div>
                  <div>
                    { elem.role === 'Owner' ? <Crown color="green" /> : elem.role === 'Moderator' ? <Shield /> : <CircleUserRound /> }
                  </div>
                </div>
              </div>
            </Link>
          </div>    
        </>
      );
    }) 
  } else if (isError) {
    if(error.originalStatus < 215) {
      InstitutionsContent = error.data;
    } else {
      InstitutionsContent = <>{error.message}</>
    }
  }

  return (
    <>
    <div className="">
      <div className="grid place-content-stretch grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        { InstitutionsContent }
      </div>
    </div>
    </>
  )
}



export default Institutions;