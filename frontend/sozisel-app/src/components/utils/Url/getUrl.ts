export enum UrlType {
  sessionResource,
  recording,
  joinSessionLink,
  shareRecordingLink,
}

export interface GetUrlProps {
  type: UrlType;
  id?: string;
}

export function getUrl({ type, id }: GetUrlProps): string {
  const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
  const port = 4000;
  let typeSpecificUrl = "";
  switch (type) {
    case UrlType.sessionResource:
      typeSpecificUrl = `session_resource/${id}`;
      break;
    case UrlType.recording:
      typeSpecificUrl = `recording/${id}`;
      break;
    case UrlType.joinSessionLink:
      typeSpecificUrl = `sessions/${id}/join`;
      break;
    case UrlType.shareRecordingLink:
      typeSpecificUrl = `/session-recording/${id}`;
      break;
  }
  return `${baseUrl}:${port}/${typeSpecificUrl}`;
}
