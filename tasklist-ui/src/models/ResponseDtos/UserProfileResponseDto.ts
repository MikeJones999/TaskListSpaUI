import type UserProfile from "../UserProfileModel";

export interface UserProfileResponseDto {
    responseData: UserProfile;
    success: boolean;
    message: string;    
}