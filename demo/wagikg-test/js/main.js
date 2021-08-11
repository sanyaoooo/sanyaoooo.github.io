$.ajax({
  type: 'POST',
  url: 'http://125.228.2.127/interview/RtrS0811/list.php' ,
  data: {
    "action" : "GetList",
    "table" : "testproductdata"
  } ,
  dataType: 'json',
  success: function(data) { 
    console.log(data);
  }, 
  error : function() { 
    console.log('error'); 
  } 
});