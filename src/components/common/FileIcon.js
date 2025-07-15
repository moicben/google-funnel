import React from 'react';

const FileIcon = ({ type, size = 20, className = '' }) => {
  const iconProps = {
    width: `${size}px`,
    height: `${size}px`,
    className: className
  };

  switch (type) {
    case 'folder':
      return (
        <svg {...iconProps} focusable="false" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#5f6368' }}>
          <g>
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path>
            <path d="M0 0h24v24H0z" fill="none"></path>
          </g>
        </svg>
      );
    
    case 'docs':
      return (
        <svg {...iconProps} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ color: '#1a73e8' }}>
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M14.222 0H1.778C.8 0 0 .8 0 1.778v12.444C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm-1.769 5.333H3.556V3.556h8.897v1.777zm0 3.556H3.556V7.11h8.897V8.89zm-2.666 3.555H3.556v-1.777h6.23v1.777z" 
            fill="currentColor"
          />
        </svg>
      );
    
    case 'sheets':
      return (
        <svg {...iconProps} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ color: '#0f9d58' }}>
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M14.222 0H1.778C.8 0 .008.8.008 1.778L0 4.444v9.778C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm0 7.111h-7.11v7.111H5.332v-7.11H1.778V5.332h3.555V1.778h1.778v3.555h7.111v1.778z" 
            fill="currentColor"
          />
        </svg>
      );
    
    case 'slides':
      return (
        <svg {...iconProps} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ color: '#f4b400' }}>
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M14.222 0H1.778C.8 0 0 .8 0 1.778v12.444C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm-1.778 12.444H3.556V3.556h8.888v8.888z" 
            fill="currentColor"
          />
        </svg>
      );
    
    case 'pdf':
      return (
        <svg {...iconProps} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ color: '#ea4335' }}>
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M14.222 0H1.778C.8 0 0 .8 0 1.778v12.444C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm-1.778 12.444H3.556V3.556h8.888v8.888zM7.111 7.111H5.333V5.333h1.778v1.778zm1.778 0h1.778V5.333H8.889v1.778zm0 1.778H7.111V7.111h1.778v1.778zm1.778 0h1.778V7.111h-1.778v1.778z" 
            fill="currentColor"
          />
        </svg>
      );
    
    default:
      return (
        <svg {...iconProps} focusable="false" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#5f6368' }}>
          <g>
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"></path>
          </g>
        </svg>
      );
  }
};

export default FileIcon;