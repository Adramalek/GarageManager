import React, {Component} from 'react';
import './static/App.css';

let prefix = "localhost:8080/api";
let cars_url = prefix+"/cars";
let drivers_url = prefix+"/drivers";
let garage_url = prefix+"/garage";

class App extends Component {

    constructor(props){
        super(props);
        this.state = {cars: [], drivers: [], garage: []};
    }

    componentDidMount(){
        var _cars = null;
        var _drivers = null;
        var _garage = null;
        fetch("localhost:8080/api/cars", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method : 'GET'
        })
            // .then(response => response.json())
            // .then(data => alert(data))
            // .then(data => _cars = data.entity._embedded.cars) Access-Control-Allow-Origin
            .catch(err => alert("Error: "+err));
        // fetch(drivers_url, {
        //     method: "GET",
        //     headers: {
        //         "Accept": "application/json"
        //     }
        // }).then(response => response.json())
        //     .then(data => _drivers = data.entity._embedded.drivers)
        //     .catch(err => console.log("Error: "+err));
        // if (_cars != null)
        //     _garage = _cars.filter(el => el.assignedDriver != null).map(_car => ({car: _car, driver: _car.driver}))
        // this.setState({cars: _cars, drivers: _drivers, garage: _garage});
    }

    render() {
        return (
            <div>
                {/*<CarList cars={this.state.cars}/>*/}
                {/*<DriveList drivers={this.state.drivers}/>*/}
            </div>
        );
    }

}

class CarList extends React.Component {
    render(){
        var cars = this.props.cars.map(_car => <CarElement key={_car._links.self.href} car={_car}/>);
        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <th>Color</th>
                        <th>Model</th>
                        <th>Registration Number</th>
                        <th>Built Date</th>
                    </tr>
                    {cars}
                    </tbody>
                </table>
            </div>
        )
    }
}

class DriveList extends React.Component {
    render(){
        var drivers = this.props.drivers.map(_driver => <DriverElement key={_driver._links.self.href} driver={_driver}/>)
        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <th>First Name</th>
                        <th>Second Name</th>
                        <th>Experience (in years)</th>
                    </tr>
                    {drivers}
                    </tbody>
                </table>
            </div>
        )
    }
}

class CarElement extends React.Component {
    render(){
        return (
            <tr>
                <th>{this.props.car.color}</th>
                <th>{this.props.car.model}</th>
                <th>{this.props.car.registrationNumber}</th>
                <th>{this.props.car.builtDate}</th>
            </tr>
        )
    }
}

class DriverElement extends React.Component {
    render(){
        return (
            <tr>
                <th>{this.props.driver.firstName}</th>
                <th>{this.props.driver.secondName}</th>
                <th>{this.props.driver.experience}</th>
            </tr>
        )
    }
}

export default App;
