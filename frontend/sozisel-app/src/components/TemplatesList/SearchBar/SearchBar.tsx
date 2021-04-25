import "./SearchBar.scss";
import { BaseSyntheticEvent, ReactElement } from "react";
import FilledInput from "@material-ui/core/FilledInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import Grid from "@material-ui/core/Grid";
import ClearIcon from "@material-ui/icons/Clear";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";

export interface SearchBarProps {
  onSearch: (name: string, includePublic: boolean) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps): ReactElement {
  const { t } = useTranslation("common");
  const [searchText, setSearchText] = useState("");
  const [searchPublic, setSearchPublic] = useState(0);

  const onSearchTextChange = (event: BaseSyntheticEvent) => {
    setSearchText(event.target.value);
  };

  const onSearchPublicChange = (event: BaseSyntheticEvent) => {
    setSearchPublic(event.target.value);
  };

  const onSearchButtonClicked = () => {
    onSearch(searchText, searchPublic == 1);
  };

  const onSearchTextCleared = () => {
    setSearchText("");
    onSearch("", searchPublic == 1);
  };

  return (
    <>
      <Grid container spacing={3} justify="center" className="searchBar">
        <Grid item sm={12} md={4} className="gridItem">
          <FormControl fullWidth variant="filled">
            <FilledInput
              id="searchTextInput"
              value={searchText}
              disableUnderline
              inputProps={{ style: { padding: "20px 10px 20px 10px" } }}
              onChange={onSearchTextChange}
              startAdornment={
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  {searchText != "" && (
                    <ClearIcon
                      color="primary"
                      onClick={() => onSearchTextCleared()}
                      cursor="pointer"
                    />
                  )}
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item sm={12} md={4} className="gridItem">
          <FormControl fullWidth variant="filled">
            <Select
              disableUnderline
              autoWidth
              SelectDisplayProps={{
                style: { padding: "20px 50px 20px 10px" },
              }}
              id="accessSelect"
              value={searchPublic}
              onChange={onSearchPublicChange}
            >
              <MenuItem value={0}>
                {t("components.TemplatesList.private")}
              </MenuItem>
              <MenuItem value={1}>
                {t("components.TemplatesList.public")}
              </MenuItem>
            </Select>
          </FormControl>
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
            startIcon={<AddIcon />}
            className="searchBarButton"
          >
            {t("components.TemplatesList.addButtonText")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
