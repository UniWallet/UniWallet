import * as request from './request'

export async function getExchangeRateList() {
    let data = await request.get("exrate", null);
    return data;
}