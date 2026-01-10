import { useEffect, useState } from 'react';
import { apiRequest } from "../services/apiService";
import { tokenService } from "../services/tokenServices";
import CreateTaskListModal from '../components/modals/CreateTaskListModal';
import toast from "react-hot-toast"
import ToastWrapper from "../components/toastWrapper";
import type { TaskList } from "../models/Tasklist";
import type { DeleteResponseDto } from '../models/ResponseDtos/DeleteResponseDto';
import DeleteTaskListConfirmationModal from '../components/modals/DeleteTaskListConfirmationModal';
import EditTaskListModal from '../components/modals/EditTaskListModal';
import { useNavigate } from 'react-router-dom';
import EditIconButton from '../components/EditIconButton';
import type { ResponseDto } from '../models/ResponseDtos/ResponseDto';
import DeleteIconButton from '../components/DeleteIconButton';

export default function TaskLists() {

    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [selectedTaskList, setSelectedTaskList] = useState<TaskList | null>(null);

    const navigate = useNavigate();
    const getTaskLists = async () => {
        try {
            const token = tokenService.getAccessToken();
            const data = await apiRequest<ResponseDto<TaskList[]>>("ToDoLists", { method: "GET", token: token || undefined });
            if (data.success && data.responseData) {
                setTaskLists(data.responseData);
            }
        } catch (error) {
            console.error("Error fetching task lists:", error);
        }
    };

    useEffect(() => {
        getTaskLists();
    }, []);

    const handleDelete = async (id: number) => {
        const taskFound = taskLists.find(tl => tl.id === id);
        if (taskFound?.toDoItemCount && taskFound.toDoItemCount > 0) {
            setSelectedTaskList(taskFound);
            setShowDeleteModal(true);
        }
        else {
            try {
                const result = await apiRequest<DeleteResponseDto>(`ToDoLists/${id}`, {
                    method: "DELETE",
                    token: tokenService.getAccessToken() || undefined
                });
                if (!result.success) {
                    toast.error("Failed to delete task list: " + result.message);
                    return;
                }
                toast.success("Task list deleted successfully!");
                getTaskLists();
            }
            catch (error) {
                toast.error("An error occurred. Please try again.");
                return;
            }
        }
    }

    const handleEdit = async (id: number) => {
        const taskFound = taskLists.find(tl => tl.id === id);
        setSelectedTaskList(taskFound || null);
        setShowEditModal(true);
    }


    const handleNavigation = (id: number) => {
        navigate(`/Tasks/${id}`);
    }


    const handleCreateTaskModal = (): void => {
        setShowCreateModal(true);
    }

    return (
        <>
            <ToastWrapper />
            {showCreateModal && <CreateTaskListModal onClose={() => setShowCreateModal(false)} onSuccess={getTaskLists} />}
            {showDeleteModal && selectedTaskList && <DeleteTaskListConfirmationModal item={selectedTaskList} onClose={() => setShowDeleteModal(false)} onSuccess={getTaskLists} />}
            {showEditModal && selectedTaskList && <EditTaskListModal item={selectedTaskList} onClose={() => setShowEditModal(false)} onSuccess={getTaskLists} />}

            <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 mb-4 px-4">
                <p className="text-base sm:text-lg md:text-xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-teal-300 text-center">Task Lists</p>
            </div>
            <div className="flex justify-center items-start min-h-screen px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-3xl">
                    <button
                        onClick={handleCreateTaskModal}
                        className="mb-4 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md shadow transition-all uppercase tracking-wide text-xs sm:text-sm">
                        Create Task List
                    </button>
                    {taskLists.length > 0 && taskLists.map(taskList => (
                        <div key={taskList.id} className="relative flex flex-col rounded-lg bg-white shadow-sm border border-slate-200 w-full mb-3">
                            <nav className="flex w-full flex-col gap-1 p-2 sm:p-3">

                                <div
                                    className="text-slate-800 flex w-full items-center rounded-md p-2 sm:p-3 gap-2"
                                >
                                    <span className="flex-1 break-words text-sm sm:text-base">
                                        <span className="flex items-center justify-between gap-2">
                                            <span className="text-base sm:text-lg md:text-xl font-bold">{taskList.title}</span>
                                        </span>
                                        <span className="block mt-1 text-sm text-slate-600">{taskList.description}</span>
                                    </span>

                                    <div className="flex-shrink-0 flex items-center gap-2">
                                        <span className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">Tasks - </span>
                                        <span className="shrink-0 rounded-full bg-indigo-600 px-3 font-mono text-md font-medium tracking-tight text-white">
                                            {taskList.toDoItemCount}
                                        </span>
                                        <button
                                            onClick={() => handleNavigation(taskList.id)}
                                            className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm rounded-md transition-all shadow flex items-center gap-1"
                                        >
                                            View Tasks
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 1 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <EditIconButton id={taskList.id} label="Edit task list" onClick={handleEdit} />
                                        <DeleteIconButton id={taskList.id} label="Delete task list" onClick={handleDelete} />
                                    </div>
                                </div>
                            </nav>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
