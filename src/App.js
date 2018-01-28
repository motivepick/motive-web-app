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
        fetch("http://localhost:8080/tasks")
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
            )
    }

    render() {
        UIkit.use(Icons);
        const {error, isLoaded, tasks} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="uk-container uk-container-small">
                    <ul className="uk-list uk-list-divider">
                        {tasks.map(task => (
                            <li key={task.name}>
                                <div className="uk-flex uk-flex-between uk-flex-middle">
                                    <input className="uk-checkbox uk-margin-auto-vertical uk-margin-small-left uk-margin-small-right"
                                        type="checkbox"/>
                                    <input className="uk-input uk-form-blank uk-text-truncate" type="text" value={task.name} placeholder={task.name}
                                           readOnly/>
                                    <a href="javascript:void(0)" uk-icon="icon: check"/>
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
