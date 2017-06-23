
      //circle graph
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
        from: { color: '#5ce2ed', width: 5 },
        to: { color: '#5ce2ed', width: 4 },
        // Set default step function for all animate calls
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
          circle.setText("+");
        }
      });
      bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
      bar.text.style.fontSize = '2rem';

      bar.animate(0);  // Number from 0.0 to 1.0s

$(document).ready(function(){


  (function(){
    var offset = moment().utcOffset();
    var api_url = '/api/synctime:'+offset;
       axios.put(api_url)
          .then(function (response) {
            console.log(response.data);

           })
           .catch(function (error) {
             console.error(error);
           });
       })();




});
