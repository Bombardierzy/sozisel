import "./TemplateList.scss";
import MainNavbar from "../MainNavbar/MainNavbar";
import { BaseSyntheticEvent, ReactElement } from "react";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import { useState } from "react";
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import ClearIcon from '@material-ui/icons/Clear';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


export default function TemplateList(): ReactElement{
    const [searchText, setSearchText] = useState("");
    const [access, setAccess] = useState("Prywatne")
    
    const onSearchTextChange = (event: BaseSyntheticEvent) => {
        setSearchText(event.target.value);
    };

    const onAccessChange = (event: BaseSyntheticEvent) => {
        setAccess(event.target.value);
    };

    return(
        <>
        <MainNavbar></MainNavbar>
        <div className="TemplateListContainer">
            <Grid container spacing={3} justify="center" className="searchBar">
                <Grid item xs={12} sm={3}>
                <FormControl fullWidth variant="filled">
                <FilledInput
                    id="searchTextInput"
                    value={searchText}
                    disableUnderline
                    inputProps={{style: { padding: "20px 10px 20px 10px" }}} 
                    onChange={onSearchTextChange}
                    startAdornment={<InputAdornment position="end"><SearchIcon /></InputAdornment>}
                    endAdornment={<InputAdornment position="end">{searchText != "" && <ClearIcon color="primary" onClick={() => setSearchText("")} cursor="pointer"/>}</InputAdornment>}
                />
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth variant="filled">
                    <Select
                    disableUnderline
                    autoWidth
                    SelectDisplayProps={{style: { padding: "20px 50px 20px 10px" }}} 
                    id="accessSelect"
                    value={access}
                    onChange={onAccessChange}
                    >
                    <MenuItem value={"Prywatne"}>Prywatne</MenuItem>
                    <MenuItem value={"Publiczne"}>Publiczne</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
            </Grid>
        </div>
        </>
    );
}