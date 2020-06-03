/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React, { useState, useEffect }        from 'react';
import { FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight } from "react-icons/fi";

// Stylesheets
import './public/stylesheets/style.scss';

export default ({ setup={}, handlePagination }) => {

    const [ stateSetup      , setSetup      ] = useState({...setup});
    const [ stateRange      , setRange      ] = useState(2);
    const [ stateCurrent    , setCurrent    ] = useState(1);
    const [ stateTotalPages , setTotalPages ] = useState(0);

    useEffect(()=>{
        setSetup({...setup});
    },[setup['total']]);

    useEffect(()=>{
        const { total=0, limit=0, range=2, current=1 } = setup;
        const totalPages = isNaN(Math.ceil(Number(total)/Number(limit))) || !isFinite(Math.ceil(Number(total)/Number(limit)))? 0: Math.ceil(Number(total)/Number(limit));
        setRange(Number(range));
        setCurrent(Number(current));
        setTotalPages(Number(totalPages));
    },[setup['range'], setup['current'], setup['total'],setup['limit']]);

    useEffect(()=>{
        let delay = setTimeout(()=>{
            if( handlePagination!=undefined ){
                handlePagination(Number(stateCurrent));
            }
        },200);
        return () => {
            clearTimeout(delay);
        }
    },[stateCurrent]);

    const handleArrows = ( type ) => {
        let current = 0;
        switch( type ){
            case 'prev':
                current = stateCurrent-1>0? stateCurrent-1:1;
                break;

            case 'next':
                current = stateCurrent+1<=stateTotalPages? stateCurrent+1:stateTotalPages;
                break;

            case 'first':
                current = 1;
                break;
            
            case 'last':
                current = stateTotalPages;
                break;
        }
        if( current!=stateCurrent ){
            setCurrent(Number(current));
        }
    }

    const handleJumperCurrent = (e) => {
        let current = e.target.value;

        if( isNaN(Number(current)) ){
            current = 1;
        }else if( current<=0 ){
            current = 1;
        }else if( current>stateTotalPages ){
            current = stateTotalPages;
        }
        setCurrent(Number(current));
    }

    const totalPaginationDom = () => {
        let   returnDom      = [];
        const handleDomArray = (i) => {
            return [ <li className={`pagination-item ${stateCurrent==i? 'active':''}`} onClick={()=>setCurrent(Number(i))} key={i}>{i}</li> ];
        }

        if( stateTotalPages>stateRange*3 ){
            if( stateCurrent<stateRange ){
                for( let i=1 ; i<=stateTotalPages ; i++ ){
                    if( i<=stateRange || i>=(stateTotalPages-stateRange+1) ){
                        returnDom = [...returnDom, handleDomArray(i)];
                        if( i==stateRange && stateCurrent<stateRange  ){
                            returnDom = [ ...returnDom, [<li className="item-null" key="simplifyBefore">•••</li> ]];
                        }
                    }
                }
            }else if( stateCurrent<(stateRange*2)-1 ){
                for( let i=1 ; i<=stateTotalPages ; i++ ){
                    if( i<=(stateRange*2)-1 || i>=(stateTotalPages-stateRange+1) ){
                        returnDom = [...returnDom, handleDomArray(i)];
                        if( i==(stateRange*2)-1 && stateCurrent<stateRange*2  ){
                            returnDom = [ ...returnDom, [<li className="item-null" key="simplifyBefore">•••</li>]];
                        }
                    }
                }
            }else if( stateCurrent>=(stateRange*2)-1 && stateCurrent<=(stateTotalPages-stateRange)-(stateRange-2)){
                for( let i=1 ; i<=stateTotalPages ; i++ ){
                    if( i==1 ){
                        returnDom = [ handleDomArray(i), [<li className="item-null" key="simplifyBefore">•••</li>], ...returnDom];
                    }
                    if( i==stateTotalPages ){
                        returnDom = [ ...returnDom, [<li className="item-null" key="simplifyAfter">•••</li>], handleDomArray(i)];
                    }
                    if( i>stateCurrent-stateRange && i<stateCurrent+stateRange){
                        returnDom = [...returnDom, handleDomArray(i)];
                    }
                }
            }else if( stateCurrent>stateTotalPages-stateRange+1 ){
                for( let i=1 ; i<=stateTotalPages ; i++ ){
                    if( i<=stateRange || i>=(stateTotalPages-stateRange+1) ){
                        returnDom = [...returnDom, handleDomArray(i)];
                        if( i==stateRange  ){
                            returnDom = [ ...returnDom, [<li className="item-null" key="simplifyBefore">•••</li>]];
                        }
                    }
                }
            }else if( stateCurrent<=stateTotalPages-stateRange+2 && stateCurrent>=stateTotalPages-(stateRange*2) ){
                for( let i=1 ; i<=stateTotalPages ; i++ ){
                    if( i<=stateRange ){
                        returnDom = [...returnDom, handleDomArray(i)];
                        if( i==stateRange ){
                            returnDom = [ ...returnDom, [<li className="item-null" key="simplifyAfter">•••</li>]];
                        }
                    }
                    if( i>(stateTotalPages-(stateRange*2)+1)  ){
                        returnDom = [...returnDom, handleDomArray(i)];
                    }
                }
            }
            
        }else{
            for( let i=1 ; i<=stateTotalPages ; i++ ){
                returnDom = [...returnDom, handleDomArray(i)];
            }
        }
        return returnDom;
    }

    const displayTextToLowerCase = (stateSetup['display'] || []).map( item => item.toLowerCase());

    return(
        <div className="pagination-wrap">
            {
                // 資訊
                displayTextToLowerCase.includes('current') &&
                    <div className="pagination-current-wrap">
                        <span>{stateCurrent}</span> / <span>{stateTotalPages}</span>
                    </div>
            }
            <ul>
                {
                    // 前往第一頁
                    displayTextToLowerCase.includes('first') &&
                        <li className={`arrows ${stateCurrent==1? 'disabled':''}`} onClick={handleArrows.bind(this,'first')}>
                            <i><FiChevronsLeft size="15" /></i>
                        </li>
                }
                {
                    // 上下頁
                    displayTextToLowerCase.includes('arrows') &&
                        <li className={`arrows prev ${stateCurrent==1? 'disabled':''}`} onClick={handleArrows.bind(this,'prev')}>
                            <i><FiChevronLeft size="15"/></i>
                        </li>
                }
                {   displayTextToLowerCase.includes('items') &&
                        totalPaginationDom()
                }
                {
                    displayTextToLowerCase.includes('jumper') &&
                        <li className={`jumper-item`}>
                            <div className="pagination-input-box">
                                <input type="tel" name="current" value={stateCurrent} onChange={handleJumperCurrent.bind(this)}/>
                            </div>
                        </li>
                }
                {
                    // 上下頁
                    displayTextToLowerCase.includes('arrows') &&
                        <li className={`arrows next ${stateCurrent==stateTotalPages? 'disabled':''}`} onClick={handleArrows.bind(this,'next')}>
                            <i><FiChevronRight size="15"/></i>
                        </li>
                }
                {
                    // 前往最後一頁
                    displayTextToLowerCase.includes('last') &&
                        <li className={`arrows ${stateCurrent==stateTotalPages? 'disabled':''}`} onClick={handleArrows.bind(this,'last')}>
                            <i><FiChevronsRight size="15"/></i>
                        </li>
                }
            </ul>
        </div>
    );
}