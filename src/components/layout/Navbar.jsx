function Navbar() {
  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950 text-slate-100">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-slate-800" aria-hidden="true" />
          <span className="text-sm uppercase tracking-[0.3em] text-slate-400">SkillMesh</span>
        </div>
        <div className="h-8 w-40 rounded bg-slate-900" aria-hidden="true" />
      </div>
    </nav>
  );
}

export default Navbar;
