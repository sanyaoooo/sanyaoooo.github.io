const ready = function(){
    let id = 'none'
    const channelId = "1655195694";
    const channelSecret = "abbddcf4bfe2a0c3992df47c5d5c139e";
    const redirectUri = "https://sanyaoooo.github.io/cola/";
    const liffUrl = "http://liff.line.me/1655195694-8JJ47j9y";
    const joinUrl = "https://lin.ee/4EFDSRS"; // for event 2023 earth day

    // liff on line
    if(liff.isInClient()){
        liff.init({
            liffId: '1655195694-8JJ47j9y',
        }).then(async() => {
            // Start to use liff's api
            addConsole(liff.isLoggedIn())
            if(liff.isLoggedIn()){
                liff
                .getProfile()
                .then((profile) => {
                    id = profile.userId;
                    addConsole(id)
                })
                .catch((err) => {
                    console.log("error", err);
                });
            }
        }).catch((err) => {
            // Error happens during initialization
            console.log(err.code, err.message);
        });
    }
    document.querySelector('#count_me_a_cup').addEventListener('click', (e) => {
        if(liff.isInClient()){
            userJoin(id)
        }
        // on other browser
        else {
            let uuid = _uuid()
            let loginUrl = 'https://access.line.me/oauth2/v2.1/authorize?'
            // 必填
            loginUrl += 'response_type=code' // 希望LINE回應什麼  但是目前只有code能選
            loginUrl += `&client_id=${channelId}` // 你的頻道ID
            loginUrl += `&redirect_uri=${redirectUri}` // 要接收回傳訊息的網址
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
    })

    // if get login code
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.has('code')){
        const code = urlParams.get('code')
        console.log(code);
        const data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirectUri,
            "client_id": channelId,
            "client_secret": channelSecret
        }
        var formBody = [];
        for (var property in data) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

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
            console.log(json)
            window.open(joinUrl)
        })
        .catch(function(error) {
            console.log(error)
            addConsole('error: ' + error)
        });
    }
    

    // share liff
    const shareBtns = document.querySelectorAll('.share-btn')
    shareBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            shareEvent(btn, liffUrl)
        })
    })

    initSwiper()
    
}

function userJoin(userid) {
    fetch("https://zyjeng.com/api/cola", {
        method: "POST",
        body: JSON.stringify({
            userId: userid,
            endpoint: "0",
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) => response.json() )
    .then((json) => addConsole('response: ' + JSON.stringify(json)))
    .catch(function(error) {
        addConsole('error: ' + error)
    });

    // 開啟好盒器 LINE
    liff.openWindow({
        url: joinUrl,
    });
    // liff.closeWindow();  //關閉視窗
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

function shareEvent(btn, liffUrl){
    if(liff.isInClient()){
        liff
        .shareTargetPicker(
            [
            {
                type: "text",
                text: "來麥當勞借循環杯，請你可口可樂喝一杯！%0A" + liffUrl,
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
            } else {
            // sending message canceled
            console.log("TargetPicker was closed!");
            }
        })
        .catch(function (error) {
            // something went wrong before sending a message
            console.log("something wrong happen");
        });
    } else {
        // Get the text field
        var copyText = "來麥當勞借循環杯，請你可口可樂喝一杯\r\n" + liffUrl;

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText);
        btn.querySelector('.copy-hint').classList.add('active')
        setTimeout(() => {
            btn.querySelector('.copy-hint').classList.remove('active')
        }, 1600)
    }
}

function addConsole(content){
    // document.querySelector('#console').innerHTML += content + '<br />'
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