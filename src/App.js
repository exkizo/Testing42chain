import { useState } from 'react';
import { ethers, providers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = "0x0dFCaDd0C1D0FD8E0c82E829Db0D78d9447a2F9A"

function Header() {
  return (<h3>The goal of this Dapp in to write and read from the Ropsten Testnet Blockchain!</h3>)
}

function Instructions() {
  return (<div><p>For you to be able to use this aplication, you will need a Metamask connected to the Ropsten Tesnet and some fake ETH:</p></div>)
}

function TableInstructions() {
  return (
  <table>
    <tbody>
    <tr>
      <td>Donwload Metamask:</td>
      <td><a href="https://metamask.io/" target="_blank">Metamask Official Website</a></td>
    </tr>
    <tr>
      <td>Get some fake ETH:</td>
      <td><a href="https://faucet.ropsten.be/" target="_blank">Ropsten ETH faucet</a></td>
    </tr>
    </tbody>
  </table>)
}

function App() {
  const [greeting, setGreetingValue] = useState('')

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined'){
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      await transaction.wait()
      fetchGreeting()
    }
  }

  async function fetchGreeting () {
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        return(alert(data))
      } catch (err) {
        console.log ("Error: ", err)
      }
    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <Header />
        <Instructions />
        <TableInstructions />
        <div><button onClick={fetchGreeting}>Read String</button></div>
        <div><button onClick={setGreeting}>Write String</button></div>
        <div><input
          onChange={e => setGreetingValue(e.target.value)}
          placeholder="New string"
          value={greeting} 
        /></div>
      </header>
    </div>
  );
}

export default App;
