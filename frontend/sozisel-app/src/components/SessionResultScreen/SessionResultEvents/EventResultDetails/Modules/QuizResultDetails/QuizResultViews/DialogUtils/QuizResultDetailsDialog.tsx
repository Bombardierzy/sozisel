import "./QuizResultDetailsDialog.scss";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import StatsRow, {
  StatsRowProps,
} from "../../../../../../../utils/StatsRow/StatsRow";
import TotalAreaChart, {
  TotalAreaChartData,
} from "../../../../../../SessionResultSummary/TotalAreaChart";

import AppBar from "@material-ui/core/AppBar";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import EnhancedTable from "../../../../../../../utils/Table/Table";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import ShadowBoxCard from "../../../../../../../utils/Card/ShadowBoxCard";
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
  stats: StatsRowProps[];
  detailsViewTitle: string;
  details: QuizResultDialogDetails[];
  chartData: TotalAreaChartData;
  chartSubtitle: string;
}

export interface QuizResultDialogDetails {
  name: string;
  points: number;
  answerTime: number;
  trackNodes: QuizResultDialogTrackNodes[];
  finalAnswers: string[];
}
export interface QuizResultDialogTrackNodes {
  answer: string;
  time: number;
  action: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface QuizResultDialogAccordionProps {
  key: string | number;
  detail: QuizResultDialogDetails;
}

function QuizResultDialogAccordion({
  detail,
  key,
}: QuizResultDialogAccordionProps): React.ReactElement {
  const { t } = useTranslation("common");
  const headCells: {
    id: keyof QuizResultDialogTrackNodes;
    label: string;
  }[] = [
    {
      id: "answer",
      label: t("components.SessionEventResults.Quiz.dialog.answer"),
    },
    {
      id: "time",
      label: t("components.SessionEventResults.Quiz.dialog.time"),
    },
    {
      id: "action",
      label: t("components.SessionEventResults.Quiz.dialog.action"),
    },
  ];
  return (
    <Accordion key={key} className="accordion">
      <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
        <Typography color="primary" className="accordionSummary">
          {detail.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className="accordionDetails">
        <Typography className="accordionSubtitle">
          {detail.points} {t("components.SessionEventResults.Quiz.points")} /{" "}
          {detail.answerTime}{" "}
          {t("components.SessionEventResults.Quiz.dialog.seconds")}
        </Typography>
        <EnhancedTable headCells={headCells} data={detail.trackNodes} />
        <Typography className="finalAnswersTitle">
          {t("components.SessionEventResults.Quiz.dialog.finalAnswers")}
        </Typography>
        <div className="finalAnswers">
          {detail.finalAnswers.map((answer, index) => (
            <span key={index}>{answer}</span>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default function QuizResultDetailsDialog({
  isOpen,
  handleClose,
  title,
  detailName,
  detailIcon,
  stats,
  detailsViewTitle,
  details,
  chartData,
  chartSubtitle,
}: QuizResultDetailsDialogProps): React.ReactElement {
  const { t } = useTranslation("common");

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
        <div className="detailsSummary">
          <ShadowBoxCard>
            <div className="detailsSummaryContent">
              <div className="headerWithIcon">
                {detailIcon}
                <Typography variant="h3" className="header">
                  {detailName}
                </Typography>
              </div>
              {stats.map((element) => (
                <StatsRow
                  key={element.label}
                  label={element.label}
                  value={element.value}
                />
              ))}
              <div className="chartContainer">
                <div>
                  <h2>{t("components.SessionEventResults.Quiz.points")}</h2>
                  <h3>{chartSubtitle}</h3>
                </div>

                <div className="chart">
                  <TotalAreaChart
                    data={chartData}
                    valueLabel={t("components.SessionEventResults.Quiz.points")}
                  />
                </div>
              </div>
            </div>
          </ShadowBoxCard>
        </div>
        <div className="detailsView">
          <ShadowBoxCard>
            <div className="detailsViewContent">
              <Typography gutterBottom color="primary" className="detailName">
                {detailsViewTitle}
              </Typography>
              {details.map((detail, index) => {
                return (
                  <QuizResultDialogAccordion detail={detail} key={index} />
                );
              })}
            </div>
          </ShadowBoxCard>
        </div>
      </div>
    </Dialog>
  );
}
