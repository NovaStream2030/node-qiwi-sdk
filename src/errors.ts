export interface IAPIErrorOptions {
    error: object | any;
    message: string;
}

export class APIError extends Error {
    private error: object;

    /**
     * Constructor
     *
     * @param message
     * @param error
     */
    constructor({ message, error }: IAPIErrorOptions) {
        super(message);

        this.name = this.constructor.name;
        this.error = error;

        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Returns custom tag
     */
    public get [Symbol.toStringTag](): string {
        return this.constructor.name;
    }

    /**
     * Returns property for json
     */
    public toJSON(): Pick<this, keyof this> {
        const json = {} as Pick<this, keyof this>;

        for (const key of Object.getOwnPropertyNames(this)) {
            json[key as keyof this] = this[key as keyof this];
        }

        return json;
    }
}