import "./SessionFilters.scss";

import { BaseSyntheticEvent, ReactElement } from "react";
import {
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Autocomplete from "@material-ui/lab/Autocomplete";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import IconButton from "@material-ui/core/IconButton";
import TuneIcon from "@material-ui/icons/Tune";
import { useSearchSessionTemplatesQuery } from "../../../graphql";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SessionFilters(): ReactElement {
  const { t } = useTranslation("common");
  const [isStatusFilterActive, setIsStatusFilterActive] = useState<boolean>(
    false
  );
  const [status, setStatus] = useState<string>("ANY");
  const [isTemplateFilterActive, setIsTemplateFilterActive] = useState<boolean>(
    false
  );
  const [templateId, setTemplateId] = useState<string>("");
  const [isDateFromFilterActive, setIsDateFromFilterActive] = useState<boolean>(
    false
  );
  const [dateFrom, setDateFrom] = useState<Date>(new Date());
  const [isDateToFilterActive, setIsDateToFilterActive] = useState<boolean>(
    false
  );
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const { data, loading } = useSearchSessionTemplatesQuery();

  const onStatusFilterCleared = () => {
    setIsStatusFilterActive(false);
    setStatus("ANY");
  };

  const onTemplateFilterCleared = () => {
    setTemplateId("");
    setIsTemplateFilterActive(false);
  };

  const onDateFromFilterCleared = () => {
    setDateFrom(new Date());
    setIsDateFromFilterActive(false);
  };

  const onDateToFilterCleared = () => {
    setDateTo(new Date());
    setIsDateToFilterActive(false);
  };

  const onSubmit = () => {
    console.log(status);
    console.log(templateId);
    console.log(dateFrom);
    console.log(dateTo);
  };

  if (loading) {
    return (
      <>
        <Paper className="container" elevation={2}>
          <div className="headerWithIcon">
            <TuneIcon color="primary" />
            <Typography variant="h3" className="header">
              {t("components.SessionsList.filters")}
            </Typography>
          </div>
          <CircularProgress></CircularProgress>
        </Paper>
      </>
    );
  }

  if (data?.searchSessionTemplates) {
    return (
      <>
        <Paper className="container" elevation={2}>
          <div className="headerWithIcon">
            <TuneIcon color="primary" />
            <Typography variant="h3" className="header">
              {t("components.SessionsList.filters")}
            </Typography>
          </div>
          <div className="filter">
            <div className="filterHeading">
              <Typography variant="button" className="filterLabel">
                {t("components.SessionsList.status")}
              </Typography>
              {!isStatusFilterActive && (
                <IconButton onClick={() => setIsStatusFilterActive(true)}>
                  <AddCircleOutlineIcon color="primary" />
                </IconButton>
              )}
              {isStatusFilterActive && (
                <IconButton onClick={onStatusFilterCleared}>
                  <HighlightOffIcon color="primary" />
                </IconButton>
              )}
            </div>
            {isStatusFilterActive && (
              <Select
                fullWidth
                variant="outlined"
                SelectDisplayProps={{
                  style: { padding: "11px" },
                }}
                id="statusSelect"
                value={status}
                onChange={(e: BaseSyntheticEvent) => setStatus(e.target.value)}
              >
                <MenuItem value={"ANY"}>
                  {t("components.SessionsList.statusAny")}
                </MenuItem>
                <MenuItem value={"ENDED"}>
                  {t("components.SessionsList.statusEnded")}
                </MenuItem>
                <MenuItem value={"IN_PROGRESS"}>
                  {t("components.SessionsList.statusInProgress")}
                </MenuItem>
                <MenuItem value={"SCHEDULED"}>
                  {t("components.SessionsList.statusScheduled")}
                </MenuItem>
              </Select>
            )}
          </div>
          <div className="filter">
            <div className="filterHeading">
              <Typography variant="button" className="filterLabel">
                {t("components.SessionsList.template")}
              </Typography>
              {!isTemplateFilterActive && (
                <IconButton onClick={() => setIsTemplateFilterActive(true)}>
                  <AddCircleOutlineIcon color="primary" />
                </IconButton>
              )}
              {isTemplateFilterActive && (
                <IconButton onClick={onTemplateFilterCleared}>
                  <HighlightOffIcon color="primary" />
                </IconButton>
              )}
            </div>
            {isTemplateFilterActive && (
              <div className="inputContainer">
                <Autocomplete
                  fullWidth
                  id="template-filter"
                  options={data.searchSessionTemplates}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) =>
                    setTemplateId(value != null ? value.id : "")
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" size="small" />
                  )}
                />
              </div>
            )}
          </div>
          <div className="filter">
            <div className="filterHeading">
              <Typography variant="button" className="filterLabel">
                {t("components.SessionsList.dateFrom")}
              </Typography>
              {!isDateFromFilterActive && (
                <IconButton onClick={() => setIsDateFromFilterActive(true)}>
                  <AddCircleOutlineIcon color="primary" />
                </IconButton>
              )}
              {isDateFromFilterActive && (
                <IconButton onClick={onDateFromFilterCleared}>
                  <HighlightOffIcon color="primary" />
                </IconButton>
              )}
            </div>
            {isDateFromFilterActive && (
              <TextField
                name="dateFrom"
                defaultValue={new Date().toISOString().slice(0, 16)}
                onChange={(e: BaseSyntheticEvent) =>
                  setDateFrom(e.target.value)
                }
                variant="outlined"
                size="small"
                type="datetime-local"
                color="primary"
              />
            )}
          </div>
          <div className="filter">
            <div className="filterHeading">
              <Typography variant="button" className="filterLabel">
                {t("components.SessionsList.dateTo")}
              </Typography>
              {!isDateToFilterActive && (
                <IconButton onClick={() => setIsDateToFilterActive(true)}>
                  <AddCircleOutlineIcon color="primary" />
                </IconButton>
              )}
              {isDateToFilterActive && (
                <IconButton onClick={onDateToFilterCleared}>
                  <HighlightOffIcon color="primary" />
                </IconButton>
              )}
            </div>
            {isDateToFilterActive && (
              <TextField
                name="dateTo"
                onChange={(e: BaseSyntheticEvent) => setDateTo(e.target.value)}
                variant="outlined"
                defaultValue={new Date().toISOString().slice(0, 16)}
                size="small"
                type="datetime-local"
                color="primary"
              />
            )}
          </div>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="applyButton"
            onClick={onSubmit}
          >
            {t("components.SessionsList.applyFilters")}
          </Button>
        </Paper>
      </>
    );
  }

  return (
    <>
      <Paper className="container" elevation={2}>
        <div className="headerWithIcon">
          <TuneIcon color="primary" />
          <Typography variant="h3" className="header">
            {t("components.SessionsList.filters")}
          </Typography>
        </div>
        <Alert className="ErrorAlert" variant="outlined" severity="error">
          {t("components.SessionsList.fetchingErrorMessage")}
        </Alert>
      </Paper>
    </>
  );
}
