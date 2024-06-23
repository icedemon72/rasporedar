import { addProfessor, deleteProfessor, editProfessor, getAllProfessorsInInstitution, getAllProfessorsInSubject, getProfessorById } from '../services/professorService.js';
import { isObjectIdValid } from '../utils/utils.js';

export const handleAddProfessor = async (req, res) => {
  try {
    const data = {
      ...req.body,
      institution: req.params.institution
    }

    const done = await addProfessor(data);
    return res.status(201).send(done)
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleDeleteProfessor = async (req, res) => {
  try {
    const done = await deleteProfessor(req.params.professor);
    
		return res.status(201).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleEditProfessor = async (req, res) => {
  try {
    const done = await editProfessor(req.params.professor, req.body);
    
    return res.status(200).send(done);  
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}


// GET
export const handleGetProfessor = async (req, res) => {
  try {
    const done = await getProfessorById(req.params.professor);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleGetAllProfessorsInInstitution = async (req, res) => {
  try {
    const done = await getAllProfessorsInInstitution(req.params.institution);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleGetAllProfessorsBySubject = async (req, res) => {
  try {
    const done = await getAllProfessorsInSubject(req.params.subject);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}