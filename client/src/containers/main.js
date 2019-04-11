import React from 'react';
import Classes from './main.module.css';
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

class Main extends React.Component {
    componentDidMount() {
        socket.on('heya', msg => {
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
                <div className={Classes.view}>
                    <div className={Classes.msgBlock}>
                        {messages}
                    </div>
                    <div className={Classes.msgBox}>
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

export default connect(mapStateToProps, null)(Main);