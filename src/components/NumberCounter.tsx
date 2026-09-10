"use client";

import { useEffect, useRef, useState } from "react";

export function NumberCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setStarted(true);
                observer.disconnect();
            }
        }, { threshold: 0.4 });

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const frame = window.requestAnimationFrame(() => setDisplayValue(value));
            return () => window.cancelAnimationFrame(frame);
        }

        const start = performance.now();
        const duration = 1500;

        function update(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(value * eased));
            if (progress < 1) requestAnimationFrame(update);
        }

        const frame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frame);
    }, [started, value]);

    return <span ref={ref}>{displayValue}{suffix}</span>;
}
