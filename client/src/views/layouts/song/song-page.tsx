import * as React from "react";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";
import {ChordAndLyricResource} from "../../../resources/song-resource";
import {Input} from "../../../components/input";
import {inputChangeDispatcher} from "../../../reducers/input-reducer";
import {addChordAndLyric} from "../../../reducers/song-page-reducer";

export function SongPage(dispatch: (action: Action) => void) {

  const dispatcher = {
    addChordAndLyric: () => dispatch(addChordAndLyric()),
  };

  return (state: State) => {
    return (
      <div className="w-100 h-100 flex flex-column overflow-hidden">
        {state.newSong ?
          <div>
            <div>
              Title: {state.newSong.title}
            </div>
            <div>
              Author: {state.newSong.author}
            </div>
            <div>
              Date: {state.newSong.created_at}
            </div>

            <div>
              Song
              {state.newSong.chordsAndLyrics && state.newSong.chordsAndLyrics.map((chordAndLyric, i )=> {
                return <div key={`chord-and-lyric-${i}`}>
                  <div>
                    {chordAndLyric.chord}
                  </div>
                  <div>
                    {chordAndLyric.lyric}
                  </div>
                </div>;
              })}
              <Input value={state.inputs.lyric} onChange={inputChangeDispatcher(dispatch, "lyric")}/>
              <div className={"bg-light-gray pa2 br2 w2 h2 tc pointer"} onClick={dispatcher.addChordAndLyric}>
                +
              </div>
            </div>
          </div>
          : <div/>
        }

      </div>
    );
  }
}