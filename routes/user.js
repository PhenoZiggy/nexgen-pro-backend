import express from 'express';
import { registerUser, loginUser, currentUser } from '../controller/user';
import { verifyJWT } from '../middleware/verifyJWT';

const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/currentuser', verifyJWT, currentUser);

module.exports = router;
