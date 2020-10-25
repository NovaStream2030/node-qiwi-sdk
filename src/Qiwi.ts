import {
    IOptions,
    IPaymentFormParams,
    IPaymentFormParamsWithoutCustomFields,
    IBill,
    IBillResponse
} from "./interfaces";
import { normalizeAmount } from "./utils";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { APIError } from "./errors";

export class Qiwi {
    public url: string;
    private headers: { Authorization: string; Accept: string; "Content-Type": string };

    constructor(private options: IOptions) {
        this.url = "https://api.qiwi.com/partner/bill/v1/bills/";

        this.headers = {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json",
            "Authorization": `Bearer ${this.options.secretKey}`
        };
    }

    createPaymentForm(params: IPaymentFormParams): string {
        const { publicKey } = this.options;
        const amount = normalizeAmount(params.amount);
        let customFields = "";

        if (params.customFields) {
            for (const [key, value] of Object.entries(params.customFields)) {
                customFields = customFields + "&" + "customFields[" + key + "]" + "=" + value;
            }
        }
        delete params.customFields;

        const query = new URLSearchParams({
            publicKey,
            ...params as IPaymentFormParamsWithoutCustomFields,
            amount
        });

        return `https://oplata.qiwi.com/create?${query.toString()}${customFields}`;
    }

    async createBill(params: IBill): Promise<IBillResponse> {
        const data = {
            amount: {
                currency: encodeURIComponent(params.amount.currency as string),
                value: encodeURIComponent(normalizeAmount(params.amount.value))
            },
            expirationDateTime: params.expirationDateTime,
            comment: "",
            customer: {},
            customFields: {}
        }

        if (params.comment)
            data.comment = encodeURIComponent(params.comment);
        if (params.customer) {
            for (const [key, value] of Object.entries(params.customer)) {
                data.customer[key] = encodeURIComponent(value);
            }
        } if (params.customFields) {
            for (const [key, value] of Object.entries(params.customFields)) {
                data.customFields[key] = encodeURIComponent(value);
            }
        }

        let bill = await fetch(this.url + params.billId, {
            method: 'put',
            body: JSON.stringify(data),
            headers: this.headers
        })
            .then(res => res.json())
            .then(json => json)
            .catch((error) => { throw error });

        if (bill.errorCode)
            throw new APIError({
                message: bill.description,
                error: bill
            });

        if (bill.payUrl && params.successUrl) {
            bill.payUrl = `${bill.payUrl}&successUrl=${encodeURIComponent(params.successUrl)}`;
        }
        return bill as IBillResponse;
    }

    async getBillInfo(billId: string): Promise<IBillResponse> {
        let bill = await fetch(this.url + billId, {
            method: 'get',
            headers: this.headers
        })
            .then(res => res.json())
            .then(json => json)
            .catch((error) => { throw error });

        if (bill.errorCode)
            throw new APIError({
                message: bill.description,
                error: bill
            });

        return bill as IBillResponse;
    }

    async cancelBill(billId: string): Promise<IBillResponse> {
        let bill = await fetch(this.url + billId + "/reject", {
            method: 'post',
            headers: this.headers
        })
            .then(res => res.json())
            .then(json => json)
            .catch((error) => { throw error });

        if (bill.errorCode)
            throw new APIError({
                message: bill.description,
                error: bill
            });

        return bill as IBillResponse;
    }
}