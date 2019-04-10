import React from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';


class Blink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isShowingText: true};
  }

  selectChordBaseNote = () => {
    this.setState(previousState => {
      return {isShowingText: !previousState.isShowingText};
    });
  };

  render() {
    let display = this.state.isShowingText ? this.props.text : ' ';
    return (
      <Button type="solid" title={display} onPress={this.selectChordBaseNote}>
        <Text >{display}</Text>
      </Button>
    );
  }
}

export default class ChordComposer extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Blink text='I love to blink'/>
        <Blink text='Yes blinking is so great'/>
        <Blink text='Why did they ever take this out of HTML'/>
        <Blink text='Look at me look at me look at me'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chordBaseNote: {
    flex: 1,
    backgroundColor: '#a01355',
    color: '#fff',
    display: 'flex',
  },
});
