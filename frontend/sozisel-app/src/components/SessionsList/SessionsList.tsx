import "./SessionsList.scss";

import { BaseSyntheticEvent, ReactElement, useMemo, useState } from "react";
import {
  CircularProgress,
  InputAdornment,
  List,
  TextField,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import {
  Session,
  SessionStatus,
  useDeleteSessionMutation,
  useSearchSessionsQuery,
} from "../../graphql";
import SessionFilters, {
  SessionFiltersSchema,
} from "./SessionFilters/SessionFilters";

import { AUTO_HIDE_DURATION } from "../../common/consts";
import ClearIcon from "@material-ui/icons/Clear";
import MainNavbar from "../Navbar/MainNavbar/MainNavbar";
import SearchIcon from "@material-ui/icons/Search";
import SessionCard from "./SessionCard/SessionCard";
import Snackbar from "@material-ui/core/Snackbar";
import { debounce } from "debounce";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type SearchedSession = Pick<
  Session,
  "endTime" | "id" | "name" | "scheduledStartTime" | "startTime"
>;

export default function SessionsList(): ReactElement {
  const { t } = useTranslation("common");
  const [filters, setFilters] = useState<SessionFiltersSchema>({
    status: SessionStatus.Any,
  });
  const [searchName, setSearchName] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { data, loading, refetch } = useSearchSessionsQuery({
    variables: { input: { status: SessionStatus.Any } },
    fetchPolicy: "network-only",
  });
  const [deleteMutation, { error: deleteError, loading: deleteLoading }] =
    useDeleteSessionMutation();

  const sortedSearchedSessions = useMemo(() => {
    if (!data?.searchSessions) return [];

    const sessions = [...data.searchSessions];

    sessions.sort((a: SearchedSession, b: SearchedSession) => {
      if (a.endTime && b.endTime) {
        // if both sessions have endTime then sort in descending order
        return (b.endTime as string).localeCompare(a.endTime as string);
      }

      if (a.endTime || b.endTime) {
        // if 'a' has endTime then 'b' does not have one so 'a' should appear later
        return a.endTime ? 1 : -1;
      }

      if (a.startTime && b.startTime) {
        // if both sessions have startTime (are running) then sort in descending order
        return (b.startTime as string).localeCompare(a.startTime as string);
      }

      if (a.startTime || b.startTime) {
        // if 'a' has startTime then 'b' does not have one so 'a' should appear earlier
        return a.startTime ? -1 : 1;
      }

      // both sessions do not have either endTime or startTime so compare scheduled times (the closer the more important)
      return (b.scheduledStartTime as string).localeCompare(
        a.scheduledStartTime as string
      );
    });

    return sessions;
  }, [data]);

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
        setSuccessMessage(`${t("components.SessionsList.sessionDeleted")}`);
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
        <MainNavbar />
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
        <MainNavbar />
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
              {sortedSearchedSessions.map((element, _) => (
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
          autoHideDuration={AUTO_HIDE_DURATION}
          onClose={() => setSuccessMessage("")}
        >
          <Alert onClose={() => setSuccessMessage("")} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
        <Snackbar open={deleteLoading} autoHideDuration={AUTO_HIDE_DURATION}>
          <CircularProgress />
        </Snackbar>
        <Snackbar open={!!deleteError} autoHideDuration={AUTO_HIDE_DURATION}>
          <Alert severity="error">
            {t("components.SessionList.errorMessage")}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      <div className="SessionsListContainer">
        <Alert className="errorAlert" variant="outlined" severity="error">
          {t("components.SessionsList.fetchingErrorMessage")}
        </Alert>
      </div>
    </>
  );
}
