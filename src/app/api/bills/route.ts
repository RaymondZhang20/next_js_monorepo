import BillModel from "@models/bill";
import { connectToDB } from "@utils/DataBaseUtils";
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';
export async function GET(req: Request, context: any) {
  try {
    await connectToDB()

    const bills = await BillModel.find({}).populate('payments');

    return NextResponse.json(bills, { status: 200 });
} catch (error) {
    return NextResponse.json("Failed to fetch all bills", { status: 500 });
}
}
