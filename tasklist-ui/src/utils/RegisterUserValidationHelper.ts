import type { RegisterUserValidation, RegisterFormData } from "../models/RegisterFormData";



export default function RegisterUserValidationHelper(formData: RegisterFormData): RegisterUserValidation {

    if (formData.password !== formData.confirmPassword) {
        return {
            text: "Passwords do not match.",
            isError: true
        };
    }
    if (formData.userName.trim() === "" ||
        formData.userName.trim().length < 5 ||
        formData.userName.trim().length > 15) {
        return {
            text: "Username must be between 5 and 15 characters.",
            isError: true
        };
    }
    if (formData.password.length < 12) {
        return {
            text: "Password must be at least 12 characters long.",
            isError: true
        };
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/.test(formData.password)) {
        return {
            text: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
            isError: true
        };
    }

    if( formData.displayName.trim() === "" ||
        formData.displayName.trim().length < 3 ||
        formData.displayName.trim().length > 30) {
        return {
            text: "Display Name must be between 3 and 30 characters.",
            isError: true
        };
    }
    if( formData.email.trim() === "" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return {
            text: "Please enter a valid email address.",
            isError: true
        };
    }
  
    return {
        text: "Validation successful.",
        isError: false
    };
};
