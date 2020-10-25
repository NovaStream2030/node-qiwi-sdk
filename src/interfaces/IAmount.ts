export interface IAmount {
    /**
     * Billed amount, rounded down to 2 decimal places
     */
    value: number | string,

    /**
     * The currency of the invoice amount.
     */
    currency: string
}