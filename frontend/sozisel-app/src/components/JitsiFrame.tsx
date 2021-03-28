import Jitsi from "react-jitsi";
import { ReactElement } from "react";

export default function JitsiFrame(): ReactElement {
    return (
        <>
            <Jitsi domain="localhost:8443" roomName="aaa"></Jitsi>
        </>
    );
}