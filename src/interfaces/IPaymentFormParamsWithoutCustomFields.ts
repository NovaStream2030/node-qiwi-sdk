export interface IPaymentFormParamsWithoutCustomFields {
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
     * The date until which the invoice will be available for transfer.
     */
    lifetime?: string;

    /**
     * URL for redirecting in case of successful transfer from the balance of QIWI Wallet. If you use another payment method, forwarding is not performed. The link should lead to your site.
     */
    successUrl?: string;
}