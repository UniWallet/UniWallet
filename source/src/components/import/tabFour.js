import React, { Component } from "react";

import { Container, Content, Card, CardItem, Text, Body } from "native-base";

export default class TabFour extends Component {
  // eslint-disable-line

  render() {
    // eslint-disable-line
    return (
      <Content keyboardShouldPersistTaps='always' padder style={{ marginTop: 0 }}>
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Body>
              <Text>
                Customize and build beautiful apps with complex interfaces using
                NativeBase as the building block.
              </Text>
            </Body>
          </CardItem>
        </Card>
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Body>
              <Text>
                NativeBase lets you experience the awesomeness of React Native
                without the pain.
              </Text>
            </Body>
          </CardItem>
        </Card>
      </Content>
    );
  }
}
