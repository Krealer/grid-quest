import { setKrealerFlag } from '../player_memory.js';

export const krealer1Dialogue = [
  {
    text: 'Doubt is a weapon. Who truly commands your thoughts?',
    options: [
      { label: 'Voices of authority', goto: 1 },
      { label: 'Only my conscience', goto: 2 }
    ]
  },
  {
    text: 'Authority requires trust. What will you sacrifice for certainty?',
    options: [
      {
        label: 'My freedom',
        goto: null,
        memoryFlag: 'k1_freedom',
        onChoose: () => {
          setKrealerFlag('flag_krealer1');
          setKrealerFlag('k1_freedom');
        }
      },
      {
        label: 'Nothing. I question everything.',
        goto: null,
        memoryFlag: 'k1_question_all',
        onChoose: () => {
          setKrealerFlag('flag_krealer1');
          setKrealerFlag('k1_question_all');
        }
      }
    ]
  },
  {
    text: 'If conscience guides you, how do you silence fear?',
    options: [
      {
        label: 'I embrace it',
        goto: null,
        memoryFlag: 'k1_embrace_fear',
        onChoose: () => {
          setKrealerFlag('flag_krealer1');
          setKrealerFlag('k1_embrace_fear');
        }
      },
      {
        label: 'I bury it deep',
        goto: null,
        memoryFlag: 'k1_bury_fear',
        onChoose: () => {
          setKrealerFlag('flag_krealer1');
          setKrealerFlag('k1_bury_fear');
        }
      }
    ]
  }
];

export const krealer2Dialogue = [
  {
    text: 'Trust is a mask you offer willingly. Whose face lies beneath?',
    options: [
      { label: 'Someone I hope to believe in', goto: 1 },
      { label: 'A stranger shaped by need', goto: 2 }
    ]
  },
  {
    text: 'Hope invites vulnerability. Do you guard or reveal your weakness?',
    options: [
      {
        label: 'Reveal to grow',
        goto: null,
        memoryFlag: 'k2_reveal',
        onChoose: () => {
          setKrealerFlag('flag_krealer2');
          setKrealerFlag('k2_reveal');
        }
      },
      {
        label: 'Guard it fiercely',
        goto: null,
        memoryFlag: 'k2_guard',
        onChoose: () => {
          setKrealerFlag('flag_krealer2');
          setKrealerFlag('k2_guard');
        }
      }
    ]
  },
  {
    text: 'Need can manipulate. Will you discard the mask?',
    options: [
      {
        label: "Yes, even if I'm exposed",
        goto: null,
        memoryFlag: 'k2_unmask',
        onChoose: () => {
          setKrealerFlag('flag_krealer2');
          setKrealerFlag('k2_unmask');
        }
      },
      {
        label: 'No, deception keeps me safe',
        goto: null,
        memoryFlag: 'k2_keepmask',
        onChoose: () => {
          setKrealerFlag('flag_krealer2');
          setKrealerFlag('k2_keepmask');
        }
      }
    ]
  }
];

export const krealer3Dialogue = [
  {
    text: 'Feeling or thinking— which do you bury deepest?',
    options: [
      { label: 'Feelings fade first', goto: 1 },
      { label: 'Thoughts must be hidden', goto: 2 }
    ]
  },
  {
    text: 'What emotion would you erase to survive?',
    options: [
      {
        label: 'Compassion',
        goto: null,
        memoryFlag: 'k3_erase_compassion',
        onChoose: () => {
          setKrealerFlag('flag_krealer3');
          setKrealerFlag('k3_erase_compassion');
        }
      },
      {
        label: 'Anger',
        goto: null,
        memoryFlag: 'k3_erase_anger',
        onChoose: () => {
          setKrealerFlag('flag_krealer3');
          setKrealerFlag('k3_erase_anger');
        }
      }
    ]
  },
  {
    text: 'Hidden thoughts breed secrets. Which truth do you fear?',
    options: [
      {
        label: 'My own weakness',
        goto: null,
        memoryFlag: 'k3_fear_weakness',
        onChoose: () => {
          setKrealerFlag('flag_krealer3');
          setKrealerFlag('k3_fear_weakness');
        }
      },
      {
        label: 'Others discovering me',
        goto: null,
        memoryFlag: 'k3_fear_discovery',
        onChoose: () => {
          setKrealerFlag('flag_krealer3');
          setKrealerFlag('k3_fear_discovery');
        }
      }
    ]
  }
];

export const krealer4Dialogue = [
  {
    text: 'Every step is watched. Do you see yourself reflected?',
    options: [
      { label: 'Yes, mirrors surround me', goto: 1 },
      { label: 'No, only shadows', goto: 2 }
    ]
  },
  {
    text: 'Which reflection feels most true?',
    options: [
      {
        label: 'The obedient persona',
        goto: null,
        memoryFlag: 'k4_obedient',
        onChoose: () => {
          setKrealerFlag('flag_krealer4');
          setKrealerFlag('k4_obedient');
        }
      },
      {
        label: 'The hidden self',
        goto: null,
        memoryFlag: 'k4_hidden',
        onChoose: () => {
          setKrealerFlag('flag_krealer4');
          setKrealerFlag('k4_hidden');
        }
      }
    ]
  },
  {
    text: 'In shadows, do you seek silence or revelation?',
    options: [
      {
        label: 'Silence brings safety',
        goto: null,
        memoryFlag: 'k4_silence_pref',
        onChoose: () => {
          setKrealerFlag('flag_krealer4');
          setKrealerFlag('k4_silence_pref');
        }
      },
      {
        label: 'Revelation despite risk',
        goto: null,
        memoryFlag: 'k4_reveal_pref',
        onChoose: () => {
          setKrealerFlag('flag_krealer4');
          setKrealerFlag('k4_reveal_pref');
        }
      }
    ]
  }
];

export const krealer5Dialogue = [
  {
    text: 'Predict your rival and the game is won before it begins.',
    options: [
      { label: 'Study them relentlessly', goto: 1 },
      { label: 'Let intuition guide me', goto: 2 }
    ]
  },
  {
    text: 'Knowledge is power. What knowledge do you crave?',
    options: [
      {
        label: 'Their fears',
        goto: null,
        memoryFlag: 'k5_seek_fears',
        onChoose: () => {
          setKrealerFlag('flag_krealer5');
          setKrealerFlag('k5_seek_fears');
        }
      },
      {
        label: 'Their dreams',
        goto: null,
        memoryFlag: 'k5_seek_dreams',
        onChoose: () => {
          setKrealerFlag('flag_krealer5');
          setKrealerFlag('k5_seek_dreams');
        }
      }
    ]
  },
  {
    text: 'Intuition whispers softly. Do you listen or command it?',
    options: [
      {
        label: 'I listen closely',
        goto: null,
        memoryFlag: 'k5_listen',
        onChoose: () => {
          setKrealerFlag('flag_krealer5');
          setKrealerFlag('k5_listen');
        }
      },
      {
        label: 'I bend it to my will',
        goto: null,
        memoryFlag: 'k5_command',
        onChoose: () => {
          setKrealerFlag('flag_krealer5');
          setKrealerFlag('k5_command');
        }
      }
    ]
  }
];

export const krealer6Dialogue = [
  {
    text: 'Memories fade. Which one would you erase first?',
    options: [
      { label: 'My deepest regret', goto: 1 },
      { label: 'None—they define me', goto: 2 }
    ]
  },
  {
    text: 'What fills the void left behind?',
    options: [
      {
        label: 'Hope for a fresh start',
        goto: null,
        memoryFlag: 'k6_fresh_start',
        onChoose: () => {
          setKrealerFlag('flag_krealer6');
          setKrealerFlag('k6_fresh_start');
        }
      },
      {
        label: 'Nothing. I welcome emptiness',
        goto: null,
        memoryFlag: 'k6_welcome_empty',
        onChoose: () => {
          setKrealerFlag('flag_krealer6');
          setKrealerFlag('k6_welcome_empty');
        }
      }
    ]
  },
  {
    text: 'If none vanish, how do you bear their weight?',
    options: [
      {
        label: 'By sharing them',
        goto: null,
        memoryFlag: 'k6_share_weight',
        onChoose: () => {
          setKrealerFlag('flag_krealer6');
          setKrealerFlag('k6_share_weight');
        }
      },
      {
        label: 'By locking them away',
        goto: null,
        memoryFlag: 'k6_lock_away',
        onChoose: () => {
          setKrealerFlag('flag_krealer6');
          setKrealerFlag('k6_lock_away');
        }
      }
    ]
  }
];

export const krealer7Dialogue = [
  {
    text: 'Consequences blur when apathy reigns. Does choice matter to you?',
    options: [
      { label: 'Yes, every choice echoes', goto: 1 },
      { label: 'Not when outcomes are the same', goto: 2 }
    ]
  },
  {
    text: 'Which echo lingers in you now?',
    options: [
      {
        label: 'Regret',
        goto: null,
        memoryFlag: 'k7_echo_regret',
        onChoose: () => {
          setKrealerFlag('flag_krealer7');
          setKrealerFlag('k7_echo_regret');
        }
      },
      {
        label: 'Pride',
        goto: null,
        memoryFlag: 'k7_echo_pride',
        onChoose: () => {
          setKrealerFlag('flag_krealer7');
          setKrealerFlag('k7_echo_pride');
        }
      }
    ]
  },
  {
    text: 'If outcomes match, will you choose for others or yourself?',
    options: [
      {
        label: 'For others',
        goto: null,
        memoryFlag: 'k7_choose_others',
        onChoose: () => {
          setKrealerFlag('flag_krealer7');
          setKrealerFlag('k7_choose_others');
        }
      },
      {
        label: 'For myself',
        goto: null,
        memoryFlag: 'k7_choose_self',
        onChoose: () => {
          setKrealerFlag('flag_krealer7');
          setKrealerFlag('k7_choose_self');
        }
      }
    ]
  }
];

export const krealer8Dialogue = [
  {
    text: 'You are the story you build. Which parts are real?',
    options: [
      { label: 'The victories I remember', goto: 1 },
      { label: 'The failures I hide', goto: 2 }
    ]
  },
  {
    text: 'Do victories define you or distract you?',
    options: [
      {
        label: 'They define me',
        goto: null,
        memoryFlag: 'k8_victory_define',
        onChoose: () => {
          setKrealerFlag('flag_krealer8');
          setKrealerFlag('k8_victory_define');
        }
      },
      {
        label: 'They distract me',
        goto: null,
        memoryFlag: 'k8_victory_distract',
        onChoose: () => {
          setKrealerFlag('flag_krealer8');
          setKrealerFlag('k8_victory_distract');
        }
      }
    ]
  },
  {
    text: 'Does hiding failure give strength or fragility?',
    options: [
      {
        label: 'Strength to continue',
        goto: null,
        memoryFlag: 'k8_failure_strength',
        onChoose: () => {
          setKrealerFlag('flag_krealer8');
          setKrealerFlag('k8_failure_strength');
        }
      },
      {
        label: 'Fragility behind a mask',
        goto: null,
        memoryFlag: 'k8_failure_fragile',
        onChoose: () => {
          setKrealerFlag('flag_krealer8');
          setKrealerFlag('k8_failure_fragile');
        }
      }
    ]
  }
];
