import { kMaxLength } from "buffer";
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String, 
        required: true,
    }, 
    type: {
        type: String, 
        required: true,
        enum: ['checking', 'savings', 'credit', 'investment', 'loan'],
        default: 'checking'
    },
    institution: {
        type: String, 
        default: 'nullBank'
    },
    balance: {
        type: Number,
        required: true,
        kMaxLength: 20,
        default: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    //Credit Fields
    creditLimit: {
        type: Number,
        default: 0,
        required: function(){
            return this.type === 'credit';
        }
    },
    availableCredit: {
        type: Number,
        default: 0,
        required: function(){
            return this.type === 'credit' ? this.creditLimit : undefined;
        }
    },
    minimumPayment: {
        type: Number,
        default: 0
    },
    //Interest Fields
    interestRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100 //%
    },
    interestType: {
        type: String,
        enum: ['simple', 'compound', 'none'],
        default: 'none'
    },
    compoundingFrequency: {
        type: String,
        enum: ['daily', 'monthly', 'quarterly', 'annually'],
        default: 'monthly'
    },
    //PaymentDue Fields
    dueDate: {
        type: Number, // Day of the month or Date and Date.now
        min: 1,
        max: 31,
        validate: {
            validator: Number.isInteger,
            message: 'Payment due day must be an integer between 1-31'
        },
        required: function(){
            return ['credit', 'loan', 'mortgage'].includes(this.type);
        }
    },
   gracePeriodDays: {
    type: Number,
    default: 21,
    min: 0
   },
   lastInterestUpdate: {
    type: Number,
    default: Date.now
   },
   
   nextInterestUpdate: Date,
   nextPaymentUpdate: Date,

   description: {
    type: String,
    trim: true
   },
   accountNumber: {
    type: String,
    match: /^\d{4}$/
   }
}, {
    timestamps: true,
    toJSON: {getters: true, virtual: true},
    toObject: {getters: true, virtual: true}
});

accountSchema.pre('save', function(next) {
    if (this.isNew && this.type === 'credit'){
        this.availableCredit = this.creditLimit;
    }

    if(this.dueDate && (this.isNew || this.isModified('dueDate'))) {
        this.calculateNextPaymentDate();
    }

    if(this.interestRate > 0 && (this.isNew || this.isModified('interestRate') || this.isModified('compoundingFrequency'))){
        this.calculateNextInterestUpdate();
    }

    next();
});

accountSchema.methods = {
    calculateAccruedInterest: function(asOfDate = new Date()) {
        const daysElapsed = (asOfDate - this.lastInterestUpdate) / (24 * 60 * 60 * 1000);

        let interest = 0;
        const principal = this.type === 'credit' ? - this.balance : this.balance;

        if (this.interestType === 'simple') {
            interest = principal * (this.interestRate / 100 / 365) * daysElapsed;
        }
        else if (this.interestType === 'compound') {
            const periodsPerYear = this.getCompoundPeriodsPerYear();
            const ratePerPeriod = this.interestRate / 100 / periodsPerYear;
            const periodsElapsed = daysElapsed / (365 / periodsPerYear);

            interest = principal * Math.pow(1 + ratePerPeriod, periodsElapsed) - principal;
        }

        return parseFloat(interest.toFixed(2)); //string to Float
    },

    getCompoundPeriodsPerYear: function() {
        switch (this.compoundingFrequency) {
            case 'daily':
                return 365;
            case 'monthly':
                return 12;
            case 'quarterly':
                return 4;
            case 'annually':
                return 1;
            default:
        return 12
        }
    },

    calculateNextPaymentDate: function() {
        const now = new Date();
        let paymentDueDate = new Date(now.getFullYear(), now.getMonth(), this.dueDate);

        if(dueDate < now) {
            dueDate = new Date(now.getFullYear(), now.getMonth() + 1, this.dueDate);
        }

        this.nextPaymentDueDate = paymentDueDate; 
    },

    calculateNextInterestUpdate: function() {
        const now = new Date();
        let nextUpdate = new Date(this.lastInterestUpdate);

        switch (this.compoundingFrequency) {
            case 'daily':
                nextUpdate.setDate(nextUpdate.getDate() + 1);
                break;
            case 'monthly':
                nextUpdate.setMonth(nextUpdate.getMonth() + 1);
                break;
            case 'quarterly':
                nextUpdate.setMonth(nextUpdate.getMonth() + 3);
                break;
            case 'annually':
                nextUpdate.setFullYear(nextUpdate.getFullYear() + 1);
                break;
        }

        this.nextInterestUpdate = nextUpdate;
    },

    applyInterest: function() {
        if (this.interestRate <= 0)
            return;

        const interest = this.calculateAccruedInterest();
        if (this.type === 'credit' || this.type === 'loan' || this.type === 'mortgage') {
            this.balance -= interest;
        } else {
            this.balance += interest;
        }

        this.lastInterestUpdate = new Date();
        this.calculateNextInterestUpdate();
    }
};

accountSchema.virtual('accruedInterest').get(function() {
    return this.calculateAccruedInterest();
});

accountSchema.virtual('utilizationPercentage').get(function() {
    if (this.type !== 'credit')
        return 0;
    
    return ((this.creditLimit - this.availableCredit) / this.creditLimit) * 100;
});

accountSchema.virtual('isPaymentDue').get(function() {
    if(!this.nextPaymentDueDate)
        return false;

    return new Date() > this.nextPaymentDueDate;
});

accountSchema.virtual('daysUntilPaymentDue').get(function() {
    if (!this.nextPaymentDueDate)
        return null;

    return Math.cell(this.nextPaymentDueDate - new Date()) / (24 * 60 * 60 * 1000);
});

const Account = mongoose.model('Account', accountSchema);

export default Account;