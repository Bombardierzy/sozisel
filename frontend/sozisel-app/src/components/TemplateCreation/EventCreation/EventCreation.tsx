import "./EventCreation.scss";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Theme,
  Typography,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import React, { ReactElement, useState } from "react";

import { useTranslation } from "react-i18next";

// TODO Move this styles to scss
const useStyles = ({ palette }: Theme) =>
  makeStyles({
    moduleName: {
      width: "100%",
      "& .MuiInputBase-input": {
        color: palette.primary.main,
        textAlign: "center",
        fontSize: 20,
        fontWeight: 600,
      },
      "& .MuiInput-underline:before,  & .MuiInput-underline:after": {
        border: 0,
      },
      "&:hover .MuiOutlinedInput-input": {
        border: 0,
      },
    },
    moduleType: {
      width: "100%",
      marginTop: 20,
    },
    select: {
      "&:not([multiple]) option": {
        backgroundColor: "lightgray",
      },
    },
  });

export default function EventCreation(): ReactElement {
  const { t } = useTranslation("common");
  const mainTheme = useTheme();
  const styles = useStyles(mainTheme)();
  const [moduleType, setModuleType] = useState<string>("");

  return (
    <Paper className="EventCreation" elevation={2}>
      <TextField
        variant="outlined"
        size="small"
        className={styles.moduleName}
        defaultValue={t("components.TemplateCreation.EventCreation.moduleName")}
      />
      <FormControl size="small" variant="filled" className={styles.moduleType}>
        <InputLabel htmlFor="moduleType">
          {t("components.TemplateCreation.EventCreation.moduleType")}
        </InputLabel>
        <Select
          value={moduleType}
          onChange={(e) => setModuleType(e.target.value as string)}
          inputProps={{
            id: "moduleType",
          }}
          classes={{
            select: styles.select,
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

        <Button type="submit" variant="contained">
          {t("components.TemplateCreation.EventCreation.submitButtonLabel")}
        </Button>
      </FormControl>
    </Paper>
  );
}
