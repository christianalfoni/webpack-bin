import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import ToolbarButton from '../ToolbarButton';
import classNames from 'classnames';
import styles from './styles.css';

@Cerebral()
class ToolbarButtonPopover extends React.Component {
  onArrowBoxClick(e) {
    e.stopPropagation();
  }
  renderPopup() {
    return (
      <div className={styles.popup}>
        <div
          className={this.props.right ? styles.arrowBoxRight : styles.arrowBox}
          onClick={(e) => this.onArrowBoxClick(e)}>
          <div className={styles.contentBox}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className={classNames(styles.wrapper, {[this.props.className]: this.props.className})}>
        <ToolbarButton
          active={this.props.show}
          icon={this.props.icon}
          title={this.props.title}
          onClick={this.props.onClick}/>
        {this.props.show ? this.renderPopup() : null}
      </div>
    );
  }
}

export default ToolbarButtonPopover;
