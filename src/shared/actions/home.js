/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import axios       from 'axios';
import queryString from 'query-string';
import apiURL      from './url';
import setting     from '../../../setting/key';

const YOUR_API_KEY = setting.key;

export const searchData = ({method="get", query={}, data={}}) => {
    return(dispatch) => {
        const initQuery = {
            key          : YOUR_API_KEY,
            part         : "snippet",
            type         : "video",
            hl           : "zh-TW",
            regionCode   : "TW",
            maxResults   : 50
        };
        const search    = queryString.stringify({ ...initQuery, ...query });
        const url       = `${apiURL['search']}${search!=''? `?${search}`:''}`;

        return Axios({ method, url, data }).then( res => {

            const { data }                         = res;
            const { items, pageInfo }              = data;
            const { totalResults, resultsPerPage } = pageInfo;
            
            dispatch({
                type       : "SET_VIDEO_LIST",
                list       : items,
                total      : totalResults>resultsPerPage? resultsPerPage:totalResults,
                totalPages : Math.ceil(totalResults/resultsPerPage)
            })
            return res;
        }).catch( err => {
            return err.response;
        })
    }
}

const Axios = ({ method="get", url="", data={} }) => {
    return axios({
        method   : method,
        url      : url,
        data     : data,
        headers  : {
        }
    });
}