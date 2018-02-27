import React, {Component} from "react";
import {StatusBar, View, StyleSheet, Image} from 'react-native';
import getString from "../../translations/index";
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

class Language extends Component{
    constructor(props){
        super(props);
        this.state ={
            selectItemPosition: 1,
        }
    }

    _onPress(position){
        this.setState({selectItemPosition:position});
    }

    _save(){
        this.props.navigation.goBack()
    }

    render(){
        return (<Container>
            <MyHeader headerColor="#ffffff"
                      titleColor='#000000'
                      iconColor='#000000'
                // rightIconName="menu"
                      titleName={getString("multilingual")}
                      rightText={getString("save")}
                      rightOnPress={()=>this._save()}
                      {...this.props}
            />
            <View style={{flex: 1, backgroundColor: '#EEEEEE'}}>
                <View style={{backgroundColor: "#FFFFFF"}}>
                    <View style={{backgroundColor: "#EEEEEE", height: 10}}/>
                    <ListItem onPress={()=>this._onPress(1)}>
                        <Body>
                        <Text style={styles.text}>{getString("cn")}</Text>
                        </Body>
                        {this.state.selectItemPosition==1?( <Right>
                            <Image source={Global.getImage("language_selected")} style={styles.image}/>
                        </Right>):null}
                    </ListItem>
                    <ListItem onPress={()=>this._onPress(2)}>
                        <Body>
                        <Text style={styles.text}>{getString("en")}</Text>
                        </Body>
                        {this.state.selectItemPosition==2?( <Right>
                            <Image source={Global.getImage("language_selected")} style={styles.image}/>
                        </Right>):null}
                    </ListItem>
                </View>
            </View>
        </Container>)
    }

}

const styles = StyleSheet.create({
    text: {
        fontSize: 17,
        color:Global.primaryContentColor,
    },
    image: {
        width:18,
        height:18,
    },
});

export default Language;