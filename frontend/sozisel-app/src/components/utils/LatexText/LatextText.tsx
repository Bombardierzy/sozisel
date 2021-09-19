import "./LatexText.scss";
import "katex/dist/katex.min.css";
import { ReactElement } from "react";
import TeX from "@matejmazur/react-katex";

interface MarkdownTextProps {
  text: string;
}

export default function MarkdownText({
  text,
}: MarkdownTextProps): ReactElement {
  return <TeX className="MarkdownText">{text}</TeX>;
}
