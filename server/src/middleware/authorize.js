import { authorizeUser } from "../controllers/sessionController.js";

const authorize = async (req, res, next)  => {
  try {
    authorizeUser(req, res, next);
  } catch (err) {
    return res.status(401).json({message: 'Invalid token'});
  }
}

export default authorize;


