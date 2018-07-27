import React from 'react';
import ReactDOM from 'react-dom'
import Select from 'react-select'
import './static/App.css';
import {preventDefaultDecorator} from "./utils";

class ModificationDialog extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = preventDefaultDecorator(this.handleSubmit).bind(this);
        this.getBody = this.getBody.bind(this);
    }

    handleSubmit(){
        let obj = {};
        this.props.attributes.forEach(attribute => {
            obj[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onModify(obj);
        if (this.props.clearAfterModification)
            this.props.attributes.forEach(attribute => {
                ReactDOM.findDOMNode(this.refs[attribute]).value = '';
            });
        window.location = "#";
    }

    getBody(id, buttonText, header, inputs, submitText, submitHandler){
        return (
            <div className='container'>
                <a href={"#"+id}>{buttonText}</a>
                <div id={id} className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">X</a>
                        <h2>{header}</h2>
                        <form>
                            {inputs}
                            <button onClick={submitHandler}>{submitText}</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        return (
            <h6>Override me</h6>
        )
    }
}

class CreateDialog extends ModificationDialog {
    constructor(props){
        super(props);
    }

    render() {
        let inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <input type="text" placeholder={attribute} ref={attribute} className="field" />
            </p>
        );

        return this.getBody(
            'create'+this.props.what,
            'Add '+this.props.what,
            'Create new '+this.props.what,
            inputs,
            'Create',
            this.handleSubmit)
    }
}

class UpdateDialog extends ModificationDialog {
    constructor(props) {
        super(props);
    }

    render() {
        let inputs = this.props.attributes.map(attribute =>
            <p key={this.props.obj[attribute]}>
                <input type="text" placeholder={attribute}
                       defaultValue={this.props.obj[attribute]}
                       ref={attribute} className="field" />
            </p>
        );

        let dialogId = "update" + this.props.what + '-' + this.props.obj._links.self.href;

        return this.getBody(
            dialogId,
            '*',
            'Update the '+this.props.what+' '+this.props.obj._links.self.href,
            inputs,
            'Update',
            this.handleSubmit)
    }
}

class CarToDriverAssignmentCreateDialog extends ModificationDialog {
    constructor(props){
        super(props);
        this.state = {
            selectedCar: null,
            selectedDriver: null
        };
        this.handleCarChange = this.handleCarChange.bind(this);
        this.handleDriverChange = this.handleDriverChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCarChange(selectedOption){
        this.setState({
            selectedCar: selectedOption
        })
    }

    handleDriverChange(selectedOption){
        this.setState({
            selectedDriver: selectedOption
        })
    }

    handleSubmit(){
        let record = {
            car: this.state.selectedCar,
            driver: this.state.selectedDriver
        };
        this.props.onModify(record);
        window.location = "#";
    }

    render(){
        let inputs = [
            <p key='car'>
                <Select value={this.state.selectedCar}
                        onChange={this.handleCarChange}
                        options={this.props.availableCars}/>
            </p>,
            <p key='driver'>
                <Select value={this.state.selectedDriver}
                        onChange={this.handleDriverChange}
                        options={this.props.availableDrivers}/>
            </p>
        ];
        return this.getBody(
            'createRecord',
            'New Assignment',
            'Create new assignment',
            inputs,
            'Create'
        )
    }
}

class CarToDriverAssignmentUpdateDialog extends ModificationDialog {
    constructor(props){
        super(props);
        this.state = {
            selectedCar: this.props.record.car,
            selectedDriver: this.props.record.driver
        };
        this.handleCarChange = this.handleCarChange.bind(this);
        this.handleDriverChange = this.handleDriverChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCarChange(selectedOption){
        this.setState({
            selectedCar: selectedOption
        })
    }

    handleDriverChange(selectedOption){
        this.setState({
            selectedDriver: selectedOption
        })
    }

    handleSubmit(){
        let record = {
            car: this.state.selectedCar,
            driver: this.state.selectedDriver
        };
        this.props.onModify(record);
        window.location = "#";
    }

    render(){
        let inputs = [
            <p key={this.props.record.car}>
                <Select value={this.state.selectedCar}
                        onChange={this.handleCarChange}
                        options={this.props.availableCars}/>
            </p>,
            <p key={this.props.record.driver}>
                <Select value={this.state.selectedDriver}
                        onChange={this.handleDriverChange}
                        options={this.props.availableDrivers}/>
            </p>
        ];
        return this.getBody(
            'updateRecord-'+this.props.record._links.self.href,
            '*',
            'Update assignment '+this.props.record._links.self.href,
            inputs,
            'Update'
        )
    }
}

export {CreateDialog, UpdateDialog, CarToDriverAssignmentCreateDialog, CarToDriverAssignmentUpdateDialog}