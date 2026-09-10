"use client";

import { useState } from "react";

type AmenitiesSelectorProps = {
    options: string[];
    selected: string[];
};

export function AmenitiesSelector({ options, selected }: AmenitiesSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [values, setValues] = useState(selected);

    function toggleAmenity(amenity: string) {
        setValues((current) => current.includes(amenity)
            ? current.filter((item) => item !== amenity)
            : [...current, amenity]);
    }

    return (
        <div style={{ position: "relative" }}>
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                aria-expanded={isOpen}
                style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 12, border: "1px solid #ddd", background: "#fff", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: "1rem" }}
            >
                <span>{values.length ? `${values.length} selected` : "Select amenities"}</span>
                <span aria-hidden="true">{isOpen ? "\u25b2" : "\u25bc"}</span>
            </button>

            {isOpen ? (
                <div style={{ position: "absolute", zIndex: 10, top: "calc(100% + 0.4rem)", left: 0, right: 0, maxHeight: 280, overflowY: "auto", padding: "0.55rem", borderRadius: 14, border: "1px solid #ddd", background: "#fff", boxShadow: "0 18px 40px rgba(17,17,17,0.14)" }}>
                    {options.map((amenity) => {
                        const checked = values.includes(amenity);
                        return (
                            <label key={amenity} style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.65rem 0.55rem", borderRadius: 9, cursor: "pointer", background: checked ? "#f5efe3" : "transparent" }}>
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleAmenity(amenity)}
                                />
                                <span>{amenity}</span>
                                <input type="hidden" name="amenities" value={checked ? amenity : ""} />
                            </label>
                        );
                    })}
                </div>
            ) : (
                values.map((amenity) => <input key={amenity} type="hidden" name="amenities" value={amenity} />)
            )}

            {values.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.6rem" }}>
                    {values.map((amenity) => (
                        <span key={amenity} style={{ padding: "0.3rem 0.55rem", borderRadius: 999, background: "#f3ead7", color: "#6e5a35", fontSize: 12, fontWeight: 700 }}>{amenity}</span>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
