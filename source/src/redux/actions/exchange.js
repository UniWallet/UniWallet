import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as exchangeService from '../../services/exchange';
import * as storage from '../../services/storage';
import * as Log from "../../libs/Log"

export const syncExchangeRate = createAction(types.EXCHANGE_RATE_SYNC, exchangeService.getExchangeRateList, ({resolved, rejected})=> {
    return {
        sync: 'exchange',
        resolved,
        rejected
    }
});

export const getExchangeRateFromStorage = createAction(types.GET_EXCHANGE_RATE_FROM_STORAGE, ()=> {
    return storage.getItem('exchange')
      .then(data=> {
          if (!data) {
              Log.log("no exchange data")
              data = {};
          }
          return {...data, loaddedFromStorage:true};
      });
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected
    }
});