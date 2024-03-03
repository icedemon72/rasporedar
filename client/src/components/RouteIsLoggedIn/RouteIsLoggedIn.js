import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const RouteIsLoggedIn = () => {
  const session = useSelector(state => state.session);
  const location = useLocation();
  // treba da se proveri koliko jos traje token itd
  return (
    <div>RouteIsLoggedIn</div>
  )
}

export default RouteIsLoggedIn;