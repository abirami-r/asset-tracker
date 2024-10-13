const express = require('express');
const ethers = require('ethers');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Connect to Ethereum using a provider
const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Contract ABI and address
const contractABI = require('./ABI.json'); // Import the contract's ABI
const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Fetch asset data from smart contract
app.get('/asset/:id', async (req, res) => {
    const assetId = req.params.id;
    try {
        const asset = await contract.getAsset(assetId);
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Transfer asset ownership
app.post('/transfer', async (req, res) => {
    const { assetId, newOwner, newLocation } = req.body;
    const privateKey = 'YOUR_PRIVATE_KEY'; // The private key of the current owner
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = contract.connect(wallet);

    try {
        const tx = await contractWithSigner.transferAsset(assetId, newOwner, newLocation);
        await tx.wait(); // Wait for the transaction to be mined
        res.json({ success: true, transactionHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
