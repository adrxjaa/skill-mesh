function Navbar() {
  return (
    <nav className="w-full border-b border-surface-container-high bg-surface text-on-surface">
      <div className="flex h-14 items-center justify-between px-8 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-surface-container-high" aria-hidden="true">
            <div className="h-3 w-3 rounded-sm bg-primary" />
          </div>
          <span className="text-base font-semibold text-primary">SkillMesh</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-on-surface-variant">Log in</span>
          <span className="rounded bg-primary px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)]">
            Get started
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
