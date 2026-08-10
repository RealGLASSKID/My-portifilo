import Link from "next/link";
import { Github, Linkedin, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-1 text-2xl font-bold">
              GLASSKID<span className="text-primary">.</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Full stack developer, artist &amp; songwriter building digital solutions and creating music that inspires.
            </p>
            <div className="mt-5 flex gap-2">
              {[Github, Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="btn-ghost-glass grid size-9 place-items-center rounded-full">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Navigation"
            links={[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/projects", label: "Projects" },
              { to: "/services", label: "Services" },
              { to: "/products", label: "Products" },
            ]}
          />
          <FooterCol
            title="Explore"
            links={[
              { to: "/music", label: "Music" },
              { to: "/blog", label: "Blog" },
              { to: "/testify", label: "Testify" },
              { to: "/links", label: "All Links" },
              { to: "/terms", label: "Terms & Conditions" },
              { to: "/contact", label: "Contact" },
            ]}
          />

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Let&apos;s Connect</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary" /> hello@glasskid.dev
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary" /> +234 813 123 4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} GLASSKID. All rights reserved.</p>
          <p>
            Built with <span className="text-primary">♥</span> by GLASSKID.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to}>
            <Link href={l.to} className="transition hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}