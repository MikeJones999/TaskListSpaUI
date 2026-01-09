export interface TaskList {
    id: number;
    title: string;
    description: string;
    toDoItemCount: number;
    tasks: Task[];
}

export interface Task {
    id: number;
    title: string;
    status: number;
    priority: number;
}