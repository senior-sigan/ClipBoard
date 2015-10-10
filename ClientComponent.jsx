'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const History = ReactRouter.History;
const Client = require('./Client');

const ClientComponent = React.createClass({
  mixins: [History],

  getInitialState: function() {
    return {
      client: null,
      connected: false,
      defferId: null
    };
  },

  handleDisconnect: function(e) {
    this.state.client && this.state.client.close();
    this.history.pushState(null, `/`);
    clearTimeout(this.state.defferId);
  },

  handleConnect: function() {
    const address = this.props.location.query.address;
    const client = Client(address, () => {
      clearInterval(this.state.intervalId);
      this.setState({client: client, connected: true, defferId: null});
    }, (isError) => {
      if (isError) {
        const defferId = setTimeout(this.handleConnect, 1000);
        this.setState({client: null, connected: false, defferId: defferId});
      } else {
        this.setState({client: null, connected: false, defferId: null});
      }
    });
  },

  componentDidMount: function() {
    componentHandler.upgradeDom();
    this.handleConnect();
  },

  render: function() {
    return (
      <div>
      <h2>{(() => {
          if (this.state.connected) {
            return 'Connected to server'
          } else {
            return 'Connecting.......'
          }
        })()}</h2>
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

module.exports = ClientComponent;
