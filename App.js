import React from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';


class Chord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: true,
      chordName: props.chordName
    };
  }

  selectChordBaseNote = () => {
    this.setState(previousState => {
      return {playing: !previousState.playing};
    });

    console.log("paying",this.state.chordName);
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    var context = new AudioContext()
    var o = context.createOscillator()
    o.type = "sine"
    o.connect(context.destination)
    o.start()
  };

  render() {
    return (
      <View style={styles.chordBaseNote}>
        <Button type="solid" title={this.state.chordName} onPress={this.selectChordBaseNote} color={styles.chordBaseNote.color}/>
      </View>
    );
  }
}

export default class ChordComposer extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Chord chordName='A'/>
        <Chord chordName='Cmaj7'/>
        <Chord chordName='Dm7'/>
        <Chord chordName='G6'/>
        <Chord chordName='G7'/>
        <Chord chordName='Gadd9'/>
        <Chord chordName='C#maj7'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  chordBaseNote: {
    flex: 1,
    backgroundColor: '#b2052d',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
});
