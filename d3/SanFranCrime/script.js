var margin = {top: 45, right: 50, bottom: 25, left: 50},
    width = 760 - margin.left - margin.right,
    height = 70 - margin.bottom - margin.top;



var timer1;
var Category;
var flag=false;
var locations ={};
var i=0
var heat={};
var maps={};
d3.csv("data.csv", function(data) {
	var parse = d3.time.format("%Y-%m-%d %X").parse,
	get_hour = d3.time.format("%H"),
	get_minute = d3.time.format("%M");
	
	data.forEach(function(d){
		var hour = parseInt(get_hour(parse(d.Dates))),
			minute = parseInt(get_minute(parse(d.Dates))),
			time_id = hour*60+minute;
		if(d.Category in locations){
			if(time_id in locations[d.Category]){
				locations[d.Category][time_id].push([d.Y,d.X]);
			}else{
				locations[d.Category][time_id]=[[d.Y,d.X]];
			}
		}else{
			locations[d.Category]={};
			locations[d.Category][time_id]=[[d.Y,d.X]];
		}
	})
	
	//Option

	Category=Object.keys(locations);
	//Category=["LARCENY/THEFT"];

	  
	//maps
	var map_width=280,
	map_height=200;
	d3.select("body").selectAll("div").data(Object.keys(locations)).enter().append("div")
	.attr("id",function(d){return d;})
	.attr("style",function(d,i){return "position: absolute;width: "+map_width+"px;height:"+map_height+"px;left:"+(45+(map_width+5)*((i)%4))+"px;top:"+(200+(map_height+5)*Math.floor((i)/4))+"px"})
	d3.select("body").selectAll("text").data(Object.keys(locations)).enter().append("text")
	.attr("fill","black").attr("style",function(d,i){return "position: absolute;width: "+map_width+"px;height:"+map_height+"px;left:"+(45+(map_width+5)*((i)%4))+"px;top:"+(200+(map_height+5)*Math.floor((i)/4))+"px"})
.text(function(d){return d;})
	Object.keys(locations).forEach(function(d){
		maps[d] = (L.map(d, {center: [37.7585,-122.44], zoom: 11,zoomControl:false,dragging:false,scrollWheelZoom:false})
    .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")));
	})
	
	//slider
	var scale_linear = d3.scale.linear()
		.domain([0, 24*60-1])
		.range([0, width])
		.clamp(true);

	var brush = d3.svg.brush()
		.x(scale_linear)
		.extent([0, 0])
		.on("brush", brushed);

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("style","top: 120px;left: 70px;position: absolute")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height / 2 + ")")
		.call(d3.svg.axis()
		.scale(scale_linear)
		.orient("bottom")
		.tickFormat(function(d) { return ('0'+Math.floor(d/60)).slice(-2)+":"+('0'+d%60).slice(-2); })
		.tickSize(0)
		.tickPadding(12))
		.select(".domain")
		.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
		.attr("class", "halo");

	var slider = svg.append("g")
		.attr("class", "slider")
		.call(brush);

	slider.selectAll(".extent,.resize")
		.remove();

	slider.select(".background")
		.attr("height", height);

	var handle = slider.append("g")
		.attr("class", "handle")
	handle.append("circle")
		.attr("transform", "translate(0," + height / 2 + ")")
		.attr("r", 9);
	handle.append('text')
		.text("00:00")
		.attr("transform", "translate(" + (-12) + " ," + (height / 2-11) + ")");


function brushed() {
  var value = brush.extent()[0];
	
  if (d3.event.sourceEvent) { // not a programmatic event
    value = scale_linear.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
	flag=true;
  }
  handle.attr("transform", "translate("+ scale_linear(value)+",0)");
  handle.select('text').text(('0'+Math.floor(value/60)).slice(-2)+":"+('0'+Math.floor(value)%60).slice(-2));
  Category.forEach(function(c){
	  heat[c] = print_heat(locations,c,Math.floor(value),maps[c],heat[c]);
  });
  
}
	
	var timer1 = setInterval(function(){
		i=i+1;
		if(i==24*60) i=0;
		if(flag) clearInterval(timer1);
		
		slider
    .call(brush.event)
    .call(brush.extent([i, i]))
    .call(brush.event);
		
	},25);

	
})


function print_heat(locations,Category,time_id,map,heat){
	var temp=[]
	if(heat!=undefined) map.removeLayer(heat);
	for(var i=0;i<60;i++){
		t=time_id+i;
		if(t>=24*60)
			t=t-24*60;
		if((time_id==23*60+1 && i==59) || (time_id==1 && i==0)) t=1;
		if(t in locations[Category]) temp=temp.concat(locations[Category][t]);
		
	}
	
	if(temp.length>0){
		heat = L.heatLayer(temp,{
			minOpacity:0.05,
            radius: 15,
            blur: 12, 
            maxZoom: 17,
		});
	}
	if(heat!=undefined) map.addLayer(heat);
	return heat;
}







