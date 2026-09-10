"use client";

import Image from "next/image";
import { useRef } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

type CarouselImage = {
    id: string;
    url: string;
    altText?: string | null;
};

type CarouselFloorPlan = CarouselImage;

function isValidImageSource(value: string) {
    return /^https?:\/\//i.test(value) || value.startsWith("/") || value.startsWith("data:image/");
}

function CarouselControls({ onPrevious, onNext }: { onPrevious: () => void; onNext: () => void }) {
    return (
        <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" onClick={onPrevious} aria-label="Scroll left" style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid #d9cdbd", background: "#fff", cursor: "pointer", fontSize: 20 }}>←</button>
            <button type="button" onClick={onNext} aria-label="Scroll right" style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid #d9cdbd", background: "#111", color: "#fff", cursor: "pointer", fontSize: 20 }}>→</button>
        </div>
    );
}

export function ImageCarousel({ title, images }: { title: string; images: CarouselImage[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: number) => trackRef.current?.scrollBy({ left: direction * Math.max(trackRef.current.clientWidth * 0.78, 280), behavior: "smooth" });

    return (
        <ScrollReveal><section className="media-section">
            <div className="media-section-heading">
                <div>
                    <p className="eyebrow">Explore the visual story</p>
                    <h2>{title}</h2>
                </div>
                <CarouselControls onPrevious={() => scroll(-1)} onNext={() => scroll(1)} />
            </div>
            <div ref={trackRef} className="media-carousel-track">
                {images.map((image) => (
                    <article key={image.id} className="media-carousel-card">
                        <div className="media-carousel-image">
                            {isValidImageSource(image.url) ? <Image src={image.url} alt={image.altText ?? title} fill sizes="(max-width: 760px) 82vw, 360px" style={{ objectFit: "cover" }} /> : null}
                        </div>
                    </article>
                ))}
            </div>
        </section></ScrollReveal>
    );
}

export function FloorPlanCarousel({ plans }: { plans: CarouselFloorPlan[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: number) => trackRef.current?.scrollBy({ left: direction * Math.max(trackRef.current.clientWidth * 0.78, 280), behavior: "smooth" });

    return (
        <ScrollReveal><section className="media-section">
            <div className="media-section-heading">
                <div>
                    <p className="eyebrow">Designed around your lifestyle</p>
                    <h2>Floor plans</h2>
                </div>
                <CarouselControls onPrevious={() => scroll(-1)} onNext={() => scroll(1)} />
            </div>
            <div ref={trackRef} className="media-carousel-track">
                {plans.map((plan) => (
                    <article key={plan.id} className="floorplan-carousel-card">
                        {isValidImageSource(plan.url) ? (
                            <div className="floorplan-carousel-image">
                                <Image src={plan.url} alt="Floor plan" fill sizes="(max-width: 760px) 82vw, 360px" style={{ objectFit: "cover" }} />
                            </div>
                        ) : null}
                    </article>
                ))}
            </div>
        </section></ScrollReveal>
    );
}
