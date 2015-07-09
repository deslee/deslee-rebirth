import React from 'react/addons';
import {Link} from 'react-router';
import styles from './AboutMePage.scss';
import withStyles from '../../decorators/withStyles.js';

@withStyles(styles)
class ExamplePage extends React.Component {
  componentWillMount() {
    GLOBAL.app_callbacks.onSetTitle("About Desmond Lee");
  }
  render() {
    return (<div className="ExamplePage">
      <h1>Hi, I'm Desmond Lee</h1>
        <p>I'm a Software Engineer from Dallas, Texas. This website is about all the nerdy things I love.</p>
        <h2>Some random facts about me</h2>
        <ul>
          {[
            `I graduated from The University of Texas at Dallas`,
            `I built this site with isomorphic JavaScript. Go ahead and disable JavaScript on your browser and try to spot a difference. :)`,
            `I'm learning how to play the ukulele`,
            `I love sandbox games. I\'ve logged over 200 hours on Starbound, Kerbal Space Program, and Skyrim combined`,
            `I have a brown tabby cat`
          ].map((fact, i) => {
            return <li key={i} className={(i > 2 && !this.props.query.facts) ? 'hide' : ''}>{fact}</li>
          })}
        </ul>
        <Link to="about" className={this.props.query.facts ? 'hide' : ''} query={{facts: true}}>Show more</Link>
        <h2>My Current Interests:</h2>
        <ul>
          <li>Experimenting with isomorphic javascript<ul>
            <li>Node.js</li>
            <li>React</li>
          </ul>
          </li>
          <li>Building realtime apps<ul>
            <li>with Firebase</li>
          </ul>
          </li>
          <li>Tinkering with Arduinos and Raspberry Pi's</li>
          <li>Creating apps that increase my productivity<ul>
            <li>Cordova for Android and web</li>
          </ul>
          </li>
        </ul>
        <h2>Other Interests</h2>
        <p>I also have experience in:</p>
        <ul>
          <li>ASP.NET</li>
          <li>Django</li>
        </ul>
        <h2>Other technologies I love to use</h2>
        <p>Other technologies I have experience in include:</p>
        <ul className="clearfix p0 list-reset m0" style={{maxWidth: '35em'}}>
          {['Java', 'C#', 'HTML', 'CSS', 'JavaScript', 'Python', 'SQL'].map(tech => {
            return <li className="col col-6 sm-col-4 md-col-3 lg-col-2 px2 mb2 center" key={tech}>{tech}</li>
          })}
        </ul>
        <h2>Things I want to learn more about</h2>
        <p>Some things I want to learn more about are:</p>
        <ul>
          <li>Machine learning</li>
          <li>Thin Server Architecture</li>
        </ul>
    </div>)
  }
}

export default ExamplePage;