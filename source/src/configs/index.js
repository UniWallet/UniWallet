const baseConfig = {
    apiPath: '/index/'
};

const devConfig = {
    release:false,
    // apiUrl: 'http://10.0.2.2:8080',
    // web3Url: 'http://10.0.2.2:8545',
    apiUrl: 'http://47.101.146.248:8080',
    web3Url: 'http://47.101.146.248:8545',
    // web3Url: 'https://ropsten.infura.io/v3/c31352ced1014fb09d29b7f5d3c94fb3',
    exploreUrl:'https://ropsten.etherscan.io/tx/',
};

const prodConfig = {
    release:true,
    apiUrl: 'http://api.yiya.io',
    web3Url: 'http://web3.yiya.io',
    exploreUrl:'https://etherscan.io/tx/',
};

var exportConfig = {};

if (__DEV__) {
    exportConfig = {
        ...baseConfig,
        ...devConfig
    }
}
else {
    exportConfig = {
        ...baseConfig,
        ...prodConfig
    }
}

export default exportConfig;
