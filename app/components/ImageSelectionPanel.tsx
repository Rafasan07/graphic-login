"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ProgressBar from "./ProgressBar";

export interface ImageSelectionPanelProps {
    selectedImage: string;
    setShowModal: (show: boolean) => void;
    setSelectedImage: (imageUrl: string) => void;
    clearSelection: () => void;
}

export default function ImageSelectionPanel({
    selectedImage,
    setShowModal,
    setSelectedImage,
    clearSelection,
}: ImageSelectionPanelProps) {
    const [stockImages, setStockImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    const handleImageSelection = (imgSource: string) => {
        clearSelection();
        setSelectedImage(imgSource);
        setShowModal(true);
    };

    useEffect(() => {
        const fetchStockImages = async () => {
            try {
                const response = await fetch('/api/getStockImages', {
                    method: 'GET'
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Stock images", data);
                    setStockImages(data.images);
                } else {
                    console.error('Failed to fetch stock images');
                }
            } catch (error) {
                console.error('Error fetching stock images:', error);
            }
        }
        setIsLoading(true);
        fetchStockImages().then(() => setIsLoading(false));
    }, []);
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center text-white">
                {isLoading && stockImages.length === 0 ? "Fetching Images..." : "Select an Image"}
            </h2>
            {isLoading && stockImages.length === 0 && <div className="w-full"><ProgressBar value={0} infinite /></div>}

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {!isLoading && stockImages.length === 0 && <p>No images available</p>}
                {stockImages && stockImages.length > 0 && stockImages.map((src, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedImage(src)}
                        className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all duration-200 
              ${selectedImage === src ? "border-blue-500 scale-105" : "border-transparent hover:scale-105"}`}
                    >
                        <Image
                            src={src}
                            alt={`Option ${index + 1}`}
                            width={300}
                            height={200}
                            className="object-cover w-full h-40"
                            onClick={() => handleImageSelection(src)}
                        />

                    </div>
                ))}
            </div>
        </div>
    );
}
