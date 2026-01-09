import { useState } from "react";
import { getPriorityInfo } from "../utils/priorityHelper";

export interface PriorityDropdownProps {
    priority: number;
    onChange: (priority: number) => void;
    buttonClassName?: string;
    dropdownAlign?: "left" | "right";
}

export default function PriorityDropdown({
    priority,
    onChange,
    buttonClassName = "",
    dropdownAlign = "left",
}: PriorityDropdownProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (value: number) => {
        onChange(value);
        setOpen(false);
    };

    const alignmentClass = dropdownAlign === "right" ? "right-0" : "left-0";

    return (
        <div className="relative inline-block">
            <button
                className={`flex-shrink-0 rounded-md border border-transparent p-1.5 sm:p-2 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none relative ${buttonClassName}`}
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
                aria-label="Edit task priority"
            >
                <span className="block sm:inline mt-1 sm:mt-0">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${getPriorityInfo(priority).color} ${getPriorityInfo(priority).bgColor}`}>
                        {getPriorityInfo(priority).text}
                    </span>
                </span>
            </button>

            {open && (
                <div
                    className={`absolute ${alignmentClass} top-full mt-1 z-50 bg-white rounded-md shadow-lg border border-slate-200 py-1 min-w-[120px]`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {[1, 2, 3].map((value) => (
                        <div
                            key={value}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                            onClick={() => handleSelect(value)}
                            role="button"
                            tabIndex={0}
                        >
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPriorityInfo(value).color} ${getPriorityInfo(value).bgColor}`}>
                                {getPriorityInfo(value).text}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

