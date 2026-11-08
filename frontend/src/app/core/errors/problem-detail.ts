import { GlobalError } from "./global-error";
import { ValidatorError } from "./validator-error";

export interface ProblemDetail {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance?: string;
    errors?: ValidatorError[];
    globalErrors?: GlobalError[];
}
