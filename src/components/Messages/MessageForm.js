import React from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from '../../firebase';

class MessageForm extends React.Component {
  state = {
    message: '',
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: []
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: []
    })
  }

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        avatar: this.state.user.photoURL,
        name: this.state.user.displayName
      },
      content: this.state.message
    }
    return message;
  }

  sendMessage = () => {
    const { message, channel } = this.state;
    const { messagesRef } = this.props;

    if (message) {
      this.setState({loading:true});
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() =>{
          this.setState({
            loading: false,
            message: '',
            errors: []
          })
        })
        .catch(err => {
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          })
        })
    } else {
      this.setState({
        errors: this.state.errors.concat({message: "Add a message"})
      })
    }
  }

  render() {
    const { message, errors, loading } = this.state;
    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          value={message}
          onChange={this.handleChange}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder="Write your message"
          className={
            errors.some(error =>
              error.message.toLowerCase().includes("message")
            ) ? "error" : ""
          }
        />
        <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
            disabled={loading}
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            disabled={loading}
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;
