import { IAmount, ICustomer } from "./";

export interface IBill {
    /**
     * Unique identifier of the issued invoice in your system
     */
    billId: string;

    /**
     * Invoice data
     */
    amount: IAmount;

    /**
     * The date until which the invoice will be available for payment.
     */
    expirationDateTime: string;

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
     * URL for redirecting in case of successful transfer from the balance of QIWI Wallet. If you use another payment method, forwarding is not performed. The link should lead to your site.
     */
    successUrl?: string;
}