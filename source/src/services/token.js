import * as request from './request'

const USING_FAKE_TOKEN = false;
export async function getTokenList() {
    let data = await request.get("token", null);
    if (USING_FAKE_TOKEN) {
        data = [
            {
                address: "0x917927677ec54edd264da3db3a668088f4810bc3",
                decimal: "18",
                icon: "http://yiya.io/tokens/yiya.png",
                name: "Yiya",
                price: "8.88",
                symbol: "YIYA",
                unit: "yiya"
            },
            {
                address: "0x0",
                decimal: "18",
                icon: "http://yiya.io/tokens/Ethereum.png",
                name: "Ethereum",
                price: "8.88",
                symbol: "ETH",
                unit: "ether"
            },

        ];
    }
    return data;
}

export async function getTokens(address) {
    let params = {
        address:address,
    }
    let tokens = await request.get("getWalletTokens", params);
    return tokens;
}
