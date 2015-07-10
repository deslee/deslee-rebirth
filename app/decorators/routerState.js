import React from 'react/addons';
import Router, {Route, Navigation, RouteHandler, Link} from 'react-router';

var routerState = Component => React.createClass({
  mixins : [ Router.State ],

  // take care of new transition API, see https://github.com/rackt/react-router/pull/1158
  routerWillEnter(router, nextState, route) {
    if (this.refs.component && this.refs.component.routerWillEnter) {
      this.refs.component.routerWillEnter(router, nextState, route);
    }
  },

  routerWillLeave(router, nextState, route) {
    if (this.refs.component && this.refs.component.routerWillLeave) {
      this.refs.component.routerWillLeave(router, nextState, route);
    }
  },

  render() {
    var stateMixinApi = {
      getPath     : this.getPath,
      getPathname : this.getPathname,
      getParams   : this.getParams,
      getQuery    : this.getQuery,
      isActive    : this.isActive,
      getRoutes   : this.getRoutes
    };

    return <Component ref="component" {...this.props} {...stateMixinApi} routerState={stateMixinApi} />;
  }
});

export default routerState;