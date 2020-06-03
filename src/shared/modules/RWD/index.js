/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */
import React, { useState, useEffect, useRef } from 'react';

// Stylesheets
import './public/stylesheets/style.scss';

const setting = {
    response: [
        {
            breakpoint: 1280,
            slidesToShow: 5
        },
        {
            breakpoint: 920,
            slidesToShow: 3
        },
        {
            breakpoint: 600,
            slidesToShow: 2
        }
    ]
}

export default({ children, className="", onChange }) => {

    const blockREF = useRef(null);
    const [ stateCol, setCol ] = useState(0);

    useEffect(() => {
        let delay;
        const { response }  = setting;
        const responseCount = response.length;
        const RWD = () => {
            clearTimeout(delay);
            delay = setTimeout(() => {
                const block_w    = blockREF.current.clientWidth;
                const selectCol  = response.find((item,i,arr) => {
                    if( Number(item.breakpoint)<=block_w ){
                        return item;
                    }
                }) || response[responseCount-1];
                setCol( selectCol.slidesToShow );
                if( onChange!=undefined ){
                    onChange(block_w);
                }
            }, 100);
        }
        RWD();
        window.addEventListener('resize', RWD, false);
        return() => {
            window.removeEventListener('resize', RWD, false);
        }
    },[]);

    return(
        <div ref={blockREF} className={`list-wrap ${className}`} data-col={stateCol}>
            {children}
        </div>
    );
}