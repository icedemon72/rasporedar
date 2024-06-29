import User from '../models/userModel.js';
import Institution from '../models/institutionModel.js';
import InInstitution from '../models/inInstitutionModel.js';
import bcrypt from "bcrypt";

export const registerUser = async (user) => {
	user.role = "User";
	
	const userExists = await User.findOne({ $or: [{ email: user.email }, { username: user.username }] });

	if(userExists) {
		if (userExists.username === user.username) {
			throw {
				status: 401,
				message: 'Korisničko ime već postoji!'
			};
		}

		if(userExists.email === user.email) {
			throw {
				status: 401,
				message: 'E-adresa već postoji!'
			};
		}
	}


	user.password = await bcrypt.hash(user.password, 10);

	await User.create(user);
	return { message: 'Uspešna registracija!', success: true };
}

export const editUser = async (sender, data, changePassword = false) => {
	let userObj;

	if(changePassword) {
		const oldPassword = await bcrypt.hash(data.oldPassword, 10);
		userObj = await User.findOne({ _id: sender, deleted: false, password: oldPassword });
	
		if (!userObj) {
			throw {
				status: 400,
				message: 'Neka od lozinki nije ispravna!'
			};
		}

		data.password = await bcrypt.hash(data.newPassword, 10);
	} else {
		userObj = await User.findOne({ _id: sender, deleted: false });
	}
	
	
	/* just in case */
	data.email = userObj.email;
	data.username = userObj.username;

	await User.updateOne(userObj, data);

	return { message: 'Uspešna izmena informacija!', success: true }

}

// FIXME: add role based check
export const getUserById = async (user) => {
	const userObj = await User.findOne({ _id: user }, {
		password: 0
	});

	if (!userObj) {
		throw {
			status: 400,
			message: `Korisnik sa ID-em '${user}' ne postoji!`
		}
	}

	return userObj;
}

// GET
// FIXME: add fullInfo (if needed I guess)
export const getUserInstitution = async (user, role = 'all') => {
	if (role === 'Owner') {
		const institutionObj = await Institution.find({ createdBy: user, deleted: false }, {
			code: 0, moderatorCode: 0, deleted: 0, createdBy: 0
		});

		return institutionObj;
	}

	const query = (role === 'all') ? { user, left: false } : { user, role, left: false };

	const institutionObj = await InInstitution.find(query, { left: 0 });

	let result = [];

	for (let i = 0; i < institutionObj.length; i++) {
		const obj = await Institution.findOne({ _id: institutionObj[i].institution, deleted: false }, { deleted: 0, code: 0, moderatorCode: 0, __v: 0 }).lean();
		obj.role = institutionObj[i].role;
		result.push(obj);
	}

	return result;
}

const validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}