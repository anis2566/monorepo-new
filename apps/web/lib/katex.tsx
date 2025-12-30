"use client";

import { InlineMath } from "react-katex";

export function parseMathString(input: string): React.ReactNode[] {
    const parts = input.split(/\\\((.*?)\\\)/);

    return parts.map((part, index) => {
        return index % 2 === 0 ? (
            part
        ) : (
            <InlineMath key={index} math={part.trim()} />
        );
    });
}