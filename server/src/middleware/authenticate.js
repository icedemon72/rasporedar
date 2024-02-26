import { authenticateUser } from "../controllers/sessionController.js";

const authenticate = async (req, res, next)  => {
  try {
    await authenticateUser(req, res, next);
  } catch (err) {
    return res.status(500).json({ message: 'Error' });
  }
}

export default authenticate;