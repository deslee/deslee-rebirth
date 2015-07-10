import React from 'react/addons';
import Router, {RouteHandler, Link} from 'react-router';
import NotFoundPage from "../NotFoundPage/NotFoundPage.js"
/*import styles from './App.scss';
import withStyles from '../../decorators/withStyles.js';*/
import Navigation from '../Navigation/Navigation.js';
import routerNavigation from '../../decorators/routerNavigation.js';
import routerState from '../../decorators/routerState.js';
import moment from 'moment';
import Aside from '../Aside/Aside.js';

var CSSTransitionGroup = React.addons.CSSTransitionGroup;

@routerState
@routerNavigation
/*
@withStyles(styles)
*/
class App extends React.Component {
  goToIndex() {
    this.props.transitionTo('index');
  }
  render() {
    /*console.log("rendering app")*/
    return (<div className="AppPage black mx-auto flex flex-column md-w52 lg-w75">
      <div className="content clearfix flex-grow">

        <div className="sidebar p2 col col-12 center md-left-align md-w15">
          <header>
            <img className="hover-pointer circle block mx-auto mt1 mw9" src="assets/face.jpg" onClick={this.goToIndex.bind(this)} />
            <h1 className="hover-pointer" onClick={this.goToIndex.bind(this)} >Desmond Lee</h1>
          </header>
          <Navigation />
          <p>This is my personal website.</p>
          <p>I'm a Software Engineer based in Dallas. Check out my <Link to="about">about</Link> page!</p>
        </div>

        <main className="main p2 col col-12 md-w36 lg-w45 break-word">
          <CSSTransitionGroup transitionName="routeTransition"><RouteHandler {...this.props} key={this.props.getPathname()} /></CSSTransitionGroup>
        </main>

        <Aside />

      </div>
      <footer className="gray left-align p2">© {moment().format('YYYY')} Desmond Lee</footer>
    </div>)
  }
}

export default App;
