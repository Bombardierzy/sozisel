import "./Files.scss";

import { BaseSyntheticEvent, ReactElement, useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  InputAdornment,
  List,
  TextField,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import {
  useDeleteFileMutation,
  usePresenterFilesQuery,
  useUploadFileMutation,
} from "../../graphql";

import { AUTO_HIDE_DURATION } from "../../common/consts";
import ClearIcon from "@material-ui/icons/Clear";
import ErrorAlert from "../utils/Alerts/ErrorAlert";
import FileCard from "./FileCard/FileCard";
import { FileChooser } from "./FileChooser/FileChooser";
import MainNavbar from "../Navbar/MainNavbar/MainNavbar";
import SearchIcon from "@material-ui/icons/Search";
import Snackbar from "@material-ui/core/Snackbar";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Files(): ReactElement {
  const { t } = useTranslation("common");
  const [searchName, setSearchName] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { data, loading } = usePresenterFilesQuery();

  const [uploadFile, { loading: uploadLoading }] = useUploadFileMutation({
    refetchQueries: ["PresenterFiles"],
  });

  const [deleteFile, { loading: deleteLoading }] = useDeleteFileMutation({
    refetchQueries: ["PresenterFiles"],
  });

  const files = useMemo(() => {
    if (data?.me) {
      return data.me.sessionResources.filter((element) =>
        element.filename.includes(searchName)
      );
    }
    return [];
  }, [data, searchName]);

  const onFileDelete = useCallback(
    async (fileId: string) => {
      deleteFile({ variables: { fileId: fileId } }).then(() =>
        setSuccessMessage(t("components.Files.deletedFileMessage"))
      );
    },
    [t, deleteFile]
  );

  const onFileUpload = (file: File) => {
    uploadFile({ variables: { resource: file } });
    setDialogOpen(false);
    setSuccessMessage(t("components.Files.uploadedFileMessage"));
  };

  const onSearchNameChange = (event: BaseSyntheticEvent) => {
    setSearchName(event.target.value);
  };

  const onSearchNameCleared = () => {
    setSearchName("");
  };

  if (loading) {
    return (
      <>
        <MainNavbar />
        <div className="Files">
          <CircularProgress></CircularProgress>
        </div>
      </>
    );
  }

  if (data?.me) {
    return (
      <>
        <MainNavbar />
        <div className="Files">
          <div className="topBar">
            <div className="searchBarContainer">
              <TextField
                fullWidth
                id="searchTextInput"
                variant="outlined"
                size="small"
                value={searchName}
                onChange={onSearchNameChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchName != "" && (
                        <ClearIcon
                          color="primary"
                          onClick={onSearchNameCleared}
                          cursor="pointer"
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              className="uploadButton"
              onClick={() => setDialogOpen(true)}
            >
              {t("components.Files.importFile")}
            </Button>
          </div>

          <List>
            {files.map((element, _) => (
              <FileCard
                key={element.id}
                filename={element.filename}
                fileId={element.id}
                onDelete={onFileDelete}
                path={element.path}
              />
            ))}
          </List>
        </div>
        <FileChooser
          onClose={() => setDialogOpen(false)}
          onSubmit={onFileUpload}
          open={dialogOpen}
        />
        <Snackbar
          open={successMessage !== ""}
          autoHideDuration={AUTO_HIDE_DURATION}
          onClose={() => setSuccessMessage("")}
        >
          <Alert onClose={() => setSuccessMessage("")} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
        <Snackbar open={uploadLoading || deleteLoading} autoHideDuration={AUTO_HIDE_DURATION}>
          <CircularProgress />
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      <div className="Files">
        <ErrorAlert />
      </div>
    </>
  );
}
