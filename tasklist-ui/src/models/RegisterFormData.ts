export interface RegisterFormData {
    "userName": string
    "displayName": string,
    "email": string,
    "password": string,
    "confirmPassword": string
}

export interface RegisterUserValidation {
    text: string;
    isError: boolean;
}   