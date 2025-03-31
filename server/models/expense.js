import mongoose from "mongoose";
import cors from 'cors';
import express from "express";

const app = express();
app.use(cors());

const monthlyDataSchema = new mongoose.Schema({
    month: {
        type: String,
        default: 'January',
    },
    totalExpense: {
        type: Number,
        default: 0,
    },
})

const expenseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ["Rent", "Insurance", "Food", "Transport", "Other"]
    },
    amount: {
        type: Number, 
        required: [true, 'Amount is required'],
    }, 
    date: {
        type: Date,
        default: Date.now,
    }, 
    description: {
        type: String,
    },
    monthlyData: monthlyDataSchema,
    },
    {
        timestamps: true
    }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;