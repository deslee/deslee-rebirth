import React from 'react/addons';
import Router, {RouteHandler, Link} from 'react-router';
import NotFoundPage from "../NotFoundPage/NotFoundPage.js"
import styles from './App.scss';
import withStyles from '../../decorators/withStyles.js';
import Navigation from '../Navigation/Navigation.js';
import routerNavigation from '../../decorators/routerNavigation.js';
import routerState from '../../decorators/routerState.js';
import moment from 'moment';

var CSSTransitionGroup = React.addons.CSSTransitionGroup;

@routerState
@routerNavigation
@withStyles(styles)
class App extends React.Component {
  goToIndex() {
    this.props.transitionTo('index');
  }
  render() {
    return (<div className="AppPage black mx-auto flex flex-column md-w52 lg-w60 xl-w75">
      <div className="content clearfix flex-grow">

        <div className="sidebar p2 col col-12 center md-left-align md-w15">
          <header>
            <img className="hover-pointer circle block mx-auto mt1 mw9" src="assets/face.jpg" onClick={this.goToIndex.bind(this)} />
            <h1 className="hover-pointer" onClick={this.goToIndex.bind(this)} >Desmond Lee</h1>
          </header>
          <Navigation />
        </div>

        <main className="main p2 col col-12 md-w36 lg-w45 break-word">
          <CSSTransitionGroup transitionName="routeTransition"><RouteHandler {...this.props} key={this.props.getPathname()} /></CSSTransitionGroup>
        </main>

        <aside className="mt3 xl-m0 pt2 pb2 col col-12 xl-w15 clearfix">

          <div className="px2 col col-12 md-col-4 xl-col-12">
            <h2>Contact me</h2>
            <form className="mb2">
              <label htmlFor="email" className="block col-12">Your Email</label>
              <input id="email" type="text" className="field mb1 block col-12" />
              <label htmlFor="message">Message</label>
            <textarea id="message" className="field mb2 block col-12"></textarea>
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>

          <div className="px2 col col-12 md-col-4 xl-col-12">
            <h2>Cool things</h2>
            <ul className="clearfix nowrap list-reset">
              <li className="col col-12 sm-col-4 md-col-12 pr2 mb2"><a href="https://play.google.com/store/apps/details?id=com.ionicframework.superwinner746062&hl=en">Superwinner</a></li>
            </ul>
          </div>

          <div className="px2 col col-12 md-col-4 xl-col-12">
            <h2>Friends</h2>
            <ul className="clearfix nowrap list-reset">
              <li className="col col-12 sm-col-4 md-col-12 pr2 mb2"><a href="http://elizabethdelrosario.com/">Elizabeth Del Rosario</a></li>
              <li className="col col-12 sm-col-4 md-col-12 pr2 mb2"><a href="http://captureddimensions.com/">Captured Dimensions</a></li>
              <li className="col col-12 sm-col-4 md-col-12 pr2 mb2"><a href="http://spencer-hawkins.com/">Spencer Hawkins</a></li>
            </ul>
          </div>
        </aside>

      </div>
      <footer className="gray left-align p2">© {moment().format('YYYY')} Desmond Lee</footer>
    </div>)
  }
}

export default App;
