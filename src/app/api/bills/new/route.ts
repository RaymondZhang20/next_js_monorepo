import BillModel from "@models/bill";
import PaymentModel, { PaymentDocument } from "@models/payment";
import { BillState } from "@utils/BillsUtils";
import { connectToDB } from "@utils/DataBaseUtils";
import { NextResponse } from "next/server";

export const POST = async (req: Request, context: any) => {
  const {
    billTitle,
    initializer,
    comment,
    numberOfParticipants,
    participants,
  } = await req.json();
  try {
    await connectToDB();
    const newPayments: PaymentDocument[] = [];
    newPayments.push(
      new PaymentModel({ payer: initializer, amount: 0, activity: "General" })
    );
    for (let participant of participants) {
      newPayments.push(
        new PaymentModel({ payer: participant, amount: 0, activity: "General" })
      );
    }
    for (let newPayment of newPayments) {
      await newPayment.save();
    }
    const newBill = new BillModel({
      title: billTitle,
      initializer,
      requiredPeople: Number(numberOfParticipants) + 1,
      reminders: comment + "\n",
      createdDate: new Date(),
      state: BillState.Pending,
      payments: newPayments.map(pay => pay._id),
      sum: 0,
      outComes: [],
    });
    await newBill.save();
    return NextResponse.json(newBill, { status: 201 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { error: "Failed to create a new bill", message: errorMessage },
      { status: 500 }
    );
  }
};
