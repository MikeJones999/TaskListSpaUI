import { useState, useEffect } from "react";
import type { TaskList } from "../models/Tasklist";
import { apiRequest } from "../services/apiService";
import { tokenService } from "../services/tokenServices";
import toast from "react-hot-toast";

interface CreateTaskListModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface ResponseDto {
    responseData: TaskList;
    success: boolean;
    message: string;
}   

export default function CreateTaskListModal({ onClose, onSuccess: onSuccessRefreshLists }: CreateTaskListModalProps) {

    const [formData, setFormData] = useState<Partial<TaskList>>({
        title: "",
        description: "",
    });

    useEffect(() => {
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = tokenService.getAccessToken();
            console.log("Using token:", token);
            console.log("Form data to submit:", formData);
            
            const response = await apiRequest<ResponseDto>("ToDoLists", { 
                method: "POST", 
                token: token || undefined,
                body: {
                    title: formData.title,
                    description: formData.description
                }
            });

            if(!response.success){
                toast.error("Failed to create task list: " + response.message);
                return;
            }
            
            console.log("Response:", response);
            toast.success("Task list created successfully!");
            await onSuccessRefreshLists();
            onClose();
        } catch (error) {
            console.error("Error creating task list:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return(
        <>    
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
        />        

        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Create Task List</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                 <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-900"
                            placeholder="Enter task list title"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-slate-900"
                            placeholder="Enter task list description"
                        />
                    </div>

                   
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors font-medium shadow"
                        >
                            Create Task List
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )

}
