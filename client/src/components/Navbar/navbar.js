import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import Links from './links';
import Classes from './navbar.module.css';

const navbar = props => {
    const { isAuthenticated } = props.auth;
    const onLogoutClick = () => {
        props.history.push('/');
        props.logoutUser();
    }
    return (
        <nav className={Classes.navbar}>
            <div className={Classes.navItems}>
                <div><Link to="/">Chatter</Link></div>
                <div className={Classes.div}>
                    {!isAuthenticated ? <Links to={props.link}>{props.name}</Links> :
                        <button
                            onClick={onLogoutClick}
                            style={{
                                backgroundColor: 'transparent',
                                fontFamily: 'inherit',
                                color: 'inherit',
                                border: 'none',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                outline: 'none'
                            }}>
                            Logout
                        </button>
                    }
                </div>
            </div>
        </nav>
    )
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(withRouter(navbar));