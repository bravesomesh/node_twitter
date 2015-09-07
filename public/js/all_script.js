function cloudMake(){ 		//called at end of setMap !
	console.log("start cloudMake");
	 var wordArray = [
		"power", "water", "train", "Obama", "Romney", "work", "Sandy", "hurricane", "storm", "mayor","crane", "cold", "New York", "subway", "crazy", "vote", "evacuate"];
	 d3.layout.cloud().size([300, 300])
		.words(wordArray.map(function(d) {
			return {text: d, size: 4 + Math.random() * 90};
			}))
		.rotate(function() { return ~~(Math.random() * 2) * 90; })
		.font("Impact")
		.fontSize(function(d) { return d.size; })
		.on("end", draw)
		.start();
}; 
function draw(words) {
    d3.select("#wordcloud").append("svg")
        .attr("width", 300)
        .attr("height", 300)
      	.append("g")
        .attr("transform", "translate(150,150)")
      	.selectAll("text")
        .data(words)
      	.enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
		.style("fill", "white")
       
        .attr("text-anchor", "middle")
		.attr("class", "words")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; })
		.on("click", function (d){
			selectWord(d.text);
			//recolor hexagons
			
		});
}
function selectWord(t) {
	var selectedWord = t;
	console.log("you selected:", selectedWord); 
	
	document.getElementById("keyword").innerHTML = selectedWord;
	
	//clear all words
	d3.selectAll(".words")
		.style("fill","white");
	//color the selected word 
	d3.select(t)
		.style("fill", "#FABA0E");
		
	bindData(selectedWord);
}
cloudMake();