import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import './static/App.css';
import axios from 'axios'
import {cars_url, drivers_url, garage_url} from './urls'
import {CreateDialog} from './CRUDWindows'

let curryIt = function(uncurried) {
    let parameters = Array.prototype.slice.call(arguments, 1);
    return function() {
        return uncurried.apply(this, parameters.concat(
            Array.prototype.slice.call(arguments, 0)
        ));
    };
};


class App extends Component {

    constructor(props){
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.state = {
            cars: [],
            drivers: [],
            garage: [],
            pageSize: 1,
            attributes: {
                car_attributes: [],
                driver_attributes: []
            },
            links: {
                car_links: {},
                driver_links: {},
                garage_links: {}
            }
        };
    }

    componentDidMount(){
        this.loadFromServer(this.state.pageSize);
    }

    loadFromServer(pageSize){
        axios.all([
            axios.get(cars_url+'?size='+pageSize),
            axios.get(drivers_url+'?size='+pageSize),
            axios.get(garage_url+'?size='+pageSize)
        ])
            .then(axios.spread((cars_resp, drivers_resp, garage_resp) => {
                this.setState({
                    cars: cars_resp.data._embedded.cars,
                    drivers: drivers_resp.data._embedded.drivers,
                    garage: garage_resp.data._embedded.garageRecords,
                    pageSize: pageSize,
                    links: {
                        car_links: cars_resp.data._links,
                        driver_links: drivers_resp.data._links,
                        garage_links: garage_resp.data._links
                    }
                });
            }))
            .then(() => {
                axios.all([
                    axios.get(this.state.links.car_links.profile.href, {
                        headers: {'Accept': 'application/schema+json'}
                    }),
                    axios.get(this.state.links.driver_links.profile.href, {
                        headers: {'Accept': 'application/schema+json'}
                    })
                ])
                    .then(axios.spread((cars_profile, drivers_profile) => {
                        console.log(cars_profile);
                        this.setState({
                            attributes: {
                                car_attributes: Object.keys(cars_profile.data.properties),
                                driver_attributes: Object.keys(drivers_profile.data.properties)
                            }
                        })
                    }));
            });
    }

    onNavigate(navUri) {
        let getCars = navUri.includes("cars");
        let getDrivers = navUri.includes("drivers");
        let getGarageRecords = navUri.includes("garage");
        axios.get(navUri)
            .then(response => {
                this.setState({
                    cars: getCars ? response.data._embedded.cars : this.state.cars,
                    drivers: getDrivers ? response.data._embedded.drivers : this.state.drivers,
                    garage: getGarageRecords ? response.data._embedded.garageRecords : this.state.garage,
                    pageSize: this.state.pageSize,
                    links: {
                        car_links: getCars ? response.data._links : this.state.links.car_links,
                        driver_links: getDrivers ? response.data._links : this.state.links.driver_links,
                        garage_links: getGarageRecords ? response.data._links : this.state.links.garage_links
                    }
                });
            })
    }

    handleInput(e) {
        e.preventDefault();
        let pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
        if (/^[0-9]+$/.test(pageSize)) {
            this.updatePageSize(pageSize);
        } else {
            ReactDOM.findDOMNode(this.refs.pageSize).value =
                pageSize.substring(0, pageSize.length - 1);
        }
    }

    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize);
        }
    }

    onCreate(url, newObj){
        axios.post(url, newObj)
            .then(response => {
                alert('Successful!');
            })
            .catch(err => console.log(err))
    }

    onDelete(obj){
        axios.delete(obj._links.self.href)
            .then(ignored => {
                alert('Successful!');
            })
            .catch(err => console.log(err))
    }

    render() {

        return (
            <div>
                <div>
                    Set page size <input ref="pageSize" defaultValue={this.state.pageSize} onInput={this.handleInput}/>
                </div>
                <div>
                    <div className='container'>
                        <h1>List of Cars</h1>
                    </div>
                    <div className='container'>
                        <h1>List of Drivers</h1>
                    </div>
                    <div className='container'>
                        <h1>Garage</h1>
                    </div>
                </div>
                <div>
                    <CarList cars={this.state.cars}
                             links={this.state.links.car_links}
                             pageSize={this.state.pageSize}
                             onNavigate={this.onNavigate}
                             onDelete={this.onDelete}/>
                    <DriveList drivers={this.state.drivers}
                               links={this.state.links.driver_links}
                               pageSize={this.state.pageSize}
                               onNavigate={this.onNavigate}
                               onDelete={this.onDelete}/>
                    <GarageList garage={this.state.garage}
                                links={this.state.links.garage_links}
                                pageSize={this.state.pageSize}
                                onNavigate={this.onNavigate}
                                onDelete={this.onDelete}/>

                </div>
                <div>
                    <CreateDialog attributes={this.state.attributes.car_attributes}
                                  what='Car'
                                  onCreate={curryIt(this.onCreate, cars_url)}/>
                    <CreateDialog attributes={this.state.attributes.driver_attributes}
                                  what='Driver'
                                  onCreate={curryIt(this.onCreate, drivers_url)}/>
                </div>
            </div>
        );
    }

}

class CarList extends React.Component {
    constructor(props){
        super(props);
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
    }

    handleNavFirst(e){
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }



    render(){
        let cars = this.props.cars.map(_car => <CarElement key={_car._links.self.href}
                                                           car={_car}
                                                           onDelete={this.props.onDelete}/>);
        let navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
        }
        return (
            <div className='container'>
                <table>
                    <tbody>
                    <tr>
                        <th>Color</th>
                        <th>Model</th>
                        <th>Registration Number</th>
                        <th>Built Date</th>
                        <th></th>
                    </tr>
                    {cars}
                    </tbody>
                </table>
                <div>
                    {navLinks}
                </div>
            </div>
        )
    }


}

class DriveList extends React.Component {
    constructor(props){
        super(props);
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    render(){
        let drivers = this.props.drivers
            .map(_driver => <DriverElement key={_driver._links.self.href}
                                           driver={_driver}
                                           onDelete={this.props.onDelete}/>);
        let navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
        }
        return (
            <div className='container'>
                <table>
                    <tbody>
                    <tr>
                        <th>First Name</th>
                        <th>Second Name</th>
                        <th>Experience</th>
                        <th></th>
                    </tr>
                    {drivers}
                    </tbody>
                </table>
                <div>
                    {navLinks}
                </div>
            </div>
        )
    }

    handleInput(e) {
        e.preventDefault();
        var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
        if (/^[0-9]+$/.test(pageSize)) {
            this.props.updatePageSize(pageSize);
        } else {
            ReactDOM.findDOMNode(this.refs.pageSize).value =
                pageSize.substring(0, pageSize.length - 1);
        }
    }

    handleNavFirst(e){
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }
}


class GarageList extends React.Component {
    constructor(props){
        super(props);
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    render(){
        let garage = this.props.garage
            .map(el => <GarageElement key={el._links.self.href}
                                      garageRecord={el}
                                      onDelete={this.props.onDelete}/>);
        let navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
        }
        return (
            <div className='container'>
                <table>
                    <tbody>
                    <tr>
                        <th>Car Registration Number</th>
                        <th>Driver Name</th>
                        <th></th>
                    </tr>
                    {garage}
                    </tbody>
                </table>
                <div>
                    {navLinks}
                </div>
            </div>
        )
    }

    handleInput(e) {
        e.preventDefault();
        var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
        if (/^[0-9]+$/.test(pageSize)) {
            this.props.updatePageSize(pageSize);
        } else {
            ReactDOM.findDOMNode(this.refs.pageSize).value =
                pageSize.substring(0, pageSize.length - 1);
        }
    }

    handleNavFirst(e){
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }
}

class CarElement extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.car);
    }

    render(){
        return (
            <tr>
                <th>{this.props.car.color}</th>
                <th>{this.props.car.model}</th>
                <th>{this.props.car.registrationNumber}</th>
                <th>{this.props.car.builtDate}</th>
                <th>
                    <button onClick={this.handleDelete} style={{color: 'red'}}>X</button>
                </th>
            </tr>
        )
    }
}

class DriverElement extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.driver);
    }

    render(){
        return (
            <tr>
                <th>{this.props.driver.firstName}</th>
                <th>{this.props.driver.secondName}</th>
                <th>{this.props.driver.experienceInYears} years</th>
                <th>
                    <button onClick={this.handleDelete} style={{color: 'red'}}>X</button>
                </th>
            </tr>
        )
    }
}

class GarageElement extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.garageRecord);
    }

    render(){
        return (
            <tr>
                <th>{this.props.garageRecord.car.registrationNumber}</th>
                <th>{this.props.garageRecord.driver.firstName} {this.props.garageRecord.driver.secondName}</th>
                <th>
                    <button onClick={this.handleDelete} style={{color: 'red'}}>X</button>
                </th>
            </tr>
        )
    }
}

export default App;
