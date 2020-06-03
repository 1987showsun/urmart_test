/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */
import React,{ useState, useEffect }                       from 'react';
import queryString                                         from 'query-string';
import { connect }                                         from 'react-redux';
import { Helmet }                                          from "react-helmet";

// Modules
import ListBlock                                           from '../../modules/RWD';
import ItemForVideo                                        from '../../modules/items/video';
import Pagination                                          from '../../modules/pagination';

// Actions
import { searchData }                                      from '../../actions/home';

const Index = ({ location, history, dispatch, total, videoList, totalPages }) => {

    const { search    }                          = location;
    const { current=1 }                          = queryString.parse(search);
    const [ stateCurrent     , setCurrent      ] = useState(current);
    const [ stateLimit       , setLimit        ] = useState(10);
    const [ stateDisplayRange, setDisplayRange ] = useState([0,9]);

    // call api
    useEffect(() => {
        const { search } = location;
        dispatch( searchData({query: {...queryString.parse(search)}}) );
    },[queryString.parse(search).q]);

    // 頁碼更換後 更換 URL query
    useEffect(() => {
        const { pathname, search } = location;
        const mergeSearch          = { ...queryString.parse(search), current: stateCurrent };
        const initCount            = 0+(stateCurrent-1)*(stateLimit);
        const endCount             = (stateLimit-1)+(stateCurrent-1)*stateLimit;
        history.push({
            pathname   : pathname,
            search     : queryString.stringify(mergeSearch)
        });
        setDisplayRange([ initCount, endCount ]);
    },[stateCurrent]);
    
    useEffect(() => {
        const { search    }        = location;
        const { current=1 }        = queryString.parse(search);
        setCurrent(current);
    },[location.search]);

    return(
        <>
            <Helmet>
                <title></title>
            </Helmet>
            {
                videoList.length>0? (
                    <ListBlock
                        className="video"
                    >
                        {
                            videoList.map( (item,i) => {
                                if( i>=stateDisplayRange[0] && i<=stateDisplayRange[1] ){
                                    return <ItemForVideo key={i} className="video" item={item}/>;
                                }
                            })
                        }
                    </ListBlock>
                ):(
                    <div className="no-data">
                        無任何資料
                    </div>
                )
            }
            <Pagination 
                setup = {{
                    current             : stateCurrent,
                    total               : total==0? 1:total,
                    limit               : stateLimit,
                    range               : 2,
                    display             : ['current','arrows','first','last','items']
                }}
                handlePagination= {(val) => setCurrent(val)}
            />
        </>
    );
}

// Index.initialAction = () => {
//     return searchData({});
// }

const mapStateToProps = state => {
    return{
        total        : state.home.total,
        videoList    : state.home.videoList,
        totalPages   : state.home.totalPages
    }
}

export default connect( mapStateToProps )( Index );