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
    "revision": "f61f611fd6b0c31aafd7be9e75b28fb5"
  },
  {
    "url": "assets/css/0.styles.f13f6a05.css",
    "revision": "0ab4adffcc527aca4cbd8dbb1e4c919e"
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
    "url": "assets/js/1.da30bf9c.js",
    "revision": "381a5362331004921b19e1bdb2dc338b"
  },
  {
    "url": "assets/js/12.b5954d45.js",
    "revision": "33a2549c38314fd4ddaa19988cd14f58"
  },
  {
    "url": "assets/js/13.126ec440.js",
    "revision": "5ddd9a2e5f4b385d81d01aa5bbb3e337"
  },
  {
    "url": "assets/js/14.a338bbca.js",
    "revision": "620be7dc681923251a3cb0c49c432050"
  },
  {
    "url": "assets/js/15.5d3d9ab9.js",
    "revision": "0cf05c95c1a0e33ce9ab3d31ff3e097f"
  },
  {
    "url": "assets/js/16.6b28269e.js",
    "revision": "744916492071f48c74a924fb0c3573d5"
  },
  {
    "url": "assets/js/17.d1eeeb2d.js",
    "revision": "0df62b81141a7568f91d0195e83114c5"
  },
  {
    "url": "assets/js/18.ebfb4144.js",
    "revision": "f76f6b54f92ee7a69dd1e3d789f95809"
  },
  {
    "url": "assets/js/19.93a9dad2.js",
    "revision": "15b871a2db7b6ba6c49aaa03fb8cab92"
  },
  {
    "url": "assets/js/2.5ab32237.js",
    "revision": "5d77256b82913d3f413cd491d5898972"
  },
  {
    "url": "assets/js/20.daccb418.js",
    "revision": "66c3c43d630ff8c960b29ae81ac54109"
  },
  {
    "url": "assets/js/21.c8ae5d4c.js",
    "revision": "c4fdb2cd94a2902aad6d030eca1745c4"
  },
  {
    "url": "assets/js/22.f9bfe1e9.js",
    "revision": "9461e9d3132ce9bc8ed76c4b53bd1f1a"
  },
  {
    "url": "assets/js/23.24ca85f6.js",
    "revision": "2851cad42d14c64cb06b7822737ae750"
  },
  {
    "url": "assets/js/24.39592b7e.js",
    "revision": "67c0ada757e78d59e8572b3efcb2466a"
  },
  {
    "url": "assets/js/25.fa1c2825.js",
    "revision": "e30d973bcb1f57b35edac5b42a6b49a6"
  },
  {
    "url": "assets/js/26.9a8fb4a3.js",
    "revision": "f0a065df4b269d06e23a6fa54a88117e"
  },
  {
    "url": "assets/js/27.984d4c9c.js",
    "revision": "63b47d041f594fcd17bb0de04ec0ca84"
  },
  {
    "url": "assets/js/28.7298ec7f.js",
    "revision": "c94ad3ee99ff6203785ec0e7f7f62ef2"
  },
  {
    "url": "assets/js/29.ff54d504.js",
    "revision": "c2e6912cf7efbb9b053487c4715b3b82"
  },
  {
    "url": "assets/js/3.10edc445.js",
    "revision": "0cb951ce2390188341afba07d21e1b35"
  },
  {
    "url": "assets/js/30.7f4cb1e0.js",
    "revision": "4fa138df4e7268c28230a572e9583662"
  },
  {
    "url": "assets/js/31.4748a271.js",
    "revision": "c3d15b5cefe4120be0c8f896290d9c5c"
  },
  {
    "url": "assets/js/33.d4f90795.js",
    "revision": "c329266d4acb0857ea8df0edb915a0dc"
  },
  {
    "url": "assets/js/34.084e2333.js",
    "revision": "d1b229429d675c114a4c3152e1ad1747"
  },
  {
    "url": "assets/js/35.95f4800a.js",
    "revision": "49ad7a94ce0776bcfea9fe0c3dde1d5f"
  },
  {
    "url": "assets/js/36.2628ce93.js",
    "revision": "63cbd5aef8e24c060a6a41fbb6b804eb"
  },
  {
    "url": "assets/js/37.c08640f9.js",
    "revision": "91b3376193d00b79f20476b68f0a99cb"
  },
  {
    "url": "assets/js/38.0116cd99.js",
    "revision": "f5065243a9eee93e57757f2f4e18f11f"
  },
  {
    "url": "assets/js/39.a769f608.js",
    "revision": "9bd8b8e7de04dbf70cf2ad38e1d68512"
  },
  {
    "url": "assets/js/4.b2cce2e4.js",
    "revision": "2cc27bde82faa02c1f71292bce645918"
  },
  {
    "url": "assets/js/40.8372516f.js",
    "revision": "fca3dc5190d5c3574d51cc4bb7f15248"
  },
  {
    "url": "assets/js/41.d5182c5e.js",
    "revision": "68403ba74458060b1dd5f5430732a959"
  },
  {
    "url": "assets/js/42.45c9873a.js",
    "revision": "d94dc23de3cc18b8d805f3823fa5215e"
  },
  {
    "url": "assets/js/43.73e59dd7.js",
    "revision": "a75f4674e7b5e2b762314a08b43ae746"
  },
  {
    "url": "assets/js/44.1d51cef7.js",
    "revision": "31fdc6deb58876c3361cc1e2bb6e25d1"
  },
  {
    "url": "assets/js/45.3690cb37.js",
    "revision": "0c128227a2c7477042813bad863c133e"
  },
  {
    "url": "assets/js/46.206e32a2.js",
    "revision": "031a617f5d0be776bf2f2be9e6ac9eab"
  },
  {
    "url": "assets/js/47.c5a1b48c.js",
    "revision": "a42f803a46d6fd64e8555cf5641a8fee"
  },
  {
    "url": "assets/js/48.955ac182.js",
    "revision": "bb0bc0e59c1997c4c9d2d7ad4241a761"
  },
  {
    "url": "assets/js/49.e8b84027.js",
    "revision": "957b218a9e56d0059f4af322486c2ea4"
  },
  {
    "url": "assets/js/5.6f575d7c.js",
    "revision": "7f14e23acbb86206a0aae07f52abe1b0"
  },
  {
    "url": "assets/js/50.d856e717.js",
    "revision": "024f881e0dc929c9a855714cdff90745"
  },
  {
    "url": "assets/js/51.410b2a40.js",
    "revision": "5152a32a411b418afeb4e20aea57e136"
  },
  {
    "url": "assets/js/52.51f8f1b8.js",
    "revision": "0c81c35b08554f43a0c637ab1d0dd2bc"
  },
  {
    "url": "assets/js/53.36097beb.js",
    "revision": "47be92352eb4123608372669d764b40e"
  },
  {
    "url": "assets/js/54.843079af.js",
    "revision": "23327ee143b6fbf85bbc46f74e92decf"
  },
  {
    "url": "assets/js/55.999f7cd4.js",
    "revision": "df51800885a657275fa783e84f0e6cf6"
  },
  {
    "url": "assets/js/56.5282050f.js",
    "revision": "e4dd56cd01a5f15d32cb4f0c812925a7"
  },
  {
    "url": "assets/js/57.9f05ac98.js",
    "revision": "a6f1ba4e95d2eeb20b79604b8187302d"
  },
  {
    "url": "assets/js/58.b42278a4.js",
    "revision": "25212bb61c628d66d9fcfff226f699a2"
  },
  {
    "url": "assets/js/59.b3cee9cd.js",
    "revision": "22c50ed6177a072d090a3d24f3c3e0d2"
  },
  {
    "url": "assets/js/6.0bdf8e77.js",
    "revision": "d5d5af461c11f8b229fc0156c923b1eb"
  },
  {
    "url": "assets/js/60.811f4252.js",
    "revision": "146e14ab5d87184f7a020677205564a3"
  },
  {
    "url": "assets/js/61.6562dc5a.js",
    "revision": "9f867ec4a5be08098c447c1eb66d896f"
  },
  {
    "url": "assets/js/62.edeef37b.js",
    "revision": "9c0fd2c7d245c7a5c9d965d7562ad173"
  },
  {
    "url": "assets/js/63.f185117e.js",
    "revision": "2bb27df82c89a77983689ef4ecf8107e"
  },
  {
    "url": "assets/js/64.1be8f9a8.js",
    "revision": "df50893f73143e7f5ae02578a6955bb9"
  },
  {
    "url": "assets/js/65.12f29cad.js",
    "revision": "7217ee99fe7be810f599429a43f601ff"
  },
  {
    "url": "assets/js/66.88a38481.js",
    "revision": "ed6f3afde0e8014412721eb97bad631f"
  },
  {
    "url": "assets/js/67.9bdd544e.js",
    "revision": "5c3fbafdcdb340c79b0ba0a08dbf002a"
  },
  {
    "url": "assets/js/68.e91c307e.js",
    "revision": "4b36fd2cbdf398e88ae2ec56f5c41462"
  },
  {
    "url": "assets/js/69.ffab9353.js",
    "revision": "c311ad2acde4399a31863480fad349ae"
  },
  {
    "url": "assets/js/7.d240b39a.js",
    "revision": "8576451db588b1e59d3b45889e9e461e"
  },
  {
    "url": "assets/js/70.c91b6750.js",
    "revision": "eec43638c8993cadde7070272cef7141"
  },
  {
    "url": "assets/js/71.6e7ebcdf.js",
    "revision": "0ae2823235273a1a04074d327d941293"
  },
  {
    "url": "assets/js/72.80b64685.js",
    "revision": "d02955e0c6c9a7e8551fa0f656d1582c"
  },
  {
    "url": "assets/js/73.03a483a3.js",
    "revision": "b9ac9ca24bc92ddc8b9b852de76882ca"
  },
  {
    "url": "assets/js/74.fb16dff9.js",
    "revision": "88691a1b6ea7d3bdf039ab67a19bc5f8"
  },
  {
    "url": "assets/js/75.9ba7e5fa.js",
    "revision": "75b92e49ac66277009d1bfa6a1b082f6"
  },
  {
    "url": "assets/js/77.18d98618.js",
    "revision": "cb6a370980be80eb23a3193722e6683c"
  },
  {
    "url": "assets/js/78.2b4bb9df.js",
    "revision": "fc59da404f1d66c5492f882d3a58b090"
  },
  {
    "url": "assets/js/8.92f40494.js",
    "revision": "b2eb5c32348ca62f646cc5f1ee85fbf7"
  },
  {
    "url": "assets/js/9.440f6dfe.js",
    "revision": "1918f3e5486a9d490bbdb1339a2a3df5"
  },
  {
    "url": "assets/js/app.2a4b1e93.js",
    "revision": "ceda6657325b79382517b2d3a5c180d6"
  },
  {
    "url": "assets/js/vendors~docsearch.5feb91de.js",
    "revision": "02ca66a20c43412ea7bde7650b83f4d8"
  },
  {
    "url": "index.html",
    "revision": "f66e6631ef00493e4999bef5bdac5ace"
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
    "revision": "9919c70ffe30559b67c77e3df35b1b71"
  },
  {
    "url": "migration/index.html",
    "revision": "8c9d92ae26cc1fab8220b442f44c2e90"
  },
  {
    "url": "playground/index.html",
    "revision": "ac517bd85870746e4c497512957ff361"
  },
  {
    "url": "rules/attribute-name-casing.html",
    "revision": "2d0b48e56e99f5c02552d5282c38c3fe"
  },
  {
    "url": "rules/attribute-value-quote.html",
    "revision": "a92731632ee9d951d96c65df3a912121"
  },
  {
    "url": "rules/element-name-casing.html",
    "revision": "51b496b4ee713fc1418d9b96711adf22"
  },
  {
    "url": "rules/html-closing-bracket-newline.html",
    "revision": "31407b925f8dd20c550e54feb616b578"
  },
  {
    "url": "rules/html-closing-bracket-spacing.html",
    "revision": "1e65870de52fb7c4f00bc6b9c2ef0a97"
  },
  {
    "url": "rules/html-comment-content-newline.html",
    "revision": "e8c9324e9d517178953759b45685a10e"
  },
  {
    "url": "rules/html-comment-spacing.html",
    "revision": "8730eefc76a06f1c8e73b5f23ad44663"
  },
  {
    "url": "rules/html-content-newline.html",
    "revision": "3c6f8700408cf911ea0ccc4585b7a996"
  },
  {
    "url": "rules/html-indent.html",
    "revision": "30087660031acddffd9ef5bfe4798c0f"
  },
  {
    "url": "rules/index.html",
    "revision": "ad843183bfebb6df986b5ea64c737509"
  },
  {
    "url": "rules/max-attributes-per-line.html",
    "revision": "8e17582d26a5388789f4458a04e2b964"
  },
  {
    "url": "rules/no-duplicate-attributes.html",
    "revision": "ce8a8998dd5ae9fc1a12f8031c7461aa"
  },
  {
    "url": "rules/no-empty-template-tag.html",
    "revision": "6d87bec91c9bb0a14263ce1bcda96a3c"
  },
  {
    "url": "rules/no-html-comments.html",
    "revision": "ec109a35db659cbdf2f4ab3f81ed6bd2"
  },
  {
    "url": "rules/no-invalid-template-interpolation.html",
    "revision": "2615ae7d03843bfad4314c08b5cfde7c"
  },
  {
    "url": "rules/no-irregular-whitespace.html",
    "revision": "a412871c675345c81edc79128c027e42"
  },
  {
    "url": "rules/no-multi-spaces-in-html-tag.html",
    "revision": "83e4bb48909a04537c3c5f5fde7f8d23"
  },
  {
    "url": "rules/no-multi-spaces-in-scriptlet.html",
    "revision": "1c471167a48e382c4fc08fcaa0c3957c"
  },
  {
    "url": "rules/no-script-parsing-error.html",
    "revision": "4b5e9894c580535ef98046b0d2255cc9"
  },
  {
    "url": "rules/no-semi-in-template-interpolation.html",
    "revision": "333cb3d3ffdbb9bd85dd3c4e56b14475"
  },
  {
    "url": "rules/no-space-attribute-equal-sign.html",
    "revision": "8f0849157d3542522761ed5fea159fe9"
  },
  {
    "url": "rules/no-template-tag-in-start-tag.html",
    "revision": "f5867eb54c976f0d16fe569297718f20"
  },
  {
    "url": "rules/no-warning-html-comments.html",
    "revision": "62bb4d045524d60a71859f74b9ea83d8"
  },
  {
    "url": "rules/prefer-escape-template-interpolations.html",
    "revision": "7c13b5b97091074ad706a6cbf43221ed"
  },
  {
    "url": "rules/scriptlet-indent.html",
    "revision": "aa54b99f2686e920a1a5d77893b04f49"
  },
  {
    "url": "rules/template-tag-spacing.html",
    "revision": "72db4d47a809e4ee05516bbdbad91b19"
  },
  {
    "url": "services/ast-for-html.html",
    "revision": "2dbe38a0863bf51c3e382e7fcc2d6600"
  },
  {
    "url": "services/ast-for-template-tag.html",
    "revision": "f8f29a84ef51a0de3def97bbe02c1619"
  },
  {
    "url": "services/index.html",
    "revision": "7fe6e72e2d26969be77cf8d39853b9be"
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
