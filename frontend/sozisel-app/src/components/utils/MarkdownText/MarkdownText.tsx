import "./MarkdownText.scss";
import MDEditor from "@uiw/react-md-editor";
import { ReactElement } from "react";

interface MarkdownTextProps {
  text: string;
}

export default function MarkdownText({
  text,
}: MarkdownTextProps): ReactElement {
  return <MDEditor.Markdown source={text} className="MarkdownText" />;
}
