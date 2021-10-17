import "./PresenterSessionFiles.scss";

import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  List,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { ReactElement, useMemo, useState } from "react";
import {
  SessionResource,
  useAddFileToSessionMutation,
  useChangeFileAccessMutation,
  usePresenterFilesQuery,
  usePresenterSessionFilesQuery,
  useRemoveFileFromSessionMutation,
} from "../../../graphql";

import { AUTO_HIDE_DURATION } from "../../../common/consts";
import { Autocomplete } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import ErrorAlert from "../../utils/Alerts/ErrorAlert";
import FileCard from "../FileCard/FileCard";
import { useTranslation } from "react-i18next";

export interface PresenterSessionFilesProps {
  sessionId: string;
  open: boolean;
  onClose: () => void;
}
export function PresenterSessionFiles({
  sessionId,
  open,
  onClose,
}: PresenterSessionFilesProps): ReactElement {
  const { t } = useTranslation("common");
  const [activeSearch, setActiveSearch] = useState<boolean>(false);
  const [currentOption, setCurrentOption] = useState<SessionResource | null>(
    null
  );

  const { data, loading } = usePresenterSessionFilesQuery({
    variables: { sessionId },
    fetchPolicy: "network-only",
  });
  const { data: options, loading: optionsLoading } = usePresenterFilesQuery();

  const [addFile, { loading: addingLoading }] = useAddFileToSessionMutation({
    refetchQueries: ["PresenterSessionFiles"],
  });

  const [removeFile, { loading: removeLoading }] =
    useRemoveFileFromSessionMutation({
      refetchQueries: ["PresenterSessionFiles"],
    });

  const [changeFileAccess, { loading: changeAccessLoading }] =
    useChangeFileAccessMutation({
      refetchQueries: ["PresenterSessionFiles"],
    });

  const onAddButtonClicked = () => {
    if (currentOption !== null) {
      addFile({
        variables: {
          input: { resourceId: currentOption.id, sessionId, isPublic: false },
        },
      });
      setCurrentOption(null);
    }
  };

  const onRemoveFileFromSession = (resourceId: string) => {
    removeFile({ variables: { resourceLinkId: resourceId } });
  };

  const onAccessChange = (isPublic: boolean, resourceId: string) => {
    changeFileAccess({ variables: { resourceLinkId: resourceId, isPublic } });
  };

  const files = useMemo(() => {
    if (data?.presenterSessionResources) {
      return data.presenterSessionResources
        .slice()
        .sort((a, b) =>
          a.sessionResource.filename.localeCompare(b.sessionResource.filename)
        );
    }
    return [];
  }, [data]);

  if (loading || optionsLoading) {
    return (
      <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
        <div className="PresenterSessionFiles">
          <CircularProgress />
        </div>
      </Dialog>
    );
  }

  if (data?.presenterSessionResources && options?.me.sessionResources) {
    return (
      <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
        <div className="PresenterSessionFiles">
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
                getOptionLabel={(option) => option.filename}
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
                options={options.me.sessionResources}
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
                  key={element.id}
                  filename={element.sessionResource.filename}
                  fileId={element.id}
                  isPublic={element.isPublic}
                  onDelete={onRemoveFileFromSession}
                  path={element.sessionResource.path}
                  onAccessChange={onAccessChange}
                />
              ))}
            </List>
          </Paper>
        </div>
        <Snackbar
          open={addingLoading || removeLoading || changeAccessLoading}
          autoHideDuration={AUTO_HIDE_DURATION}
        >
          <CircularProgress />
        </Snackbar>
      </Dialog>
    );
  }

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
      <div className="PresenterSessionFiles">
        <ErrorAlert />
      </div>
    </Dialog>
  );
}
