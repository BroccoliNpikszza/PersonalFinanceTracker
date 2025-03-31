import RecurringTransaction from '../models/recurringTransactions.js';

export const createRecurringTransaction = async (req, res) => {
    try{
        const transaction = new RecurringTransaction(req.body);
        await transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({message: "Server Error", error});
    }
};

export const getAllRecurringTransactions = async (req, res) => {
    try {
        const transactions = await RecurringTransaction.find().sort({createdAt: -1});
        res.status(200).json(transactions);
    }catch (error) {
        res.status(500).json({message: "Server Error", error});
    }
};

export const getRecurringTransactionById = async (req, res) => {
    try{
        const transaction = await RecurringTransaction.findById(req.params.id);
        if(!transaction) {
            return res.status(400).json({message: "Transaction not found"});
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({message: "Server Error", error});
    }
};

export const updateRecurringTransaction = async (req, res) => {
    try {
        const updatedTransaction = await RecurringTransaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if(!updatedTransaction) {
            return res.status(400).json({message: "Recurring transaction not found"});
        }

        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({message: "Server Error", error});
    }
};

export  const deleteRecurringTransaction = async (req, res) => {
    try{
        const deletedTransaction = await RecurringTransaction.findByIdAndDelete(req.params.id);
        if(!deletedTransaction) {
            return res.status(400).json({message: "Recurring Transaction not found"});
        }
        res.status(200).json({message: "Transaction deleted successfully"});

    }catch(error) {
        res.status(500).json({message: "Server Error", error});
    }
};

export const processRecurringTransactions = async (req, res) => {
    try {
        const transaction = await RecurringTransaction.findById(req.params.id);
        if(!transaction) {
            return res.status(400).json({message: "Recurring transaction is not active"});
        }

        transaction.lastProcessed = new Date();
        transaction.nextOccurrence = transaction.calculateNextOccurrence();

        await transaction.save();

        res.status(200).json({message: "Transaction processed successfully", transaction});

    }catch(error) {
        res.status(500).json({message: "Server Error", error});
    }
};