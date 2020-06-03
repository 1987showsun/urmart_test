/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */
import React, { useState, useEffect, useRef } from 'react';

// Stylesheets
import './public/stylesheets/style.scss';

export default({ className="", item={} }) => {

    const itemImgRef = useRef(null);
    const [ stateImgH, setImgH ] = useState(100);
    const { snippet={}, id={} } = item;
    const { kind="", videoId="" } = id;
    const { channelId="", channelTitle="", title="", description="", thumbnails={} } = snippet;
    const { high={}, medium={} } = thumbnails;
    const { url } = high;

    useEffect(() => {
        let   delay;
        const RWD = () => {
            clearTimeout(delay);
            delay = setTimeout(() => {
                const img_block_w = itemImgRef.current.clientWidth;
                setImgH( img_block_w/1.777 );
            }, 200);
        }

        RWD();
        window.addEventListener('resize', RWD, false);
        return() => {
            window.removeEventListener('resize', RWD, false);
        }
    },[]);

    return(
        <div className={`item ${className}`}>
            <figure>
                <div ref={itemImgRef} className="img" style={{height: `${stateImgH}px`}}>
                    <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank">
                        <img src={url} alt={title} title={title} />
                    </a>
                </div>
                <figcaption>
                    <h3 dangerouslySetInnerHTML={{__html: `<a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">${title}</a>`}} />
                    <h4 dangerouslySetInnerHTML={{__html: `<a href="https://www.youtube.com/channel/${channelId}" target="_blank">${channelTitle}</a>`}} />
                    <p>{description}</p>
                </figcaption>
            </figure>
        </div>
    );
}