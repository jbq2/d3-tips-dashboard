import { Component } from "react";
import * as d3 from 'd3';

class Scatter extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        var data = this.props.data
        var x_var = this.props.x_var
        var y_var = this.props.y_var

        var margin = { top: 10, right: 10, bottom: 55, left: 30 },
            w = 1000 - margin.left - margin.right,
            h = 500 - margin.top - margin.bottom
        var container = d3.select(".child1_svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .select(".g_1")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            
        var x_data = data.map(item=>item[x_var])
        const x_scale = d3.scaleLinear().domain([0,d3.max(x_data)]).range([margin.left, w])
        container.selectAll(".x_axis_g").data([0]).join("g").attr("class", "x_axis_g")
            .attr("transform", `translate(0, ${h})`).call(d3.axisBottom(x_scale));

        container.selectAll(".x.label").remove();
        container.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", (w - margin.left - margin.right) / 2)
            .attr("y", h+50)
            .text(x_var);

        var y_data = data.map(item=>item[y_var])
        const y_scale = d3.scaleLinear().domain([0, d3.max(y_data)]).range([h, 0])
        container.selectAll(".y_axis_g").data([0]).join("g").attr("class", "x_axis_g")
            .attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y_scale));

        container.selectAll(".y.label").remove();
        container.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("y", -margin.left)
            .attr("x", -h / 2)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(y_var);

    
        container.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", function (d) {
                return x_scale(d[x_var]);
            })
            .attr("cy", function(d) {
                return y_scale(d[y_var]);
            })
            .attr("r", 3)
            .style("fill", "#69b3a2")
    }


    render() {
        return (
            <svg className='child1_svg'>
                <g className='g_1' ></g>
            </svg>
        );
    }
}

export default Scatter