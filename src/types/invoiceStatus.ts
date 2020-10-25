export type InvoiceStatus =
    /**
     * Invoice issued, pending payment
     */
    "waiting" |

    /**
     * Invoice has been paid
     */
    "paid" |

    /**
     * Invoice has been rejected
     */
    "rejected" |

    /**
     * Payment processing error. Invoice has not been paid
     */
    "unpaid" |

    /**
     * Invoice expired. Invoice has not been paid
     */
    "expired"