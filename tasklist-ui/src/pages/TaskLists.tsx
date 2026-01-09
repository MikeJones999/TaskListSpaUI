import { useEffect, useState } from 'react';
import { apiRequest } from "../services/apiService";
import { tokenService } from "../services/tokenServices";
import CreateTaskListModal from '../components/CreateTaskListModal';
import toast from "react-hot-toast"
import ToastWrapper from "../components/toastWrapper";
import type { TaskList } from "../models/Tasklist";


interface ResponseDto {
    responseData: TaskList[];
    success: boolean;
    message: string;
}   

export default function TaskLists() {

    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);

    const getTaskLists = async () => {
        try {
            const token = tokenService.getAccessToken();
            console.log("Using token:", token);
            const data = await apiRequest<ResponseDto>("ToDoLists", { method: "GET", token: token || undefined });
            console.log("returned data", data);
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
        if(taskFound?.toDoItemCount && taskFound.toDoItemCount > 0){
            toast.error("Remove all child tasks before deleting.");
            console.log("Cannot delete task list with existing tasks.");
            //open a modal here probably and confirm deletion and let api delete all 
            return;
        }
        else{

            try{
                
                toast.success("Task list deleted successfully!");

            }
            catch(error){
                console.error("Error deleting task list:", error);
                toast.error("An error occurred. Please try again.");
                return;
            }
          
        }

        console.log("Delete task list with ID:", id);
    }

    const handleNaviogation = (id: number) => {
        console.log("Navigate to task list with ID:", id);
    }


    const handleCreateTaskModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault();
        setShowModal(true);
    }

    return ( 
        <>
        <ToastWrapper />
        {showModal && <CreateTaskListModal onClose={() => setShowModal(false)} onSuccess={getTaskLists} />}
        <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 mb-4 px-4">
            <p className="text-base sm:text-lg md:text-xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-teal-300 text-center">Task Lists</p>
        </div>
        <div className="flex justify-center items-start min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl">
                <button 
                    onClick={handleCreateTaskModal}
                    className="mb-4 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md shadow transition-all uppercase tracking-wide text-xs sm:text-sm">
                    Create Task List
                </button>
                <div className="relative flex flex-col rounded-lg bg-white shadow-sm border border-slate-200 w-full">
            <nav className="flex w-full flex-col gap-1 p-2 sm:p-3">
                {taskLists.length > 0 && taskLists.map(taskList => (
                    <div
                        key={taskList.id}
                        role="button"
                        className="text-slate-800 flex w-full items-center rounded-md p-2 sm:p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 gap-2"
                    >
                        <span className="flex-1 break-words text-sm sm:text-base cursor-pointer" onClick={() => handleNaviogation(taskList.id)}>
                            <span className="text-base sm:text-lg md:text-xl font-bold block sm:inline">{taskList.title}</span>
                            <span className="hidden sm:inline">: </span>
                            <span className="block sm:inline mt-1 sm:mt-0">{taskList.description}</span>
                            <span className="hidden sm:inline"> : </span>
                            <span className="block sm:inline text-xs sm:text-sm text-slate-600 mt-1 sm:mt-0">Tasks - {taskList.toDoItemCount}</span>
                        </span>
                        <button
                            className="flex-shrink-0 rounded-md border border-transparent p-1.5 sm:p-2 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            onClick={() => handleDelete(taskList.id)}
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
        </>
    )
}
