'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const Route = ReactRouter.Route;
const Router = ReactRouter.Router;
const createHistory = require('history/lib/createMemoryHistory');

const MenuComponent = require('./MenuComponent.jsx');
const ServerComponent = require('./ServerComponent.jsx');
const ClientComponent = require('./ClientComponent.jsx');

ReactDOM.render((
  <Router history={createHistory()}>
    <Route path="/" component={MenuComponent} />
    <Route path="/server" component={ServerComponent} />
    <Route path="/client" component={ClientComponent} />
  </Router>
), document.getElementById('container'));
