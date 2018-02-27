import React,{
    AsyncStorage
} from 'react-native';


export function setItem(key, value) {
    if (value == null) return Promise.reject('StorageService Error: value should not be null or undefined');
    return AsyncStorage
        .setItem(key, JSON.stringify(value))
        .then(()=> value)
}


export function getItem(key) {
    return AsyncStorage.getItem(key)
        .then(function (value) {
            return JSON.parse(value)
        });
}

export function mergeItem(key, value) {
    if (value == null) return Promise.reject('StorageService Error: value should not be null or undefined');
    return AsyncStorage
        .getItem(key)
        .then(contacts => {
            contacts = contacts == null ? [] : JSON.parse(contacts)

            contacts.push(value)
            return AsyncStorage.setItem(key, JSON.stringify(contacts))
        })
}


export const clear = AsyncStorage.clear;


export const removeItem = AsyncStorage.removeItem;


export function multiGet(keys) {
    return AsyncStorage.multiGet(keys)
        .then(results=> {
            return results.map(item=> {
                return [item[0], JSON.parse(item[1])]
            })
        });
}


export function multiRemove(keys) {
    return AsyncStorage.multiRemove(keys)
}
