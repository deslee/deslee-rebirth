import React from 'react/addons';
import styles from './ExamplePage.scss';
import withStyles from '../../decorators/withStyles.js';
import ExamplePageComponent from './ExamplePageComponent.js';

@withStyles(styles)
class ExamplePage extends React.Component {
  render() {
    return (<div className="ExamplePage">
      Example
      <ExamplePageComponent />
    </div>)
  }
}

export default ExamplePage;