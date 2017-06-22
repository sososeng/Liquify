<<<<<<< HEAD
var bar = new ProgressBar.Circle(circle, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#aaa', width: .5 },
  to: { color: '#5ce2ed', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value);
    }

  }
=======
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
>>>>>>> master
});
bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
bar.text.style.fontSize = '2rem';

bar.animate(1.0);  // Number from 0.0 to 1.0s
