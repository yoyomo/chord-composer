import {BottomButton} from "./bottom-button";
import React from "react";
import {ClassAndChildren} from "../react-root";


interface VariationsButtonProps extends ClassAndChildren {
  showingVariations: boolean
  onShow: () => void
  onHide: () => void
}

export const VariationsButton = (props: VariationsButtonProps) => {
  return (
    <div>
      {props.showingVariations ?
        <BottomButton text={"Hide Variations"} onClick={props.onHide}/>
        :
        <BottomButton text={"Show Variations"} onClick={props.onShow}/>
      }
    </div>
  );
};
