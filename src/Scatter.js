import { Component } from "react";

class Scatter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x_var: props.x_var,
            y_var: props.y_var
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.x_var !== prevProps.x_var || this.props.y_var !== prevProps.y_var) {
            this.setState({
                x_var: this.props.x_var,
                y_var: this.props.y_var
            });
        }
    }


    render() {
        return (
            <div>
                <div>{this.state.x_var}</div>
                <div>{this.state.y_var}</div>
            </div>
        );
    }
}

export default Scatter