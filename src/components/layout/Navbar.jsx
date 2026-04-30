function Navbar() {
  return (
    <nav className="w-full border-b border-surface-container-high bg-surface text-on-surface">
      <div className="mx-auto flex h-12 max-w-[1280px] items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-surface-container-high" aria-hidden="true" />
          <span className="text-sm font-semibold text-accent-orange-rich">SkillMesh</span>
        </div>

        <div className="flex items-center gap-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-on-surface-variant">Log in</span>
          <span className="rounded-sm bg-accent-orange-rich px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">Get started</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
