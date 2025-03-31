import { Router } from 'express';
import {
    createAccount,
    getAllAccounts,
    getAccountById,
    updateAccount,
    deleteAccount,
    applyInterest,
    makePayment,
    checkPaymentDue,
} from '../controllers/accountController.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const accountRoutes = Router();

accountRoutes.post('/create', verifyToken , createAccount);
accountRoutes.get('/all', verifyToken ,getAllAccounts);
accountRoutes.get('/:id', verifyToken ,getAccountById);
accountRoutes.put('/update/:id', verifyToken ,updateAccount);
accountRoutes.delete('/delete/:id', verifyToken ,deleteAccount);

accountRoutes.post('/:id/apply-interest', verifyToken ,applyInterest);
accountRoutes.post('/:id/make-payment', verifyToken ,makePayment);
accountRoutes.get('/:id/check-payment-due', verifyToken ,checkPaymentDue);

export default accountRoutes;

