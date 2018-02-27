function debug(value) {
    // console.log(value)
}

export const checkNum = (value) => {
    debug("checkNum:" + value)
    const reg = /^\d+(\.\d*)?$/
    return reg.test(value)
}

export const checkAddress = (value) => {
    debug("checkAddress:" + value)
    const reg = /^0x[a-fA-F0-9]{40,40}$/
    return reg.test(value)
}

export const checkWalletName = (value) => {
    debug("checkWalletName:" + value)
    const reg = /^[a-zA-Z0-9_\-\u4e00-\u9fa5]{4,12}$/
    return reg.test(value)
}

export const checkKeystore = (value) => {
    debug("checkKeystore")
    debug(value)
    try {
        let result = JSON.parse(value)
        if (result.address) {
            return true
        } else {
            return false
        }
    } catch(error) {
        debug("parse json error," + error)
        return false;
    }
}

export const checkPhone = (value) => {
    debug("checkPhone:" + value)
    const reg = /^1\d{10}$/
    return reg.test(value)
}

export const checkEmail = (value) => {
    debug("checkPhone:" + value)
    const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    return reg.test(value)
}

export const checkPrivateKey = (value) => {
    debug("checkPrivateKey:" + value)
    const reg = /^[a-fA-F0-9]{64}$/
    return reg.test(value)
}

export const checkUrl = (value) => {
    const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    return reg.test(value)
}

// debug(checkNum("0.0008"))
// debug(checkNum("0.0,008"))
// debug(checkAddress("0x4dacd41b0fd2c7ed3f02c74236871a3854016979"))
// debug(checkAddress("0x4dacd41b0fd2c7ed3f02c74236871a385401697"))
// debug(checkAddress("0x4dacd41b0fd2c7gd3f02c74236871a3854016979"))
//
// debug(checkWalletName("afDs-131"))
// debug(checkWalletName("afDs_131"))
// debug(checkWalletName("afd/_131"))
// debug(checkKeystore('{"address":"4dacd41b0fd2c7ad3f02c74236871a3854016979","crypto":{"cipher":"aes-128-ctr","ciphertext":"7f0cdb11c7210af3eea9f2832db567382db40c170d8c42f8c325da7ffcfa59d8","cipherparams":{"iv":"1dc2322c7fbce5d27bd0516857cc9aa2"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"2990168875c53c448d668d0c93539d3e85278778c94cf6aa43a22fae63c7fd37"},"mac":"ff1ad03ad49ed336d66b240fc56b05647044dda6cbf186c00c692f3b9b317107"},"id":"0953cda8-5640-4c3b-b5b2-8ea511dd496f","version":3}'))