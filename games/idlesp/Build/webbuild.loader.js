function createUnityInstance(e, r, n) {
    function t(e, r, n) {
        if (d.startupErrorHandler)
            return void d.startupErrorHandler(e, r, n);
        if (!(d.errorHandler && d.errorHandler(e, r, n) || (console.log("Invoking error handler due to\n" + e),
        "function" == typeof dump && dump("Invoking error handler due to\n" + e),
        e.indexOf("UnknownError") != -1 || e.indexOf("Program terminated with exit(0)") != -1 || t.didShowErrorMessage))) {
            var e = "An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n" + e;
            e.indexOf("DISABLE_EXCEPTION_CATCHING") != -1 ? e = "An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace." : e.indexOf("Cannot enlarge memory arrays") != -1 ? e = "Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings." : e.indexOf("Invalid array buffer length") == -1 && e.indexOf("Invalid typed array length") == -1 && e.indexOf("out of memory") == -1 && e.indexOf("could not allocate memory") == -1 || (e = "The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."),
            alert(e),
            t.didShowErrorMessage = !0
        }
    }
    function o(e) {
        var r = "unhandledrejection" == e.type && "object" == typeof e.reason ? e.reason : "object" == typeof e.error ? e.error : null
          , n = r ? r.toString() : "string" == typeof e.message ? e.message : "string" == typeof e.reason ? e.reason : "";
        if (r && "string" == typeof r.stack && (n += "\n" + r.stack.substring(r.stack.lastIndexOf(n, 0) ? 0 : n.length).replace(/(^\n*|\n*$)/g, "")),
        n && d.stackTraceRegExp && d.stackTraceRegExp.test(n)) {
            var o = e instanceof ErrorEvent ? e.filename : r && "string" == typeof r.fileName ? r.fileName : r && "string" == typeof r.sourceURL ? r.sourceURL : ""
              , a = e instanceof ErrorEvent ? e.lineno : r && "number" == typeof r.lineNumber ? r.lineNumber : r && "number" == typeof r.line ? r.line : 0;
            t(n, o, a)
        }
    }
    function a(e, r) {
        if ("symbolsUrl" != e) {
            var t = d.downloadProgress[e];
            t || (t = d.downloadProgress[e] = {
                started: !1,
                finished: !1,
                lengthComputable: !1,
                total: 0,
                loaded: 0
            }),
            "object" != typeof r || "progress" != r.type && "load" != r.type || (t.started || (t.started = !0,
            t.lengthComputable = r.lengthComputable,
            t.total = r.total),
            t.loaded = r.loaded,
            "load" == r.type && (t.finished = !0));
            var o = 0
              , a = 0
              , i = 0
              , s = 0
              , l = 0;
            for (var e in d.downloadProgress) {
                var t = d.downloadProgress[e];
                if (!t.started)
                    return 0;
                i++,
                t.lengthComputable ? (o += t.loaded,
                a += t.total,
                s++) : t.finished || l++
            }
            var u = i ? (i - l - (a ? s * (a - o) / a : 0)) / i : 0;
            n(.9 * u)
        }
    }
    function i(e) {
        return new Promise(function(r, n) {
            a(e);
            var t = new XMLHttpRequest;
            t.open("GET", d[e]),
            t.responseType = "arraybuffer",
            t.addEventListener("progress", function(r) {
                a(e, r)
            }),
            t.addEventListener("load", function(n) {
                a(e, n),
                r(new Uint8Array(t.response))
            }),
            t.send()
        }
        )
    }
    function s() {
        return new Promise(function(e, r) {
            var n = document.createElement("script");
            n.src = d.frameworkUrl,
            n.onload = function() {
                delete n.onload,
                e(unityFramework)
            }
            ,
            document.body.appendChild(n),
            d.deinitializers.push(function() {
                document.body.removeChild(n)
            })
        }
        )
    }
    function l() {
        s().then(function(e) {
            e(d)
        });
        var e = i("dataUrl");
        d.preRun.push(function() {
            d.addRunDependency("dataUrl"),
            e.then(function(e) {
                var r = new DataView(e.buffer,e.byteOffset,e.byteLength)
                  , n = 0
                  , t = "UnityWebData1.0\0";
                if (!String.fromCharCode.apply(null, e.subarray(n, n + t.length)) == t)
                    throw "unknown data format";
                n += t.length;
                var o = r.getUint32(n, !0);
                for (n += 4; n < o; ) {
                    var a = r.getUint32(n, !0);
                    n += 4;
                    var i = r.getUint32(n, !0);
                    n += 4;
                    var s = r.getUint32(n, !0);
                    n += 4;
                    var l = String.fromCharCode.apply(null, e.subarray(n, n + s));
                    n += s;
                    for (var u = 0, c = l.indexOf("/", u) + 1; c > 0; u = c,
                    c = l.indexOf("/", u) + 1)
                        d.FS_createPath(l.substring(0, u), l.substring(u, c - 1), !0, !0);
                    d.FS_createDataFile(l, null, e.subarray(a, a + i), !0, !0, !0)
                }
                d.removeRunDependency("dataUrl")
            })
        })
    }
    n = n || function() {}
    ;
    var d = {
        canvas: e,
        webglContextAttributes: {
            preserveDrawingBuffer: !1
        },
        streamingAssetsUrl: "StreamingAssets",
        downloadProgress: {},
        deinitializers: [],
        intervals: {},
        setInterval: function(e, r) {
            var n = window.setInterval(e, r);
            return this.intervals[n] = !0,
            n
        },
        clearInterval: function(e) {
            delete this.intervals[e],
            window.clearInterval(e)
        },
        preRun: [],
        postRun: [],
        print: function(e) {
            console.log(e)
        },
        printErr: function(e) {
            console.error(e)
        },
        locateFile: function(e) {
            return "build.wasm" == e ? this.codeUrl : e
        },
        disabledCanvasEvents: ["contextmenu", "dragstart"]
    };
    for (var u in r)
        d[u] = r[u];
    d.streamingAssetsUrl = new URL(d.streamingAssetsUrl,document.URL).href,
    d.disabledCanvasEvents.forEach(function(r) {
        e.addEventListener(r, function(e) {
            e.preventDefault()
        })
    });
    var c = {
        Module: d,
        SetFullscreen: function() {
            return d.SetFullscreen ? d.SetFullscreen.apply(d, arguments) : void d.print("Failed to set Fullscreen mode: Player not loaded yet.")
        },
        SendMessage: function() {
            return d.SendMessage ? d.SendMessage.apply(d, arguments) : void d.print("Failed to execute SendMessage: Player not loaded yet.")
        },
        Quit: function() {
            return new Promise(function(e, r) {
                d.shouldQuit = !0,
                d.onQuit = e
            }
            )
        }
    };
    return d.SystemInfo = function() {
        function e(e, r, n) {
            return e = RegExp(e, "i").exec(r),
            e && e[n]
        }
        for (var r, n, t, o, a, i, s = navigator.userAgent + " ", l = [["Firefox", "Firefox"], ["OPR", "Opera"], ["Edg", "Edge"], ["SamsungBrowser", "Samsung Browser"], ["Trident", "Internet Explorer"], ["MSIE", "Internet Explorer"], ["Chrome", "Chrome"], ["Safari", "Safari"]], d = 0; d < l.length; ++d)
            if (n = e(l[d][0] + "[/ ](.*?)[ \\)]", s, 1)) {
                r = l[d][1];
                break
            }
        "Safari" == r && (n = e("Version/(.*?) ", s, 1)),
        "Internet Explorer" == r && (n = e("rv:(.*?)\\)? ", s, 1) || n);
        for (var u = [["Windows (.*?)[;)]", "Windows"], ["Android ([0-9_.]+)", "Android"], ["iPhone OS ([0-9_.]+)", "iPhoneOS"], ["iPad.*? OS ([0-9_.]+)", "iPadOS"], ["FreeBSD( )", "FreeBSD"], ["OpenBSD( )", "OpenBSD"], ["Linux|X11()", "Linux"], ["Mac OS X ([0-9_.]+)", "macOS"], ["bot|google|baidu|bing|msn|teoma|slurp|yandex", "Search Bot"]], c = 0; c < u.length; ++c)
            if (o = e(u[c][0], s, 1)) {
                t = u[c][1],
                o = o.replace(/_/g, ".");
                break
            }
        var f = {
            "NT 5.0": "2000",
            "NT 5.1": "XP",
            "NT 5.2": "Server 2003",
            "NT 6.0": "Vista",
            "NT 6.1": "7",
            "NT 6.2": "8",
            "NT 6.3": "8.1",
            "NT 10.0": "10"
        };
        o = f[o] || o,
        a = document.createElement("canvas"),
        a && (gl = a.getContext("webgl2"),
        glVersion = gl ? 2 : 0,
        gl || (gl = a && a.getContext("webgl")) && (glVersion = 1),
        gl && (i = gl.getExtension("WEBGL_debug_renderer_info") && gl.getParameter(37446) || gl.getParameter(7937)));
        var g = "undefined" != typeof SharedArrayBuffer
          , p = "object" == typeof WebAssembly && "function" == typeof WebAssembly.compile;
        return {
            width: screen.width,
            height: screen.height,
            userAgent: s.trim(),
            browser: r,
            browserVersion: n,
            mobile: /Mobile|Android|iP(ad|hone)/.test(navigator.appVersion),
            os: t,
            osVersion: o,
            gpu: i,
            language: navigator.userLanguage || navigator.language,
            hasWebGL: glVersion,
            hasCursorLock: !!document.body.requestPointerLock,
            hasFullscreen: !!document.body.requestFullscreen,
            hasThreads: g,
            hasWasm: p,
            hasWasmThreads: function() {
                var e = p && g && new WebAssembly.Memory({
                    initial: 1,
                    maximum: 1,
                    shared: !0
                });
                return e && e.buffer instanceof SharedArrayBuffer
            }()
        }
    }(),
    d.abortHandler = function(e) {
        return t(e, "", 0),
        !0
    }
    ,
    window.addEventListener("error", o),
    window.addEventListener("unhandledrejection", o),
    Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 0, 50),
    new Promise(function(e, r) {
        d.SystemInfo.hasWebGL ? d.SystemInfo.hasWasm ? (1 == d.SystemInfo.hasWebGL && d.print('Warning: Your browser does not support "WebGL 2.0" Graphics API, switching to "WebGL 1.0"'),
        d.startupErrorHandler = r,
        n(0),
        d.postRun.push(function() {
            n(1),
            delete d.startupErrorHandler,
            e(c)
        }),
        l()) : r("Your browser does not support WebAssembly.") : r("Your browser does not support WebGL.")
    }
    )
}
