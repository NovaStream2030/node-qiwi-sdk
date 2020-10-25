import * as crypto from "crypto";
import { ICheckNotificationSignature } from "../interfaces";

/**
 * Checks notification data signature
 */
export function checkNotificationSignature({
    signature,
    notificationBody,
    merchantSecret
}: ICheckNotificationSignature) {
    const processedNotificationData = {
        "billId": notificationBody.bill.billId,
        "amount.value": Number(notificationBody.bill.amount.value).toFixed(2),
        "amount.currency": notificationBody.bill.amount.currency,
        "siteId": notificationBody.bill.siteId,
        "status": notificationBody.bill.status.value
    };

    const convertedNotificationData = Object.keys(processedNotificationData)
        .sort()
        .map((key) => processedNotificationData[key].toString())
        .join("|");

    const hash = crypto
        .createHmac("sha256", merchantSecret)
        .update(convertedNotificationData)
        .digest("hex");

    return hash === signature;
}