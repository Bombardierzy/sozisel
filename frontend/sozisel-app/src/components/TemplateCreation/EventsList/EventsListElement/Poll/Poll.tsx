import "./Poll.scss";

import {
  CheckBoxOutlined,
  IndeterminateCheckBoxOutlined,
} from "@material-ui/icons";
import { Paper, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

import { Poll as PollData } from "../../../../../graphql";
import { useTranslation } from "react-i18next";

interface PollProps {
  data: PollData;
}

export default function Poll({ data }: PollProps): ReactElement {
  const { t } = useTranslation("common");
  return (
    <Paper className="PollContainer">
      <Typography variant="h4" className="header">
        {data.question}
      </Typography>

      <ul>
        {data.options.map((option) => (
          <li key={option.id}>
            <Typography>{option.text}</Typography>
          </li>
        ))}
      </ul>

      <Typography variant="h4" className="header withIcon">
        {t("components.TemplateCreation.EventList.Poll.isMultiChoice")}{" "}
        {data.isMultiChoice ? (
          <CheckBoxOutlined />
        ) : (
          <IndeterminateCheckBoxOutlined />
        )}
      </Typography>
    </Paper>
  );
}
