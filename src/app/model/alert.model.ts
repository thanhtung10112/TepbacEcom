export class Alert {
    type: AlertType;
    message: string;
    hidden: boolean;
}
 
export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}