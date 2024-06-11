import { addProfessor, deleteProfessor, editProfessor, getAllProfessorsInInstitution, getAllProfessorsInSubject, getProfessorById } from '../services/professorService.js';
import { isObjectIdValid } from '../utils/utils.js';

export const handleAddProfessor = async (req, res) => {
  try {
    if(!isObjectIdValid(req.params.institution).valid) {
      return res.status(400).send(isObjectIdValid(req.params.institution).message);
    }

    const data = {
      ...req.body,
      institution: req.params.institution
    }

    const done = await addProfessor(req.userTokenData._id, data);
    return res.status(201).send(done)
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleDeleteProfessor = async (req, res) => {
  try {
    if(!isObjectIdValid(req.params.professor).valid) {
      return res.status(400).send(isObjectIdValid(req.params.professor).message);
    }

    const done = await deleteProfessor(req.userTokenData._id, req.params.professor);
    return res.status(201).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleEditProfessor = async (req, res) => {
  try {
    if(!isObjectIdValid(req.params.professor).valid) {
      return res.status(400).send(isObjectIdValid(req.params.professor).message);
    }

    const done = await editProfessor(req.userTokenData._id, req.params.professor, req.body);
    
    return res.status(200).send(done);
    
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}


// GET
export const handleGetProfessor = async (req, res) => {
  try {
    const done = await getProfessorById(req.userTokenData._id, req.params.professor);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleGetAllProfessorsInInstitution = async (req, res) => {
  try {
    if(!isObjectIdValid(req.params.institution).valid) {
      return res.status(400).send(isObjectIdValid(req.params.institution).message);
    }

    const done = await getAllProfessorsInInstitution(req.userTokenData._id, req.params.institution);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleGetAllProfessorsBySubject = async (req, res) => {
  try {

    if(!isObjectIdValid(req.params.subject).valid) {
      return res.status(400).send(isObjectIdValid(req.params.subject).message);
    }

    const done = await getAllProfessorsInSubject(req.userTokenData._id, req.params.subject);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}