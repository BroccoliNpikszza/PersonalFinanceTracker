import YearlyGoal from "../models/goal.js";

export const createGoal = async (req, res) => {
    try {
        const goal = new YearlyGoal(req.body);
        await goal.save();
        res.status(200).json(goal);
    } catch (error) {
        res.send(400).json({ message: "Server Error", error });
    }
};

export const getAllGoals = async (req, res) => {
    try{
        const goal = await YearlyGoal.find().sort({createdAt: -1});
        res.status(200).json(goal);
    }catch (error) {
        res.send(500).json({ message: "Server Error", error });
    }
};

export const getGoalById = async (req, res) => {
    try{
        const goal = await YearlyGoal.findById(req.params.id);
        if(!goal) {
            return res.status(404).json({message: "Goal not found"});
        }

        res.status(200).json(goal);
    } catch (error) {
        res.send(500).json({ message: "Server Error", error });

    } 
};

export const updateGoal = async (req, res) => {
    try {
        const updatedGoal = await YearlyGoal.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );

        if(!updatedGoal) {
            return res.send(404).json({message: "Goal not found"});
        }

        res.status(200).json(updateGoal);

    } catch (error) {
        res.send(500).json({message: "Server Error", error});
    }
};

export const deleteGoal = async (req, res) => {
    try{
        const deletedGoal = await YearlyGoal.findByIdAndDelete(req.params.id);

        if(!deletedGoal) {
            return res.status(404).json({message: "Goal not found"});
        }
        res.status(200).json({message: "Goal deleted successfully"});

    } catch (error) {
        res.send(500).json({message: "Server Error", error});
    }
};

export const addTowardsGoal = async (req, res) => {
    try {
        const { amount } = req.body;
        if(!amount || amount <= 0){
            return res.status(400).json({message: "Must be positive amount"});
        }

        const goal = await YearlyGoal.findById(req.params.id);
        if(!goal) {
            return res.status(404).json({message: "Goal not found"});
        }

        await goal.addTowardsGoal(amount);
        res.status(200).json({message: "Contribution added successfully", goal});

    } catch (error) {
        res.send(500).json({message: "Server Error", error});

    }
}