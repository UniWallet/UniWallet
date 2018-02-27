package com.coinwallet.NativeModule;

import org.web3j.crypto.CipherException;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Wallet;
import org.web3j.crypto.WalletFile;
import org.web3j.crypto.WalletUtils;
import org.web3j.protocol.ObjectMapperFactory;

import org.web3j.protocol.*;
import org.web3j.crypto.*;
import org.web3j.protocol.core.methods.request.RawTransaction;
import org.web3j.tx.ChainId;

import org.web3j.utils.Numeric;

import java.io.File;
import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;

/*
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
*/

import java.math.BigInteger;

public class MyWalletUtils {
	public static WalletFile generateWallet(String password) throws CipherException, IOException, InvalidAlgorithmParameterException,
        NoSuchAlgorithmException, NoSuchProviderException {
		WalletFile walletFile;
		ECKeyPair ecKeyPair = Keys.createEcKeyPair();
		/*
		   according n value:
		   1) 65536 - imtoken
		   2) 1024 - myetherwallet
		   3) 262144 - geth
		*/
		walletFile = Wallet.create(password, ecKeyPair, 65536, 1);
		return walletFile;
	}

	public static String getWalletFileName(WalletFile walletFile) {
		/* //used by sdk > 25
		DateTimeFormatter format = DateTimeFormatter.ofPattern(
				"'UTC--'yyyy-MM-dd'T'HH-mm-ss.nVV'--'");
		ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC);

		return now.format(format) + walletFile.getAddress() + ".json";
		*/
		return walletFile.getAddress();
	}

	public static WalletFile generatePrivateWallet(String privateKey, String password)  throws CipherException, IOException, InvalidAlgorithmParameterException,
        NoSuchAlgorithmException, NoSuchProviderException {
        WalletFile walletFile;
        if (privateKey.startsWith("0x")) {
                privateKey = privateKey.substring(2);
        }
        ECKeyPair ecKeyPair = ECKeyPair.create(new BigInteger(privateKey, 16));
        		/*
        		   according n value:
        		   1) 65536 - imtoken
        		   2) 1024 - myetherwallet
        		   3) 262144 - geth
        		*/
        walletFile = Wallet.create(password, ecKeyPair, 65536, 1);
        return walletFile;
	}

	public static String decryptKeyStore(String password, WalletFile wallet) throws CipherException {
	    ECKeyPair ecKeyPair = Wallet.decrypt(password, wallet);
	    return ecKeyPair.getPrivateKey().toString(16);
	}

	public static String signTransaction(BigInteger nonce, BigInteger gasPrice, BigInteger gasLimit, String to,
                                                     BigInteger value, String data, byte chainId, String privateKey) throws IOException {
        byte[] signedMessage;
        RawTransaction rawTransaction = RawTransaction.createTransaction(
                        nonce,
                        gasPrice,
                        gasLimit,
                        to,
                        value,
                        data);

        if (privateKey.startsWith("0x")) {
            privateKey = privateKey.substring(2);
        }
        ECKeyPair ecKeyPair = ECKeyPair.create(new BigInteger(privateKey, 16));
        Credentials credentials = Credentials.create(ecKeyPair);

        if (chainId > ChainId.NONE) {
            signedMessage = TransactionEncoder.signMessage(rawTransaction, chainId, credentials);
        } else {
            signedMessage = TransactionEncoder.signMessage(rawTransaction, credentials);
        }

        String hexValue = Numeric.toHexString(signedMessage);

        return hexValue;
	}
}
