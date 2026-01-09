
import type { ConfirmationModalProps } from "./ConfirmationModalProps";
import type { Task } from "./Task";

export interface EditDeleteTaskModalConfrimationProps extends ConfirmationModalProps {
    item: Task;  
    listId: number; 
}