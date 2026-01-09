
import type { ConfirmationModalProps } from "./ConfirmationModalProps";
import type { TaskList } from "./Tasklist";

export interface EditDeleteTaskModalConfrimationProps extends ConfirmationModalProps {
    item: TaskList | null;   
}