import React from 'react/addons';
import Router, {RouteHandler, Link} from 'react-router';
import NotFoundPage from "../NotFoundPage/NotFoundPage.js"

class App extends React.Component {
  render() {
    return (<div className="AppPage">
      <ul>
        <li><Link to="index">Index</Link></li>
        <li><Link to="example-basic">example-basic</Link></li>
        <li><Link to="example-lazy">example-lazy</Link></li>
      </ul>
      <RouteHandler {...this.props} />
    </div>)
  }
}

export default App;
