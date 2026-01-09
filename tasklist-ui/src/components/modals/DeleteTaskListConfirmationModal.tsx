import type { DeleteResponseDto } from '../../models/ResponseDtos/DeleteResponseDto';
import type { DeleteModalConfrimationProps } from "../../models/DeleteModalConfrimationProps";
import { useEffect } from 'react';
import { apiRequest } from '../../services/apiService';
import { tokenService } from '../../services/tokenServices';
import toast from 'react-hot-toast';


export default function DeleteTaskListConfirmationModal({ onClose, onSuccess: onSuccessRefreshLists, item }: DeleteModalConfrimationProps) {

    useEffect(() => {
    }, [onClose]);


    const handleDeletion = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Deleting task list with ID:", item.id);
        
        try {
            const result = await apiRequest<DeleteResponseDto>(`ToDoLists/${item.id}`, { 
                method: "DELETE", 
                token: tokenService.getAccessToken() || undefined
            });
            
            if (!result.success) {
                toast.error("Failed to delete task list: " + result.message);
                return;
            }
            
            toast.success("Task list deleted successfully!");
            await onSuccessRefreshLists();
            onClose();
        } catch (error) {
            console.error("Error deleting task list:", error);
            toast.error("An error occurred. Please try again.");
        }
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />
             <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-6 py-10 text-center shadow-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">Delete Task List</p>
                    <h1 className="mt-3 text-4xl font-bold text-slate-50">Please confirm want to delete: {item.title}</h1>
                    <button onClick={handleDeletion} className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Delete</button>
                    <p className="mt-3 text-slate-300">*Note: This cannot be un-done</p>
                </div>
            </div>
        </>
    )

}