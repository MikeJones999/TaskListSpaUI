import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-teal-500 mb-4">404</h1>
        <p className="text-2xl font-semibold text-slate-700 mb-2">Page Not Found</p>
        <p className="text-slate-600 mb-8">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md transition-all shadow"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
