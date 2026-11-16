export interface DialogueOption {
  text: string;
  nextDialogId?: string;
  action?: 'accept_quest' | 'open_activity_intro' | 'open_activity_3' | 'open_listening_speaking' | 'close' | 'give_hint';
}

export interface DialogueNode {
  id: string;
  speaker: string;
  speakerRole: string;
  avatarIcon: string;
  text: string;
  englishSnippet?: string;
  audioSimulated?: boolean;
  options: DialogueOption[];
}

export interface NPCData {
  id: string;
  name: string;
  role: string;
  avatarIcon: string;
  spriteImage?: string;
  x: number;
  y: number;
  color: string;
  dialogueTree: Record<string, DialogueNode>;
  initialDialogId: string;
}
