'use client';

import { useState } from "react";
import Image from "next/image";

interface ClickableImageProps {
    src: string;
    width?: number;
    height?: number;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
}

export default function ClickableImage({ src, width, height, className, onClick }: ClickableImageProps) {
    return (
        <div>
            <Image
                priority
                src={src}
                width={width}
                height={height}
                className={className}
                alt="Clickable"
                onClick={onClick}

            />
        </div>
    );
}
