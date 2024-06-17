import { NavLink } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import clsx from "clsx";
import { routes } from "./breadcrumbsRoutes";

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(routes);
	
  return (
    <div className="hidden md:flex gap-2">
      {
				breadcrumbs.map(({ match, breadcrumb }, index) => (
					<NavLink key={match.pathname} to={match.pathname}>
						<div className="flex gap-2 group text-muted">
							<p className={
								clsx("group-hover:underline", 
								index === breadcrumbs.length - 1 ? 'underline' : '')
							}>
								{ breadcrumb }
							</p>
							{ index !== breadcrumbs.length - 1 && <span>&#9658;</span>}
						</div>
					</NavLink>
				))
			}
    </div>
  );
};

export default Breadcrumbs;