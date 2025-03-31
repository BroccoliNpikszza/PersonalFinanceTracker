import { Router } from "express";
import {
    createRecurringTransaction,
    getAllRecurringTransactions,
    getRecurringTransactionById,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    processRecurringTransactions
} from "../controllers/recurringTransactionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const recurringTransactionRoutes = Router();

recurringTransactionRoutes.post('/create', verifyToken, createRecurringTransaction);
recurringTransactionRoutes.get('/all', verifyToken, getAllRecurringTransactions);
recurringTransactionRoutes.get('/:id', verifyToken, getRecurringTransactionById);
recurringTransactionRoutes.put('/update/:id', verifyToken, updateRecurringTransaction);
recurringTransactionRoutes.delete('/delete/:id', verifyToken, deleteRecurringTransaction);
recurringTransactionRoutes.patch('/process/:id', verifyToken, processRecurringTransactions);

export default recurringTransactionRoutes;