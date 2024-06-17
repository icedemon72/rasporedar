import InInstitution from "../../models/inInstitutionModel.js";
import Institution from "../../models/institutionModel.js";

export const isInInstitution = async (req) => {
	const institution = req.params?.institution;

	if (!institution) return false;

	const user = req.userTokenData?._id;

	try {
		const inInstObj = await InInstitution.findOne({ user, institution, left: false });

		if(!inInstObj) return false
		
		return true;

	} catch (err) {
		return false;
	}
}

export const isAuthInInstitution = async (req) => {
	const institution = req.params?.institution;

	if (!institution) return false;

	const user = req.userTokenData?.id;

	try {
		const inInstObj = await InInstitution.findOne({ user, institution, role: { $in: ['Moderator', 'Owner'] }, left: false });

		if (!inInstObj) return false;

		return true;
		
	} catch (err) {
		return false;
	}
}

export const isOwnerInInstitution = async (req) => {
	const _id = req.params?.institution;

	if (!_id) return false;

	const createdBy = req.userTokenData?.id;

	try {
		const inInstObj = await Institution.findOne({ createdBy, _id, deleted: false });

		if (!inInstObj) return false;

		return true;
		
	} catch (err) {
		return false;
	}

}