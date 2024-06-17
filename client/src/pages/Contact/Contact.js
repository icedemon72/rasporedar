import { Instagram, Mail, Phone } from "lucide-react";
import CardContainer from "../../components/CardContainer/CardContainer";
import Input from "../../components/Input/Input";
import { useState } from "react";
import Textarea from "../../components/Input/Textarea";
import { Helmet } from "react-helmet";

const Contact = () => {
	const [ email, setEmail ] = useState('');
	const [ name, setName ] = useState('');
	const [ message, setMessage ] = useState('');

  return (
    <>
			<Helmet>
				<title>Kontakt | Rasporedar</title>
			</Helmet>
			<CardContainer>
			<h1 className="text-xl font-bold text-center py-5">Kontakt informacije</h1>
			
			<h2 className="text-lg font-semibold">Pošaljite nam poruku!</h2>
			<form>
				<div className="mb-4">
					<Input 
						id="email"
						name="E-adresa"
						type="email"
						placeholder="marko.markovic@primer.com"
						setVal={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</div>
				<div className="mb-4">
					<Input 
						id="name"
						name="Ime i prezime"
						type="text"
						placeholder="Marko Marković"
						setVal={(e) => setName(e.target.value)}
						value={name}
					/>
				</div>
				<div className="mb-4">
					<Textarea 
						id="message"
						name="Poruka"
						placeholder="Naišao/la sam na problem prilikom korišćenja Rasporedara"
						setVal={(e) => setMessage(e.target.value)}
						value={message}
					/>
				</div>

				<div className="flex justify-end mb-6">
					<button className="btn-primary btn-green transition-all w-full lg:max-w-[270px]">Pošalji poruku</button> 				
				</div>
			</form>
			
			<h2 className="text-lg font-semibold">Preferirate lični kontakt?</h2>
				<div className="grid grid-cols-1 md:grid-cols-2">
					
					<div className="col-span-1">
						<p className="font-semibold">E-adresa</p>
						<div className="flex gap-2 mb-2">
							<Mail />
							jsailovic72@gmail.com
						</div>
					</div>

					<div className="col-span-1">
						<p className="font-semibold">Instagram</p>
						<a href="https://www.instagram.com/jsailovic" target="_blank" className="flex gap-2">
							<Instagram />
							jsailovic
						</a>	
					</div>

					<div className="col-span-1">
						<p className="font-semibold">Telefon</p>
						<div className="flex gap-2">
							<Phone />
							+381 64-123-4567
						</div>
					</div>
				</div>
				
			</CardContainer>
		</>
  )
}

export default Contact;