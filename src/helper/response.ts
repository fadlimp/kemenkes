type OrArrayOfType<T> = T | T[];

export interface DefaultResponse {
    status: number,
    message: string,
    body: OrArrayOfType<string> | OrArrayOfType<number> | OrArrayOfType<object>,
}

export const STATUS_OK = 200;
export const STATUS_CREATED = 201;
export const STATUS_UNPROCESSABLE_ENTITY = 422;
export const STATUS_INTERNAL_SERVER_ERROR = 500;
