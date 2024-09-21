import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";

const SupportPage: React.FunctionComponent = (): JSX.Element => {

  interface Faq {
    question: string,
    answer: string
  }

  const questions: Faq[] = [
    {
      question: "What do you mean?",
      answer: "Oooohouuuuoooo"
    },
    {
      question: "Where is Bryan?",
      answer: "In the Kitchen!"
    },
    {
      question: "WHEN",
      answer: "WHEN"
    },
  ]

  return (
    <div className="min-h-screen">
      <div>
        <h2 className="text-2xl text-center">FAQ</h2>
        <div className="w-1/2 mx-auto">
          {questions.map((item, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`panel-${index}-content`}
                id={`panel-${index}-header`}
              >
                {item.question}
              </AccordionSummary>
              <AccordionDetails>
                {item.answer}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
      <div className="text-center flex flex-col w-full">
        <h2 className="text-2xl text-center">Support</h2>
        <TextField id="support-text" label="Outlined" variant="outlined" />
        <Button variant="contained">Send</Button>
      </div>
    </div>
  )
}

export default SupportPage;