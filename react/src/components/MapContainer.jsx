import React, { useState } from 'react';
import axios from 'axios';

const AddressValidator = () => {
  const [address, setAddress] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [result, setResult] = useState(null);

  const validateAddress = async () => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
        },
      });

      if (response.data.length > 0) {
        setIsValid(true);
        setResult(response.data);
      } else {
        setIsValid(false);
        setResult(null);
      }
    } catch (error) {
      console.error('Error validating address:', error);
      setIsValid(false);
      setResult(null);
    }
  };

  return (
    <div>
      <h1>Address Validator</h1>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter address"
      />
      <button onClick={validateAddress}>Validate Address</button>
      {isValid !== null && (
        <div>
          {isValid ? (
            <div>
              <p>Address is valid!</p>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          ) : (
            <p>Address is invalid.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressValidator;
