import {InvoiceStatus} from "../types";

export interface Amount {
    /**
     * Billed amount, rounded down to 2 decimal places
     */
    value: number | string,

    /**
     * The currency of the invoice amount.
     */
    currency: string
}

export interface Customer {
    /**
     * User's phone number (in international format)
     */
    phone?: string;

    /**
     * User email
     */
    email?: string;

    /**
     * User ID on your system
     */
    account?: string;
}

export interface Bill {
    /**
     * Unique identifier of the issued invoice in your system
     */
    billId: string;

    /**
     * Invoice data
     */
    amount: Amount;

    /**
     * The date until which the invoice will be available for payment.
     */
    expirationDateTime: string;

    /**
     * User IDs
     */
    customer?: Customer;

    /**
     * Bill comment
     */
    comment?: string;

    /**
     * Additional bill data
     */
    customFields?: Record<string, string>;

    /**
     * URL for redirecting in case of successful transfer from the balance of QIWI Wallet. If you use another payment method, forwarding is not performed. The link should lead to your site.
     */
    successUrl?: string;
}

export interface Status {
    /**
     * Current account status
     */
    value: InvoiceStatus;

    /**
     * Status update date
     */
    changedDateTime: string;
}

export interface BillResponse {
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
    amount: Amount;

    /**
     * Account status data
     */
    status: Status;

    /**
     * User IDs
     */
    customer?: Customer;

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

export interface PaymentFormParams {
    /**
     * Unique identifier of the issued invoice in your system
     */
    billId?: string;

    /**
     * Billed amount, rounded down to 2 decimal places
     */
    amount?: number;

    /**
     * User's phone number (in international format)
     */
    phone?: string;

    /**
     * User email
     */
    email?: string;

    /**
     * User ID on your system
     */
    account?: string;

    /**
     * Bill comment
     */
    comment?: string;

    /**
     * Additional bill data
     */
    customFields?: Record<string, string>;

    /**
     * The date until which the invoice will be available for transfer.
     */
    lifetime?: string;

    /**
     * URL for redirecting in case of successful transfer from the balance of QIWI Wallet. If you use another payment method, forwarding is not performed. The link should lead to your site.
     */
    successUrl?: string;
}