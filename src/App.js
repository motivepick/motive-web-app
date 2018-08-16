import React from 'react'
import './App.css'
import Tasks from './Tasks/Tasks'
import { connect } from 'react-redux'
import LoginView from './Authentication/LoginView'
import SpinnerView from './SpinnerView'
import { loadUserData, setUser } from './actions/userActions'

class App extends React.Component {

    componentDidMount() {
        const { setUser, loadUserData } = this.props
        const accountId = localStorage.getItem('id')

        if (accountId) {
            loadUserData(accountId)
                .then((res) => setUser(res.payload.body))
                .catch(() => setUser())
        } else {
            setUser()
        }
    }

    render() {
        const { user, done } = this.props
        if (done) {
            return user ? <Tasks/> : <LoginView/>
        } else {
            return <SpinnerView/>
        }
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    done: state.user.done
})

const mapDispatchToProps = dispatch => ({
    setUser: (user) => dispatch(setUser(user)),
    loadUserData: (accountId) => dispatch(loadUserData(accountId))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
