"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1100&q=85",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=85",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1100&q=85",
];

export function HeroImageSlider() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % images.length);
        }, 5200);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <div className="hero-slider" aria-label="Featured MS Infra residences">
            {images.map((src, index) => (
                <Image
                    key={src}
                    src={src}
                    alt="MS Infra premium residence"
                    fill
                    priority={index === 0}
                    sizes="(max-width: 760px) 100vw, 40vw"
                    className={`hero-slider-image ${index === activeIndex ? "is-active" : ""}`}
                />
            ))}
            <div className="hero-slider-dots" aria-hidden="true">
                {images.map((src, index) => <span key={src} className={index === activeIndex ? "is-active" : ""} />)}
            </div>
        </div>
    );
}
