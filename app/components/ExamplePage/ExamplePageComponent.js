import React from 'react/addons';
import styles from './ExamplePageComponent.scss';
import withStyles from '../../decorators/withStyles.js';

@withStyles(styles)
class ExamplePageComponent extends React.Component {
  render() {
    return <p className="ExamplePageComponent">ExamplePageComponent</p>
  }
}

export default ExamplePageComponent;