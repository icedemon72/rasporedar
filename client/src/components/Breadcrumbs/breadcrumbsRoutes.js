export const routes = [
	{
    path: "/",
    breadcrumb: 'Početna',
  },
	{ 
		path: "/institutions/", 
		breadcrumb: "Sve grupe" 
	},
	{
		path: '/institutions/:institution',
		breadcrumb: 'Grupa'
	},
	{
    path: "/institutions/:institution/professors",
    breadcrumb: 'Svi profesori',
  },
	{
    path: "/institutions/:institution/professors/add",
    breadcrumb: 'Dodaj profesora',
  },
	{
    path: "/institutions/:institution/professors/:id",
    breadcrumb: 'Profesor',
  },
	{
    path: "/institutions/:institution/professors/:id/edit",
    breadcrumb: 'Uredi profesora',
  },
	{
    path: "/institutions/:institution/subjects/",
    breadcrumb: 'Svi predmeti',
  },
	{
    path: "/institutions/:institution/subjects/add",
    breadcrumb: 'Dodaj predmet',
  },
	{
    path: "/institutions/:institution/subjects/:id",
    breadcrumb: 'Predmet',
  },
	{
    path: "/institutions/:institution/subjects/:id/edit",
    breadcrumb: 'Uredi predmet',
  },
	{
    path: "/institutions/:institution/schedules/",
    breadcrumb: 'Rasporedi',
  },
	{
    path: "/institutions/:institution/schedules/:id",
    breadcrumb: 'Raspored',
  },
];