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
    Title,
} from "native-base";
import MyHeader from "../common/MyHeader"
import Global from "../common/Global"
import getString from "../../translations/index";
import * as utils from '../../libs/utils';
import * as Log from "../../libs/Log"
import I18n, { getLanguages } from 'react-native-i18n';

class CoinUnit extends Component {
    constructor(props) {
        super(props);
        const { actions } = this.props;
        this.state = {selectItemPosition: 1}

        let exchange = utils.getExchangeFromCurrentLocale();
        if (this.props.setting && this.props.setting.exchange && this.props.setting.exchange != exchange) {
            exchange = this.props.setting.exchange;
        }

        if (exchange == Global.DEFAULT_CONCURRENCY) {
            this.state.selectItemPosition = 1;
        } else {
            this.state.selectItemPosition = 2;
        }
    }

    _onPress(position) {
        this.setState({selectItemPosition: position});
        const { actions } = this.props;

        exchange = Global.DEFAULT_CONCURRENCY;
        if (position == 1) {
            exchange = getString("cny");
        }
        if (position == 2) {
            exchange = getString("usd");
        }
        actions.updateSetting({
            exchange: exchange,
            resolved: (result) => {
            },
            rejected: () => {
            }
        })
    }

    _save(){
        this.props.navigation.goBack();
    }

    render() {
        Log.log("rendering ==== current setting: " + JSON.stringify(this.props.setting));
        return (<Container>
            <MyHeader headerColor="#ffffff"
                      titleColor='#000000'
                      iconColor='#000000'
                // rightIconName="menu"
                      titleName={getString("currency_unit")}
                      rightText={getString("save")}
                      rightOnPress={()=>this._save()}
                      {...this.props}
            />
            <View style={{flex: 1, backgroundColor: '#EEEEEE'}}>
                <View style={{backgroundColor: "#FFFFFF"}}>
                    <View style={{backgroundColor: "#EEEEEE", height: 10}}/>
                    <ListItem onPress={() => {
                        this._onPress(1)
                    }}>
                        <Body>
                        <Text style={styles.text}>{getString("cny")}</Text>
                        </Body>
                        {this.state.selectItemPosition == 1 ? (  <Right>
                            <Image source={Global.getImage("language_selected")} style={styles.image}/>
                        </Right>) : null}
                    </ListItem>
                    <ListItem onPress={() => {
                        this._onPress(2)
                    }}>
                        <Body>
                        <Text style={styles.text}>{getString("usd")}</Text>
                        </Body>
                        {this.state.selectItemPosition == 2 ? (  <Right>
                            <Image source={Global.getImage("language_selected")} style={styles.image}/>
                        </Right>) : null}
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
export default CoinUnit;

export const WrappedComponent = CoinUnit;
export function mapStateToProps(state) {
    return {
        setting: state.setting,
    }
}

