import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as tokenService from '../../services/token';
import * as storage from '../../services/storage';
import * as Log from "../../libs/Log"

export const syncTokenInfo = createAction(types.TOKEN_SYNC, tokenService.getTokenList, ({resolved, rejected})=> {
    return {
        sync: 'token',
        resolved,
        rejected
    }
});

export const getTokenListFromStorage = createAction(types.GET_TOKEN_LIST_FROM_STORAGE, ()=> {
    return storage.getItem('token')
      .then(data=> {
          if (!data) {
              Log.log("no token list data")
              throw new Error("no token list data");
          }
          return {...data, loaddedFromStorage:true};
      });
}, ({resolved, rejected, loading})=> {
    return {
        sync: 'token',
        loading,
        resolved,
        rejected
    }
});