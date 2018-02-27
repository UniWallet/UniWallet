var DEBUG=__DEV__

exports.log = function log(text, ext) {
    if (DEBUG) {
        if (ext) {
            console.log(text, ext)
        } else {
            console.log(text)
        }
    }
}