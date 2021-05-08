import "./SessionCreation.scss";

import React, { ReactElement } from "react";

import MainNavbar from "../MainNavbar/MainNavbar";
import SessionCustomization from "./SessionCustomization/SessionCustomization";

export default function SessionCreation(): ReactElement {
  const onSubmit = ({
    sessionName,
    entryPassword,
    scheduledDateTime,
    useJitsi,
  }: {
    sessionName: string;
    entryPassword?: string;
    scheduledDateTime: Date;
    useJitsi: boolean;
  }) => {
    console.log(sessionName);
    console.log(entryPassword);
    console.log(scheduledDateTime);
    console.log(useJitsi);
  };
  return (
    <>
      <MainNavbar />
      <div className="SessionCreation">
        <SessionCustomization onValidSubmit={onSubmit}></SessionCustomization>
      </div>
    </>
  );
}
