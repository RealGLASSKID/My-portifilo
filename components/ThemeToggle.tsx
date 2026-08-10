"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function apply(theme: "dark" | "light") {
    const el = document.documentElement;
    el.classList.toggle("dark", theme === "dark");
    el.classList.toggle("light", theme === "light");
    try {
        localStorage.setItem("glasskid-theme", theme);
    } catch {
        /* ignore */
    }
}

export function ThemeToggle({ className = "" }: { className?: string }) {
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    useEffect(() => {
        const stored = (typeof localStorage !== "undefined" && localStorage.getItem("glasskid-theme")) as
            | "dark"
            | "light"
            | null;
        if (stored) setTheme(stored);
    }, []);

    const toggle = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        apply(next);
    };

    return (
        <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className={`btn-ghost-glass inline-flex size-10 items-center justify-center rounded-xl ${className}`}
        >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
    );
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem('glasskid-theme')||'dark';var e=document.documentElement;e.classList.toggle('dark',t==='dark');e.classList.toggle('light',t==='light');}catch(_){}})();`;