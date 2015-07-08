import React from 'react/addons';
import Router, {RouteHandler, Link} from 'react-router';
import NotFoundPage from "../NotFoundPage/NotFoundPage.js"
import styles from './App.scss';
import withStyles from '../../decorators/withStyles.js';
import Navigation from '../Navigation/Navigation.js';
import routerNavigation from '../../decorators/routerNavigation.js';
import moment from 'moment';

@routerNavigation
@withStyles(styles)
class App extends React.Component {
  goToIndex() {
    this.props.transitionTo('index');
  }
  render() {
    return (<div className="AppPage flex flex-column flex-auto">
      <div className="md-flex flex-grow">
        <div className="sidebar">
          <img className="hover-pointer circle block mx-auto face" src="assets/face.jpg" onClick={this.goToIndex.bind(this)} />
          <h1 className="hover-pointer" onClick={this.goToIndex.bind(this)} >Desmond Lee</h1>
          <Navigation />
        </div>

        <div className="main flex-auto">
          <RouteHandler {...this.props} />
        </div>
      </div>

      <div className="right-align dark-gray bg-darken-1 m0 px2 py1">© {moment().format('YYYY')} Desmond Lee</div>
    </div>)
  }
}

export default App;
