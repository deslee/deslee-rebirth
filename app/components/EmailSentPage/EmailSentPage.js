import React from 'react/addons';
import {Link} from 'react-router';

class EmailSentPage extends React.Component {
  componentWillMount() {
    GLOBAL.app_callbacks.onSetTitle("Email Sent");
  }
  render() {
    return (<div className="EmailSentPage">
      <h1>Email Sent!</h1>
    </div>)
  }
}

export default EmailSentPage;