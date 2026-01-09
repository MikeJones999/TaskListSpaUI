
import type { ConfirmationModalProps } from "./ConfirmationModalProps";
import type { TaskList } from "./Tasklist";

export interface EditDeleteModalConfrimationProps extends ConfirmationModalProps {
    item: TaskList;   
}