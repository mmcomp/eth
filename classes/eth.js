const Web3 = require('web3');

class Etherium {
    ProviderAddress
    Web3Instance
    constructor(providerAddress) {
        this.ProviderAddress = providerAddress;
        if(!this.ProviderAddress)
            this.ProviderAddress = process.env.INFURA;
        
        this.Web3Instance = new Web3(this.ProviderAddress);
    }

    async getBalance(walletAddress) {
        const that = this;
        return new Promise(function (resole, reject){
            that.Web3Instance.eth.getBalance(walletAddress).then(wei => {
                const balance = that.Web3Instance.utils.fromWei(wei, 'ether');
                resole(balance);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async getTetherBalance(walletAddress) {
        const that = this;
        const tokenABI = JSON.parse(process.env.ABI);
        const tokenAddress = process.env.TETHER_ADDRESS;
        return new Promise(function (resole, reject){
            const tokenContract = new that.Web3Instance.eth.Contract(tokenABI, tokenAddress);
            tokenContract.methods.balanceOf(walletAddress).call().then(balance => {
                resole(balance/1000000);
            }).catch(err => {
                reject(err);
            });
        });
    }

    createWallet() {
        return this.Web3Instance.eth.accounts.create();
    }

    async getGasPrice() {
        const that = this;
        return new Promise(function (resole, reject){
            that.Web3Instance.eth.getGasPrice().then(price => {
                resole(price);
            }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = Etherium;