import InInstitution from '../models/inInstitutionModel.js';
import Institution from '../models/institutionModel.js'
import { authSenderInInstitutionObject, senderInInstitutionObject } from '../utils/serviceHelpers.js';
import { getUserById } from './userService.js';

export const joinUserInstitution = async (sender, code) => {
	await getUserById(sender); // this function has already got throw handle

	const codeInstitution = await Institution.findOne({ code: code, deleted: false });

	if (!codeInstitution) {
		throw {
			status: 400,
			message: 'Pogrešan kod!'
		}
	}

	const alreadyJoined = await InInstitution.findOne({
		user: sender,
		institution: codeInstitution._id,
		left: false
	});


	if (alreadyJoined) {
		throw {
			status: 400,
			message: 'Već ste učlanjeni!'
		}
	}

	await InInstitution.create({
		user: sender,
		institution: codeInstitution._id
	});

	return { 
		message: `Uspešno ste se učlanili u '${codeInstitution.name}'!`,
		_id: codeInstitution._id
	 };

}

export const joinModeratorInstitution = async (sender, moderatorCode) => {
	const codeInstitution = await Institution.findOne({ moderatorCode, deleted: false });

	if (!codeInstitution) {
		throw {
			status: 400,
			message: 'Pogrešan kod!'
		}
	}

	const alreadyJoined = await InInstitution.findOne({
		user: sender,
		institution: codeInstitution._id,
		left: false
	});

	if (alreadyJoined) {
		if (alreadyJoined.role !== 'User') {
			throw {
				status: 400,
				message: 'Već ste moderator!'
			}
		}

		await InInstitution.updateOne({ _id: alreadyJoined._id }, { $set: { role: 'Moderator' } });

		return { message: `Postali ste moderator!` };
	}

	await InInstitution.create({
		user: sender,
		institution: codeInstitution._id,
		role: 'Moderator'
	});

	return { 
		message: `Uspešno ste se učlanili u ${codeInstitution.name}!`,
		_id: codeInstitution._id
	 };

}

export const leaveInstitution = async (sender, institution) => {
	const userJoined = await InInstitution.findOne({
		user: sender,
		institution,
		left: false
	});

	if (!userJoined) {
		throw {
			status: 404,
			message: 'Ne postoji grupa!'
		}
	}

	if (userJoined.role === 'Owner') {
		throw {
			status: 400,
			message: 'Vlasnik ste grupe, možete je obrisati!'
		}
	}

	await InInstitution.updateOne({ _id: userJoined._id }, { $set: { left: true } });

	return { message: 'Uspešno ste napustili grupu!' };

}

export const promoteToRole = async (institution, user, role) => {
	const userToChange = await InInstitution.findOne({
		user, institution, left: false
	});

	if (!userToChange) {
		throw {
			status: 400,
			message: 'Korisnik nije u grupi!'
		}
	}

	userToChange.role = role;
	await userToChange.save();

	return { message: 'Uspešna promena permisije!' };

}

// GET
// FIXME: add fullInfo
export const getAllUsersInInstitution = async (sender, institution, limit = 10) => {
	const userObj = await InInstitution.findOne({ user: sender, institution, left: false });
	
	if (userObj.role === 'User') {
		const inInstObj = await InInstitution.find({
			institution,
			left: { $in: false }
		},
		{
			role: 0,
			left: 0,
			createdAt: 0,
			updatedAt: 0,
			__v: 0
		}).populate({
			path: 'user',
			match: { left: false }, 
			select: 'name username'
		}); // <- maybe change this later on, depending on front-end

		return inInstObj;
	}

	const inInstObj = await InInstitution.find({ institution, left: false }, { left: 0 }).populate({
		path: 'user',
		match: { left: false }, 
		select: 'name email username'
	});
	return inInstObj;

}

export const getUserRole = async (sender, institution) => {
	const result = await senderInInstitutionObject(sender, institution);
	return { role: result.role };
}

export const getIsUserAuth = async (sender, institution) => {
	const result = await authSenderInInstitutionObject(sender, institution);
	return { role: result.role };
}