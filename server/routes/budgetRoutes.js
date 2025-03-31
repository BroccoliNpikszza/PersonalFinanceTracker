import { Router } from "express";
import {
    createBudget,
    getAllBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget
} from '../controllers/budgetController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const budgetRoutes = Router();

budgetRoutes.post('/create', verifyToken ,createBudget);
budgetRoutes.get('/all', verifyToken ,getAllBudgets);
budgetRoutes.get('/:id', verifyToken,getBudgetById);
budgetRoutes.put('/update/:id', verifyToken ,updateBudget);
budgetRoutes.delete('/delete/:id', verifyToken ,deleteBudget);

export default budgetRoutes;
