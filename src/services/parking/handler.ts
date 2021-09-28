import * as _ from "lodash";
import { DefaultResponse } from "../../helper/response";
import Knex from "knex";
import { INTEGER } from "sequelize/types";
import { ParkingModel } from "../../models/parking_lot";
import { TransactionModel } from "../../models/transaction";

const knex = Knex(
    require("../../../knexfile")[process.env.NODE_ENV || "development"]
);
const max_capacity = parseInt(process.env.MAX_SLOT_CAPACITY);

export class FileLineFormatException extends Error {}

export async function checkIn(data: any) {
    await generateParkingSlot();
    const availableSlot = await checkAvailableSlot();
    const status = { status: false };

    if (availableSlot.length > 1) {
        const checkRecord = await TransactionModel.query()
            .where("register_number", data.registrationNumber)
            .andWhere("checked_out", null)
            .first()
            .then((row) => row);

        const getSlot = await ParkingModel.query()
            .where("status", true)
            .orderBy("slot_number", "ASC")
            .first()
            .then((row) => row);

        if (checkRecord == undefined) {
            const update = await ParkingModel.query()
                .where("id", getSlot.id)
                .update(status)
                .then(async function () {
                    const payload = {
                        parking_lot_id: getSlot.id,
                        register_number: data.registrationNumber,
                        color: data.color,
                        checked_in: data.checkinAt,
                    };
                    await TransactionModel.query().insert(payload);
                });
            return {
                status: 201,
                message: "Berhasil checkIn",
                data: {
                    data,
                },
            };
        } else {
            return {
                status: 422,
                message:
                    "Data sudah checkin sebelumnya / belum melakukan checkout",
                data: {
                    data,
                },
            };
        }
    } else {
        return {
            status: 422,
            message: "No Available Slot",
            data: {
                data,
            },
        };
    }
}

export async function checkOut(data: any) {
    const status = { status: true };
    const transaction = await TransactionModel.query()
        .where("register_number", data.registrationNumber)
        .andWhere("checked_out", null)
        .first()
        .then((row) => row);

    if (transaction) {
        const update = await ParkingModel.query()
            .where("id", transaction.parking_lot_id)
            .update(status)
            .then(async function () {
                const payload = {
                    checked_out: data.checkoutAt,
                };
                await TransactionModel.query().update(payload);
            });
        return {
            status: 201,
            message: "Berhasil checkOut",
            data: {
                data,
            },
        };
    } else {
        return {
            status: 404,
            message: "Data Tidak Ditemukan",
            data: {
                data,
            },
        };
    }
}

export async function getAllData() {
    const result = await TransactionModel.query()
        .select("transactions.* ", "parking_lot.slot_number")
        .where("checked_out", null)
        .join(
            "parking_lot",
            "parking_lot.id",
            "=",
            "transactions.parking_lot_id"
        );

    return {
        status: 200,
        message: "Data Mobil/Motor Yang sedang parkir",
        data: {
            result,
        },
    };
}

export async function getFilterData(filter: any) {
    let data: any;
    const result = async (q: any) =>
        await TransactionModel.query()
            .join(
                "parking_lot",
                "parking_lot.id",
                "=",
                "transactions.parking_lot_id"
            )
            .where((qb) => {
                if (q.registrationNumber) {
                    qb.where(
                        "items.register_number",
                        "like",
                        `%${q.registrationNumber}%`
                    );
                }
                if (q.color) {
                    qb.orWhere("items.color", "=", q.color);
                }
            })
            .andWhere("checked_out", null);

    if (result.length > 0) {
        return {
            status: 200,
            message: "Filter Data Mobil/Motor Yang sedang parkir",
            data: {
                result,
            },
        };
    } else {
        return {
            status: 404,
            message: "Tidak ada data",
        };
    }
}

async function checkAvailableSlot() {
    return await ParkingModel.query().where("status", true);
}

async function generateParkingSlot() {
    const q = await ParkingModel.query();
    if (q.length < 1) {
        for (let i = 1; i <= max_capacity; i++) {
            const payload = {
                slot_number: i,
                status: true,
            };
            await ParkingModel.query().insert(payload);
        }
    }
}

async function filter(filter: any) {}
