import Professor from '../models/professorModel.js'
import Subject from '../models/subjectModel.js';

export const addProfessor = async (data) => {
	data.deleted = false;

	const professor = await Professor.create(data);
	return { message: 'Profesor uspešno dodat!', _id: professor._id }
}

export const deleteProfessor = async (professor) => {
	const professorObj = await Professor.findOne({ _id: professor, deleted: false });

	if (!professorObj) {
		throw {
			status: 400,
			message: 'Ne postoji profesor!'
		}
	}

	const subjectObj = await Subject.find({ institution: professorObj.institution });

	// this is an overkill for such an operation, but I cant think of nothing faster
	// unless I create another model "professor-subject" which is too much, anyhow I don't
	// expect more than 100 subjects and professors in every institution so it should be fine
	if (subjectObj.length) {
		// basically, this iterates through every subject in the institution, and removes the ID of
		// the professor from every array (both professors' and assistents') using Array.filter()
		for (let i = 0; i < subjectObj.length; i++) {
			await Subject.updateOne({ _id: subjectObj[i]._id, deleted: false },
				{
					$set: {
						professors: subjectObj[i].professors.filter(item => !item.equals(professorObj._id)),
						assistents: subjectObj[i].assistents.filter(item => !item.equals(professorObj._id))
					}
				});
		}
	}

	professorObj.deleted = true;
	await professorObj.save();

	return { message: 'Profesor uspešno obrisan!' };

}

export const editProfessor = async (professor, data) => {
	const professorObj = await Professor.findOne({ _id: professor, deleted: false });

	if (!professorObj) {
		throw {
			status: 400,
			message: 'Ne postoji profesor!'
		}
	}


	await Professor.updateOne({ _id: professor }, {
		$set: {
			name: data.name || professorObj.name,
			title: data.title || professorObj.title,
			education: data.education || professorObj.education,
			bio: data.bio || professorObj.bio,
			references: data.references || professorObj.references
		}
	});

	return { message: 'Uspešno editovanje profesora!' }
}

// FIXME: add fullInfo (perhaps)
export const getAllProfessorsInInstitution = async (institution) => {
	const professorObj = await Professor.find({ institution, deleted: false }, { deleted: 0 }).sort({ title: 1, name: 1 });

	if (!professorObj.length) {
		return [];
	}

	return professorObj;

}

export const getAllProfessorsInSubject = async (subject) => {
	const subjectObj = await Subject.findOne({ _id: subject, deleted: false });

	if (!subjectObj) {
		throw {
			status: 400,
			message: 'Ne postoji predmet!'
		}
	}

	const professors = subjectObj.professors;
	const assistents = subjectObj.assistents;

	const resultObj = {
		professors: await getFullInfoOnProfessors(professors),
		assistents: await getFullInfoOnProfessors(assistents)
	}

	return resultObj;
}

// FIXME: 
export const getProfessorById = async (professor) => {
	const professorObj = await Professor.findOne({ _id: professor, deleted: false }, { deleted: 0 });

	if (!professorObj) {
		throw {
			status: 404,
			message: 'Ne postoji profesor'
		}
	}

	return professorObj;
}


/* Helpers */

export const getFullInfoOnProfessors = async (professors) => {
	let result = [];

	for (let i = 0; i < professors.length; i++) {
		const professor = await Professor.findOne({ _id: professors[i], deleted: false }, { deleted: 0 });
		result.push(professor);
	}

	return result;
}