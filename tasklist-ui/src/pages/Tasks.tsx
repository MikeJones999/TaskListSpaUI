import { useParams, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"
import ToastWrapper from "../components/toastWrapper";
import { useEffect, useState } from 'react';
import type { Task } from "../models/Task";
import { tokenService } from '../services/tokenServices';
import { apiRequest } from "../services/apiService";
import type { DeleteResponseDto } from '../models/ResponseDtos/DeleteResponseDto';
import { getStatusInfo } from '../utils/statusHelper';
import PriorityDropdown from '../components/PriorityDropdown';
import EditIconButton from '../components/EditIconButton';
import DeleteIconButton from '../components/DeleteIconButton';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import EditTaskModal from '../components/modals/EditTaskModal';
import type { TaskRelatedResponseDto } from '../models/ResponseDtos/TaskRelatedResponseDto';
import type { ResponseDto } from '../models/ResponseDtos/ResponseDto';
import type { PaginatedToDoListResponse } from '../models/ResponseDtos/PaginatedTaskListResponse';

export default function Tasks() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [taskList, setTaskList] = useState<PaginatedToDoListResponse | null>(null);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [openStatusDropdown, setOpenStatusDropdown] = useState<number | null>(null);
    const [expandedTaskIds, setExpandedTaskIds] = useState<Set<number>>(new Set());
    const [currentSort, setCurrentSort] = useState<string>("");
    const [currentSortDirection, setCurrentSortDirection] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPageCount, setTotalPageCount] = useState<number>(1);

    const getTaskList = async (sortBy: string = "", sortDirection: boolean = true, pageNumber: number = 1) => {
        try {
            const token = tokenService.getAccessToken();
            const params = new URLSearchParams();

            if (sortBy) {
                params.append("sortBy", sortBy);
                params.append("ascending", sortDirection.toString());
                console.log("Sorting by:", sortBy, "ascending:", sortDirection);
            }
            params.append("pageNumber", pageNumber.toString());

            const queryString = params.toString() ? `?${params.toString()}` : "";
            const data = await apiRequest<ResponseDto<PaginatedToDoListResponse>>(`ToDoLists/${id}/paginated${queryString}`, { method: "GET", token: token || undefined });

            if (data.success && data.responseData) {
                setTaskList(data.responseData);
                setTotalPageCount(data.responseData.totalPages);
            }
        } catch (error) {
            console.error("Error fetching task list:", error);
            navigate('/TaskLists');
        }
    };

    useEffect(() => {
        getTaskList(currentSort, currentSortDirection, currentPage);
    }, [currentSort, currentSortDirection, currentPage]);

    const handleDelete = async (id: number) => {
        try {
            const result = await apiRequest<DeleteResponseDto>(`ToDoItems/${id}`, {
                method: "DELETE",
                token: tokenService.getAccessToken() || undefined
            });
            if (!result.success) {
                toast.error("Failed to delete task: " + result.message);
                return;
            }
            toast.success("Task deleted successfully!");
            getTaskList(currentSort, currentSortDirection, currentPage);
        }
        catch (error) {
            toast.error("An error occurred. Please try again.");
            return;
        }
    }

    const handleEdit = async (id: number) => {
        const taskFound = taskList?.tasks.find(tl => tl.id === id);
        setSelectedTask(taskFound || null);
        setShowEditModal(true);
    }

    const handleCreateTaskModal = (): void => {
        setShowCreateModal(true);
    }

    const handleEditStatusPriority = async (taskId: number, newStatus: number, isPriority: boolean): Promise<void> => {
        const target = isPriority ? "priority" : "status";
        try {
            if (isPriority) {
                if (taskList?.tasks.find(x => x.id === taskId)?.priority === newStatus) {
                    setOpenStatusDropdown(null);
                    return;
                }
            } else {
                if (taskList?.tasks.find(x => x.id === taskId)?.status === newStatus) {
                    setOpenStatusDropdown(null);
                    return;
                }
            }

            const token = tokenService.getAccessToken();
            const result = await apiRequest<TaskRelatedResponseDto>(`ToDoItems/${taskId}/${target}`, {
                method: "PATCH",
                token: token || undefined,
                body: { [target]: newStatus, id: taskId }
            });

            if (!result.success) {
                toast.error("Failed to update task " + target + ": " + result.message);
                return;
            }

            toast.success("Task " + target + " updated successfully!");
            setOpenStatusDropdown(null);
            getTaskList(currentSort, currentSortDirection, currentPage);
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    }

    const toggleStatusDropdown = (taskId: number) => {
        setOpenStatusDropdown(openStatusDropdown === taskId ? null : taskId);
    }

    const handleTitleClickAccordion = (taskId: number) => {
        setExpandedTaskIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    }

    const handleSortClick = (sortField: string) => {
        if (currentSort === sortField) {
            setCurrentSortDirection(!currentSortDirection);
        } else {
            setCurrentSort(sortField);
            setCurrentSortDirection(true);
        }
    };

    const handleClearSort = () => {
        setCurrentSort("");
        setCurrentSortDirection(true);
    };

    return (
        <>
            <div>
                <ToastWrapper />
                {showCreateModal && taskList && <CreateTaskModal onClose={() => setShowCreateModal(false)} onSuccess={() => getTaskList(currentSort, currentSortDirection, currentPage)} item={taskList} />}
                {showEditModal && selectedTask && <EditTaskModal item={selectedTask} listId={taskList?.id ?? 0} onClose={() => setShowEditModal(false)} onSuccess={() => getTaskList(currentSort, currentSortDirection, currentPage)} />}
                <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 mb-4 px-4">
                    <p className="text-base sm:text-lg md:text-xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-teal-300 text-center">Task List: {taskList?.title}</p>
                </div>
                <div className="flex justify-center items-start min-h-screen px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <button
                                onClick={() => navigate('/TaskLists')}
                                className="p-2 text-slate-400 hover:bg-slate-200 rounded-md transition-all flex-shrink-0"
                                aria-label="Back to task lists"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
                                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 11.25h11.19a.75.75 0 0 1 0 1.5H9.31l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button
                                onClick={handleCreateTaskModal}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md shadow transition-all uppercase tracking-wide text-xs sm:text-sm">
                                Create Task
                            </button>
                            <div className="flex-1"></div>
                            <span className="text-sm text-slate-600 font-medium">Sort by:</span>
                            <button
                                onClick={() => handleSortClick("status")}
                                className={`font-semibold text-sm transition-all cursor-pointer flex items-center gap-1 ${
                                    currentSort === "status" 
                                        ? "text-teal-500 border-b-2 border-teal-500" 
                                        : "text-slate-600 hover:text-teal-500"
                                }`}
                            >
                                Status
                                {currentSort === "status" && (
                                    <span className="text-xs">
                                        {currentSortDirection ? "↑" : "↓"}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => handleSortClick("priority")}
                                className={`font-semibold text-sm transition-all cursor-pointer flex items-center gap-1 ${
                                    currentSort === "priority" 
                                        ? "text-teal-500 border-b-2 border-teal-500" 
                                        : "text-slate-600 hover:text-teal-500"
                                }`}
                            >
                                Priority
                                {currentSort === "priority" && (
                                    <span className="text-xs">
                                        {currentSortDirection ? "↑" : "↓"}
                                    </span>
                                )}
                            </button>
                            {currentSort && (
                              <button
                                onClick={handleClearSort}
                                className="text-slate-400 hover:text-red-500 font-semibold text-sm transition-all cursor-pointer ml-1"
                                title="Clear sort"
                            >
                                ✕
                            </button>
                            )}
                        </div>
                        {taskList?.tasks && taskList.tasks.length > 0 && taskList.tasks.map(task => (
                            <div key={task.id} className="relative flex flex-col rounded-lg bg-white shadow-sm border border-slate-200 w-full mb-3">

                                <nav className="flex w-full flex-col gap-1 p-2 sm:p-3">
                                    <div
                                        role="button"
                                        className="text-slate-800 flex w-full flex-col sm:flex-row sm:items-center rounded-md p-2 sm:p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 gap-2"
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <PriorityDropdown
                                                priority={task.priority}
                                                onChange={(value) => handleEditStatusPriority(task.id, value, true)}
                                            />

                                            <span className="flex-1 break-words text-sm sm:text-base cursor-pointer min-w-0" onClick={() => handleTitleClickAccordion(task.id)}>
                                                <span className="text-base sm:text-lg md:text-xl font-bold">{task.title}</span>
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 sm:gap-2 justify-end flex-shrink-0">

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
                                                    <div
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                                                        onClick={() => handleEditStatusPriority(task.id, 1, false)}
                                                        role="button"
                                                        tabIndex={0}
                                                    >
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusInfo(1).color} ${getStatusInfo(1).bgColor}`}>
                                                            {getStatusInfo(1).text}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                                                        onClick={() => handleEditStatusPriority(task.id, 2, false)}
                                                        role="button"
                                                        tabIndex={0}
                                                    >
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusInfo(2).color} ${getStatusInfo(2).bgColor}`}>
                                                            {getStatusInfo(2).text}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                                                        onClick={() => handleEditStatusPriority(task.id, 3, false)}
                                                        role="button"
                                                        tabIndex={0}
                                                    >
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusInfo(3).color} ${getStatusInfo(3).bgColor}`}>
                                                            {getStatusInfo(3).text}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                        <EditIconButton id={task.id} label="Edit task" onClick={handleEdit} />
                                        <DeleteIconButton id={task.id} label="Delete task" onClick={handleDelete} />
                                        <button
                                            className="flex-shrink-0 rounded-md border border-transparent p-1.5 sm:p-2 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                            type="button"
                                            onClick={() => handleTitleClickAccordion(task.id)}
                                            aria-label="Expand task description"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 transition-transform duration-300 ${expandedTaskIds.has(task.id) ? 'rotate-180' : ''}`}>
                                                <path fillRule="evenodd" d="M12.53 16.97a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06L12 14.94l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        </div>
                                    </div>
                                </nav>

                                {expandedTaskIds.has(task.id) && (
                                    <div className="px-2 sm:px-3 py-3 border-t border-slate-200 bg-slate-50">
                                        <div className="mb-2">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">Description:</h3>
                                            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap break-words">{task.description || "No description provided"}</p>
                                        </div>
                                        {task.status == 3 && <div className="mb-2">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">Completed Date:</h3>
                                            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap break-words">{task.completedOnDate ? new Date(task.completedOnDate).toLocaleDateString() : "No Date provided"}</p>
                                        </div>}
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>

                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-slate-200 rounded-md shadow-lg px-4 py-2 flex items-center gap-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}   
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-teal-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600 transition-all"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-700">Page {currentPage} of {totalPageCount}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPageCount))}   
                            disabled={currentPage === totalPageCount}
                            className="px-3 py-1 bg-teal-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}