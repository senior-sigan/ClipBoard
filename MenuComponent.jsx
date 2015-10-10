'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const History = ReactRouter.History;
const Link = ReactRouter.Link;

const MenuComponent = React.createClass({
  mixins: [History],

  handleConnect: function(e) {
    e.preventDefault();
    const address = ReactDOM.findDOMNode(this.refs.address);
    this.history.pushState(null, `/client`, {address: address.value.trim()});
  },

  render: function() {
    console.log('Menu');
    return (
      <div>
        <section>
          <Link to="/server" className="mdl-button mdl-js-ripple-effect mdl-js-button mdl-button--raised mdl-button--colored">
            Serve
          </Link>
        </section>

        <section>
          <form onSubmit={this.handleConnect}>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input className="mdl-textfield__input" ref="address" type="text" id="address" />
              <label className="mdl-textfield__label" htmlFor="address">Address...</label>
            </div>
            <input className="mdl-button mdl-js-ripple-effect mdl-js-button mdl-button--raised mdl-button--accent" type="submit" value="Connect" />
          </form>
        </section>
      </div>
    );
  },
  componentDidUpdate: function() {
    // upgrade material design dom
    componentHandler.upgradeDom();
  },
  componentDidMount: function() {
    componentHandler.upgradeDom();
  }
});

module.exports = MenuComponent;
