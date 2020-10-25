export interface ICheckNotificationSignature {
    signature: string;
    notificationBody: Record<string, any>;
    merchantSecret: string;
}