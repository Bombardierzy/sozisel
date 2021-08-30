import "./QuizResultDetailsDialog.scss";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
} from "@material-ui/core";

import AppBar from "@material-ui/core/AppBar";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import EnhancedTable from "../../../../../../../utils/Table/Table";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import { TransitionProps } from "@material-ui/core/transitions";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

export interface QuizResultDetailsDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  detailName: string;
  detailIcon: React.ReactElement;
  stats: {
    label: string;
    value: string;
  }[];
  detailsViewTitle: string;
  details: {
    name: string;
    points: number;
    answerTime: number;
    trackNodes: {
      answer: string;
      time: number;
      action: string;
    }[];
    finalAnswers: string[];
  }[];
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function QuizResultDetailsDialog({
  isOpen,
  handleClose,
  title,
  detailName,
  detailIcon,
  stats,
  detailsViewTitle,
  details,
}: QuizResultDetailsDialogProps): React.ReactElement {
  const { t } = useTranslation("common");

  const statsRow = (label: string, value: string) => {
    return (
      <div className="statsRow">
        <div className="statsRowLabel">{label}</div>
        <div className="statsRowValue">{value}</div>
      </div>
    );
  };

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      className="QuizResultDetailsDialog"
    >
      <AppBar className="appBar">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className="title">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="container">
        <Paper className="detailsSummary" elevation={2}>
          <div className="headerWithIcon">
            {detailIcon}
            <Typography variant="h3" className="header">
              {detailName}
            </Typography>
          </div>
          {stats.map((element) => statsRow(element.label, element.value))}
        </Paper>
        <Paper className="detailsView" elevation={2}>
          <Typography gutterBottom color="primary" className="detailName">
            {detailsViewTitle}
          </Typography>
          {details.map((detail, index) => {
            return (
              <Accordion key={index} className="accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="primary" />}
                >
                  <Typography color="primary" className="accordionSummary">
                    {detail.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="accordionDetails">
                  <Typography className="accordionSubtitle">
                    {detail.points}{" "}
                    {t("components.SessionEventResults.Quiz.points")} /{" "}
                    {detail.answerTime}{" "}
                    {t("components.SessionEventResults.Quiz.dialog.seconds")}
                  </Typography>
                  <EnhancedTable
                    headCells={[
                      {
                        id: "answer",
                        label: t(
                          "components.SessionEventResults.Quiz.dialog.answer"
                        ),
                      },
                      {
                        id: "time",
                        label: t(
                          "components.SessionEventResults.Quiz.dialog.time"
                        ),
                      },
                      {
                        id: "action",
                        label: t(
                          "components.SessionEventResults.Quiz.dialog.action"
                        ),
                      },
                    ]}
                    data={detail.trackNodes}
                  />
                  <Typography className="finalAnswersTitle">
                    {t(
                      "components.SessionEventResults.Quiz.dialog.finalAnswers"
                    )}
                  </Typography>
                  <div className="finalAnswers">
                    {detail.finalAnswers.map((answer, index) => {
                      return <span key={index}>{answer}</span>;
                    })}
                  </div>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Paper>
      </div>
    </Dialog>
  );
}
