import React from 'react';
import styles from './styles.css';

function Title(props) {
  return (
    <h1 style={{color: props.color}} className={styles.title}>
      {props.children}
    </h1>
  );
}

Title.propTypes = {
  color: React.PropTypes.string.isRequired,
  children: React.PropTypes.any.isRequired
};

export default Title;
