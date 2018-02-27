import React, {Component} from "react";
import {
    Image,
} from 'react-native';
import {StatusBar, StyleSheet, View} from 'react-native';
import Global from "../common/Global"

import * as etherutils from '../../libs/etherutils';
import {
    Container,
    Content,
    Header,
    Title,
    Button,
    Icon,
    Right,
    Left,
    List,
    ListItem,
    Card,
    CardItem,
    Separator,
    Body,
    Input,
    Form,
    Item,
    Text,
} from "native-base";
import MyHeader from "../common/MyHeader"
import getString from "../../translations";
import * as Validation from "../../libs/validation"

const datas = [
    {
        name: "Ether",
        address: "0x000fdsfds000fdss",
    },
    {
        name: "BitCoin",
        address: "0x120fdsfds000fdss",
    },
    {
        name: "LiteCoin",
        address: "0x340fdsfds000fdss",
    }
];

class Contact extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        if (params != null) {
            this.state = {
                ...params,
            };
            this.isEdit = true;
            this.oldContact = params;
        } else {
            this.state = {};
            this.isEdit = false;
        }
    }

    _getContactData() {
        return {
            firstName:this.state.firstName,
            lastName:this.state.lastName,
            fullName:(this.state.firstName +" "+this.state.lastName),
            address:this.state.address,
            phone:this.state.phone,
            email:this.state.email,
            remark:this.state.remark,
        }
    }

    _onPress() {
        const { actions } = this.props;
        contact = this._getContactData();
        if (!contact.firstName || contact.firstName === '') {
            actions.toast(getString("hint_name_can_not_be_empty"));
            return;
        }
        if (!contact.lastName || contact.lastName === '') {
            actions.toast(getString("hint_surname_can_not_be_empty"));
            return;
        }
        if (!Validation.checkAddress(contact.address)) {
            actions.toast(getString("invalid_address"));
            return;
        }
        if (contact.phone && !Validation.checkPhone(contact.phone)) {
            actions.toast(getString("invalid_phone"));
            return;
        }
        if (contact.email && !Validation.checkEmail(contact.email)) {
            actions.toast(getString("invalid_email"));
            return;
        }
        if (this.isEdit) {
            actions.editContact({
                contact: {
                    ...this.oldContact,
                },
                newContact: {
                    ...contact,
                },
                resolved: () => {
                    actions.toast(getString("contact_changed"));
                    // this.props.navigation.navigate('Contact', {update:true})
                    this.props.navigation.goBack()
                }
            });
        } else {
            actions.createContact({
                contact: {
                    ...contact,
                },
                resolved: () => {
                    actions.toast(getString("contact_created"));
                    // this.props.navigation.navigate('Contact', {update:true})
                    this.props.navigation.goBack()
                }
            });
        }
    }

    _handleScanResult(code, result) {
        if (result && result.data) {
            var fields = etherutils.getFieldsFromIBANString(result.data);
            try {
                data =  etherutils.getAddressFromIBAN(fields.address)
                this.setState({address: data.toLowerCase()});
            }catch (e){
                Log.log("scan error: " + e)
            }
        }
    }

    _doScan() {
        this.props.navigation.navigate("QRReader", {
            code:0,
            callback:this._handleScanResult.bind(this),
        });
    }

    render() {
        return (
            <Container>
                <MyHeader rightText={this.isEdit?getString("change"):getString("create")}
                          titleName={getString("contact")}
                          {...this.props}
                          rightOnPress = {this._onPress.bind(this)}
                />
                <Content style={{
                    backgroundColor:'white',
                }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 32,
                            marginLeft: 25,
                        }}
                    >
                        <Image  style={styles.image}  source={Global.getImage("user_default")}/>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            marginLeft: 10,
                        }}
                        >
                            <Form style={{marginLeft: 5, marginRight: 15}}>
                                <Item>
                                    <Input placeholder={getString("name")}  placeholderTextColor="#D6D5D5"
                                           style={styles.input}
                                           onChangeText={(firstName) => this.setState({firstName})}
                                           value={this.state.firstName}/>
                                </Item>
                            </Form>
                            <Form style={{marginLeft: 5, marginRight: 15}}>
                                <Item>
                                    <Input placeholder={getString("surname")} placeholderTextColor="#D6D5D5"
                                           style={styles.input}
                                           onChangeText={(lastName) => this.setState({lastName})}
                                           value={this.state.lastName}/>
                                </Item>
                            </Form>
                        </View>
                    </View>
                    <Form style={styles.addressform}>
                        <Item>
                            <Input placeholder={getString("wallet_address")}  placeholderTextColor="#D6D5D5"
                                   style={styles.input}
                                   onChangeText={(address) => this.setState({address})}
                                   value={this.state.address}/>
                            <Button style={{paddingLeft:0, marginLeft:0, marginBottom:0}} iconLeft transparent onPress={this._doScan.bind(this)}>
                                <Image source={Global.getImage("scan")} style={{width:24, height:24, marginRight:5}}/>
                            </Button>
                        </Item>
                    </Form>
                    <Form style={styles.form}>
                        <Item>
                            <Input placeholder={getString("phone_number")} placeholderTextColor="#D6D5D5"
                                   style={styles.input}
                                   onChangeText={(phone) => this.setState({phone})}
                                   value={this.state.phone}/>
                        </Item>
                    </Form>
                    <Form style={styles.form}>
                        <Item>
                            <Input placeholder={getString("email")} placeholderTextColor="#D6D5D5"
                                   style={styles.input}
                                   onChangeText={(email) => this.setState({email})}
                                   value={this.state.email}/>
                        </Item>
                    </Form>
                    <Form style={styles.form}>
                        <Item>
                            <Input placeholder={getString("extra")} placeholderTextColor="#D6D5D5"
                                   style={styles.input}
                                   onChangeText={(remark) => this.setState({remark})}
                                   value={this.state.remark}/>
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    addressform: {
        marginLeft: 5,
        marginRight: 15,
        marginTop:30
    },
    form: {
        marginLeft: 5,
        marginRight: 15,
        marginTop:10
    },
    input: {
        color: Global.primaryContentColor,
        fontSize:16
    },
    image: {
        width: 80,
        height:80,
        overflow:"hidden",
        borderRadius:50,
    },
});

export default Contact;
export const WrappedComponent = Contact;