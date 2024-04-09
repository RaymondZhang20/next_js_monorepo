import mongoose, { Schema, model, models} from "mongoose";

const PaymentSchema = new Schema({
    payer: {
        type: String,
        required: [true, 'Payer is required. '],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required. '],
    },
    activity: {
        type: String,
        required: [true, 'Activity is required. '],
    },
});

const Payment = models.Payment || model('Payment', PaymentSchema);

export default Payment;