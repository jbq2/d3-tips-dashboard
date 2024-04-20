import { Component } from "react";
import * as d3 from 'd3';
import jStat from 'jstat';

class CorrelationMatrix extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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

        var margin = { top: 30, right: 30, bottom: 30, left: 30 };
        var width = 500 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        var corrMatrixContainer = d3.select('#corr-mat-svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .select("#corr-mat-group")
            .attr('transform', `translate(${margin.left}, ${margin.top}`);

        var cols = Object.keys(filteredData[0]);

        var xScale = d3.scaleBand()
            .range([0, width])
            .domain(cols)
            .padding(0);
        corrMatrixContainer
            .append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        var yScale = d3.scaleBand()
            .range([height, 0])
            .domain(cols)
            .padding(0);
        corrMatrixContainer
            .append('g')
            .attr('transform', `translate(${width}, 0)`)
            .call(d3.axisRight(yScale));

        let corrMatrixData = this.getDataForCorrMatrix(filteredData, cols);
        let minCorrMatData = Math.min(...corrMatrixData.map(e => e.coef)); 
        let maxCorrMatData = Math.max(...corrMatrixData.map(e => e.coef));
        let avgCorrMatData = (minCorrMatData + maxCorrMatData) / 2;
        
        var divergingColors = d3.scaleLinear()
            .range(['#004b40', '#f6f6f6', '#533600'])
            .domain([minCorrMatData, avgCorrMatData, maxCorrMatData]);

        corrMatrixContainer.selectAll('rect')
            .data(corrMatrixData)
            .enter()
            .append('rect')
            .attr('x', function(d) { return xScale(d.var1) })
            .attr('y', function(d) { return yScale(d.var2) })
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', function(d) { return divergingColors(d.coef) });
    }

    getDataForCorrMatrix(data, cols) {
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
                let col1 = cols[i];
                let col2 = cols[j];
                let col1Data = [];
                let col2Data = [];

                for(let k = 0; k < data.length; k++) {
                    col1Data.push(data[k][col1]);
                    col2Data.push(data[k][col2]);
                }

                let correlation = jStat.corrcoeff(col1Data, col2Data);
                console.log(`correlation between ${col1} and ${col2}: ${correlation}`);
                matrix[i][j] = correlation;
                matrix[j][i] = correlation;
            }
        }

        let matrixFormattedData = [];
        for(let i = 0; i < numCols; i++) {
            let rowCol = cols[i];
            for(let j = 0; j < numCols; j++) {
                let colCol = cols[j];
                matrixFormattedData.push({
                    var1: rowCol,
                    var2: colCol,
                    coef: matrix[i][j]
                });
            }
        }

        return matrixFormattedData;
    }

    getColumnMean(data, col) {
        let mean = 0.;
        for(let i = 0; i < data.length; i++) {
            mean += data[i][col];
        }
        return mean / data.length;
    }

    render() {
        return (
            <svg 
                id="corr-mat-svg" 
                className="chart"
            >
                <g id="corr-mat-group" className="chart-group"></g>
            </svg>
        );
    }
}

export default CorrelationMatrix;