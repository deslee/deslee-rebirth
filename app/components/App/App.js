import React from 'react/addons';
import Router, {RouteHandler, Link} from 'react-router';
//<li><Link to="example-lazy">example-lazy</Link></li>
class App extends React.Component {
  render() {
    return (<div>
      <ul>
        <li><Link to="index">Index</Link></li>
        <li><Link to="example-basic">example-basic</Link></li>
        <li><Link to="example-lazy">example-lazy</Link></li>
        <li><Link to="example-data">example-data</Link></li>
      </ul>
      <RouteHandler {...this.props} />
    </div>)
  }
}

export default App;
