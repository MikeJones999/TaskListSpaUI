export interface StatusInfo {
    text: string;
    color: string;
    bgColor: string;
}

export const getStatusInfo = (status: number): StatusInfo => {
    switch (status) {
        case 1:
            return {
                text: 'Not Started',
                color: 'text-slate-700',
                bgColor: 'bg-slate-100'
            };
        case 2:
            return {
                text: 'In Progress',
                color: 'text-blue-700',
                bgColor: 'bg-blue-100'
            };
        case 3:
            return {
                text: 'Done',
                color: 'text-emerald-700',
                bgColor: 'bg-emerald-100'
            };
        default:
            return {
                text: 'Unknown',
                color: 'text-slate-700',
                bgColor: 'bg-slate-100'
            };
    }
};
