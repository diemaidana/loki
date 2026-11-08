export interface ValidatorError {
    field: string;
    rejectedValue: unknown;
    code: string;
    message: string;
}
