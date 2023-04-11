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

                // if get login code
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                if(urlParams.has('code')){
                    document.querySelector('#count_me_a_cup').click()
                }

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

    // share liff
    const shareBtns = document.querySelectorAll('.share-btn')
    shareBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            shareEvent(btn, siteUrl)
        })
    })

    initSwiper()
    
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
    if(liff.isApiAvailable('shareTargetPicker') && liff.isInClient()){
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