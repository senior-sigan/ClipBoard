'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const History = ReactRouter.History;
const Server = require('./Server');
const LocalAddress = require('./LocalAddress');

const ServerComponent = React.createClass({
  mixins: [History],

  getInitialState: function() {
    return {server: null};
  },

  handleDisconnect: function(e) {
    this.state.server.close();
    this.history.pushState(null, '/');
  },

  componentDidMount: function() {
    componentHandler.upgradeDom();
    const server = Server(() => {
      this.setState({server: server});
    });
  },

  render: function() {
    const addresses = LocalAddress();
    return (
      <div>
        <h2>{(() => {
            if (this.state.server) {
              return 'Server is running'
            } else {
              return 'Connecting to server'
            }
          })()}
        </h2>
        <ul>
          {addresses.map(address => {
            return <li key="{address}">{address}</li>
          })}
        </ul>
        <button onClick={this.handleDisconnect} className="mdl-button mdl-js-ripple-effect mdl-js-button mdl-button--raised mdl-button--colored">
          Disconnect
        </button>
      </div>
    );
  },
  componentDidUpdate: function() {
    // upgrade material design dom
    componentHandler.upgradeDom();
  }
});

module.exports = ServerComponent;
