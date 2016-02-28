import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import {
  isObject,
  isArray,
  isString,
  isBoolean,
  isNumber,
  isNull,
  isError,
  isFunction,
  isCircular
} from './utils';

function renderType(value, hasNext, propertyKey) {
  if (value === undefined) {
    return null;
  }

  if (isError(value)) {
    return <ErrorValue value={value}/>
  }

  if (isFunction(value)) {
    return <FunctionValue value={value} propertyKey={propertyKey} hasNext={hasNext}/>
  }

  if (isCircular(value)) {
    return <CircularValue value={value} propertyKey={propertyKey} hasNext={hasNext}/>
  }

  if (isArray(value)) {
    return (
      <ArrayValue
        value={value}
        hasNext={hasNext}
        propertyKey={propertyKey}/>
    );
  }
  if (isObject(value)) {
    return (
      <ObjectValue
        value={value}
        hasNext={hasNext}
        propertyKey={propertyKey}/>
    );
  }

  return (
    <Value
      value={value}
      hasNext={hasNext}
      propertyKey={propertyKey}/>
  );

}

class ObjectValue extends React.Component {
  constructor(props, context) {
    super(props);
    const numberOfKeys = Object.keys(props.value).length;

    this.state = {
      isCollapsed: numberOfKeys > 3 || numberOfKeys === 0 ? true : false
    };

    this.onCollapseClick = this.onCollapseClick.bind(this);
    this.onExpandClick = this.onExpandClick.bind(this);
  }
  onExpandClick() {
    this.setState({isCollapsed: false})
  }
  onCollapseClick() {
    this.setState({isCollapsed: true});
  }
  renderProperty(key, value, index, hasNext) {
    const property = (
      <div className={styles.objectProperty} key={index}>
        <div className={styles.objectPropertyValue}>{renderType(value, hasNext, key)}</div>
      </div>
    );
    return property;
  }
  renderKeys(keys) {
    if (keys.length > 3) {
      return keys.slice(0, 3).join(', ') + '...'
    }
    return keys.join(', ');
  }
  render() {
    const {value, hasNext} = this.props;
    if (this.state.isCollapsed) {
      return (
        <div className={styles.object} onClick={this.onExpandClick}>
          {this.props.propertyKey ? this.props.propertyKey + ': ' : null}
          <strong>{'{ '}</strong>{this.renderKeys(Object.keys(value))}<strong>{' }'}</strong>
          {hasNext ? ',' : null}
        </div>
      );
    } else if (this.props.propertyKey) {
      const keys = Object.keys(value);
      return (
        <div className={styles.object}>
          <div onClick={this.onCollapseClick}>{this.props.propertyKey}: <strong>{'{ '}</strong></div>
          {keys.map((key, index) => this.renderProperty(key, value[key], index, index < keys.length - 1))}
          <div><strong>{' }'}</strong>{hasNext ? ',' : null}</div>
        </div>
      );
    } else {
      const keys = Object.keys(value);
      return (
        <div className={styles.object}>
          <div onClick={this.onCollapseClick}><strong>{'{ '}</strong></div>
          {keys.map((key, index) => this.renderProperty(key, value[key], index, index < keys.length - 1))}
          <div><strong>{' }'}</strong>{hasNext ? ',' : null}</div>
        </div>
      );
    }
  }
}

class ArrayValue extends React.Component {
  constructor(props, context) {
    super(props);
    const numberOfItems = props.value.length;
    this.state = {
      isCollapsed: numberOfItems > 3 || numberOfItems === 0 ? true : false
    };
    this.onCollapseClick = this.onCollapseClick.bind(this);
    this.onExpandClick = this.onExpandClick.bind(this);
  }
  onExpandClick() {
    this.setState({isCollapsed: false})
  }
  onCollapseClick() {
    this.setState({isCollapsed: true});
  }
  renderItem(item, index, hasNext) {
    const arrayItem = (
      <div className={styles.arrayItem} key={index}>
        {renderType(item, hasNext)}
      </div>
    );
    return arrayItem;
  }
  render() {
    const {value, hasNext} = this.props;

    if (this.state.isCollapsed) {
      return (
        <div className={styles.array} onClick={this.onExpandClick}>
          {this.props.propertyKey ? this.props.propertyKey + ': ' : null}
          <strong>{'[ '}</strong>{value.length}<strong>{' ]'}</strong>
          {hasNext ? ',' : null}
        </div>
      );
    } else if (this.props.propertyKey) {
      const keys = Object.keys(value);
      return (
        <div className={styles.array}>
          <div onClick={this.onCollapseClick}>{this.props.propertyKey}: <strong>{'[ '}</strong></div>
          {value.map((item, index) => this.renderItem(item, index, index < value.length - 1))}
          <div><strong>{' ]'}</strong>{hasNext ? ',' : null}</div>
        </div>
      );
    } else {
      return (
        <div className={styles.array}>
          <div onClick={this.onCollapseClick}><strong>{'[ '}</strong></div>
          {value.map((item, index) => this.renderItem(item, index, index < value.length - 1))}
          <div><strong>{' ]'}</strong>{hasNext ? ',' : null}</div>
        </div>
      );
    }
  }
}

function ErrorValue(props) {
  return (
    <div className={styles.error}>
      {props.value.message}
    </div>
  );
}

function Value(props) {
  let className = styles.string;
  if (isNumber(props.value)) className = styles.number;
  if (isBoolean(props.value)) className = styles.boolean;
  if (isNull(props.value)) className = styles.null;
  return (
    <div className={className}>
      {props.propertyKey ? props.propertyKey + ': ' : <span/>}
      <span>{isString(props.value) ? '"' + props.value + '"' : String(props.value)}</span>
      {props.hasNext ? ',' : null}
    </div>
  );
}

function FunctionValue(props) {
  return (
    <div className={styles.function}>
      {props.propertyKey ? props.propertyKey + ': ' : <span/>}
      <span className={styles.functionKeyword}>function </span>
      <span className={styles.functionName}>{props.value.name}</span>
      {props.hasNext ? ',' : null}
    </div>
  );
}

function CircularValue(props) {
  return (
    <div>
      {props.propertyKey ? props.propertyKey + ': ' : <span/>}
      <span className={styles.circular}>[Circular]</span>
      {props.hasNext ? ',' : null}
    </div>
  );
}

function Inspector(props) {
  return renderType(props.value, false, null);
}
export default Inspector;
