import "./TemplateList.scss";
import MainNavbar from "../MainNavbar/MainNavbar";
import SearchBar from "./SearchBar/SearchBar";
import TemplateCard from "./TemplateCard/TemplateCard";
import { ReactElement } from "react";
import List from "@material-ui/core/List";
import { useTranslation } from "react-i18next";
import {
  SessionTemplate,
  useCloneSessionTemplateMutation,
  useDeleteSessionTemplateMutation,
  useSearchSessionTemplatesQuery,
} from "../../graphql";
import CircularProgress from "@material-ui/core/CircularProgress";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function TemplateList(): ReactElement {
  const { t } = useTranslation("common");
  const { data, loading, error, refetch } = useSearchSessionTemplatesQuery();
  const [name, setName] = useState<string>("");
  const [includePublic, setIncludePublic] = useState<boolean>(false);
  const [
    cloneMutation,
    { error: cloneError, loading: cloneLoading },
  ] = useCloneSessionTemplateMutation();
  const [
    deleteMutation,
    { error: deleteError, loading: deleteLoading },
  ] = useDeleteSessionTemplateMutation();
  const [successMsg, setSuccessMsg] = useState<string>("");

  const onSearch = ({
    nameSearch = name,
    includePublicSearch = includePublic,
  }: {
    nameSearch?: string;
    includePublicSearch?: boolean;
  }) => {
    refetch({ name: nameSearch, includePublic: includePublicSearch });
    setName(nameSearch);
    setIncludePublic(includePublicSearch);
  };

  const onCopy = async (template: SessionTemplate) => {
    try {
      await cloneMutation({
        variables: {
          id: template.id,
        },
      });
      refetch({ name: name, includePublic: includePublic });
      setSuccessMsg("Skopiowano szablon!");
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async (template: SessionTemplate) => {
    try {
      await deleteMutation({
        variables: {
          id: template.id,
        },
      });
      refetch({ name: name, includePublic: includePublic });
      setSuccessMsg("Pomyślnie usunięto szablon!");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <>
        <MainNavbar></MainNavbar>
        <div className="TemplateListContainer">
          <SearchBar onSearch={onSearch}></SearchBar>
          <div className="ContentContainer">
            <CircularProgress />
          </div>
        </div>
      </>
    );
  }

  if (data?.searchSessionTemplates) {
    return (
      <>
        <MainNavbar></MainNavbar>
        <div className="TemplateListContainer">
          <SearchBar onSearch={onSearch}></SearchBar>
          <div className="TemplatesList">
            <List>
              {data.searchSessionTemplates.map((element, index) => (
                <TemplateCard
                  template={element}
                  onCopy={onCopy}
                  onDelete={onDelete}
                />
              ))}
            </List>
          </div>
        </div>
        <Snackbar
          open={successMsg !== ""}
          autoHideDuration={6000}
          onClose={() => setSuccessMsg("")}
        >
          <Alert onClose={() => setSuccessMsg("")} severity="success">
            {successMsg}
          </Alert>
        </Snackbar>
        <Snackbar open={cloneLoading || deleteLoading} autoHideDuration={3000}>
          <CircularProgress />
        </Snackbar>
        <Snackbar open={!!cloneError || !!deleteError} autoHideDuration={6000}>
          <Alert severity="error">This is an error message!</Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <MainNavbar></MainNavbar>
      <div className="TemplateListContainer">
        <SearchBar onSearch={onSearch}></SearchBar>
        <Alert className="ErrorAlert" variant="outlined" severity="error">
          {t("components.TemplatesList.errorMsg")}
        </Alert>
      </div>
    </>
  );
}
