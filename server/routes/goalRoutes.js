import { Router } from "express";
import {
    createGoal,
    getAllGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
    addTowardsGoal
} from "../controllers/goalController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const goalRoutes = Router();

goalRoutes.post('/create', verifyToken, createGoal);
goalRoutes.get('/all', verifyToken, getAllGoals);
goalRoutes.get('/:id', verifyToken, getGoalById);
goalRoutes.put('/update/:id', verifyToken, updateGoal);
goalRoutes.delete('/delete/:id', verifyToken, deleteGoal);

goalRoutes.patch('/:id/add-towards-goal', verifyToken, addTowardsGoal);

export default goalRoutes;