interface LogoProps {
  className?: string;
}

/** Decorative brand mark — title beside it carries the accessible name. */
export function Logo({ className = "" }: LogoProps) {
  return (
    <svg
      className={`h-10 w-10 shrink-0 ${className}`.trim()}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" className="fill-indigo-600" />
      <path
        d="M11 24.5c0-1.1.9-2 2-2h3.2l2.1-5.2a1 1 0 0 1 1.86 0L22.3 22.5H26c1.1 0 2 .9 2 2v1.5c0 1.1-.9 2-2 2H13c-1.1 0-2-.9-2-2v-1.5Z"
        className="fill-white"
      />
      <path
        d="M14 20.5h2.5l2-5 2.5 10 2-6.5H27"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-indigo-600"
      />
      <circle cx="30" cy="11" r="3" className="fill-indigo-300" />
      <circle cx="30" cy="11" r="1.25" className="fill-indigo-600" />
    </svg>
  );
}
