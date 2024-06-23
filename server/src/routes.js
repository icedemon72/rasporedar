import { handleCheckSchedule } from './controllers/scheduleController.js';
import { checkValidAccess, handleLoginUser, handleLogout, handleRefresh } from './controllers/sessionController.js';
import { handleEditUser, handleGetUserById, handleGetUserInstitutions, handleUserRegister } from './controllers/userController.js';

/* Middleware */
import authenticate from './middleware/authenticate.js'
import { institutionRouter } from './routers/institutionRouter.js';
import { professorRouter } from './routers/professorRouter.js';
import { scheduleRouter } from './routers/scheduleRouter.js';
import { subjectRouter } from './routers/subjectRouter.js';
import { userRouter } from './routers/userRouter.js';

export default (app) => {
  app.get('/thanks', async (req, res) => {
    return res.status(200).send({ message: 'Hvala Vam što koristite naše usluge! :)' });
  });

	app.use('/', userRouter);
	app.use('/institutions/:institution/schedules', authenticate, scheduleRouter)
	app.use('/institutions/:institution/professors', authenticate, professorRouter)
	app.use('/institutions/:institution/subjects', authenticate, subjectRouter);
	app.use('/institutions', authenticate, institutionRouter);
  

  app.post('/refresh', async (req, res) => {
    handleRefresh(req, res);
  });

 app.post('/authenticate', authenticate, async (req, res) => {
    checkValidAccess(req, res);
  });
}