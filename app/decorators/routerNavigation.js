import React from 'react/addons';
import Router, {Route, Navigation, RouteHandler, Link} from 'react-router';

export default function routerNavigation(Component) {
  return React.createClass({
    mixins: [ Navigation ],
    render() {
      var api = {
        transitionTo: this.transitionTo,
        replaceWith: this.replaceWith,
        goBack: this.goBack,
        makePath: this.makePath,
        makeHref: this.makeHref
      };
      return <Component {...this.props} {...api} />
    }
  })
}