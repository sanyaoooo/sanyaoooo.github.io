let userId = 'none'
const channelId = "1655195694";
const channelSecret = "abbddcf4bfe2a0c3992df47c5d5c139e";
const siteUrl = "https://sanyaoooo.github.io/cola";
const liffId = '1655195694-8JJ47j9y';
const liffUrl = 'https://liff.line.me/1655195694-8JJ47j9y';
const joinUrl = "https://lin.ee/4EFDSRS"; // for event 2023 earth day
const apiUrl = "https://app.goodtogo.tw/dev/engagement/campaign/2023earthday"


// 傳資料到好盒器 & 開啟LINE BOT
function userJoin(id) {
    if(id !== "none" && id !== undefined){
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "line-id": id
            }
        })
        .then( (response) => response.json() )
        .then( function(json) {
            addConsole('Join response: ' + JSON.stringify(json))
            // 開啟好盒器 LINE
            if(liff.isInClient()){
                liff.openWindow({
                    url: joinUrl,
                });
            }else {
                window.open(joinUrl, '_self')
            }
        })
        .catch(function(error) {
            addConsole('Join error: ' + error)
        });
    }
}

const ready = function(){
    // liff on line
    liff.init({
        liffId: liffId,
    }).then(async() => {
        // Start to use liff's api
        addConsole('isLoggedIn: ' + liff.isLoggedIn())
        // console.log(liff.getContext())

        if(liff.isLoggedIn()){
            liff
            .getProfile()
            .then((profile) => {
                userId = profile.userId;
                addConsole(userId)
            })
            .catch((err) => {
                console.log("error", err);
            });
        }
    }).catch((err) => {
        // Error happens during initialization
        console.log(err.code, err.message);
    });

    addConsole('isInClient: ' + liff.isInClient())

    document.querySelector('#count_me_a_cup').addEventListener('click', (e) => {
        if(liff.isLoggedIn()){
            // 傳資料到好盒器 & 開啟LINE BOT
            userJoin(userId)
        } else {
            liff.login({ redirectUri: siteUrl });
            // userLogin()
        }
    })

    if(document.querySelector('#logout')){
        document.querySelector('#logout').addEventListener('click', (e) => {
            if(liff.isLoggedIn()){
                liff.logout()
            }
        })
    }

    // if get login code
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.has('code')){
        console.log('has code, isLoggedIn: ' + liff.isLoggedIn())
        document.querySelector('#count_me_a_cup').click()
        // addConsole('isLoggedIn: ' + liff.isLoggedIn())
        // if(liff.isLoggedIn()){
        //     userJoin()
        // }
        // getIDToken(code)
    }

    // share liff
    const shareBtns = document.querySelectorAll('.share-btn')
    shareBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            shareEvent(btn, siteUrl)
        })
    })

    initSwiper()
    
}

function userLogin(){
    let uuid = _uuid()
    let loginUrl = 'https://access.line.me/oauth2/v2.1/authorize?'
    // 必填
    loginUrl += 'response_type=code' // 希望LINE回應什麼  但是目前只有code能選
    loginUrl += `&client_id=${channelId}` // 你的頻道ID
    loginUrl += `&redirect_uri=${siteUrl}` // 要接收回傳訊息的網址
    loginUrl += `&state=${uuid}` // 用來防止跨站請求的 之後回傳會傳回來給你驗證
    loginUrl += '&scope=openid%20profile' // 跟使用者要求的權限 目前就三個能選 openid profile email
    // 選填
    loginUrl += '&nonce=goodToGo'
    loginUrl += '&prompt=consent'
    loginUrl += '&max_age=3600'
    loginUrl += '&ui_locales=zh-TW'
    loginUrl += '&bot_prompt=normal'
    window.open(loginUrl, "_self")
}

function getIDToken(code){
    const data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": siteUrl,
        "client_id": channelId,
        "client_secret": channelSecret
    }
    let formBody = encodeJson(data)
    fetch("https://api.line.me/oauth2/v2.1/token", {
        body: formBody, // must match 'Content-Type' header
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(json) {
        // console.log(json)
        getProfile(json.id_token)
    })
    .catch(function(error) {
        console.log(error)
        addConsole('getIDToken error: ' + error)
    });
}

function getProfile(token){
    const data = {
        "id_token": token,
        "client_id": channelId,
    }
    let formBody = encodeJson(data)
    fetch("https://api.line.me/oauth2/v2.1/verify", {
        body: formBody, // must match 'Content-Type' header
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(json) {
        // console.log(json)
        return json.sub
    })
    .then(function(id){
        addConsole('getProfile ID: ' + id)
        if(id !== undefined){
            userJoin(id)
        }
    })
    .catch(function(error) {
        console.log(error)
        addConsole('getProfile error: ' + error)
    });
}

function initSwiper(){
    const swiperBtnTextArr = ['台北(14)', '台南(6)']
    // swiper
    const swiper = new Swiper('.swiper', {
        // Optional parameters
        slidesPerView: 1,
        spaceBetween: 8,
        autoHeight: true,
        pagination: {
            el: '.tab-button-wrap',
            type: 'bullets',
            clickable: true,
            bulletClass: 'tab-button',
            bulletActiveClass: 'active',
            renderBullet: function (index, className) {
                return `<button class="${className}">${swiperBtnTextArr[index]}</button>`;
            },
        },
      
    });
}

function shareEvent(btn, url){
    if(liff.isApiAvailable('shareTargetPicker')){
        liff
        .shareTargetPicker(
            [
            {
                type: "text",
                text: "來麥當勞借循環杯，請你可口可樂喝一杯！%0A" + url,
            },
            ],
            {
                isMultiple: true,
            }
        )
        .then(function (res) {
            if (res) {
            // succeeded in sending a message through TargetPicker
            console.log(`[${res.status}] Message sent!`);
            addConsole(`[${res.status}] Message sent!`)
            } else {
            // sending message canceled
            console.log("TargetPicker was closed!");
            addConsole('TargetPicker was closed!')
            }
        })
        .catch(function (error) {
            // something went wrong before sending a message
            console.log("something wrong happen");
            addConsole('error: ' + error)
        });
    } else if (navigator.share) {
        navigator.share({
          title: '可口可樂x麥當勞x好盒器',
          text: '來麥當勞借循環杯，請你可口可樂喝一杯！',
          url: siteUrl,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
        // Get the text field
        var copyText = "來麥當勞借循環杯，請你可口可樂喝一杯\r\n" + url;

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText);
        btn.querySelector('.copy-hint').classList.add('active')
        setTimeout(() => {
            btn.querySelector('.copy-hint').classList.remove('active')
        }, 1600)
    }
}

function addConsole(content){
    document.querySelector('#console').innerHTML += content + '<br />'
}

function encodeJson(data){
    var formBody = [];
    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody
}

function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// document.ready
if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    ready();
} else {
    document.addEventListener("DOMContentLoaded", ready);
} 