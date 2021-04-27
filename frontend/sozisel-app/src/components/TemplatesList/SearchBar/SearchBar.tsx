import "./SearchBar.scss";
import { BaseSyntheticEvent, ReactElement } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import Grid from "@material-ui/core/Grid";
import ClearIcon from "@material-ui/icons/Clear";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

export interface SearchBarProps {
  onSearch: ({
    nameSearch,
    includePublicSearch,
  }: {
    nameSearch?: string;
    includePublicSearch?: boolean;
  }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps): ReactElement {
  const { t } = useTranslation("common");
  const [name, setName] = useState("");
  const [includePublic, setIncludePublic] = useState(0);
  const history = useHistory();

  const onSearchTextChange = (event: BaseSyntheticEvent) => {
    setName(event.target.value);
  };

  const onSearchPublicChange = (event: BaseSyntheticEvent) => {
    setIncludePublic(event.target.value);
    onSearch({
      nameSearch: name,
      includePublicSearch: event.target.value == 1,
    });
  };

  const onSearchButtonClicked = () => {
    onSearch({ nameSearch: name, includePublicSearch: includePublic == 1 });
  };

  const onSearchTextCleared = () => {
    setName("");
    onSearch({ nameSearch: "", includePublicSearch: includePublic == 1 });
  };

  return (
    <>
      <Grid container spacing={3} justify="center" className="searchBar">
        <Grid item sm={12} md={4} className="gridItem">
          <TextField
            fullWidth
            id="searchTextInput"
            variant="outlined"
            size="small"
            value={name}
            onChange={onSearchTextChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {name != "" && (
                    <ClearIcon
                      color="primary"
                      onClick={() => onSearchTextCleared()}
                      cursor="pointer"
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item sm={12} md={4} className="gridItem">
          <Select
            fullWidth
            variant="outlined"
            SelectDisplayProps={{
              style: { padding: "11px" },
            }}
            id="accessSelect"
            value={includePublic}
            onChange={onSearchPublicChange}
          >
            <MenuItem value={0}>
              {t("components.TemplatesList.private")}
            </MenuItem>
            <MenuItem value={1}>
              {t("components.TemplatesList.public")}
            </MenuItem>
          </Select>
        </Grid>
        <Grid item sm={6} md={2} className="gridItem">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="searchBarButton"
            onClick={() => onSearchButtonClicked()}
          >
            {t("components.TemplatesList.searchButtonText")}
          </Button>
        </Grid>
        <Grid item sm={6} md={2} className="gridItem">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="searchBarButton"
            onClick={() => history.push("/templates/create")}
          >
            {t("components.TemplatesList.addButtonText")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
