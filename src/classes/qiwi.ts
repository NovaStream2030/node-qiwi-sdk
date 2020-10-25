import axios, { AxiosInstance } from "axios";
import * as querystring from "querystring";

import {
    Bill,
    BillResponse,
    PaymentFormParams
} from "../interfaces/payment";

import Options from "../interfaces/options";

import { normalizeAmount } from "../utils";

export default class Qiwi {
    private client: AxiosInstance;
    private headers: HeadersInit;

    private readonly options: Options;

    constructor(options: Options) {
        this.options = options;

        this.client = axios.create({
            baseURL: options.url || "https://api.qiwi.com/partner/bill/v1/bills/"
        });

        this.headers = {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json",
            "Authorization": `Bearer ${this.options.secretKey}`
        };
    }

    createPaymentForm(params: PaymentFormParams): string {
        const { publicKey } = this.options;
        const amount = normalizeAmount(params.amount);

        let customFields = "";

        if (params.customFields) { // Что это за чертовщина?
            for (const [key, value] of Object.entries(params.customFields)) {
                customFields = customFields + "&" + "customFields[" + key + "]" + "=" + value;
            }
        }

        delete params.customFields;

        // @ts-ignore
        return `https://oplata.qiwi.com/create?${querystring.stringify({
            publicKey,
            ...params,
            amount
        })}${customFields}`;
    }

    createBill(params: Bill): Promise<BillResponse> {
        return new Promise<BillResponse>((resolve, reject) => {
            const data = {
                amount: {
                    currency: encodeURIComponent(params.amount.currency as string),
                    value: encodeURIComponent(normalizeAmount(params.amount.value))
                },
                expirationDateTime: params.expirationDateTime,
                comment: "",
                customer: {},
                customFields: {}
            };

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

            this.client.put(params.billId, data, {
                headers: this.headers
            }).then(response => {
                if (response.data.errorCode) return reject({
                    message: response.data.description,
                    error: response.data
                });

                if (response.data.payUrl && params.successUrl) {
                    response.data.payUrl = `${response.data.payUrl}&successUrl=${encodeURIComponent(params.successUrl)}`;
                }

                resolve(response.data);
            });
        });
    }

    getBillInfo(billId: string): Promise<BillResponse> {
        return new Promise<BillResponse>((resolve, reject) => {
            this.client.get(billId, {
                headers: this.headers
            }).then(response => {
                if (response.data.errorCode) return reject({
                    message: response.data.description,
                    error: response.data
                });

                resolve(response.data);
            });
        });
    }

    cancelBill(billId: string): Promise<BillResponse> {
        return new Promise<BillResponse>((resolve, reject) => {
            this.client.post(`${billId}/reject`, null, {
                headers: this.headers
            }).then(response => {
                if (response.data.errorCode) return reject({
                    message: response.data.description,
                    error: response.data
                });

                resolve(response.data);
            });
        });
    }
}