import { Question } from "@/types";

export const MASTER_QUESTIONS: Question[] = [
  {
    id: "q1",
    category: "funny",
    text: "When you say 'I'm 5 minutes away', how often are you actually 5 minutes away?",
    options: ["Always", "Usually", "Sometimes", "Rarely", "Never 💀"],
    difficulty: 1,
    isFinal: false,
    order: 1,
  },
  {
    id: "q2",
    category: "funny",
    text: "When you say 'I'm going to sleep now', what are you ACTUALLY doing?",
    options: [
      "Actually sleeping",
      "Scrolling for 10 more minutes",
      "Scrolling for an hour",
      "Still awake at 3 AM",
      "I never intended to sleep",
    ],
    difficulty: 1,
    isFinal: false,
    order: 2,
  },
  {
    id: "q3",
    category: "funny",
    text: "How often do you say 'I didn't see your message' after actually seeing it?",
    options: ["Never", "Rarely", "Sometimes", "Often", "That's my signature move"],
    difficulty: 2,
    isFinal: false,
    order: 3,
  },
  {
    id: "q4",
    category: "suspicious",
    text: "Have you ever said 'I'm at home' when you were actually somewhere else?",
    options: ["Never", "Once or twice", "Sometimes", "Often", "All the time 💀"],
    difficulty: 2,
    isFinal: false,
    order: 4,
  },
  {
    id: "q5",
    category: "suspicious",
    text: "When you don't want to attend a plan, what's your most likely excuse?",
    options: [
      "I'm tired",
      "I have work",
      "Something came up",
      "My parents won't allow me",
      "I invent an entire story",
    ],
    difficulty: 2,
    isFinal: false,
    order: 5,
  },
  {
    id: "q6",
    category: "suspicious",
    text: "When someone asks 'Do you like my outfit?' and you hate it, what do you do?",
    options: [
      "Tell the truth",
      "Say 'It's okay'",
      "Say 'Interesting...'",
      "Say 'It looks amazing!'",
      "Avoid answering",
    ],
    difficulty: 3,
    isFinal: false,
    order: 6,
  },
  {
    id: "q7",
    category: "personal",
    text: "When you say 'I'm not angry', how often are you actually angry?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Literally every time"],
    difficulty: 3,
    isFinal: false,
    order: 7,
  },
  {
    id: "q8",
    category: "personal",
    text: "How often do you say 'I'm not jealous' while being VERY jealous?",
    options: ["Never", "Rarely", "Sometimes", "Often", "I will never admit it"],
    difficulty: 3,
    isFinal: false,
    order: 8,
  },
  {
    id: "q9",
    category: "personal",
    text: "When you say 'I only checked their Instagram once', how believable is that?",
    options: [
      "Completely true",
      "Probably true",
      "Maybe",
      "Definitely lying",
      "FBI-level investigation completed",
    ],
    difficulty: 4,
    isFinal: false,
    order: 9,
  },
  {
    id: "q10",
    category: "savage",
    text: "When you say 'I won't spend any more money today', what usually happens?",
    options: [
      "I actually stop",
      "One small purchase",
      "A few purchases",
      "Somehow I go shopping",
      "My bank account suffers",
    ],
    difficulty: 4,
    isFinal: false,
    order: 10,
  },
  {
    id: "q11",
    category: "savage",
    text: "When you say 'I'll do it later', when does it ACTUALLY happen?",
    options: ["Immediately", "Same day", "Next day", "Eventually", "It never happens"],
    difficulty: 4,
    isFinal: false,
    order: 11,
  },
  {
    id: "q12",
    category: "final_expose",
    text: "What's the lie you are MOST likely to tell?",
    options: [
      "\"I'm fine.\"",
      "\"I don't care.\"",
      "\"I'm not jealous.\"",
      "\"I'm over it.\"",
      "\"I'm not stalking them.\"",
      "\"I'm going to sleep.\"",
      "\"I'm 5 minutes away.\"",
      "\"I didn't tell anyone.\"",
    ],
    difficulty: 5,
    isFinal: true,
    order: 12,
  },
  {
    id: "q13",
    category: "suspicious",
    text: "When you say 'I'm listening', how much are you actually processing?",
    options: [
      "100% focused",
      "About 70%",
      "Just nodding along",
      "Thinking about food",
      "My brain is on airplane mode",
    ],
    difficulty: 2,
    isFinal: false,
    order: 13,
  },
  {
    id: "q14",
    category: "savage",
    text: "How often do you say 'I'm almost ready' before you've even started getting ready?",
    options: ["Never", "Rarely", "Sometimes", "Very often", "I haven't even gotten out of bed"],
    difficulty: 3,
    isFinal: false,
    order: 14,
  },
  {
    id: "q15",
    category: "funny",
    text: "When you say 'I don't care where we eat', what happens when they suggest a place?",
    options: [
      "I agree happily",
      "I secretly evaluate it",
      "I suggest 5 other places",
      "I veto it immediately",
      "Total chaos begins",
    ],
    difficulty: 2,
    isFinal: false,
    order: 15,
  },
];

// Helper to select questions according to desired count (10, 12, 15)
// Ensures the final question is always the Final Expose!
export function getQuestionsForCount(count: number = 12): Question[] {
  const finalQuestion = MASTER_QUESTIONS.find((q) => q.isFinal) || MASTER_QUESTIONS[11];
  const regularQuestions = MASTER_QUESTIONS.filter((q) => !q.isFinal);

  const neededRegularCount = Math.max(1, count - 1);
  const selectedRegular = regularQuestions.slice(0, neededRegularCount);

  const list = [...selectedRegular, finalQuestion];
  return list.map((q, idx) => ({
    ...q,
    order: idx + 1,
    isFinal: idx === list.length - 1,
  }));
}

export function getQuestionById(id: string): Question | undefined {
  return MASTER_QUESTIONS.find((q) => q.id === id);
}

// Convert question text from 2nd person (creator) to 3rd person (friend view)
export function formatQuestionForFriend(questionText: string, creatorName: string): string {
  const name = creatorName || "Your friend";
  return questionText
    .replace(/When you say/g, `When ${name} says`)
    .replace(/how often are you/g, `how often are they`)
    .replace(/what are you ACTUALLY doing/g, `what are they ACTUALLY doing`)
    .replace(/do you say/g, `do they say`)
    .replace(/Have you ever said/g, `Has ${name} ever said`)
    .replace(/were you actually/g, `were they actually`)
    .replace(/your most likely excuse/g, `their most likely excuse`)
    .replace(/what do you do/g, `what do they do`)
    .replace(/while being VERY jealous/g, `while being VERY jealous`)
    .replace(/how believable is that/g, `how believable is that`)
    .replace(/what usually happens/g, `what usually happens`)
    .replace(/when does it ACTUALLY happen/g, `when does it ACTUALLY happen`)
    .replace(/What's the lie you are MOST likely to tell\?/g, `What's the lie ${name} is MOST likely to tell?`);
}
