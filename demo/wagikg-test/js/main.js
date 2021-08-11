//get list by ajax

// $.ajax({
//   type: 'POST',
//   url: 'http://125.228.2.127/interview/RtrS0811/list.php' ,
//   data: {
//     "action" : "GetList",
//     "table" : "testproductdata"
//   } ,
//   dataType: 'json',
//   success: function(data) { 
//     console.log(data);
//   }, 
//   error : function() { 
//     console.log('error'); 
//   }
// });

let List = [
    {
        "no": "P00001",
        "name": "Total機油",
        "img": "http://125.228.2.127/interview/img/total.jpg",
        "price": "200"
    },
    {
        "no": "P00002",
        "name": "Total2機油",
        "img": "http://125.228.2.127/interview/img/total2.jpg",
        "price": "300"
    },
    {
        "no": "P00003",
        "name": "Total3機油",
        "img": "http://125.228.2.127/interview/img/total3.jpg",
        "price": "450"
    },
    {
        "no": "P00004",
        "name": "Total4機油",
        "img": "http://125.228.2.127/interview/img/total4.jpg",
        "price": "650"
    }
]




addItem(List);
function addItem(data) {
  for (var i = 0; i <=  data.length - 1; i++) {
    let item = '<a class="item col bg-white" data-no="' + data[i].no + '"><div class="item-img"><img src="' + data[i].img + '"></div><div class="item-content"><p>' + data[i].name + '</p><p class="t-red t-lg">$' + data[i].price + '</p></div></a>';
    $('#itemList').append(item);
  }
  itempage();
}

function itempage() {
  $('.item').click(function(){
    let no = $(this).attr('data-no');
    //get detail by ajax
    let detail = [
      {
          "no": "P00002",
          "name": "Total2機油",
          "img": "http://125.228.2.127/interview/img/total2.jpg",
          "price": "300"
      }
    ]
    $('#itemList').empty();
    let itemDetail = '<div class="item col bg-white" data-no="' + detail[0].no + '"><div class="item-img"><img src="' + detail[0].img + '"></div><div class="item-content"><p>' + detail[0].name + '</p><p class="t-red t-lg">$' + detail[0].price + '</p></div></div>';
    let btn = '<a id="addCart" class="btn bg-red t-white">加入購物車</a>';
    let cart = '<a id="cart" class="cart"><img class="icon" src="img/shopping_cart_black_24dp.svg"></a>'
    $('#itemPage').append(itemDetail).append(btn).append(cart);
    let cartNum = 0;
    $('#cart').attr('data-num', cartNum)

    addCartLis(detail, cartNum);
  })

}

function addCartLis(detail, cartNum){
    $('#addCart').click(function () {
      cartNum += 1;
      $('#cart').addClass('hasitem').attr('data-num', cartNum);
      console.log($('#cart').attr('data-num'))
      let buy = {
          "action" : "Add",
          "table" : "testcartdata",
          "colume":{
            "mobile":"0931801080",
            "pno" : detail[0].no,
            "pimg" : detail[0].img,
            "pname" : detail[0].name,
            "pprice" : detail[0].price,
            "pnum" : cartNum
          },
          "redirect":"http://www.google.com"
      }

      $.ajax({
        type: 'POST',
        url: 'http://125.228.2.127/interview/RtrS0811/add.php' ,
        data: buy ,
        dataType: 'json',
        success: function(data) { 
          console.log(data);
        }, 
        error : function() { 
          console.log('error'); 
        }
      });
    })
    $('#cart').click(function () {
      $('#itemPage').empty();
      //get cart by ajax
      var cart = [
          {
              "mobile": "0931801080",
              "pimg": detail[0].img,
              "pno": detail[0].no,
              "pname": detail[0].name,
              "pprice": detail[0].price,
              "pnum": cartNum,
              "total": cartNum * detail[0].price,
              "cTime": "2021-08-11 17:02:32"
          }
      ]
      let itemDetail = '<div class="item col bg-white" data-no="' + detail[0].no + '"><div class="item-img"><img src="' + detail[0].img + '"></div><div class="item-content"><p>' + detail[0].name + '</p><p class="t-red t-lg">$' + detail[0].price + '</p><div><span class="num-text">數量: ' + cartNum + '</span></div></div></div>';
      let total = '<div>總共: ' + cartNum * detail[0].price + '</div>';
      $('#cartPage').append(itemDetail).append(total);
    })



}
