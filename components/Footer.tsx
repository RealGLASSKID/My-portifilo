"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

const SOCIALS = [
  {
    name: "GitHub",
    href: "https://github.com/RealGLASSKID",
    Icon: Github,
  },
  {
    name: "Facebook",
    href: "https://web.facebook.com/profile.php?id=61590417605342",
    Icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/Real_GLASSKID/",
    Icon: Instagram,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/2349136893921",
    Icon: null as null,
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

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
              {SOCIALS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="btn-ghost-glass grid size-9 place-items-center rounded-full"
                >
                  {Icon ? (
                    <Icon className="size-4" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  )}
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
              { to: "/gallery", label: "Gallery" },
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
                <Mail className="size-4 text-primary" /> glasskid01@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary" /> +234 913 689 3921
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