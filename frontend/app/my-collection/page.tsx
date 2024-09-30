
'use client';

import { useState, useEffect } from "react";
import { publicClient, walletClient } from "../constants/client";
import { useAccount } from "wagmi";

// UI components
import { Button, TextField } from "@mui/material";
import { Card, CardActions, CardContent, CardMedia } from "@mui/material";

// Constants
import { contractAddress, contractAbi, nftIds } from "../constants/fruitfablenft";

const MyCollectionPage: React.FunctionComponent = (): JSX.Element => {

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

  const [nftItems, setNftItems] = useState<{[key: string]: nftItem[]}>({});
  const { address: userAddress, isConnected } = useAccount();

  // Fetch nft metadata from contract
  const fetchNftMetadata = async (tokenId: number) => {
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
  };

  // NFTs Fusion
  const fusionNfts = async () => {
    await walletClient.writeContract({

    })
  }

  // Get all nfts balance and infos
  useEffect(() => {
    if (userAddress && contractAddress) {
      const fetchNfts = async() => {
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
      };
      fetchNfts();
    };
  }, [userAddress]);

  if (!isConnected) {
    return <p>Please connect.</p>;
  }

  return (
    <div className="min-h-screen p-20">
      <div className="flex items-center justify-center gap-8">
        <TextField placeholder="Search..."></TextField>
        <Button variant="contained">Filter</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        {Object.entries(nftItems).map(([fruitType, nfts]) => (
          <div key={fruitType} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{fruitType}</h2>
            <div className="flex flex-wrap gap-4">
              {nfts.map((nftItem, index) => (
                <Card key={index} sx={{ maxWidth: 345 }}>
                  <CardMedia
                    sx={{ height: 275 }}
                    image={nftItem.metadata.image.replace('ipfs://', 'https://violet-impossible-earthworm-31.mypinata.cloud/ipfs/')}
                    title={nftItem.metadata.name}
                  />
                  <CardContent>
                    <h3 className="text-xl font-semibold">{nftItem.metadata.name}</h3>
                    <p>{nftItem.metadata.description}</p>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Transfer</Button>
                  </CardActions>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyCollectionPage;