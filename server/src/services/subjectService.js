import Subject from '../models/subjectModel.js';
import Professor from '../models/professorModel.js';

export const addSubject = async (data) => {
	// add professors check here!
	const subject = await Subject.create(data);
	return { message: 'Predmet uspešno kreiran!', _id: subject._id }
}

export const deleteSubject = async (subject) => {
	const subjectObj = await Subject.findOne({ _id: subject, deleted: false });

	if (!subjectObj) {
		throw {
			status: 400,
			message: 'Predmet ne postoji!'
		}
	}

	subjectObj.deleted = true;
	await subjectObj.save();

	return { message: 'Uspešno brisanje predmeta!' };
}

export const editSubjectInfo = async (subject, data) => {
	const subjectObj = await Subject.findOne({ _id: subject, deleted: false });

	if (!subjectObj) {
		throw {
			status: 400,
			message: 'Predmet ne postoji!'
		}
	}

	await Subject.updateOne({ _id: subjectObj._id }, {
		$set: {
			name: data.name || subjectObj.name,
			description: data.description || subjectObj.description,
			goal: data.goal || subjectObj.goal,
			result: data.result || subjectObj.result,
			references: data.references || subjectObj.references,
			professors: data.professors || subjectObj.professors,
			assistents: data.assistents || subjectObj.assistents
		}
	});

	return { message: 'Uspešno editovan predmet!' };
}

export const editSubjectProfessor = async (professor, subject, position, action) => {
	const professorObj = await Professor.findOne({ _id: professor, deleted: false });

	if (!professorObj) {
		throw {
			status: 400,
			message: 'Ne postoji profesor!'
		}
	}

	const subjectObj = await Subject.findOne({ _id: subject, deleted: false });

	if (!subjectObj) {
		throw {
			status: 405,
			message: 'Ne postoji predmet!'
		}
	}

	let arrayOfProfessors = (position === 'professor') ? subjectObj.professors : subjectObj.assistents;
	const professorIndex = arrayOfProfessors.indexOf(professorObj._id);
	let updateQuery = {};
	if (action === 'add') {
		if (professorIndex !== -1) {
			throw {
				status: 400,
				message: 'Profesor je već na ovom predmetu',
			}
		}

		arrayOfProfessors.push(professorObj._id);

	} else {
		if (professorIndex === -1) {
			throw {
				status: 400,
				message: 'Profesor nije na ovom predmetu'
			}
		}

		arrayOfProfessors.splice(professorIndex, 1);
	}

	updateQuery = (position === 'professor') ? { professors: arrayOfProfessors } : { assistents: arrayOfProfessors };

	await Subject.updateOne({ _id: subject }, { $set: updateQuery });

	return { message: `Uspešno ste ${(action === 'add') ? 'dodali' : 'obrisali'} profesora!` };
}

export const getAllSubjectsInInstitution = async (institution, fullInfo = false) => {
	const subjectObj = !fullInfo ?
		await Subject.find({ institution, deleted: false }, { deleted: 0 }).sort({ name: 1 })
		: await Subject.find({ institution, deleted: false }, { deleted: 0 })
			.sort({ name: 1 })
			.populate({ path: 'professors assistents', match: { deleted: false }, select: 'name title' });

	return subjectObj;
}

// FIXME: add fullInfo
export const getAllSubjectsOfProfessor = async (professor, fullInfo = false) => {
	const professorObj = await Professor.findOne({ _id: professor, deleted: false });

	if (!professorObj) {
		throw {
			status: 400,
			message: 'Ne postoji profesor!'
		}
	}

	const professorSubjectObj = await Subject.find({
		professors: professor,
		deleted: false
	}, { deleted: 0, professors: 0, assistents: 0 })
		.sort({ name: 1 });


	const assistentSubjectObj = await Subject.find({
		assistents: professor,
		deleted: false
	}, { deleted: 0, professors: 0, assistents: 0 })
		.sort({ name: 1 });

	const subjectObj = {
		professor: professorSubjectObj,
		assistent: assistentSubjectObj
	}

	return subjectObj;
}

export const getSubjectById = async (subject, fullInfo = false) => {
	const subjectObj = !fullInfo ?
		await Subject.findOne({ _id: subject, deleted: false }, { deleted: 0 })
		: await Subject.findOne({ _id: subject, deleted: false }, { deleted: 0 }).populate({ path: 'professors assistents', select: 'name title', match: { deleted: false } });

	if (!subjectObj) {
		throw {
			status: 404,
			message: 'Ne postoji predmet!'
		}
	}

	return subjectObj;
}

export const isProfessorOnSubject = async (institution, subject, professor) => {
	const subjectObj = await Subject.findOne({
		_id: subject, 
		institution,
		$or: [
			{	professors: professor },
			{ assistents: professor }
		]
	});

	return(!!subjectObj);
}