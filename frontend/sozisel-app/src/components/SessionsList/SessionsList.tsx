import "./SessionsList.scss";

import { BaseSyntheticEvent, ReactElement, useMemo, useState } from "react";
import {
  CircularProgress,
  InputAdornment,
  List,
  TextField,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import SessionFilters, {
  SessionFiltersSchema,
} from "./SessionFilters/SessionFilters";
import {
  SessionStatus,
  useDeleteSessionMutation,
  useSearchSessionsQuery,
} from "../../graphql";

import ClearIcon from "@material-ui/icons/Clear";
import MainNavbar from "../MainNavbar/MainNavbar";
import SearchIcon from "@material-ui/icons/Search";
import SessionCard from "./SessionCard/SessionCard";
import Snackbar from "@material-ui/core/Snackbar";
import { debounce } from "debounce";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SessionsList(): ReactElement {
  const { t } = useTranslation("common");
  const [filters, setFilters] = useState<SessionFiltersSchema>({
    status: SessionStatus.Any,
    templateId: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    name: undefined,
  });
  const [searchName, setSearchName] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { data, loading, refetch, error } = useSearchSessionsQuery({
    variables: { input: { status: SessionStatus.Any } },
  });
  const [
    deleteMutation,
    { error: deleteError, loading: deleteLoading },
  ] = useDeleteSessionMutation();

  const debounceFetch = useMemo(
    () =>
      debounce((name: string | undefined) => {
        filters.name = name;
        refetch({ input: filters });
      }, 500),
    [filters, refetch]
  );

  const onSessionDelete = useCallback(
    async (id: string) => {
      try {
        await deleteMutation({
          variables: {
            id: id,
          },
        });
        refetch({ input: filters });
        setSuccessMessage(`${t("components.SessionList.sessionDeleted")}`);
      } catch (error) {
        console.error(error);
      }
    },
    [deleteMutation, refetch, filters, t]
  );

  const onApplyFilters = useCallback(
    (filters: SessionFiltersSchema) => {
      setSearchName("");
      setFilters(filters);
      refetch({ input: filters });
    },
    [refetch]
  );

  const onSearchNameChange = (event: BaseSyntheticEvent) => {
    setSearchName(event.target.value);
    debounceFetch(event.target.value);
  };

  const onSearchNameCleared = () => {
    setSearchName("");
    debounceFetch(undefined);
  };

  if (loading) {
    return (
      <>
        <MainNavbar></MainNavbar>
        <div className="SessionsListContainer">
          <SessionFilters onSubmitCallback={onApplyFilters} />
          <CircularProgress></CircularProgress>
        </div>
      </>
    );
  }

  if (data?.searchSessions) {
    return (
      <>
        <MainNavbar></MainNavbar>
        <div className="SessionsListContainer">
          <SessionFilters onSubmitCallback={onApplyFilters} />
          <div className="listWithSearchBar">
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
            <List>
              {data.searchSessions.map((element, _) => (
                <SessionCard
                  key={element.id}
                  session={element}
                  onDelete={onSessionDelete}
                />
              ))}
            </List>
          </div>
        </div>
        <Snackbar
          open={successMessage !== ""}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
        >
          <Alert onClose={() => setSuccessMessage("")} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
        <Snackbar open={deleteLoading} autoHideDuration={3000}>
          <CircularProgress />
        </Snackbar>
        <Snackbar open={!!deleteError} autoHideDuration={6000}>
          <Alert severity="error">
            {t("components.SessionList.errorMessage")}
          </Alert>
        </Snackbar>
      </>
    );
  }

  console.log(error);

  return (
    <>
      <MainNavbar></MainNavbar>
      <div className="SessionsListContainer">
        <Alert className="ErrorAlert" variant="outlined" severity="error">
          {t("components.SessionsList.fetchingErrorMessage")}
        </Alert>
      </div>
    </>
  );
}
