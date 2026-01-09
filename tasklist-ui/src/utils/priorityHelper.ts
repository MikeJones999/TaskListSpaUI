export interface PriorityInfo {
    text: string;
    color: string;
    bgColor: string;
}

export const getPriorityInfo = (priority: number): PriorityInfo => {
    switch (priority) {
        case 1:
            return {
                text: 'Low',
                color: 'text-green-700',
                bgColor: 'bg-green-100'
            };
        case 2:
            return {
                text: 'Medium',
                color: 'text-yellow-700',
                bgColor: 'bg-yellow-100'
            };
        case 3:
            return {
                text: 'High',
                color: 'text-red-700',
                bgColor: 'bg-red-100'
            };
        default:
            return {
                text: 'Unknown',
                color: 'text-slate-700',
                bgColor: 'bg-slate-100'
            };
    }
};
