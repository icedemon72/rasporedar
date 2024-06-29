import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AboutData as data } from "./AboutData";

import CardContainer from "../../components/CardContainer/CardContainer";
import CollapseContainer from "../../components/CollapseContainer/CollapseContainer";

const About = () => {
	const session = useSelector(state => state.session);

  return (
    <>
			<Helmet>
				<title>O nama | Rasporedar</title>
			</Helmet>
			<CardContainer xlarge={true} onTop={true} containerBgClass="bg-image-primary">
				<h1 className="text-xl font-bold py-5 text-center">O nama</h1>
				<section id="about" className="text-pretty">
					<h1 className="font-bold text-lg text-primary my-2">Zašto rasporedar?</h1>
					<p>Da li i dalje ručno pravite svoje rasporede časova? Da li se dešava da zbog nesuglasica sa kolegama morate pomerati svoja predavanja? Da li Vaši studenti/učenici imaju problema sa pamćenjem koje predavanje drži koji profesor?</p>
					<p>Ukoliko je odgovor na neko od ovih pitanja <span className="font-bold">'DA'</span>, došli ste na pravo mesto - na Rasporedar.</p>
					
					<h2 className="font-bold text-lg my-2">Šta nudi Rasporedar?</h2>
					<p>Rasporedar nudi širok spektar mogućnosti koje se tiču sistema upravljanja rasporedima, pomaže nastavnom osoblju da kreiraju najbolje moguće rasporede, sa najmanjom mogućom mukom, a istovremeno pomaže učenicima da saznaju detalje, kako predmeta, tako nastavnog osoblja i rasporeda časova.</p>
					<p>Trenutno, usluge koje nudi Rasporedar su:</p>
					
					<div className="grid grid-cols-1 xl:grid-cols-2 mt-4">
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

				<section id="faq" className="">
					<h1 className="font-bold text-lg text-primary py-5">FAQ</h1>
					
					{
						data.map((question, index) => 
							<CollapseContainer label={`${index + 1}. ${question.label}`} data={question.answer} isOpen={false} />
						)
					}
				</section>

			</CardContainer>
		</>
  )
}

export default About;