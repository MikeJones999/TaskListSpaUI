import type { Task } from "../Task";

export interface TaskRelatedResponseDto {
    responseData: Task;
    success: boolean;
    message: string;    
}
