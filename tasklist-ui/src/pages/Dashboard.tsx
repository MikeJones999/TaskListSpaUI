import { useEffect, useState } from "react";
import { tokenService } from "../services/tokenServices";
import { apiRequest } from "../services/apiService";
import type { DashboardData, DashboardResponseDto } from "../models/ResponseDtos/DashboardResponseDto";
import { getPriorityInfo } from "../utils/priorityHelper";
import { getStatusInfo } from "../utils/statusHelper";
import { useUserProfile } from "../hooks/useUserProfile";

export default function Dashboard() {

  const [data, setData] = useState<DashboardData>({
    taskListCount: 0,
    totalTasksCount: 0,
    tasksInProgressCount: 0,
    tasksDoneCount: 0,
    tasksNotStartedCount: 0,
    tasksPriorityLow: 0,
    tasksPriorityMedium: 0,
    tasksPriorityHigh: 0,
  });

  const token = tokenService.getAccessToken();
  const { userData, profileImageUrl } = useUserProfile(token);

  const dashboardData = async () => {
    try {
      const res = await apiRequest<DashboardResponseDto>("Dashboard", { method: "GET", token: token || undefined });
      if (res.success && res.responseData) {
        setData(res.responseData);
      }
    } catch (error) {
      console.error("Failed to load dashboard", error);
    }
  };

  useEffect(() => {
    dashboardData();
  }, []);

  return (
    <>
      <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 mb-4 px-4">
        <p className="text-base sm:text-lg md:text-xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-teal-300 text-center">Dashboard</p>
      </div>

      <div className="flex justify-center mb-6">
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="h-40 w-40 rounded-full object-cover border-4 border-teal-300 shadow-lg"
          />
        )}
      </div>
      <div className="text-center mb-8">
        <p className="text-base sm:text-lg text-slate-400">{userData?.displayName}</p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 space-y-8">

        <div>
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-teal-800 mb-3">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <StatCard title="Task Lists" value={data.taskListCount} />
            <StatCard title="Total Tasks" value={data.totalTasksCount} />
          </div>
        </div>


        <div>
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-teal-800 mb-3">By Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <StatCard
              title="Not Started"
              value={data.tasksNotStartedCount}
              bgClass={getStatusInfo(1).bgColor}
              valueTextClass={getStatusInfo(1).color}
            />
            <StatCard
              title="In Progress"
              value={data.tasksInProgressCount}
              bgClass={getStatusInfo(2).bgColor}
              valueTextClass={getStatusInfo(2).color}
            />
            <StatCard
              title="Done"
              value={data.tasksDoneCount}
              bgClass={getStatusInfo(3).bgColor}
              valueTextClass={getStatusInfo(3).color}
            />
          </div>
        </div>


        <div>
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-teal-800 mb-3">By Priority</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <StatCard
              title="Priority Low"
              value={data.tasksPriorityLow}
              bgClass={getPriorityInfo(1).bgColor}
              valueTextClass={getPriorityInfo(1).color}
            />
            <StatCard
              title="Priority Medium"
              value={data.tasksPriorityMedium}
              bgClass={getPriorityInfo(2).bgColor}
              valueTextClass={getPriorityInfo(2).color}
            />
            <StatCard
              title="Priority High"
              value={data.tasksPriorityHigh}
              bgClass={getPriorityInfo(3).bgColor}
              valueTextClass={getPriorityInfo(3).color}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({
  title,
  value,
  bgClass = "bg-white",
  valueTextClass = "text-slate-800",
}: {
  title: string;
  value: number;
  bgClass?: string;
  valueTextClass?: string;
}) {
  return (
    <div className={`rounded-md border border-slate-200 ${bgClass} py-5 px-3 shadow-sm text-center`}>
      <div className="text-sm uppercase tracking-wide text-slate-700 font-semibold">{title}</div>
      <div className={`mt-3 text-2xl font-semibold ${valueTextClass}`}>{value}</div>
    </div>
  );
}
