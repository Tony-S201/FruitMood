
'use client';

import React, { useState, useEffect } from "react";
import { publicClient, walletClient } from "../constants/client";
import { useAccount } from "wagmi";
import { type Hash, type TransactionReceipt, stringify } from "viem";

// UI components
import { Button, Snackbar, Alert, Grow, Card, CardActions, CardContent, CardMedia, useTheme, useMediaQuery } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from 'swiper/modules';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Constants
import { contractAddress, contractAbi, nftIds } from "../constants/fruitfablenft";
import { fruitIds } from "../constants/tokenIds";

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

const MyCollectionPage: React.FunctionComponent = (): JSX.Element => {

  /* State */
  const [nftItems, setNftItems] = useState<{[key: string]: nftItem[]}>({});
  const [hash, setHash] = useState<Hash>();
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [receipt, setReceipt] = useState<TransactionReceipt>();

  /* Responsive const */
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  /* Another const */
  const { address: userAddress, isConnected } = useAccount();

  const getSlidesPerView = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

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
  const fusionNfts = async (fruitType: string) => {
    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'mergeFruits',
        account: userAddress!,
        args: [fruitIds[fruitType.toLowerCase() as keyof typeof fruitIds]]
      })
      console.log(request)
      const hash = await walletClient.writeContract(request);
      setHash(hash);
    } catch(error) {
      if (error instanceof Error) {
        const revertReason = "You must collect all 5 emotion traits of the same fruit NFT to perform the merge.";
        if (error.message.includes(revertReason)) {
          setErrorMessage(revertReason);
          setShowError(true);
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  }

  /* useEffect Hook */

  useEffect(() => {
    (async () => {
      if (hash) {
        console.log('-- in use effect hash --')
        console.log(hash)
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log(receipt)
        setReceipt(receipt);
        console.log('-- end use effect hash --')
      }
    })
  }, [hash]);

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

  

  /* Render */

  const snackAlert: JSX.Element = (
    <React.Fragment>
      <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );

  if (!isConnected) {
    return <p>Please connect.</p>;
  }

  return (
    <div className="min-h-screen p-20">

      {receipt ? (
        <div>{stringify(receipt, null, 2)}</div>
      ): (<></>)}

      {snackAlert}

      {Object.entries(nftItems).map(([fruitType, nfts]) => (
        <div key={fruitType} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold">{fruitType}</h2>
            <Button onClick={() => fusionNfts(fruitType)} variant="contained">Fusion</Button>
          </div>
          <Swiper
            spaceBetween={50}
            slidesPerView={3}
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {nfts.map((nftItem, index) => (
              <SwiperSlide key={nftItem.tokenId}>
                <Grow in={true} timeout={(index + 1) * 1000}>
                  <Card sx={{ width: 345 }}>
                    <CardMedia
                      sx={{ height: 300 }}
                      image={nftItem.metadata.image.replace('ipfs://', 'https://violet-impossible-earthworm-31.mypinata.cloud/ipfs/')}
                      title={nftItem.metadata.name}
                    />
                    <CardContent>
                      <h3 className="text-xl font-semibold">{nftItem.metadata.name}</h3>
                      <p>{nftItem.metadata.description}</p>
                      <span>Balance: {nftItem.balance}</span>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Transfer</Button>
                    </CardActions>
                  </Card>
                </Grow>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}

    </div>
  )
}

export default MyCollectionPage;