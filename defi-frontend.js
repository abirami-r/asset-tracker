import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

function AssetTracker() {
  const [assetId, setAssetId] = useState('');
  const [asset, setAsset] = useState(null);
  const [newOwner, setNewOwner] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const getAssetDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/asset/${id}`);
      setAsset(response.data);
    } catch (error) {
      console.error('Error fetching asset details:', error);
    }
  };

  const transferAsset = async () => {
    try {
      await axios.post('http://localhost:5000/transfer', {
        assetId,
        newOwner,
        newLocation,
      });
      getAssetDetails(assetId); // Fetch updated asset details
    } catch (error) {
      console.error('Error transferring asset:', error);
    }
  };

  return (
    <div className="container">
      <h1>Asset Tracker</h1>
      <div className="form-group">
        <label>Asset ID:</label>
        <input
          type="text"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="form-control"
        />
        <button onClick={() => getAssetDetails(assetId)} className="btn btn-primary mt-2">Get Asset Details</button>
      </div>

      {asset && (
        <div className="mt-3">
          <h3>Asset Details:</h3>
          <p>Name: {asset.name}</p>
          <p>Current Owner: {asset.currentOwner}</p>
          <p>Location: {asset.location}</p>
        </div>
      )}

      <div className="mt-5">
        <h2>Transfer Asset</h2>
        <div className="form-group">
          <label>New Owner Address:</label>
          <input
            type="text"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>New Location:</label>
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className="form-control"
          />
        </div>
        <button onClick={transferAsset} className="btn btn-primary mt-2">Transfer Asset</button>
      </div>
    </div>
  );
}

export default AssetTracker;
