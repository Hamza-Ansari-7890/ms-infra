"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type ScrollNavProps = {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export function ScrollNav({ children, className = "", style }: ScrollNavProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [navHeight, setNavHeight] = useState(0);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const updateScrollState = () => setIsScrolled(window.scrollY > 24);
        const updateNavHeight = () => setNavHeight(navRef.current?.getBoundingClientRect().height ?? 0);
        updateScrollState();
        updateNavHeight();
        window.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateNavHeight);
        return () => {
            window.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateNavHeight);
        };
    }, []);

    return (
        <div className="scroll-nav-shell" style={{ minHeight: navHeight || undefined }}>
            <nav ref={navRef} className={`${className} ${isScrolled ? "is-scrolled" : "is-top"}`} style={style}>
                {children}
            </nav>
        </div>
    );
}
