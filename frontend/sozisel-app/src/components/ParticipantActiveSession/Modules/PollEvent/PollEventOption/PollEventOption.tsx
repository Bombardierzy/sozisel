import "./PollEventOption.scss";
import { Checkbox } from "@material-ui/core";
import { PollOption } from "../../../../../graphql";
import { ReactElement } from "react";

interface PollEventOptionProps {
  option: PollOption;
  onCheck: () => void;
  isChecked: boolean;
}

const PollEventOption = ({
  option,
  onCheck,
  isChecked,
}: PollEventOptionProps): ReactElement => {
  return (
    <div onClick={onCheck} className="PollEventOption">
      <Checkbox checked={isChecked} className="pollCheckbox" />
      <span className="optionText">{option.text}</span>
    </div>
  );
};

export default PollEventOption;
