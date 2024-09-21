
'use client';

import { useState } from "react";

// UI components
import { Button, TextField } from "@mui/material";
import { Card, CardActions, CardContent, CardMedia } from "@mui/material";

const MyCollectionPage: React.FunctionComponent = (): JSX.Element => {

  interface nftItem {
    name: string,
    address: string,
    attributes: {}
  }

  const [nftItems, setNftItems] = useState<nftItem[]>([]);

  return (
    <div className="min-h-screen p-20">
      <div className="flex items-center justify-center gap-8">
        <TextField placeholder="Search..."></TextField>
        <Button variant="contained">Filter</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            sx={{ height: 140 }}
            image="image.jpg"
            title="happy apple"
          />
          <CardContent>
              <h2 className="text-2xl">Happy Apple</h2>
              <p>Here an happy apple</p>
          </CardContent>
          <CardActions>
            <Button size="small">Transfer</Button>
          </CardActions>
        </Card>
      </div>
    </div>
  )
}

export default MyCollectionPage;