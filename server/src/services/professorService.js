import Professor from '../models/professorModel.js'
import Subject from '../models/subjectModel.js';
import { authSenderInInstitutionObject, senderInInstitutionObject } from '../utils/serviceHelpers.js';

export const addProfessor = async (sender, data) => {
  try {
    await authSenderInInstitutionObject(sender, data.institution);
    
    data.deleted = false;

    await Professor.create(data);
    return { message: 'Profesor uspešno dodat!' }
  } catch (err) {
    throw err;
  }
}

export const deleteProfessor = async (sender, professor) => {
  try {
    const professorObj = await Professor.findOne({ _id: professor, deleted: false });

    if(!professorObj) {
      throw {
        status: 400,
        message: 'Ne postoji profesor!'
      }
    }

    await authSenderInInstitutionObject(sender, professorObj.institution);

    const subjectObj = await Subject.find({ institution: professorObj.institution });

    // this is an overkill for such an operation, but I cant think of nothing faster
    // unless I create another model "professor-subject" which is too much, anyhow I don't
    // expect more than 100 subjects and professors in every institution so it should be fine
    if(subjectObj.length) {
      // basically, this iterates through every subject in the institution, and removes the ID of
      // the professor from every array (both professors' and assistents') using Array.filter()
      for (let i = 0; i < subjectObj.length; i++) {
        await Subject.updateOne({ _id: subjectObj[i]._id, deleted: false },
          { $set: {
            professors: subjectObj[i].professors.filter(item => !item.equals(professorObj._id)),
            assistents: subjectObj[i].assistents.filter(item => !item.equals(professorObj._id))
          }
        });
      }      
    }

    professorObj.deleted = true;
    await professorObj.save();

    return { message: 'Profesor uspešno obrisan!' };
  } catch (err) {
    throw err;
  }
}

export const editProfessor = async (sender, professor, data) => {
  try {
    const professorObj = await Professor.findOne({_id: professor, deleted: false});

    if(!professorObj) {
      throw {
        status: 400,
        message: 'Ne postoji profesor!'
      }
    }

    await authSenderInInstitutionObject(sender, professorObj.institution);

    await Professor.updateOne({ _id: professor }, { $set:{
      name: data.name || professorObj.name,
      title: data.title || professorObj.title,
      education: data.education || professorObj.education,
      bio: data.bio || professorObj.bio,
      references: data.references || professorObj.references
    }});

    return { message: 'Uspešno editovanje profesora!' }
  } catch (err) {
    throw err;
  }
}

// FIXME: add fullInfo (perhaps)
export const getAllProfessorsInInstitution = async (sender, institution) => {
  try {
    await senderInInstitutionObject(sender, institution);

    const professorObj = await Professor.find({ institution, deleted: false }, { deleted: 0 }); 

    if(!professorObj.length) {
      return [];
    }

    return professorObj;
  } catch (err) {
    throw err;
  }
}

export const getAllProfessorsInSubject = async (sender, subject) => {
  try {
    const subjectObj = await Subject.findOne({ _id: subject, deleted: false });

    if(!subjectObj) {
      throw {
        status: 400,
        message: 'Ne postoji predmet!'
      }
    }

    await senderInInstitutionObject(sender, subjectObj.institution);

    const professors = subjectObj.professors;
    const assistents = subjectObj.assistents;

    const resultObj = {
      professors: await getFullInfoOnProfessors(professors),
      assistents: await getFullInfoOnProfessors(assistents)
    }

    return resultObj;
       
  } catch (err) {
    throw err;
  }
}

// FIXME: 
export const getProfessorById = async (sender, professor) => {
  try {
    const professorObj = await Professor.findOne({ _id: professor, deleted: false }, { deleted: 0 }); 
    
    if(!professorObj) {
      throw {
        status: 404,
        message: 'Ne postoji profesor'
      }
    }
    
    await senderInInstitutionObject(sender, professorObj.institution);
    return professorObj;
  } catch (err) {
    throw err;
  }
}


/* Helpers */

export const getFullInfoOnProfessors = async (professors) => {
  let result = [];

  for(let i = 0; i < professors.length; i++) {
    const professor = await Professor.findOne({ _id: professors[i], deleted: false }, { deleted: 0 });
    result.push(professor);
  }

  return result;
}