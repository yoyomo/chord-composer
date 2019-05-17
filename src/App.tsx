import React from 'react';
import './App.css';

export interface ClassAndChildren {
  className?: string, children?: React.ReactNode
}

interface ChordProps extends ClassAndChildren{
  name: string,
  noteValues: number[],
}

const Chord = (props: ChordProps) => {
  return <div className={"bg-red w-100px h-100px tc white"}>{props.name}</div>;
};

const App: React.FC = () => {
  return (
    <div className={"flex flex-row"}>
      <Chord name={"A"} noteValues={[400]}/>
      <Chord name={"Bm7"} noteValues={[400]}/>
      <Chord name={"C#maj7"} noteValues={[400]}/>

    </div>
  );
};

export default App;
