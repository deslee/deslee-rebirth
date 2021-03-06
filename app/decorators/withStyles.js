import React, { PropTypes } from 'react/addons';
import invariant from 'react/lib/invariant';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

let count = 0;

function withStyles(styles) {
  return (ComposedComponent) => class WithStyles {
    constructor() {
      this.refCount = 0;
      ComposedComponent.prototype.renderCss = function (css) {
        let style;
        if (canUseDOM) {
          if (this.styleId && (style = document.getElementById(this.styleId))) {
            if ('textContent' in style) {
              style.textContent = css;
            } else {
              style.styleSheet.cssText = css;
            }
          } else {
            this.styleId = `dynamic-css-${count++}`;
            style = document.createElement('style');
            style.setAttribute('id', this.styleId);
            style.setAttribute('type', 'text/css');

            if ('textContent' in style) {
              style.textContent = css;
            } else {
              style.styleSheet.cssText = css;
            }

            document.getElementsByTagName('head')[0].appendChild(style);
            this.refCount++;
          }
        } else if (typeof GLOBAL !== 'undefined' && GLOBAL.app_callbacks && GLOBAL.app_callbacks.onInsertCss) {
          GLOBAL.app_callbacks.onInsertCss(css);
        }
      }.bind(this);
    }

    componentWillMount() {
      if (canUseDOM) {
        invariant(styles.use, `The style-loader must be configured with reference-counted API.`);
        styles.use();
      } else if (typeof GLOBAL !== 'undefined' && GLOBAL.app_callbacks && GLOBAL.app_callbacks.onInsertCss) {
        GLOBAL.app_callbacks.onInsertCss(styles.toString());
      }
    }

    componentWillUnmount() {
      styles.unuse();
      if (this.styleId) {
        this.refCount--;
        if (this.refCount < 1) {
          let style = document.getElementById(this.styleId);
          if (style) {
            style.parentNode.removeChild(style);
          }
        }
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }

  };
}

export default withStyles;