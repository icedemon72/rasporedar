import { checkValidAccess, handleLoginUser, handleLogout, handleRefresh } from './controllers/sessionController.js';
import { handleEditUser, handleGetUserById, handleGetUserInstitutions, handleUserRegister } from './controllers/userController.js';

/* Middleware */
import authenticate from './middleware/authenticate.js'
import { institutionRouter } from './routers/institutionRouter.js';
import { professorRouter } from './routers/professorRouter.js';
import { scheduleRouter } from './routers/scheduleRouter.js';
import { subjectRouter } from './routers/subjectRouter.js';

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

	app.use('/institutions', authenticate, institutionRouter);
	app.use('/institutions/:institution/professors', authenticate, professorRouter)
	app.use('/institutions/:institution/subjects', authenticate, subjectRouter);
	app.use('/institutions/:institution/schedules', authenticate, scheduleRouter)
  
	app.get(['/user', '/user/:id'], authenticate, async (req, res) => {
    handleGetUserById(req, res);
  });

  app.get(['/user_institutions/', '/user_institutions/:id'], authenticate, async (req, res) => {
    handleGetUserInstitutions(req, res);
  });

  app.post('/refresh', async (req, res) => {
    handleRefresh(req, res);
  });

 app.post('/authenticate', authenticate, async (req, res) => {
    checkValidAccess(req, res);
  });
}