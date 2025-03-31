//time period
//start/end dates
//amount limits
//category allocations
import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name:{
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    period: {
        type: String,
        required: true,
        enum: ['weekly', 'monthly', 'yearly'],
        default: 'monthly'
    },
    categories: [{
        type: String,
        trim: true
    }],
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    notifications: {
        enabled: {type: Boolean, default:  true},
        threshold: {type: Number, default: 80} //percentage
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

budgetSchema.pre('save', function(next){
    this.updatedAt = new Date();
    next();
});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;



