export interface ResponseDto<T> {
    responseData: T;
    success: boolean;
    message: string;
}
