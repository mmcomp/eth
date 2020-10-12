require('dotenv').config();
const fs = require('fs');
const { exit } = require('process');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const Etherium = require('./classes/eth')

const eth = new Etherium(process.env.INFURA);

async function start() {
    try{
        const gasPrice = await eth.getGasPrice();
        console.log('Gas Price : ', gasPrice);
    }catch(e) {
        console.error('Gas price Error :', e);
    }
    let wallet = null;
    if(fs.existsSync(process.env.WALLET_JSON)) {
        try{
            wallet = JSON.parse(fs.readFileSync(process.env.WALLET_JSON))
        }catch(e){
            wallet = null
        }
    }
    if(wallet == null){
        wallet = eth.createWallet();
        fs.writeFileSync(process.env.WALLET_JSON, JSON.stringify(wallet));
    }

    console.log('Your wallet address is : ', wallet.address);

    rl.question("What is your Etherium Wallet Address ? ",async function(walletAddress) {
        try{
            const ebalance = await eth.getBalance(walletAddress);
            console.log('Etherium Balance is', ebalance);
        }catch(e){
            console.error('Etherium Error :', e);
        }
        try{
            const tbalance = await eth.getTetherBalance(walletAddress);
            console.log('Tether Balance is', tbalance);
        }catch(e){
            console.error('Tether Error :', e);
        }
        process.exit();
    });
}

start();
