
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast"
import ToastWrapper from "../components/toastWrapper";
import { useEffect, useState } from 'react';
import type { TaskList } from "../models/Tasklist";
import type { Task } from "../models/Task";
import { tokenService } from '../services/tokenServices';
import { apiRequest } from "../services/apiService";
import type { DeleteResponseDto } from '../models/ResponseDtos/DeleteResponseDto';
import { useNavigate } from 'react-router-dom';
import { getPriorityInfo } from '../utils/priorityHelper';
import { getStatusInfo } from '../utils/statusHelper';

interface ResponseDto {
    responseData: TaskList;
    success: boolean;
    message: string;
}

export default function Tasks() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [taskList, setTaskList] = useState<TaskList | null>(null);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [openStatusDropdown, setOpenStatusDropdown] = useState<number | null>(null);
    const [openPriorityDropdown, setOpenPriorityDropdown] = useState<number | null>(null);

    const getTaskList = async () => {
        try {
            const token = tokenService.getAccessToken();
            console.log("Using token:", token);
            const data = await apiRequest<ResponseDto>(`ToDoLists/${id}`, { method: "GET", token: token || undefined });
            console.log("returned data", data);
            if (data.success && data.responseData) {
                setTaskList(data.responseData);
            }
        } catch (error) {
            console.error("Error fetching task lists:", error);
        }
    };

    useEffect(() => {
        getTaskList();
    }, []);

    const handleDelete = async (id: number) => {
        const taskFound = taskList?.tasks.find(tl => tl.id === id);
        if (taskFound) {
            setSelectedTask(taskFound);
            setShowDeleteModal(true);
        }
        else {
            try {
                const result = await apiRequest<DeleteResponseDto>(`ToDoLists/${id}`, {
                    method: "DELETE",
                    token: tokenService.getAccessToken() || undefined
                });
                if (!result.success) {
                    toast.error("Failed to delete task: " + result.message);
                    return;
                }
                toast.success("Task deleted successfully!");
                getTaskList();
            }
            catch (error) {
                console.error("Error deleting task:", error);
                toast.error("An error occurred. Please try again.");
                return;
            }
        }

        console.log("Delete task with ID:", id);
    }

    const handleEdit = async (id: number) => {
        const taskFound = taskList?.tasks.find(tl => tl.id === id);
        console.log("Edit task list with ID:", id);
        setSelectedTask(taskFound || null);
        setShowEditModal(true);
    }


    const handleNavigation = (id: number) => {
        console.log("Navigate to task list with ID:", id);
        navigate(`/Tasks/${id}`);
    }


    const handleCreateTaskModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault();
        setShowCreateModal(true);
    }

    const handleEditStatus = async (taskId: number, newStatus: number): Promise<void> => {
        try {
            // const token = tokenService.getAccessToken();
            // const result = await apiRequest<DeleteResponseDto>(`ToDoLists/${id}/tasks/${taskId}/status`, {
            //     method: "PATCH",
            //     token: token || undefined,
            //     body: { status: newStatus }
            // });

            // if (!result.success) {
            //     toast.error("Failed to update task status: " + result.message);
            //     return;
            // }

            toast.success("Task status updated successfully!");
            setOpenStatusDropdown(null);
            getTaskList();
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("An error occurred. Please try again.");
        }
    }

    const toggleStatusDropdown = (taskId: number) => {
        setOpenStatusDropdown(openStatusDropdown === taskId ? null : taskId);
    }

    const handleEditPriority = async (taskId: number, newPriority: number): Promise<void> => {
        try {
            // const token = tokenService.getAccessToken();
            // const result = await apiRequest<DeleteResponseDto>(`ToDoLists/${id}/tasks/${taskId}/priority`, {
            //     method: "PATCH",
            //     token: token || undefined,
            //     body: { priority: newPriority }
            // });

            // if (!result.success) {
            //     toast.error("Failed to update task priority: " + result.message);
            //     return;
            // }

            toast.success("Task priority updated successfully!");
            setOpenPriorityDropdown(null);
            getTaskList();
        } catch (error) {
            console.error("Error updating task priority:", error);
            toast.error("An error occurred. Please try again.");
        }
    }

    const togglePriorityDropdown = (taskId: number) => {
        setOpenPriorityDropdown(openPriorityDropdown === taskId ? null : taskId);
    }

    return (
        <>
            <div>
                <ToastWrapper />
                {/* {showCreateModal && <CreateTaskModal onClose={() => setShowCreateModal(false)} onSuccess={getTaskList} />}
                {showDeleteModal && selectedTask && <DeleteTaskConfirmationModal item={selectedTask} onClose={() => setShowDeleteModal(false)} onSuccess={getTaskList} />}
                {showEditModal && selectedTask && <EditTaskModal item={selectedTask} onClose={() => setShowEditModal(false)} onSuccess={getTaskList} />} */}

                <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 mb-4 px-4">
                    <p className="text-base sm:text-lg md:text-xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-teal-300 text-center">Task List: {taskList?.title}</p>
                </div>
                <div className="flex justify-center items-start min-h-screen px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-3xl">
                        <button
                            onClick={handleCreateTaskModal}
                            className="mb-4 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md shadow transition-all uppercase tracking-wide text-xs sm:text-sm">
                            Create Task
                        </button>
                        <div className="relative flex flex-col rounded-lg bg-white shadow-sm border border-slate-200 w-full">
                            <nav className="flex w-full flex-col gap-1 p-2 sm:p-3">
                                {taskList?.tasks && taskList.tasks.length > 0 && taskList.tasks.map(task => (
                                    <div
                                        key={task.id}
                                        role="button"
                                        className="text-slate-800 flex w-full items-center rounded-md p-2 sm:p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 gap-2"
                                    >
                                        <button
                                            className="flex-shrink-0 rounded-md border border-transparent p-1.5 sm:p-2 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none relative"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePriorityDropdown(task.id);
                                            }}
                                            aria-label="Edit task priority"
                                        >
                                            <span className="block sm:inline mt-1 sm:mt-0">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${getPriorityInfo(task.priority).color} ${getPriorityInfo(task.priority).bgColor}`}>
                                                    {getPriorityInfo(task.priority).text}
                                                </span>
                                            </span>

                                            {openPriorityDropdown === task.id && (
                                                <div className="absolute left-0 top-full mt-1 z-50 bg-white rounded-md shadow-lg border border-slate-200 py-1 min-w-[120px]"
                                                    onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors"
                                                        onClick={() => handleEditPriority(task.id, 1)}
                                                    >
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPriorityInfo(1).color} ${getPriorityInfo(1).bgColor}`}>
                                                            {getPriorityInfo(1).text}
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors"
                                                        onClick={() => handleEditPriority(task.id, 2)}
                                                    >
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPriorityInfo(2).color} ${getPriorityInfo(2).bgColor}`}>
                                                            {getPriorityInfo(2).text}
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors"
                                                        onClick={() => handleEditPriority(task.id, 3)}
                                                    >
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPriorityInfo(3).color} ${getPriorityInfo(3).bgColor}`}>
                                                            {getPriorityInfo(3).text}
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </button>

                                        <span className="flex-1 break-words text-sm sm:text-base cursor-pointer" onClick={() => handleNavigation(task.id)}>
                                            <span className="hidden sm:inline"> </span>
                                            <span className="text-base sm:text-lg md:text-xl font-bold block sm:inline">{task.title}</span>
                                        </span>

                                        <button
                                            className="flex-shrink-0 rounded-md border border-transparent p-1.5 sm:p-2 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none relative"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleStatusDropdown(task.id);
                                            }}
                                            aria-label="Edit task status"
                                        >
                                            <span className="block sm:inline mt-1 sm:mt-0">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${getStatusInfo(task.status).color} ${getStatusInfo(task.status).bgColor}`}>
                                                    {getStatusInfo(task.status).text}
                                                </span>
                                            </span>

                                            {openStatusDropdown === task.id && (
                                                <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-md shadow-lg border border-slate-200 py-1 min-w-[140px]"
                                                    onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors"
                                                        onClick={() => handleEditStatus(task.id, 1)}
                                                    >
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusInfo(1).color} ${getStatusInfo(1).bgColor}`}>
                                                            {getStatusInfo(1).text}
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors"
                                                        onClick={() => handleEditStatus(task.id, 2)}
                                                    >
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusInfo(2).color} ${getStatusInfo(2).bgColor}`}>
                                                            {getStatusInfo(2).text}
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors"
                                                        onClick={() => handleEditStatus(task.id, 3)}
                                                    >
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusInfo(3).color} ${getStatusInfo(3).bgColor}`}>
                                                            {getStatusInfo(3).text}
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </button>

                                        <button
                                            className="flex-shrink-0 rounded-md border border-transparent p-1.5 sm:p-2 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                            type="button"
                                            onClick={() => handleEdit(task.id)}
                                            aria-label="Edit task list"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="flex-shrink-0 rounded-md border border-transparent p-1.5 sm:p-2 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                            type="button"
                                            onClick={() => handleDelete(task.id)}
                                            aria-label="Delete task list"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}