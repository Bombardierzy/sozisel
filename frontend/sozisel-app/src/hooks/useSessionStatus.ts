import { Session } from "../model/Session";
import { useTranslation } from "react-i18next";

export interface useSessionStatusSchema {
  status: string;
  isScheduled: boolean;
  isEnded: boolean;
}

export default function useSessionStatus(
  session: Session
): useSessionStatusSchema {
  const { t } = useTranslation("common");
  if (session.startTime == null)
    return {
      status: t("components.SessionsList.statusScheduled"),
      isScheduled: true,
      isEnded: false,
    };
  if (session.startTime != null && session.endTime == null)
    return {
      status: t("components.SessionsList.statusInProgress"),
      isScheduled: false,
      isEnded: false,
    };
  return {
    status: t("components.SessionsList.statusEnded"),
    isScheduled: false,
    isEnded: true,
  };
}
