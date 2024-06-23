import { editUser, getUserById, getUserInstitution, registerUser } from '../services/userService.js';
import { isObjectIdValid } from '../utils/utils.js';
// POST
export const handleUserRegister = async (req, res) => {
  try {
    const user = {
      ...req.body
    };

    const done = await registerUser(user);
    return res.status(200).send(done);

  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleEditUser = async (req, res) => {
  try {
		let password = false;
		if(req.body.oldPassword && req.body.newPassword) {
			password = true;
		}

    const done = await editUser(req.userTokenData._id, req.body, password);
    return res.status(200).send(done);

  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

// GET
export const handleGetUserInstitutions = async (req, res) => {
  try {
    const roles = ['Owner', 'Moderator', 'User'];

    if(!roles.includes(req.query.role) || !req.query.role) {
      req.query.role = 'all';
    }

    if(!req.params.id) {
      req.params.id = req.userTokenData._id;
    }

    if(req.userTokenData.role === 'User' && req.params.id !== req.userTokenData._id) {
      return res.status(405).send({ message: 'Nemate pristup!' });
    }
    
    const done = await getUserInstitution(req.params.id, req.query.role);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleGetUserById = async (req, res) => {
  try {
    if(!req.params.id) {
      req.params.id = req.userTokenData._id;
    }

    if(req.userTokenData.role === 'User' && req.params.id !== req.userTokenData._id) {
      return res.status(405).send({ message: 'Nemate pristup!' });
    }

    const done = await getUserById(req.params.id);
		
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}
