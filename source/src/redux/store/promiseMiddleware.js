import { isFSA } from 'flux-standard-action';
import _ from 'lodash';
import {Error, errors} from '../../libs/Error';
import getString from "../../translations";
import * as Log from "../../libs/Log"

function isPromise(val) {
	return val && typeof val.then === 'function';
}

export default function promiseMiddleware({ dispatch, getState}) {
	return next => action => {
		if (!isFSA(action)) {
			return isPromise(action)
				? action.then(dispatch)
				: next(action);
		}
		const { meta = {}, payload } = action;

		if (isPromise(payload)) {
			dispatch({
				...action,
				payload: undefined,
				meta: {
					...meta,
					sequence: {
						type: 'start',
						id: _.uniqueId()
					}
				}
			});
            const {wallet} = getState();
			return payload.then(
              function (result) {
				  /* import wallet - double check the same wallet is existed or not.
				   */
				  let error = null;
				  if (action.type === "IMPORT_WALLET") {
				  		if (result && result.address && wallet && wallet.wallets) {
                            let address = result.address;
                            let wallets = wallet.wallets;
                            /* all saved address should be appended by 0x */
                            if (address.indexOf("0x") != 0) {
                                address = "0x" + address;
                            }
                            if (wallets[address]) {
                            	error = getString("error_import_wallet_with_same_address");
							}
                        }
				  }

				  if (error) {
                      dispatch({
                          ...action,
                          payload: error,
                          error: true,
                          meta: {
                              ...meta,
                              sequence: {
                                  type: 'next',
                                  id: _.uniqueId()
                              }
                          }
                      });
				  } else {
                      dispatch({
                          ...action,
                          payload: result,
                          meta: {
                              ...meta,
                              sequence: {
                                  type: 'next',
                                  id: _.uniqueId()
                              }
                          }
                      });
                  }
              },
			  error => dispatch({
					...action,
					payload: error,
					error: true,
					meta: {
						...meta,
						sequence: {
							type: 'next',
							id: _.uniqueId()
						}
					}
				})
			);
		}

		return next(action);
	};
}
