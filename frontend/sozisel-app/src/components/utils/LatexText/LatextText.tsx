import "./LatexText.scss";
import "katex/dist/katex.min.css";
import Latex from "react-latex";
import { ReactElement } from "react";

interface MarkdownTextProps {
  text: string;
}

export default function MarkdownText({
  text,
}: MarkdownTextProps): ReactElement {
  return (
    <div className="MarkdownText">
      <Latex>{text}</Latex>
    </div>
  );
}
