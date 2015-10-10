'use strict';

const React = require('react');
const Server = require('./Server');
const Client = require('./Client');

const Menu = React.createClass({
  handleServe: function(e) {
    console.log(e);
    Server();
  },

  handleConnect: function(e) {
    e.preventDefault();
    console.log(e);
    Client();
  },

  render: function() {
    return (
      <div>
        <section>
          <button onClick={this.handleServe} className="mdl-button mdl-js-ripple-effect mdl-js-button mdl-button--raised mdl-button--colored">
            Serve
          </button>
        </section>

        <section>
          <form onSubmit={this.handleConnect}>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input className="mdl-textfield__input" type="text" id="address" />
              <label className="mdl-textfield__label" htmlFor="address">Address...</label>
            </div>
            <input className="mdl-button mdl-js-ripple-effect mdl-js-button mdl-button--raised mdl-button--accent" type="submit" value="Connect" />
          </form>
        </section>
      </div>
    );
  }
});

module.exports = Menu;
