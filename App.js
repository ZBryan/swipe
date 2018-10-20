import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Deck from "./src/Deck";
import { data } from "./assets/data";
import { Card, Button } from "react-native-elements";

export default class App extends React.Component {
  renderCard(card) {
    return (
      <Card key={card.id} title={card.text} image={{ uri: card.uri }}>
        <Text style={{ marginBottom: 10 }}>I can customize the card</Text>
        <Button
          icon={{ name: "code" }}
          backgroundColor="#0319f4"
          title="view now"
        />
      </Card>
    );
  }

  renderNoMoreCards = () => {
    return (
      <Card title="All Done">
        <Text style={{ marginBottom: 10 }}>There are no more cards</Text>
        <Button backgroundColor="#03a9f4" title="get some more" />
      </Card>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Deck
          data={data}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 15
    // alignItems: "center"
    // justifyContent: "center"
  }
});
