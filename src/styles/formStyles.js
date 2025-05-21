// Common styles for form containers
export const formContainer = {
  maxWidth: '400px',
  margin: '2rem auto',
  padding: '2.5rem',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  ':hover': {
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)'
  },
  '@media (max-width: 480px)': {
    margin: '1rem',
    padding: '1.5rem'
  }
};

// Add ripple animation styles
const rippleKeyframes = `
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    100% {
      transform: scale(20, 20);
      opacity: 0;
    }
  }
`;

// Add the keyframes to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(rippleKeyframes));
  document.head.appendChild(style);
}

export const formTitle = {
  textAlign: 'center',
  color: '#2c3e50',
  marginBottom: '2rem',
  fontSize: '2rem',
  fontWeight: '700',
  background: 'linear-gradient(90deg, #4a6cf7, #6a11cb)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.5px'
};

export const formGroup = {
  marginBottom: '1.5rem',
  position: 'relative'
};

export const formLabel = {
  display: 'block',
  marginBottom: '0.5rem',
  color: '#4a5568',
  fontSize: '0.95rem',
  fontWeight: '600',
  transition: 'color 0.2s ease'
};

export const formInput = {
  width: '100%',
  padding: '0.875rem 1rem',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '1rem',
  lineHeight: '1.5',
  backgroundColor: '#f8fafc',
  transition: 'all 0.2s ease',
  '&:focus': {
    borderColor: '#4a6cf7',
    backgroundColor: '#fff',
    boxShadow: '0 0 0 3px rgba(74, 108, 247, 0.15)',
    outline: 'none'
  },
  '&::placeholder': {
    color: '#94a3b8',
    opacity: 1
  }
};

export const formInputFocus = {
  borderColor: '#80bdff',
  outline: 'none',
  boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
};

export const formButton = {
  width: '100%',
  padding: '0.875rem 1.5rem',
  backgroundColor: '#4a6cf7',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 6px -1px rgba(74, 108, 247, 0.2), 0 2px 4px -1px rgba(74, 108, 247, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  ':active': {
    transform: 'translateY(1px)',
    boxShadow: '0 2px 4px -1px rgba(74, 108, 247, 0.15)'
  },
  '::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '5px',
    height: '5px',
    background: 'rgba(255, 255, 255, 0.5)',
    opacity: '0',
    borderRadius: '100%',
    transform: 'scale(1, 1) translate(-50%)',
    transformOrigin: '50% 50%',
    transition: 'all 0.6s ease-out'
  },
  ':focus:not(:active)::after': {
    animation: 'ripple 1s ease-out'
  }
};



export const formButtonHover = {
  backgroundColor: '#3a5bd9',
  transform: 'translateY(-1px)',
  boxShadow: '0 7px 14px rgba(74, 108, 247, 0.25), 0 3px 6px rgba(0, 0, 0, 0.08)'
};

export const formButtonDisabled = {
  backgroundColor: '#cbd5e1',
  cursor: 'not-allowed',
  boxShadow: 'none',
  transform: 'none',
  '&:hover': {
    backgroundColor: '#cbd5e1',
    transform: 'none',
    boxShadow: 'none'
  }
};

export const formFooter = {
  marginTop: '2rem',
  textAlign: 'center',
  color: '#64748b',
  fontSize: '0.95rem',
  '& a': {
    transition: 'all 0.2s ease',
    '&:hover': {
      textDecoration: 'none',
      color: '#3a5bd9'
    }
  }
};

export const formLink = {
  color: '#4a6cf7',
  textDecoration: 'none',
  fontWeight: '600',
  position: 'relative',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: '#3a5bd9',
    textDecoration: 'none',
    '&::after': {
      width: '100%',
      left: '0'
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '0',
    height: '2px',
    bottom: '-2px',
    left: '50%',
    backgroundColor: '#4a6cf7',
    transition: 'all 0.3s ease'
  }
};

export const formDivider = {
  display: 'flex',
  alignItems: 'center',
  margin: '1.5rem 0',
  color: '#94a3b8',
  '&::before, &::after': {
    content: '""',
    flex: 1,
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '0 1rem'
  }
};

export const formError = {
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  marginBottom: '1.5rem',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: '0.5rem',
    flexShrink: 0
  }
};
