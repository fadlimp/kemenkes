import BaseModel from "./base_model";
import { Model } from "objection";

export class ParkingModel extends BaseModel {
    public static tableName = "public.parking_lot";

    public id: string;
    public slot_number: string;
    public status: boolean;

    public created_at: string;
    public updated_at: string;
    public deleted_at: string;

    static relationMappings = {};
}
