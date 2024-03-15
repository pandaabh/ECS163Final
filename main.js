// Boxplot 
d3.csv("processed_cleveland.csv").then(function(data) {
    let ages = data.map(function(d) { return +d.age; });

    const margin = {top: 10, right: 100, bottom: 30, left: 60},
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // id 'boxplot'
    const svg = d3.select("#boxplot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Statistics 
    const q1 = d3.quantile(ages.sort(d3.ascending), .25);
    const median = d3.quantile(ages, .5);
    const q3 = d3.quantile(ages, .75);
    const interQuantileRange = q3 - q1;
    const min = q1 - 1.5 * interQuantileRange;
    const max = q3 + 1.5 * interQuantileRange;

    const y = d3.scaleLinear()
        .domain([Math.min(...ages), Math.max(...ages)])
        .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Y Axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -height/2)
        .attr("y", -margin.left + 20)
        .attr("transform", "rotate(-90)")
        .text("Age");

    const center = 200;
    const widthBox = 100;

    svg
    .append("line")
        .attr("x1", center)
        .attr("x2", center)
        .attr("y1", y(min) )
        .attr("y2", y(max) )
        .attr("stroke", "black")

    // Box
    svg
    .append("rect")
        .attr("x", center - widthBox / 2)
        .attr("y", y(q3) )
        .attr("height", (y(q1)-y(q3)) )
        .attr("width", widthBox )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

    // Median, Min and Max 
    svg
    .selectAll("toto")
    .data([min, median, max])
    .enter()
    .append("line")
        .attr("x1", center-widthBox/2)
        .attr("x2", center+widthBox/2)
        .attr("y1", function(d){ return(y(d))} )
        .attr("y2", function(d){ return(y(d))} )
        .attr("stroke", "black")
});

///Bar Graph
let sorted = false;
const margin = {top: 20, right: 30, bottom: 90, left: 160},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const svg = d3.select("#Hbargraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Color 
const color = d3.scaleOrdinal(d3.schemeCategory10);

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleBand().range([0, height]).padding(.1);

const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
const yAxis = svg.append("g");

d3.csv("leadingcause.csv").then(function(data) {
    data.forEach(function(d) {
        d.Deaths = +d.Deaths.replace(/,/g, ''); 
    });

    data.sort((a, b) => b.Deaths - a.Deaths);

    x.domain([0, d3.max(data, d => d.Deaths)]);
    y.domain(data.map(d => d.Cause));

    xAxis.call(d3.axisBottom(x));
    yAxis.call(d3.axisLeft(y));

    // Y + X axis
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -height/2)
    .attr("y", -margin.left + 20)
    .attr("transform", "rotate(-90)")
    .text("Cause");

    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 40)
    .text("Deaths (Thousands)");

    // Mouseover
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", x(0))
        .attr("y", d => y(d.Cause))
        .attr("width", d => x(d.Deaths))
        .attr("height", y.bandwidth())
        .attr("fill", (d, i) => color(i))
        .on("mouseover", function(event, d) {
            tooltip.html(`Deaths: ${d.Deaths}`)
                .style("opacity", 1)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
        })

        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });
});

// Parallel Coordinates Chart
d3.csv("NCHS.csv").then(function(data) {
    const margin = {top: 50, right: 10, bottom: 30, left: 10},
          pcWidth = 1000 - margin.left - margin.right,
          pcHeight = 400 - margin.top - margin.bottom; 

    const svg = d3.select("#parallel-coordinates")
        .append("svg")
        .attr("width", pcWidth + margin.left + margin.right)
        .attr("height", pcHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const dimensions = ["Cause Name", "Age-adjusted Death Rate"];

    // Color 
    const causeNames = [...new Set(data.map(d => d["Cause Name"]))];
    const color = d3.scaleOrdinal()
        .domain(causeNames)
        .range(d3.schemeSet2);

    const y = {};
    dimensions.forEach(function(d) {
        y[d] = d === "Cause Name" ? 
               d3.scalePoint().domain(data.map(function(p) { return p[d]; })).range([pcHeight, 0]) :
               d3.scaleLinear().domain(d3.extent(data, function(p) { return +p[d]; })).range([pcHeight, 0]);
    });

    const x = d3.scalePoint()
        .range([0, pcWidth])
        .padding(1)
        .domain(dimensions);

    const brush = d3.brushY()
        .extent([[0, 0], [pcWidth, pcHeight]])
        .on("brush end", brushed);

    svg.append("g")
        .attr("class", "brush")
        .call(brush);

    const path = svg.selectAll("myPath")
        .data(data)
        .enter().append("path")
            .attr("d", function(d) {
                return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
            })
            .style("fill", "none")
            .style("stroke", d => color(d["Cause Name"])) 
            .style("opacity", 0.5);

    // Mouseover 
    path.on("mouseover", function() {
            d3.select(this)
            .style("stroke-width", "3")
            .style("opacity", 1);
        })
        .on("mouseout", function() {
            d3.select(this)
            .style("stroke-width", "1")
            .style("opacity", 0.5);
        });

    // Brushed Function 
    function brushed(event) {
        const selection = event.selection || pcHeight;
        path.style("display", function(d) {
            return dimensions.every(function(p) {
                const pos = y[p](d[p]);
                return selection[0] <= pos && pos <= selection[1];
            }) ? null : "none";
        });
    }

    // Axis + Text Labels 
    svg.selectAll("myAxis")
        .data(dimensions).enter()
        .append("g")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -10)
        .text(function(d) { return d; })
        .style("fill", "black");
});

// Scatter + Bar Graph
d3.csv("NCCDCardiov.csv").then(function(data) {
    data.forEach(function(d) {
        d.Year = +d.Year;
        d['All Races/Ethnicities'] = +d['All Races/Ethnicities'];
        d.Black = +d.Black;
        d.White = +d.White;
        d.Hispanic = +d.Hispanic;
        d['American Indian'] = +d['American Indian'];
        d['Asian/Pacific Islander'] = +d['Asian/Pacific Islander']; 
    });

    const margin = {top: 20, right: 20, bottom: 50, left: 90},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#scatter-bar")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1)
        .domain(data.map(d => d.Year));

    const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(data, d => Math.max(d['All Races/Ethnicities'], d.Black, d.White, d.Hispanic, d['American Indian'], d['Asian/Pacific Islander']))]).nice();

    const color = d3.scaleOrdinal()
        .domain(['Black', 'White', 'Hispanic', 'American Indian', 'Asian/Pacific Islander'])
        .range(d3.schemeAccent);

    // X + Y Axis
    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x0));

    svg.append("g")
       .attr("class", "y axis")
       .call(d3.axisLeft(y));

    // Bar Graph 
    const categories = ['Black', 'White', 'Hispanic', 'American Indian', 'Asian/Pacific Islander'];

    const yearGroups = svg.selectAll(".year")
        .data(data)
        .enter().append("g")
            .attr("class", "year")
            .attr("transform", d => "translate(" + x0(d.Year) + ",0)");

    categories.forEach((category, index) => {
        yearGroups.append("rect")
            .attr("x", x0.bandwidth() / categories.length * index)
            .attr("y", d => y(d[category]))
            .attr("width", x0.bandwidth() / categories.length)
            .attr("height", d => height - y(d[category]))
            .attr("fill", color(category));
    });

    // Scatter plot
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle") 
            .attr("class", "dot") 
            .attr("cx", function(d) { return x0(d.Year) + x0.bandwidth() / 2; })
            .attr("cy", function(d) { return y(d['All Races/Ethnicities']); })
            .attr("r", 4) 
            .style("fill", "red");

    const line = d3.line()
        .x(function(d) { return x0(d.Year) + x0.bandwidth() / 2; }) 
        .y(function(d) { return y(d['All Races/Ethnicities']); });
    
    svg.append("path")
        .datum(data) 
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Legend 
    const legend = svg.selectAll(".legend")
        .data(categories.concat(['All Races/Ethnicities']))
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    legend.append("rect")
        .attr("x", width - 88)
        .attr("y", -15)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d, i) => d === 'All Races/Ethnicities' ? "red" : color(d));

    legend.append("text")
        .attr("x", width - 90)
        .attr("y", -10)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d);

    // X axis label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 20)
        .text("Year");

    // Y axis label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - height/2 + 100)
        .text("Mortality Rate (per 100,000)");

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // Dot Mouseover
    svg.selectAll(".dot")
    .on("mouseover", function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("All Races/Ethnicities" + "  " + "<br/>Year: " + d.Year + "  " + "<br/>Mortality Rate: " + d['All Races/Ethnicities'])
            .style("left", (event.pageX + 10) + "px") 
            .style("top", (event.pageY - 50) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

    // Bar Graph Mouseover
    data.forEach(d => {
        d.categories = categories.map(category => ({
            category: category,
            value: d[category],
            Year: d.Year
        }));
    });
    
    svg.selectAll(".year")
        .data(data)
        .enter().append("g")
            .attr("class", "year")
            .attr("transform", d => "translate(" + x0(d.Year) + ",0)");

    categories.forEach((category, index) => {
        yearGroups.selectAll(".bar-" + category)
            .data(d => [d].map(dd => ({ category: category, value: dd[category], Year: dd.Year }))) // Encapsulate each bar's data correctly
            .enter().append("rect")
                .attr("x", x0.bandwidth() / categories.length * index)
                .attr("y", d => y(d.value))
                .attr("width", x0.bandwidth() / categories.length)
                .attr("height", d => height - y(d.value))
                .attr("fill", color(category))
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`${d.category}<br/>Year: ${d.Year}<br/>Mortality Rate: ${d.value}`)
                        .style("left", (event.pageX + 10) + "px") 
                        .style("top", (event.pageY - 50) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
    });


});
