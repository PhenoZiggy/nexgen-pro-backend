import express from 'express';
import { logOutUser } from '../controller/logout';
import { verifyJWT } from '../middleware/verifyJWT';

const router = express.Router();

router.get('/auth/logout', verifyJWT, logOutUser);

module.exports = router;
