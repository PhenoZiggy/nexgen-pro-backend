import { createOrder, retrieveUserOrders, updateOrderStatus, getAll } from '../controller/orders';
import express from 'express';
import { verifyJWT } from '../middleware/verifyJWT';

const router = express.Router();

router.post('/orders/create', createOrder);
router.get('/orders/retrieve-user-ordders', verifyJWT, retrieveUserOrders);
router.put('/orders/update-status', updateOrderStatus);
router.get('/orders/getall', getAll);

module.exports = router;
