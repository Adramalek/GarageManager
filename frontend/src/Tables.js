import React from "react";
import {capitalizeFirstLetter, preventDefaultDecorator, curryIt} from "./utils";
import {
    CreateDialog,
    UpdateDialog,
    CarToDriverAssignmentUpdateDialog,
    CarToDriverAssignmentCreateDialog} from "./CRUDWindows";


class Table extends React.Component {
    constructor(props){
        super(props);
        this.toLastPage = preventDefaultDecorator(this.props.toLastPage).bind(this);
        this.toFirstPage = preventDefaultDecorator(this.props.toFirstPage).bind(this);
        this.toPrevPage = preventDefaultDecorator(this.props.toPrevPage).bind(this);
        this.toNextPage = preventDefaultDecorator(this.props.toNextPage).bind(this);
        this.getNavLinks = this.getNavLinks.bind(this);
        this.getHeaders = this.getHeaders.bind(this);
        this.getBody = this.getBody.bind(this);
        this.columns = this.props.attributes.map(attribute => {
            let words = attribute.split(/(?=[A-Z])/);
            words[0] = capitalizeFirstLetter(words[0]);
            return ({
                Header: words.join(' '),
                accessor: attribute
            })
        })
    }

    getNavLinks(){
        let navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.toFirstPage}>&lt;&lt;</button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.toPrevPage}>&lt;</button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.toNextPage}>&gt;</button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.toLastPage}>&gt;&gt;</button>);
        }
        return navLinks;
    }

    getHeaders(){
        return this.columns.map(column => (<th>{column}</th>));
    }

    getBody(tableName, mapper){
        let rows = this.props.data.map(mapper);
        let navLinks = this.getNavLinks();
        return (
            <div className='container'>
                {tableName}
                <table>
                    <tbody>
                    <tr>
                        <th/>
                        {this.getHeaders()}
                        <th/>
                    </tr>
                    </tbody>
                    {rows}
                </table>
                {navLinks}
            </div>
        )
    }
}

class Cars extends Table {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <CreateDialog attributes={this.props.attributes}
                              onModify={this.props.onCreate}
                              clearAfterModification={true}
                              what={'Car'}
                              availableCars={this.props.availableCars}
                              availableDrivers={this.props.availableDrivers}/>
                {this.getBody('Cars', car => <Car key={car._links.self.href}
                                                  obj={car}
                                                  attributes={this.props.attributes}
                                                  onDelete={this.props.onDelete}
                                                  onUpdate={this.props.onUpdate}
                                                  what={'driver'}/>)}
            </div>
        )
    }
}

class Drivers extends Table {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <CreateDialog attributes={this.props.attributes}
                              onModify={this.props.onCreate}
                              clearAfterModification={true}
                              what={'Driver'}
                              availableCars={this.props.availableCars}
                              availableDrivers={this.props.availableDrivers}/>
                {this.getBody('Drivers', driver => <Driver key={driver._links.self.href}
                                                           obj={driver}
                                                           attributes={this.props.attributes}
                                                           onDelete={this.props.onDelete}
                                                           onUpdate={this.props.onUpdate}
                                                           what={'driver'}/>)}
            </div>
        )
    }
}

class GarageJournal extends Table {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <CarToDriverAssignmentCreateDialog attributes={this.props.attributes}
                                                   onModify={this.props.onCreate}
                                                   what={'Driver'}/>
                {this.getBody('Garage Journal', record => <Record key={record._links.self.href}
                                                                  obj={record}
                                                                  attributes={this.props.attributes}
                                                                  onDelete={this.props.onDelete}
                                                                  onUpdate={this.props.onUpdate}
                                                                  availableCars={this.props.availableCars}
                                                                  availableDrivers={this.props.availableDrivers}/>)}
            </div>
        )

    }
}

class Element extends React.Component {
    constructor(props){
        super(props);
        this.onDelete = curryIt(this.props.onDelete, this.props.obj).bind(this);
        this.getBody = this.getBody.bind(this);
    }

    getBody(){
        let values = this.props.attributes.map(attribute => <td>{this.props.obj[attribute]}</td>);
        return (
            <tr>
                <td>
                    <UpdateDialog attributes={this.props.attributes}
                                  onModify={this.props.onUpdate}
                                  clearAfterModification={false}
                                  what={this.props.what}
                                  obj={this.props.obj}/>
                </td>
                {values}
                <td>
                    <button onClick={this.onDelete} style={{color: 'red'}}>X</button>
                </td>
            </tr>
        )
    }

    render(){
        return (
            <h6>Override me</h6>
        )
    }
}

class Car extends Element {
    constructor(props){
        super(props)
    }

    render(){
        return this.getBody();
    }
}

class Driver extends Element {
    constructor(props){
        super(props)
    }

    render(){
        return this.getBody();
    }
}

class Record extends React.Component {
    constructor(props){
        super(props);
        this.onDelete = curryIt(this.props.onDelete, this.props.obj).bind(this);
        this.getBody = this.getBody.bind(this);
        this.mapper = {
            car: ((_car) => _car.model+' '+_car.registrationNumber),
            drivers: ((_driver) => _driver.firstName+' '+_driver.secondName)
        }
    }

    getBody(){
        let values = this.props.attributes.map(attribute =>
            <td>{this.mapper[attribute](this.props.obj[attribute])}</td>);
        return (
            <tr>
                <td>
                    <CarToDriverAssignmentUpdateDialog attributes={this.props.attributes}
                                                       onModify={this.props.onUpdate}
                                                       clearAfterModification={false}
                                                       what={this.props.what}
                                                       record={this.props.record}
                                                       availableCars={this.props.availableCars}
                                                       availableDrivers={this.props.availableDrivers}/>
                </td>
                {values}
                <td>
                    <button onClick={this.onDelete} style={{color: 'red'}}>X</button>
                </td>
            </tr>
        )
    }
}

export {Cars, Drivers, GarageJournal}