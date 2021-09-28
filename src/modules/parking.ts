import { module } from "../decorator/module";
import { get, post, put, del } from "../decorator/route";
import axios from "axios";
import { DateTime } from "luxon";
import * as _date from "date-fns";
import app from "../app";
import * as url from "url";
import { validator } from "../middleware/validation";
import {
    FileLineFormatException,
    checkIn,
    checkOut,
    getFilterData,
    getAllData,
} from "../services/parking/handler";
import {
    DefaultResponse,
    STATUS_INTERNAL_SERVER_ERROR,
    STATUS_UNPROCESSABLE_ENTITY,
    STATUS_OK,
} from "../helper/response";

var escapeJSON = require("escape-json-node");
const max_capacity = process.env.MAX_SLOT_CAPACITY;

@module("/parking")
export default class ParkingModule {
    @get("/list", [])
    public async parkingList(ctx: any) {
        const body = ctx.request.query;

        if (body.registrationNumber == undefined || body.color == undefined) {
            const response = await getAllData();

            ctx.status = 200;
            ctx.body = response;
        } else {
            const response = await getFilterData(body);

            // ctx.status = response.status;
            // ctx.body = response;
        }
    }

    @post("/checkin", [
        validator.body({
            registrationNumber: { type: "string" },
            color: { type: "string" },
            checkinAt: { type: "string" },
        }),
    ])
    public async checkinParking(ctx: any) {
        const body = ctx.request.body;

        try {
            const response = await checkIn(body);

            console.log("response", response);
            ctx.status = response.status;
            ctx.body = response;
        } catch (err) {
            const errorCode =
                err instanceof FileLineFormatException
                    ? STATUS_UNPROCESSABLE_ENTITY
                    : STATUS_INTERNAL_SERVER_ERROR;

            const response: DefaultResponse = {
                status: errorCode,
                message: err.message,
                body: err,
            };

            ctx.status = errorCode;
            ctx.body = response;
        }
    }

    @post("/checkout", [
        validator.body({
            registrationNumber: { type: "string" },
            color: { type: "string" },
            checkoutAt: { type: "string" },
        }),
    ])
    public async checkoutParking(ctx: any) {
        const body = ctx.request.body;

        try {
            const response = await checkOut(body);

            ctx.status = response.status;
            ctx.body = response;
        } catch (err) {
            const errorCode =
                err instanceof FileLineFormatException
                    ? STATUS_UNPROCESSABLE_ENTITY
                    : STATUS_INTERNAL_SERVER_ERROR;

            const response: DefaultResponse = {
                status: errorCode,
                message: err.message,
                body: err,
            };

            ctx.status = errorCode;
            ctx.body = response;
        }
    }
}
