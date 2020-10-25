import { InvoiceStatus } from "../types";

export interface IStatus {
    /**
     * Current account status
     */
    value: InvoiceStatus;

    /**
     * Status update date
     */
    changedDateTime: string;
}