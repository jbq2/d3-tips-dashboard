import './App.css';
import { Component } from "react";
import tips from './tips.csv'
import * as d3 from 'd3';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        var self = this;
        console.log(tips);
        d3.csv(tips, function(d) {
            return {
                tip: parseFloat(d.tip),
                total_bill: parseFloat(d.total_bill),
                day: d.day,
            };
        })
            .then(function(csvData) {
                self.setState({ data: csvData });
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    
    render() {
        return (
            <div className="App">
            </div>
        );
    }
}

export default App;
