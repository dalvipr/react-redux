import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Message, Header, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';

class Register extends Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			passwordConfirmation: '',
			username: '',
			errors: [],
			loading: false,
			userRef: firebase.database().ref('users')
		}
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	isFormValid = () => {
		let errors= [];
		let error;

		if (this.isFormEmpty(this.state)) {
			error = {message: "All fields are  required"};
			this.setState({errors: errors.concat(error)});
			return false;
		} else if (!this.isPasswordValid(this.state)) {
			error = {message: 'Password must be same and at least 6 characters'};
			this.setState({errors: errors.concat(error)});
			return false;
		} else {
			return true;
		}
	}
	
	isFormEmpty = (state) => {
		return !state.username.length || !state.email.length || !state.password.length || !state.passwordConfirmation.length;
	}

	isPasswordValid = ({password, passwordConfirmation}) => {
		return (password.length > 5 && (password === passwordConfirmation));
	}

	displayError = (errors) => errors.map((error, index) => {
		return (
			<p key={index}>{error.message}</p>
		)
	})
	

	handleSubmit = (e) => {
		e.preventDefault();
		if (this.isFormValid()) {
			this.setState({
				errors: [],
				loading: true
			})
			const { email, password } = this.state;
			firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)
				.then(createdUser => {
					console.log(createdUser);
					createdUser.user.updateProfile({
						displayName: this.state.username,
						photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
					})
					.then (() => {
						this.saveUser(createdUser).then (() => {
							console.log('userSaved');
							this.setState({loading: false})
						})
					})
					.catch(err => {
						console.log(err);
						this.setState({ errors: this.state.errors.concat(err), loading: false })
					});
				})
				.catch(err => {
					console.log(err);
					this.setState({ errors: this.state.errors.concat(err),loading: false })
				});
		}
	}

	saveUser = (createdUser) => {
		return(
			this.state.userRef.child(createdUser.user.uid).set({
				name: createdUser.user.displayName,
				avatar: createdUser.user.photoURL
			})
		)
	}

	handleError = (errors, inputName) => {
		return(
			errors.some(error =>
				error.message.toLowerCase().includes(inputName) 
			)
		) ? "error" : ""
	}

	render() {
		const { email, password, passwordConfirmation, username, errors, loading } = this.state;
		return (
			<Grid textAlign="center" verticalAlign="middle" className="app">
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as="h2" icon color="blue" textAlign="center">
						<Icon name="signup" />
						Registration for Chat
					</Header>
					{errors.length > 0 && (
						<Message error>{this.displayError(errors)}</Message>
					)}
					<Form onSubmit={this.handleSubmit} size="large">
						<Segment stacked>
							<Form.Input
								fluid
								name="username"
								value={username}
								icon="user"
								iconPosition="left"
								placeholder="Username"
								onChange={this.handleChange}
								type="text"
							/>
							<Form.Input
								fluid
								name="email"
								value={email}
								icon="mail"
								iconPosition="left"
								placeholder="Email"
								onChange={this.handleChange}
								type="email"
								className={this.handleError(errors, "email")}
							/>
							<Form.Input
								fluid
								name="password"
								value={password}
								icon="lock"
								iconPosition="left"
								placeholder="Password"
								onChange={this.handleChange}
								type="password"
								className={this.handleError(errors, "password")}
							/>
							<Form.Input
								fluid
								name="passwordConfirmation"
								value={passwordConfirmation}
								icon="repeat"
								iconPosition="left"
								placeholder="Confirm Password"
								onChange={this.handleChange}
								type="password"
								className={this.handleError(errors, "password")}
							/>
							<Button
								disabled={loading}
								className={loading? 'loading': ''}
								fluid color="blue" size="large">Register</Button>
							</Segment>
					</Form>
					<Message>Already a user? <Link to="/login">Login</Link></Message>
				</Grid.Column>
			</Grid>
		);
	}
}

export default Register;