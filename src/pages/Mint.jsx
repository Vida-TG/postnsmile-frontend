import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Connection, PublicKey } from "@solana/web3.js"
import { ToastContainer, toast } from "react-toastify";
import logo from "../assets/logo.png"

const Mint = () => {
    const [elementCount, setElementCount] = useState(0);
    
    const [mintName, setMintName] = useState("");
    const [mintAddress, setMintAddress] = useState("");
    const [successSignature, setSuccessSignature] = useState("");
    const [imageUrl, setImageURL] = useState("");
    const [minted, setMinted] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const underdogApiEndpoint = "https://dev.underdogprotocol.com"
    const quicknodeEndpoint = 'https://sleek-young-wish.solana-devnet.discover.quiknode.pro/599508352f62a4e2225f96f71d550ea2f38f45f5/';
    const connection = new Connection(quicknodeEndpoint);

    const PROJECTID = 1
    const PROJECT_MINT = "7QYeh9hPUPaK5LdfXXYxdf4PLbTD4GwFd7GY6czqpVxG"

    const config = {
        headers: { Authorization: 'Bearer b8ee76143a8fdb.73f2a5a35d4045b2a0abddadca155825'}
    }

    const navigate = useNavigate();

    const profile = () => {
        navigate("/profile");
    }

    const images = [
        "https://i.imgur.com/yxghSka.png",
        "https://i.imgur.com/J9P1F5q.png",
        "https://i.imgur.com/n8X5KrV.png",
        "https://i.imgur.com/I7Ke6ht.png",
        "https://i.imgur.com/JIjurtv.png",
        "https://i.imgur.com/M5MRI3Y.png",
        "https://i.imgur.com/2Zww9FH.png",
        "https://i.imgur.com/mmDJeYK.png",
    ]
    const nftData = {
        "name": `Post N' Smile DP#${elementCount}`,
        "symbol": `PNS#${elementCount}`,
        "image": selectedImage
    }
    
    const handleImageClick = (image) => {
        setSelectedImage(image);
    };
    
    async function mintNFT() {
        setMinted(2)
        const createNFTResponse = await axios.post(
            `${underdogApiEndpoint}/v2/projects/${PROJECTID}/nfts`,
            nftData,
            config,
        );

        let retrieveNFT;

        do {
            retrieveNFT = axios.get(
                `${underdogApiEndpoint}/v2/projects/${PROJECTID}/nfts/${createNFTResponse.data.nftId}`,
                config,
            );
            await new Promise(resolve => setTimeout(resolve, 100))
        } while ((await retrieveNFT).data.status !== 'confirmed');

        const tempImgUrl = (await retrieveNFT).data.image

        setMintAddress((await retrieveNFT).data.mintAddress)
        setMintName((await retrieveNFT).data.name)
        setImageURL(tempImgUrl)

        const signatures = await connection.getSignaturesForAddress(new PublicKey(PROJECT_MINT), {
            commitment: 'confirmed',
        })
        const transactionDetails = await connection.getParsedTransaction(
            signatures[0].signature,
            {
                commitment: 'confirmed',
                encoding: "jsonParsed",
                maxSupportedTransactionVersion: 0
            }
        )
        setSuccessSignature(transactionDetails.transaction.signatures[0])

        console.log(tempImgUrl)
        const { data } = await axios.post(
            "https://postns.onrender.com/api/upload-image",
            { imageUrl: tempImgUrl },
            { 
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        console.log(data)
        const { success, message } = data;
        if (success) {
            toast(`You successfully minted your display picture as a compressed NFT`, {
                position: "top-right",
            })
            setMinted(1)
        } else {
            toast.error(`Mint failed`, {
                position: "top-right",
            })
        }
    }

    useEffect(() => {
        axios.get('https://postns.onrender.com/api/count')
        .then((response) => {
            setElementCount(response.data.elementCount);
        })
        .catch((error) => {
            console.error('Error fetching elementCount:', error);
        });

    }, []);
    return (
        <div className='pages'>
            <div style={{display:"flex", alignItems:"center"}}>
                <img src={logo} />
                <div style={{fontFamily:"monospace", textAlign:"center"}}>Post n' Smile</div>
                <div></div>
            </div>
            <div className="image-gallery">
            <h2>Mint your display picture</h2>
            <h4 style={{margin:"15px"}}>Click an image to select:</h4>
            <div className="image-list">
                {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Image ${index}`}
                    onClick={() => handleImageClick(image)}
                    style={{marginBottom:"5px", border: ".5px solid #fff"}}
                />
                ))}
            </div>
            {selectedImage && (
                <div className="selected-image">
                <h3>Selected Image:</h3>
                <img src={selectedImage} alt="Selected" />
                </div>
            )}
            </div>
            { (minted === 1) &&
            <div style={{display:"flex", flexDirection:"column", alignItems:"center"}} className='break-word'>
                <div>Name: {mintName}</div>
                <div>Image Address: {mintAddress}</div>
                <div>Image URL: <a href={imageUrl} target="_blank">Click to view in new tab</a></div>
                <div>Transaction Signature: <a href={`https://solscan.io/tx/${successSignature}?cluster=devnet`} target="_blank">Click to view in new tab</a></div>
                <div className='mint-container'>
                    <button className='btn' onClick={profile}>Continue</button>
                </div>
            </div>
            }
            { (minted === 2) &&
            <div className='mint-container'>
                <button className='btn'>...loading</button>
            </div>
            }
            { (minted === 0) &&
            <div className='mint-container'>
                { selectedImage ? <button className='btn' onClick={mintNFT}>MINT</button>
                :
                <></>
                }
            </div>
            }
            <ToastContainer />
        </div>
    )
}

export default Mint