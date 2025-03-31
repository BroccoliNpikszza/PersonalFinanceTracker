import Expense from "../models/expense.js";


export const createExpense = async (req, res) => {
    try {
        const { category, amount, description, monthlyData, date } = req.body

        const newExpense = new Expense({
            category,
            amount,
            description,
            monthlyData,
            date: new Date(date),
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch(error) {
        res.status(500).json({message: "Server Error", error});
    }   
};

export const getExpense = async (req, res) => {
    try{
        const expenses = await Expense.find().sort({ date: -1});
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};

export const getExpenseById = async (req, res) => {
    try{
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({message: "Expense not found", error});
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};

export const updateExpense = async (req, res) => {
    try {
        const { id, category, amount, description, monthlyData, date } = req.body;

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: id },
            { category, amount, description, monthlyData, date: new Date(date) },
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const deleteExpense = await Expense.findByIdAndDelete(req.params.id);
        if(!deleteExpense) {
            return res.status(404).json({message: "Expense not found", error});
        }
        res.status(200).json({message: "Expense deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Server Error", error});
    }
};

export const getExpenseByMonth = async(req, res) => {
    try {
        const { month } = req.params;
        const expenses = await Expense.find({"monthlyData.month": month});

        if(expenses.length === 0) {
            return res.status(404).json({message: `No expense found for ${month}` });
        }
    } catch (error) {
        res.status(500).json({message: "Server Error", error});
    } 
};

//get summary of expenses by category
