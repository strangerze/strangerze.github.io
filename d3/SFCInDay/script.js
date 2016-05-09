var margin = {top: 5, right: 10, bottom: 10, left: 20},
    width = 800 - margin.left - margin.right,
    height = 100 - margin.bottom - margin.top;

var flag=true;
var time_i=0;
var heat;
d3.csv("../data/SanFranciscoCrime2014.csv", function(data) {
	var parse = d3.time.format("%Y-%m-%d %X").parse,
	get_hour = d3.time.format("%H"),
	get_minute = d3.time.format("%M");
	var locations ={};
	var Category;
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
	Category=Object.keys(locations);
	var time_series={}
	Category.forEach(function(c){
		time_series[c]=[]
		for(var j=0;j<24*60;j++){
			var n=0;
			for(var i=0;i<60;i++){
				t=j+i;
				if(t>=24*60)
				t=t-24*60;
				if(j==23*60+1 && i==59) t=1;
				if(j==1 && i==0) t=0;
				if(t in locations[c]) n = n+ locations[c][t].length;
			}
			time_series[c].push(n);
		}
			
	});
//Option

	var table = d3.select("#check_list").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");
	thead.append("tr")
        .selectAll("th")
        .data(["Category","Percentage"])
        .enter()
        .append("th")
            .text(function(column) { return column; });
	var rows = tbody.selectAll("tr")
        .data(Category)
        .enter()
        .append("tr");
	var check_list = rows.append("td").append("div");
	check_list.append("input")
			.attr("type","checkbox")
			.attr("checked", true)
			.attr("value",function(d){ return d; })
			.on("change", function() {
				if(this.checked){
					Category.push(this.value);
					
				}else{
					var index = Category.indexOf(this.value);
					if (index > -1) Category.splice(index, 1);
				}
				o_flag=flag;
				flag=false;
				nrecords = cal_time_series(Category);
				y_scale.domain([Math.min(...nrecords), Math.max(...nrecords)]);
				yAxis.scale(y_scale);
				y_axis=svg.transition().duration(750)
					.select(".y.axis").call(yAxis);
				y_axis.selectAll("line").attr("x2",width).attr("stroke-dasharray","5,5").attr("style","stroke:rgb(50,50,50);stroke-width: 2px;");
				line.y(function(d) { return y_scale(d); });
				path_line
					.datum(nrecords)				
					.transition().duration(750)
					.attr("d", line);
				heat = print_heat(locations,Category,time_i,map,heat);
				flag=o_flag;
			});
	check_list.append("label").text(function(d){ return d; });
	var records_now = cal_nrecords_now(time_i);
	var bars = rows.append("td").append("div").attr("class","bar")
					.style("height","23")
					.style("width",function(d){return 146*time_series[d][time_i]/records_now;});
		bars.append("label").text(function(d){return (100*time_series[d][time_i]/records_now).toFixed(1)+"%";});
	//map
	var map = (L.map("map", {center: [37.7585,-122.44], zoom: 12})
    .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")));
	
	
	//slider
	nrecords = cal_time_series(Category);
	var x_scale = d3.scale.linear()
		.domain([0, 24*60-1])
		.range([0, width]).clamp(true);
	var y_scale = d3.scale.linear()
		.domain([Math.min(...nrecords), Math.max(...nrecords)])
		.range([height,0]);
	var xAxis = d3.svg.axis()
		.scale(x_scale)
		.ticks(8)
		.orient("bottom")
		.tickFormat(function(d) { return ('0'+Math.floor(d/60)).slice(-2)+":"+('0'+d%60).slice(-2); });
	var yAxis = d3.svg.axis()
		.scale(y_scale)
		.ticks(2)
		.orient("left");
	var line = d3.svg.line()
		.x(function(d,i) { return x_scale(i); })
		.y(function(d) { return y_scale(d); });
	var brush = d3.svg.brush()
		.x(x_scale)
		.extent([0, 0])
		.on("brush", brushed);

	var svg = d3.select("#slider").append("svg")
		.attr("style","width:100%;height:100%")
		.attr("viewBox","-40,0,860,110")
		.attr("preserveAspectRatio","none")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var slider = svg.append("rect").attr("class","slider").attr("x",0).attr("y",0).attr("width",width).attr("height",height)
	.attr("style","fill: rgba(200, 200, 200, 0.5);stroke:rgb(0,0,0)").call(brush);
	slider.selectAll(".extent,.resize")
    .remove();
	//svg.append("path").attr("d","M 0 "+height/3+" L "+width+" "+height/3).attr("stroke-dasharray","5,5").attr("style","stroke:rgb(20,20,20)");
	//svg.append("path").attr("d","M 0 "+height*2/3+" L "+width+" "+height*2/3).attr("stroke-dasharray","5,5").attr("style","stroke:rgb(20,20,20)");
	
	x_axis = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
	y_axis = svg.append('g')
		.attr('class', 'y axis')
		.call(yAxis);
	y_axis.selectAll("line").attr("x2",width).attr("stroke-dasharray","5,5").attr("style","stroke:rgb(50,50,50);stroke-width: 2px;");
	var path_line=svg.append("path")
		.datum(nrecords)
		.attr("class", "line")
		.attr("d", line);
	
		

	var handle=svg.append("line").attr("style","stroke:black;stroke-width: 4px;cursor: hand;")
		.attr("x1", 0)
		.attr("x2",0)
		.attr("y1",0)
		.attr("y2",height)
		.attr("cursor","hand")
		.call(brush);
	
	var record_num=d3.select("#foot").select("#records").select("#record_num");
	record_num.text(nrecords[0]);

	function brushed() {
		var value = brush.extent()[0];
	
		if (d3.event.sourceEvent) { // not a programmatic event
			value = x_scale.invert(d3.mouse(this)[0]);
			brush.extent([value, value]);
			time_i = Math.floor(value);
			document.getElementById("stop_button").value = "START";
			document.getElementById("stop_button").textContent = "START";
			flag=false;
		}
		handle.attr("x1", x_scale(value))
		.attr("x2",x_scale(value));
		records_now = cal_nrecords_now(time_i);
		bars.style("width",function(d){return 146*time_series[d][time_i]/records_now;});
		bars.select("label").text(function(d){return (100*time_series[d][time_i]/records_now).toFixed(1)+"%";});
		document.getElementById("show_time").textContent=('-'+('0'+Math.floor(value/60)).slice(-2)+":"+('0'+Math.floor(value)%60).slice(-2)+'-');
		record_num.text(nrecords[Math.floor(value)]);
		heat = print_heat(locations,Category,Math.floor(value),map,heat);
		
  
	}
	function cal_nrecords_now(time_id){
		var n=0;
		Object.keys(locations).forEach(function(c){
			n=n+time_series[c][time_id];
		});
		return n;
	}
	function cal_time_series(Category){
		var records=[];
		for(var j=0;j<24*60;j++){
			var n=0;
			Category.forEach(function(c){
				n=n+time_series[c][j];
			});
			records.push(n/365);
		}
		return records;
	}
	function print_heat(locations,Category,time_id,map,heat){
		var temp=[]
		var new_heat=null
		if(heat!=null) map.removeLayer(heat);
		for(var i=0;i<60;i++){
			t=time_id+i;
			if(t>=24*60)
				t=t-24*60;
			if(time_id==23*60+1 && i==59) t=1;
			if(time_id==1 && i==0) t=0;
			Category.forEach(function(c){
				if(t in locations[c]) temp=temp.concat(locations[c][t]);
			});
		}
	
		if(temp.length>0){
			new_heat = L.heatLayer(temp,{
				minOpacity:0.01,
				radius: 15,
				blur: 12, 
				maxZoom: 17,
			});
		}
		if(new_heat!=null) map.addLayer(new_heat);
		return new_heat;
	}

	
	var timer1 = setInterval(function(){
		//flag=false;
		if(flag){
			time_i=time_i+1;
			if(time_i==24*60) time_i=0;
			slider
			.call(brush.event)
			.call(brush.extent([time_i, time_i]))
			.call(brush.event);
		}
		
		
	},25);
});
	




function button_click(button_id){
	if(document.getElementById(button_id).value=="STOP"){
		document.getElementById(button_id).value = "START";
		document.getElementById(button_id).textContent = "START";
		flag=false;
	}else{
		document.getElementById(button_id).value = "STOP";
		document.getElementById(button_id).textContent = "STOP";
		flag=true;
	}
}