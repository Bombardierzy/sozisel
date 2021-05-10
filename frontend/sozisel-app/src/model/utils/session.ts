import { Session } from "../../graphql";

export default function getSessionStatus(session: Session): string {
  if (session.startTime == null) return "Zaplanowana";
  if (session.startTime != null && session.endTime == null) return "W trakcie";
  return "Zakończona";
}
