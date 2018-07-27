import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import './static/App.css';
import axios from 'axios'
import {prefix, cars_url, drivers_url, garage_url, cars_profile,
    garage_profile, drivers_profile, profile_prefix} from './urls'
import {CreateDialog} from './CRUDWindows'
import {Cars, Drivers, GarageJournal} from "./Tables";
import {curryIt} from "./utils";


class App extends Component {
    constructor(props){
        super(props);

        this.fetchAll = this.fetchAll.bind(this);
        this.toPage = this.toPage.bind(this);
        this.toLastPage = this.toLastPage.bind(this);
        this.toFirstPage = this.toFirstPage.bind(this);
        this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.fetchAvailable = this.fetchAvailable.bind(this);
        this.state = {
            cars: [],
            availableCars: [],
            drivers: [],
            availableDrivers: [],
            garageJournal: [],
            pageSize: 2,
            attributes: {
                car_attributes: [],
                driver_attributes: [],
                garage_attributes: []
            },
            links: {
                cars_links: {},
                drivers_links: {},
                garage_links: {}
            },
            pages: {
                cars_page: {},
                drivers_page: {},
                garage_page: {}
            }
        };
    }

    fetchAvailable(table){
        axios.get(prefix+table+'/available')
            .then(response => {
                let state = {};
                state[table] = response.data._embedded[table];
                this.setState(state)
            })
    }

    fetchAll(pageSize){
        axios.all([
            axios.get(cars_url+'?size='+pageSize),
            axios.get(drivers_url+'?size='+pageSize),
            axios.get(garage_url+'?size='+pageSize)
        ])
            .then(axios.spread((cars_resp, drivers_resp, garage_resp) => {
                axios.all([
                    axios.get(cars_resp.data._links.profile.href),
                    axios.get(drivers_resp.data._links.profile.href),
                    axios.get(garage_resp.data._links.profile.href)
                ]).then(axios.spread((cars_prof_resp, drivers_prof_resp, garage_prof_resp) => {
                    delete garage_prof_resp.data.links; //TODO fix json serialization on server side
                    this.setState({
                        attributes: {
                            car_attributes: Object.keys(cars_prof_resp.data.properties),
                            driver_attributes: Object.keys(drivers_prof_resp.data.properties),
                            garage_attributes: Object.keys(garage_prof_resp.data.properties)
                        },
                    })
                }));
                let individuals = {
                    cars: cars_resp.data._embedded.cars
                        .map(car => axios.get(car._links.self.href)),
                    drivers: drivers_resp.data._embedded.drivers
                        .map(driver => axios.get(driver._links.self.href)),
                    garageJournal: garage_resp.data._embedded.garageRecords
                        .map(record => axios.get(record._links.self.href))
                };
                axios.all(individuals.cars)
                    .then(axios.spread((...args) => {
                        args = args.map(arg => arg.data);
                        this.setState({
                            cars: args
                        })
                    }));
                axios.all(individuals.drivers)
                    .then(axios.spread((...args) => {
                        args = args.map(arg => arg.data);
                        this.setState({
                            drivers: args
                        })
                    }));
                axios.all(individuals.garageJournal)
                    .then(axios.spread((...args) => {
                        args = args.map(arg => arg.data);
                        this.setState({
                            garageJournal: args
                        })
                    }));
                this.setState({
                    pageSize: pageSize,
                    links: {
                        cars_links: cars_resp.data._links,
                        drivers_links: drivers_resp.data._links,
                        garage_links: garage_resp.data._links
                    },
                    pages: {
                        cars_page: cars_resp.data.page,
                        drivers_page: drivers_resp.data.page,
                        garage_page: garage_resp.data.page
                    }
                });
            }));
    }

    toPage(state, table, uri){
        axios.get(uri)
            .then(response => {
                state[table] = response.data._embedded[table];
                state.links[table+'_links'] = response.data._links;
                this.setState(state);
            });
    }

    toPrevPage(table){
        let link = table+'_links';
        if (this.state.links[link].prev !== undefined){
            this.toPage(this.state, table, this.state.links[link].prev.href)
        } else
            this.toPage(this.state, table, this.state.links[link].self.href)
    }

    toNextPage(table){
        let link = table+'_links';
        if (this.state.links[link].next !== undefined){
            this.toPage(this.state, table, this.state.links[link].next.href)
        } else
            this.toPage(this.state, table, this.state.links[link].self.href)
    }

    toLastPage(table){
        let link = table+'_links';
        if (this.state.links[link].last !== undefined){
            this.toPage(this.state, table, this.state.links[link].last.href)
        } else
            this.toPage(this.state, table, this.state.links[link].self.href)
    }

    toFirstPage(table){
        let link = table+'_links';
        if (this.state.links[link].first !== undefined){
            this.toPage(this.state, table, this.state.links[link].first.href)
        } else
            this.toPage(this.state, table, this.state.links[link].self.href)
    }

    refreshCurrentPage(state, table){
        axios.get(prefix+'/'+table, {
            page: state.pages[table+'_page'].page.number,
            size: state.pageSize
        }).then(response => {
            state[table] = response.data._embedded[table];
            state.pages[table+'_page'] = response.data.page;
            this.setState(state);
        })
    }

    updatePageSize(newPageSize){
        this.fetchAll(this.state, this.updateState, newPageSize);
    }

    onCreate(table, newObj){
        axios.put(prefix+'/'+table, newObj, {
            headers: {'Content-Type': 'application/json'}
        })
            .then(() => {
                this.toLastPage(table);
            });
    }

    onDelete(table, obj){
        axios.delete(obj._links.self.href)
            .then(() => {
                this.refreshCurrentPage(this.state, table);
            })
    }

    onUpdate(table, obj, updatedObj){
        axios.put(obj._links.self.href, updatedObj)
            .then(() => {
                this.refreshCurrentPage(this.state, table);
            });
    }

    componentDidMount(){
        this.fetchAll(this.state.pageSize);
    }

    render(){
        return (
            <div>
                <Cars data={this.state.cars}
                      attributes={this.state.attributes.car_attributes}
                      toLastPage={curryIt(this.toLastPage, 'cars')}
                      toFirstPage={curryIt(this.toFirstPage, 'cars')}
                      toPrevPage={curryIt(this.toPrevPage, 'cars')}
                      toNextPage={curryIt(this.toNextPage, 'cars')}
                      onCreate={curryIt(this.onCreate, 'cars')}
                      onUpdate={curryIt(this.onUpdate, 'cars')}
                      onDelete={curryIt(this.onDelete, 'cars')}
                      links={this.state.links.cars_links}/>
                <Drivers data={this.state.drivers}
                         attributes={this.state.attributes.driver_attributes}
                         toLastPage={curryIt(this.toLastPage, 'drivers')}
                         toFirstPage={curryIt(this.toFirstPage, 'drivers')}
                         toPrevPage={curryIt(this.toPrevPage, 'drivers')}
                         toNextPage={curryIt(this.toNextPage, 'drivers')}
                         onCreate={curryIt(this.onCreate, 'drivers')}
                         onUpdate={curryIt(this.onUpdate, 'drivers')}
                         onDelete={curryIt(this.onDelete, 'drivers')}
                         links={this.state.links.drivers_links}/>
                <GarageJournal data={this.state.garageJournal}
                               attributes={this.state.attributes.garage_attributes}
                               toLastPage={curryIt(this.toLastPage, 'garageJournal')}
                               toFirstPage={curryIt(this.toFirstPage, 'garageJournal')}
                               toPrevPage={curryIt(this.toPrevPage, 'garageJournal')}
                               toNextPage={curryIt(this.toNextPage, 'garageJournal')}
                               onCreate={curryIt(this.onCreate, 'garageJournal')}
                               onUpdate={curryIt(this.onUpdate, 'garageJournal')}
                               onDelete={curryIt(this.onDelete, 'garageJournal')}
                               links={this.state.links.garage_links}
                               availableCars={this.state.availableCars}
                               availableDrivers={this.state.availableDrivers}/>
            </div>
        )
    }
}

export default App;
