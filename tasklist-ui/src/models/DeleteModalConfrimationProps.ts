
import type { ConfirmationModalProps } from "../models/ConfirmationModalProps";
import type { TaskList } from "./Tasklist";

export interface DeleteModalConfrimationProps extends ConfirmationModalProps {
    item: TaskList;   
}