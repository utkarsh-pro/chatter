import React from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Classes from './chatter.module.css';
import Input from '../components/UI/Input/input';
import Button from '../components/UI/Button/button';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import Message from '../components/Message/message';
import Friend from '../components/Friend/friend';

const socket = io.connect('http://localhost:5000');

// Initiate connection the socket
const connectToSocket = sender => {
    socket.emit('connected', sender);
}
// Send private messages
const privateChat = (sender, reciever, msg) => {
    socket.emit('private', { private: msg, sender, reciever });
}

class Chatter extends React.Component {
    componentDidMount() {
        // Making connection request to the server
        connectToSocket(this.props.auth.user.username);

        // Listening to private messages
        socket.on('message', msg => {
            this.setState((state, props) => {
                return { message: state.messageLog.push(msg) }
            });
        });

        // AJAX call to server to retrieve list of friends
        axios.get('/api/chatter', { params: { username: this.props.auth.user } })
            .then(res => console.log(res)).catch(err => console.log(err));
    }

    state = {
        reciever: '',
        message: '',
        messageLog: ['Hello', 'Hi'],
        searchField: '',
        friends: [{ name: 'Friend1', id: 'me' }, { name: 'Friend2', id: 'test2' }, { name: 'Friend3', id: 'utkarsh' }],
        newFriend: ''
    }

    //Set the name the reciever of the messages
    setReciever = reciever => {
        console.log(reciever);
        this.setState({ reciever });;
    }

    // Add a new friend
    newFriend = (e) => {
        this.setState({ newFriend: e.target.value });
        if (e.key === 'Enter') {
            axios.post('/api/chatter', { friend: this.state.newFriend, username: this.props.auth.user.username })
                .then(res => console.log(res))
                .catch(err => console.log(err));
        }
    }

    //Dont know what this function does
    press = (cnt, name) => {
        this.setState({ [name]: cnt });
    }

    // Send private messages --------- DO NOT TOUCH !
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
                        placeholder='Add username of your friend'
                        onChange={this.newFriend}
                        onKeyPress={this.newFriend} />
                    <div className={Classes.friends}>
                        {this.state.friends.map((val) => (
                            <Friend key={val.id} onClick={this.setReciever} id={val.id}>
                                {val.name}
                            </Friend>)
                        )}
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
                            active={this.state.reciever ? true : false}
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