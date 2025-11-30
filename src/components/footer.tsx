const socialIcons = [
  {
    label: "Instagram",
    path: (
      <path d="M21 16V8a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5ZM8 3h8" />
    ),
  },
  {
    label: "Facebook",
    path: (
      <>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />
      </>
    ),
  },
  {
    label: "Telegram",
    path: (
      <>
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22l-4-9-9-4Z" />
      </>
    ),
  },
  {
    label: "X",
    path: (
      <>
        <path d="M4 4h16" />
        <path d="M4 20 20 4" />
        <path d="M4 4l16 16" />
        <path d="M4 20h16" />
      </>
    ),
  },
];

const footerLinks = [
  {
    title: "More Info",
    links: [
      "Term & Policy",
      "Shipping Policy",
      "Return Policy",
      "Term & Conditions",
      "FAQ",
      "How To Order",
      "Loyalty Program",
    ],
  },
  {
    title: "Contact Us",
    links: ["cs@avanora.com", "Business Opportunity", "AVANORA Store", "Careers"],
  },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg-primary)] text-[var(--color-text-dark)]">
      <div className="mx-auto grid max-w-[1368px] gap-12 px-6 py-16 lg:grid-cols-[1.2fr_repeat(2,1fr)_1.4fr]">
        <div>
          <div className="text-3xl font-semibold tracking-wide text-[var(--color-primary)]">
            Avanora
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Consumer Complaints Service, Directorate General of Consumer Protection
            and Trade Order, Ministry of Trade of the Republic of Indonesia.
          </p>
          <p className="mt-6 text-base font-semibold text-[var(--color-primary)]">
            +12 345 678 910 <span className="font-normal text-zinc-500">(WhatsApp)</span>
          </p>
        </div>

        {footerLinks.map((group) => (
          <div key={group.title}>
            <p className="text-lg font-semibold text-[var(--color-text-dark)]">{group.title}</p>
            <ul className="mt-4 space-y-2 text-base text-[var(--color-primary)]">
              {group.links.map((link) => (
                <li key={link} className="transition hover:text-[var(--color-primary-dark)]">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="text-lg font-semibold text-[var(--color-text-dark)]">Follow Us</p>
          <div className="mt-4 flex items-center gap-4">
            {socialIcons.map((icon) => (
              <span
                key={icon.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-primary-lighter)] text-[var(--color-primary)]"
                aria-label={icon.label}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {icon.path}
                </svg>
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-600">
            Learn more about Avanora culture at{" "}
            <span className="font-semibold text-[var(--color-primary)]">avanora.com</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 bg-[var(--color-primary-dark)] px-6 py-6 text-sm text-white md:flex-row md:items-center md:justify-between">
        <p>Copyright © 2025 AVANORA BEAUTY. All rights reserved</p>
        <p className="text-white/60">Brought to you by Dezainahub</p>
      </div>
    </footer>
  );
}
