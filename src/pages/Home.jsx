import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import * as web3 from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import logo from "../assets/logo.png"

import { saveWallet, encryptKeypair } from '../helperFunctions';

const Home = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [keypair, setKeypair] = useState(null);
    const [copied, setCopied] = useState(false)
    const [mnemonics, setMnemonics] = useState("");


    async function handleGenerateWallet(){
        const mnemonic = bip39.generateMnemonic(256);
        const x = derivePath("m/44'/501'/0'/0'", bip39.mnemonicToSeedSync(mnemonic)).key;
        setKeypair(web3.Keypair.fromSeed(x))
        
        setMnemonics(mnemonic);
    }


    const handleContinue = async () => {
    let {encrypted, nonce, salt} = await encryptKeypair(keypair)
    saveWallet(encrypted, nonce, salt)
    navigate("/mint");
    };

    const handleCopy = () => {
    navigator.clipboard.writeText(mnemonics)
    setCopied(true)
    }


    useEffect(() => {
        const generateWallet = async () => {
        let data = localStorage.getItem('data');
        data = JSON.parse(data)

        if (data === null) {
            await handleGenerateWallet();
            return
        }
        
        navigate("/mint");
        }
        generateWallet()
        setCopied(false)
    }, []);



    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            } else {
                console.log(token)
                const { data } = await axios.post(
                    "https://postns.onrender.com/api",
                    {},
                    { 
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                const { status, user } = data;
                setUsername(user);
                return status
                    ? (toast(`Hello ${user}`, {
                        position: "top-right",
                    }))
                    :
                    navigate("/login");
            }
        };

        checkAuthentication()
    
    }, [navigate]);

    const Logout = () => {
        localStorage.removeItem('token');
        navigate("/signup");
    };

    return (
        <>
        <div className="home_page">
            <div style={{display:"flex", alignItems:"center"}}>
                <img src={logo} />
                <div style={{fontFamily:"monospace", textAlign:"center"}}>Post n' Smile</div>
                <div></div>
            </div>
            <h3>
            {" "}
            Welcome <span>{username}</span>
            </h3>
            <div className='mnemonics'>
                <button className='btn' onClick={handleCopy}>{ copied ? "Copied" : "Copy to clipboard"}</button>
                <h3>{mnemonics}</h3>
                <button className='btn' onClick={handleContinue}>Continue</button>
            </div>
            <button onClick={Logout}>LOGOUT</button>
        </div>
        <ToastContainer />
        </>
    );
    };

    export default Home;