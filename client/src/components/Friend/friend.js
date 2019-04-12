import React from 'react';
import './friend.css';

export default props => {
    return (
        <button className='friend'>
            {props.children}
        </button>
    )
}

