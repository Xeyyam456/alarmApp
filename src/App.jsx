
import React, { useState } from 'react';
import './App.css';
import { errorCodes } from './ErrorCodes';
import AI from './AI';



const ErrorCodeApp = () => {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedError, setSelectedError] = useState(null);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setSelectedError(null);
  };

  const handleErrorChange = (e) => {
    const code = e.target.value;
    const error = errorCodes[selectedModel]?.find(error => error.code === code);
    setSelectedError(error);
  };

  return (
    <div className="app-container">
      <h2 className="title">Klima Hata Kodları</h2>

      <div className="input-group-row">
        <div className="input-group">
          <select value={selectedModel} onChange={handleModelChange} className="dropdown stylish-input">
            <option value="">Model Seç</option>
            <option value="Daikin">Daikin</option>
            <option value="Mitsubishi">Mitsubishi Heavy Industry</option>
            <option value="Gree">Gree</option>
            <option value="Toshiba">Toshiba</option>
            <option value="Mitsubishi Electic">Panasonic</option>
            <option value="Sanyo">Sanyo</option>
            <option value="LG">LG</option>
            <option value="McQuay">McQuay</option>
            <option value="Aux">Aux</option>
          </select>
        </div>

        <div className="input-group">
          <AI />
          <select onChange={handleErrorChange} className="dropdown stylish-input" disabled={!selectedModel}>
            <option value="">Hata Kodu Seç</option>
            {selectedModel && errorCodes[selectedModel]?.map((error) => (
              <option key={error.code} value={error.code}>{error.code}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedError && (
        <div className="error-display stylish-box">
          <h3>Hata Kodu: {selectedError.code}</h3>
          <p>{selectedError.description}</p>
        </div>
      )}
    </div>
  );
};


export default ErrorCodeApp;








