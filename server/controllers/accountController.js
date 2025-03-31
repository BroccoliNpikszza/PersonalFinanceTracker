import Account from '../models/account.js';
export const createAccount = async (req, res) => {
    try{
        const account = new Account(req.body);
        await account.save();
        res.status(200).json({account});
    } catch (error) {
        res.status(400).json({message: "Server error", error});
    }
};

export const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().sort({ createdAt: -1 });
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};

export const getAccountById = async (req, res) => {
    try{
        const account = await Account.findById(req.params.id);
        if(!account) {
            return res.status(404).json({message: "Account not found"});
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};

export const updateAccount = async (req, res) => {
    try {
        const { id, name, balance } = req.body;
        const updatedAccount = await Account.findOneAndUpdate(
            { _id: id },
            { name, balance },
            { new: true, runValidators: true }
        );
        if (!updatedAccount) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};

export const deleteAccount = async(req, res) => {
    try{
        const deleteAccount = await Account.findByIdAndDelete(req.params.id);
        if(!deleteAccount) {
            return res.status(404).json({message: "Account not found", error});
        }
        res.status(200).json({message: "Account deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};

export const applyInterest = async (req, res) => {
    try{
        const account = await Account.findById(req.params.id);
        if(!Account) {
            return res.status(404).json({message: "Account not found" });
        }
        
        account.applyInterest();
        await account.save();

        res.status(200).json({message: "Interest applied", account});

    }catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};

export const makePayment = async (req, res) => {
    try{
        const { id, amount } = req.body;
        const account = await Account.findById(id);

        if(!account) {
            return res.status(404).json({message: "Account not found"});
        }

        if(amount <= 0) {
            return res.status(400).json({message: "Invalid payment amount"});
        }

        if(account.type === "credit" || account.type === "loan") {
            account.balance += amount;
        } else {
            account.balance -= amount;
        }

        await account.save();
        res.status(200).json({message: "Payment processed successfully", account});

    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};

export const checkPaymentDue = async (req, res) => {
    try {
        const account = await Account.finallyId(req.params.id);
        
        if(!account) {
            return res.status(404).json({message: "Account not found"});

        }

        res.status(200).json({
            isPaymentDue: account.isPaymentDue(), //payment due date
            dueDate: account.dueDate,
        });
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
}