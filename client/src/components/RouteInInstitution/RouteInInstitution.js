import { useParams, Navigate, Outlet } from 'react-router-dom';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { useSelector } from 'react-redux';

export const RouteInInstitution = ({
  path,
  requiredRoles,
  ...rest
}) => {

  const { institution } = useParams();
  const session = useSelector(state => state.session);

  const { 
    data: getRole, 
    isLoading: isGetRoleLoading, 
    isSuccess: isGetRoleSuccess, 
    isError: isGetRoleError,
    error: getRoleError 
  } = useGetRoleQuery(institution, { skip: !session.accessToken  });
  
  if(!isGetRoleLoading && isGetRoleSuccess) {
    // TODO: add accessToken support here!
    return (requiredRoles.indexOf(getRole?.role) !== -1) ? <Outlet /> : <Navigate to="/error" replace/>
  }
};

export default RouteInInstitution;