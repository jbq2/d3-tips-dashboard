import './App.css';
import { Component } from "react";
import tips from './tips.csv'
import * as d3 from 'd3';
import CorrelationMatrix from './CorrelationMatrix';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';
import Scatter from './Scatter';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedNumerical: "",
            selectedX: "",
            selectedY: "",
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


    renderDropdownItems() {
        const { data } = this.state;
        
        const firstObject = data.length > 0 ? data[0] : {};
        return Object.entries(firstObject).map(([key, val]) => {
            if (typeof val === "number") {
                return (
                    <Dropdown.Item key={key} eventKey={key}>{key}</Dropdown.Item>
                );
            }
            return null
        });
    }

    onMatrixCellClick = (var1, var2) => {
        this.setState({
            selectedX: var1,
            selectedY: var2
        })
    }
    
    render() {
        const { selectedNumerical } = this.state
        return (
            <div className="App">
                <div className="dropdown">
                    <Dropdown title={selectedNumerical || "Dropdown"} onSelect={(eventKey) => this.setState({selectedNumerical: eventKey})}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {selectedNumerical || 'Select feature'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {this.renderDropdownItems()}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className='row'>
                    <div className='barchart'>Bar chart</div>
                    <div className='heat-map'>
                        <CorrelationMatrix 
                            data={ this.state.data } 
                            onMatrixCellClick={this.onMatrixCellClick}
                        />
                    </div>
                </div>
                <div className='scatterplot'>
                    <Scatter x_var={this.state.selectedX} y_var={this.state.selectedY} />
                </div>
            </div>
        );
    }
}

export default App;
