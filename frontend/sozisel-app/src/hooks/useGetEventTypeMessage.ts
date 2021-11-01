import { EventType } from "../graphql";
import { useTranslation } from "react-i18next";

const useGetEventTypeMessage = (): ((type: EventType) => string) => {
  const { t } = useTranslation("common");
  return (type: EventType) => {
    switch (type) {
      case EventType.Poll:
        return t("components.EventType.Poll");
      case EventType.Quiz:
        return t("components.EventType.Quiz");
      case EventType.Whiteboard:
        return t("components.EventType.Whiteboard");
      // MODULE_GENERATION_PLACEHOLDER
      default:
        return "";
    }
  };
};

export default useGetEventTypeMessage;
