/**
 * Error when the TOKEN is not defined in the environment variables.
 */
export class TokenNotDefinedError extends Error {
    constructor() {
        super("TOKEN is not defined in the environment variables.");
        this.name = "TokenNotDefinedError";
    }
}