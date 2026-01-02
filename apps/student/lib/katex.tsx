import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

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
