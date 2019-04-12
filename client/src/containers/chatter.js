import React from 'react';
import { Helmet } from 'react-helmet';
import Classes from './chatter.module.css';
import Input from '../components/UI/Input/input';
import Button from '../components/UI/Button/button';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import Message from '../components/Message/message';
import Friend from '../components/Friend/friend';

const socket = io.connect('http://localhost:5000');

const connectToSocket = (sender, reciever) => {
    socket.emit('connected', { sender, reciever });
}
const privateChat = (sender, reciever, msg) => {
    socket.emit('private', { private: msg, sender, reciever });
}

class Chatter extends React.Component {
    componentDidMount() {
        socket.on('message', msg => {
            this.setState((state, props) => {
                return { message: state.messageLog.push(msg) }
            });
        });
    }

    state = {
        reciever: '',
        message: '',
        messageLog: ['Hello', 'Hi'],
        searchField: '',
        friends: ['Friend1', 'Friend2', 'Friend1', 'Friend2', 'Friend1', 'Friend2']
    }

    press = (cnt, name) => {
        console.log(name);
        this.setState({ [name]: cnt });
    }
    // Initiate a session with a user
    submit = e => {
        connectToSocket(this.props.auth.user.username, this.state.reciever);
    }
    // Private messages
    chat = e => {
        privateChat(this.props.auth.user.username, this.state.reciever, this.state.message);
    }
    render() {
        const messages = this.state.messageLog.map((val, i) => (
            <Message key={i}>{val}</Message>
        ))
        return (
            <div className={Classes.wrapper}>
                <Helmet>
                    <title>Chatter: Welcome to chatter</title>
                </Helmet>

                {/* List of friends */}
                <div className={Classes.list}>
                    <input
                        type='text'
                        name='reciever'
                        className={Classes.addFriends}
                        placeholder='Search friends' />
                    <div className={Classes.friends}>
                        {this.state.friends.map((val, i) => (<Friend key={i}>{val}</Friend>))}
                    </div>
                </div>

                {/* View for messages */}
                <div className={Classes.view}>
                    <div className={Classes.msgBlock}>
                        {messages}
                    </div>

                    {/* Message box */}
                    <div className={Classes.msgBox}>
                        <div className={Classes.nameField}>
                        </div>
                        <Input
                            type='text'
                            name='message'
                            label=''
                            display='inline-block'
                            width='75%'
                            marginRight='1rem'
                            press={this.press} />
                        <Button
                            type='success'
                            name='Send Message'
                            display='inline'
                            click={this.chat} />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, null)(Chatter);