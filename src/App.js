import './App.css';
import { Component } from "react";
import tips from './tips.csv'
import * as d3 from 'd3';
import CorrelationMatrix from './CorrelationMatrix';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        var self = this;
        d3.csv(tips, function(d) {
            return {
                tip: parseFloat(d.tip),
                total_bill: parseFloat(d.total_bill),
                sex: d.sex,
                day: d.day,
                time: d.time,
                smoker: d.smoker,
                size: parseInt(d.size)
            };
        })
            .then(function(csvData) {
                console.log(csvData);
                self.setState({ data: csvData });
            })
            .catch(function(err) {
                console.log(err);
            });
    }
    
    render() {
        return (
            <div className="App">
                <div className="dropdown">dropdown</div>
                <div className='row'>
                    <div className='barchart'>Bar chart</div>
                    <div className='heat-map'><CorrelationMatrix data={ this.state.data } /></div>
                </div>
                <div className='scatterplot'>scatterplot</div>
            </div>
        );
    }
}

export default App;
