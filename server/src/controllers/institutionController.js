import { randomBytes } from 'crypto';
import { addInstitution, deleteInstitution, editInstitution, getInstitutionById, changeCodes } from '../services/institutionService.js';

import { isObjectIdValid } from '../utils/utils.js';


export const handleAddInstitution = async (req, res) => {
  try {
    // code gen -> {first 3 letters of the username}{first 3 letters of the institution name}{4 bit code} randomly shuffled
    // mode gen -> {8 bit code}{first 3 letters of the username}{first 3 letters of the institution name} randomly shuffled
    
    // const username = req.userTokenData.username;
    
    // const usernameSlice = (username.length >= 3) ?  username.slice(0, 3) : username;
    // const institutionNameSlice = (req.body.name.length >= 3) ? req.body.name.slice(0, 3) : req.body.name;

    // const randomGeneratedJoinCode = randomBytes(4).toString('hex');
    // const randomGeneratedModeratorCode = randomBytes(4).toString('hex');
    
    const joinCode = randomBytes(4).toString('hex').toUpperCase(); //generateSecretCodes(usernameSlice, institutionNameSlice, randomGeneratedJoinCode);
    const moderatorCode = randomBytes(4).toString('hex').toUpperCase(); //generateSecretCodes(usernameSlice, institutionNameSlice, randomGeneratedModeratorCode)
  
    // add error handling here...

    const data = {
      ...req.body,
      code: joinCode,
      moderatorCode,
      createdBy: req.userTokenData._id
    }

    const done = await addInstitution(data);

    return res.status(201).json(done);

  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleDeleteInstitution = async (req, res) => {
  try {
    const done = await deleteInstitution(req.userTokenData._id, req.params.institution);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleEditInstitution = async (req, res) => {
  try {    
    const done = await editInstitution(req.userTokenData._id, req.params.institution, req.body);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleChangeCodes = async (req, res) => {
  try {
		const { code, moderatorCode } = req.body;

    if(!code && !moderatorCode) {
      return res.status(400).send({ message: 'Nije naveden kod za promenu!' })
    }

    const done = await changeCodes(req.userTokenData._id, req.params.institution, req.body);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleGetInstitutonById = async (req, res) => {
  try {
    if(!req.query.code) {
      req.query.code = null;
    }

    const done = await getInstitutionById(req.userTokenData._id, req.params.institution, req.query.code);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

const generateSecretCodes = (str1, str2, str3, len = 8) => shuffle([str1, str2, str3].join('').split('')).join('').slice(0, len);

const shuffle = (array) => array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);