import React from "react";
import {ClassAndChildren} from "../App";

interface BottomButtonProps extends ClassAndChildren {
  text: string
  onClick: () => void
}

export const BottomButton = (props: BottomButtonProps) => {
  return <div className={"fixed w-100 white bg-light-blue bottom-0 pointer h3"}
              onClick={props.onClick}>
    {props.text}
  </div>
};