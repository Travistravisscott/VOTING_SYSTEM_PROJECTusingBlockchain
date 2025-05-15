const contractABI = [
	{
		"inputs": [],
		"name": "announceWinner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "registerVoter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "proposalNames",
				"type": "string[]"
			},
			{
				"internalType": "uint256",
				"name": "votingTimeInMinutes",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"name": "ProposalAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "Voted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "winningProposalId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"name": "VotingResult",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "chairperson",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "proposals",
		"outputs": [
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "hasVoted",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "vote",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "votingDeadline",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "winnerName",
		"outputs": [
			{
				"internalType": "string",
				"name": "winnerProposalDescription",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "winningProposal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "winningProposalId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0xa10752dfcce22c50e1093ec85272dfa2515f44ef'; 
let web3;
let projectVoting;
let currentAccount;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable(); // Request account access
            initContract();
            getCurrentAccount();
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        web3 = new Web3('https://sepolia.infura.io/v3/2c845505a1d74c80a4e8648f76a0d9a2'); // Replace with your Infura project URL
        initContract();
    }
});

function initContract() {
    projectVoting = new web3.eth.Contract(contractABI, contractAddress);
}

async function connectMetaMask() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        document.getElementById('currentAccount').innerText = `Connected account: ${currentAccount}`;
    } catch (error) {
        console.error("Error connecting MetaMask", error);
    }
}

async function getCurrentAccount() {
    const accounts = await web3.eth.getAccounts();
    currentAccount = accounts[0];
    document.getElementById('currentAccount').innerText = `Connected account: ${currentAccount}`;
}

async function registerVoter() {
    const voterAddress = document.getElementById('voterAddress').value;
    const accounts = await web3.eth.getAccounts();
    const chairperson = accounts[0];

    try {
        await projectVoting.methods.registerVoter(voterAddress).send({ from: chairperson });
        alert(`Voter ${voterAddress} registered successfully.`);
    } catch (error) {
        console.error('Error registering voter:', error);
        alert('Error registering voter. See console for details.');
    }
}

async function castVote() {
    const proposalId = document.getElementById('proposalId').value;
    const accounts = await web3.eth.getAccounts();
    const voter = accounts[0];

    try {
        await projectVoting.methods.vote(proposalId).send({ from: voter });
        alert(`Vote for proposal ${proposalId} cast successfully.`);
    } catch (error) {
        console.error('Error casting vote:', error);
        alert('Error casting vote. See console for details.');
    }
}

async function announceWinner() {
    try {
        const winner = await projectVoting.methods.winnerName().call();
        document.getElementById('winner').innerText = `Winning Proposal: ${winner}`;
    } catch (error) {
        console.error('Error announcing winner:', error);
        alert('Error announcing winner. See console for details.');
    }
}
