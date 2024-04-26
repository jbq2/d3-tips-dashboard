import './App.css';
import { Component } from "react";
import tips from './tips.csv'
import * as d3 from 'd3';
import CorrelationMatrix from './CorrelationMatrix';
import Dropdown from 'react-bootstrap/Dropdown';
import Scatter from './Scatter';
import BarChart from './BarChart';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedNumerical: "",
            selectedX: "",
            selectedY: "",
            selectedRadio: "",
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
    
    handleRadioChange = (event) => {
        this.setState({
          selectedRadio: event.target.value
        });
      };

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
                    <div className='barchart'>
                        <div class="radio-buttons">
                            <label className="radio-label">
                                <input type="radio" name="option" value="sex" checked={this.state.selectedRadio === "sex"} 
                                        onChange={this.handleRadioChange} className="radio-input"/>
                                Sex
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="option" value="smoker" checked={this.state.selectedRadio === "smoker"} 
                                        onChange={this.handleRadioChange} className="radio-input"/>
                                Smoker
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="option" value="day" checked={this.state.selectedRadio === "day"} 
                                        onChange={this.handleRadioChange} className="radio-input"/>
                                Day
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="option" value="time" checked={this.state.selectedRadio === "time"} 
                                        onChange={this.handleRadioChange} className="radio-input"/>
                                Time
                            </label>
                            <BarChart 
                                x_var={this.state.selectedRadio} 
                                y_var={this.state.selectedNumerical} 
                                data={this.state.data}
                            />
                        </div>
                    </div>
                    <div className='heat-map'>
                        <CorrelationMatrix 
                            data={ this.state.data } 
                            onMatrixCellClick={this.onMatrixCellClick}
                        />
                    </div>
                </div>
                <div className='scatterplot'>
                    <Scatter 
                        x_var={this.state.selectedX} 
                        y_var={this.state.selectedY} 
                        data={this.state.data}
                    />
                </div>
            </div>
        );
    }
}

export default App;
