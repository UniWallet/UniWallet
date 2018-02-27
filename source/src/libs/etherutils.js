import {web3} from "./web3"
import * as Log from "./Log"
import { default as web3Utils } from 'web3-utils';
import * as utils from "./utils"

export function decryptKeyStore(input, pwd) {
    return web3.eth.accounts.decrypt(input, pwd);
}

export function encryptPrivateKey(input, pwd) {
    return web3.eth.accounts.encrypt(input, pwd);
}

export function signTransaction(txData, privateKey) {
    return web3.eth.accounts.signTransaction(txData, privateKey);
}

export function getNonce(address) {
    return web3.eth.getTransactionCount(address);
}

export function getId() {
    return web3.eth.net.getId();
}

export function getIBANCode(address) {
    return web3.eth.Iban.toIban(address);
}

export function getFieldsFromIBANString(ibanAddress) {
    Log.log("result: " + JSON.stringify(ibanAddress))
    var array = ibanAddress.split("?");
    Log.log("array: " + JSON.stringify(array) + " size: " + array.size)
    var address="";
    var amount="";
    var token="";
    try {
        if (array && array.length > 0) {
            var start = array[0].indexOf(":");
            address = array[0].substr(start + 1);
        }

        if (array && array.length > 1) {
            var otherarray = array[1].split("&");
            Log.log("otherarray: " + JSON.stringify(otherarray))
            if (otherarray && otherarray.length > 1) {
                var start = otherarray[0].indexOf("=");
                amount = otherarray[0].substr(start+1);
                start = otherarray[1].indexOf("=");
                token = otherarray[1].substr(start+1);
                Log.log("amount: " + amount + " token: " + token)
            }
        }
    } catch (e) {
        Log.log("iban parsing error: " + e)
    }

    return {
        address: address,
        amount: amount,
        token: token
    }
}

export function getAddressFromIBAN(address) {
    return web3.eth.Iban.toAddress(address);
}

/* token related */
https://github.com/danfinlay/human-standard-token-abi/blob/master/index.js
exports.ERC20_abi = [
      {
          "constant": true,
          "inputs": [],
          "name": "name",
          "outputs": [
              {
                  "name": "",
                  "type": "string"
              }
          ],
          "payable": false,
          "type": "function"
      },
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_spender",
                  "type": "address"
              },
              {
                  "name": "_value",
                  "type": "uint256"
              }
          ],
          "name": "approve",
          "outputs": [
              {
                  "name": "success",
                  "type": "bool"
              }
          ],
          "payable": false,
          "type": "function"
      },
      {
          "constant": true,
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "type": "function"
      },
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_from",
                  "type": "address"
              },
              {
                  "name": "_to",
                  "type": "address"
              },
              {
                  "name": "_value",
                  "type": "uint256"
              }
          ],
          "name": "transferFrom",
          "outputs": [
              {
                  "name": "success",
                  "type": "bool"
              }
          ],
          "payable": false,
          "type": "function"
      },
      {
          "constant": true,
          "inputs": [],
          "name": "decimals",
          "outputs": [
              {
                  "name": "",
                  "type": "uint8"
              }
          ],
          "payable": false,
          "type": "function"
      },
      {
          "constant": true,
          "inputs": [],
          "name": "version",
          "outputs": [
              {
                  "name": "",
                  "type": "string"
              }
          ],
          "payable": false,
          "type": "function"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_owner",
                  "type": "address"
              }
          ],
          "name": "balanceOf",
          "outputs": [
              {
                  "name": "balance",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "type": "function"
      },
      {
          "constant": true,
          "inputs": [],
          "name": "symbol",
          "outputs": [
              {
                  "name": "",
                  "type": "string"
              }
          ],
          "payable": false,
          "type": "function"
      },
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_to",
                  "type": "address"
              },
              {
                  "name": "_value",
                  "type": "uint256"
              }
          ],
          "name": "transfer",
          "outputs": [
              {
                  "name": "success",
                  "type": "bool"
              }
          ],
          "payable": false,
          "type": "function"
      },
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_spender",
                  "type": "address"
              },
              {
                  "name": "_value",
                  "type": "uint256"
              },
              {
                  "name": "_extraData",
                  "type": "bytes"
              }
          ],
          "name": "approveAndCall",
          "outputs": [
              {
                  "name": "success",
                  "type": "bool"
              }
          ],
          "payable": false,
          "type": "function"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_owner",
                  "type": "address"
              },
              {
                  "name": "_spender",
                  "type": "address"
              }
          ],
          "name": "allowance",
          "outputs": [
              {
                  "name": "remaining",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "type": "function"
      },
      {
          "inputs": [
              {
                  "name": "_initialAmount",
                  "type": "uint256"
              },
              {
                  "name": "_tokenName",
                  "type": "string"
              },
              {
                  "name": "_decimalUnits",
                  "type": "uint8"
              },
              {
                  "name": "_tokenSymbol",
                  "type": "string"
              }
          ],
          "type": "constructor"
      },
      {
          "payable": false,
          "type": "fallback"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "name": "_from",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "name": "_to",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "name": "_value",
                  "type": "uint256"
              }
          ],
          "name": "Transfer",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "name": "_owner",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "name": "_spender",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "name": "_value",
                  "type": "uint256"
              }
          ],
          "name": "Approval",
          "type": "event"
      },
  ];

export function getTokenTransferABI(token_address, to_address, value, address) {
    var contact = new web3.eth.Contract(this.ERC20_abi, token_address, {from: address});
    return contact.methods.transfer(to_address, value).encodeABI();
}

var ethabi = require('ethereumjs-abi')
export function decodeInput(data = ``) {
    if (typeof data !== `string`) {
        data = ``;
    }

    const dataBuf = new Buffer(data.replace(/^0x/, ``), `hex`);
    const methodId = dataBuf.slice(0, 4).toString(`hex`);
    const inputsBuf = dataBuf.slice(4);

    const result = this.ERC20_abi.reduce((acc, obj) => {
        const name = obj.name;
        const types = obj.inputs ? obj.inputs.map(x => x.type) : [];
        const names = obj.inputs ? obj.inputs.map(x => x.name) : [];
        const hash = ethabi.methodID(name, types).toString(`hex`);

        if (hash === methodId) {
            const inputs = ethabi.rawDecode(types, inputsBuf, []);

            return {
                name,
                types,
                names,
                inputs
            }
        }

        return acc;
    }, {});

    return result;
}

exports.formatAddress = function formatAddress(address) {
    return address;
}

exports.toChecksumAddress = function toChecksumAddress(address) {
    try {
        return web3Utils.toChecksumAddress(address);
    }catch (e){
        Log.log("toChecksumAddress error: " + e)
    }
    return address;
}

exports.formatBalance= function formatBalance(balance, count) {
    if (typeof balance !== "number") {
        return balance;
    }
    try {
        if (!balance) return balance;
        var newbalance = 0;
        if (typeof balance === "number") {
            newbalance = balance.toFixed(count);
        } else {
            newbalance = parseFloat(balance).toFixed(count);
        }

        return newbalance;
    } catch (e) {
        Log.log("format balance " + balance + " error: " +e);
        return 0;
    }
}

/*
    transactionInfo:
    {
        address: xxx
        transaction: yyy
    }
 */
exports.preprocessTransaction= function preprocessTransaction(transactionInfo, fromserver) {
    if ((! transactionInfo) || (! transactionInfo.transaction)) return null;

    let txInfo = transactionInfo.transaction;
    let address = transactionInfo.address;
    if (!txInfo) return transactionInfo;
    try {
        var output = {
          ...transactionInfo
        };

        var extra = txInfo.extra;
        if (extra && (extra instanceof String || typeof extra === 'string')) {
            output = {
                address: address,
                transaction: {
                  ...transactionInfo.transaction,
                    extra: JSON.parse(extra)
                }
            }
        }
        return output;
    } catch (e) {
        Log.log("preprocessing: " + JSON.stringify(transactionInfo) + " exception: " + e)
        return transactionInfo;
    }
}

exports.getTransactionPendingNum = function getTransactionPendingNum(trans, address) {
    try {
        Log.log("try to get transaction: " + address)
        if (address == null || address == undefined || address.length == 0) return 0;

        var pendingNum = 0;

        var unconfirmed = trans.unconfirmed_transactions;

        if (unconfirmed && unconfirmed[address]) {
            pendingNum = unconfirmed[address].length;
        }

        return pendingNum;
    } catch (e) {
        Log.log("get transaction pending number error: " + e);
        return 0;
    }
}
