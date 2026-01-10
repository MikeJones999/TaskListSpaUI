export interface DashboardData {
  taskListCount: number;
  totalTasksCount: number;
  
  tasksInProgressCount: number;
  tasksDoneCount: number;
  tasksNotStartedCount: number;

  tasksPriorityLow: number;
  tasksPriorityMedium: number;
  tasksPriorityHigh: number;
}

export interface DashboardResponseDto {
  responseData: DashboardData;
  success: boolean;
  message: string;
}