const ready = function(){
    let id = 'none'
    const channelId = "1655195694";
    const channelSecret = "abbddcf4bfe2a0c3992df47c5d5c139e";
    const redirectUri = "https://sanyaoooo.github.io/cola";
    const liffUrl = "http://liff.line.me/1655195694-8JJ47j9y";

    // liff on line
    if(liff.isInClient()){
        liff.init({
            liffId: '1655195694-8JJ47j9y',
        }).then(async() => {
            // Start to use liff's api
            addConsole(liff.isLoggedIn())
            if(liff.isLoggedIn()){

                liffIsLoggeIn = true;

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
            const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channelId}&redirect_uri=${redirectUri}&state=123456789&scope=openid%20profile&nonce=goodToGo&prompt=consent&max_age=3600&ui_locales=zh-TW&bot_prompt=aggressive`
            // window.open(loginUrl, "_self")
            fetch(loginUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                console.log(myJson);
            });
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
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        fetch("https://api.line.me/oauth2/v2.1/token", {
            body: formBody, // must match 'Content-Type' header
            headers: {
              'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            credentials: 'include',
            mode: 'no-cors',
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
          })
          .then(response => response.json()) // 輸出成 json
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
        url: "http://line.me/ti/p/@uuo6498s",
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

// document.ready
if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    ready();
} else {
    document.addEventListener("DOMContentLoaded", ready);
} 