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
        // filtering data to only include 'total_bill', 'tip', and 'size' columns
        var filteredData = data.map(function(d) {
            return {
                total_bill: d.total_bill,
                tip: d.tip,
                size: d.size
            }
        })
        console.log('Printing filteredData from CorrelationMatrix: ');
        console.log(filteredData);

        // defining svg and correlation matrix dimensions
        var margin = { top: 30, right: 30, bottom: 30, left: 30 };
        var width = 500 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;
        
        d3.select('#corr-mat-svg')
            .attr('width', width + margin.left + margin.right + 150)
            .attr('height', height + margin.top + margin.bottom + 100)
            .append('text')
            .attr('x', (width - margin.left - margin.right) / 2)
            .attr('y', 25)
            .attr('font-size', 12)
            .attr('fill', 'black')
            .text('Correlation Matrix');
        // applying the above dimenions
        var corrMatrixContainer = d3.select('#corr-mat-svg')        
            .select("#corr-mat-group")
            .attr('transform', `translate(${margin.left}, ${margin.top}`);

        // getting the columns of the data
        var cols = Object.keys(filteredData[0]);

        // creating scaling functions for x and y axes
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
        // dynamically obtaining min and max of correlation coefficients
        let minCorrMatData = Math.min(...corrMatrixData.map(e => e.coef)); 
        let maxCorrMatData = Math.max(...corrMatrixData.map(e => e.coef));

        // creating a sequential scale based on "interpolatePlasma" sequential scheme
        var divergingColors = d3.scaleSequential(d3.interpolatePlasma)
            .domain([minCorrMatData, maxCorrMatData]);

        // generating the correlation matrix heat map 
        corrMatrixContainer.selectAll('rect')
            .data(corrMatrixData)
            .enter()
            .append('rect')
            .attr('x', function(d) { return xScale(d.var1) })
            .attr('y', function(d) { return yScale(d.var2) })
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', function(d) { return divergingColors(d.coef) })

        // adding text to each correlation matrix cell to show the correlation
        // coefficient of that cell's pair of variables
        corrMatrixContainer.selectAll()
            .data(corrMatrixData)
            .enter()
            .append('text')
            .attr('x', function(d) {
                const defOffset = -10; 
                const xPos = xScale.bandwidth() / 2;
                return xScale(d.var1) + xPos + defOffset 
            })
            .attr('y', function(d) { return yScale(d.var2) + (yScale.bandwidth() / 2) })
            .attr('font-size', 15)
            .attr('fill', function(d) { return d.coef > 0.9 ? 'black' : 'white' })
            .text(function(d) { return Number(d.coef).toFixed(1) })

        // creating the color gradient definition for the color bar
        var linGrad = d3.select('#corr-mat-svg').append('defs')
            .append('linearGradient')
            .attr('id', 'lin-grad')
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");
        
        // each 'stop' refers to the pure color that is to be portrayed at the position
        // on the directional arrow (the offset)
        linGrad.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', d3.interpolatePlasma(1));

        linGrad.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', d3.interpolatePlasma(0.5));

        linGrad.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', d3.interpolatePlasma(0));

        // creating the <rect> that acts as the color bar, filling it with the
        // previously defined linear gradient
        d3.select('#corr-mat-svg').append('rect')
            .attr('x', width + 100)
            .attr('y', 50)
            .attr('height', height)
            .attr('width', 40)
            .attr('fill', 'url(#lin-grad)');

        // creating axis for color bar
        var colorBarScale = d3.scaleLinear()
            .range([height, 0])
            .domain([minCorrMatData, maxCorrMatData])
        
        d3.select('#corr-mat-svg').append('g')
            .attr('transform', `translate(${width + 140}, 50)`)
            .call(d3.axisRight(colorBarScale));

        d3.select('#corr-mat-group')
            .attr('transform', `translate(0, 50)`);
    }

    // calculates the correlation coefficients for each pair of variables and 
    // returns the formatted correlation matrix
    getDataForCorrMatrix(data, cols) {
        const matrix = [];
        const numCols = cols.length;

        for(let i = 0; i < cols.length; i++) {
            matrix.push(Array(numCols).fill(0));
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

    render() {
        return (
            <div id="corr-mat-container">
                <svg 
                    id="corr-mat-svg" 
                    className="chart"
                >
                    <g id="corr-mat-group" className="chart-group"></g>
                </svg>
            </div>
        );
    }
}

export default CorrelationMatrix;