function Footer() {
  return (
    <footer className="w-full border-t border-surface-container-high bg-surface">
      <div className="flex h-16 items-center justify-between px-8 lg:px-12">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-surface-container-high" aria-hidden="true">
            <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
          </div>
          <span className="text-sm font-semibold text-on-surface">SkillMesh</span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {["About", "Privacy", "Terms"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-text-secondary transition-colors hover:text-on-surface"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <span className="hidden text-xs text-text-secondary sm:block">
          © 2024 SkillMesh. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
