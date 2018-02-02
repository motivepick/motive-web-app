import React, {Component} from 'react';
import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/css/uikit-rtl.min.css';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            tasks: []
        };
    }

    componentDidMount() {
        fetch("http://staymotivated.tk/tasks")
            .then(response => response.json())
            .then(
                (json) => {
                    this.setState({
                        isLoaded: true,
                        tasks: json
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    onAddNewTask(e) {
        if (e.key === 'Enter') {
            const component = this;
            const input = e.target;
            const task = {name: input.value};
            fetch('http://staymotivated.tk/tasks', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            })
                .then(response => response.json())
                .then(
                    (taskWithId) => {
                        component.setState({tasks: [taskWithId].concat(component.state.tasks)});
                        input.value = '';
                    }, (error) => {
                        component.setState({error});
                    }
                );
        }
    }

    render() {
        UIkit.use(Icons);
        const {error, isLoaded, tasks} = this.state;
        if (error) {
            return (
                <div className="uk-container uk-container-small">
                    <br/>
                    Error: {error.message}
                </div>
            );
        } else if (!isLoaded) {
            return (
                <div className="uk-container uk-container-small">
                    <br/>
                    Loading...
                </div>
            );
        } else {
            return (
                <div className="uk-container uk-container-small">
                    <br/>
                    <div className="uk-flex uk-flex-between uk-flex-middle">
                        <input className="uk-input" type="text" placeholder="Write new task"
                               onKeyPress={this.onAddNewTask.bind(this)}/>
                    </div>
                    <ul className="uk-list uk-list-divider">
                        {tasks.map(task => (
                            <li key={task.name}>
                                <div className="uk-flex uk-flex-between uk-flex-middle">
                                    <input className="uk-input uk-form-blank uk-text-truncate" type="text"
                                           value={task.name} placeholder={task.name} readOnly/>
                                    <a href="javascript:void(0)" data-uk-icon="icon: check"/>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    }
}

export default App;
