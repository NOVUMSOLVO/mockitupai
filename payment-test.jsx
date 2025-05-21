import React from 'react';
import PayPalCheckout from './src/payments/PayPalCheckout';

const TestComponent = () => {
  const mockPlan = { 
    id: 'pro', 
    name: 'Pro Plan', 
    price: '$10/month' 
  };
  
  return (
    <PayPalCheckout 
      plan={mockPlan}
      onClose={() => console.log('closed')}
    />
  );
};

export default TestComponent;
