(function () {
  'use strict';

  var levels = window.ACTIVITIES || [];
  var mapEl = document.getElementById('map-board');
  var hudEl = document.getElementById('map-hud');
  var panelEl = document.getElementById('level');
  if (!mapEl || !panelEl || !levels.length) return;

  var XP_PER_LEVEL = 200;
  var current = -1;

  /* ---------- tiny DOM helper ---------- */
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value == null || value === false) return;
        if (key === 'text') el.textContent = value;
        else if (key === 'class') el.className = value;
        else if (key.slice(0, 2) === 'on') el.addEventListener(key.slice(2), value);
        else el.setAttribute(key, value === true ? '' : value);
      });
    }
    [].concat(children || []).forEach(function (child) {
      if (child == null || child === false) return;
      el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return el;
  }

  var SVG_NS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (key) { el.setAttribute(key, attrs[key]); });
    return el;
  }

  function icon(name) {
    var paths = {
      star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
      lock: 'M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v9h-13z',
      flag: 'M6 21V4m0 1h11l-2.5 4L17 13H6',
      arrowL: 'M19 12H5m6-6-6 6 6 6',
      arrowR: 'M5 12h14m-6-6 6 6-6 6',
    };
    var svg = s('svg', { viewBox: '0 0 24 24', width: '20', height: '20', 'aria-hidden': 'true', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7', 'stroke-linejoin': 'round' });
    svg.appendChild(s('path', { d: paths[name] }));
    return svg;
  }

  function isOpen(level) { return level.status !== 'locked'; }

  /* ---------- line diff (LCS) ---------- */
  function diffLines(a, b) {
    var m = a.length, n = b.length, i, j;
    var t = [];
    for (i = 0; i <= m; i++) { t.push(new Array(n + 1).fill(0)); }
    for (i = m - 1; i >= 0; i--) {
      for (j = n - 1; j >= 0; j--) {
        t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
      }
    }
    var out = [];
    i = 0; j = 0;
    while (i < m && j < n) {
      if (a[i] === b[j]) { out.push({ type: 'same', text: a[i] }); i++; j++; }
      else if (t[i + 1][j] >= t[i][j + 1]) { out.push({ type: 'del', text: a[i++] }); }
      else { out.push({ type: 'add', text: b[j++] }); }
    }
    while (i < m) out.push({ type: 'del', text: a[i++] });
    while (j < n) out.push({ type: 'add', text: b[j++] });
    return out;
  }

  function previousWithPrompt(index) {
    for (var i = index - 1; i >= 0; i--) {
      if (isOpen(levels[i]) && levels[i].prompt && levels[i].prompt.length) return levels[i];
    }
    return null;
  }

  /* ---------- HUD: rank, XP, badges ---------- */
  function renderHud() {
    var done = levels.filter(function (l) { return l.status === 'done'; });
    var xp = done.length * XP_PER_LEVEL;
    var max = levels.length * XP_PER_LEVEL;
    hudEl.textContent = '';
    hudEl.appendChild(h('div', { class: 'hud-rank' }, [
      h('span', { class: 'hud-label', text: 'Prompt engineer' }),
      h('strong', { text: 'Lv ' + done.length }),
    ]));
    hudEl.appendChild(h('div', {
      class: 'xp-bar', role: 'progressbar', 'aria-label': 'Experience',
      'aria-valuemin': '0', 'aria-valuemax': String(max), 'aria-valuenow': String(xp),
    }, [h('span', { style: 'inline-size:' + (max ? (xp / max) * 100 : 0) + '%' })]));
    hudEl.appendChild(h('span', { class: 'xp-count', text: xp + ' / ' + max + ' XP' }));
    var badges = h('ul', { class: 'badge-row', 'aria-label': 'Skills unlocked' });
    done.forEach(function (l) {
      if (l.skill) badges.appendChild(h('li', { class: 'skill-badge' }, [icon('star'), l.skill]));
    });
    if (!badges.children.length) badges.appendChild(h('li', { class: 'badge-empty', text: 'No skills unlocked yet' }));
    hudEl.appendChild(badges);
  }

  /* ---------- level map ---------- */
  function positions() {
    var n = levels.length;
    var step = n > 1 ? 1 / (n - 1) : 0;
    return levels.map(function (_, i) {
      var t = n > 1 ? i * step : 0.5;
      return { x: 9 + t * 82, y: i % 2 ? 30 : 68 };
    });
  }

  function segment(a, b) {
    var mx = (a.x + b.x) / 2;
    return 'M' + a.x + ' ' + a.y + 'C' + mx + ' ' + a.y + ' ' + mx + ' ' + b.y + ' ' + b.x + ' ' + b.y;
  }

  function renderMap() {
    var pts = positions();
    mapEl.textContent = '';

    var svg = s('svg', { class: 'trail', viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
    for (var i = 1; i < pts.length; i++) {
      var cleared = levels[i].status === 'done';
      svg.appendChild(s('path', {
        d: segment(pts[i - 1], pts[i]),
        class: cleared ? 'trail-cleared' : 'trail-ahead',
        'vector-effect': 'non-scaling-stroke',
      }));
    }
    mapEl.appendChild(svg);

    var list = h('ol', { class: 'level-nodes' });
    levels.forEach(function (level, index) {
      var state = level.status === 'done' ? 'done' : level.status === 'proposed' ? 'proposed' : 'locked';
      var stateText = { done: 'cleared', proposed: 'proposed experiment', locked: 'locked' }[state];
      var button = h('button', {
        type: 'button',
        class: 'level-node is-' + state,
        'data-index': String(index),
        'aria-label': 'Level ' + level.id + ': ' + level.title + ', ' + stateText,
        onclick: function () { openLevel(index, true); },
      }, [
        h('span', { class: 'node-disc' }, [
          h('span', { class: 'node-id', text: level.id }),
          icon(state === 'done' ? 'star' : state === 'proposed' ? 'flag' : 'lock'),
        ]),
        h('span', { class: 'node-label' }, [
          h('span', { class: 'node-title', text: level.title }),
          h('span', { class: 'node-skill', text: state === 'locked' ? 'Locked' : state === 'proposed' ? 'Proposed experiment' : (level.skill || 'Cleared') }),
        ]),
      ]);
      var item = h('li', { style: '--node-x:' + pts[index].x + '%;--node-y:' + pts[index].y + '%' }, [button]);
      list.appendChild(item);
    });
    mapEl.appendChild(list);
  }

  /* ---------- level panel ---------- */
  function renderDiff(level, index) {
    var prev = level.diffFrom ? { prompt: level.diffFrom.lines } : previousWithPrompt(index);
    var lines = prev ? diffLines(prev.prompt, level.prompt) : level.prompt.map(function (t) { return { type: 'add', text: t }; });
    var added = lines.filter(function (l) { return l.type === 'add'; }).length;
    var removed = lines.filter(function (l) { return l.type === 'del'; }).length;

    var head = h('div', { class: 'diff-head' }, [
      h('span', { class: 'diff-file', text: level.diffFrom ? level.diffFrom.label : prev ? 'prompt · level ' + prev.id + ' → ' + level.id : 'prompt · level ' + level.id + ' (first commit)' }),
      h('span', { class: 'diff-stat' }, [
        h('span', { class: 'stat-add', text: '+' + added }),
        ' ',
        h('span', { class: 'stat-del', text: '−' + removed }),
      ]),
    ]);
    var body = h('ol', { class: 'diff-lines' });
    lines.forEach(function (line) {
      var sign = line.type === 'add' ? '+' : line.type === 'del' ? '−' : ' ';
      var srText = line.type === 'add' ? 'Added: ' : line.type === 'del' ? 'Removed: ' : '';
      body.appendChild(h('li', { class: 'diff-' + line.type }, [
        h('span', { class: 'diff-sign', 'aria-hidden': 'true', text: sign }),
        srText ? h('span', { class: 'visually-hidden', text: srText }) : null,
        h('code', { text: line.text }),
      ]));
    });
    return h('figure', { class: 'diff' }, [head, body,
      level.promptNote ? h('figcaption', { text: level.promptNote }) : null]);
  }

  /* ---------- framework variants (one prompt, many structures) ---------- */
  function renderVariants(level) {
    var variants = level.variants;
    var chosen = 0;
    var uid = 'fw-' + level.id;

    var tabs = h('div', { class: 'fw-tabs', role: 'tablist', 'aria-label': 'Frameworks' });
    var panel = h('div', { class: 'fw-panel', role: 'tabpanel', id: uid + '-panel', tabindex: '0' });

    function show(index, focus) {
      chosen = index;
      [].forEach.call(tabs.children, function (tab, i) {
        tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
        tab.tabIndex = i === index ? 0 : -1;
        if (i === index && focus) tab.focus();
      });
      var v = variants[index];
      panel.setAttribute('aria-labelledby', uid + '-tab-' + index);
      panel.textContent = '';
      panel.appendChild(h('p', { class: 'fw-full', text: v.full }));
      var list = h('ol', { class: 'fw-parts' });
      v.parts.forEach(function (part) {
        list.appendChild(h('li', null, [
          h('span', { class: 'fw-letter', 'aria-hidden': 'true', text: part.letter }),
          h('span', { class: 'fw-label', text: part.label }),
          h('span', { class: 'fw-text', text: part.text }),
        ]));
      });
      panel.appendChild(list);
      if (v.text) {
        panel.appendChild(h('div', { class: 'fw-whole' }, [
          h('p', { class: 'fw-whole-label', text: 'The full prompt' }),
          h('p', { class: 'fw-whole-text', text: v.text }),
        ]));
      }
    }

    variants.forEach(function (v, i) {
      tabs.appendChild(h('button', {
        type: 'button', role: 'tab', id: uid + '-tab-' + i, 'aria-controls': uid + '-panel',
        onclick: function () { show(i, false); },
        onkeydown: function (event) {
          var step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
          if (!step) return;
          event.preventDefault();
          show((chosen + step + variants.length) % variants.length, true);
        },
      }, [v.name]));
    });

    var section = h('section', { class: 'frameworks', 'aria-labelledby': uid + '-title' }, [
      h('h3', { id: uid + '-title', text: 'Seven frameworks, one request' }),
      h('p', { class: 'fw-intro', text: 'Pick a framework to read that version of the prompt. Each letter is one part the framework asks for.' }),
      tabs,
      panel,
    ]);
    show(0, false);
    return section;
  }


  /* ---------- essays, case files, prompt audit ---------- */
  function renderLessons(level) {
    var list = h('ol', { class: 'lessons' + (level.lessonsLayout ? ' is-cards' : '') + (level.lessonsLayout === 'grid2' ? ' is-grid2' : '') });
    level.lessons.forEach(function (l, i) {
      list.appendChild(h('li', { class: 'lesson' }, [
        h('span', { class: 'lesson-num', 'aria-hidden': 'true', text: String(i + 1).padStart(2, '0') }),
        h('div', { class: 'lesson-body' }, [
          h('h4', { text: l.title }),
          l.law ? h('p', { class: 'lesson-law', text: l.law }) : null,
          h('p', { class: 'lesson-text', text: l.lesson }),
          !l.apply ? null : level.lessonsLayout
            ? h('p', { class: 'lesson-apply' }, [h('span', { class: 'apply-arrow', 'aria-hidden': 'true', text: '→' }), h('span', { class: 'visually-hidden', text: 'How I apply it: ' }), h('span', { text: l.apply })])
            : h('p', { class: 'lesson-apply' }, [h('strong', { text: 'How I apply it: ' }), l.apply]),
        ]),
      ]));
    });
    return h('section', { class: 'lesson-section', 'aria-labelledby': 'lessons-' + level.id }, [
      h('h3', { id: 'lessons-' + level.id, text: level.lessonsTitle || 'What I take from this as an AI user' }),
      level.lessonsNote ? h('p', { class: 'fw-intro', text: level.lessonsNote }) : null,
      list,
    ]);
  }

  function renderCases(level) {
    var grid = h('ol', { class: 'case-files' });
    level.cases.forEach(function (c, i) {
      grid.appendChild(h('li', { class: 'case-file' }, [
        h('p', { class: 'case-num', text: 'Case file ' + String(i + 1).padStart(2, '0') + (c.analogy ? ' · applied by analogy' : '') }),
        h('h4', { text: c.name }),
        h('p', { class: 'case-cite', text: c.cite }),
        h('p', { class: 'case-doctrine', text: c.doctrine }),
        h('div', { class: 'case-rule' }, [
          h('span', { class: 'case-rule-label', text: 'How I apply it when using AI' }),
          h('p', { text: c.rule }),
        ]),
      ]));
    });
    return h('section', { class: 'cases', 'aria-labelledby': 'cases-' + level.id }, [
      h('h3', { id: 'cases-' + level.id, text: 'Case files' }),
      level.casesSource ? h('p', { class: 'fw-intro', text: level.casesSource }) : null,
      grid,
    ]);
  }

  function renderAudit(level) {
    var body = h('tbody');
    level.audit.forEach(function (row) {
      body.appendChild(h('tr', null, [
        h('td', { class: 'audit-quote' }, [h('code', { text: '“' + row.quote + '”' })]),
        h('td', { class: 'audit-where' }, [h('a', { href: '#level-' + row.level, text: 'Level ' + row.level }), h('span', { text: row.where })]),
        h('td', { class: 'audit-law' }, [h('strong', { text: row.law }), h('span', { text: row.why })]),
      ]));
    });
    return h('section', { class: 'audit', 'aria-labelledby': 'audit-' + level.id }, [
      h('h3', { id: 'audit-' + level.id, text: 'Auditing my own prompts' }),
      h('p', { class: 'fw-intro', text: 'Rules I wrote into earlier chatbot prompts, before this lesson, and the part of the Data Privacy Act each one lines up with.' }),
      h('div', { class: 'audit-wrap' }, [h('table', { class: 'audit-table' }, [
        h('thead', null, [h('tr', null, [
          h('th', { scope: 'col', text: 'Rule I wrote' }),
          h('th', { scope: 'col', text: 'Where' }),
          h('th', { scope: 'col', text: 'Data Privacy Act' }),
        ])]),
        body,
      ])]),
    ]);
  }

  /* ---------- agent workflow (loop, organize, study, judgment tests) ---------- */
  function renderAgent(level) {
    var a = level.agent;
    var id = level.id;
    var parts = [];

    var loop = h('ol', { class: 'agent-loop' });
    a.cycle.forEach(function (c, i) {
      loop.appendChild(h('li', { class: 'agent-step' + (c.flag ? ' is-flagged' : '') }, [
        h('span', { class: 'agent-step-num', 'aria-hidden': 'true', text: String(i + 1) }),
        h('div', null, [
          h('h4', null, [c.step, c.flag ? h('span', { class: 'agent-flag', text: c.flag }) : null]),
          h('p', { text: c.text }),
          c.code ? h('code', { class: 'agent-code', text: c.code }) : null,
        ]),
      ]));
    });
    parts.push(h('section', { class: 'agent-part', 'aria-labelledby': 'loop-' + id }, [
      h('h3', { id: 'loop-' + id, text: 'The agent loop, step by step' }),
      h('p', { class: 'fw-intro', text: 'One ORGANIZE run, from goal to log. A chatbot answers once; this agent kept going until it had checked its own work.' }),
      loop,
    ]));

    return h('div', { class: 'agent' }, parts);
  }


  function fmt(n) { return Number(n).toLocaleString('en-US'); }

  /* ---------- brief level sections: results, routes, learned, improve ---------- */
  function renderResults(level) {
    var list = h('ul', { class: 'results', 'aria-label': 'Key results' });
    level.results.forEach(function (r) { list.appendChild(h('li', { text: r })); });
    return list;
  }

  function renderRoutes(level) {
    var list = h('ul', { class: 'routes', 'aria-label': 'Where each answer comes from' });
    level.routes.forEach(function (r) {
      list.appendChild(h('li', null, [h('span', { class: 'route-ask', text: r.ask }), h('span', { class: 'route-arrow', 'aria-hidden': 'true', text: '→' }), h('strong', { text: r.source })]));
    });
    return h('section', { class: 'brief-part', 'aria-labelledby': 'routes-' + level.id }, [
      h('h3', { id: 'routes-' + level.id, text: 'Where each answer comes from' }),
      list,
    ]);
  }

  function renderLearned(level) {
    function block(kind, title, items) {
      var list = h('ul');
      items.forEach(function (t) { list.appendChild(h('li', { text: t })); });
      return h('section', { class: 'learn-card is-' + kind, 'aria-labelledby': kind + '-' + level.id }, [
        h('h3', { id: kind + '-' + level.id }, [title]),
        list,
      ]);
    }
    return h('div', { class: 'learn-grid' }, [
      level.learned && level.learned.length ? block('learned', 'What I learned', level.learned) : null,
      level.improve && level.improve.length ? block('improve', 'What I’d improve next', level.improve) : null,
    ]);
  }

  function levelLink(level) {
    return '#level-' + level.id;
  }

  function stepper(index) {
    var prev = index - 1;
    var next = index + 1 < levels.length ? index + 1 : -1;
    return h('nav', { class: 'level-stepper', 'aria-label': 'Levels' }, [
      prev >= 0 ? h('a', { href: levelLink(levels[prev]), 'aria-label': 'Previous: Level ' + levels[prev].id + ', ' + levels[prev].title }, [icon('arrowL'), 'Level ' + levels[prev].id]) : h('span'),
      h('a', { class: 'stepper-map', href: '#map' }, ['All levels']),
      next >= 0 ? h('a', { href: levelLink(levels[next]), 'aria-label': 'Next: Level ' + levels[next].id + ', ' + levels[next].title }, ['Level ' + levels[next].id, icon('arrowR')]) : h('span'),
    ]);
  }

  function renderScreenshot(shot, extraClass) {
    return h('figure', { class: 'shot' + (extraClass ? ' ' + extraClass : '') }, [
      h('a', { href: shot.src, target: '_blank', rel: 'noopener', class: 'shot-link' }, [
        h('img', { src: shot.src, alt: shot.alt, loading: 'lazy', decoding: 'async', width: shot.width, height: shot.height }),
        h('span', { class: 'shot-open' }, ['Open full screenshot', h('span', { class: 'visually-hidden', text: ' (opens in a new tab)' })]),
      ]),
      shot.caption ? h('figcaption', { text: shot.caption }) : null,
    ]);
  }

  function renderPanel() {
    var level = levels[current];
    var index = current;
    panelEl.textContent = '';
    panelEl.setAttribute('aria-labelledby', 'level-title');

    var statusText = { done: 'Level cleared', proposed: 'Not played yet · proposed experiment', locked: 'Locked' }[level.status] || '';
    panelEl.appendChild(h('header', { class: 'section-lead activity-lead', id: levelLink(level).slice(1) }, [
      h('div', null, [
        h('p', { class: 'activity-number', text: 'Level ' + level.id + ' · ' + statusText }),
        h('h2', { id: 'level-title', tabindex: '-1', text: level.title }),
      ]),
      level.question ? h('p', { text: level.question }) : null,
    ]));

    if (!isOpen(level)) {
      panelEl.appendChild(h('p', { class: 'locked-note', text: 'This level unlocks when the activity is added to the portfolio.' }));
      panelEl.appendChild(stepper(index));
      return;
    }

    if (level.skill) {
      panelEl.appendChild(h('p', { class: 'unlock' + (level.status === 'done' ? '' : ' is-pending') }, [
        icon(level.status === 'done' ? 'star' : 'flag'),
        (level.status === 'done' ? 'Skill unlocked: ' : 'Skill to unlock: ') + level.skill,
      ]));
    }

    if (level.did) panelEl.appendChild(h('p', { class: 'did', text: level.did }));
    if (level.shots) panelEl.appendChild(h('div', { class: 'shots' }, level.shots.map(function (shot) { return renderScreenshot(shot); })));
    var gwrap = level.galleries ? h('div', { class: 'gallery-pair' }) : null;
    (level.galleries || []).forEach(function (g, gi) {
      if (!g.items.length) return;
      var gid = level.id + '-' + gi, rest = h('div', { class: 'gallery-rest', id: 'gallery-' + gid, hidden: '' });
      g.items.slice(1).forEach(function (it) { rest.appendChild(renderScreenshot(it)); });
      var more = g.items.length - 1;
      var btn = h('button', { type: 'button', class: 'gallery-toggle', 'aria-expanded': 'false', 'aria-controls': 'gallery-' + gid, text: 'Show ' + more + ' more screenshots' });
      btn.addEventListener('click', function () {
        var open = rest.hidden; rest.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'Hide screenshots' : 'Show ' + more + ' more screenshots';
      });
      gwrap.appendChild(h('section', { class: 'gallery brief-part' }, [h('h3', { text: g.title }), renderScreenshot(g.items[0]), more > 0 ? btn : null, more > 0 ? rest : null]));
    });
    if (level.shot) panelEl.appendChild(renderScreenshot(level.shot));

    if (level.prompt && level.prompt.length) panelEl.appendChild(renderDiff(level, index));
    if (gwrap && gwrap.childElementCount) panelEl.appendChild(gwrap);
    if (level.variants && level.variants.length) panelEl.appendChild(renderVariants(level));
    if (level.routes && level.routes.length) panelEl.appendChild(renderRoutes(level));
    if (level.agent) panelEl.appendChild(renderAgent(level));
    if (level.lessons && level.lessons.length) panelEl.appendChild(renderLessons(level));
    if (level.shotBelow) panelEl.appendChild(renderScreenshot(level.shotBelow, 'shot-below'));
    if (level.cases && level.cases.length) panelEl.appendChild(renderCases(level));
    if (level.audit && level.audit.length) panelEl.appendChild(renderAudit(level));
    if (level.results && level.results.length) panelEl.appendChild(renderResults(level));
    if (level.learned || level.improve) panelEl.appendChild(renderLearned(level));

    panelEl.appendChild(stepper(index));
  }

  /* ---------- selection, routing, keyboard ---------- */
  function select(index) {
    if (index === current) return;
    var prior = mapEl.querySelector('[aria-current]');
    if (prior) prior.removeAttribute('aria-current');
    current = index;
    mapEl.querySelector('[data-index="' + current + '"]').setAttribute('aria-current', 'true');
    renderPanel();
  }

  function openLevel(index, updateHistory) {
    select(index);
    var hash = levelLink(levels[index]);
    if (updateHistory && location.hash !== hash) history.pushState(null, '', hash);
    document.getElementById('level-title').focus({ preventScroll: true });
    panelEl.scrollIntoView({ block: 'start' });
  }

  function indexFromHash(hash) {
    return levels.findIndex(function (level) { return levelLink(level) === hash; });
  }

  function defaultIndex() {
    var last = 0;
    levels.forEach(function (l, i) { if (l.status === 'done') last = i; });
    return last;
  }

  mapEl.addEventListener('keydown', function (event) {
    var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    var node = event.target.closest('.level-node');
    if (!(event.key in keys) || !node) return;
    event.preventDefault();
    var next = Math.min(levels.length - 1, Math.max(0, Number(node.dataset.index) + keys[event.key]));
    mapEl.querySelector('[data-index="' + next + '"]').focus();
  });

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest('a[href^="#level-"]');
    if (!link) return;
    var index = indexFromHash(link.hash);
    if (index < 0) return;
    event.preventDefault();
    openLevel(index, true);
  });

  window.addEventListener('hashchange', function () {
    var index = indexFromHash(location.hash);
    if (index >= 0) openLevel(index, false);
  });

  /* Title screen: a saved run. "Last level played" goes to the latest cleared level. */
  function renderTitleScreen() {
    var done = levels.filter(function (l) { return l.status === 'done'; });
    var latest = done[done.length - 1];
    var cont = document.getElementById('ts-continue');
    var contDetail = document.getElementById('ts-continue-detail');
    if (cont && latest) {
      cont.setAttribute('href', '#level-' + latest.id);
      contDetail.textContent = 'Level ' + latest.id + ' · ' + latest.title;
      var navLast = document.getElementById('nav-last-played');
      if (navLast) navLast.setAttribute('href', '#level-' + latest.id);
    }
    var save = document.getElementById('ts-save');
    if (save) save.textContent = 'Save file · ' + done.length + ' of ' + levels.length + ' levels cleared';
    var player = document.getElementById('ts-player');
    if (!player) return;
    player.textContent = '';
    [
      ['Rank', 'Lv ' + done.length],
      ['XP', fmt(done.length * XP_PER_LEVEL) + ' / ' + fmt(levels.length * XP_PER_LEVEL)],
      ['Skills', String(done.filter(function (l) { return l.skill; }).length)],
      ['Last played', latest ? 'Level ' + latest.id : '—'],
    ].forEach(function (pair) {
      player.appendChild(h('div', null, [h('dt', { text: pair[0] }), h('dd', { text: pair[1] })]));
    });
  }

  function renderReflection() {
    var root = document.getElementById('reflection');
    var r = window.REFLECTION;
    if (!root || !r) return;
    root.textContent = '';
    root.appendChild(h('div', { class: 'section-lead' }, [h('h2', { id: 'reflection-title', text: 'Reflection' })]));
    var body = h('div', { class: 'reflection-body' });
    r.paragraphs.forEach(function (p) { body.appendChild(h('p', { text: p })); });
    root.appendChild(body);
  }

  renderHud();
  renderMap();
  renderTitleScreen();
  renderReflection();
  /* Open on the title screen, centered, unless the link points at a specific level. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var start = indexFromHash(location.hash);
  if (start < 0 && !location.hash) window.scrollTo(0, 0);
  if (start >= 0) openLevel(start, false);
  else select(defaultIndex());
})();
