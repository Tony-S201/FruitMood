import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const SupportPage: React.FunctionComponent = (): JSX.Element => {

  interface Faq {
    question: string,
    answer: string
  }

  const questions: Faq[] = [
    {
      question: "What is FruitFable?",
      answer: "FruitFable is an ERC1155 NFT project on the Arbitrum network where users can collect and combine fruit-themed NFTs with different emotions."
    },
    {
      question: "How many different NFTs are there in FruitFable collection?",
      answer: "There are 25 basic NFTs in the collection - 5 fruits (apple, lemon, orange, pineapple and strawberry) each with 5 emotions (happy, sad, angry, scared, shoked)."
    },
    {
      question: "How do I mint a FruitFable NFT?",
      answer: "To mint a FruitFable NFT, go to the mint page and you choose one of the five emotions and one of the five fruits. The NFT is then minted based on your selection."
    },
    {
      question: "What is the 'ultimate' fruit NFT?",
      answer: "The 'ultimate' fruit NFT is a special NFT that you can obtain by collecting all five emotions of a single fruit type and then fusing them together."
    },
    {
      question: "How do I fuse my NFTs to get the 'ultimate' fruit NFT?",
      answer: "Once you have collection all five emotions of a single fruit type, you can visite the collection page and use the fusion feature to combine them."
    },
    {
      question: "Can I trade my FruitFable NFTs?",
      answer: "Yes, FruitFable NFT are standard ERC1155 tokens, which means they can be traded on compatible NFT marketplaces on the Arbitrum network."
    },
    {
      question: "What blockchain is FruitFable built on?",
      answer: "FruitFable is built on the Arbitrum network, which is layer 2 scaling solution for Ethereum."
    },
    {
      question: "How can I view my FruitFable NFT collection?",
      answer: "You can view your FruitFable NFT collection on the dedicated collection page within the website."
    },
    {
      question: "Is there a limit to how many NFTs I can mint?",
      answer: "Currently, there is no limit to the number of NFTs you can mint. However, each minting operation will require a separate transaction."
    },
  ]

  return (
    <div className="min-h-screen">
      <div>
        <h2 className="text-2xl text-center">Frequently Asked Questions</h2>
        <div className="w-1/2 mx-auto">
          {questions.map((item, index) => (
            <Accordion key={index} className="mb-3">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`panel-${index}-content`}
                id={`panel-${index}-header`}
              >
                <span className="font-bold">{item.question}</span>
              </AccordionSummary>
              <AccordionDetails>
                {item.answer}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SupportPage;