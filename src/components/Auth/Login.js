import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Message, Header, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: [],
            loading: false
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    displayError = (errors) => errors.map((error, index) => {
        return (
            <p key={index}>{error.message}</p>
        )
    })


    handleSubmit = (e) => {
        e.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({
                errors: [],
                loading: true
            })
            const { email, password } = this.state;

            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(signedInUser => {
                    console.log(signedInUser);
                    this.setState({
                        loading: false
                    })
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat({ message: 'Invalid Email or Password' })
                    })
                })
        }
    }

    isFormValid = ({email, password}) => email && password;

    handleError = (errors, inputName) => {
        return (
            errors.some(error =>
                error.message.toLowerCase().includes(inputName)
            )
        ) ? "error" : ""
    }

    render() {
        const { email, password, errors, loading } = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="blue" textAlign="center">
                        <Icon circular name='users' />
                        Login to Chat
					</Header>
                    {errors.length > 0 && (
                        <Message error>{this.displayError(errors)}</Message>
                    )}
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
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
                            <Button
                                disabled={loading}
                                className={loading ? 'loading' : ''}
                                fluid color="blue" size="large">Login</Button>
                        </Segment>
                    </Form>
                    <Message>Don't have an account? <Link to="/register">Register</Link></Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;