import "./SessionResultHeader.scss";

import { Link, useLocation, useRouteMatch } from "react-router-dom";
import { ReactElement, useMemo } from "react";

import { Skeleton } from "@material-ui/lab";
import { Typography } from "@material-ui/core";
import { useSessionResultSummaryQuery } from "../../graphql";
import { useTranslation } from "react-i18next";

interface SessionResultHeaderProps {
  sessionId: string;
}

export default function SessionResultHeader({
  sessionId,
}: SessionResultHeaderProps): ReactElement {
  const { data, loading, error } = useSessionResultSummaryQuery({
    variables: { id: sessionId },
  });

  const { url } = useRouteMatch();
  const location = useLocation();
  const { t } = useTranslation("common");

  const links = useMemo(() => {
    return ["summary", "events", "recording", "note"].map((name) => ({
      to: `${url}/${name}`,
      label: t(`components.SessionResultHeader.${name}`),
      isActive: location.pathname.includes(name),
    }));
  }, [location, url, t]);

  return (
    <div className="SessionResultHeader">
      <div className="header">
        {loading || !!error ? (
          <Skeleton height={50} width={300} />
        ) : (
          <Typography variant="h5" className="title">
            {data?.session?.name}
          </Typography>
        )}
        <div className="subNavbar">
          {links.map(({ to, label, isActive }) => (
            <Link
              key={to}
              to={to}
              className={isActive ? "activeLink" : "inactiveLink"}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
