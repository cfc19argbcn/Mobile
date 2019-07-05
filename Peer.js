import React, { Component } from "react";
import _ from "lodash";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ListView
} from "react-native";
import MultipeerConnectivity from "react-native-multipeer";

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333"
  }
});

export default class Peer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };
  }

  getStateFromSources() {
    return {
      dataSource: this.state.dataSource.cloneWithRows(
        _.values(MultipeerConnectivity.getAllPeers())
      )
    };
  }

  getInitialState() {
    return getStateFromSources();
  }

  componentDidMount() {
    MultipeerConnectivity.on("peerFound", () => this._onChange());
    MultipeerConnectivity.on("peerLost", () => this._onChange());
    MultipeerConnectivity.on(
      "invite",
      (event => {
        // Automatically accept invitations
        MultipeerConnectivity.rsvp(event.invite.id, true);
      }).bind(this)
    );
    MultipeerConnectivity.on("peerConnected", event => {
      alert(event.peer.id + " connected!");
    });
    MultipeerConnectivity.advertise("channel1", {
      name: "User-2414"
    });
    MultipeerConnectivity.browse("channel1");
  }

  renderRow(peer) {
    return (
      <TouchableHighlight
        onPress={this.invite.bind(this, peer)}
        style={styles.row}
      >
        <View>
          <Text>{peer.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.peers}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
        {/* <Text>"pepepee"</Text> */}
      </View>
    );
  }

  _invite(peer) {
    MultipeerConnectivity.invite(peer.id);
  }

  _onChange() {
    this.setState(this.getStateFromSources());
  }
}
