import express from 'express';
import { test } from '../controller/test';
import { verifyJWT } from '../middleware/verifyJWT';

const router = express.Router();

router.post('/auth/test', verifyJWT, test);
router.get('/test', test);

module.exports = router;
