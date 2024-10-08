import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { StrictMode } from 'react';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Navbar from './components/Navbar/Navbar';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Profile from './pages/Profile/Profile';

import Institutions from './pages/Institutions/Institutions';
import CreateInstitution from './pages/CreateInstitution/CreateInstitution';
import JoinInstitution from './pages/JoinInstitution/JoinInstitution';
import Institution from './pages/Institution/Institution';
import InstitutionEdit from './pages/InstitutionEdit/InstitutionEdit';
import InstitutionUsers from './pages/InstitutionUsers/InstitutionUsers';

import Professors from './pages/Professors/Professors';
import Professor from './pages/Professor/Professor';
import ProfessorsAdd from './pages/ProfessorsAdd/ProfessorsAdd';
import ProfessorsEdit from './pages/ProfessorsEdit/ProfessorsEdit';

import Subject from './pages/Subject/Subject';
import Subjects from './pages/Subjects/Subjects';
import SubjectsAdd from './pages/SubjectsAdd/SubjectsAdd';
import SubjectsEdit from './pages/SubjectsEdit/SubjectsEdit';

import RouteInInstitution from './components/auth/RouteInInstitution';

import Schedules from './pages/Schedules/Schedules';
import Schedule from './pages/Schedule/Schedule';
import SchedulesAdd from './pages/SchedulesAdd/SchedulesAdd';
import SchedulesEdit from './pages/SchedulesEdit/SchedulesEdit';

import { ToastContainer } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import TokenRequired from './components/auth/TokenRequired';
import Dashboard from './pages/admin/Dashboard';
import AdminInstitutions from './pages/admin/AdminInstitutions';
import Users from './pages/admin/Users';
import RoleGuard from './components/auth/RoleGuard';


// add InInstitution authentication
// add RoleInInstitution authorization

function App() {
	const theme = useSelector(state => state.settings.theme);

  return (
    <StrictMode>
			<div className={`min-h-[calc(100vh-76px)] ${theme === 'dark' ? 'dark' : ''}`}>
				<BrowserRouter>
					<div className="block mb-[76px]">
						<Navbar />
					</div>

					<Tooltip opacity={1} id="my-tooltip" className="z-[9999]" delayShow={400} />
					<ToastContainer />

					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/about" element={<About />} />

						{/* Add access token here for these */}
						<Route element={<TokenRequired />}>
							
							<Route path="/my_profile" element={<Profile />} />

							<Route path="/institutions" element={<Institutions />} />
							
							<Route path="/institutions/create" element={<CreateInstitution />} />
							<Route path="/institutions/join/:type/:jCode" element={<JoinInstitution />} />
							<Route path="/institutions/join/:type/" element={<JoinInstitution />} />
							<Route path="/institutions/join/" element={<JoinInstitution />} />

							{/* Everyone in the institution can access these */}
							<Route element={<RouteInInstitution requiredRoles={['User', 'Moderator', 'Owner']}/>}>
								<Route path="/institutions/:institution" element={<Institution institution=':institution' />} />
								<Route path="/institutions/:institution/professors" element={<Professors institution=':institution'/>}/>
								<Route path="/institutions/:institution/professors/:id" element={<Professor institution=':institution' id=':id' />}/>
								<Route path="/institutions/:institution/subjects" element={<Subjects institution=':institution' />}/>
								<Route path="/institutions/:institution/subjects/:id" element={<Subject institution=':institution' id=':id'/>} INDX( 	 �3�   �      @      �       1 E B � ~                                   �N    � �     �U    B�ֹ��U2�6���U2�6���U2�6��� 0      �,              (6 3 B 8 6 6 8 F A E 5 9 B 8 E 2 6 9 1 E F 5 8 F 4 6 F 6 7 1 F C 4 9 0 0 2 E A 0       �N    h R     �U    B�ֹ��U2�6���U2�6���U2�6��� 0      �,              6 3 B 8 6 6 ~ 1 D 8 2 �    � �     �U    f���s ���s ���s ���       #              (6 3 B 9 6 F B D D 8 2 1 B C 8 0 6 0 7 4 7 A 6 A 1 6 4 A 9 B A 2 6 A  2 3 0 D D       �    h R     �U    f���s ���s ���s ���       #              6 3 B 9 6 F ~ 1 F 6 6 B�    � �     �U    m.�h���m.�h���m.�h���m.�h��� �      Γ              (6 3 B 9 C 8 6 F C E 5 2 B 9 C 6 7 2 F 0 A A 5 A 3 D 4 7 B B F 3 D 0 9 8 2 8 3 7       B�    h R     �U    m.�h���m.�h���m.�h���m.�h��� �      Γ              6 3 B 9 C 8 ~ 1 3 A B ;2    � �     �U    ��~����2�~����2�~����2�~��� `      \              (6 3 B B 1 1 0 F 3 C C 3 8 C 3 6 6 F  6 8 1 C 5 5 5 7 5 F 3 B 9 C 9 7 4 A 6 1 6       ;2    h R     �U    ��~����2�~����2�~����2�~��� `      \              6 3 B B 1 1 ~ 1 3 A B �N    � �     �U    J�#{���J�#{���J�#{���J�#{��� @      �:              (6 3 B C A 3 8 C 8 3 C 3 2 3 B 1 9 7 6 9 9 A 4 9 9 1 D 7 F 1 D 5 5 C 0 3 0 7 5 0       �N    h R     �U    J�#{���J�#{���J�#{���J�#{��� @      �:              6 3 B C A 3 ~ 1 3 A B �O    � �     �U    ��5�����5�����5�����5��� 0      P+              (6 3  E 2 0 9 0 6 A 0 C B B C F E 2 C 3 8 7 9 E D 5 4 E A 8 3 C 2 D B F 9 9 1 B       �O    h R     �U    ��5�����5�����5�����5��� 0      P+              6 3 B E 2 0 ~ 1 3 A B �     � �     �U    &/W�H��р��H�� �H��р��H�� 0      �'              (6 3 B E F 9 0 2 3 A B 0 7 4 D B D 0 9 1 B 9 A 5 D 3 5 4 8 0 9 C E F C 6 5 5 7 4       �     h R     �U    &/W�H��р��H�� �H��р��H�� 0      