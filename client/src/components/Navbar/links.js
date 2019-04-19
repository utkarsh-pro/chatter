import React from 'react'
import { Link } from 'react-router-dom';
export default props => {
    return (
        <div>
            <Link to={props.to}>{props.children}</Link>
        </div>
    )
}
