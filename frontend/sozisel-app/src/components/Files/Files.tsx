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

import { AUTO_HIDE_DURATION } from "../../common/consts";
import ClearIcon from "@material-ui/icons/Clear";
import ErrorAlert from "../utils/Alerts/ErrorAlert";
import FileCard from "./FileCard/FileCard";
import { FileChooser } from "./FileChooser/FileChooser";
import MainNavbar from "../Navbar/MainNavbar/MainNavbar";
import SearchIcon from "@material-ui/icons/Search";
import Snackbar from "@material-ui/core/Snackbar";
import { debounce } from "debounce";
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
  // temporary mock
  const [files, setFiles] = useState<string[]>(["aaa", "bbb"]);

  const debounceFetch = useMemo(
    () =>
      debounce((name: string | undefined) => {
        //TODO add refetching
        // refetch({ input: filters });
      }, 500),
    []
  );

  const onFileDelete = useCallback(async () => {
    try {
      //TODO add delete mutation
      setSuccessMessage(t("components.Files.deletedFileMessage"));
    } catch (error) {
      console.error(error);
    }
  }, [t]);

  const onFileDownload = () => {
    //TODO add file download
  };

  const onFileUpload = () => {
    // TODO add file upload
    setFiles((prev) => [...prev, "nowe"]);
  };

  const onSearchNameChange = (event: BaseSyntheticEvent) => {
    setSearchName(event.target.value);
    debounceFetch(event.target.value);
  };

  const onSearchNameCleared = () => {
    setSearchName("");
    debounceFetch(undefined);
  };

  //   if (loading) {
  //     return (
  //       <>
  //         <MainNavbar />
  //         <div className="SessionsListContainer">
  //           <SessionFilters onSubmitCallback={onApplyFilters} />
  //           <CircularProgress></CircularProgress>
  //         </div>
  //       </>
  //     );
  //   }

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
              key={element}
              filename={element}
              fileId={element}
              onDelete={onFileDelete}
              onDownload={onFileDownload}
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
    </>
  );

  //   return (
  //     <>
  //       <MainNavbar />
  //       <div className="Files">
  //         <ErrorAlert />
  //       </div>
  //     </>
  //   );
}
