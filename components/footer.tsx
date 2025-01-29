import Link from "next/link";

const footerLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="relative">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/" className="text-xl font-bold">
              <span className="text-foreground">✨</span>{" "}
              <span className="cosmic-text-gradient">AstroHuff</span>
            </Link>
            <div className="flex gap-6">
              {footerLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AstroHuff
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
