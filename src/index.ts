import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const PARA_API_KEY = process.env.PARA_API_KEY!;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const PARA_API_BASE = 'https://api.beta.getpara.com/v1';
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

// Middleware to validate JWT
async function validateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: 'Invalid token' });

    req.user = data.user;
    next();
}

// Signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    const supabaseUrl = 'https://your-supabase-url.supabase.co';
    const supabaseKey = 'your-supabase-anon-key';
    const supabase = createClient(supabaseUrl, supabaseKey);
    if (error) return res.status(400).json({ error: error.message });

    // Create wallet via Para API
    try {
        const walletResponse = await axios.post(
            `${PARA_API_BASE}/wallets`,
            {},
            { headers: { Authorization: `Bearer ${PARA_API_KEY}` } }
        );
        res.json({ wallet: walletResponse.data });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create wallet' });
    }
});

// View Wallet
app.get('/wallet', async (req, res) => {
    const { address } = req.query;
    try {
        const walletResponse = await axios.get(
            `${PARA_API_BASE}/wallets/${address}`,
            { headers: { Authorization: `Bearer ${PARA_API_KEY}` } }
        );
        res.json(walletResponse.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to // Signup
const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  iimpccccimport express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { ethers } from 'ethers';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

// Environment Variables
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!;
const PARA_API_KEY = process.env.PARA_API_KEY!;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL!;

// Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Para API Client
const paraClient = axios.create({
  baseURL: 'https://api.beta.getpara.com',
  headers: { Authorization: `Bearer ${PARA_API_KEY}` },
});

// Middleware to Verify Supabase JWT
const verifyJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: 'Invalid token' });

  req.user = data.user;
  next();
};

// Routes

// Signup: Create Para Wallet
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Create Supabase User
  const { data: user, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  // Create Para Wallet
  const { data: wallet } = await paraClient.post('/v1/wallets', { type: 'sepolia' });

  // Store Mapping: supabase_user_id → para_wallet_id
  await supabase.from('wallets').insert({
    user_id: user.id,
    wallet_id: wallet.id,
  });

  res.json({ message: 'Signup successful', wallet });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

// View Wallet
app.get('/wallet', verifyJWT, async (req, res) => {
  const userId = req.user.id;

  // Get Para Wallet ID
  const { data: walletMapping } = await supabase
    .from('wallets')
    .select('wallet_id')
    .eq('user_id', userId)
    .single();

  if (!walletMapping) return res.status(404).json({ error: 'Wallet not found' });

  // Fetch Wallet Details
  const { data: wallet } = await paraClient.get(`/v1/wallets/${walletMapping.wallet_id}`);
  res.json(wallet);
});

// Send Crypto
app.post('/send', verifyJWT, async (req, res) => {
  const { to, amount } = req.body;
  const userId = req.user.id;

  // Get Para Wallet ID
  const { data: walletMapping } = await supabase
    .from('wallets')
    .select('wallet_id')
    .eq('user_id', userId)
    .single();

  if (!walletMapping) return res.status(404).json({ error: 'Wallet not found' });

  // Build Transaction
  const tx = {
    to,
    value: ethers.utils.parseEther(amount),
    gas: 21000,
    maxFeePerGas: ethers.utils.parseUnits('1', 'gwei'),
    maxPriorityFeePerGas: ethers.utils.parseUnits('1', 'gwei'),
  };

  // Sign Transaction
  const { data: signedTx } = await paraClient.post(
    `/v1/wallets/${walletMapping.wallet_id}/sign-raw`,
    { tx }
  );

  // Broadcast Transaction
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  const txHash = await provider.sendTransaction(signedTx.raw);

  res.json({ txHash });
});

// Start Server
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`)); wallet' });
    }
});

// Send Crypto
app.post('/send', async (req, res) => {
    const { from, to, amount } = req.body;
    try {
        const txResponse = await axios.post(
            'https://api.beta.getpara.com/transactions',
            { from, to, amount },
            { headers: { Authorization: `Bearer ${PARA_API_KEY}` } }
        );
        res.json(txResponse.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send transaction' });
    }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));

// Middleware to verify JWT
const verifyJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: 'Invalid token' });

    req.user = data.user;
    next();
};

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ token: data.session.access_token });
});urn res.status(400).json({ error: error.message });

    res.json({ token: data.session.access_token });
});

// Store user-to-wallet mapping in Supabase
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // Create user in Supabase
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });

    // Create wallet using Para API
    try {
        const walletResponse = await axios.post(
            `${PARA_API_BASE}/wallet`,
            {},
            { headers: { Authorization: `Bearer ${PARA_API_KEY}` } }
        );

        const wallet = walletResponse.data;

        // Store user-to-wallet mapping in Supabase
        await supabase.from('wallets').insert({
            user_id: data.user.id,
            wallet_address: wallet.address,
            wallet_private_key: wallet.privateKey,
        });

        res.json({ message: 'Signup successful', wallet });
    } catch (err) {
        res.status(500).json({ error: 'Wallet creation failed' });
    }
});

// View Wallet endpoint
app.get('/wallet', verifyJWT, async (req, res) => {
    const { user } = req;

    const { data, error } = await supabase.from('wallets').select('*').eq('user_id', user.id).single();
    if (error) return res.status(404).json({ error: 'Wallet not found' });

    try {
        const balanceResponse = await axios.get(
            `${PARA_API_BASE}/wallet/${data.wallet_address}/balance`,
            { headers: { Authorization: `Bearer ${PARA_API_KEY}` } }
        );

        res.json({ wallet: data.wallet_address, balance: balanceResponse.data.balance });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch wallet balance' });
    }
});

// Send Crypto endpoint
app.post('/send', verifyJWT, async (req, res) => {
    const { user } = req;
    const { to, amount } = req.body;

    const { data, error } = await supabase.from('wallets').select('*').eq('user_id', user.id).single();
    if (error) return res.status(404).json({ error: 'Wallet not found' });

    try {
        const transactionResponse = await axios.post(
            `${PARA_API_BASE}/transaction`,
            {
                from: data.wallet_address,
                to,
                amount,
                privateKey: data.wallet_private_key,
            },
            { headers: { Authorization: `Bearer ${PARA_API_KEY}` } }
        );

        res.json({ transaction: transactionResponse.data });
    } catch (err) {
        res.status(500).json({ error: 'Transaction failed' });
    }
});