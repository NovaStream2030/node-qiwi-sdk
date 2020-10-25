import { IAmount, ICustomer } from "./";
import { IStatus } from "./IStatus";

export interface IBillResponse {
    /**
     *
     */
    siteId: string;

    /**
     * Unique identifier of the issued invoice in your system
     */
    billId: string;

    /**
     * Invoice data
     */
    amount: IAmount;

    /**
     * Account status data
     */
    status: IStatus;

    /**
     * User IDs
     */
    customer?: ICustomer;

    /**
     * Bill comment
     */
    comment?: string;

    /**
     * Additional bill data
     */
    customFields?: Record<string, string>;

    /**
     * Link to the created form
     */
    payUrl: string;

    /**
     * The system date of the invoice creation.
     */
    creationDateTime: string;

    /**
     * The date until which the invoice will be available for payment.
     */
    expirationDateTime: string;
}