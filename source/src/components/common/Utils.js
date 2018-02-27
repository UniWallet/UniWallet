import React, {Component} from 'react';

import {
    View,
    StyleSheet,
    Text,
    StatusBar
} from 'react-native';
import Toast from './Toast';
import * as LoadingComponent from './Loading';
import * as UnlockComponent from './Unlock';
import * as JPushComponent from './JPushWidget';

import connectComponent from '../../redux/utils/connectComponent';


const Unlock = connectComponent(UnlockComponent);
const Loading = connectComponent(LoadingComponent);

const JPush = connectComponent(JPushComponent);

class Utils extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.toast.id !== nextProps.toast.id) {
            this.toast.show(nextProps.toast.text, nextProps.toast.timeout);
        }
    }

    componentDidMount() {
        const { actions, unlock } = this.props;
    }


    render() {
        const { actions, unlock } = this.props;
        return (
            <View style={styles.container}>
                <Loading/>
                <Unlock/>
                <Toast ref={ (view)=> this.toast=view }/>
                <JPush/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0
    }
});


export const WrappedComponent = Utils;
export function mapStateToProps(state) {
    const { utils = {} } = state;
    return {
        ...utils
    }
}
