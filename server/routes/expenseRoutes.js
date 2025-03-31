import { Router } from "express"
import {
    createExpense,
    getExpense,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getExpenseByMonth
} from "../controllers/expenseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const expenseRoutes = Router();

expenseRoutes.post('/create', verifyToken, createExpense);
expenseRoutes.get('/all', verifyToken, getExpense);
expenseRoutes.get('/:id', verifyToken, getExpenseById);
expenseRoutes.put('/update/:id', verifyToken, updateExpense);
expenseRoutes.delete('/delete/:id', verifyToken, deleteExpense);
expenseRoutes.get('/month/:month', verifyToken, getExpenseByMonth);

export default Router;

// Debugging method
// router.post('/expenses-summary', async (req, res) =>{
//     try{
//         const summary = await Expense.create([
//             {
//                 $group: { _id: "$category", total: { $sum: "$amount" }}
//             }
//         ]);
//         res.json(summary);
//     }catch(error){
//         res.status(500).json({message: error.message});
//     }

// });
