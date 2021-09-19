import "./SessionResultSummaryNote.scss";

import { Button, CircularProgress, Grid, Snackbar } from "@material-ui/core";
import { ReactElement, useCallback, useEffect, useState } from "react";
import {
  useGetSessionSummaryNoteQuery,
  useUpdateSessionMutation,
} from "../../../graphql";

import { AUTO_HIDE_DURATION } from "../../../common/consts";
import { Alert } from "@material-ui/lab";
import { MarkdownEditor } from "./MarkdownEditor";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../hooks/useWindowSize";

interface SessionResultSummaryNoteProps {
  sessionId: string;
}

export function SessionResultSummaryNote({
  sessionId,
}: SessionResultSummaryNoteProps): ReactElement {
  const { t } = useTranslation("common");

  const { data, error, loading } = useGetSessionSummaryNoteQuery({
    variables: { id: sessionId },
  });

  const { height } = useWindowSize();

  const [value, setValue] = useState<string>("");

  const [updated, setUpdated] = useState<boolean>(false);

  useEffect(() => {
    if (data?.session?.summaryNote) {
      setValue(data.session.summaryNote);
    }
  }, [data?.session?.summaryNote]);

  const [updateSession] = useUpdateSessionMutation();

  const updateNote = useCallback(
    (note: string) => {
      updateSession({
        variables: {
          input: {
            id: sessionId,
            summaryNote: note,
          },
        },
      }).then(() => setUpdated(true));
    },
    [sessionId, updateSession]
  );

  const downloadNote = () => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(value)
    );
    element.setAttribute(
      "download",
      t("components.SessionResultSummaryNote.filename") + ".md"
    );

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  if (loading || error) {
    return (
      <Grid container justify="center">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div className="SessionResultSummaryNote">
      {/* -80 - 150 represent height of a navbar and SessionResultHeader*/}
      <MarkdownEditor
        height={height - 80 - 150}
        setValue={setValue}
        value={value}
      />
      <div className="actionButtons">
        <Button
          variant="contained"
          classes={{
            contained: "actionButton",
            label: "actionButtonLabel",
          }}
          onClick={downloadNote}
        >
          {t("components.SessionResultSummaryNote.download")}
        </Button>
        <Button
          variant="contained"
          classes={{
            contained: "actionButton",
            label: "actionButtonLabel",
          }}
          onClick={() => updateNote(value)}
        >
          {t("components.SessionResultSummaryNote.save")}
        </Button>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={updated}
        onClose={() => setUpdated(false)}
        autoHideDuration={AUTO_HIDE_DURATION}
      >
        <Alert onClose={() => setUpdated(false)} severity="success">
          {t("components.SessionResultSummaryNote.saved")}
        </Alert>
      </Snackbar>
    </div>
  );
}
