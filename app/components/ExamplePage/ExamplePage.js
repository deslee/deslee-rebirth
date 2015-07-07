import React from 'react/addons';
import styles from './ExamplePage.scss';
import withStyles from '../../decorators/withStyles.js';

console.log(styles);

@withStyles(styles)
class ExamplePage extends React.Component {
  render() {
    return <p className="ExamplePage">Example</p>
  }
}

export default ExamplePage;