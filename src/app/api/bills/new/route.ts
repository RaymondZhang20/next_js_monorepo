import Bill from "@models/bill";
import { BillState } from "@utils/BillsUtils";
import { connectToDB } from "@utils/DataBaseUtils";
import { NextResponse } from "next/server";

export const POST = async (req: Request, context: any) => {
    const { title, initializer, requiredPeople, reminders, createdDate } = await req.json();
    try {
        await connectToDB();
        const newBill = new Bill({ title, initializer, requiredPeople, reminders, createdDate, state: BillState.Pending, payments: [], sum:0, outComes: [] });
        await newBill.save();
        return NextResponse.json(newBill, { status: 201 });
    } catch (error) {
        const errorMessage = (error as Error).message;
        return NextResponse.json({ error: "Failed to create a new bill", message: errorMessage } , { status: 500 });
    }
}