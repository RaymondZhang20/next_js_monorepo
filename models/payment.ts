import mongoose, { Document, Schema, model, models} from "mongoose";

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
    },
});

interface Payment {
    payer: string;
    amount: number;
    activity?: string;
}

export interface PaymentDocument extends Payment, Document {}

const PaymentModel = models.Payment || model('Payment', PaymentSchema);

export default PaymentModel;