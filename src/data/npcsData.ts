import { NPCData } from '../types/dialogue';

export const NPCS_DATA: Record<string, NPCData> = {
  john: {
    id: 'john',
    name: 'Mr. John Miller',
    role: 'Turista de California',
    avatarIcon: '🤠',
    color: '#3b82f6',
    x: 200,
    y: 120,
    initialDialogId: 'start',
    dialogueTree: {
      start: {
        id: 'start',
        speaker: 'Mr. John',
        speakerRole: 'Turista en apuros',
        avatarIcon: '🤠',
        text: 'Excuse me! ¡Hola! I am so worried... I lost my luggage somewhere around this beautiful square. ¿Podrías ayudarme a encontrarla?',
        englishSnippet: 'Excuse me! I lost my luggage. Could you help me find it?',
        audioSimulated: true,
        options: [
          {
            text: '¡Por supuesto! Yes, I can help you! 🤝',
            nextDialogId: 'describe_bag',
            action: 'accept_quest'
          },
          {
            text: 'I am a bit busy right now. (Luego vuelvo)',
            action: 'close'
          }
        ]
      },
      describe_bag: {
        id: 'describe_bag',
        speaker: 'Mr. John',
        speakerRole: 'Turista en apuros',
        avatarIcon: '🤠',
        text: 'Thank you! It is a blue backpack with a circle in the center. ¡Es una maleta azul con un círculo! Por favor búscala en los alrededores de la plaza.',
        englishSnippet: 'It is a blue backpack with a circle.',
        audioSimulated: true,
        options: [
          {
            text: '¡Entendido! I will search for the blue backpack with a circle. 🔍',
            action: 'close'
          }
        ]
      },
      waiting_for_bag: {
        id: 'waiting_for_bag',
        speaker: 'Mr. John',
        speakerRole: 'Turista en apuros',
        avatarIcon: '🤠',
        text: 'Have you seen it? Remember: it is a BLUE backpack with a CIRCLE. ¡No te rindas!',
        englishSnippet: 'Remember: it is a blue backpack with a circle.',
        audioSimulated: true,
        options: [
          {
            text: 'Sigo buscando por el pueblo... 🎒',
            action: 'close'
          }
        ]
      },
      bag_found: {
        id: 'bag_found',
        speaker: 'Mr. John',
        speakerRole: 'Turista agradecido',
        avatarIcon: '😄',
        text: '¡OMG, you found my blue backpack with a circle! ¡Muchísimas gracias! My passport and notes were inside.',
        englishSnippet: 'You found my blue backpack with a circle! Thank you so much!',
        audioSimulated: true,
        options: [
          {
            text: '¡De nada! Happy to help! 🎉',
            nextDialogId: 'word_search_intro'
          }
        ]
      },
      word_search_intro: {
        id: 'word_search_intro',
        speaker: 'Mr. John',
        speakerRole: 'Turista agradecido',
        avatarIcon: '📝',
        text: 'Estaba practicando español e inglés antes de perder mi maleta. ¿Podrías ayudarme a identificar las palabras clave en esta sopa de letras de mi libreta de viaje?',
        englishSnippet: 'Can you help me find the key words in this word search?',
        audioSimulated: true,
        options: [
          {
            text: '¡Claro! Let’s do the Word Search! 🔤',
            action: 'open_activity_intro'
          }
        ]
      },
      ask_for_help: {
        id: 'ask_for_help',
        speaker: 'Mr. John',
        speakerRole: 'Turista agradecido',
        avatarIcon: '🤔',
        text: '¡Increíble cómo encontraste las palabras en la libreta! Por cierto, aún necesito hacer trámites y almorzar en el pueblo... ¿Sabes quién me podría ayudar?',
        englishSnippet: 'Do you know who could help me in town?',
        options: [
          {
            text: '¡Sí! Mi familia trabaja en varios lugares de San Pedro. 🤝',
            nextDialogId: 'matching_intro_prompt'
          }
        ]
      },
      matching_intro_prompt: {
        id: 'matching_intro_prompt',
        speaker: 'Mr. John',
        speakerRole: 'Turista curioso',
        avatarIcon: '📝',
        text: '¡Genial! Déjame anotar las oraciones sobre tu tío, tu tía y tu primo, qué profesiones tienen y en qué lugares trabajan.',
        options: [
          {
            text: '¡Unir con líneas las oraciones! (Actividad 3) 🔗',
            action: 'open_activity_3'
          }
        ]
      },
      after_matching_john: {
        id: 'after_matching_john',
        speaker: 'Mr. John',
        speakerRole: 'Turista impresionado',
        avatarIcon: '🌟',
        text: '¡Qué gran familia tienes en San Pedro! Ahora solo nos falta practicar la pronunciación oral de la frase en inglés con el micrófono.',
        englishSnippet: 'Excuse me, I lost my blue backpack.',
        options: [
          {
            text: '¡Practicar pronunciación oral! (Actividad 4) 🎙️',
            action: 'open_listening_speaking'
          }
        ]
      },
      all_done_john: {
        id: 'all_done_john',
        speaker: 'Mr. John',
        speakerRole: 'Turista feliz',
        avatarIcon: '👑',
        text: 'You are an incredible guide! Has completado todas las actividades del Módulo 1. Don Mateo en el Centro de Información tiene la Llave Dorada para ti.',
        options: [
          {
            text: '¡Ir con Don Mateo por la Llave! 🗝️',
            action: 'close'
          }
        ]
      }
    }
  },
  mateo: {
    id: 'mateo',
    name: 'Don Mateo',
    role: 'Jefe del Centro de Información',
    avatarIcon: '🧔🏽',
    color: '#059669',
    x: 320,
    y: 80,
    initialDialogId: 'mateo_start',
    dialogueTree: {
      mateo_start: {
        id: 'mateo_start',
        speaker: 'Don Mateo',
        speakerRole: 'Guía Maestro',
        avatarIcon: '🧔🏽',
        text: '¡Bienvenido a San Pedro, joven guía! Los turistas vienen de todo el mundo y necesitan nuestra orientación. Escuché que un turista extranjero llamado John necesita apoyo.',
        options: [
          {
            text: 'I will do my best, Don Mateo! 🫡',
            action: 'close'
          }
        ]
      },
      mateo_reward: {
        id: 'mateo_reward',
        speaker: 'Don Mateo',
        speakerRole: 'Guía Maestro',
        avatarIcon: '🎖️',
        text: '¡Extraordinario trabajo con Mr. John! Has demostrado que dominas el vocabulario esencial de asistencia al viajero. Por tu gran desempeño en el Módulo 1, te hago entrega de la sagrada LLAVE DORADA del pueblo y tu CHULLO TRADICIONAL DE GUÍA.',
        options: [
          {
            text: '¡Recibir recompensas con honor! 🔑✨',
            action: 'close'
          }
        ]
      }
    }
  },
  rosa: {
    id: 'rosa',
    name: 'Doña Rosa',
    role: 'Maestra Tejedora Andina',
    avatarIcon: '👵🏽',
    color: '#d97706',
    x: 60,
    y: 190,
    initialDialogId: 'rosa_start',
    dialogueTree: {
      rosa_start: {
        id: 'rosa_start',
        speaker: 'Doña Rosa',
        speakerRole: 'Artesana Textil',
        avatarIcon: '👵🏽',
        text: 'Allillanchu (¡Hola!), joven. Qué alegría verte aprendiendo inglés. Recuerda que los colores en inglés van antes que el objeto: decimos "blue backpack", no "backpack blue". ¡Muchos éxitos!',
        options: [
          {
            text: '¡Gran consejo gramatical, Doña Rosa! Gracias. 🙏',
            action: 'close'
          }
        ]
      }
    }
  }
};
