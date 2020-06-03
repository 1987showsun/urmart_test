/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const API_ADDRESS = () => {
    const { NODE_ENV } = process.env;
    let API_PATH  = "https://www.googleapis.com/youtube/v3";
    if( NODE_ENV=="development" ){
        API_PATH  = "https://www.googleapis.com/youtube/v3";
    }
    return API_PATH;
}

export default{
    'search'      : `${API_ADDRESS()}/search`
}