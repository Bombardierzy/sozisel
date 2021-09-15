import MDEditor from "@uiw/react-md-editor";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface MarkdownEditorProps {
  height: number;
  value: string;
  setValue: (text: string) => void;
}

export function MarkdownEditor({
  height,
  value,
  setValue,
}: MarkdownEditorProps): ReactElement {
  const { t } = useTranslation("common");

  return (
    <MDEditor
      autoFocus
      value={value}
      previewOptions={{
        linkTarget: "_blank",
      }}
      height={height}
      highlightEnable
      hideToolbar={false}
      enableScroll
      visiableDragbar
      textareaProps={{
        placeholder: t("components.MarkdownEditor.placeholder"),
      }}
      preview="live"
      onChange={(newValue) => setValue(newValue || "")}
    />
  );
}
