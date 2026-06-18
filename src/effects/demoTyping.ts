// Demo typewriter / filler-detection / snippet / tone-picker / speak-morph
// animations — ported from the static site's demo-typing.js. Operates on the
// rendered DOM (class hooks match the JSX). initDemos() returns a cleanup.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const speechSegments = [
  { text: 'so um', filler: true },
  { text: ', can you move the standup to nine - ' },
  { text: 'no, wait', filler: true },
  { text: ', nine thirty, and ' },
  { text: 'uh', filler: true },
  { text: ', ask Priya to share the doc before' },
];

const outputText = 'Can we move the standup to 9:30? Priya, please share the doc beforehand.';

const snippetItems = [
  {
    prefix:
      "Thanks for stopping by, I won't be home for a while but you can just send everything to my ",
    trigger: 'address',
    expansion: '123 Maple Street, Apt 4B',
  },
  {
    prefix: "Let's find a time that works. You can grab any open slot on my ",
    trigger: 'calendar link',
    expansion: 'calendar: pocketvoice.com/cal/ajay',
  },
  {
    prefix: 'If you want the full context before we talk, I dropped the notes in the ',
    trigger: 'project brief',
    expansion: 'Q3 launch brief: docs.pocketvoice.com/q3-launch',
  },
  {
    prefix: 'For billing, send the receipt to our shared ',
    trigger: 'invoice inbox',
    expansion: 'invoices@pocketvoice.com',
  },
];

const loopPause = 2000;

const toneItems = [
  {
    label: 'Neutral',
    src: '/assets/tone-neutral.svg',
    message:
      'Yes, I can review it. Please send it over by tomorrow morning so I have time before the deadline.',
  },
  {
    label: 'Professional',
    src: '/assets/tone-briefcase.svg',
    message:
      'Happy to review it. Could you send it across by tomorrow morning? That gives me enough time to go through it properly before the deadline.',
  },
  {
    label: 'Friendly',
    src: '/assets/tone-smile.svg',
    message:
      "Yeah, of course! Send it my way by tomorrow morning and I'll have plenty of time to look it over before the deadline.",
  },
  {
    label: 'Concise',
    src: '/assets/tone-shrink.svg',
    message: 'Yes. Send it by tomorrow morning.',
  },
  {
    label: 'Custom',
    src: '/assets/tone-code.svg',
    message:
      'Yo for sure, just shoot it over by tomorrow morning and I got you before the deadline.',
  },
];

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function appendCaret(target: Element) {
  const caret = document.createElement('span');
  caret.className = 'caret';
  caret.textContent = '|';
  target.appendChild(caret);
  return caret;
}

function delayFor(character: string, speed: number) {
  if (character === ' ') return speed * 0.45;
  if (/[,.?]/.test(character)) return speed * 2.25;
  return speed + Math.random() * speed * 0.28;
}

async function typeIntoTextNode(textNode: Text, text: string, speed: number) {
  for (const character of text) {
    textNode.data += character;
    await wait(delayFor(character, speed));
  }
}

async function typeTextBefore(target: Element, beforeNode: Node, text: string, speed: number) {
  const textNode = document.createTextNode('');
  target.insertBefore(textNode, beforeNode);
  await typeIntoTextNode(textNode, text, speed);
  return textNode;
}

async function typeFiller(target: Element, beforeNode: Node, text: string, speed: number) {
  const filler = document.createElement('span');
  filler.className = 'detected-filler';
  const textNode = document.createTextNode('');
  filler.appendChild(textNode);
  target.insertBefore(filler, beforeNode);

  await typeIntoTextNode(textNode, text, speed);
  animateFillerRecognition(filler);
}

async function animateFillerRecognition(filler: Element) {
  await wait(130);
  filler.classList.add('is-morphing');
  await wait(760);
  filler.classList.add('is-muted');
}

async function typeSegments(target: Element, segments: typeof speechSegments, speed = 30) {
  const caret = appendCaret(target);
  for (const segment of segments) {
    if ((segment as any).filler) {
      await typeFiller(target, caret, segment.text, speed);
    } else {
      await typeTextBefore(target, caret, segment.text, speed);
    }
  }
  caret.remove();
}

async function typePlainText(target: Element, text: string, speed = 28) {
  const caret = appendCaret(target);
  await typeTextBefore(target, caret, text, speed);
  return caret;
}

async function pasteOutput(target: Element, text: string) {
  const caret = appendCaret(target);
  const pasted = document.createElement('span');
  pasted.className = 'paste-text';
  for (const token of text.split(/(\s+)/)) {
    if (!token) continue;
    if (/^\s+$/.test(token)) {
      pasted.appendChild(document.createTextNode(token));
      continue;
    }

    const word = document.createElement('span');
    word.className = 'cloud-word';
    for (const character of token) {
      const particle = document.createElement('span');
      particle.className = 'cloud-letter';
      particle.textContent = character;
      particle.style.setProperty('--x', `${(Math.random() - 0.5) * 18}px`);
      particle.style.setProperty('--y', `${(Math.random() - 0.5) * 16}px`);
      particle.style.setProperty('--d', `${Math.random() * 42}ms`);
      word.appendChild(particle);
    }
    pasted.appendChild(word);
  }
  target.insertBefore(pasted, caret);
  await wait(30);
  target.classList.add('is-pasting');
  pasted.classList.add('is-visible');
  await wait(300);
  target.classList.remove('is-pasting');
  return caret;
}

function setStaticTextWithCaret(target: Element, text: string) {
  target.textContent = text;
  appendCaret(target);
}

function wrapToneIndex(index: number) {
  return (index + toneItems.length) % toneItems.length;
}

function createToneImage(item: (typeof toneItems)[number]) {
  const image = document.createElement('img');
  image.src = item.src;
  image.alt = '';
  return image;
}

function toneWindow(activeIndex: number) {
  return [-2, -1, 0, 1, 2].map((offset) => toneItems[wrapToneIndex(activeIndex + offset)]);
}

function setToneSlot(slot: Element, item: (typeof toneItems)[number]) {
  slot.replaceChildren(createToneImage(item));
}

let snippetIndex = 0;

function setToneMessage(target: Element | null, item: (typeof toneItems)[number]) {
  if (!target) return;
  target.textContent = item.message;
  appendCaret(target);
}

async function typeToneMessage(
  target: Element | null,
  item: (typeof toneItems)[number],
  token: { cancelled: boolean },
) {
  if (!target) return;

  target.textContent = '';
  const caret = appendCaret(target);
  const textNode = document.createTextNode('');
  target.insertBefore(textNode, caret);

  for (const character of item.message) {
    if (token.cancelled) return;
    textNode.data += character;
    await wait(delayFor(character, 12));
  }
}

export function initDemos(): () => void {
  const observers: IntersectionObserver[] = [];

  function runLoopWhenVisible(
    element: Element | null,
    animation: (once: boolean) => Promise<void> | void,
  ) {
    if (!element) return;
    if (reduceMotion) {
      animation(true);
      return;
    }

    let isVisible = false;
    let isLooping = false;

    async function loop() {
      if (isLooping) return;
      isLooping = true;
      while (isVisible) {
        await animation(false);
        await wait(loopPause);
      }
      isLooping = false;
    }

    if (!('IntersectionObserver' in window)) {
      isVisible = true;
      loop();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) loop();
      },
      { threshold: 0.32 },
    );
    observer.observe(element);
    observers.push(observer);
  }

  async function animateMainDemo(options: { once?: boolean } = {}) {
    const speech = document.querySelector('.demo-speech');
    const output = document.querySelector('.demo-output');
    const frame = document.querySelector('.demo-frame');
    const micChip = document.querySelector('.mic-chip');

    if (!speech || !output) return;

    if (options.once || reduceMotion) {
      speech.textContent = speechSegments.map((segment) => segment.text).join('');
      setStaticTextWithCaret(output, outputText);
      micChip?.classList.remove('is-clicked', 'is-listening');
      return;
    }

    speech.textContent = '';
    output.textContent = '';
    micChip?.classList.remove('is-clicked', 'is-listening');
    speech.classList.add('is-typing');
    output.classList.add('is-waiting');

    await wait(180);
    micChip?.classList.add('is-clicked');
    await wait(160);
    micChip?.classList.remove('is-clicked');
    frame?.classList.add('is-listening');
    micChip?.classList.add('is-listening');
    await wait(420);
    await typeSegments(speech, speechSegments, 31);
    frame?.classList.remove('is-listening');
    micChip?.classList.remove('is-listening');

    speech.classList.remove('is-typing');
    output.classList.remove('is-waiting');

    await wait(260);
    await pasteOutput(output, outputText);
  }

  async function animateSnippetDemo(target: Element, options: { once?: boolean } = {}) {
    const snippet = snippetItems[snippetIndex % snippetItems.length];
    snippetIndex += 1;

    if (options.once || reduceMotion) {
      target.textContent = snippet.prefix;
      const mark = document.createElement('mark');
      mark.className = 'is-expanded';
      mark.textContent = snippet.expansion;
      target.appendChild(mark);
      appendCaret(target);
      return;
    }

    target.textContent = '';
    const caret = appendCaret(target);
    await typeTextBefore(target, caret, snippet.prefix, 24);

    const mark = document.createElement('mark');
    target.insertBefore(mark, caret);
    const markText = document.createTextNode('');
    mark.appendChild(markText);
    await typeIntoTextNode(markText, snippet.trigger, 32);

    await wait(150);
    mark.classList.add('is-primed');
    await wait(170);
    mark.classList.add('is-boxed');
    await wait(360);

    mark.textContent = '';
    const expansion = document.createElement('span');
    expansion.className = 'snippet-expanded-text';
    expansion.textContent = snippet.expansion;
    mark.appendChild(expansion);
    mark.classList.add('is-expanded');
    await wait(760);
    mark.classList.add('is-unwrapping');
    await wait(520);
    mark.classList.add('is-final');
  }

  async function animateSpeedPair(group: Element, options: { once?: boolean } = {}) {
    const cards = [...group.querySelectorAll<HTMLElement>('.js-speed-demo')];
    if (cards.length < 2) return;

    if (options.once || reduceMotion) {
      cards.forEach((card) => setStaticTextWithCaret(card, card.dataset.typeText || ''));
      return;
    }

    cards.forEach((card) => {
      card.textContent = '';
    });

    await Promise.all(
      cards.map((card) =>
        typePlainText(card, card.dataset.typeText || '', Number(card.dataset.typeSpeed || 28)),
      ),
    );
  }

  function startTonePickerCycle() {
    const picker = document.querySelector('.tone-picker');
    if (!picker) return;

    const slots = [...picker.querySelectorAll('.tone-icon')];
    const label = picker.querySelector('.tone-active strong');
    const message = document.querySelector('.js-tone-message');
    if (slots.length !== 5 || !label) return;

    let activeIndex = 2;
    let isVisible = false;
    let isCycling = false;
    let messageToken = { cancelled: false };

    function render(index: number) {
      toneWindow(index).forEach((item, slotIndex) => setToneSlot(slots[slotIndex], item));
      label!.textContent = toneItems[index].label;
    }

    function animateMessage(index: number) {
      messageToken.cancelled = true;
      messageToken = { cancelled: false };
      return typeToneMessage(message, toneItems[index], messageToken);
    }

    async function cycleOnce() {
      const nextIndex = wrapToneIndex(activeIndex + 1);
      const currentItems = toneWindow(activeIndex);
      const nextItems = toneWindow(nextIndex);

      slots.forEach((slot, slotIndex) => {
        const outgoing = document.createElement('span');
        outgoing.className = 'tone-symbol tone-symbol--out';
        outgoing.appendChild(createToneImage(currentItems[slotIndex]));

        const incoming = document.createElement('span');
        incoming.className = 'tone-symbol tone-symbol--in';
        incoming.appendChild(createToneImage(nextItems[slotIndex]));

        slot.replaceChildren(outgoing, incoming);
      });

      picker!.classList.add('is-sliding');
      let messageAnimation: Promise<void> | void = Promise.resolve();
      window.setTimeout(() => {
        label!.textContent = toneItems[nextIndex].label;
        messageAnimation = animateMessage(nextIndex);
      }, 260);

      await wait(560);
      activeIndex = nextIndex;
      picker!.classList.remove('is-sliding');
      render(activeIndex);
      await messageAnimation;
    }

    async function loop() {
      if (isCycling) return;
      isCycling = true;
      while (isVisible) {
        await wait(3000);
        if (isVisible) await cycleOnce();
      }
      isCycling = false;
    }

    render(activeIndex);
    setToneMessage(message, toneItems[activeIndex]);

    if (reduceMotion || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) loop();
      },
      { threshold: 0.52 },
    );
    observer.observe(picker);
    observers.push(observer);
  }

  function startSpeakMorph() {
    const word = document.querySelector('.speak-morph');
    const section = document.querySelector('#features');
    if (!word || !section || reduceMotion || !('IntersectionObserver' in window)) return;

    let timer: number | undefined;
    let isVisible = false;
    let isLooping = false;

    async function loopMorph() {
      if (isLooping) return;
      isLooping = true;
      while (isVisible) {
        word!.classList.add('is-wave');
        await wait(2000);
        word!.classList.remove('is-wave');
        await wait(2000);
      }
      isLooping = false;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        window.clearTimeout(timer);
        isVisible = entries[0].isIntersecting;
        if (!entries[0].isIntersecting) {
          word!.classList.remove('is-wave');
          return;
        }
        timer = window.setTimeout(loopMorph, 1200);
      },
      { threshold: 0.62 },
    );
    observer.observe(section);
    observers.push(observer);
  }

  function startDictionaryCycle() {
    const pill = document.querySelector('.js-dict-pill');
    const plus = document.querySelector('.word-plus');
    const stack = document.querySelector('.word-stack');
    if (!pill || !stack) return;

    const words = ['Kubernetes', 'Søren', 'GraphQL', 'onboarding', 'Zoë', 'Ajay'];
    let index = 0;
    let isVisible = false;
    let isLooping = false;

    function reset() {
      pill!.className = 'word-pill word-pill--ghost word-pill--tilt-right js-dict-pill';
      pill!.textContent = '';
    }

    async function cycleOnce() {
      reset();
      const word = words[index % words.length];
      index += 1;

      const caret = appendCaret(pill!);
      const textNode = document.createTextNode('');
      pill!.insertBefore(textNode, caret);
      for (const character of word) {
        if (!isVisible) return;
        textNode.data += character;
        await wait(delayFor(character, 60));
      }

      await wait(420);
      caret.remove();
      pill!.classList.add('is-added');
      plus?.classList.add('is-pulsing');
      await wait(280);
      plus?.classList.remove('is-pulsing');
      await wait(1200);
      pill!.classList.remove('is-added');
      await wait(280);
    }

    async function loop() {
      if (isLooping) return;
      isLooping = true;
      while (isVisible) {
        await cycleOnce();
        await wait(700);
      }
      isLooping = false;
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      pill.className = 'word-pill word-pill--tilt-right js-dict-pill';
      pill.textContent = 'Kubernetes';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) loop();
      },
      { threshold: 0.4 },
    );
    observer.observe(stack);
    observers.push(observer);
  }

  runLoopWhenVisible(document.querySelector('.demo-frame'), (once) => animateMainDemo({ once }));

  const snippetDemo = document.querySelector('.js-snippet-demo');
  runLoopWhenVisible(snippetDemo, (once) => animateSnippetDemo(snippetDemo!, { once }));

  document.querySelectorAll('.speed-compare').forEach((group) => {
    runLoopWhenVisible(group, (once) => animateSpeedPair(group, { once }));
  });

  startSpeakMorph();
  startTonePickerCycle();
  startDictionaryCycle();

  return () => {
    observers.forEach((o) => o.disconnect());
  };
}
