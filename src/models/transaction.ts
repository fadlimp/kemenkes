import BaseModel from "./base_model";
import { Model } from "objection";

export class TransactionModel extends BaseModel {
    public static tableName = "public.transactions";

    public parking_lot_id: string;

    public register_number: string;
    public color: string;
    public fee_amount: string;
    public duration_minutes: string;

    public checked_in: string;
    public checked_out: string;

    public created_at: string;
    public updated_at: string;
    public deleted_at: string;

    static relationMappings = {};
}
