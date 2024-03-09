import Subject from '../models/subjectModel.js';
import Professor from '../models/professorModel.js';
import { getFullInfoOnProfessors } from './professorService.js';
import { authSenderInInstitutionObject, senderInInstitutionObject } from '../utils/serviceHelpers.js';

export const addSubject = async (sender, data) => {
  try {
    await authSenderInInstitutionObject(sender, data.institution);
    
    // add professors check here!
    await Subject.create(data);
    return { message: 'Predmet uspešno kreiran!' }
  } catch (err) {
    throw err;
  }
}

export const deleteSubject = async (sender, subject) => {
  try {
    const subjectObj = await Subject.findOne({_id: subject, deleted: false});

    if(!subjectObj) {
      throw {
        status: 400,
        message: 'Predmet ne postoji!'
      }
    }

    await authSenderInInstitutionObject(sender, subjectObj.institution);

    subjectObj.deleted = true;
    await subjectObj.save();

    return { message: 'Uspešno brisanje predmeta!' }; 

  } catch (err) {
    throw err;
  }
}

export const editSubjectInfo = async (sender, subject, data) => {
  try {
    const subjectObj = await Subject.findOne({ _id: subject, deleted: false });

    if(!subjectObj) {
      throw {
        status: 400,
        message: 'Predmet ne postoji!'
      }
    }

    await authSenderInInstitutionObject(sender, subjectObj.institution);

    await Subject.updateOne({ _id: subjectObj._id }, { $set: {
      name: data.name || subjectObj.name,
      description: data.description || subjectObj.description,
      goal: data.goal || subjectObj.goal,
      result: data.result || subjectObj.result,
      references: data.references || subjectObj.references,
      professors: data.professors || subjectObj.professors,
      assistents: data.assistents || subjectObj.assistents
    }});

    return { message: 'Uspešno editovan predmet!' };

  } catch (err) {
    throw err;
  }
}

export const editSubjectProfessor = async (sender, professor, subject, position, action) => {
  try {
    const professorObj = await Professor.findOne({ _id: professor, deleted: false });

    if(!professorObj) {
      throw {
        status: 400,
        message: 'Ne postoji profesor!'
      }
    }  

    await authSenderInInstitutionObject(sender, professorObj.institution);

    const subjectObj = await Subject.findOne({ _id: subject, deleted: false });

    if(!subjectObj) {
      throw {
        status: 405,
        message: 'Ne postoji predmet!'
      }
    }

    let arrayOfProfessors = (position === 'professor') ? subjectObj.professors : subjectObj.assistents;
    const professorIndex = arrayOfProfessors.indexOf(professorObj._id);
    let updateQuery = {};
    if(action === 'add') {
      if(professorIndex !== -1) {
        throw {
          status: 400,
          message: 'Profesor je već na ovom predmetu',
        }
      }

      arrayOfProfessors.push(professorObj._id);

    } else {
      if(professorIndex === -1) {
        throw {
          status: 400,
          message: 'Profesor nije na ovom predmetu'
        }
      }

      arrayOfProfessors.splice(professorIndex, 1);
    }

    updateQuery = (position === 'professor') ? { professors: arrayOfProfessors } : { assistents: arrayOfProfessors };       

    await Subject.updateOne({ _id: subject }, { $set: updateQuery });

    return { message: `Uspešno ste ${(action === 'add') ? 'dodali' : 'obrisali' } profesora!` };

  } catch (err) {
    throw err;
  }
}

export const getAllSubjectsInInstitution = async (sender, institution, fullInfo = false) => {
  try {
    await senderInInstitutionObject(sender, institution);

    let subjectObj = await Subject.find({ institution, deleted: false }, { deleted: 0 });
    
    if(!subjectObj) {
      throw {
        status: 200,
        message: 'Grupa nema predmete'
      }
    }

    subjectObj = JSON.parse(JSON.stringify(subjectObj));

    if(!fullInfo) {
      return subjectObj ? subjectObj : [];
    }
  
    for (let i = 0; i < subjectObj.length; i++) {
      const professors = subjectObj[i].professors;
      const assistents = subjectObj[i].assistents;
  
      subjectObj[i].professors = await getFullInfoOnProfessors(professors);
      subjectObj[i].assistents = await getFullInfoOnProfessors(assistents);
    }

    return subjectObj ? subjectObj : [];

  } catch (err) {
    throw err;
  }
}

// FIXME: add fullInfo
export const getAllSubjectsOfProfessor = async (sender, professor, fullInfo = false) => {
  try {
    const professorObj = await Professor.findOne({ _id: professor, deleted: false }); 

    if(!professorObj) {
      throw {
        status: 400,
        message: 'Ne postoji profesor!'
      }
    }  

    await senderInInstitutionObject(sender, professorObj.institution);

    const professorSubjectObj = await Subject.find({
      professors: professor,
      deleted: false
    }, { deleted: 0, professors: 0, assistents: 0 });


    const assistentSubjectObj = await Subject.find({
      assistents: professor,
      deleted: false
    }, { deleted: 0, professors: 0, assistents: 0 });

    const subjectObj = {
      professor: professorSubjectObj,
      assistent: assistentSubjectObj
    }

    return subjectObj;
  } catch (err) {
    throw err;
  }
}

export const getSubjectById = async (sender, subject, fullInfo = false) => {
  try {
    let subjectObj = await Subject.findOne({ _id: subject, deleted: false }, { deleted: 0 });

    if(!subjectObj) {
      throw {
        status: 405,
        message: 'Ne postoji predmet!'
      }
    }

    await senderInInstitutionObject(sender, subjectObj.institution);

    if(!fullInfo) {
      return subjectObj ? subjectObj : [];
    }

    subjectObj = JSON.parse(JSON.stringify(subjectObj));
  
    for (let i = 0; i < subjectObj.length; i++) {
      const professors = subjectObj.professors;
      const assistents = subjectObj.assistents;
  
      subjectObj.professors = await getFullInfoOnProfessors(professors);
      subjectObj.assistents = await getFullInfoOnProfessors(assistents);
    }

    return subjectObj ? subjectObj : [];

  } catch (err) {
    throw err;
  }
}