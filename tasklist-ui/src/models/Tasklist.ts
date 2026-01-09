import type { Task } from "./Task";

export interface TaskList {
    id: number;
    title: string;
    description: string;
    toDoItemCount: number;
    tasks: Task[];
}