// @TODO: YOUR CODE HERE!
// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60, 
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('class','chart');

d3.csv('assets/data/data.csv').then(function(incomingdata){
    incomingdata.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    //  console.log(incomingdata);
    //   console.log(data);
    });
    
    var xLinearScale = d3.scaleLinear()
        .domain([(d3.min(incomingdata, d=>d.poverty)*.9),
            d3.max(incomingdata, d=> d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([(d3.min(incomingdata, d=>d.healthcare)*.9),
            d3.max(incomingdata, d=> d.healthcare)])
        .range([height,0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .call(leftAxis);


    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 40)
        .attr('x', 0 - (height/2))
        .attr('dy', '1em')
        .attr('class','aText')
        .text("Lacks Healthcare (%)");

    chartGroup.append('text')
        .attr('transform',`translate(${width /2}, ${height + margin.top + 30})`)
        .attr('class','aText')
        .text("In Poverty (%)");

    var circlesGroup = chartGroup.selectAll('circle')
        .data(incomingdata)
        .enter()
        .append('circle')
        .attr('class','stateCircle')
        .attr('cx', d=> xLinearScale(d.poverty))
        .attr('cy', d=> yLinearScale(d.healthcare))
        .attr('r', 15)
        // .attr('fill','purple')
        // .attr('opacity','.5');


    var circleLabels = chartGroup.selectAll('text.text-circles')
        .data(incomingdata)
        .enter()
        .append('text');

    circleLabels.attr('class','stateText')
        .text(d => d.abbr)
        .attr('x', d=> xLinearScale(d.poverty))
        .attr('y', d=> yLinearScale(d.healthcare))
        .attr('dy', 4)
        .attr('text-anchor','middle')
        .attr('font-size','11px');

    var toolTip = d3.tip()
        .attr('class','d3-tip')
        .offset([80, -60])
        .html(function(d){
            return (`State: ${d.state}<br> In Poverty(%): ${d.poverty}<br> Lacks Healthcare(%): ${d.healthcare}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(d){
        toolTip.show(d, this);
    })
    .on("mouseout", function(d){
        toolTip.hide(d);
    });

}).catch(function(error){
    console.log(error);
});