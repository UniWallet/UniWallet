import I18n, { getLanguages } from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
    'en': require('./en'),
    'zh': require('./zh'),
};

export default function getString(key) {
    return I18n.t(key);
}