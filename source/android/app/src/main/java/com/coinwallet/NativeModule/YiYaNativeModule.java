package com.coinwallet.NativeModule;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.web3j.crypto.WalletFile;
import org.web3j.crypto.WalletUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.web3j.protocol.ObjectMapperFactory;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.math.BigInteger;

import com.coinwallet.SystemUtils;

import android.util.Log;

import java.util.Map;
import java.util.HashMap;

import com.coinwallet.BuildConfig;

import com.baidu.mobstat.StatService; //baidu mtj

public class YiYaNativeModule extends ReactContextBaseJavaModule {
    boolean PRINT_REPORT = false;

    public YiYaNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);

        if (BuildConfig.DEBUG) { //if debug, start the baidu mtj debug
            PRINT_REPORT = true;
        }
    }

    @Override
    public String getName() {
        return "YiYaNativeAPI";
    }

    @ReactMethod
    public void generateV3KeyStore(String passwd, Promise promise) {
	    ThreadManager.runInBackground(new V3Runnable(passwd, promise));
    }

    @ReactMethod
    public void generateV3KeyStoreFromPriviateKey(String privateKey, String passwd, Promise promise) {
    	ThreadManager.runInBackground(new privateV3Runnable(privateKey, passwd, promise));
    }

    @ReactMethod
    public void decryptV3Keystore(String keystore, String passwd, Promise promise) {
    	ThreadManager.runInBackground(new decryptV3Runnable(keystore, passwd, promise));
    }

    @ReactMethod
    public void signTransaction(String nonce, String gasPrice, String gasLimit, String to, String value, String data, String chainId, String privateKey, Promise promise) {
    	ThreadManager.runInBackground(new signTransaction(nonce, gasPrice, gasLimit, to, value, data, chainId, privateKey, promise));
    }

    /* baidu mtj */
    @ReactMethod
    public void reportActiveClient(            String walletsnum,
                                               String address,
                                               String action,
                                               Promise promise) {
       Map<String, String> attributes = new HashMap<String, String>();
       attributes.put("uptime", ""+(System.currentTimeMillis() / 1000));
       attributes.put("walletsnum", ""+walletsnum);
       attributes.put("address", address);
       attributes.put("aid", SystemUtils.getAndroidID(getCurrentActivity()));
       attributes.put("action", ""+action);
       StatService.onEvent(getCurrentActivity(), "uw_active_client", "active_client", 1, attributes);
       if (PRINT_REPORT) {
            Log.d("report", "reportActiveClient walletsnum:"+ walletsnum + " address:"+ address + " action:"+ action);
       }
    }

    @ReactMethod
    public void reportNewWallet(            String duration,
                                            String state,
                                            String address,
                                               Promise promise) {
       Map<String, String> attributes = new HashMap<String, String>();
       attributes.put("duration", ""+duration);
       attributes.put("state", ""+state);
       attributes.put("address", address);
       StatService.onEvent(getCurrentActivity(), "uw_new_wallet", "new_wallet", 1, attributes);
       if (PRINT_REPORT) {
            Log.d("report", "reportNewWallet" + " duration:"+  duration +" state:" +state+ " address:" +address);
       }
    }

    @ReactMethod
    public void reportImportWallet(            String duration,
                                               String action,
                                               String path,
                                               String state,
                                               String address,
                                               Promise promise) {
       Map<String, String> attributes = new HashMap<String, String>();
       attributes.put("duration", ""+duration);
       attributes.put("action", ""+action);
       attributes.put("path", path);
       attributes.put("state", ""+state);
       attributes.put("address", address);
       StatService.onEvent(getCurrentActivity(), "uw_import_wallet", "import_wallet", 1, attributes);
       if (PRINT_REPORT) {
            Log.d("report", "reportImportWallet" +" duration:" +duration+ " action:"+ action +" path:"+ path +" state:" +state +" address:"+ address );
       }
    }

    @ReactMethod
    public void reportSendCoin(                String state,
                                               String gaslimit,
                                               String gasprice,
                                               String advanceopt,
                                               String from,
                                               String to,
                                               String value,
                                               String coinname,
                                               Promise promise) {
       Map<String, String> attributes = new HashMap<String, String>();
       attributes.put("state", ""+state);
       attributes.put("coinname", coinname);
       attributes.put("transfer_detail", "limit:"+gaslimit+"price:"+gasprice+"advance:"+advanceopt+"from:"+from);
       attributes.put("value", ""+value);
       attributes.put("to", to);
       StatService.onEvent(getCurrentActivity(), "uw_send_coin", "send_coin", 1, attributes);
       if (PRINT_REPORT) {
            Log.d("report", "reportSendCoin"+ " state:" +state +" gaslimit:"+ gaslimit +" gasprice:" +gasprice+ " advanceopt:" +advanceopt+ " from:"+ from +" to:"+ to +" value:" +value+ " coinname:" +coinname);
       }
    }

    @ReactMethod
    public void reportReceiveCoin(            String from,
                                              String to,
                                              String value,
                                              String coinname,
                                               Promise promise) {
       Map<String, String> attributes = new HashMap<String, String>();
       attributes.put("from", from);
       attributes.put("to", to);
       attributes.put("value", ""+value);
       attributes.put("coinname", coinname);
       StatService.onEvent(getCurrentActivity(), "uw_receive_coin", "receive_coin", 1, attributes);
       if (PRINT_REPORT) {
            Log.d("report", "reportReceiveCoin"+ " from:" +from +" to:"+ to +" value:" +value+ " coinname:"+ coinname);
       }
    }

    @ReactMethod
    public void reportModCoin(            String coinname,
                                          String action,
                                               Promise promise) {
        Map<String, String> attributes = new HashMap<String, String>();
        attributes.put("coinname", coinname);
        attributes.put("action", ""+action);
        StatService.onEvent(getCurrentActivity(), "uw_mod_coin", "mod_coin", 1, attributes);
       if (PRINT_REPORT) {
            Log.d("report", "reportModCoin" +" coinname:" +coinname +" action:"+ action);
       }
    }
}

class V3Runnable implements Runnable {
	final String passwd;
	final Promise promise;

	public V3Runnable(String pa, Promise pr) {
		passwd = pa;
		promise = pr;
	}

	@Override
		public void run() {
			try {
				WalletFile wf = MyWalletUtils.generateWallet(passwd);
				String fileName = MyWalletUtils.getWalletFileName(wf);

				ObjectMapper objectMapper = ObjectMapperFactory.getObjectMapper();
				String jsonstr = objectMapper.writeValueAsString(wf);

				WritableMap wm = Arguments.createMap();
				wm.putString("address", wf.getAddress());
				wm.putString("json", jsonstr);
				promise.resolve(wm);
			} catch(Exception e) {
				//TODO
				promise.reject(e);
			}
		}
}

class privateV3Runnable implements Runnable {
    final String privateKey;
	final String passwd;
	final Promise promise;

	public privateV3Runnable(String pk, String pa, Promise pr) {
	    privateKey = pk;
		passwd = pa;
		promise = pr;
	}

	@Override
		public void run() {
			try {
				WalletFile wf = MyWalletUtils.generatePrivateWallet(privateKey, passwd);
				String fileName = MyWalletUtils.getWalletFileName(wf);

				ObjectMapper objectMapper = ObjectMapperFactory.getObjectMapper();
				String jsonstr = objectMapper.writeValueAsString(wf);

				WritableMap wm = Arguments.createMap();
				wm.putString("address", wf.getAddress());
				wm.putString("json", jsonstr);
				promise.resolve(wm);
			} catch(Exception e) {
				//TODO
				promise.reject(e);
			}
		}
}

class decryptV3Runnable implements Runnable {
    final String keystore;
	final String passwd;
	final Promise promise;

	public decryptV3Runnable(String ke, String pa, Promise pr) {
	    keystore = ke;
		passwd = pa;
		promise = pr;
	}

	@Override
		public void run() {
			try {
			    ObjectMapper objectMapper = ObjectMapperFactory.getObjectMapper();
			    WalletFile walletFile = objectMapper.readValue(keystore, WalletFile.class);

				String privateKey = MyWalletUtils.decryptKeyStore(passwd, walletFile);
				WritableMap wm = Arguments.createMap();
				wm.putString("privatekey", "0x"+privateKey);
				wm.putString("address", walletFile.getAddress());
				promise.resolve(wm);
			} catch(Exception e) {
				//TODO
				promise.reject(e);
			}
		}
}

class signTransaction implements Runnable {
	final BigInteger nonce;
	final BigInteger gasPrice;
	final BigInteger gasLimit;
	final String to;
	final BigInteger value;
	final String data;
	final byte chainId;
	final String privateKey;
	final Promise promise;

	public signTransaction(String ne, String ge, String gt, String t, String v, String d, String cd, String py, Promise pr) {
	    nonce = new BigInteger(ne);
	    gasPrice = new BigInteger(ge);
	    gasLimit = new BigInteger(gt);
	    to = t;
	    value = new BigInteger(v);
	    data = d;
	    chainId = Byte.valueOf(cd);
	    privateKey = py;
		promise = pr;
	}

	@Override
		public void run() {
			try {
			    ObjectMapper objectMapper = ObjectMapperFactory.getObjectMapper();
				String signeddata = MyWalletUtils.signTransaction(nonce, gasPrice, gasLimit, to, value, data, chainId, privateKey);
				WritableMap wm = Arguments.createMap();
				wm.putString("rawTransaction", signeddata);
				promise.resolve(wm);
			} catch(Exception e) {
				//TODO
				promise.reject(e);
			}
		}
}

