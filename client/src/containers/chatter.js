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

        // AJAX call to server to retrieve list of friends and messages
        this.recieveFriends();
    }

    // Recieve list of friends from the server -- A protected route
    recieveFriends = () => {
        axios.get('/api/chatter/friends', { params: { username: this.props.auth.user } })
            .then(res => this.setState({
                friends: Object.keys(res.data).map(key => (
                    [key, res.data[key]]
                ))
            }))
            .catch(err => console.log(err));
    }

    state = {
        reciever: '',
        message: '',
        messageLog: [],
        searchField: '',
        friends: [],
        newFriend: '',
    }

    //Set the name the reciever of the messages
    setReciever = reciever => {
        console.log(reciever);
        this.setState({ reciever });
    }

    // Add a new friend
    newFriend = (e) => {
        this.setState({ newFriend: e.target.value });
        if (e.key === 'Enter') {
            axios.post('/api/chatter/friends',
                { friend: this.state.newFriend, username: this.props.auth.user.username })
                .then(res => { console.log(res); this.recieveFriends(); })
                .catch(err => console.log(err));
            e.target.value = ''; // Clears the input field
        }
    }

    //Dont know what this function does -- Basically I forgot
    press = (e, name) => {
        this.setState({ [name]: e.target.value });
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
                            <Friend key={val[0]} onClick={this.setReciever} id={val[0]}>
                                {val[0]}
                            </Friend>)
                        )}
                    </div>
                </div>

                {/* View for messages */}
                <div className={Classes.view}>
                    <div className={Classes.nameField}>
                        {this.state.reciever}
                    </div>
                    <div className={Classes.msgBlock}>
                        {messages}
                    </div>

                    {/* Message box */}
                    <div className={Classes.msgBox}>
                        <Input
                            type='text'
                            name='message'
                            label=''
                            value={this.state.message}
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