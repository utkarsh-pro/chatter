import React from 'react';
import './friend.css';

export default props => {
    return (
        <button className='friend' onClick={e => props.onClick(e.target.id)} id={props.id}>
            {props.children}
        </button>
    )
}

