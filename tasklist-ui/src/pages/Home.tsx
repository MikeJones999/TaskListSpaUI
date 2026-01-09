function Home() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-6 py-10 text-center shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">Task Manager</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-50">Welcome to the Task Manager!</h1>
        <p className="mt-3 text-slate-300">A simple task based application to manage your tasks efficiently.</p>
      </div>
    </main>
  )
}

export default Home
