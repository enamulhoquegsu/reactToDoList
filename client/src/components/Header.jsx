import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className="header">
            <p>
                <i className="fas fa-arrow-circle-left fa-3x"></i>
            </p>
            <p className="home">
                <a href="/">
                    <i className="fas fa-home fa-3x"></i> 
                </a>
                    
                
            </p>
        </div>
    )
}

export default Header
