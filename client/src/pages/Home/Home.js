import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Clock8, MoonStar, Sun } from "lucide-react";
import { setTheme } from "../../app/slices/settingsSlice";
import RedarStats from "../../components/RedarStats/RedarStats";

const Home = () => {
	const session = useSelector(state => state.session);
	const dispatch = useDispatch();
	

	const changeTheme = (theme = 'light') => {
		dispatch(setTheme(theme));
	}

  return (
		<>
			<Helmet>
				<title>Rasporedar</title>
			</Helmet>
			<section id="hero" className="w-full min-h-[280px] h-[calc(100vh-76px)] bg-home-day dark:bg-home-night bg-cover relative">
				<div className="absolute w-full h-full bg-black/70 flex flex-col gap-2 justify-center items-center">
					<h1 className="font-bold text-3xl text-white uppercase">Rasporedar</h1>
					<p className="font-semibold text-xl text-white">Redar rasporeda časova</p>
					<div className="flex justify-center gap-2">
						<Link className="btn-primary bg-primary" to="/about">
							O nama
						</Link>
						{
							!session.refreshToken ?
							<Link className="btn-primary btn-green" to="/register">
								Pridruži se
							</Link>
							:
							<Link className="btn-primary btn-green" to="/institutions">
								Moje grupe
							</Link>
						}
					</div>
				</div>

				<div className="absolute hidden lg:block right-6 bottom-6 bg-redar dark:bg-megumin w-[256px] h-[256px] bg-cover hover:animate-bounce transition-transform"></div>
			</section>

			<section id="about" className="py-5 mx-5 md:mx-32 lg:mx-56 xl:mx-72 text-pretty">
				<h1 className="font-bold text-xl text-primary text-center">Zašto rasporedar?</h1>
				<p>Da li i dalje ručno pravite svoje rasporede časova? Da li se dešava da zbog nesuglasica sa kolegama morate pomerati svoja predavanja? Da li Vaši studenti/učenici imaju problema sa pamćenjem koje predavanje drži koji profesor?</p>
				<p>Ukoliko je odgovor na neko od ovih pitanja <span className="font-bold">'DA'</span>, došli ste na pravo mesto - na Rasporedar.</p>
				<h2 className="font-bold text-lg my-2">Šta nudi Rasporedar?</h2>
				<p>Rasporedar nudi širok spektar mogućnosti koje se tiču sistema upravljanja rasporedima, pomaže nastavnom osoblju da kreiraju najbolje moguće rasporede, sa najmanjom mogućom mukom, a istovremeno pomaže učenicima da saznaju detalje, kako predmeta, tako nastavnog osoblja i rasporeda časova.</p>
				<p>Trenutno, usluge koje nudi Rasporedar su:</p>
				<div className="grid grid-cols-1 xl:grid-cols-2">
					<div className="col-span-1 flex flex-col justify-between">
						<h3 className="font-bold my-1">Za administraciju</h3>
						<ul className="list-disc mx-8">
							<li>Pravljenje grupa za odredjenu školsku instituciju</li> 
							<li>Pravljenje i uredjivanje odseka/odeljenja u samoj grupi</li>
							<li>Dodavanje predmeta i profesora</li>
							<li>Dodavanje profesora na predmete, tj. predmete profesoru</li>
							<li>Pravljenje rasporeda sa različitim periodom aktivnosti</li>
							<li>Provera dostupnosti profesora u datom terminu</li>
							<li>Provera dostupnosti učionice/sale/kabineta u datom terminu</li>
							<li>Korišćenje predefinisanih stilova za personalizaciju samog rasporeda</li>
						</ul>
						{
							session.refreshToken && 
							<div className="w-full flex justify-center mt-2">
								<Link className="btn-primary btn-green" to="/institutions/create">
									Napravi grupu
								</Link>
							</div>
						}
						
					</div>
					<div className="col-span-1 flex flex-col justify-between">
						<h3 className="font-bold my-1">Za učenike</h3>
						<ul className="list-disc mx-8">
							<li>Pridruživanje grupama pomoću jedinstvenog koda</li> 
							<li>Pronalaženje detalja o predmetu, kao i profesorima koji ih predaju</li>
							<li>Lak pristup osnovnim detaljima profesora</li>
							<li>Povezanost rasporeda sa profesorima i predmetima radi bržeg dolaženja do informacija</li>
							<li>Vrlo lako snalaženje u rasporedu</li>
						</ul>
						{
							session.refreshToken && 
							<div className="w-full flex justify-center mt-2">
								<Link className="btn-primary btn-green" to="/institutions/join">
									Pridruži se grupi
								</Link>
							</div>
						}
					</div>
				</div>
			</section>

			<section id="redari" className="pt-5 pb-10">
				<h1 className="font-bold text-xl text-primary text-center">Upoznajte redare</h1>
				<div className="grid grid-cols-1 xl:grid-cols-2 p-4 gap-6">
					<div className="relative col-span-1 flex flex-col gap-2 lg:flex-row items-center p-8 border-0 border-black bg-secondary md:border-2 md:box-shadow-lg">
						<div className="absolute top-2 right-2">
							<button aria-label="Promeni u svetlu temu" data-tooltip-id="my-tooltip" data-tooltip-content="Promeni u svetlu temu" onClick={() => changeTheme('light')} className="btn-primary btn-green dark:block hidden self-end"><Sun /></button>
							<span className="btn-primary block dark:hidden self-end"><Sun /></span>
						</div>
						<div className="bg-redar bg-no-repeat bg-cover w-64 h-64 lg:min-w-80 lg:min-h-80"></div>
						<div className="flex-1">
							<h2 className="text-lg font-bold flex gap-2 items-center">Redar Raspo <Sun size={20} /></h2>
							<div className="flex items-center gap-1">
								<Clock8 size={16} />
								<p className="font-semibold">Radno vreme 08:00 - 20:00</p>
								
							</div>
							<RedarStats stats={[2, 4, 5, 3]} />
							<div className="mt-1 flex flex-col gap-2 text-pretty">
								<p>Raspo je redar koji je odan poslu, pogodan za sve ranoranioce i one koji žele svoj posao da završe na pravi način.</p>
								<p>Služi se metodama korišćenja crnog teksta na beloj pozadini koji je najpovoljniji za ljudsko oko - umara ga najmanje i time podstiče najveću produktivnost.</p>
								<p>Sija neverovatnom svetlošću što je pogodno za sve ljude sa dobrim vidom, pri tom, poboljšavajući ljudsku percepciju što povećava fokus na najsitnije detalje Vaših rasporeda.</p>
							</div>
						</div>
					</div>

					<div className="relative col-span-1 flex flex-col gap-2 lg:flex-row items-center p-8 border-0 border-black bg-secondary md:border-2 md:box-shadow-lg">
						<div className="absolute top-2 right-2">
							<button aria-label="Promeni u tamnu temu" data-tooltip-id="my-tooltip" data-tooltip-content="Promeni u tamnu temu" onClick={() => changeTheme('dark')} className="btn-primary btn-green block dark:hidden self-end"><MoonStar /></button>
							<span className="btn-primary btn-primary dark:block hidden self-end"><MoonStar /></span>
						</div>
						<div className="flex-1">
							<h2 className="text-lg font-bold flex gap-2 items-center">Redar Ksemis <MoonStar size={20} /></h2>
							<div className="flex items-center gap-1">
								<Clock8 size={16} />
								<p className="font-semibold">Radno vreme 20:00 - 08:00</p>
	
							</div>
							<RedarStats stats={[4, 5, 3, 5]} />
							<div className="mt-1 flex flex-col gap-2 text-pretty">
								
								<p>Noćna sova koja je kul, popularna i moderna, preko 80% korisnika interneta se slaže sa njom da je crna nova narandžasta.</p>
								<p>Čuva Vaše oči prilikom kreiranja rasporeda i iskustvo prilikom kreiranja istog može da se poredi sa epovima antike ili fantastikom sa... vešticama?</p>
								<p>Osećaj pravljenja rasporeda u njenom prisustvu podseća na hladne letnje večeri.</p>
								
							</div>
						</div>
						<div className="bg-megumin bg-no-repeat bg-cover w-64 h-64 lg:min-w-80 lg:min-h-80"></div>
					</div>
				</div>
			</section>

			<footer id="end" className="py-5 border-t-2 border-black bg-secondary">
				<p className="text-center">&copy; Isailović Jovan 2024</p>
			</footer>

		</>
  )
}

export default Home;