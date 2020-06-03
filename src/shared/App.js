/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import $                                 from 'jquery';
import React                             from 'react';
import queryString                       from 'query-string';
import { connect }                       from 'react-redux';
import { Route, Switch, Redirect }       from "react-router-dom";
import { renderRoutes }                  from 'react-router-config';

// Components
import Header from './components/header';

// Router
import routers from './routes';

// Stylesheets
import './public/stylesheets/style.scss';

class Layout extends React.Component{
    render(){
        return(
            <>
                <Header
                    location = {this.props.location}
                    history  = {this.props.history}
                />
                <main>
                    <Switch>
                        {renderRoutes(routers)}
                        <Redirect to="/"/>
                    </Switch>
                </main>
            </>
        );
    }
}

const mapStateToProps = ( state ) => {
    return{
    }
}

export default connect(mapStateToProps)(Layout);