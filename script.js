var wavespeed = 200;
var wavecolor = 'red';
var waveheight_str = '';
var dis_lin = 0;

// USGS Ajax Query
$('#query').click(function() { //TODO: Shift to on page load, query streamflow and animate from result
	$.ajax({
	  // url: "https://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&sites=04119055&parameterCd=00060",
      //TESTING
      url:"https://www.fakeURL.com",
	  dataType: 'json',
	  data: '',
	  success: function(json){
           $('#discharge-reading').text(json.value.timeSeries[0].values[0].value[0].value);
		   animateWave(json.value.timeSeries[0].values[0].value[0].value);
		 },
	  error : function(XMLHttpRequest, textStatus, errorThrown) {
           $('#discharge-reading').text('unknown');
           var fake_discharges = [2,8,11,20,500,900,1800];
		   animateWave(fake_discharges[Math.floor(Math.random()*7)]);
	  }
	});
});


//Wave animation //Waves generated with getwaves.io
var svg_canvas = SVG().addTo('#wave_frame').viewbox(0, 0, 1440, 320)

svg_canvas.attr("preserveAspectRatio", 'none');
svg_canvas.attr("width",'100%');

wavePath = svg_canvas.path('M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,96C960,107,1056,117,1152,138.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z').attr({ fill: 'none', stroke:'red'})

function animateWave(discharge_reading) {
    console.log("discharge reading: " + discharge_reading);
    //6-1030 -> 0–100 (flattens exponential)
    dis_lin = Math.log2(Math.abs(discharge_reading-5))*10;
    console.log("dis. linear: " + dis_lin);
    // 0–100 -> gradient percentage
    wavecolor = pickRGB([26,41,62], [165,221,237], dis_lin/100);
    console.log("wavecolor: " + 'rgb('+wavecolor.join()+')');
    // 0–100 -> 5000–400 (smaller for higher discharges)
    //Wavespeed only updates once, only changes on page reload
    wavespeed = 5000-(dis_lin*((5000-400)/100))
    console.log("wavespeed: " + wavespeed);
    // 0–100 -> 5–100%ish window height
    waveheight_str = window.innerHeight*(dis_lin/100)
   //for getting a color from a gradient by a percentage, look into http://jsfiddle.net/jongobar/sNKWK/
    wavePath.attr({ fill: 'rgb('+wavecolor.join()+')', stroke:'none'});
    wavePath.animate(wavespeed).ease('<>')
      .plot('M0,256L48,229.3C96,203,192,149,288,112C384,75,480,53,576,53.3C672,53,768,75,864,80C960,85,1056,75,1152,69.3C1248,64,1344,64,1392,64L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z')
      .loop(true, true)
    svg_canvas.attr("height", waveheight_str);
  }

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
