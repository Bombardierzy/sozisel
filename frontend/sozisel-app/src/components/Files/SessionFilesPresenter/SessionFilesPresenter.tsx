import "./SessionFilesPresenter.scss";

import {
  Button,
  Dialog,
  IconButton,
  List,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { ReactElement, useState } from "react";

import { Autocomplete } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import FileCard from "../FileCard/FileCard";
import { useTranslation } from "react-i18next";

export interface SessionFilesPresenterProps {
  sessionId: string;
  open: boolean;
  onClose: () => void;
}
export function SessionFilesPresenter({
  sessionId,
  open,
  onClose,
}: SessionFilesPresenterProps): ReactElement {
  const { t } = useTranslation("common");
  const [activeSearch, setActiveSearch] = useState<boolean>(false);
  const [currentOption, setCurrentOption] = useState<string | null>(null);

  const onAddButtonClicked = () => {
    console.log(currentOption);

    if (currentOption !== null) {
      // TODO add file to session mutation

      setCurrentOption(null);
    }
  };

  const onRemoveFileFromSession = () => {
    //TODO remove file from session mutation
  };

  const onFileDownload = () => {
    //TODO add file download
  };

  const onAccessChange = (isPublic: boolean) => {
    //TODO add access change mutation
  };

  //temporary mock
  const options = ["cos", "tam", "bvl", "asdf"];
  const [files, setFiles] = useState<string[]>(["aaa", "bbb"]);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
      <div className="SessionFilesPresenter">
        <div className="dialogTitle">
          <Typography component="h5" variant="h5">
            {t("components.Files.sessionFiles")}
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Paper className="dialogContent">
          <div className="topBar">
            <Autocomplete
              className="autocomplete"
              size="small"
              open={activeSearch}
              fullWidth
              value={currentOption}
              onOpen={() => {
                setActiveSearch(true);
              }}
              onClose={() => {
                setActiveSearch(false);
              }}
              onChange={(event, value) => {
                setCurrentOption(value);
              }}
              options={options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t("components.Files.autocompleteLabel")}
                  fullWidth
                />
              )}
            />

            <Button
              variant="contained"
              color="primary"
              className="submitButton"
              onClick={onAddButtonClicked}
            >
              {t("components.Files.add")}
            </Button>
          </div>

          <List className="filesList">
            {files.map((element, _) => (
              <FileCard
                key={element}
                filename={element}
                fileId={element}
                onDelete={onRemoveFileFromSession}
                path={element}
                onAccessChange={onAccessChange}
              />
            ))}
          </List>
        </Paper>
      </div>
    </Dialog>
  );
}
