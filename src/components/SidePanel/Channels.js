import React, { Component } from 'react';
import { Menu, Icon, Modal, Form, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions/index'
class Channels extends Component {
    state = {
        activeChannel: '',
        channels: [],
        channelDetails: '',
        channelName: '',
        modal: false,
        channelRef: firebase.database().ref('channels'),
        user: this.props.currentUser,
        firstLoad: true
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    closeModal = () => {
        this.setState({modal: false})
    }

    openModal = () => {
        this.setState({modal:true})
    }


    handleSubmit = (e) => {
        e.preventDefault();
        if(this.isFormValid(this.state)) {
            this.addChannel();
        } else {
            console.log('Unable to submit');
        }
    }

    componentDidMount() {
        this.addListener();
    }

    componentWillUnmount() {
        this.removeListener();
    }
    
    removeListener = () => {
        this.state.channelRef.off();
    }

    addListener = () => {
        const loadedChannels = [];

        this.state.channelRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({channels: loadedChannels}, () => {
                this.setFirstChannel()
            })
        })
    }

    setFirstChannel = () => {
        const { channels, firstLoad } = this.state;
        if (firstLoad && channels.length > 0) {
            this.props.setCurrentChannel(channels[0]);
            this.setActiveChannel(channels[0]);
        }

        this.setState({firstLoad:false})
    }

    addChannel = () => {
        const { channelRef, channelName, channelDetails, user } = this.state;

        const key = channelRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        channelRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({channelDetails:'', channelName:''})
                this.closeModal();
                console.log("Channel Added:");
            })
            .catch(err => {
                console.log(err);
            })
    }

    displayChannels = (channels) => (
        channels.length > 0 &&
        channels.map( channel => (
            <Menu.Item
                key={channel.id}
                name={channel.name}
                onClick={() => this.channelChange(channel)}
                style={{opacity:0.7}}
                active={channel.id === this.state.activeChannel}
            >
            # {channel.name}
            </Menu.Item>
        ))
    )
    
    channelChange = (channel) => {
        this.props.setCurrentChannel(channel);
        this.setActiveChannel(channel);
    }

    setActiveChannel = (channel) => {
        this.setState({activeChannel: channel.id})
    }

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    render() {
        const { channels, channelName, channelDetails, modal } = this.state;
        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: "2em" }}>
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                    </span>{" "}
                        ({channels.length}) <Icon onClick={this.openModal} name="add" />
                    </Menu.Item>
                    {channels.length && this.displayChannels(channels)}
                </Menu.Menu>
                <Modal basic open={modal} onClose={this.closeModal} style={{position:"static"}}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    value={channelName}
                                    onChange={this.handleChange}
                                    type="text"
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="About the Channel"
                                    name="channelDetails"
                                    value={channelDetails}
                                    onChange={this.handleChange}
                                    type="text"
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button type="submit" inverted color="green" onClick={this.handleSubmit}>
                            <Icon name="add" />
                            Add
                        </Button>
                        <Button  inverted color="red" onClick={this.closeModal}>
                            <Icon name="remove" />
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>

        );
    }
}

export default connect(null, {setCurrentChannel})(Channels);