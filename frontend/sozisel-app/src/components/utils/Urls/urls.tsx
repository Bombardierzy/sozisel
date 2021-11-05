export enum UrlType {
  sessionResource,
  recording,
  joinSessionLink,
  shareRecordingLink,
  image,
}

export interface GetUrlProps {
  type: UrlType;
  id?: string;
}

export function getBaseUrl(): string {
  let baseUrl = "";
  const port = 4000;
  switch (process.env.NODE_ENV) {
    case "production":
      baseUrl = `${window.location.protocol}//${window.location.hostname}/api`;
      break;
    case "development":
    default:
      baseUrl = `${window.location.protocol}//${window.location.hostname}:${port}/api`;
  }
  return baseUrl;
}

export function getGraphQLUrl(): string {
  return `${getBaseUrl()}/graphql`;
}

export function getSocketUrl(): string {
  let baseSocketUrl = "";
  const port = 4000;
  switch (process.env.NODE_ENV) {
    case "production":
      baseSocketUrl = `wss://${window.location.hostname}/api/socket`;
      break;
    case "development":
    default:
      baseSocketUrl = `ws://${window.location.hostname}:${port}/api/socket`;
  }
  return baseSocketUrl;
}

export function getJitsiUrl(): string {
  let baseSocketUrl = "";
  const port = 8443;
  switch (process.env.NODE_ENV) {
    case "production":
      baseSocketUrl = `jitsi.${window.location.hostname}`;
      break;
    case "development":
    default:
      baseSocketUrl = `${window.location.hostname}:${port}`;
  }
  return baseSocketUrl;
}

export function getTypedUrl({ type, id }: GetUrlProps): string {
  let typeSpecificUrl = "";
  switch (type) {
    case UrlType.sessionResource:
      typeSpecificUrl = `session_resource/${id}`;
      break;
    case UrlType.recording:
      typeSpecificUrl = `recording/session_${id}.mp4`;
      break;
    case UrlType.joinSessionLink:
      typeSpecificUrl = `sessions/${id}/join`;
      break;
    case UrlType.shareRecordingLink:
      typeSpecificUrl = `session-recording/${id}`;
      break;
    case UrlType.image:
      typeSpecificUrl = `image/${id}`;
      break;
  }
  return `${getBaseUrl()}/${typeSpecificUrl}`;
}
