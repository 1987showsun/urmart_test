/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */
export default function home(
    state = {
        videoList  : [],
        total      : 0,
        totalPages : 1
    },action
){
    switch(action.type){
        case 'SET_VIDEO_LIST':
            state = { 
                ...state,
                videoList    : action.list,
                total        : action.total,
                totalPages   : action.totalPages
            };
            break;

        default:
            break;
    }
    return state;
}