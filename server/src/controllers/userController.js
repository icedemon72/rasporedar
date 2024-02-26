import { editUser, getUserById, getUserInstitution, registerUser } from '../services/userService.js';
import { isObjectIdValid } from '../utils/utils.js';
// POST
export const handleUserRegister = async (req, res) => {
  try {
    // UNCOMMENT THIS HERE AFTER TESTING!
    // if(req.userTokenData) { 
    //   return res.status(401).send({message: 'Već ste ulogovani!'});
    // }
    const user = {
      ...req.body
    };

    const done = await registerUser(user);
    return res.status(200).send(done);

  } catch (err) {
    return res.status(err.status || 500).send(err.message);
  }
}

export const handleEditUser = async (req, res) => {
  try {
    // UNCOMMENT THIS HERE AFTER TESTING!
    // if(req.userTokenData) { 
    //   return res.status(401).send({message: 'Već ste ulogovani!'});
    // }

    // add data null etc check here <---

    const done = await editUser(req.userTokenData._id, req.body);
    return res.status(200).send(done);

  } catch (err) {
    return res.status(err.status || 500).send(err.message);
  }
}

// GET
export const handleGetUserInstitutions = async (req, res) => {
  try {
    // UNCOMMENT THIS HERE AFTER TESTING!
    // if(!req.userTokenData) { 
    //   return res.status(401).send({message: 'No access token'});
    // }

    const roles = ['Owner', 'Moderator', 'User'];

    if(!roles.includes(req.query.role) || !req.query.role) {
      req.query.role = 'all';
    }

    if(!req.params.id) {
      req.params.id = req.userTokenData._id;
    }

    if(!isObjectIdValid(req.params.id).valid) {
      return res.status(400).send(isObjectIdValid(req.params.id).message);
    }

    if(req.userTokenData.role === 'User' && req.params.id !== req.userTokenData._id) {
      return res.status(405).send({ message: 'Nemate pristup!' });
    }
    
    const done = await getUserInstitution(req.params.id, req.query.role);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send(err.message);
  }
}

export const handleGetUserById = async (req, res) => {
  try {
    // UNCOMMENT THIS HERE AFTER TESTING!
    // if(!req.userTokenData) { 
    //   return res.status(401).send({message: 'No access token'});
    // }

    if(!req.params.id) {
      req.params.id = req.userTokenData._id;
    }

    if(!isObjectIdValid(req.params.id).valid) {
      return res.status(400).send(isObjectIdValid(req.params.id).message);
    }

    if(req.userTokenData.role === 'User' && req.params.id !== req.userTokenData._id) {
      return res.status(405).send({ message: 'Nemate pristup!' });
    }

    const done = await getUserById(req.params.id);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send(err.message);
  }
}
