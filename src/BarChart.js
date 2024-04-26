import React, { Component } from "react";
import * as d3 from "d3";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
 
  componentDidUpdate() {
    var data = this.props.data
    var x_var = this.props.x_var
    var y_var = this.props.y_var
    console.log("view selections.... x = ", x_var, "y = ", y_var); // Check the format of the data in the conosole

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 50, left: 22 },
      w = 600 - margin.left - margin.right,
      h = 400 - margin.top - margin.bottom;

    
    var container = d3
      .select(".child2_svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .select(".g_2")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);


    container.selectAll(".x_axis_label, .y_axis_label").remove();

    // Calculate average 
    const averages = d3.rollup(
        data,
        group => d3.mean(group, d => d[y_var]),
        d => d[x_var]
      );
  

    // X axis
    // var x_data = data.map(d => d[x_var]);
    var x_data = Array.from(averages.keys());
    var x_scale = d3
      .scaleBand()
      .domain(x_data)
      .range([margin.left, w])
      .padding(0.2);

    container
      .selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale));

    // X axis label
    container
      .append("text")
      .attr("class", "x_axis_label")
      .attr("x", w / 2 + margin.left) 
      .attr("y", h + margin.top + 25) 
      .style("text-anchor", "middle")
      .text(this.props.x_var); 
      
        
    // Add Y axis
    // var y_data = data.map(d => d[y_var]);
    var y_data = Array.from(averages.values());
    var y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(y_data)])
      .range([h, 0]);

    container
      .selectAll(".y_axis_g")
      .data([0])
      .join("g")
      .attr("class", "y_axis_g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y_scale));

    // Y axis label
    container
      .append("text")
      .attr("class", "y_axis_label")
      .attr("transform", "rotate(-90)") 
      .attr("x", -(h / 2) - margin.top) 
      .attr("y", -margin.left + 10) 
      .style("text-anchor", "middle")
      .text(this.props.y_var); 

    // create bars
    container
      .selectAll(".chart")
      .data(Array.from(averages))
      .join("g")
      .attr("class", "chart")
      .attr("add_bar", function(d) {
        d3.select(this)
            .selectAll("rect")
            .data([{ x: d[0], y: d[1] }])
            .join("rect")
            .attr("x", d => x_scale(d.x))
            .attr("y", d => y_scale(d.y))
            .attr("width", x_scale.bandwidth())
            .attr("height", d => h - y_scale(d.y))
            .attr("fill", "lightgray");
        d3.select(this)
            .selectAll("text")
            .data([{ x: d[0], y: d[1] }])
            .join("text")
            .attr("x", d => x_scale(d.x) + x_scale.bandwidth() / 2)
            .attr("y", d => y_scale(d.y)) // Align text at the top of the bar
            .attr("text-anchor", "middle") // Center-align the text horizontally
            .attr("alignment-baseline", "hanging") // Align text to the top
            .attr("fill", "black")
            .text(d => (d.y ? d.y.toFixed(5) : "")); // Check if d.y exists before applying toFixed(5)
 //.text(d => d.y); // .text(d => d.y.toFixed(5)); 
          
      })
  }

  render() {
    return (
      <svg className="child2_svg">
        <g className="g_2"></g>
      </svg>
    );
  }
}
export default BarChart;