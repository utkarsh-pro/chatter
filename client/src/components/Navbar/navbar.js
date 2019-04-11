import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
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
                <div><Link to="/">Brand</Link></div>
                <div className={Classes.div}>
                    {!isAuthenticated ? <div><Link to={props.link}>{props.name}</Link></div> :
                        <button
                            onClick={onLogoutClick}
                            style={{
                                backgroundColor: 'transparent',
                                fontFamily: 'inherit',
                                color: 'inherit',
                                border: 'none',
                                fontSize: '1.1rem',
                                cursor: 'pointer'
                            }}>
                            Signout
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