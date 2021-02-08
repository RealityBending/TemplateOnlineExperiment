/* UTILS ================== */


/* MATHS ================== */

function range(n = 10) {
    return Array(n).fill().map((_, i) => i + 1)
}


function randomInteger(min = 1, max = 10) {
    return Math.round(Math.random() * (max - min) + min)
}

function randomNumber(min = 0, max = 1) {
    return Math.random() * (max - min) + min
}

function round_digits(x, digits = 2) {
    return Number(Math.round(parseFloat(x + 'e' + digits)) + 'e-' + digits).toFixed(digits)
}

function isString(x) {
    return typeof x === 'string' || x instanceof String
}

// function saveData(name, data) {
//     return JSON.stringify({ filename: name, filedata: data })
// }

// function saveData(data, name = "data.csv") {

//     const a = document.createElement("a")
//     var text = JSON.stringify(data, null, 2)

//     const file = new Blob([text], { type: "text/plain" })

//     a.href = URL.createObjectURL(file)
//     a.download = name
//     document.body.appendChild(a)
//     // a.click()
//     a.remove()
// }
// var getJSON = function (url, callback) {
//     var xhr = new XMLHttpRequest()
//     xhr.open('GET', url, true)
//     xhr.responseType = 'json'
//     xhr.onload = function () {
//         var status = xhr.status
//         if (status === 200) {
//             callback(null, xhr.response)
//         } else {
//             callback(status, xhr.response)
//         }
//     }
//     xhr.send()
// }

// async function read_json_from_url(url) {
//     return await (await fetch(url)).json()
// }

function read_json_from_url(url) {
    fetch(url)
        .then(res => res.json())
        .then((out) => {
            return out
        })
        .catch(err => { throw err })
}


function hasTouchScreen() {
    var hasTouchScreen = false
    if ("maxTouchPoints" in navigator) {
        hasTouchScreen = navigator.maxTouchPoints > 0
    } else if ("msMaxTouchPoints" in navigator) {
        hasTouchScreen = navigator.msMaxTouchPoints > 0
    } else {
        var mQ = window.matchMedia && matchMedia("(pointer:coarse)")
        if (mQ && mQ.media === "(pointer:coarse)") {
            hasTouchScreen = !!mQ.matches
        } else if ('orientation' in window) {
            hasTouchScreen = true // deprecated, but good fallback
        } else {
            // Only as a last resort, fall back to user agent sniffing
            var UA = navigator.userAgent
            hasTouchScreen = (
                /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
            )
        }
    }
    return hasTouchScreen
}



function systemInfo() {
    var window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    var window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

    return {
        window_width: window_width,
        window_height: window_height,
        window_resolution: window_width + "x" + window_height,

        screen_width: screen.width,
        screen_height: screen.height,
        screen_resolution: screen.width + "x" + screen.height,
        screen_colordepth: screen.colorDepth,
        screen_pixeldepth: screen.pixelDepth,
        screen_touchscreen: hasTouchScreen(),

        // Browser
        browser_name: navigator.appName,
        browser_codename: navigator.appCodeName,
        browser_engine: navigator.product,
        browser_version: navigator.appVersion,
        browser: navigator.userAgent,
        // Sytem
        system_platform: navigator.platform,
        system_language: navigator.language
    }
}

/* ROUTINES ================== */


var fixation_cross = {
    type: 'html-keyboard-response',
    stimulus: "<div style='font-size:5em'>+</div>",
    choices: jsPsych.NO_KEYS,
    trial_duration: function () { return randomInteger(250, 750) },
    data: { object: 'fixation_cross' }
}
