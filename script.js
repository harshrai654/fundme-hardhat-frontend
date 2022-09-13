import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connect");
const balanceBtn = document.getElementById("balance");
const amountInput = document.getElementById("amount");
const withdrawBtn = document.getElementById("withdraw");
const fundBtn = document.getElementById("fund");

function isEthereumPresent() {
	return typeof window.ethereum !== "undefined";
}

connectBtn.onclick = async function handleConnectClick() {
	if (isEthereumPresent()) {
		const { ethereum } = window;

		try {
			console.log("Connecting...");
			await ethereum.request({ method: "eth_requestAccounts" });

			connectBtn.innerText = "Connected";
			console.log("Connected.");
		} catch (error) {
			console.log(error);
		}
	} else {
		connectBtn.innerText = "Install Metamask";
		connectBtn.disabled = true;
	}
};

balanceBtn.onclick = async function handleBalanceClick() {
	if (isEthereumPresent()) {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const balance = await provider.getBalance(contractAddress);

		console.log(`Balance: ${ethers.utils.formatEther(balance)}`);
	} else {
		balanceBtn.innerText = "Install Metamask";
		balanceBtn.disabled = true;
	}
};

fundBtn.onclick = async function handleFundClick() {
	const ethAmount = amountInput.value || "10";
	if (isEthereumPresent()) {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, abi, signer);

		try {
			const transactionResponse = await contract.fund({
				value: ethers.utils.parseEther(ethAmount),
			});
			await waitForTransactionMine(transactionResponse, provider);
			console.log("Done!");
		} catch (error) {
			console.log(error);
		}
	} else {
		balanceBtn.innerText = "Install Metamask";
		balanceBtn.disabled = true;
	}
};

withdrawBtn.onclick = async function handleWithdrawClick() {
	if (isEthereumPresent()) {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, abi, signer);

		try {
			const transactionResponse = await contract.withdraw();
			await waitForTransactionMine(transactionResponse, provider);
			console.log("Done!");
		} catch (error) {
			console.log(error);
		}
	} else {
		balanceBtn.innerText = "Install Metamask";
		balanceBtn.disabled = true;
	}
};

function waitForTransactionMine(transactionResponse, provider) {
	console.log(`Mining ${transactionResponse.hash}...`);

	return new Promise((resolve) => {
		provider.once(transactionResponse.hash, (transactionReceipt) => {
			console.log(
				`Compelted with ${transactionReceipt.confirmations} Confirmations`
			);
			resolve();
		});
	});
}
