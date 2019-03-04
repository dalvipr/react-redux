import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import registerServiceWorker from './registerServiceWorker';

import 'semantic-ui-css/semantic.min.css'

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import firebase from './firebase';

import { Provider } from 'react-redux';
import store from './store';
import { connect } from 'react-redux';
import { setUser, clearUser } from './actions'

import Spinner from './components/Spinner';

class Root extends Component {

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.props.history.push('/');
				this.props.setUser(user);
			} else {
				this.props.history.push('/login');
				this.props.clearUser();
			}
		})
	}
	render() {
		return this.props.loading ? <Spinner /> : (
			<Switch>
				<Route exact path="/" component={App} user={this.props.user}/>
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
			</Switch>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.user.isLoading
	}
}

const RootWithAuth = withRouter(connect(mapStateToProps, {setUser, clearUser})(Root));

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<RootWithAuth />
		</Router>
	</Provider>
	, document.getElementById('root'));
registerServiceWorker();
