import BillModel from "@models/bill";
import PaymentModel, { PaymentDocument } from "@models/payment";
import { connectToDB } from "@utils/DataBaseUtils";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: any) => {
    try {
        await connectToDB()

        const bill = await BillModel.findById(params.bid).populate('payments');
        if (!bill) return NextResponse.json("Bill Not Found", { status: 404 });

        return NextResponse.json(bill, { status: 200 })

    } catch (error) {
        return NextResponse.json("Failed to fetch the bill", { status: 500 });
    }
}

export const PATCH = async (req: Request, { params }: any) => {
    const { changedPayments, newPayments } = await req.json();

    try {
        await connectToDB();

        const bill = await BillModel.findById(params.bid);

        if (!bill) {
            return NextResponse.json("Bill not found", { status: 404 });
        }

        for (let changedPayment of changedPayments) {
            const changed = await PaymentModel.findById(changedPayment._id);
            changed.amount = changedPayment.amount;
            changed.activity = changedPayment.activity===""? "General": changedPayment.activity;
            await changed.save();
        }
        const updatedPayments: PaymentDocument[] = [];
        for (let newPayment of newPayments) {
            updatedPayments.push(
              new PaymentModel({ payer: newPayment.payer, amount: newPayment.amount, activity: newPayment.activity===""?"General": newPayment.activity })
            );
        }
        for (let updatedPayment of updatedPayments) {
            await updatedPayment.save();
        }
        bill.payments.push(...updatedPayments.map(pay => pay._id));

        await bill.save();

        return NextResponse.json("Successfully updated the Bill", { status: 200 });
    } catch (error) {
        return NextResponse.json("Error Updating the Bill", { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }: any) => {
    try {
        await connectToDB();

        const bill = await BillModel.findById(params.bid);
        if (!bill) {
            return NextResponse.json("Bill not found", { status: 404 });
        }
        await PaymentModel.deleteMany({ _id: { $in: bill.payments } });

        await BillModel.findByIdAndDelete(params.bid);

        return NextResponse.json("Bill deleted successfully", { status: 200 });
    } catch (error) {
        return NextResponse.json("Failed to delete the bill", { status: 500 });
    }
};