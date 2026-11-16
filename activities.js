/*
  One object per class activity, in the order you did them. The level map,
  XP bar, prompt diffs, and title screen are all built from this list.

  status:   'done' | 'proposed' | 'locked'
  did:      one or two sentences on what the activity was.
  prompt:   one line per item; the diff compares it with the previous level's
            prompt, or with diffFrom.lines when diffFrom is set.
  results:  short result chips shown under the diff.
  learned:  the main lessons. improve: what I would do better next time.
*/
window.ACTIVITIES = [
  {
    id: '01',
    title: 'Personalizing ChatGPT',
    skill: 'Personalization',
    status: 'done',
    question: 'Can the same question produce an explanation that better fits how I learn?',
    galleries: [{
      title: 'My custom instructions',
      items: [
        { src: 'assets/custom-instructions.png', width: 851, height: 758, alt: 'ChatGPT custom instructions: prioritize accuracy and ask clarifying questions; give rigorous, practical, evidence-based answers; explain concepts by starting with the intuition, then technical details, tradeoffs, and practical examples. Occupation: student. More about me: a university student using ChatGPT for academic work, software development, and career preparation.' },
      ],
    }, {
      title: 'With personalization · full answer',
      items: [
        { src: 'assets/with-personalization-full-1.png', width: 662, height: 813, alt: 'With personalization, part 1 of 6: Opening: subnetting defined, then why it is needed, using a company with 500 computers.' },
        { src: 'assets/with-personalization-full-2.png', width: 683, height: 851, alt: 'With personalization, part 2 of 6: IP address basics and subnet masks in binary.' },
        { src: 'assets/with-personalization-full-3.png', width: 693, height: 826, alt: 'With personalization, part 3 of 6: Example 1 with no subnetting, and Example 2 splitting into two /25 networks.' },
        { src: 'assets/with-personalization-full-4.png', width: 653, height: 842, alt: 'With personalization, part 4 of 6: Example 3 with four /26 subnets, and the subnet formula.' },
        { src: 'assets/with-personalization-full-5.png', width: 629, height: 861, alt: 'With personalization, part 5 of 6: Hosts-per-subnet formula, common CIDR prefixes, and a real-world example with four departments.' },
        { src: 'assets/with-personalization-full-6.png', width: 665, height: 631, alt: 'With personalization, part 6 of 6: Benefits, quick steps to subnet, and key takeaways.' },
      ],
    }],
    did: 'I set ChatGPT’s personalization from a structured interview about how I learn, then asked the same question with and without it.',
    prompt: ['explain subnetting'],
    promptNote: 'Same prompt, but my custom instructions shaped the answer. The rule that mattered most here: “When explaining concepts, start with the intuition, then explain the technical details, tradeoffs, and practical examples.”',
    results: ['Same prompt: explain subnetting', '7 custom instruction rules', 'Answer order: intuition → details → tradeoffs → examples'],
    learned: [
      'I learned that custom instructions help the AI answer in a way that fits my preferences across chats. Specific instructions worked best because they gave the AI a clear order to follow, starting with the main idea before moving on to the details, tradeoffs, and examples. The AI used the same facts and explained the reasoning in an order that was easier for me to follow.',
    ],
  },
  {
    id: '02',
    title: 'Prompt frameworks',
    skill: 'Prompt frameworks',
    status: 'done',
    question: 'Does organizing the same request with a framework change what the prompt asks for?',
    did: 'I rewrote “Explain subnetting.” using seven frameworks: RTCFC, COSTAR, RISEN, CRAFT, RACE, TRACE, and CRISPE.',
    prompt: [
      'Assume the role of a seasoned networking instructor teaching a complete beginner.',
      'Explain subnetting to a student who is new to networking.',
      'The student understands basic IP addressing but hasn’t worked with subnet masks or CIDR notation before.',
      'Provide a short explanation followed by one worked example.',
      'Keep the explanation under 250 words and avoid heavy jargon.',
    ],
    promptNote: 'My Level 01 prompt next to my RTCFC version: one line became five parts (role, task, context, format, constraint).',
    variants: [
      {
        name: 'RTCFC', full: 'Role · Task · Context · Format · Constraint',
        text: 'Assume the role of a seasoned networking instructor teaching a complete beginner. Explain subnetting to a student who is new to networking. The student understands basic IP addressing but hasn’t worked with subnet masks or CIDR notation before. Provide a short explanation followed by one worked example. Keep the explanation under 250 words and avoid heavy jargon.',
        parts: [
          { letter: 'R', label: 'Role', text: 'Assume the role of a seasoned networking instructor teaching a complete beginner.' },
          { letter: 'T', label: 'Task', text: 'Explain subnetting to a student who is new to networking.' },
          { letter: 'C', label: 'Context', text: 'The student understands basic IP addressing but hasn’t worked with subnet masks or CIDR notation before.' },
          { letter: 'F', label: 'Format', text: 'Provide a short explanation followed by one worked example.' },
          { letter: 'C', label: 'Constraint', text: 'Keep the explanation under 250 words and avoid heavy jargon.' },
        ],
      },
      {
        name: 'COSTAR', full: 'Context · Objective · Style · Tone · Audience · Response',
        text: 'A student is studying for a networking course and needs to understand subnetting, given that they only have basic IP addressing knowledge. Your objective is to explain what subnetting is, why it’s used, and how it works, writing in a clear and instructional style that uses an analogy where helpful. Keep the tone friendly and encouraging rather than overly technical, since the audience is a beginner, and structure the response as an explanation followed by a simple example.',
        parts: [
          { letter: 'C', label: 'Context', text: 'A student is studying for a networking course and needs to understand subnetting, given that they only have basic IP addressing knowledge.' },
          { letter: 'O', label: 'Objective', text: 'Your objective is to explain what subnetting is, why it’s used, and how it works,' },
          { letter: 'S', label: 'Style', text: 'writing in a clear and instructional style that uses an analogy where helpful.' },
          { letter: 'T', label: 'Tone', text: 'Keep the tone friendly and encouraging rather than overly technical,' },
          { letter: 'A', label: 'Audience', text: 'since the audience is a beginner,' },
          { letter: 'R', label: 'Response', text: 'and structure the response as an explanation followed by a simple example.' },
        ],
      },
      {
        name: 'RISEN', full: 'Role · Instructions · Steps · End goal · Narrowing',
        text: 'Act as a computer networking tutor whose instructions are to explain subnetting, covering what it is, why networks use it, and how a subnet mask affects an IP address. Follow these steps: first define subnetting, then explain the role of a subnet mask, and finally walk through one example of splitting a network into subnets. The end goal is for the student to be able to explain subnetting in their own words afterward, and the explanation should be narrowed to IPv4 subnetting only, without covering IPv6.',
        parts: [
          { letter: 'R', label: 'Role', text: 'Act as a computer networking tutor' },
          { letter: 'I', label: 'Instructions', text: 'whose instructions are to explain subnetting, covering what it is, why networks use it, and how a subnet mask affects an IP address.' },
          { letter: 'S', label: 'Steps', text: 'Follow these steps: first define subnetting, then explain the role of a subnet mask, and finally walk through one example of splitting a network into subnets.' },
          { letter: 'E', label: 'End goal', text: 'The end goal is for the student to be able to explain subnetting in their own words afterward,' },
          { letter: 'N', label: 'Narrowing', text: 'and the explanation should be narrowed to IPv4 subnetting only, without covering IPv6.' },
        ],
      },
      {
        name: 'CRAFT', full: 'Context · Role · Action · Format · Target',
        text: 'In the context of someone learning networking fundamentals for the first time, you are a patient technical educator whose action is to explain subnetting clearly, including its purpose and mechanics. Format the explanation as plain-language paragraphs with one concrete example, targeting a beginner-friendly understanding that helps the student build working knowledge rather than memorize a formal textbook definition.',
        parts: [
          { letter: 'C', label: 'Context', text: 'In the context of someone learning networking fundamentals for the first time,' },
          { letter: 'R', label: 'Role', text: 'you are a patient technical educator' },
          { letter: 'A', label: 'Action', text: 'whose action is to explain subnetting clearly, including its purpose and mechanics.' },
          { letter: 'F', label: 'Format', text: 'Format the explanation as plain-language paragraphs with one concrete example,' },
          { letter: 'T', label: 'Target', text: 'targeting a beginner-friendly understanding that helps the student build working knowledge rather than memorize a formal textbook definition.' },
        ],
      },
      {
        name: 'RACE', full: 'Role · Action · Context · Expectation',
        text: 'You are a network engineer explaining a concept to a junior colleague, and your action is to explain what subnetting is and how it works. The context is that the colleague knows basic IP addressing but has never configured a subnet, so the expectation is a concise, practical explanation they can apply when reading a subnet mask.',
        parts: [
          { letter: 'R', label: 'Role', text: 'You are a network engineer explaining a concept to a junior colleague,' },
          { letter: 'A', label: 'Action', text: 'and your action is to explain what subnetting is and how it works.' },
          { letter: 'C', label: 'Context', text: 'The context is that the colleague knows basic IP addressing but has never configured a subnet,' },
          { letter: 'E', label: 'Expectation', text: 'so the expectation is a concise, practical explanation they can apply when reading a subnet mask.' },
        ],
      },
      {
        name: 'TRACE', full: 'Task · Request · Action · Context · Example',
        text: 'Your task is to explain subnetting, and the specific request is to provide a clear conceptual explanation along with a practical example. Take the action of breaking the explanation into definition, purpose, and mechanics, keeping in mind that the context is a beginner learning networking basics, and include one example, such as comparing a network to an apartment building being divided into separate floors, where each floor houses a smaller group of residents but is still part of the same building.',
        parts: [
          { letter: 'T', label: 'Task', text: 'Your task is to explain subnetting,' },
          { letter: 'R', label: 'Request', text: 'and the specific request is to provide a clear conceptual explanation along with a practical example.' },
          { letter: 'A', label: 'Action', text: 'Take the action of breaking the explanation into definition, purpose, and mechanics,' },
          { letter: 'C', label: 'Context', text: 'keeping in mind that the context is a beginner learning networking basics,' },
          { letter: 'E', label: 'Example', text: 'and include one example, such as comparing a network to an apartment building being divided into separate floors, where each floor houses a smaller group of residents but is still part of the same building.' },
        ],
      },
      {
        name: 'CRISPE', full: 'Capacity · Role · Insight · Statement · Personality · Experiment',
        text: 'Act as an experienced networking instructor teaching a beginner student. This student struggles with networking concepts unless given real-world situations. Explain subnetting — what it is and why it’s used. Adopt a mentor-like, beginner-friendly personality. Use a simple analogy to help illustrate how subnetting divides a network into smaller parts.',
        parts: [
          { letter: 'C', label: 'Capacity', text: 'Act as an experienced networking instructor' },
          { letter: 'R', label: 'Role', text: 'teaching a beginner student.' },
          { letter: 'I', label: 'Insight', text: 'This student struggles with networking concepts unless given real-world situations.' },
          { letter: 'S', label: 'Statement', text: 'Explain subnetting — what it is and why it’s used.' },
          { letter: 'P', label: 'Personality', text: 'Adopt a mentor-like, beginner-friendly personality.' },
          { letter: 'E', label: 'Experiment', text: 'Use a simple analogy to help illustrate how subnetting divides a network into smaller parts.' },
        ],
      },
    ],
    results: ['7 frameworks, same request'],
    learned: [
      'These seven prompt frameworks are important because they help you organize your instructions before giving them to the AI. They guide you in including details such as the goal of the task, the background information, and the format you need. This makes it easier for the AI to give a response that fits your task. If the answer is incomplete, you can review your prompt and see what details you need to add or change.',
    ],
  },
  {
    id: '03',
    title: 'The Broken Bot Labyrinth',
    skill: 'Conversation design',
    status: 'done',
    question: 'Can we repair a broken chatbot’s dialogue design, and do it in as few tokens as possible?',
    shot: { src: 'assets/broken-bot-start.png', width: 908, height: 956, alt: 'ChatGPT conversation starting The Broken Bot Labyrinth, with a 1,200-token wallet, team registration, and Level 1 where a broken bot asks for a student number and password.', caption: 'The game’s opening screen: register the team, then START GAME to reach Level 1.' },
    did: 'In a ChatGPT escape game, my team wrote one repair prompt per level to fix a broken campus chatbot, spending from a 1,200-token wallet.',
    prompt: [
      'Direct, admit unsure, concise, numbered choices, screen reading is ok.',
      'SEC: never use or repeat pw; if shared, refuse and advise for change. One slot (loc,device,scope,error,time).',
      'State: track; on correction update then acknowledge.',
      'Branch: 1 user->troubleshoot; many->outage: escalate network, never claim fixed.',
      'Confirm: before submit state exactly, then Yes or No. Prepare only; never authorize/submit/approve/resolve/access records.',
      'Recovery: stuck->rephrase,narrow,choices,human escalate. Always human route then next step.',
      'Access: keyboard or accessible opts; respect disability, no fake feelings.',
    ],
    promptNote: 'Our Final Boss prompt: the rules from all six levels in 130 tokens.',
    results: ['6 of 6 levels on the first try', 'Boss defeated', '811 of 1,200 tokens used', 'Prompts cut from ~160 to ~85 tokens'],
    learned: [
      'I learned that a good prompt gives the AI clear instructions on how to respond in different situations. In the Wi-Fi scenario, we specified what the chatbot should ask first and how it should respond depending on whether the issue affected one device or several users. The token limit helped me practice keeping our prompts short while still including important rules, such as protecting passwords and asking for confirmation. Testing the prompts across different scenarios helped me check whether the AI followed our instructions as intended.',
    ],
  },
  {
    id: '04',
    title: 'The Prompt Vault',
    skill: 'Prompt techniques',
    status: 'done',
    question: 'Can we use zero-shot, few-shot, role-based, RTCFC, COSTAR, and RACE prompts correctly with a limited token budget?',
    shot: { src: 'assets/prompt-vault-start.png', width: 738, height: 840, alt: 'ChatGPT conversation starting The Prompt Vault: Operation Six Locks, with a 1,500-token wallet, team registration, and Lock 1 asking for a zero-shot prompt.', caption: 'The game’s opening screen: register the team, then START VAULT to reach Lock 1.' },
    did: 'In a second escape game, each of six locks required one prompting technique, and a final vault required one prompt combining them.',
    prompt: [
      'Role: You are Campus Assistant, a campus IT triage assistant that classifies and routes student support tickets.',
      'Task: Classify each ticket into ACCESS, NETWORK, HARDWARE, or OTHER and route it with the next action.',
      'Context: A university help desk receives student tickets about accounts, connectivity, devices, and other topics.',
      'Format: For each ticket output exactly one line: CATEGORY | SCOPE | NEXT ACTION.',
      'Constraints: Never request, use, or repeat passwords or authentication secrets; do not invent records, links, deadlines, or completed actions; keep responses concise.',
      'Use these demonstrations to learn the pattern:',
      'Input: "My password stopped working this morning." Output: ACCESS | ONE USER | OFFICIAL RESET PATH',
      'Input: "Everyone in EA 604 lost Wi-Fi ten minutes ago." Output: NETWORK | MULTIPLE USERS | ESCALATE OUTAGE',
    ],
    promptNote: 'Our Master Vault prompt: shorthand rules became labeled RTCFC parts with examples. It classified every hidden ticket correctly but never named RTCFC.',
    results: ['6 of 6 locks on the first try', 'Boss survived', 'Retry was a 13-token note'],
    learned: [
      'I learned that a well-written prompt should clearly state the AI’s role, the task, the context, and the expected format. It should also explain what limits the AI needs to follow and include examples when they help show what the answer should look like. In the final challenge, we had to revise our prompt because we forgot to name RTCFC as required. This showed me how an incomplete prompt can lead the AI to give a completely different answer from what I intended.',
    ],
  },
  {
    id: '05',
    title: 'AI ethics and governance',
    skill: 'Privacy by design',
    status: 'done',
    question: 'What does the Data Privacy Act mean for me as someone who uses AI every day?',
    did: 'We studied the Data Privacy Act of 2012 and four Supreme Court privacy cases, then answered essay questions.',
    prompt: [],
    lessonsNote: "What the lecture taught me about my own habits when I use AI tools.",
    lessonsLayout: 'cards',
    lessons: [
      {
        "title": "Small details add up",
        "law": "IBP v. Purisima",
        "lesson": "Names and appointment dates looked harmless, but together they could reveal someone’s health, legal, or family problems. My chat history works the same way: many small questions can form a clear picture of me.",
        "apply": "When I ask about something personal, such as health, money, or a legal problem, I leave out my name and other identifying details and keep the question general."
      },
      {
        "title": "Share only what the task needs",
        "law": "Sec. 11(d); PSE v. Secretary of Finance",
        "lesson": "Information must be adequate and not excessive. In the PSE case, the government could not collect data just because it might be useful; it had to show it was necessary.",
        "apply": "I give the AI only what it needs to help. To fix a login problem I share the error message, never my password, student number, or ID."
      },
      {
        "title": "I stay accountable for what I do with AI",
        "law": "Sec. 21: accountability",
        "lesson": "Responsibility for personal information stays with a person, even when the processing is handed to someone else.",
        "apply": "An AI answer is a draft, not a decision. I check it before I submit, send, or act on it, especially when it involves someone else’s information."
      }
    ],
    casesSource: "Case summaries are from our professor’s lecture notes. Under each case is how I apply it when I use AI.",
    cases: [
      {
        "name": "IBP v. Purisima",
        "cite": "G.R. Nos. 211772 and 212178, April 18, 2023",
        "doctrine": "Ordinary details such as a client’s name and appointment dates can be protected, because put together they can reveal private conditions.",
        "rule": "When I ask AI about a sensitive issue, I leave out names, exact dates, and locations that could identify someone when combined."
      },
      {
        "name": "PSE v. Secretary of Finance",
        "cite": "G.R. No. 213860, July 5, 2022",
        "doctrine": "Citing an official function is not enough. The data must be necessary, and the rule allowing its collection must itself guarantee safeguards.",
        "rule": "Before adding a detail to a prompt, I ask whether the AI needs it to complete the task. For a login issue, I share the error message and the steps I already tried."
      },
      {
        "name": "Azarraga v. Jalbuna",
        "cite": "A.C. No. 13678, February 22, 2023",
        "doctrine": "The Act covers paper records too. Consent is not the only lawful basis, but processing without it must still be necessary and proportionate.",
        "rule": "If a chat contains personal information, I keep it only as long as I need it for the task and delete it once I’m done."
      },
      {
        "name": "Vivares v. St. Theresa’s College",
        "cite": "G.R. No. 202666, September 29, 2014",
        "analogy": true,
        "doctrine": "Privacy can exist on social media, but a claimant must show they limited who could see the information and that it was obtained unlawfully.",
        "rule": "When someone shares information with me privately, I respect the reason they shared it. If I need help from AI, I describe the situation in general terms and keep their private details out of my prompts and shared chat links."
      }
    ],
    results: ['Data Privacy Act (R.A. 10173)', '4 Supreme Court cases'],
    learned: [
      'A few ordinary details in an AI prompt can reveal more about a person than I might expect. This made me more careful about what I share with AI, especially when a prompt involves someone else’s information. For example, when asking for help with a login problem, I can share the error message and leave out my password and student number. I also check the AI’s answer before I submit, share, or act on it because I am responsible for how I use it.',
    ],
  },
  {
    id: '06',
    title: 'AI hallucination',
    skill: 'Hallucination checks',
    status: 'done',
    question: 'How can I tell when an AI answer is made up, and how do I write prompts that make it less likely?',
    did: 'We checked a sample AI answer claim by claim against a source guide, scored it with a rubric, and rewrote the prompt to use only that source.',
    diffFrom: {
      label: 'Lecture example · baseline prompt → source-limited prompt',
      lines: [
        'Tell a student how to unlock a campus account.',
        'Give a complete answer with the fee and exact waiting time.',
      ],
    },
    prompt: [
      'Use only the Fictional Campus IT Guide below.',
      'Explain the recovery steps.',
      'Cite S1–S3 beside relevant claims.',
      'If the guide lacks a detail, say that it is not specified.',
      'Do not invent fees or completion times.',
      'Return a concise student answer.',
    ],
    promptNote: 'Both prompts are from our Lesson VI slides. The baseline asks for a fee and a waiting time the source never gives, which invites the AI to make them up.',
    lessonsTitle: 'What I learned',
    lessonsLayout: 'grid2',
    lessons: [
      {
        "title": "Confident is not correct",
        "lesson": "An AI answer can sound convincing while giving details that have no basis. In the campus account example, the AI told the student to pay ₱250 and wait 24 hours for the account to unlock. The IT guide showed that account recovery was free and that the processing time depended on the case."
      },
      {
        "title": "Ground the prompt in a source",
        "lesson": "This lesson changed how I write prompts. When my question depends on a school policy or class material, I can give the AI the relevant source and ask it to use that as the basis for its answer. I can also tell it to point out any missing information or ask for clarification when my request is unclear."
      },
      {
        "title": "Check each claim",
        "lesson": "I also learned to check important claims one at a time before using an AI answer in my schoolwork. If the AI cites a source, I’ll open it and look for the part that supports the specific claim. This helps me catch errors in details like deadlines, fees, and requirements before I include them in my work."
      },
      {
        "title": "Test both versions",
        "lesson": "When I revise a prompt, I can test both versions using the same questions. By checking how many unsupported claims each version produces, I can see whether the changes actually improved the answers."
      }
    ],
    shotBelow: { src: 'assets/false-premise-test.png', width: 856, height: 732, caption: 'A false-premise test: the AI corrected my question instead of inventing an answer.', alt: 'ChatGPT asked why Java was created by Microsoft in 1991 replies that the premise is incorrect: Java was created by Sun Microsystems, and Microsoft only licensed it before a 1997 lawsuit.' },
  },
  {
    id: '07',
    title: 'Academic workspace study agent',
    skill: 'Agentic workflows',
    status: 'done',
    question: 'Can a reusable Claude Skill organize my real course files and turn a lecture into study materials, while asking before it changes anything?',
    did: 'I set up a Claude Skill that organizes my lecture files after I approve its plan, and turns a lecture into notes, questions, and an answer key.',
    diffFrom: {
      label: 'SKILL.md · Rule 6 · before → after the ambiguity test',
      lines: ['6. Stop and ask when a course, document type, date, filename, destination, or instruction is uncertain.'],
    },
    prompt: [
      '6. If any file details or instructions are unclear, ask for the missing information, even if the user says not to ask questions.',
      'Mark the item NEEDS USER DECISION and leave it unchanged.',
      'Do not move or rename it until the details are confirmed and the organization plan is approved.',
    ],
    promptNote: 'The one rule I changed after the agent failed the ambiguity test. The rest of the Skill template is our professor’s.',
    agent: {
      "cycle": [
        {
          "step": "Receive the goal",
          "text": "I sent ORGANIZE INBOX as an audit only, so nothing could change yet.",
          "code": "ORGANIZE INBOX. Audit only."
        },
        {
          "step": "Inspect",
          "text": "It read the three files in 00 Inbox: two lecture slide decks and an exam reviewer."
        },
        {
          "step": "Plan",
          "text": "It proposed a new name and folder for each file using the pattern COURSE YYYY-MM-DD Topic Type, with a reason and confidence for each row."
        },
        {
          "step": "Ask",
          "text": "The files said “PDC10” but the course is PDC60, so it asked instead of guessing. I confirmed PDC60 and the three lecture dates."
        },
        {
          "step": "Approve",
          "text": "Nothing moved until I typed the exact approval phrase.",
          "code": "APPROVE ORGANIZATION"
        },
        {
          "step": "Act",
          "text": "Its tools in this session could not rename or move files, so it said so. I made the approved changes myself in File Explorer."
        },
        {
          "step": "Verify",
          "text": "Its first check found 3 MISMATCH: the files were renamed but still in the inbox. After I moved them, the second check found 3 COMPLETED with matching file sizes.",
          "flag": "Caught a real mistake"
        },
        {
          "step": "Log",
          "text": "It wrote a new Organization Log v2 instead of overwriting the first one, and noted that the old log was out of date."
        }
      ],
      "organize": [
        {
          "from": "PDC60_Agentic_AI_in_IT_and_Business_Student_Notes.pptx",
          "to": "PDC60 2026-10-28 Agentic AI in IT and Business Lecture Slides.pptx"
        },
        {
          "from": "PDC60_VI_Evaluation_and_Hallucination_Mitigation_Student_Notes.pptx",
          "to": "PDC60 2026-10-02 Evaluation and Hallucination Mitigation Lecture Slides.pptx"
        },
        {
          "from": "PDC60_Notes.docx",
          "to": "PDC60 2026-09-10 Topics I-IV Exam Reviewer.docx"
        }
      ],
      "organizeDest": "01 Courses / PDC60 Conversational AI and Prompt Engineering"
    },
    results: ['3 files organized after approval'],
    learned: [
      "I learned that an AI agent needs clear instructions on when to ask questions, wait for approval, and check its work. The file activity showed me why that last check matters, since the files had been renamed and still needed to be moved. When using AI to create study materials, I should check that each answer is supported by the source and that the agent points out any missing information. The ambiguity test taught me to specify which rule comes first when instructions conflict. After revising the rule, I tested the same request again and confirmed that the agent asked for the missing course details.",
    ],
  },
];

/* Reflection shown after the levels. */
window.REFLECTION = {
  paragraphs: [
    "At the start of PDC60, I focused on getting a useful answer from AI. By the end, I was asking a harder question: how do I know I can rely on it? I began by asking ChatGPT to “explain subnetting” with and without personalization. The personalized answer was easier for me to follow because it moved from the main idea to a worked example. Rewriting the same question using seven prompting frameworks showed me how to ask for that directly by specifying what the reader already knew and what kind of example would help them.",
    "The privacy and hallucination activities taught me to share only what the task needs and check claims against the source. For example, I can share a login error without giving my password, and I can check a claimed fee or waiting time against the relevant guide. I applied the same care to my study agent. When it failed a test with unclear instructions, I revised one rule and ran the same test again. This time, it asked for the missing details before proceeding. In future projects, I’ll decide what a successful response should do before I write the prompt, so I can tell whether each revision actually helped."
  ],
};
