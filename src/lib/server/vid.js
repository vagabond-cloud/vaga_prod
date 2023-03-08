function generateVID() {
    return 'VID' + Math.random().toString(16).slice(2, 4).toUpperCase() +
        Math.random().toString(16).slice(2, 4).toUpperCase() + '-' +
        Math.random().toString(16).slice(2, 6).toUpperCase() + '-' +
        Math.random().toString(16).slice(2, 6).toUpperCase() + '-' +
        Math.random().toString(16).slice(2, 6).toUpperCase() + '-' +
        Math.random().toString(16).slice(2, 14).toUpperCase();
}

export default generateVID

export function generatePassid() {
    return 'vpro_' + Math.random().toString(16).slice(2, 4).toUpperCase() +
        Math.random().toString(16).slice(2, 14).toUpperCase();
}