import mongoose, { CallbackError, Schema, model, models} from "mongoose";
import PaymentModel from "./payment";

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

const BillModel = models.Bill || model('Bill', BillSchema);

export default BillModel;