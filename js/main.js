/* =====================================================================
   John Rey Dado — Portfolio (clean build)
   ===================================================================== */
(function () {
  'use strict';

  if (window.AOS) AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 60 });

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme (light default) ---------- */
  var html = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');
  var saved = localStorage.getItem('jr-theme');
  if (saved) html.setAttribute('data-theme', saved);
  function syncThemeIcon() {
    if (!themeToggle) return;
    var dark = html.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
  syncThemeIcon();
  if (themeToggle) themeToggle.addEventListener('click', function () {
    var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('jr-theme', next);
    syncThemeIcon();
  });

  /* ---------- Navbar / scroll ---------- */
  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('nav-toggle');
  var navLinksWrap = document.getElementById('nav-links');
  var navLinks = [].slice.call(document.querySelectorAll('.nav-link'));
  var progress = document.getElementById('scroll-progress');
  var backTop = document.getElementById('back-to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (navbar) navbar.classList.toggle('scrolled', y > 24);
    if (backTop) backTop.classList.toggle('show', y > 500);
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    var pos = y + 150, current = '';
    document.querySelectorAll('section[id]').forEach(function (s) { if (pos >= s.offsetTop) current = s.id; });
    navLinks.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinksWrap) {
    navToggle.addEventListener('click', function () { navLinksWrap.classList.toggle('open'); });
    navLinks.forEach(function (l) { l.addEventListener('click', function () { navLinksWrap.classList.remove('open'); }); });
  }
  if (backTop) backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Typed ---------- */
  var typedEl = document.getElementById('typed');
  if (typedEl) {
    var phrases = ['web apps.', 'mobile apps.', 'automation.', 'clean systems.'];
    var pi = 0, ci = 0, del = false;
    (function loop() {
      var w = phrases[pi];
      typedEl.textContent = del ? w.substring(0, ci--) : w.substring(0, ci++);
      var d = del ? 45 : 95;
      if (!del && ci === w.length + 1) { del = true; d = 1500; }
      else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; d = 350; }
      setTimeout(loop, d);
    })();
  }

  /* ---------- Counters ---------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var node = el.firstChild, dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      node.nodeValue = String(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step); else node.nodeValue = String(target);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(function (el) { io.observe(el); });

  /* ---------- Projects ---------- */
  function imgs(prefix, ext, count) {
    var a = [];
    for (var i = 1; i <= count; i++) a.push('images/portfolio/' + prefix + i + '.' + ext);
    return a;
  }
  var projects = [
    { title: 'Water Pipe Monitoring', category: 'web', label: 'web · iot',
      desc: 'Real-time monitoring system for water pipelines — dashboards, leak/flow alerts, and historical data tracking.',
      tags: ['IoT', 'JavaScript', 'Realtime'],
      github: 'https://github.com/johnrey666/water_monitoring.git', gallery: imgs('w', 'png', 14) },
    { title: 'SeniorCare Connect', category: 'mobile', label: 'mobile',
      desc: 'A mobile app connecting seniors with caregivers — health reminders, profiles, and easy communication.',
      tags: ['Flutter', 'Dart', 'Firebase'],
      github: 'https://github.com/johnrey666/seniorcare.git', gallery: imgs('sc', 'jpg', 7) },
    { title: 'Mailah Lite', category: 'web', label: 'web',
      desc: 'A lightweight Firebase-powered web messaging / mailing app with real-time sync and a clean interface.',
      tags: ['JavaScript', 'Firebase', 'Realtime DB'],
      github: 'https://github.com/johnrey666/dado_firebase.git', gallery: imgs('m', 'png', 7) },
    { title: 'Creative Dental', category: 'web', label: 'web',
      desc: 'A dental clinic website with appointment booking, services showcase, and a modern responsive interface.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/johnrey666/creative_dental.git', gallery: imgs('c', 'png', 8) },
    { title: 'Wastage Reporting', category: 'web', label: 'web',
      desc: 'A web system for logging, tracking, and analyzing material/food wastage with reports and visual analytics.',
      tags: ['PHP', 'Laravel', 'MySQL'], github: '', gallery: imgs('wr', 'png', 5) },
    { title: 'E-Portal Requisition', category: 'web', label: 'web',
      desc: 'An online requisition portal for submitting, approving, and tracking requests through a structured workflow.',
      tags: ['PHP', 'Laravel', 'MySQL'], github: '', gallery: imgs('ep', 'png', 5) },
    { title: 'PlaySpace', category: 'mobile', label: 'mobile',
      desc: 'A mobile app for discovering, booking, and managing play & sports spaces — maps, schedules, and reservations.',
      tags: ['Flutter', 'Dart', 'Maps'], github: '', gallery: imgs('z', 'jpg', 6) }
  ];

  var grid = document.getElementById('projects-grid');

  function buildCard(p, idx) {
    var card = document.createElement('article');
    card.className = 'project-card show';
    card.setAttribute('data-category', p.category);
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((idx % 3) * 70));

    var cover;
    if (p.gallery && p.gallery.length) {
      cover = '<div class="project-cover">' +
        '<div class="cover-blur" style="background-image:url(\'' + p.gallery[0] + '\')"></div>' +
        '<img src="' + p.gallery[0] + '" alt="' + p.title + '" loading="lazy">' +
        '<span class="cat-badge">' + p.label + '</span>' +
        '<div class="project-overlay">' +
          '<button class="ov-btn js-gallery" title="View gallery"><i class="fa-solid fa-images"></i></button>' +
          (p.github ? '<a class="ov-btn" href="' + p.github + '" target="_blank" rel="noopener" title="GitHub"><i class="fa-brands fa-github"></i></a>' : '') +
        '</div></div>';
    } else {
      cover = '<div class="project-cover placeholder ' + (p.ph || 'ph-grad-1') + '">' +
        '<span class="cat-badge">' + p.label + '</span>' +
        '<i class="ph-icon ' + (p.icon || 'fa-solid fa-code') + '"></i></div>';
    }

    var tags = p.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('');
    var links = '<div class="project-links">';
    if (p.gallery && p.gallery.length) links += '<a href="#" class="js-gallery"><i class="fa-solid fa-images"></i> Gallery</a>';
    links += p.github
      ? '<a href="' + p.github + '" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>'
      : '<a href="#contact"><i class="fa-solid fa-circle-info"></i> Ask me</a>';
    links += '</div>';

    card.innerHTML = cover +
      '<div class="project-body"><h3>' + p.title + '</h3><p>' + p.desc + '</p>' +
      '<div class="project-tags">' + tags + '</div>' + links + '</div>';

    if (p.gallery && p.gallery.length && window.jQuery) {
      var items = p.gallery.map(function (src) { return { src: src }; });
      var open = function (ev) {
        ev.preventDefault();
        jQuery.magnificPopup.open({
          items: items, type: 'image',
          gallery: { enabled: true, navigateByImgClick: true },
          mainClass: 'mfp-with-zoom', image: { verticalFit: true },
          zoom: { enabled: true, duration: 300 }
        });
      };
      card.querySelectorAll('.js-gallery').forEach(function (b) { b.addEventListener('click', open); });
    }
    return card;
  }

  if (grid) {
    projects.forEach(function (p, i) { grid.appendChild(buildCard(p, i)); });
    if (window.AOS) AOS.refresh();
  }

  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      document.querySelectorAll('.project-card').forEach(function (c) {
        c.classList.toggle('hide', !(f === 'all' || c.getAttribute('data-category') === f));
      });
    });
  });

  /* ---------- Resume modal ---------- */
  var resumeBtn = document.getElementById('resumeButton');
  var resumeModal = document.getElementById('resumeModal');
  if (resumeBtn && resumeModal) {
    var closeR = resumeModal.querySelector('.resume-close');
    var backdrop = resumeModal.querySelector('.resume-backdrop');
    var openR = function () { resumeModal.classList.add('show'); document.body.style.overflow = 'hidden'; };
    var hideR = function () { resumeModal.classList.remove('show'); document.body.style.overflow = ''; };
    resumeBtn.addEventListener('click', openR);
    if (closeR) closeR.addEventListener('click', hideR);
    if (backdrop) backdrop.addEventListener('click', hideR);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideR(); });
  }

  /* ---------- AI Chat ---------- */
  var launcher = document.getElementById('chat-launcher');
  var chatWin = document.getElementById('chat-window');
  var chatClose = document.getElementById('chat-close');
  var chatMsgs = document.getElementById('chat-messages');
  var chatForm = document.getElementById('chat-form');
  var chatInput = document.getElementById('chat-text');
  var chatSuggest = document.getElementById('chat-suggestions');
  var greeted = false;

  function openChat() {
    if (!chatWin) return;
    chatWin.classList.add('open');
    if (launcher) launcher.style.display = 'none';
    if (!greeted) { greeted = true; botSay("Hey! \uD83D\uDC4B I'm John Rey's AI assistant. Ask me about his skills, projects, experience, or how to reach him."); }
    setTimeout(function () { if (chatInput) chatInput.focus(); }, 250);
  }
  function closeChat() { if (!chatWin) return; chatWin.classList.remove('open'); if (launcher) launcher.style.display = 'grid'; }
  if (launcher) launcher.addEventListener('click', openChat);
  if (chatClose) chatClose.addEventListener('click', closeChat);

  function scrollChat() { if (chatMsgs) chatMsgs.scrollTop = chatMsgs.scrollHeight; }
  function addMsg(t, who) { var d = document.createElement('div'); d.className = 'msg ' + who; d.innerHTML = t; chatMsgs.appendChild(d); scrollChat(); }
  function botSay(t) {
    var ty = document.createElement('div'); ty.className = 'typing'; ty.innerHTML = '<span></span><span></span><span></span>';
    chatMsgs.appendChild(ty); scrollChat();
    setTimeout(function () { ty.remove(); addMsg(t, 'bot'); }, Math.min(400 + t.length * 7, 1400));
  }

  var KB = [
    { k: ['who', 'about', 'yourself', 'john', 'rey', 'dado', 'tell me about you'],
      a: "John Rey Dado is an IT graduate and <b>full-stack developer</b>, currently a <b>Technical Support Specialist at LCC Groups</b>. He builds web apps, cross-platform mobile apps, and internal automation — focused on clean code and reliable systems." },
    { k: ['skill', 'tech', 'stack', 'language', 'languages', 'framework', 'frameworks', 'database', 'tools', 'what can you'],
      a: "His stack:<br>\u2022 <b>Languages:</b> HTML, CSS, JavaScript, TypeScript, PHP, Dart, Kotlin, Java, Python, SQL<br>\u2022 <b>Frameworks:</b> Angular, Laravel, Flutter, Node.js, Tailwind, Bootstrap, jQuery<br>\u2022 <b>Databases/Backend:</b> MySQL, PostgreSQL, SQLite, Firebase, Supabase<br>\u2022 <b>Also:</b> QA testing, data processing, Git/GitHub, Figma, REST APIs" },
    { k: ['full stack', 'fullstack', 'full-stack', 'backend', 'frontend'],
      a: "Yes — John Rey works <b>full-stack</b>: system development, design, and debugging across front-end and back-end. Front-end with Angular &amp; modern JS/TS, back-end with Laravel/PHP and Node.js." },
    { k: ['mobile', 'flutter', 'dart', 'android', 'ios', 'kotlin', 'native'],
      a: "He builds <b>cross-platform and native mobile apps</b> — mainly with <b>Flutter &amp; Dart</b> (and Kotlin/Java for native Android). Examples: SeniorCare Connect and PlaySpace." },
    { k: ['project', 'work you', 'built', 'portfolio', 'apps', 'made', 'projects'],
      a: "He's built 7 projects:<br>1. <b>Water Pipe Monitoring</b> (Web/IoT)<br>2. <b>SeniorCare Connect</b> (Mobile)<br>3. <b>Mailah Lite</b> (Web)<br>4. <b>Creative Dental</b> (Web)<br>5. <b>Wastage Reporting</b> (Web)<br>6. <b>E-Portal Requisition</b> (Web)<br>7. <b>PlaySpace</b> (Mobile)<br>See the <a href='#projects'>Work</a> section!" },
    { k: ['water', 'pipe', 'monitoring', 'iot'],
      a: "<b>Water Pipe Monitoring</b> — a real-time system for water pipelines with dashboards, leak/flow alerts, and historical tracking. <a href='https://github.com/johnrey666/water_monitoring.git' target='_blank'>Code \u2192</a>" },
    { k: ['senior', 'care', 'seniorcare'],
      a: "<b>SeniorCare Connect</b> — a Flutter mobile app connecting seniors with caregivers: health reminders, profiles, and simple communication." },
    { k: ['mailah', 'messaging', 'chat app', 'mail'],
      a: "<b>Mailah Lite</b> — a lightweight Firebase-powered web messaging/mailing app with real-time sync." },
    { k: ['dental', 'creative', 'clinic', 'booking'],
      a: "<b>Creative Dental</b> — a dental clinic website with appointment booking and a modern responsive design." },
    { k: ['wastage', 'waste', 'reporting'],
      a: "<b>Wastage Reporting</b> — a web system to log, track, and analyze material/food wastage with reports and analytics. Built with PHP/Laravel &amp; MySQL." },
    { k: ['requisition', 'portal', 'e-portal', 'eportal', 'request'],
      a: "<b>E-Portal Requisition</b> — an online portal to submit, approve, and track requisitions via a structured workflow. PHP/Laravel &amp; MySQL." },
    { k: ['playspace', 'play space', 'sports', 'play'],
      a: "<b>PlaySpace</b> — a Flutter mobile app to discover, book, and manage play &amp; sports spaces with maps and reservations." },
    { k: ['experience', 'job', 'career', 'history', 'background', 'worked', 'work history'],
      a: "Experience:<br>\u2022 <b>Technical Support Specialist</b> @ LCC Groups (Oct 2025–present) — internal automation, system maintenance, user training, network/machine installs<br>\u2022 <b>Software Developer Trainee</b> (Jan–Jun 2025) — team web development &amp; QA<br>\u2022 <b>Sales &amp; Service Associate</b> (2023–2024)<br>\u2022 <b>Data Processor</b> (2022)<br>See the <a href='#experience'>Experience</a> section." },
    { k: ['current', 'currently', 'now', 'lcc', 'support', 'technical support'],
      a: "Right now John Rey is a <b>Technical Support Specialist at LCC Groups</b> (since Oct 2025) — developing internal automation, maintaining systems, training users, and handling network &amp; machine installation." },
    { k: ['qa', 'quality', 'testing', 'test', 'bug'],
      a: "Yes — he does <b>Quality Assurance</b>: manual testing, bug tracking, and performance validation." },
    { k: ['data', 'excel', 'entry', 'processing'],
      a: "He has <b>data processing</b> experience: high-volume data entry, validation, and database management using Excel, databases, and internal systems." },
    { k: ['education', 'study', 'school', 'degree', 'graduate', 'college'],
      a: "John Rey holds a <b>BS in Information Technology</b>, focusing on web development, mobile development, databases, and UI/UX." },
    { k: ['contact', 'reach', 'email', 'gmail', 'get in touch', 'hire', 'phone', 'number', 'call', 'facebook', 'fb', 'github'],
      a: "Reach John Rey here:<br>\u2022 <b>Gmail:</b> <a href='mailto:johnreydado@gmail.com'>johnreydado@gmail.com</a><br>\u2022 <b>Phone:</b> <a href='tel:+639123456789'>+63 912 345 6789</a><br>\u2022 <b>Facebook:</b> <a href='https://www.facebook.com/johnrey.dado' target='_blank'>@johnrey.dado</a><br>\u2022 <b>GitHub:</b> <a href='https://github.com/johnrey666' target='_blank'>@johnrey666</a>" },
    { k: ['resume', 'cv', 'download'],
      a: "Hit the <b>Resume</b> button in the hero, or <a href='images/JOHN-REY-DADO.pdf' target='_blank'>open it here \u2192</a>" },
    { k: ['hello', 'hi', 'hey', 'yo', 'good morning', 'good evening'],
      a: "Hey there! \uD83D\uDC4B Want to know about John Rey's <b>skills</b>, <b>projects</b>, <b>experience</b>, or <b>contact</b> info?" },
    { k: ['thank', 'thanks', 'cool', 'nice', 'awesome', 'great'],
      a: "You're welcome! \uD83D\uDE0A Ask me anything else — or reach John Rey via the <a href='#contact'>Contact</a> section." },
    { k: ['available', 'freelance', 'open', 'opportunity', 'work with'],
      a: "Yes — John Rey is <b>open to opportunities</b>! Fastest way to reach him: <a href='mailto:johnreydado@gmail.com'>johnreydado@gmail.com</a>." }
  ];

  function answer(q) {
    var s = q.toLowerCase(), best = null, score = 0;
    KB.forEach(function (e) {
      var sc = 0;
      e.k.forEach(function (kw) { if (s.indexOf(kw) !== -1) sc += kw.length; });
      if (sc > score) { score = sc; best = e; }
    });
    return (best && score > 0) ? best.a
      : "Good question! I can tell you about John Rey's <b>skills</b>, <b>projects</b>, <b>experience</b>, <b>education</b>, or <b>contact</b> details. Or email him: <a href='mailto:johnreydado@gmail.com'>johnreydado@gmail.com</a>.";
  }
  function handleUser(t) { t = (t || '').trim(); if (!t) return; addMsg(t, 'user'); botSay(answer(t)); }

  if (chatForm) chatForm.addEventListener('submit', function (e) { e.preventDefault(); handleUser(chatInput.value); chatInput.value = ''; });
  if (chatSuggest) chatSuggest.addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (c) { openChat(); handleUser(c.textContent); } });

  /* ---------- Interactive pet dog ---------- */
  var pet = document.getElementById('pet-dog');
  if (pet) {
    var dogEl = pet.querySelector('.dog');
    var isTouch = window.matchMedia('(hover: none)').matches;
    var boopT, touchT;
    var startPet = function () { pet.classList.add('petting'); };
    var stopPet = function () { pet.classList.remove('petting'); };
    if (dogEl) {
      dogEl.addEventListener('mouseenter', startPet);
      dogEl.addEventListener('mouseleave', stopPet);
      dogEl.addEventListener('click', function () {
        pet.classList.add('petting', 'boop');
        clearTimeout(boopT);
        boopT = setTimeout(function () { pet.classList.remove('boop'); }, 520);
        if (isTouch) { clearTimeout(touchT); touchT = setTimeout(stopPet, 1800); }
      });
    }

    // Wander between walking and idle behaviors (sit, lie, look, yawn)
    var rnd = function (min, max) { return min + Math.random() * (max - min); };
    var actions = [
      { cls: 'sitting', dur: function () { return rnd(4000, 7000); } },
      { cls: 'lying',   dur: function () { return rnd(5000, 9000); } },
      { cls: 'looking', dur: function () { return 2300; } },
      { cls: 'yawning', dur: function () { return 1200; } }
    ];
    (function idle() {
      setTimeout(function () {
        var a = actions[Math.floor(Math.random() * actions.length)];
        pet.classList.add(a.cls);
        setTimeout(function () { pet.classList.remove(a.cls); idle(); }, a.dur());
      }, rnd(5000, 9000));
    })();
  }

})();
