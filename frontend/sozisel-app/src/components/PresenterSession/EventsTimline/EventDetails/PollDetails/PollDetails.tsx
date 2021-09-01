import "./PollDetails.scss";

import React, { ReactElement } from "react";
import { Poll } from "../../../../../graphql";
import { useTranslation } from "react-i18next";

interface PollDetailsProps {
  poll: Poll;
}

const PollDetails = ({ poll }: PollDetailsProps): ReactElement => {
  const { t } = useTranslation("common");
  console.log(poll);
  return (
    <div className="PollDetails">
      <div>
        <p>
          {t(
            "components.PresenterSession.EventsTimeline.PollDetails.questionText",
            { text: poll.question }
          )}
        </p>
        <p>
          {t(
            poll.isMultiChoice
              ? "components.PresenterSession.EventsTimeline.PollDetails.multiChoice"
              : "components.PresenterSession.EventsTimeline.PollDetails.singleChoice"
          )}
        </p>
      </div>
    </div>
  );
};

export default PollDetails;
