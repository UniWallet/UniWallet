import React, { Component } from "react";
import { View,   Image,Platform } from "react-native";

import {
  Container,
  Header,
  Title,
  Fab,
  Button,
  IconNB,
  Left,
  Right,
  Body,
  Icon
} from "native-base";

import styles from "./styles";

const fab_img = require("../img/ic_menu.png");

class BasicFab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }

  /*

   */
  render() {
    return (
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: "#4acbe1" }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}
          >
            <IconNB name="logo-whatsapp"/>
          </Fab>
    );
  }
}

export default BasicFab;
