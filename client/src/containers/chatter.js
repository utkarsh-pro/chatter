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

const socket = io.connect('/');

// Initiate connection the socket
const connectToSocket = sender => {
    socket.emit('connected', sender);
}
// Send private messages
const privateChat = (sender, reciever, msg) => {
    socket.emit('private', { message: msg, sender, reciever });
}

class Chatter extends React.Component {
    componentDidMount() {
        // Making connection request to the server
        connectToSocket(this.props.auth.user.username);

        // Listening to private messages
        socket.on('message', msg => {
            this.setState((prevState, props) => {
                const target = this.state.friends[msg.sender];
                return { [target]: prevState.friends[msg.sender].push(msg) }
            });
        });

        // AJAX call to server to retrieve list of friends and messages
        this.recieveFriends();
    }

    // Recieve list of friends from the server -- A protected route
    recieveFriends = () => {
        axios.get('/api/chatter/friends', { params: { username: this.props.auth.user } })
            .then(res => this.setState({ friends: res.data }))
            .catch(err => console.log(err));
    }

    state = {
        reciever: '',
        message: '',
        messageLog: [],
        searchField: '',
        friends: {},
        newFriend: '',
        showChatsMob: false
    }

    // Refs
    textInput = React.createRef();
    messageEnd = React.createRef();

    //Set the name the reciever of the messages
    setReciever = reciever => {
        this.setState({ reciever });
        if (window.screen.width <= 800)
            // Show messages on mobile view
            this.setState({ showChatsMob: true })
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

    press = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    // Send private messages --------- DO NOT TOUCH !
    chat = e => {
        if (this.state.message) {
            privateChat(this.props.auth.user.username, this.state.reciever, this.state.message);
            this.setState((prevState, props) => {
                const target = this.state.friends[this.state.reciever];
                return {
                    [target]: prevState.friends[prevState.reciever].push({
                        sender: this.props.auth.user.username,
                        reciever: prevState.reciever,
                        message: prevState.message
                    })
                }
            });
            this.textInput.current.value = '';
            this.setState({ message: '' });
        }
    }

    // Back - button in mobile view
    show = () => {
        this.setState({ showChatsMob: false });
    }

    render() {
        return (
            <div className={Classes.wrapper}>
                <Helmet>
                    <title>Chatter: Welcome to chatter</title>
                </Helmet>

                {/* List of friends */}
                <div className={Classes.list}
                    style={!this.state.showChatsMob ? { display: 'inherit' } : { display: 'none' }}>
                    <input
                        type='text'
                        name='reciever'
                        className={Classes.addFriends}
                        placeholder='Add username of your friend'
                        onChange={this.newFriend}
                        onKeyPress={this.newFriend} />
                    <div className={Classes.friends}>
                        {Object.keys(this.state.friends).map((val, i) => (
                            <Friend key={i} onClick={this.setReciever} id={val}>
                                {val}
                            </Friend>)
                        )}
                    </div>
                </div>

                {/* View for messages */}
                <div className={Classes.view}
                    style={this.state.showChatsMob ? { display: 'inherit' } : null}>
                    <div className={Classes.nameField}>
                        <div>
                            <button className={Classes.chatter_mob}
                                onClick={this.show}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    backgroundColor: 'transparent',
                                    color: 'white'
                                }}>Back</button></div>
                        {
                            this.state.reciever ?
                                `You are talking to "${this.state.reciever}"` :
                                `Start talking to friends right now! It's elegant!`
                        }
                    </div>
                    <div className={Classes.msgBlock}>
                        {
                            this.state.friends[this.state.reciever] ?
                                this.state.friends[this.state.reciever].map((val, i) => (
                                    <Message key={i}
                                        by={val.sender === this.props.auth.user.username ? 1 : 0}
                                        refs={this.messageEnd}>
                                        {val.message}
                                    </Message>
                                )) : null
                        }
                    </div>

                    {/* Message box */}
                    <div className={Classes.msgBox}>
                        <Input
                            refs={this.textInput}
                            type='text'
                            name='message'
                            label=''
                            value={this.state.message}
                            display='inline-block'
                            width='75%'
                            marginRight='0.8rem'
                            active={this.state.reciever ? true : false}
                            press={this.press} />
                        <Button
                            type='success'
                            name='Sends'
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