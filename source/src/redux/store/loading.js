import { isFSA, createAction } from 'flux-standard-action';
import * as utilsActions from '../actions/utils';
import * as Log from "../../libs/Log"


export default ({ dispatch, getState }) => next => action => {
    if (!isFSA(action)) {
        return next(action);
    }

    //Log.log("loading middleware");
    const { meta={}, error, payload } = action;
    const { loading, sequence,} = meta;

    if (loading && (!sequence || sequence.type == 'start')) {
        dispatch(utilsActions.showLoading({title:loading}));
    }

    next(action);

    if (loading && (!sequence || sequence.type == 'next' || error)) {
        dispatch(utilsActions.hideLoading());
    }
}
