import React, {Component} from "react";
import {StatusBar, View, StyleSheet, Image} from 'react-native';
import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Header,
    Icon,
    Left,
    List,
    ListItem,
    Right,
    Separator,
    Text,
    Form, Item, Input,
    Title,
} from "native-base";
import MyHeader from "../common/MyHeader"
import Global from "../common/Global"
import getString from "../../translations/index";
import * as utils from '../../libs/utils';
import * as Log from "../../libs/Log"
import I18n, { getLanguages } from 'react-native-i18n';

class Test extends Component {
    constructor(props) {
        super(props);
        const { actions } = this.props;
    }

    _testMessagePressed() {
        this.props.navigation.navigate("MessageTest");
    }

    _save(){
        this.props.navigation.goBack();
    }

    render() {
        return (<Container>
            <MyHeader headerColor="#ffffff"
                      titleColor='#000000'
                      iconColor='#000000'
                      titleName={getString("test_center")}
                      {...this.props}
            />
            <View style={{flex: 1, backgroundColor: '#EEEEEE'}}>
                <View style={{backgroundColor: "#FFFFFF"}}>
                    <View style={{backgroundColor: "#EEEEEE", height: 10}}/>
                    <ListItem onPress={() => {
                        this._testMessagePressed();
                    }}>
                        <Body>
                        <Text style={styles.text}>{getString("test_message")}</Text>
                        </Body>
                        <Right>
                            <Image source={Global.getImage("arrow_right")} style={styles.image}/>
                        </Right>
                    </ListItem>
                </View>
            </View>
        </Container>)
    }

}

const styles = StyleSheet.create({
    text: {
        fontSize: 17,
        color: Global.primaryContentColor,
    },
    image: {
        width: 18,
        height: 18,
    },
});
export default Test;

export const WrappedComponent = Test;
export function mapStateToProps(state) {
    return {
        setting: state.setting,
    }
}