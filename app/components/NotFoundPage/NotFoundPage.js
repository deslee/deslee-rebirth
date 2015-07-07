import React from 'react/addons';

class NotFoundPage extends React.Component {
  componentWillMount() {
    if (typeof GLOBAL !== 'undefined' && GLOBAL.app_callbacks && GLOBAL.app_callbacks.onPageNotFound) {
      GLOBAL.app_callbacks.onPageNotFound();
    }
  }
  render() {
    return <p className="NotFoundPage">NotFoundPage</p>
  }
}

export default NotFoundPage;