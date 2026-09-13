import { STARTER_DECK } from "./starterDeck";
import { DESIGNER_GENES_DECK } from "./designerGenesDeck";
import { Flashcard } from "../types";

export interface SciOlyEvent {
  id: string;
  name: string;
  division: string;
  description: string;
  color: string;
  available: boolean;
  starterDeck: Flashcard[];
}

export const SCIOLY_EVENTS: SciOlyEvent[] = [
  {
    id: "disease-detectives",
    name: "Disease Detectives",
    division: "Biology",
    description: "Epidemiology, statistics, outbreaks, surveillance, and prevention.",
    color: "#ef4444",
    available: true,
    starterDeck: STARTER_DECK,
  },
  {
    id: "designer-genes",
    name: "Designer Genes",
    division: "Biology · Division C",
    description: "Classic, evolutionary, and molecular genetics, biotechnology, and inheritance.",
    color: "#22c55e",
    available: true,
    starterDeck: DESIGNER_GENES_DECK,
  },
  {
    id: "anatomy-physiology",
    name: "Anatomy & Physiology",
    division: "Biology",
    description: "A future deck for body systems, structures, and physiology.",
    color: "#38bdf8",
    available: false,
    starterDeck: [],
  },
  {
    id: "cell-biology",
    name: "Cell Biology",
    division: "Biology",
    description: "A future deck for cell structure, signaling, and metabolism.",
    color: "#a78bfa",
    available: false,
    starterDeck: [],
  },
];

export function getEvent(eventId: string): SciOlyEvent {
  return SCIOLY_EVENTS.find((event) => event.id === eventId) ?? SCIOLY_EVENTS[0];
}
