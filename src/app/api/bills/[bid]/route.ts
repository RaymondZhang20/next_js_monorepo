import NewBillForm from "@components/NewBillForm";
import BillModel, { BillDocument } from "@models/bill";
import PaymentModel, { PaymentDocument } from "@models/payment";
import { BillT, BillUtil, Money, PaymentT } from "@utils/BillsUtils";
import { connectToDB } from "@utils/DataBaseUtils";
import { NextResponse } from "next/server";
import { comment } from "postcss";

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
    const { comment, requiredPeople, state, changedPayments, newPayments } = await req.json();

    try {
        await connectToDB();

        const bill: BillDocument|null = await BillModel.findById(params.bid);

        if (!bill) {
            return NextResponse.json("Bill not found", { status: 404 });
        }

        if (changedPayments !== undefined && newPayments !== undefined ) {
            await updatePayments(changedPayments, newPayments, bill, params);
        }

        if (state !== undefined) {
            bill.state = state;
            if (state === "Done") {
                await bill.populate("payments");
                bill.outComes = BillUtil.computeResult(bill);
            }
        }
        if (requiredPeople !== undefined) {
            bill.requiredPeople = requiredPeople;
        }
        if (comment !== undefined) {
            bill.reminders = comment;
        }
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

async function updatePayments(changedPayments: any, newPayments: any, bill: BillDocument, params: any) {
    for (let changedPayment of changedPayments) {
        const changed = await PaymentModel.findById(changedPayment._id);
        changed.amount = changedPayment.amount;
        changed.activity = changedPayment.activity === "" ? "General" : changedPayment.activity;
        await changed.save();
    }
    const updatedPayments: PaymentDocument[] = [];
    for (let newPayment of newPayments) {
        updatedPayments.push(
            new PaymentModel({ payer: newPayment.payer, amount: newPayment.amount, activity: newPayment.activity === "" ? "General" : newPayment.activity })
        );
    }
    for (let updatedPayment of updatedPayments) {
        await updatedPayment.save();
    }
    bill.payments.push(...updatedPayments.map(pay => pay._id));
    await bill.save();

    const newBill = await BillModel.findById(params.bid).populate('payments');
    const sumUp = newBill.payments.map((pay: any) => { return Number(pay.amount); })
        .reduce((acc: Money, amount: number) => acc.add(new Money(amount)), new Money(0)).getAmountInDollars();
    newBill.sum = sumUp;
    await newBill.save();
}
