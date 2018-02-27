import React, {Component} from "react";
import {StatusBar, StyleSheet, View, ListView, Image, TouchableOpacity,Dimensions} from 'react-native';
import getString from "../../translations";
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
    Text,
} from "native-base";
import * as etherutils from '../../libs/etherutils';
import MyHeader from "../common/MyHeader"
import Global from "../common/Global"
import {SwipeListView} from 'react-native-swipe-list-view'
import contact from "../../redux/reducers/contact";


const deviceHeight = Dimensions.get("window").height;
const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1.fullName !== r2.fullName
});

class Contact extends Component {
    // eslint-disable-line

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (!this.props.contact || !this.props.contact.contacts) {
            this.getContact()
        }
    }

    getContact() {
        const {actions} = this.props;
        actions.getContactFromStorage({
            resolved: () => {

            },
            rejected: () => {
                this.props.router.toCreateWallet();
            }
        });
    }

    _removeItem(rowData) {
        const {actions} = this.props;
        actions.removeContact({
            contact: rowData,
            resolved: () => {

            }
        });
    }

    _modifyItem(rowData) {
        this.props.navigation.navigate('NewContact', {...rowData})
    }

    _handleItemPress(rowData) {
        if (this.props.navigation && this.props.navigation.state.params && this.props.navigation.state.params.callback) {
            this.props.navigation.goBack();
            this.props.navigation.state.params.callback(rowData);
        }else {
            this._modifyItem(rowData)
        }
    }

    _delItem(rowData) {
        this._removeItem(rowData)
    }
    _delClick(data, secId, rowId, rowMap){
        this._delItem(data);
        rowMap[`${secId}${rowId}`].closeRow();

    }
    renderRow(rowData) {
        return (<ListItem
            style={styles.listItem}
            onPress={() => this._handleItemPress(rowData)}
        >
            <Card style={styles.card}>
                <CardItem style={styles.cardItem}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Image style={styles.image} source={Global.getImage("user_default")}/>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            marginLeft: 20,
                        }}
                        >
                            <Text style={styles.fullName}> {rowData.fullName ? rowData.fullName : "None"} </Text>
                            <Text style={styles.address} numberOfLines={1}
                                  ellipsizeMode='middle'> {etherutils.toChecksumAddress(rowData.address)} </Text>
                        </View>
                    </View>
                </CardItem>
            </Card>

        </ListItem>);
    }

    render() {
        contactSource = (this.props.contact && this.props.contact.contacts) ? this.props.contact.contacts : null;
        return (
            <Container style={{backgroundColor:"#F5F5F5"}} >
                <MyHeader rightImageName="header_add"
                          titleColor="white"
                          actionBarBgColor={Global.primaryColor}
                          statusBarBgColor={Global.primaryColor}
                          titleName={getString("contact")}
                          leftImageName='header_back_white'
                          rightOnPress={() => this.props.navigation.navigate('NewContact')}
                          {...this.props}
                />
                {contactSource != null&&contactSource.length>0 ? (
                    <SwipeListView
                        style={styles.list}
                        closeOnRowBeginSwipe = {true}
                        closeOnScroll = {true}
                        closeOnRowPress = {true}
                        dataSource={ds.cloneWithRows(contactSource)}
                        renderRow={this.renderRow.bind(this)}
                        renderHiddenRow={(data, secId, rowId, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity style={styles.backRightBtn} onPress={_ => this._delClick(data,secId,rowId,rowMap)}>
                                    <Text style={styles.backTextWhite}>{getString("delete")}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        rightOpenValue={-75}
                        disableRightSwipe={true}
                    />) : (<View style={{alignItems: "center"}}>
                    <Image source={Global.getImage("contact_img")} style={{height: 100, width: 140,marginTop:deviceHeight*0.3}}/>
                    <Text style={styles.hint}>{getString("hint_no_contacts")}</Text>
                </View>)}

            </Container>
        );

    }
}

const styles = StyleSheet.create({
    address: {
        color: "rgba(0,0,0,0.54)",
        fontSize: 14,
    },
    hint: {
        color: "rgba(0,0,0,0.54)",
        fontSize: 14,
        height: 100, width: 140, textAlign: "center", marginTop: 10
    },

    fullName: {
        color: "rgba(0,0,0,0.54)",
        textAlign: 'left',
        fontSize: 17,
    },
    list: {
        flex: 1,
        backgroundColor: "#EEEEEE",
    },

    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        backgroundColor: 'red',
        right: 0
    },
    listItem: {
        marginLeft: 0,
        marginBottom: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        borderBottomWidth: 0,
    },
    backTextWhite: {
        color: '#FFF'
    },
    card: {
        flex: 1,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 0,

    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#8BC645',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    cardItem: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    image: {
        width: 50,
        height: 50,
        overflow: "hidden",
        borderRadius: 50,
    },
});

export default Contact;
export const WrappedComponent = Contact;

export function mapStateToProps(state) {
    return {
        contact: state.contact,
    };
}