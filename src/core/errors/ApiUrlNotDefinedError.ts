/**
 * Error thrown when the API_URL is not defined in the environment variables.
 */
export class ApiUrlNotDefinedError extends Error {
    constructor() {
        super("API_URL is not defined in the environment variables.");
        this.name = "ApiUrlNotDefinedError";
    }
}