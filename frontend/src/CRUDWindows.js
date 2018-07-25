import React from 'react';
import ReactDOM from 'react-dom'
import './static/App.css';

class CreateDialog extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let newObj = {};
        this.props.attributes.forEach(attribute => {
            newObj[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        console.log(newObj);
        this.props.onCreate(newObj);

        // clear out the dialog's inputs
        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = '';
        });

        // Navigate away from the dialog to hide it.
        window.location = "#";
    }

    render() {
        let inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <input type="text" placeholder={attribute} ref={attribute} className="field" />
            </p>
        );

        return (
            <div className='container'>
                <a href={"#create"+this.props.what}>Add {this.props.what}</a>

                <div id={"create"+this.props.what} className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">X</a>

                        <h2>Create new {this.props.what}</h2>

                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

class UpdateDialog extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let newObj = {};
        this.props.attributes.forEach(attribute => {
            newObj[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        console.log(newObj);
        this.props.onCreate(newObj);

        // clear out the dialog's inputs
        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = '';
        });

        // Navigate away from the dialog to hide it.
        window.location = "#";
    }

    render(){
        let inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <input type="text" placeholder={attribute} ref={attribute} className="field" />
            </p>
        );

        return (
            <div className='container'>
                <a href={"#update"+this.props.what}>Add {this.props.what}</a>

                <div id={"update"+this.props.what} className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">X</a>

                        <h2>Create new {this.props.what}</h2>

                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export {CreateDialog}