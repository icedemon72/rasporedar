import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Navbar from './components/Navbar/Navbar';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';

import Institutions from './pages/Institutions/Institutions';
import CreateInstitution from './pages/CreateInstitution/CreateInstitution';
import JoinInstitution from './pages/JoinInstitution/JoinInstitution';
import Institution from './pages/Institution/Institution';
import InstitutionEdit from './pages/InstitutionEdit/InstitutionEdit';

import Professors from './pages/Professors/Professors';
import Professor from './pages/Professor/Professor';
import ProfessorsAdd from './pages/ProfessorsAdd/ProfessorsAdd';
import ProfessorsEdit from './pages/ProfessorsEdit/ProfessorsEdit';

import Subject from './pages/Subject/Subject';
import Subjects from './pages/Subjects/Subjects';
import SubjectsAdd from './pages/SubjectsAdd/SubjectsAdd';
import SubjectsEdit from './pages/SubjectsEdit/SubjectsEdit';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          <Route path="/institutions" element={<Institutions />} />
          <Route path="/institutions/:id" element={<Institution id=':id' />} />
          <Route path="/institutions/create" element={<CreateInstitution />} />
          <Route path="/institutions/join" element={<JoinInstitution />} />
          <Route path="/institutions/edit/:id" element={<InstitutionEdit id=':id' />}/>
          
          <Route path="/institutions/:institution/professors" element={<Professors institution=':institution'/>}/>
          <Route path="/institutions/:institution/professors/add" element={<ProfessorsAdd institution=':institution'/>}/>
          <Route path="/institutions/:institution/professors/:id" element={<Professor institution=':institution' id=':id' />}/>
          <Route path="/institutions/:institution/professors/:id/edit" element={<ProfessorsEdit institution=':institution' id=':id' />}/>
        
          <Route path="/institutions/:institution/subjects" element={<Subjects institution=':institution' />}/>
          <Route path="/institutions/:institution/subjects/:id" element={<Subject institution=':institution' id=':id'/>} />
          <Route path="/institutions/:institution/subjects/:id/edit" element={<SubjectsEdit institution=':institution' id=':id'/>} />
          <Route path="/institutions/:institution/subjects/add" element={<SubjectsAdd institution=':institution' />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
