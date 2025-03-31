import Budget from '../models/budget.js';

export const createBudget = async (req, res) => {
    try {
        const budget =  new Budget(req.body);
        await budget.save();
        res.status(200).json(budget);
    } catch (error) {
        res.status(400).json({message: "Server Error", error});
    }
};

export const getAllBudgets = async (req, res) => {
    try{
        const budgets = await Budget.find().sort({createdAt: -1});
        res.status(200).json(budgets);
    } catch(error) {
        res.stats(500).json({message: "Server Error", error});
    }
};

export const getBudgetById = async (req, res) => {
    try{
        const budget = await Budget.findById(req.params.id);
        if(!budget){
            return res.status(404).json({message: "Budget not found", error});      
        }
        res.status(200).json(budget);
    } catch(error) {
        res.status(500).json({message: "Server Error", error});
    }
};

export const updateBudget = async (req, res) => {
    try {
        const updateBudget = await Budget.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );

        if(!updateBudget) {
            return res.status(400).json({message: "Budget not found"});
        }

        res.status(200).json(updateBudget);
    } catch (error) {
        res.status(500).json({message: "Server Error", error});
    }
};

export const deleteBudget = async (req, res) => {
    try {
        const deleteBudget = await Budget.findByIdAndDelete(req.params.id);
        if(!deleteBudget) {
            return res.status(400).json({message: "Budget not found"});
        }
        res.status(200).json({message: "Budget deleted successfully"});
    } catch (error) {
        res.staus(500).json({message: "Server Error", error});
    }
};
// check if budget is exceed controller