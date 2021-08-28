import "./QuizResultDetailsDialog.scss";

import AppBar from "@material-ui/core/AppBar";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import { Paper } from "@material-ui/core";
import React from "react";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import { TransitionProps } from "@material-ui/core/transitions";
import Typography from "@material-ui/core/Typography";

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
}: QuizResultDetailsDialogProps): React.ReactElement {
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
        <Paper className="detailsView" elevation={2}></Paper>
      </div>
    </Dialog>
  );
}
