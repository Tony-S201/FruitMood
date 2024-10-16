
'use client';

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { publicClient, walletClient } from "../constants/client";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { type Hash, type TransactionReceipt, type Address, isAddress } from "viem";

// UI components
import { Button, Card, CardActions, CardContent, CardMedia, Grow, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";

// Constants
import { contractAddress, contractAbi, nftIds } from "../constants/fruitfablenft";
import { fruitIds } from "../constants/tokenIds";
import CustomAlert from "../components/shared/CustomAlert";

// TypeScript Interfaces
interface Attribute {
  trait_type: string;
  value: string;
}
interface nftItem {
  balance: string,
  metadata: {
    name: string,
    description: string,
    image: string,
    attributes: Attribute[]
  },
  tokenId: number
}
type typeOfAlert = 'error' | 'success';

const MyCollectionPage: React.FunctionComponent = (): JSX.Element => {

  /* State */
  const [nftItems, setNftItems] = useState<{[key: string]: nftItem[]}>({});
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeOfAlert>("error");
  const [receipt, setReceipt] = useState<TransactionReceipt>();
  const [hash, setHash] = useState<Hash>();
  const [activeAnimation, setActiveAnimation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [openTransfer, setOpenTransfer] = useState<boolean>(false);
  const [currentTokenId, setCurrentTokenId] = useState<number | null>(null);

  /* Another const */
  const { address: userAddress, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  // Fetch nft metadata from contract
  const fetchNftMetadata = useMemo(() => async (tokenId: number) => {
    const uri = await publicClient.readContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'uri',
      args: [tokenId]
    });
  
    if (uri && typeof uri === 'string') {
      const metadataUrl = uri.replace('ipfs://', 'https://violet-impossible-earthworm-31.mypinata.cloud/ipfs/');
      const fullMetadataUrl = metadataUrl.replace('{id}', tokenId.toString());
      const response = await fetch(fullMetadataUrl);
      const metadata = await response.json();
  
      return metadata;
    }
    return null;
  }, [publicClient, contractAddress, contractAbi]);

  // NFTs Fusion
  const fusionNfts = useCallback(async(fruitType: string) => {
    try {
      setLoading(true);
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'mergeFruits',
        account: userAddress!,
        args: [fruitIds[fruitType.toLowerCase() as keyof typeof fruitIds]]
      })
      const hash = await walletClient.writeContract(request);

      try {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
          setLoading(false);
          setAlertType('success')
          setAlertMessage('La fusion des NFTs a été effectuée avec succès !');
          setShowAlert(true);
        } else {
          console.error('Erreur during tx :', receipt);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur during tx receipt :', error);
        setLoading(false);
      }

    } catch(error) {
      setLoading(false)
      if (error instanceof Error) {
        const revertReason = "You must collect all 5 emotion traits of the same fruit NFT to perform the merge.";
        if (error.message.includes(revertReason)) {
          setAlertType('error')
          setAlertMessage(revertReason);
          setShowAlert(true);
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  }, [publicClient, walletClient, userAddress, contractAddress, contractAbi]);

  const transferNft = useCallback(async(tokenId: number, targetAddress: Address) => {
    try {
      setLoading(true);

      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'safeTransferFrom',
        account: userAddress!,
        args: [userAddress, targetAddress, tokenId, 1, "0x"]
      })
      const hash = await walletClient.writeContract(request);

      try {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
          setLoading(false);
          setAlertType('success')
          setAlertMessage(`Transfer to ${targetAddress} successfully executed.`);
          setShowAlert(true);
        } else {
          console.error('Erreur during tx :', receipt);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur during tx receipt :', error);
        setLoading(false);
      }

    } catch(error) {
      setLoading(false);
      if (error instanceof Error) {
        setAlertType('error')
        setAlertMessage("Failed to execute transfer, please retry.")
        setShowAlert(true);
      } else {
        console.error("An unknow error occured")
      }
    }
  }, [publicClient, walletClient, userAddress, contractAddress, contractAbi]);

  const openTransferModal = useCallback((tokenId: number) => {
    setCurrentTokenId(tokenId);
    setOpenTransfer(true);
  }, []);

  const closeTransferModal = useCallback(() => {
    setCurrentTokenId(null);
    setOpenTransfer(false);
  }, []);

  const toggleTransferModal = useCallback((tokenId: number | null = null) => {
    setCurrentTokenId(tokenId);
    setOpenTransfer(prev => !prev);
  }, []);

  /* useEffect Hook */

  // Get all nfts balance and infos
  useEffect(() => {
    if (userAddress && contractAddress) {
      const fetchNfts = async() => {
        setLoading(true);
        const nfts = await Promise.all(
          nftIds.map(async(tokenId) => {
            const balance: any = await publicClient.readContract({
              address: contractAddress,
              abi: contractAbi,
              functionName: 'balanceOf',
              args: [userAddress, tokenId]
            })
            if (balance > 0) {
              const metadata = await fetchNftMetadata(tokenId);
              return { tokenId, balance: balance.toString(), metadata };
            }
            return null;
          })
        );
        // Filter null values and group by fruit trait
        const filteredNfts = nfts.reduce((acc, nft) => {
          if (nft) {
            const fruitTrait = nft.metadata.attributes.find((attr: Attribute) => attr.trait_type.toLowerCase() === 'fruit');
            const fruitType = fruitTrait ? fruitTrait.value : 'Other';
            if (!acc[fruitType]) {
              acc[fruitType] = [];
            }
            acc[fruitType].push(nft);
          }
          return acc;
        }, {} as {[key: string]: nftItem[]});

        setNftItems(filteredNfts);
        setLoading(false);
      };
      fetchNfts();
    };
  }, [userAddress]);

  useEffect(() => {
    if (nftItems) {
      setActiveAnimation(true);
    }
  }, [nftItems]);

  /* Render */

  if (!isConnected) {
    return (
      <div className="flex justify-center items-center py-20 mt-10">
        <Button
          variant="contained"
          size="large"
          onClick={() => openConnectModal?.()}
          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Connect Wallet
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 mt-10 w-full">
        <div className="text-center">
          <CircularProgress/>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 mt-10">
      <div className="container mx-auto px-4">

        <CustomAlert showAlert={showAlert} alertType={alertType} alertMessage={alertMessage} setShowAlert={setShowAlert} />

        <Dialog
          open={openTransfer}
          PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget); // Create form object from current form.
              const formJson = Object.fromEntries((formData as any).entries()); // Convert form data to object.
              const targetAddress = formJson.targetAddress; // Extract data.

              if (currentTokenId === null) {
                setAlertType("error");
                setAlertMessage("No token selected for transfer.")
                setShowAlert(true);
                return;
              }

              if (!isAddress(targetAddress)) {
                setAlertType("error");
                setAlertMessage("Invalid Ethereum address.")
                setShowAlert(true);
                return;
              }

              transferNft(currentTokenId, targetAddress);
              toggleTransferModal();
            },
          }}
        >
          <DialogTitle>Transfer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Transfer your FruitMood NFT to another address
            </DialogContentText>
            <TextField 
              required
              type="text"
              name="targetAddress"
              fullWidth
              variant="standard"
            >
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggleTransferModal?.()}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>

        {Object.keys(nftItems).length === 0 ? (
          <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 mx-auto max-w-3xl flex flex-wrap mt-16">
            <p className="text-lg mb-2 w-full">You don't have any FruitMood NFTs yet.</p>
            <p className="text-lg mb-4 w-full">Start your collection now by minting your first fruit!</p>
            <Link href="/mint">
              <Button 
                variant="contained"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300"
              >
                Mint My First Fruit
              </Button>
            </Link>
          </div>
        ):(
          <div>
            <Grow in timeout={125}>
              <h2 className="text-3xl font-bold text-center mb-4">My FruitFable Collection</h2>
            </Grow>
            <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 mx-auto max-w-3xl">
              {Object.entries(nftItems).map(([fruitType, nfts]) => (
                <Grow in={activeAnimation} key={fruitType}>
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <h3 className="text-2xl font-bold mr-2">{fruitType}</h3>
                      <Button 
                        onClick={() => fusionNfts(fruitType)} 
                        variant="contained"
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300"
                      >
                        Fusion
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                      {nfts.map((nftItem, index) => (
                        <Card key={index} className="bg-white rounded-lg shadow-lg w-64">
                          <CardMedia
                            className="h-64 w-64 rounded-lg"
                            image={nftItem.metadata.image.replace('ipfs://', 'https://violet-impossible-earthworm-31.mypinata.cloud/ipfs/')}
                            title={nftItem.metadata.name}
                          />
                          <CardContent>
                            <h4 className="text-xl font-semibold mb-2">{nftItem.metadata.name}</h4>
                            <p className="text-gray-600 mb-4">{nftItem.metadata.description}</p>
                            <span className="text-lg font-bold">Balance: {nftItem.balance}</span>
                          </CardContent>
                          <CardActions>
                            <Button 
                              onClick={() => toggleTransferModal(nftItem.tokenId)}
                              size="small" 
                              variant="outlined"
                              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition duration-200 ease-in-out m-2"
                            >
                              Transfer
                            </Button>
                          </CardActions>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Grow>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default MyCollectionPage;