/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "5a97b7aa6cdee9f77fe1451dfdd1e287"
  },
  {
    "url": "assets/css/0.styles.7c204df7.css",
    "revision": "9e0ae8ec91167e1e7fabf64205eca53f"
  },
  {
    "url": "assets/fonts/codicon.a609dc0f.ttf",
    "revision": "a609dc0f334a7d4e64205247c4e8b97c"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/1.b52bfadf.js",
    "revision": "5e4acd0a6605b5cb9d6f2f6c54902488"
  },
  {
    "url": "assets/js/10.d0a29732.js",
    "revision": "db4882a2ec1c2445d1fbfbef2540d957"
  },
  {
    "url": "assets/js/11.64f59114.js",
    "revision": "415ecd1af0ebe61b3ce981094dba1b07"
  },
  {
    "url": "assets/js/12.5a6a4d42.js",
    "revision": "d0d2f0621086706e59cfd42896c52661"
  },
  {
    "url": "assets/js/13.5be69d4a.js",
    "revision": "28f01e51e613e940e9735d75fd00954c"
  },
  {
    "url": "assets/js/14.cd9ca1c4.js",
    "revision": "08b840d22c168549011ec73a652577d8"
  },
  {
    "url": "assets/js/15.df3534b8.js",
    "revision": "6c6a75da7e5c4e14cbb7e5f208a053aa"
  },
  {
    "url": "assets/js/17.d9c04474.js",
    "revision": "aca05025488aff61a05f86d1e43b5520"
  },
  {
    "url": "assets/js/18.c6daa243.js",
    "revision": "7357cd9069514518b6c74bfaf9eb1689"
  },
  {
    "url": "assets/js/19.2d8a079f.js",
    "revision": "6370fe41fd42405dbaa1c3e8a12fdd12"
  },
  {
    "url": "assets/js/2.79c8cc01.js",
    "revision": "6dcb6984f56f833366f4ca63d279a645"
  },
  {
    "url": "assets/js/20.dc85c878.js",
    "revision": "8bf68a5bd411f442c701995b0d956b8a"
  },
  {
    "url": "assets/js/21.44e1d1de.js",
    "revision": "8276abd3fbdef5d50cfed20a3e349558"
  },
  {
    "url": "assets/js/22.530cf188.js",
    "revision": "59a004bf2a5311473c911515d80843f6"
  },
  {
    "url": "assets/js/23.b983a346.js",
    "revision": "56f45b43e83c5b6f111a6677b8f2947b"
  },
  {
    "url": "assets/js/24.978348e8.js",
    "revision": "32d649009b194ef66fe9a26f2cc2dc1f"
  },
  {
    "url": "assets/js/25.894359e5.js",
    "revision": "4de55db0ee18a185caee8158f13cee43"
  },
  {
    "url": "assets/js/26.4e21800b.js",
    "revision": "e0e8855cd5eea3640df47b0935b221c1"
  },
  {
    "url": "assets/js/27.e32ccc95.js",
    "revision": "1b901454ce0accd882a66abf0ebbd5f2"
  },
  {
    "url": "assets/js/28.dbfe1263.js",
    "revision": "2f8d4bebdb6c7c45888cd3804f58c013"
  },
  {
    "url": "assets/js/29.69763be7.js",
    "revision": "353129af88d9c158d94999c1fc373ca7"
  },
  {
    "url": "assets/js/30.d1b0f0a4.js",
    "revision": "01ca4580f51dd573b7a09deca8ada72d"
  },
  {
    "url": "assets/js/31.31eda8ca.js",
    "revision": "1640551912b2d89e9ae094aec5b11b36"
  },
  {
    "url": "assets/js/32.bac70452.js",
    "revision": "c24100b55449971d627a78378a313cfc"
  },
  {
    "url": "assets/js/33.c999684a.js",
    "revision": "a1ea3135f09e88de56a1e9659a57ea6a"
  },
  {
    "url": "assets/js/34.4eadb905.js",
    "revision": "0857cc16d034df65f0add9b5ca58e284"
  },
  {
    "url": "assets/js/35.37c4e186.js",
    "revision": "b285d0a8a38274513923fbc7e814a2d2"
  },
  {
    "url": "assets/js/36.dd5a19eb.js",
    "revision": "f7e09cd690c960aee191f378edc7a8b9"
  },
  {
    "url": "assets/js/37.5629d2c2.js",
    "revision": "3dd391e883e71bc77f291eea90e58553"
  },
  {
    "url": "assets/js/38.882f79c0.js",
    "revision": "48c61c9df3bd3f9aa23c5b0429ac9e45"
  },
  {
    "url": "assets/js/39.ead01c08.js",
    "revision": "4a00eec33e7eb369c754de7c88a1294f"
  },
  {
    "url": "assets/js/4.5a0f53f0.js",
    "revision": "125bdb9501e29cf81642f8a968d8fa11"
  },
  {
    "url": "assets/js/40.7bb7c297.js",
    "revision": "9a7234c9930a943727157004e2cd35a3"
  },
  {
    "url": "assets/js/41.b6baf848.js",
    "revision": "dc4b5cc5383f2f9f5d9709e625a2a89f"
  },
  {
    "url": "assets/js/42.57fdb90a.js",
    "revision": "8e76c4b82b84fa567e75389b1e33154b"
  },
  {
    "url": "assets/js/43.374b3a3e.js",
    "revision": "fbbcb697b5feb034e9a9e386cca66662"
  },
  {
    "url": "assets/js/44.ac2603cd.js",
    "revision": "340cc3a7a7612520e4971b944540794e"
  },
  {
    "url": "assets/js/45.f218d48e.js",
    "revision": "310d8b99c8a495ad10413bc31e660b56"
  },
  {
    "url": "assets/js/46.a8b9e0be.js",
    "revision": "4b6825e0f44b7cfbfbf5b0a26cbb7090"
  },
  {
    "url": "assets/js/47.0ea9df51.js",
    "revision": "aade5c00a68af4d6f49856712ac19894"
  },
  {
    "url": "assets/js/48.d4cb8872.js",
    "revision": "c7a001a5c4dc26ea4552fd189425719e"
  },
  {
    "url": "assets/js/49.3ea5df81.js",
    "revision": "00847c1c169068b08ca16fcab952abbf"
  },
  {
    "url": "assets/js/5.51de39fd.js",
    "revision": "489fd6036b6867183fc4f77971fb09ed"
  },
  {
    "url": "assets/js/50.480023a3.js",
    "revision": "9486ae00fb56962f9e7712d28766bd6e"
  },
  {
    "url": "assets/js/51.4f57cc9f.js",
    "revision": "be63f1ba18217b465263436713bb01f3"
  },
  {
    "url": "assets/js/52.f6430d6e.js",
    "revision": "e676fc2e8b1828ab4c134e672adf962e"
  },
  {
    "url": "assets/js/53.73e257e0.js",
    "revision": "52d197c3a5ea3ce75ebcde843ef61dc9"
  },
  {
    "url": "assets/js/54.2868713a.js",
    "revision": "7b9312fc6e750053f13af1564a3f55be"
  },
  {
    "url": "assets/js/55.6fd164b6.js",
    "revision": "dd04c871c58978d3d1c7e3bd7693acd5"
  },
  {
    "url": "assets/js/56.73e0cdd2.js",
    "revision": "49bce7c7f1ecc2dff8fb977228ee0ab8"
  },
  {
    "url": "assets/js/57.1eb470d6.js",
    "revision": "d0f485c968bfc191b06bf9107ea94521"
  },
  {
    "url": "assets/js/58.7041261b.js",
    "revision": "34a064702300a86704a8630f0ccb8516"
  },
  {
    "url": "assets/js/59.248ba43d.js",
    "revision": "41f806f9d04f48d9775463c52aac9316"
  },
  {
    "url": "assets/js/6.753c70ae.js",
    "revision": "d4cc7e22fa804b8a1cfe4fd630ec6df1"
  },
  {
    "url": "assets/js/60.c68a1cd1.js",
    "revision": "78c98f6856d689046b2940e274fe490b"
  },
  {
    "url": "assets/js/61.68206fe5.js",
    "revision": "a48edfed9f86cccb6cab085053ecc032"
  },
  {
    "url": "assets/js/62.5a9d480d.js",
    "revision": "9c6bcebb8a6b967a9866cc7a15e699be"
  },
  {
    "url": "assets/js/63.51e28df0.js",
    "revision": "6f23c0e3648fd287e467d83180da05d2"
  },
  {
    "url": "assets/js/65.d2111f98.js",
    "revision": "18b1894ae9dc3befa15b518491c349cf"
  },
  {
    "url": "assets/js/66.1f5a83ef.js",
    "revision": "1ee98b3d2038943d444d35f6ba8e91c1"
  },
  {
    "url": "assets/js/7.44ac5cff.js",
    "revision": "d20040d3d207b51160ca07e5bc0e24a2"
  },
  {
    "url": "assets/js/8.2445acca.js",
    "revision": "911804b18788a96d2016b43d024a4b2e"
  },
  {
    "url": "assets/js/9.8c86bdca.js",
    "revision": "c38ec11df36608aa38fa6a556057d706"
  },
  {
    "url": "assets/js/app.ebbc6311.js",
    "revision": "4a16a4478b87bef016930ea7de0f6c1d"
  },
  {
    "url": "index.html",
    "revision": "e0f68622e671660da0e5d4efa2a76fd9"
  },
  {
    "url": "logo.png",
    "revision": "dd716d4c8ac38b94b7030282b9367138"
  },
  {
    "url": "logo.svg",
    "revision": "0fbee4f5a02c657c5ff77dc9048e0784"
  },
  {
    "url": "migration/0.13to0.14.html",
    "revision": "ea1879b23efa748f7ea19e79db3724f4"
  },
  {
    "url": "migration/index.html",
    "revision": "f1c16e4fa5d033696e562b24c9ea687e"
  },
  {
    "url": "playground/index.html",
    "revision": "3c049f8705b580d3747dea9fbdfcb3a3"
  },
  {
    "url": "rules/attribute-name-casing.html",
    "revision": "ff74f7ea8dfa3d85d14929638726b34e"
  },
  {
    "url": "rules/attribute-value-quote.html",
    "revision": "fd51c8f83241928aad44a5e2b32b1d59"
  },
  {
    "url": "rules/element-name-casing.html",
    "revision": "381efd10d91690313e999c5fd9974f7a"
  },
  {
    "url": "rules/html-closing-bracket-newline.html",
    "revision": "f3d5c6ce6ead9d7b5f75200850dbe27e"
  },
  {
    "url": "rules/html-closing-bracket-spacing.html",
    "revision": "333042d7b1a65f03024295d14791ffdb"
  },
  {
    "url": "rules/html-comment-content-newline.html",
    "revision": "750c1758f9a211e42594b2c2a38cc240"
  },
  {
    "url": "rules/html-comment-spacing.html",
    "revision": "b5d25508b1983e2d629d087b33009f32"
  },
  {
    "url": "rules/html-content-newline.html",
    "revision": "62b9b3311e8dc7a3c9e41b7557a8209e"
  },
  {
    "url": "rules/html-indent.html",
    "revision": "82a6e60a754cfd752c0debce6f419de4"
  },
  {
    "url": "rules/index.html",
    "revision": "9811d7629426cf1fca5282d11dc49387"
  },
  {
    "url": "rules/max-attributes-per-line.html",
    "revision": "3c3da2ec3338a6c75f639aa10a9bed8c"
  },
  {
    "url": "rules/no-duplicate-attributes.html",
    "revision": "fd144724f6462a242807b14426395261"
  },
  {
    "url": "rules/no-empty-template-tag.html",
    "revision": "54d47cbd5b1acf2438171975780119c2"
  },
  {
    "url": "rules/no-html-comments.html",
    "revision": "e41e5883113755aba2e5d008d58357d4"
  },
  {
    "url": "rules/no-invalid-template-interpolation.html",
    "revision": "8928bfc4b87c3043823a1da2e039a548"
  },
  {
    "url": "rules/no-irregular-whitespace.html",
    "revision": "abaf2ace0cfe34c2f1d9ba8f5cf7a91b"
  },
  {
    "url": "rules/no-multi-spaces-in-html-tag.html",
    "revision": "2a91e0640a5869bc503a5d018ff8f81a"
  },
  {
    "url": "rules/no-multi-spaces-in-script.html",
    "revision": "2553b60a61ac806c952790989e04c9dd"
  },
  {
    "url": "rules/no-multi-spaces-in-scriptlet.html",
    "revision": "0fea75231795054e93f8f09279406e2a"
  },
  {
    "url": "rules/no-script-parsing-error.html",
    "revision": "8694e4a538d1ae4fbedcf9c674fdb72e"
  },
  {
    "url": "rules/no-semi-in-template-interpolation.html",
    "revision": "b2e19a77545e4cde6b317e15b1bb2db3"
  },
  {
    "url": "rules/no-space-attribute-equal-sign.html",
    "revision": "7f55a0fb2193dfa87fa8d460328a4567"
  },
  {
    "url": "rules/no-template-tag-in-start-tag.html",
    "revision": "9098c0e7e65bf643f0d4d5a849f8879f"
  },
  {
    "url": "rules/no-warning-html-comments.html",
    "revision": "0a20460673067f36a2870bc398a44d56"
  },
  {
    "url": "rules/plugin-option.html",
    "revision": "7a034122b44efdaaeaf142b74029125b"
  },
  {
    "url": "rules/prefer-escape-template-interpolations.html",
    "revision": "75c62bf85a403fb7c5f8b7876294aeef"
  },
  {
    "url": "rules/script-indent.html",
    "revision": "01d70e70dd45a540e465f84faf2b3e6d"
  },
  {
    "url": "rules/scriptlet-indent.html",
    "revision": "3aab343079f9847a5742a1231e1dc4fb"
  },
  {
    "url": "rules/template-tag-spacing.html",
    "revision": "3e684d7bb99a3e2a87890fa3c70c468b"
  },
  {
    "url": "services/ast-for-html.html",
    "revision": "1cb5ebacb357da06f20d2354e77f7e07"
  },
  {
    "url": "services/ast-for-template-tag.html",
    "revision": "5fd62e24f2e72f08ce3c9340fd11e042"
  },
  {
    "url": "services/index.html",
    "revision": "870fb11d73e87f66e9f9ad69827972ee"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
