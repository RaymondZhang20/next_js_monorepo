import mongoose, { Document, Schema, model, models} from "mongoose";
import PaymentModel, { PaymentDocument } from "./payment";
import { BillOutcomeT, BillState } from "@utils/BillsUtils";

const BillSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required. '],
    },
    initializer: {
        type: String,
        required: [true, 'Initializer is required. '],
    },
    requiredPeople: {
        type: Number,
        required: [true, 'Required People is required. '],
    },
    reminders: {
        type: String,
        required: [true, 'Reminder is required. '],
    },
    payments: {
        type: [Schema.Types.ObjectId],
        ref: PaymentModel,
        required: [true, 'Payment is required. '],
    },
    state: {
        type: String,
        required: [true, 'State is required. '],
    },
    createdDate: {
        type: Date,
        required: [true, 'Date is required. '],
    },
    sum: {
        type: Number,
        required: [true, 'Sum is required. '],
    },
    outComes: {
        type: [Schema.Types.Mixed],
    },
});

export interface BillDocument extends Document {
    title: string;
    initializer: string;
    requiredPeople: number;
    reminders: string;
    payments: Schema.Types.ObjectId[] | PaymentDocument[];
    state: BillState;
    createdDate: Date;
    sum: number;
    outComes: BillOutcomeT[];
}

const BillModel = models.Bill || model('Bill', BillSchema);

export default BillModel;