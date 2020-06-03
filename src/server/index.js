/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import express                     from "express";
import path                        from 'path';
import cors                        from "cors";
import React                       from "react";
import logger                      from "morgan";
import { renderToString }          from "react-dom/server";
import { Provider }                from "react-redux";
import { StaticRouter, matchPath, Route } from "react-router-dom";
import { Helmet }                  from "react-helmet";
import serialize                   from "serialize-javascript";
import configureStore              from "../shared/redux/store";
import routes                      from "../shared/routes";
import App                         from "../shared/App";
import "source-map-support/register";

const app                          = express();

app.use(cors());
app.use(express.static("public"));
app.use(logger('dev'));
app.set('/views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.all('*', async function(req, res, next) {

  const { url, path, query } = req;
  const store                = configureStore();
  const test                 = path.split('/').some( item => item=='undefined' );

  const promises = routes.reduce((acc, route) => {
    if (matchPath(url, route) && route.component && route.component.initialAction && !test) {
      acc.push(
        Promise.resolve(
          store.dispatch(route.component.initialAction(path, query))
        )
      );
    }
    return acc;
  }, []);

  Promise.all(promises)
    .then(() => {
      const context = {};
      const markup = renderToString(
        <Provider store={store}>
          <StaticRouter location={url} context={context}>
            <Route component={App} />
          </StaticRouter>
        </Provider>
      );

      const initialData    = store.getState();
      const helmet         = Helmet.renderStatic();
      
      res.send(`
        <!DOCTYPE html>
        <html lang="zh-TW" ${helmet.htmlAttributes.toString()}>
          <head>
            <meta charset="utf-8">
            <meta name="theme-color" content="#131722">
            <meta name="robots" content="none , noarchive, nosnippet, noimageindex, notranslate">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, shrink-to-fit=no">
            <meta name="apple-mobile-web-app-title" content="Musik">
            <meta http-equiv="Content-Language" content="zh-TW">
            <meta name="author" content="Sun Li">
            <meta name="description" content="">
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            <link rel="stylesheet" href="/css/main.css">
            <link rel="shortcut icon" href="https://www.youtube.com/s/desktop/460c1926/htdocs-ytimg-desktop-kevlar-production/img/favicon.ico" type="image/x-icon">
          </head>

          <body id="root">${markup}</body>
          <script src="/bundle.js" defer></script>
          <script>window.__initialData__ = ${serialize(initialData)}</script>
        </html>
      `);
    })
    .catch(next);
});

app.use('/site/404', (req, res, next) =>{
  res.status(404);
  next();
});

app.use('/site/502', (req, res, next) =>{
  res.status(502);
  next();
});

app.listen(process.env.PORT || 8081, () => {
  console.log("Server is listening");
});