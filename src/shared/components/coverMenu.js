/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React, { useState, useEffect }                      from 'react';
import { connect }                                         from 'react-redux';
import { Link }                                            from 'react-router-dom';

// Icons
import { MdLanguage }                                      from "react-icons/md";
import { RiLoginBoxLine }                                  from "react-icons/ri";

const CoverMenu = () => {

    const [ stateDisplayNav, setDisplayNav ] = useState(false);
    const handleDisplay = () => {
        if( stateDisplayNav ){
            setDisplayNav( !stateDisplayNav );
        }
    }

    useEffect(() => {
        window.addEventListener('click', handleDisplay, false);
        return () => {
            window.removeEventListener('click', handleDisplay, false);
        }
    },[handleDisplay]);

    return(
        <div className="cover">
            <div className="img touch-block" onClick={() => setDisplayNav(true)}>
                <img src={`https://lh3.google.com/u/0/ogw/ADGmqu8J_3bjkhepCsDspP7g1j0U11FeZPck0FLVosQc=s192-c-mo`} alt="" title="" />
            </div>
            <ul data-display={stateDisplayNav}>
                <li>
                    <Link to="">
                        <i>
                            <MdLanguage size="20" />
                        </i>
                        <span className="text">Language</span>
                    </Link>
                </li>
                <li>
                    <Link to="">
                        <i>
                            <RiLoginBoxLine size="20"/>
                        </i>
                        <span className="text">Sign out</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

const mapStateToProps = state => {
    return{

    }
}

export default connect( mapStateToProps )( CoverMenu );