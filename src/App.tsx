import React from 'react';
import {initialState, State} from "./state";
import {hideVariations, selectChordType, selectKey, showVariations} from "./reducers/root-page-reducer";
import {KEYS, NoteKey} from "./components/note-key";
import {ChordElement} from "./components/chord";
import {BottomButton} from "./components/bottom-button";

export interface ClassAndChildren {
  className?: string,
  children?: React.ReactNode
}

export class ReactRoot extends React.Component<{}, typeof initialState> {

  constructor(props: ClassAndChildren) {
    super(props);
    this.state = {...initialState};
  }

  dispatch = (newState: State) => {
    this.setState(newState);
  };

  render() {
    let state = {...this.state};
    return (
        <div className={"w-100 h-100"}>
          <div className={"overflow-auto"}>
            {state.selectedKeyIndex == null ?
                KEYS.map((key, i) => {
                  return <NoteKey baseKey={key} keyIndex={i}
                                  selectKey={(keyIndex) => this.dispatch(selectKey(state, keyIndex))}/>
                })
                :
                state.chordGrid.map((chord, i) => {
                  return <ChordElement chord={chord}
                                       notes={state.notes}
                                       audioContext={state.audioContext}
                                       selectChordType={() => this.dispatch(selectChordType(state, i))}
                  />
                })
            }
          </div>

          <div>
            {state.selectedChordTypeIndex !== null ?
                state.showingVariations ?
                    <BottomButton text={"Hide Variations"} onClick={() => this.dispatch(hideVariations(state))}/>
                    :
                    <BottomButton text={"Show Variations"} onClick={() => this.dispatch(showVariations(state))}/>
                :
                null
            }
          </div>

        </div>
    );
  }
}

