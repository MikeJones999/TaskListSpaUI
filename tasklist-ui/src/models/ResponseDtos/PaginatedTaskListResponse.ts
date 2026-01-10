import type { Task } from "../Task";

export interface PaginatedToDoListResponse {
    id: number;
    title: string;
    description: string;
    userId: string;
    toDoItemCount: number;
    totalItemCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    tasks: Task[];
}