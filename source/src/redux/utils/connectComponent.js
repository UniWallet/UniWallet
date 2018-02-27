import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../actions/index';


const options = {
	withRef: true
};


export default function connectComponent({ mapStateToProps, mapDispatchToProps, mergeProps, WrappedComponent }) {
	return connect(
		mapStateToProps || function (state) {
			return {};
		},
		mapDispatchToProps || function (dispatch) {
			return {
				actions: bindActionCreators(actions, dispatch)
			}
		},
		mergeProps,
		options
	)(WrappedComponent);
}
