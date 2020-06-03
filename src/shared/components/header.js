/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React, { useState, useEffect }                                 from 'react';
import queryString                                         from 'query-string';
import { connect }                                         from 'react-redux';
import { Link }                                            from 'react-router-dom';
import toaster                                             from "toasted-notes";
//import "toasted-notes/src/styles.css";

// Components
import CoverMenu                                          from './coverMenu';

// Actions
import { searchData }                                      from '../actions/home';

// Images
import Logo                                                from '../public/images/y_logo.png';
import Logo_m                                              from '../public/images/y_logo_m.png';

// Icons
import { GoSearch }                                        from "react-icons/go";

const Header = ({ location, history, dispatch }) => {

    const { search } = location;
    const [ stateForm, setForm ] = useState({
        keyword: queryString.parse(search).q || ""
    })

    const handleChange = (e) => {
        const { value, name } = e.target;
        setForm({
            ...stateForm,
            [ name ] : value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { keyword } = stateForm;
        const { pathname, search } = location;

        if( keyword.trim()!="" ){

            const mergeSearch = {
                ...queryString.parse(search),
                q: keyword,
                current: 1
            }

            history.push({
                pathname   : pathname,
                search     : queryString.stringify(mergeSearch)
            })
            dispatch( searchData({ query: { q: keyword } }) ).then( res => {
                const { status, data } = res;
                if( status==403 ){
                    const { error }   = data;
                    const { message } = error;
                }
            });
        }
    }

    useEffect(() => {
        const { search } = location;
        const { q="" } = queryString.parse(search);
        if( q=="" ){
            setForm({
                ...stateForm,
                keyword: q
            })
        }
    },[search]);

    const { keyword } = stateForm;

    return(
        <header>
            <div className="logo">
                <Link to="/">
                    <picture>
                        <source srcSet={Logo_m} media="(max-width: 600px) and (orientation: landscape)"/>
                        <source srcSet={Logo_m} media="(max-width: 600px) and (orientation: portrait)"/>
                        <source srcSet={Logo} media="(min-width: 601px) and (orientation: landscape)"/>
                        <source srcSet={Logo} media="(min-width: 601px) and (orientation: portrait)"/>
                        <img src={Logo} alt="youtube"/>
                    </picture>
                    {/* <img src={Logo} alt="youtube" title="" /> */}
                </Link>
            </div>
            <div className="search">
                <form className="form search" onSubmit={handleSubmit.bind(this)}>
                    <input type="text" name="keyword" value={keyword} onChange={handleChange.bind(this)} placeholder="搜尋" />
                    <button>
                        <GoSearch size="20"/>
                    </button>  
                </form>
            </div>
            <div>
                <CoverMenu />
            </div>
        </header>
    );
}

const mapStateToProps = state => {
    return{

    }
}

export default connect( mapStateToProps )( Header );