import { Component } from "react";
import * as d3 from 'd3';

class CorrelationMatrix extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log('CorrelationMatrix was mounted!');
    }

    componentDidUpdate() {
        console.log('CorrelationMatrix was updated!');

        var data = this.props.data;
        var filteredData = data.map(function(d) {
            return {
                total_bill: d.total_bill,
                tip: d.tip,
                size: d.size
            }
        })
        console.log('Printing filteredData from CorrelationMatrix: ');
        console.log(filteredData);

        // var totalBillData = 

        var margin = { top: 30, right: 30, bottom: 30, left: 30 };
        var width = 500 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        var corrMatrixContainer = d3.select('#corr-mat-svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .select("#corr-mat-group")
            .attr('transform', `translate(${margin.left}, ${margin.top}`);

        var cols = Object.keys(filteredData[0]);
        console.log("cols:");
        console.log(cols);

        var xScale = d3.scaleBand()
            .range([0, width])
            .domain(cols)
            .padding(1);
        corrMatrixContainer
            .append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        var yScale = d3.scaleBand()
            .range([height, 0])
            .domain(cols)
            .padding(1);
        corrMatrixContainer
            .append('g')
            .call(d3.axisLeft(yScale));

        console.log(this.calculateCorrMatrix(filteredData, cols));
        
        var divergingColors = d3.scaleDiverging()
            .range(['#8c03fc', '#fcd303'])
            .domain([0, 1]);
    }

    calculateCorrMatrix(data, cols) {
        const matrix = [];
        const numCols = cols.length;

        for(let i = 0; i < cols.length; i++) {
            matrix.push(Array(numCols).fill(0));
        }

        const means = []
        for(let i = 0; i < numCols; i++) {
            means.push(this.getColumnMean(data, cols[i]));
        }

        for(let i = 0; i < numCols; i++) {
            for(let j = i; j < numCols; j++) {
                let numerator = 0;
                let denom1 = 0;
                let denom2 = 0;

                for(let row of data) {
                    let col = cols[j]
                    let val1 = parseFloat(row[col]) - means[i];
                    let val2 = parseFloat(row[col]) - means[j];

                    numerator += val1 * val2;
                    denom1 += val1 ** 2;
                    denom2 += val2 ** 2;
                }

                const correlation = numerator / Math.sqrt(denom1 * denom2);

                matrix[i][j] = correlation;
                matrix[j][i] = correlation;
            }
        }

        return matrix;
    }

    getColumnMean(data, col) {
        let mean = 0.;
        for(let i = 0; i < data.length; i++) {
            // console.log(data[i][col]);
            mean += data[i][col];
        }
        return mean / data.length;
    }

    render() {
        return (
            <svg id="corr-mat-svg" className="chart">
                <g id="corr-mat-group" className="chart-group"></g>
            </svg>
        );
    }
}

export default CorrelationMatrix;