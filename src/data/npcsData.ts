import { NPCData } from '../types/dialogue';
import { MODERN_ASSETS } from '../utils/modernAssets';

export const NPCS_DATA: Record<string, NPCData> = {
  john: {
    id: 'john',
    name: 'Mr. John',
    role: 'Tourist at Airport',
    avatarIcon: '🤠',
    spriteImage: MODERN_ASSETS.characters.alex,
    color: '#3b82f6',
    x: 290,
    y: 220, // Near the luggage claim / info display in the airport
    initialDialogId: 'start',
    dialogueTree: {
      start: {
        id: 'start',
        speaker: 'Mr. John',
        speakerRole: 'Tourist',
        avatarIcon: '🤠',
        text: 'Excuse me! I just arrived at the airport and I cannot find my luggage at baggage claim. Could you please help me find it?',
        englishSnippet: 'Excuse me! I lost my luggage. Could you help me find it?',
        audioSimulated: true,
        options: [
          {
            text: 'Yes, of course! I can help you! 🤝',
            nextDialogId: 'describe_bag',
            action: 'accept_quest'
          },
          {
            text: 'I am a bit busy right now.',
            action: 'close'
          }
        ]
      },
      describe_bag: {
        id: 'describe_bag',
        speaker: 'Mr. John',
        speakerRole: 'Tourist',
        avatarIcon: '🤠',
        text: 'Thank you! It is a blue backpack with a cross in the center. Please check the luggage carousel carefully.',
        englishSnippet: 'It is a blue backpack with a cross in the center.',
        audioSimulated: true,
        options: [
          {
            text: 'Understood! I will find the blue backpack with a cross. 🔍',
            action: 'close'
          }
        ]
      },
      waiting_for_bag: {
        id: 'waiting_for_bag',
        speaker: 'Mr. John',
        speakerRole: 'Tourist',
        avatarIcon: '🤠',
        text: 'Have you seen it? Remember: it is a BLUE backpack with a CROSS on the luggage carousel.',
        englishSnippet: 'Remember: it is a blue backpack with a cross.',
        audioSimulated: true,
        options: [
          {
            text: 'I am still searching on the conveyor belt... 🎒',
            action: 'close'
          }
        ]
      },
      bag_found: {
        id: 'bag_found',
        speaker: 'Mr. John',
        speakerRole: 'Tourist',
        avatarIcon: '😄',
        text: 'Awesome! You found my blue backpack with a cross! Thank you so much! My passport and notes were inside.',
        englishSnippet: 'You found my blue backpack with a cross! Thank you so much!',
        audioSimulated: true,
        options: [
          {
            text: 'You are welcome! Let\'s practice key words 🔤',
            nextDialogId: 'word_search_intro'
          }
        ]
      },
      word_search_intro: {
        id: 'word_search_intro',
        speaker: 'Mr. John',
        speakerRole: 'Tourist',
        avatarIcon: '😄',
        text: 'Before leaving the airport terminal, can you help me find the key words in this word search?',
        englishSnippet: 'Can you help me find the key words in this word search?',
        audioSimulated: true,
        options: [
          {
            text: 'Yes! Let\'s do the Word Search! 📝',
            action: 'open_activity_intro'
          }
        ]
      },
      word_search_done: {
        id: 'word_search_done',
        speaker: 'Mr. John',
        speakerRole: 'Tourist',
        avatarIcon: '😄',
        text: 'Great job with the vocabulary! Now let\'s connect family members, professions, and their workplaces.',
        englishSnippet: 'Let\'s connect family members, professions, and workplaces!',
        audioSimulated: true,
        options: [
          {
            text: 'Let\'s match the columns! 🔗',
            action: 'open_activity_3'
          }
        ]
      },
      matching_done: {
        id: 'matching_done',
        speaker: 'Mr. John',
        speakerRole: 'Tourist',
        avatarIcon: '😄',
        text: 'Outstanding! Now let\'s practice your oral pronunciation with the microphone in the Speaking Section.',
        englishSnippet: 'Now let\'s practice your pronunciation in the Speaking Section!',
        audioSimulated: true,
        options: [
          {
            text: 'Go to Speaking Section! 🎙️',
            action: 'open_listening_speaking'
          }
        ]
      }
    }
  },

  mateo: {
    id: 'mateo',
    name: 'Don Mateo',
    role: 'Tour Guide Supervisor',
    avatarIcon: '🧔🏽',
    spriteImage: MODERN_ASSETS.characters.sam,
    color: '#15803d',
    x: 80,
    y: 220,
    initialDialogId: 'start',
    dialogueTree: {
      start: {
        id: 'start',
        speaker: 'Don Mateo',
        speakerRole: 'Tour Guide Supervisor',
        avatarIcon: '🧔🏽',
        text: 'Welcome to the airport! A tourist has just arrived and needs help finding his luggage. Please talk to him in English.',
        englishSnippet: 'Welcome to the airport! Please assist the tourist.',
        audioSimulated: false,
        options: [
          {
            text: 'I will talk to him right away! 🫡',
            action: 'close'
          }
        ]
      },
      mateo_reward: {
        id: 'mateo_reward',
        speaker: 'Don Mateo',
        speakerRole: 'Tour Guide Supervisor',
        avatarIcon: '🧔🏽',
        text: 'Outstanding work! You successfully helped the tourist with his backpack, completed the word search, matched the occupations and passed the Speaking section. Here is your Golden Key!',
        englishSnippet: 'Outstanding work! You have earned the Golden Key!',
        audioSimulated: false,
        options: [
          {
            text: 'Claim Golden Key! 🗝️',
            action: 'close'
          }
        ]
      }
    }
  }
};
