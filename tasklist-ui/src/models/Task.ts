export interface Task {
    id: number;
    title: string;
    status: number;
    priority: number;
    description: string;
    type: string;
    toDoListId: number;
}