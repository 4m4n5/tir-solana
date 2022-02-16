/*
 * We are going to be using the useEffect hook!
 */
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'amantheNaN';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const STARTER_WORDS = [
	'car', 'dog', 'plane', 'cat', 'truck', 'key'
]
const TARGET_WORD = 'tiger'

const App = () => {
	// State
	const [walletAddress, setWalletAddress] = useState(null);
	const [clickedWord, setClickedWord] = useState('');
	const [targetWord, setTargetWord] = useState('');
	const [optionWords, setOptionWords] = useState([]);
	
	/*
	 * This function holds the logic for deciding if a Phantom Wallet is
	 * connected or not
	 */
	const checkIfWalletIsConnected = async () => {
		try {
			const { solana } = window;

			if (solana) {
				if (solana.isPhantom) {
					console.log('Phantom wallet found!');

					// Use solana object to connect to user's wallet
					const response = await solana.connect({onlyIfTrusted: true});
					console.log(
						'Conencted with public key:', response.publicKey.toString()
					);

					/*
					* Set the user's publicKey in state to be used later!
					*/
					setWalletAddress(response.publicKey.toString());
				}
			} else {
				alert('Solana object not found! Get a Phantom Wallet 👻');
			}
		} catch (error) {
			console.error(error);
		}
	};

	/*
	* Let's define this method so our code doesn't break.
	* We will write the logic for this next!
	*/
	const connectWallet = async () => {
		const { solana } = window;

		if (solana) {
			const response = await solana.connect();
			console.log('Connected with Public Key:', response.publicKey.toString());
			setWalletAddress(response.publicKey.toString());
		}
	};

	const submitWord = async () => {
		if (clickedWord.length > 0) {
			console.log('Clicked word:', clickedWord);
			setClickedWord('');
		} else {
			console.log('Empty input. Try again.');
		}
	};

	/*
	* Call this when a word is clicked
	*/
	const onWordClick = (event) => {
		const { value } = event.target;
		setClickedWord(value);
	};

	/*
	* We want to render this UI when the user hasn't connected
	* their wallet to our app yet.
	*/
	const renderNotConnectedContainer = () => (
		<button
			className="cta-button connect-wallet-button"
			onClick={connectWallet}
		>
			Connect to Wallet
		</button>
	);

	/*
	* We want to render this UI with starting words 
	* when the user has connected and authorized
	* their wallet to our app yet.
	*/
	const renderConnectedContainer = () => (
		<div className="connected-container">
			<div className="target-container target-container-text">
				Target Word: {targetWord}
			</div>

			<div className="options-container">
				<form onSubmit={(event) => {
						event.preventDefault();
						submitWord();
					}}
				>
					{optionWords.map(word => (
						<input
							type="button" 
							className="cta-button submit-gif-button"
							value={word}
              key={word}
							onClick={onWordClick}
						/>
					))}

					<button type="submit" className="cta-button submit-gif-button">
						Submit
					</button>
				</form>
			</div>
		</div>
	);

	/*
	 * In React, the useEffect hook gets called once on component mount when that second parameter (the []) is empty! 
	 * When our component first mounts, let's check to see if we have a connected
	 * Phantom Wallet
	 */
	
	useEffect(() => {
		const onLoad = async () => {
			await checkIfWalletIsConnected();
		};
		window.addEventListener('load', onLoad);
		return () => window.removeEventListener('load', onLoad);
	}, []);

	/*  if we have a walletAddress go ahead and run our fetch logic
	 */
	useEffect(() => {
		if (walletAddress) {
			console.log('Fetching starting and target word...');
			
			// Call Solana program here.

			// Set state
			setOptionWords(STARTER_WORDS);
			setTargetWord(TARGET_WORD)
		}
	}, [walletAddress]);

	return (
		<div className="App">
			<div className={walletAddress ? 'authed-container' : 'container'}>
				<div className="header-container">
					<p className="header">🎯 Tir</p>
					<p className="sub-text">
						Reach the target word.
          			</p>
					{!walletAddress && renderNotConnectedContainer()}
					{walletAddress && renderConnectedContainer()}
				</div>
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built by @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;