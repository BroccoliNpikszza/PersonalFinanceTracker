import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Importing Routes
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import recurringTransactionRoutes from './routes/recurringTransactionRoutes.js';

dotenv.config();
const app = express();


const PORT = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;

// Middleware
app.use(
    cors({
    origin: [process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
})
);
app.use(cookieParser());
app.use(express.json());



mongoose.connect(databaseURL)
.then(() => {
    console.log(`Connected to the database`);
    app.listen(PORT, ()=> {
        console.log(`server is running on http://localhost:${PORT}`);
    });
    })
    .catch((error) => {
    console.log('Error', error.message);
    });


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/recurring', recurringTransactionRoutes);

// app.post('/api/expense-summary', async (req, res) => {
//     try{
//         const expenses = await Expense.create(req.body);
//         res.status(200).json(expenses);
//     }catch (error){
//         res.status(500).json({message: error.message})
//     }
// })

// app.get('/api/expense-summary', async (req, res) =>{
//     try{
//         const expenses = await Expense.find({});
//         res.status(200).json(expenses);
//     }catch(error){
//         res.status(500).json({message: error.message});
//     }
// })

// app.get('/api/users', async (req, res) => {
//     try{
//         const users = await User.find({});
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// });

// app.post('/api/users', async (req, res) => {
//     try{
//         const users = await User.create(req.body);
//         res.status(200).json(users);
//     }catch (error) {
//         res.status(500).json({message: error.message})
//     }
// });