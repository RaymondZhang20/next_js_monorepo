import { v4 as uuidv4 } from "uuid";

export class Money {
  private readonly amount: bigint;

  constructor(amount: number) {
    this.amount = BigInt(Math.round(amount * 100));
  }

  getAmountInDollars(): number {
    return Number(this.amount) / 100;
  }

  add(money: Money): Money {
    return new Money(this.getAmountInDollars() + money.getAmountInDollars());
  }

  subtract(money: Money): Money {
    return new Money(this.getAmountInDollars() - money.getAmountInDollars());
  }

  multiply(scalar: number): Money {
    return new Money(this.getAmountInDollars() * scalar);
  }

  divide(scalar: number): Money {
    if (scalar === 0) {
      throw new Error("Division by zero");
    }
    return new Money(this.getAmountInDollars() / scalar);
  }

  isEqualTo(money: Money): boolean {
    return this.amount === money.amount;
  }

  isGreaterThan(money: Money): boolean {
    return this.amount > money.amount;
  }

  isLessThan(money: Money): boolean {
    return this.amount < money.amount;
  }

  toString(withPrefix: boolean = false): string {
    if (withPrefix) return `$ ${this.getAmountInDollars().toFixed(2)} CAD`;
    else return this.getAmountInDollars().toFixed(2);
  }
}

export type PaymentT = {
    _id: string;
    payer: string;
    amount: string;
    activity: string;
}

export class PaymentUtil {
  _id: string;
  payer: string;
  amount: Money;
  activity: string;

  constructor(_id = uuidv4(), payer: string, amount: Money = new Money(0), activity: string = "") {
    this._id = _id;
    this.payer = payer;
    this.amount = amount;
    this.activity = activity;
  }

  static serialize(payment: PaymentUtil): PaymentT {
    return {
      _id: payment._id,
      payer: payment.payer,
      amount: payment.amount.toString(),
      activity: payment.activity
    };
  }

  static deserialize(data: PaymentT): PaymentUtil {
    return new PaymentUtil(
      data._id,
      data.payer,
      new Money(Number(data.amount)),
      data.activity,
    );
  }
}

export enum BillState {
  Pending = "Pending",
  Done = "Done",
  Archived = "Archived",
  Doubtful = "Doubtful",
  Error = "Error",
}

type BillOutcomeT = {
  payer: string;
  amount: number;
}

export type BillT = {
    _id: string;
    title: string;
    initializer: string;
    requiredPeople: number;
    reminders: string;
    payments: PaymentT[];
    sum: string;
    state: BillState;
    createdDate: string;
    outComes: BillOutcomeT[];
}

export class BillUtil {
  _id: string;
  title: string;
  reminders: string;
  payments: PaymentUtil[];
  sum: Money;
  state: BillState;
  createdDate: Date;
  modifing: boolean;

  constructor(
    _id = uuidv4(),
    payments: PaymentUtil[],
    title: string,
    reminders?: string,
    state?: BillState,
    createdDate: Date = new Date(),
  ) {
    this._id = _id;
    this.title = title;
    this.reminders = reminders || "No comments for now";
    this.payments = payments;
    this.state = state || BillState.Pending;
    this.sum = this.sumUp();
    this.createdDate = createdDate;
    this.modifing = false;
  }

  static serialize(bill: BillUtil): BillT {
    return {
      _id: bill._id,
      title: bill.title,
      reminders: bill.reminders,
      payments: bill.payments.map(payment => PaymentUtil.serialize(payment)),
      sum: bill.sum.toString(),
      state: bill.state,
      createdDate: bill.createdDate.toISOString(),
      outComes: [],
      initializer: "ss",
      requiredPeople: 2,
    };
  }

  static deserialize(data: BillT): BillUtil {
    return new BillUtil(
      data._id,
      data.payments.map((payment: PaymentT) => PaymentUtil.deserialize(payment)),
      data.title,
      data.reminders,
      data.state,
      new Date(data.createdDate),
    );
  }

  static getDistinctPayers(bill:BillT): string[] {
    const distinctPayersSet = new Set<string>();
    bill.payments.forEach((payment) => {
      distinctPayersSet.add(payment.payer);
    });
    return Array.from(distinctPayersSet);
  }

  sumUp(): Money {
    return this.payments.reduce(
      (total, payment) => total.add(payment.amount),
      new Money(0)
    );
  }

  addPayment(payment: PaymentUtil): void {
    if (this.modifing) {
      throw new Error("Concurrent modification detected. Please try again.");
    }
    this.modifing = true;
    this.payments.push(payment);
    this.sum = this.sumUp();
    this.modifing = false;
  }

  modifyPayment(_id: string, newPayment: PaymentUtil): void {
    if (this.modifing) {
      throw new Error("Concurrent modification detected. Please try again.");
    }
    this.modifing = true;
    const paymentIndex = this.payments.findIndex(
      (payment) => payment._id === _id
    );
    if (paymentIndex === -1) {
      throw new Error("Payment not found");
    }
    const existingPayment = this.payments[paymentIndex];
    this.payments[paymentIndex] = {
      ...existingPayment,
      ...newPayment,
    };
    this.sum = this.sumUp();
    this.modifing = false;
  }

  deletePayment(_id: string): void {
    if (this.modifing) {
      throw new Error("Concurrent modification detected. Please try again.");
    }
    this.modifing = true;
    const paymentIndex = this.payments.findIndex(
      (payment) => payment._id === _id
    );
    if (paymentIndex === -1) {
      throw new Error("Payment not found");
    }
    this.payments.splice(paymentIndex, 1);
    this.sum = this.sumUp();
    this.modifing = false;
  }

  getAllDistinctPayers(): string[] {
    const distinctPayersSet = new Set<string>();
    this.payments.forEach((payment) => {
      distinctPayersSet.add(payment.payer);
    });
    return Array.from(distinctPayersSet);
  }
}
