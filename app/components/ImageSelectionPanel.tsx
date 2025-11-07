"use client";

import { useState } from "react";
import Image from "next/image";

export interface ImageSelectionPanelProps {
    images: string[];

}

export default function ImageSelectionPanel({ images }: ImageSelectionPanelProps) {
    const [selected, setSelected] = useState("");

    const handleSelection = (imgSource: string) => {
        setSelected(imgSource);
        console.log("Selected image:", imgSource);
    };
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center text-white">
                Select an Image
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images && images.length > 0 && images.map((src, index) => (
                    <div
                        key={index}
                        onClick={() => setSelected(src)}
                        className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all duration-200 
              ${selected === src ? "border-blue-500 scale-105" : "border-transparent hover:scale-105"}`}
                    >
                        <Image
                            src={src}
                            alt={`Option ${index + 1}`}
                            width={300}
                            height={200}
                            className="object-cover w-full h-40"
                            onClick={() => handleSelection(src)}
                        />

                        {/* Overlay if selected */}
                        {selected === src && (
                            <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center text-white font-semibold">
                                Selected
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
