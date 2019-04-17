import React from 'react';
import Classes from './message.module.css';

export default props => {
    const className = props.by ? Classes.msg_out : Classes.msg_in;
    return (
        <div className={Classes.msg}>
            <div className={className}>
                <div>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

