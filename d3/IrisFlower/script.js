var width = 960,
    height = 550
    
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

function col_x(i){
	return i*200+100;
}
var axis_g=svg.append("g");
for(var i=0;i<4;i++){
	axis_g.append("line")
    .attr("class", "axis")
    .attr("x1", col_x(i))
    .attr("x2", col_x(i))
	.attr("y1",10)
	.attr("y2",490);
}
var control_g=svg.append("g");
var label_g=svg.append("g");
var color = d3.scale.category10();
var linear = d3.scale.linear().range([10, 490]);
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Sepal Length:</strong> <span style='color:red'>" + d["Sepal Length"] + "</span><br><strong>Sepal Width:</strong> <span style='color:red'>"+ d["Sepal Width"] + "</span></br><strong>Petal Length:</strong> <span style='color:red'>"+ d["Petal Length"] + "</span></br><strong>Petal Width:</strong> <span style='color:red'>"+ d["Petal Width"] + "</span>";
  })

var data_c=svg.append("g");
svg.call(tip);
d3.csv("IrisData.txt", function(error, data) {
  if (error) throw error;
  
  var domainByTrait = {},
      traits = d3.keys(data[0]).filter(function(d) { return d !== "Class"; }),
      n = traits.length;
  function highlight(c){
      data_c.selectAll("g").filter(function(d){return d["Class"]==c;}).attr("class","highlight");
  }
  function back(c){
      data_c.selectAll("g").filter(function(d){return d["Class"]==c;}).attr("class","link");
  }
  function choose(c){
      data_c.selectAll("g").filter(function(d){return d["Petal Length"]>c.Petal_Length_min & d["Petal Length"]<=c.Petal_Length_max & d["Petal Width"]>c.Petal_Width_min & d["Petal Width"]<=c.Petal_Width_max;}).attr("class","highlight");
  }
function unchoose(c){
      data_c.selectAll("g").filter(function(d){return d["Petal Length"]>c.Petal_Length_min & d["Petal Length"]<=c.Petal_Length_max & d["Petal Width"]>c.Petal_Width_min & d["Petal Width"]<=c.Petal_Width_max;}).attr("class","link");
  }
  var classes = d3.scale.ordinal().domain(data.map(function(d){return d["Class"];})).domain();
  control_g.selectAll("g")
	  .data(classes)
	  .enter()
	  .append("text")
		.attr("class","label")
		.attr("x",800)
		.attr("y",function(d,i){return 50+50*i;})
		.attr("fill",function(d){return color(d);})
		.text(function(d){return d;})
		.on("mouseover",highlight)
	    .on("mouseout",back);
   var jsonCircles = [
   { "x_axis": 850, "y_axis": 230, "radius": 10, "Petal_Length_min" : 0,"Petal_Length_max" : 7, "Petal_Width_min" : 0, "Petal_Width_max" : 3 ,"color":"white"},
   { "x_axis": 800, "y_axis": 280, "radius": 10, "Petal_Length_min" : 0,"Petal_Length_max" : 1.9, "Petal_Width_min" : 0, "Petal_Width_max" : 3,"color":"blue"},
   { "x_axis": 900, "y_axis": 280, "radius": 10, "Petal_Length_min" : 1.9,"Petal_Length_max" : 7, "Petal_Width_min" : 0, "Petal_Width_max" : 3,"color":"white"},
   { "x_axis": 850, "y_axis": 330, "radius": 10, "Petal_Length_min" : 1.9,"Petal_Length_max" : 7, "Petal_Width_min" : 0, "Petal_Width_max" : 1.7,"color":"white"},
   { "x_axis": 950, "y_axis": 330, "radius": 10, "Petal_Length_min" : 1.9,"Petal_Length_max" : 7, "Petal_Width_min" : 1.7, "Petal_Width_max" : 3,"color":"green"},
   { "x_axis": 800, "y_axis": 380, "radius": 10, "Petal_Length_min" : 1.9,"Petal_Length_max" : 4.9, "Petal_Width_min" : 0, "Petal_Width_max" : 1.7,"color":"orange"},
   { "x_axis": 900, "y_axis": 380, "radius": 10, "Petal_Length_min" : 4.9,"Petal_Length_max" : 7, "Petal_Width_min" : 0, "Petal_Width_max" : 1.7,"color":"green"},];
   var circles=control_g.selectAll("circle").data(jsonCircles).enter().append("circle");
   var circleAttributes = circles
                      .attr("cx", function (d) { return d.x_axis; })
                      .attr("cy", function (d) { return d.y_axis; })
                      .attr("r", function (d) { return d.radius; })
                      .attr("fill", function (d) { return d.color; })
                      .attr("stroke", "black")
                      .on("mouseover", choose)
                      .on("mouseout", unchoose)
	              ;
  label_g.append("text").attr("fill","black").attr("x",750).attr("y",190).text("Decision Tree:")
  label_g.append("text").attr("fill","black").attr("x",750).attr("y",30).text("Class:")
  label_g.append("text").attr("fill","black").attr("x",815).attr("y",215).attr("font-size","5px").text("Petal Length");
  label_g.append("text").attr("fill","black").attr("x",805).attr("y",245).attr("font-size","5px").text("<=1.9");
  label_g.append("text").attr("fill","black").attr("x",870).attr("y",245).attr("font-size","5px").text(">1.9");
  label_g.append("text").attr("fill","black").attr("x",865).attr("y",265).attr("font-size","5px").text("Petal Width");
  label_g.append("text").attr("fill","black").attr("x",855).attr("y",300).attr("font-size","5px").text("<=1.7");
  label_g.append("text").attr("fill","black").attr("x",920).attr("y",300).attr("font-size","5px").text(">1.7");
  label_g.append("text").attr("fill","black").attr("x",815).attr("y",315).attr("font-size","5px").text("Petal Length");
  label_g.append("text").attr("fill","black").attr("x",805).attr("y",350).attr("font-size","5px").text("<=4.9");
  label_g.append("text").attr("fill","black").attr("x",870).attr("y",350).attr("font-size","5px").text(">4.9");
  control_g.append("line").attr("class","axis").attr("x1",855).attr("x2",890).attr("y1",235).attr("y2",275);
  control_g.append("line").attr("class","axis").attr("x1",845).attr("x2",805).attr("y1",235).attr("y2",275);
  control_g.append("line").attr("class","axis").attr("x1",905).attr("x2",945).attr("y1",285).attr("y2",325);
  control_g.append("line").attr("class","axis").attr("x1",895).attr("x2",855).attr("y1",285).attr("y2",325);
  control_g.append("line").attr("class","axis").attr("x1",855).attr("x2",895).attr("y1",335).attr("y2",375);
  control_g.append("line").attr("class","axis").attr("x1",845).attr("x2",805).attr("y1",335).attr("y2",375);
  traits.forEach(function(trait,i) {

    domainByTrait[trait] = d3.extent(data,function(d){return d[trait];});
	linear.domain(domainByTrait[trait]);
	axis_g.append("text")
		.attr("x",col_x(i)-30)
		.attr("y",520)
		.text(trait);
	var ticks=axis_g.append("g")
		.attr("class","ticks");
	var lowest=parseFloat(domainByTrait[trait][0]),
		highest=parseFloat(domainByTrait[trait][1]),
		step=parseFloat(((highest-lowest)/4).toFixed(2));
    var t=d3.range(lowest,(highest+step),step);
	console.log(t);
	ticks.selectAll("text")
		.data(t)
		.enter()
		.append("text")
		.attr("x",col_x(i)-30)
		.attr("y",function(d){return 500-linear(d.toFixed(1))+5;})
		.text(function(d){return d.toFixed(1);});
	data_c.selectAll("g")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx",col_x(i))
		.attr("cy",function(d){ return 500-linear(d[trait]);})
		.attr("r", 3)
		.style("fill", function(d) { return color(d["Class"]); });
  });
  
	  data_c.selectAll("g")
	  .data(data)
	  .enter()
	  .append("g")
	  .attr("class","link");
	  for(var i=0;i<3;i++){
  data_c.selectAll("g")
	  .append("line")
	  .attr("y1",function(d){linear.domain(domainByTrait[traits[i]]);return 500-linear(d[traits[i]]);})
	  .attr("y2",function(d){linear.domain(domainByTrait[traits[i+1]]);return 500-linear(d[traits[i+1]]);})
	  .attr("x1",col_x(i))
	  .attr("x2",col_x(i+1))
	  .style("stroke",function(d){return color(d["Class"]);})
	  .on("mouseover",tip.show)
	  .on("mouseout",tip.hide);
	  }
});
