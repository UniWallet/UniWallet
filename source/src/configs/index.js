const baseConfig = {
    apiPath: '/index/'
};

const devConfig = {
    release:false,
    apiUrl: 'http://ropsten.yiya.io',
    web3Url: 'http://ropsten.yiya.io:8545',
    exploreUrl:'https://ropsten.etherscan.io/tx/',
};

const prodConfig = {
    release:false,
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
