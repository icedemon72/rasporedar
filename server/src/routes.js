import { handleGetAllUsersInInstitution, handleGetIsUserAuth, handleGetUserRole, handleLeaveInstitution, handleModeratorJoinInstitution, handlePromoteToRole, handleUserJoinInstitution } from './controllers/inInstitutionController.js';
import { handleAddInstitution, handleChangeCodes, handleDeleteInstitution, handleEditInstitution, handleGetInstitutonById } from './controllers/institutionController.js';
import { handleAddProfessor, handleDeleteProfessor, handleEditProfessor, handleGetAllProfessorsBySubject, handleGetAllProfessorsInInstitution, handleGetProfessor } from './controllers/professorController.js';
import { handleAddSchedule, handleDeleteSchedule, handleEditSchedule, handleGetAllSchedulesInInstitution, handleGetSchedule } from './controllers/scheduleController.js';
import { checkValidAccess, handleLoginUser, handleLogout, handleRefresh } from './controllers/sessionController.js';
import { handleAddSubject, handleDeleteSubject, handleEditSubjectInfo, handleEditSubjectProfessor, handleGetAllSubjectsInInstitution, handleGetAllSubjectsOfProfessor, handleGetSubject } from './controllers/subjectController.js';
import { handleEditUser, handleGetUserById, handleGetUserInstitutions, handleUserRegister } from './controllers/userController.js';

/* Middleware */
import authenticate from './middleware/authenticate.js'
import authorize from './middleware/authorize.js'

export default (app) => {
  app.get('/thanks', async (req, res) => {
    return res.status(200).send({ message: 'Hvala Vam što koristite naše usluge! :)' });
  });
  /* USERS */
  app.post('/login', async (req, res) => {
    handleLoginUser(req, res);
  });

  app.post('/logout', async (req, res) => {
    handleLogout(req, res);
  });

  app.post('/register', async (req, res) => {
    handleUserRegister(req, res);
  });

  app.patch('/edit', authenticate, async (req, res) => {
    handleEditUser(req, res);
  });

  app.get(['/user', '/user/:id'], authenticate, async (req, res) => {
    handleGetUserById(req, res);
  });

  app.get(['/user_institutions/', '/user_institutions/:id'], authenticate, async (req, res) => {
    handleGetUserInstitutions(req, res);
  });

  /* SESSIONS */
  app.post('/refresh', async (req, res) => {
    handleRefresh(req, res);
  });

 app.post('/authenticate', authenticate, async (req, res) => {
    checkValidAccess(req, res);
  });

  /* INSTITUTIONS */
  app.post('/institution', authenticate, async (req, res) => {
    handleAddInstitution(req, res);
  });

  app.delete('/institution/:id', authenticate, async (req, res) => {
    handleDeleteInstitution(req, res);
  });

  app.patch('/institution/:id', authenticate, async (req, res) => {
    handleEditInstitution(req, res);
  });

  app.get('/institution/:id', authenticate, async (req, res) => {
    handleGetInstitutonById(req, res);
  });

  app.post('/join', authenticate, async (req, res) => {
    handleUserJoinInstitution(req, res);
  });

  app.post('/join_moderator', authenticate, async (req, res) => {
    handleModeratorJoinInstitution(req, res);
  });

  app.post('/leave/:institution', authenticate, async (req, res) => {
    handleLeaveInstitution(req, res);
  });

  app.patch('/change_role/:institution/:user', authenticate, async (req, res) => {
    handlePromoteToRole(req, res);
  });

  app.patch('/change_codes/:id', authenticate, async (req, res) => {
    handleChangeCodes(req, res);
  });

  app.get('/institution_users/:id', authenticate, async (req, res) => {
    handleGetAllUsersInInstitution(req, res);
  });

  app.get('/institution_subjects/:id', authenticate, async (req, res) => {
    handleGetAllSubjectsInInstitution(req, res);
  });

  app.get('/institution_role/:institution', authenticate, async (req, res) => {
    handleGetUserRole(req, res);
  });

  app.get('/institution_auth/:institution', authenticate, async (req, res) => {
    handleGetIsUserAuth(req, res);
  })

  /* PROFESSORS */
  app.post('/professor/:institution', authenticate, async (req, res) => {
    handleAddProfessor(req, res);
  });

  app.get('/professor/:id', authenticate, async (req, res) => {
    handleGetProfessor(req, res);
  });

  app.delete('/professor/:id', authenticate, async (req, res) => {
    handleDeleteProfessor(req, res);
  });

  app.patch('/professor/:id', authenticate, async (req, res) => {
    handleEditProfessor(req, res);
  });
  
  app.get('/professor_subject/:professor', authenticate, async (req, res) => {
    handleGetAllSubjectsOfProfessor(req, res);
  });

  app.get('/institution_professors/:institution', authenticate, async (req, res) => {
    handleGetAllProfessorsInInstitution(req, res);
  });

  app.patch('/subject_professor/:subject/:professor', authenticate, async (req, res) => {
    handleEditSubjectProfessor(req, res);
  });

  /* SUBJECTS */
  app.post('/subject/:institution', authenticate, async (req, res) => {
    handleAddSubject(req, res);
  });

  app.get('/subject/:id', authenticate, async (req, res) => {
    handleGetSubject(req, res);
  });

  app.delete('/subject/:id', authenticate, async (req, res) => {
    handleDeleteSubject(req, res);
  });

  app.patch('/subject/:id', authenticate, async (req, res) => {
    handleEditSubjectInfo(req, res);
  });

  app.get('/subject_professors/:subject', authenticate, async (req, res) => {
    handleGetAllProfessorsBySubject(req, res);
  });

  /* SCHEDULES */
  app.post('/schedule/:institution', authenticate, async (req, res) => {
    handleAddSchedule(req, res);
  });

  app.get('/schedule/:institution', authenticate, async (req, res) => {
    handleGetAllSchedulesInInstitution(req, res);
  });

  app.get('/schedule/:institution/:schedule', authenticate, async(req, res) => {
    handleGetSchedule(req, res);
  });

  app.patch('/schedule/:institution/:schedule', authenticate, async (req, res) => {
    handleEditSchedule(req, res);
  });
  

  app.delete('/schedule/:institution/:schedule', authenticate, async (req, res) => {
    handleDeleteSchedule(req, res);
  });

}