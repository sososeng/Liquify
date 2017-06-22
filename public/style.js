$( document ).ready(function() {
    $('.plus-button').click(function(){
      var api_url = '/api/drinkup';
        axios.put(api_url)
          .then(function (response) {
            console.log(response.data);
            if(response.data.value >0){
              $("#cup1").css("color", "blue");
            }
            if(response.data.value >1){
              $("#cup2").css("color", "blue");
            }
            if(response.data.value >2){
              $("#cup3").css("color", "blue");
            }
            if(response.data.value >3){
              $("#cup4").css("color", "blue");
            }
            if(response.data.value >4){
              $("#cup5").css("color", "blue");
            }
            if(response.data.value >5){
              $("#cup6").css("color", "blue");
            }
            if(response.data.value >6){
              $("#cup7").css("color", "blue");
            }
            if(response.data.value >7){
              $("#cup8").css("color", "blue");
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      });
});
