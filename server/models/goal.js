//name
//targetAmount
//currentAmount
//TargetDate
//category(goals for what)
//priority

import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true,
        min: 1        
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    year: {
        type: Number,
        required: true,
        min: 0,
        max: 50000,
        validate: {
            validator: Number.isInteger,
            message: 'Year must be an integer'
        }
    },
    categories: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ['active', 'completed', 'failed'],
        default: 'active'
    },
    monthlyTarget: {
        type: Number,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJson: {virtuals: true},
    toObject: {virtuals: true}
});

goalSchema.pre('save', function(next){
    if(this.isModified('targetAmount')) {
        const monthsRemaining = 12 - (new Date().getMonth());
        this.monthlyTarget = (this.targetAmount - this.currentAmount) / monthsRemaining;
    }
    next();
});

goalSchema.virtual('progress').get(function() {
    return (this.currentAmount / this.targetAmount) * 100;
});

goalSchema.virtual('monthsRemaining').get(function() {
    return 12 - (new Date().getMonth());
})

goalSchema.methods.addContribution = function(amount) {
    if (amount <= 0) 
        throw new Error('Contribution must be positive');

    this.currentAmount += amount;

    if (this.currentAmount >= this.targetAmount) {
        this.status = 'completed';
    }

    return this.save();
};

const YearlyGoal = mongoose.model('YearlyGoal', goalSchema);

export default YearlyGoal;