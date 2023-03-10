// const QRCode = require('easyqrcodejs-nodejs');

// const handler = async (req, res) => {
//     const { method } = req;

//     if (method === 'POST') {

//         const { session } = req.body

//         var options = {
//             text: `vagawallet://vagawallet.com/processQR/${session}`,
//             width: 500,
//             height: 500,
//             colorDark: "#000000",
//             colorLight: "#ffffff",
//             correctLevel: QRCode.CorrectLevel.M, // L, M, Q, H
//             dotScale: .6,
//             dotScaleTiming: .4, // Dafault for timing block , must be greater than 0, less than or equal to 1. default is 1
//             dotScaleTiming_H: .4, // For horizontal timing block, must be greater than 0, less than or equal to 1. default is 1
//             dotScaleTiming_V: .4, // For vertical timing block, must be greater than 0, less than or equal to 1. default is 1

//             dotScaleA: .4, // Dafault for alignment block, must be greater than 0, less than or equal to 1. default is 1
//             dotScaleAO: .4, // For alignment outer block, must be greater than 0, less than or equal to 1. default is 1
//             dotScaleAI: .4, // For alignment inner block, must be greater than 0, less than or equal to 1. default is 1

//             quietZone: 20,
//             logo: "https://firebasestorage.googleapis.com/v0/b/vagabond-331916.appspot.com/o/system%2Fappstore.png?alt=media&token=d87325e2-5a9e-40ff-af72-9ead3e80f9c8",
//             logoWidth: 100, // fixed logo width. default is `width/3.5`
//             logoHeight: 100, // fixed logo height. default is `heigth/3.5`
//             logoMaxWidth: undefined, // Maximum logo width. if set will ignore `logoWidth` value
//             logoMaxHeight: undefined, // Maximum logo height. if set will ignore `logoHeight` value
//             logoBackgroundColor: '#fffff', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
//             logoBackgroundTransparent: true, // Whether use transparent image, default is false
//             format: 'PNG',
//             quality: .9,
//         }

//         // New instance with options
//         var qrcode = new QRCode(options);

//         return qrcode.toDataURL().then((url) => {
//             res.status(200).json({ data: { url } });
//         })
//     }
// }

// export default handler;
