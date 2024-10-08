import InInstitution from '../models/inInstitutionModel.js';
import Institution from '../models/institutionModel.js'
import { senderInInstitutionObject, ownerSenderInInstitutionObject } from '../utils/serviceHelpers.js';
import { randomBytes } from 'crypto';

export const addInstitution = async (data) => {
	if (data?.deleted) {
		data.deleted = false;
	}

	const result = await Institution.create(data);

	await InInstitution.create({
		user: data.createdBy,
		institution: result._id,
		role: 'Owner',
		left: false
	});

	return { message: `Grupa '${data.name}' uspešno kreirana!`, _id: result._id, success: true }
}

export const deleteInstitution = async (sender, institution) => {
	const institutionToDelete = await Institution.findOne({ _id: institution, deleted: false, createdBy: sender });

	if (!institutionToDelete) {
		throw {
			status: 400,
			message: 'Pogrešan unos!'
		}
	}

	institutionToDelete.deleted = true;

	await InInstitution.updateMany({ institution: institutionToDelete._id }, { $set: { left: true } });
	await institutionToDelete.save();
	return { message: 'Grupa je uspešno obrisana!' };
}

export const editInstitution = async (sender, institution, data) => {
	const institutionObj = await Institution.findOne({ createdBy: sender, _id: institution });

	if (!institutionObj) {
		throw {
			status: 404,
			message: 'Pogrešna grupa!'
		}
	}

	await Institution.updateOne({ _id: institutionObj._id }, {
		$set: {
			name: data.name,
			typeOf: data.typeOf,
			departments: data.departments
		}
	});

	return { message: 'Grupa uspešno izmenjena!', success: true };
}

export const getInstitutionById = async (sender, institution, codes = null) => {
	const inInstObject = await senderInInstitutionObject(sender, institution);
	let query = { code: 0, moderatorCode: 0 };

	if (inInstObject.role === 'Owner' && codes) {
		query = {};
	}

	const institutionObj = await Institution.findOne({ _id: institution }, {
		deleted: 0, createdBy: 0, ...query
	});

	if (!institutionObj) {
		throw {
			status: 404,
			message: 'Ne postoji grupa!'
		}
	}

	return institutionObj;
}

export const changeCodes = async (sender, institution, codesToChange = {}) => {
	const { code, moderatorCode } = codesToChange;
	const institutionObj = await ownerSenderInInstitutionObject(sender, institution);

	institutionObj.code = code ? randomBytes(4).toString('hex').toUpperCase() : institutionObj.code;
	institutionObj.moderatorCode = moderatorCode ? randomBytes(4).toString('hex').toUpperCase() : institutionObj.moderatorCode;

	await institutionObj.save();

	return { message: 'Uspešno izmenjen/i kod/ovi!' }
}