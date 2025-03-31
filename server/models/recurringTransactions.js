//details
//frequency
//next occurrence date

import mongoose from 'mongoose';


const recurringTransactionsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'],
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: Date,
    nextOccurrence: {
        type: Date,
        required: true
    },
    lastProcessed: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
}, {
    timestamps: true
});

recurringTransactionsSchema.methods.calculateNextOccurrence = function(){
    const now = new Date();
    const lastDate = this.lastProcessed || this.startDate;
    let nextDate = new Date(lastDate);

    switch (this.frequency){
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
        break;
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
        break;
        case 'bi-weekly':
            nextDate.setDate(nextDate.getDate() + 14);
        break;
        case 'monthly':
            nextDate.setDate(nextDate.getMonth() + 1);
        break;
        case 'quarterly':
            nextDate.setDate(nextDate.getMonth() + 3);
        break;
        case 'Yearly':
            nextDate.setDate(nextDate.getFullYear() + 1);
        break;
    }

    return nextDate > now ? nextDate: this.calculateNextOccurrence();
}

recurringTransactionsSchema.pre('save', function(next){
    if(!this.nextOccurrence) {
        this.nextOccurrence = this.calculateNextOccurrence();
    }
    next();
})

const RecurringTransaction = mongoose.model('RecurringTransaction', recurringTransactionsSchema);

export default RecurringTransaction;
