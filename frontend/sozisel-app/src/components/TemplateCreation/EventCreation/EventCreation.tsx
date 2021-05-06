import "./EventCreation.scss";

import {
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useState } from "react";

import { useTranslation } from "react-i18next";

export default function EventCreation(): ReactElement {
  const { t } = useTranslation("common");
  const [moduleType, setModuleType] = useState<string>("Quiz");

  return (
    <Paper className="EventCreation" elevation={2}>
      <TextField
        variant="outlined"
        size="small"
        className="eventName"
        defaultValue={t("components.TemplateCreation.EventCreation.moduleName")}
      />
      <FormControl size="small" variant="filled" className="moduleType">
        <Select
          variant="outlined"
          value={moduleType}
          onChange={(e) => setModuleType(e.target.value as string)}
          inputProps={{
            id: "moduleType",
          }}
        >
          <MenuItem value="" disabled />
          <MenuItem value="Quiz">Quiz</MenuItem>
        </Select>
        <Typography className="label">
          {t("components.TemplateCreation.EventCreation.startTime")}
        </Typography>
        <TextField
          name="startMinute"
          variant="outlined"
          size="small"
          className="input"
          type="number"
        />

        <Button type="submit" variant="contained" className="submitButton">
          {t("components.TemplateCreation.EventCreation.submitButtonLabel")}
        </Button>
      </FormControl>
    </Paper>
  );
}
