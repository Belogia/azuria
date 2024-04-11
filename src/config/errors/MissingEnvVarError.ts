/**
 * `MissingEnvVarError` is a custom error class that extends the built-in `Error` class.
 * It is thrown when an expected environment variable is not defined.
 *
 * @example
 * if (!process.env.SOME_VAR) {
 *   throw new MissingEnvVarError('SOME_VAR');
 * }
 *
 * @class
 * @extends {Error}
 */
export class MissingEnvVarError extends Error {
    /**
     * Creates an instance of `MissingEnvVarError`.
     *
     * @param {string} envVar - The name of the missing environment variable.
     */
    constructor(envVar: string) {
        super(`${envVar} is not defined!`);
        this.name = "MissingEnvVarError";
    }
}