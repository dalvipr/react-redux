import React, { Component } from 'react';
import { Grid, Icon, Header, Dropdown, Image } from 'semantic-ui-react';

import firebase from '../../firebase';
//import { connect } from 'react-redux';

class UserPanel extends Component {

    state = {
        user: this.props.currentUser
    }

    dropdownOptions = () => [
        {
            key: "user",
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: "avatar",
            text: <span>Change Avatar</span>
        },
        {
            key: "signout",
            text: <span onClick={this.handleSignOut}>Signed Out</span>
        },
    ]

    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(res => {
                console.log("Signed Out:", res);
            })
    }

    render() {
        const { user } = this.state;
        return (
            <Grid>
                <Grid.Column>
                    <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>ChatPlatform</Header.Content>
                        </Header>
                        <Header as="h4" inverted style={{ padding: "0.25em" }}>
                            <Dropdown
                                trigger={
                                    <span>
                                        <Image src={user.photoURL} spaced="right" avatar />
                                        {user.displayName}
                                    </span>
                                }
                                options={this.dropdownOptions()}
                            />
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
}

// const mapStateToProps = (state) => {
//     return {
//         currentUser: state.user.currentUser
//     }
// }

export default UserPanel;