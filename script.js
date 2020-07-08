var wavespeed = 200;
var wavecolor = 'red';
var waveheight_str = '';
var dis_lin = 0;

// USGS Ajax Query
$('#query').click(function() { //TODO: Shift to on page load, query streamflow and animate from result
	$.ajax({
      url:"https://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=04119055&parameterCd=00060",
	  dataType: 'json',
	  data: '',
	  success: function(json){
          //Display measurement
           $('#discharge-reading').text(json.value.timeSeries[0].values[0].value[0].value);
           //Animate by measurement
		   animateWave(json.value.timeSeries[0].values[0].value[0].value);
		 },
	  error : function(XMLHttpRequest, textStatus, errorThrown) {
          //TODO actual error handling
           $('#discharge-reading').text('unknown');
           //For testing, while I'm block to a 403 error
           var fake_discharges = [2,8,11,20,500,900,1800];
		   animateWave(fake_discharges[Math.floor(Math.random()*7)]);
	  }
	});
});

var svg_canvas = SVG().addTo('#wave_frame').viewbox(0, 0, 1440, 320)
svg_canvas.attr("preserveAspectRatio", 'none');
svg_canvas.attr("width",'100%');

//Waves generated with getwaves.io
//Draw inital wave shape on svg canvas

//SPARE WAVES
//"M0,32L120,58.7C240,85,480,139,720,138.7C960,139,1200,85,1320,58.7L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"

// "M0,96L120,90.7C240,85,480,75,720,80C960,85,1200,107,1320,117.3L1440,128L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"

//"M0,160L120,144C240,128,480,96,720,80C960,64,1200,64,1320,64L1440,64L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"

wavePath = svg_canvas.path('M0,96L120,90.7C240,85,480,75,720,80C960,85,1200,107,1320,117.3L1440,128L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z').attr({ fill: 'none', stroke:'red'})

function animateWave(discharge_reading) {
    console.log("discharge reading: " + discharge_reading);
    //6-1030 -> 0–100 (flattens exponential)
    dis_lin = Math.log2(Math.abs(discharge_reading-5))*10;
    console.log("dis. linear: " + dis_lin);
    // COLOR 0–100 -> gradient percentage
    wavecolor = pickRGB([26,41,62], [165,221,237], dis_lin/100);
    console.log("wavecolor: " + 'rgb('+wavecolor.join()+')');
    wavePath.attr({ fill: 'rgb('+wavecolor.join()+')', stroke:'none'});
    // SPEED 0–100 -> 5000–400 (smaller for higher discharges)
    //Wavespeed only updates animation once, only changes on page reload
    wavespeed = 5000-(dis_lin*((5000-400)/100))
    console.log("wavespeed: " + wavespeed);
    // HEIGHT 0–100 -> 5–100%ish window height
    waveheight_str = window.innerHeight*(dis_lin/100)
    wavePath.animate(wavespeed).ease('<>')
      .plot('M0,160L120,144C240,128,480,96,720,80C960,64,1200,64,1320,64L1440,64L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z')
      .loop(true, true)
    svg_canvas.attr("height", waveheight_str);
  }
//Helper function chooses from between a gradient on a 0–1 scale
//Taken from http://jsfiddle.net/vksn3yLL/
  function pickRGB(color1, color2, weight) {
    var p = weight;
    var w = p * 2 - 1;
    var w1 = (w/1+1) / 2;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
}

$('#about-X').on('click', function() {
    $('#about-text-container').removeClass('show-about');
});

$('#about-mark-container').on('click', function() {
    $('#about-text-container').addClass('show-about');
});
