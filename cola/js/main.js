let userId = 'none'
const siteUrl = "https://sanyaoooo.github.io/cola";
const liffId = '1655196878-X4ZDmaQl';
const liffUrl = 'https://liff.line.me/1655196878-X4ZDmaQl';
const joinUrl = "https://lin.ee/4EFDSRS"; // 測試帳號的加友連結 for event 2023 earth day
// const joinUrl = "https://lin.ee/nTpgglc"; // 正式帳號的加入好友連結 for event 2023 earth day
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
        gtag('event', 'click', {
            'event_category': '開啟LINE BOT',
            'event_label': '我要參加',
        });
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
    if(liff.isLoggedIn() && liff.isApiAvailable('shareTargetPicker')){
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
            gtag('event', 'click', {
                'event_category': '分享',
                'event_label': '邀請朋友一起參加 (line)',
            });
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
            shareOnBrowser(btn, url)
            // something went wrong before sending a message
            console.log("TargetPicker something wrong happen");
            addConsole('TargetPicker Error: ' + error)
        });
    } else {
        shareOnBrowser(btn, url)
    }
}

function shareOnBrowser(btn, url){
    if (navigator.share) {
        navigator.share({
          title: '可口可樂x麥當勞x好盒器',
          text: '來麥當勞借循環杯，請你可口可樂喝一杯！',
          url: siteUrl,
        })
        .then(() => {
            gtag('event', 'click', {
                'event_category': '分享',
                'event_label': '邀請朋友一起參加 (browser share)',
            });
            console.log('Successful share')
        })
        .catch((error) => {
            copyShareText(btn, url)
            console.log('Error sharing', error)
        });
    } else {
        copyShareText(btn, url)
    }
}

function copyShareText(btn, url){
    gtag('event', 'click', {
        'event_category': '分享',
        'event_label': '邀請朋友一起參加 (copy text)',
    });
    // Get the text field
    var copyText = "來麥當勞借循環杯，請你可口可樂喝一杯\r\n" + url;

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);
    btn.querySelector('.copy-hint').classList.add('active')
    setTimeout(() => {
        btn.querySelector('.copy-hint').classList.remove('active')
    }, 1600)
}

function addConsole(content){
    document.querySelector('#console').innerHTML += content + '<br />'
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