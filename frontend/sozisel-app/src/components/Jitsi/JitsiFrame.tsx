import "./JitsiFrame.scss";

import { InterfaceConfigOptions, JitsiMeetAPI } from "react-jitsi/dist/types";
import { ReactElement, useContext, useEffect, useState } from "react";

import { CircularProgress } from "@material-ui/core";
import { Context } from "../../contexts/ParticipantWhiteboard/ParticipantWhiteboardContext";
import Jitsi from "react-jitsi";

const OPTIONS: InterfaceConfigOptions = {
  SHOW_WATERMARK_FOR_GUESTS: false,
  SHOW_BRAND_WATERMARK: false,
  SHOW_POWERED_BY: false,
  DISPLAY_WELCOME_PAGE_CONTENT: false,
  DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
  APP_NAME: "Sozisel",
  LANG_DETECTION: true,
  /**
   * If we should show authentication block in profile
   */
  // AUTHENTICATION_ENABLE?: boolean;
  TOOLBAR_BUTTONS: [
    "microphone",
    "camera",
    "fullscreen",
    "desktop",
    "fodeviceselection",
    "hangup",
    "info",
    "chat",
    "settings",
    "raisehand",
    "videoquality",
    "filmstrip",
    "shortcuts",
    "help",
    "mute-everyone",
  ],
  //SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile'],
  VIDEO_LAYOUT_FIT: "both",
  DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
  DISABLE_TRANSCRIPTION_SUBTITLES: true,
  DISABLE_RINGING: true,
  CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,
  CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 5000,
  DISABLE_PRESENCE_STATUS: false,
  DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
  HIDE_KICK_BUTTON_FOR_GUESTS: true,
};

interface JitsiFrameProps {
  roomId: string;
  token: string;
  displayName: string;
}

const Loader = () => {
  return (
    <div className="Loader">
      <CircularProgress />
    </div>
  );
};

export default function JitsiFrame({
  roomId,
  token,
  displayName,
}: JitsiFrameProps): ReactElement {
  const [api, setApi] = useState<JitsiMeetAPI | undefined>();
  const [showWhiteboard] = useContext(Context);

  useEffect(() => {
    if (api) {
      (api as EventTarget).addEventListener("readyToClose", () => {
        window.location.href = "/";
      });
    }
  }, [api]);

  return (
    <div
      style={showWhiteboard ? { display: "none" } : {}}
      className="JitsiContainer"
    >
      <Jitsi
        domain="theliver.pl:8443"
        containerStyle={{ width: "100%", height: "100%" }}
        loadingComponent={Loader}
        onAPILoad={(api) => setApi(api)}
        roomName={roomId}
        interfaceConfig={OPTIONS}
        displayName={displayName}
        // password="password"
        jwt={token}
      ></Jitsi>
    </div>
  );
}
