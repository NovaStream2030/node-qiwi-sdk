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

    private readonly options: Options;

    constructor(options: Options) {
        this.options = options;

        this.client = axios.create({
            baseURL: options.url || "https://api.qiwi.com/partner/bill/v1/bills/"
        });

        this.client.defaults.headers = {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json",
            "Authorization": `Bearer ${this.options.secretKey}`
        };
    }

    createPaymentForm(params: PaymentFormParams): string {
        const { publicKey } = this.options;

        let customFields = "";

        if (params.customFields) {
            customFields = Object.entries(params.customFields)
                .map(([key, value]) => `customFields[${key}]=${value}`)
                .join("&");
        }
        delete params.customFields;

        // Костыль!
        const qiwiParams: Record<any, any> = {
            publicKey,
            ...params
        }
        
        if (params.amount) {
            qiwiParams.amount = normalizeAmount(params.amount);
        }

        // @ts-ignore
        return `https://oplata.qiwi.com/create?${querystring.stringify(qiwiParams)}${customFields}`;
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

            if (params.comment) {
                data.comment = encodeURIComponent(params.comment);
            }

            if (params.customer) {
                Object.entries(params.customer).forEach(([key, value]) =>
                    data.customer[key] = encodeURIComponent(value)
                );
            }

            if (params.customFields) {
                Object.entries(params.customFields).forEach(([key, value]) =>
                    data.customFields[key] = encodeURIComponent(value)
                );
            }

            this.client.put(params.billId, data).then(({ data }) => {
                if (data.errorCode) {
                    return reject({
                        message: data.description,
                        error: data
                    });
                }

                if (data.payUrl && params.successUrl) {
                    data.payUrl = `${data.payUrl}&successUrl=${encodeURIComponent(params.successUrl)}`;
                }

                resolve(data);
            });
        });
    }

    getBillInfo(billId: string): Promise<BillResponse> {
        return new Promise<BillResponse>((resolve, reject) => {
            this.client.get(billId).then(({ data }) => {
                if (data.errorCode) {
                    return reject({
                        message: data.description,
                        error: data
                    });
                }

                resolve(data);
            });
        });
    }

    cancelBill(billId: string): Promise<BillResponse> {
        return new Promise<BillResponse>((resolve, reject) => {
            this.client.post(`${billId}/reject`).then(({ data }) => {
                if (data.errorCode) {
                    return reject({
                        message: data.description,
                        error: data
                    });
                }

                resolve(data);
            });
        });
    }
}
