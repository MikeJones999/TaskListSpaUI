
import type { ConfirmationModalProps } from "./ConfirmationModalProps";
import type { TaskList } from "./Tasklist";

export interface EditDeleteTaskListModalConfrimationProps extends ConfirmationModalProps {
    item: TaskList;   
}