import React from 'react';
import PropTypes from 'prop-types';

const PlaceholderImage = ({ width = 300, height = 200, text = 'Placeholder', className = '', ...props }) => {
  return (
    <div 
      className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        aspectRatio: `${width}/${height}`
      }}
      {...props}
    >
      <span className="text-center p-4">{text}</span>
    </div>
  );
};

PlaceholderImage.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  text: PropTypes.string,
  className: PropTypes.string
};

export default PlaceholderImage;
