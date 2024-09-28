
'use client';

import { useState, useEffect } from "react";
import { publicClient } from "../constants/client";
import { useAccount } from "wagmi";

// UI components
import { Button, TextField } from "@mui/material";
import { Card, CardActions, CardContent, CardMedia } from "@mui/material";

// Constants
import { contractAddress, contractAbi, nftIds } from "../constants/fruitfablenft";

const MyCollectionPage: React.FunctionComponent = (): JSX.Element => {

  interface nftItem {
    balance: string,
    metadata: {
      name: string,
      description: string,
      image: string,
      attributes: Array<{ trait_type: string; value: string }>
    },
    tokenId: number
  }

  const [nftItems, setNftItems] = useState<nftItem[]|null>([]);
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
        // Filter null values
        const filteredNfts = nfts.filter(nft => nft !== null) as nftItem[];
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
        {nftItems && nftItems.map((nftItem, index) => (
          <Card key={index} sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 275 }}
              image={nftItem.metadata.image.replace('ipfs://', 'https://violet-impossible-earthworm-31.mypinata.cloud/ipfs/')}
              title={nftItem.metadata.name}
            />
            <CardContent>
                <h2 className="text-2xl">{nftItem.metadata.name}</h2>
                <p>{nftItem.metadata.description}</p>
            </CardContent>
            <CardActions>
              <Button size="small">Transfer</Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MyCollectionPage;