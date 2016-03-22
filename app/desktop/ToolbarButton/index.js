import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import classnames from 'classnames';

@Cerebral()
class ToolbarButton extends React.Component {
  constructor() {
    super();
  }
  onClick(e) {
    if (this.props.stopPropagation || this.props.stopPropagation === undefined) {
      e.stopPropagation();
    }

    this.props.onClick && this.props.onClick();
  }
  renderIconTextButton() {
    return (
      <div className={styles.iconTitleWrapper}>
        {this.renderIconButton()}
        <div className={styles.iconTitle}>{this.props.title}</div>
      </div>
    );
  }
  renderIconButton() {
    const className = classnames({
      [styles.activeIcon]: this.props.active,
      [styles.notifyIcon]: this.props.notify,
      [styles.disabledIcon]: this.props.disabled,
      [styles.icon]: !this.props.active && !this.props.notify && !this.props.disabled
    });
    return (
      <div className={className}>
        <div className={this.props.icon}></div>
      </div>
    );
  }
  render() {
    return (
      <button className={styles.button} onClick={(e) => this.onClick(e)} disabled={this.props.disabled}>
        { this.props.title && this.props.icon ? this.renderIconTextButton() : null }
        { !this.props.title && this.props.icon ? this.renderIconButton() : null }
        { this.props.tooltip ? <i>{this.props.tooltip}</i> : null }
      </button>
    );
  }
}

export default ToolbarButton;
