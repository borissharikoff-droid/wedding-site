/* ===== Wedding site logic ===== */
(function () {
  'use strict';

  /* ---------- COUNTDOWN ---------- */
  // 8 Sep 2026, 16:00 Moscow time (UTC+3)
  var TARGET = new Date('2026-09-08T16:00:00+03:00').getTime();
  var elDays = document.getElementById('cd-days');
  var elHours = document.getElementById('cd-hours');
  var elMin = document.getElementById('cd-min');
  var elSec = document.getElementById('cd-sec');
  var elCd = document.getElementById('countdown');
  var elDone = document.getElementById('cd-done');

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ring(el) { return el ? el.parentNode : null; }
  var ringDays = ring(elDays), ringHours = ring(elHours), ringMin = ring(elMin), ringSec = ring(elSec);

  function setCell(numEl, ringEl, value, max) {
    if (numEl) numEl.textContent = pad(value);
    if (ringEl) ringEl.style.setProperty('--p', Math.max(0, Math.min(1, value / max)).toFixed(4));
  }

  function tick() {
    var diff = TARGET - Date.now();
    if (diff <= 0) {
      if (elCd) elCd.hidden = true;
      if (elDone) elDone.hidden = false;
      clearInterval(timer);
      return;
    }
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    // ring progress: days scaled against a full year for a gentle arc
    setCell(elDays, ringDays, d, Math.max(d, 365));
    setCell(elHours, ringHours, h, 24);
    setCell(elMin, ringMin, m, 60);
    setCell(elSec, ringSec, sec, 60);
  }
  tick();
  var timer = setInterval(tick, 1000);

  /* ---------- FAQ ---------- */
  var FAQ = [
    ['Где именно проходит свадьба?',
     'Площадка Original. Точный адрес и схему проезда пришлём каждому гостю ближе к дате.'],
    ['Во сколько начинается мероприятие?',
     'Велком в 16:30, далее программа, а церемония в 19:00. Просим не опаздывать.'],
    ['Есть ли дресс-код?',
     'Да, поддержите палитру дня (мягкие или насыщенные оттенки). Формат торжественный, но комфортный.'],
    ['Как добраться?',
     'Удобнее на такси или авто, рядом есть парковка. Схему пришлём с подтверждением.'],
    ['Можно ли взять детей?',
     'Мы очень любим детей, но решили провести вечер во взрослом кругу. Малолетних детей, к сожалению, на празднике не будет.'],
    ['До какого числа заполнить анкету?',
     'Не позднее чем за месяц до свадьбы — до 8 августа 2026 года.'],
    ['Что подарить?',
     'Больше всего мы будем рады денежному подарку; любой знак внимания примем с благодарностью.'],
    ['Можно ли фотографировать?',
     'Конечно. Просьба: во время церемонии уберите телефоны — красивые кадры сделают фотографы.'],
    ['Планы изменились после анкеты?',
     'Просто напишите нам в Telegram (@Chillyteen или @CommercialPunk), и мы всё поправим.']
  ];

  var faqBox = document.getElementById('faq');
  if (faqBox) {
    FAQ.forEach(function (item) {
      var wrap = document.createElement('div');
      wrap.className = 'faq__item';
      var btn = document.createElement('button');
      btn.className = 'faq__q';
      btn.type = 'button';
      btn.textContent = item[0];
      var ans = document.createElement('div');
      ans.className = 'faq__a';
      var p = document.createElement('p');
      p.textContent = item[1];
      ans.appendChild(p);
      wrap.appendChild(btn);
      wrap.appendChild(ans);
      faqBox.appendChild(wrap);
      btn.addEventListener('click', function () {
        wrap.classList.toggle('open');
      });
    });
  }

  /* ---------- RSVP FORM ---------- */
  var form = document.getElementById('rsvpForm');
  var note = document.getElementById('rsvpNote');
  var DEADLINE = new Date('2026-08-08T23:59:59+03:00').getTime();

  function saveRsvp(data) {
    try {
      var list = JSON.parse(localStorage.getItem('rsvp_list') || '[]');
      list.push(data);
      localStorage.setItem('rsvp_list', JSON.stringify(list));
    } catch (e) { /* storage may be blocked */ }
  }

  if (form) {
    // prefill if already submitted, otherwise show mock demo values
    try {
      var mine = JSON.parse(localStorage.getItem('rsvp_mine') || 'null');
      if (mine) {
        form.name.value = mine.name || '';
        form.contact.value = mine.contact || '';
        if (mine.attend) {
          var r = form.querySelector('input[name="attend"][value="' + mine.attend + '"]');
          if (r) r.checked = true;
        }
        if (note) { note.textContent = 'Вы уже отправили анкету. Спасибо! Можно обновить ответ.'; note.className = 'rsvp__note ok'; }
      }
      // no mock prefill — empty fields show placeholders only
    } catch (e) {}

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var contact = form.contact.value.trim();
      var attendEl = form.querySelector('input[name="attend"]:checked');

      if (!name || !contact || !attendEl) {
        note.textContent = 'Пожалуйста, заполните все поля.';
        note.className = 'rsvp__note err';
        return;
      }
      if (Date.now() > DEADLINE) {
        note.textContent = 'Срок подачи анкеты истёк (08.08.2026). Напишите нам в Telegram.';
        note.className = 'rsvp__note err';
        return;
      }

      var data = {
        name: name,
        contact: contact,
        attend: attendEl.value,
        ts: new Date().toISOString()
      };
      saveRsvp(data);
      localStorage.setItem('rsvp_mine', JSON.stringify(data));

      note.className = 'rsvp__note ok';
      note.textContent = attendEl.value === 'yes'
        ? 'Ура! Спасибо, ждём вас 8 сентября ♥'
        : 'Спасибо, что дали знать. Будем скучать!';
      form.querySelector('.rsvp__submit').textContent = 'Обновить ответ';
    });
  }

  /* ---------- CHROMA-KEY HELPER -----------
     The image pipeline can't emit clean alpha, so decorative art is stored
     on a solid GREEN background and keyed out here at runtime → real alpha. */
  function chromaKey(img, sx, sy, sw, sh) {
    var c = document.createElement('canvas');
    c.width = sw; c.height = sh;
    var x = c.getContext('2d');
    x.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    var data = x.getImageData(0, 0, sw, sh);
    var d = data.data;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i], g = d[i + 1], b = d[i + 2];
      // green dominant → transparent
      if (g > 90 && g > r * 1.25 && g > b * 1.25) {
        d[i + 3] = 0;
      } else if (g > r && g > b && (g - Math.max(r, b)) > 30) {
        // green fringe → soften
        d[i + 3] = Math.max(0, d[i + 3] - 140);
      }
    }
    x.putImageData(data, 0, 0);
    return c.toDataURL('image/png');
  }

  function loadImg(src) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = function () { res(im); };
      im.onerror = rej;
      im.src = src;
    });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // key out near-WHITE (for line-art icons on white bg)
  function whiteKey(img, sx, sy, sw, sh) {
    var c = document.createElement('canvas');
    c.width = sw; c.height = sh;
    var x = c.getContext('2d');
    x.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    var data = x.getImageData(0, 0, sw, sh);
    var d = data.data;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i], g = d[i + 1], b = d[i + 2];
      var m = Math.min(r, g, b);
      if (m > 205) {                       // near white → transparent
        d[i + 3] = 0;
      } else if (m > 165) {                // light gray → partial
        d[i + 3] = Math.round((225 - m) / 60 * 255);
      }
    }
    x.putImageData(data, 0, 0);
    return c.toDataURL('image/png');
  }

  /* ---------- ICONS: unified sketch set (green raw) 4x2 grid ---------- */
  // icons2_raw order: [0,0]calendar [1,0]rings [2,0]wine [3,0]envelope
  //                   [0,1]stars    [1,1]cheers [2,1]disco [3,1]cake
  var ICON_COLS = 4, ICON_ROWS = 2;
  var ICON_MAP = {
    'ico--calendar': [0, 0], 'ico--rings':    [1, 0], 'ico--wine':  [2, 0], 'ico--envelope': [3, 0],
    'ico--stars':    [0, 1], 'ico--sparkles': [0, 1], 'ico--cheers': [1, 1], 'ico--disco': [2, 1], 'ico--cake': [3, 1]
  };
  loadImg('assets/icons2_raw.png?v=1').then(function (icImg) {
    var cellW = icImg.width / ICON_COLS, cellH = icImg.height / ICON_ROWS;
    var padX = cellW * 0.08, padY = cellH * 0.06;
    var cache = {};
    Object.keys(ICON_MAP).forEach(function (cls) {
      var col = ICON_MAP[cls][0], row = ICON_MAP[cls][1];
      var key = col + '_' + row;
      if (!cache[key]) {
        cache[key] = chromaKey(icImg,
          col * cellW + padX, row * cellH + padY,
          cellW - padX * 2, cellH - padY * 2);
      }
      var url = cache[key];
      document.querySelectorAll('.' + cls).forEach(function (el) {
        el.style.backgroundImage = 'url(' + url + ')';
        el.style.backgroundSize = 'contain';
        el.style.backgroundPosition = 'center';
      });
    });
  }).catch(function () {});

  /* ---------- PROGRAM ILLUSTRATIONS (green raw, 4x2 grid) ---------- */
  // guest item index -> [col,row] in program_raw.png
  var PROG_CELL = [
    [0, 0], // Велком      – welcome drink
    [1, 0], // Первый блок – mic stage
    [2, 0], // Муз пауза   – vinyl
    [3, 0], // Второй блок – party popper
    [0, 1], // Церемония   – rings
    [1, 1], // Вечеринка   – cocktails
    [2, 1]  // Торт        – cake
  ];
  loadImg('assets/program2_raw.png?v=1').then(function (pImg) {
    var cols = 4, rows = 2;
    var cw = pImg.width / cols, chp = pImg.height / rows;
    var pad = cw * 0.06;
    document.querySelectorAll('.prog__img').forEach(function (el) {
      var idx = parseInt(el.getAttribute('data-prog'), 10);
      var cell = PROG_CELL[idx];
      if (!cell) return;
      var url = chromaKey(pImg, cell[0] * cw + pad, cell[1] * chp + pad, cw - pad * 2, chp - pad * 2);
      el.style.backgroundImage = 'url(' + url + ')';
    });
  }).catch(function () {});

  /* ---------- BIG HALF-PAGE FLOWERS (green raw) ---------- */
  loadImg('assets/bigflower_raw.png?v=1').then(function (bf) {
    var url = chromaKey(bf, 0, 0, bf.width, bf.height);
    document.querySelectorAll('.bigflower').forEach(function (el) {
      el.style.backgroundImage = 'url(' + url + ')';
    });
  }).catch(function () {});

  /* ---------- BIG SIDE STAR-FLOWERS scattered along the page ---------- */
  loadImg('assets/sideflowers_raw.png?v=1').then(function (sf) {
    var half = sf.width / 2;
    var lime = chromaKey(sf, 0, 0, half, sf.height);
    var orange = chromaKey(sf, half, 0, half, sf.height);
    var host = document.getElementById('sideflowers');
    if (!host) return;
    // {top(vh), side, offset(vw), size(vw), img, rot}
    // spread big side-flowers down the WHOLE page (page is ~16x viewport tall),
    // alternating left/right so every section (incl. dresscode) gets large flowers
    var docVH = (document.body.scrollHeight / window.innerHeight) * 100; // total page height in vh
    var STEP = 52;                 // vertical gap between flowers (vh) — denser coverage
    var start = 50;                // start a bit below hero
    var SPOTS = [];
    var toggle = 0;
    for (var ty = start; ty < docVH - 20; ty += STEP) {
      var side = (toggle % 2 === 0) ? 'left' : 'right';
      var img = (toggle % 2 === 0) ? lime : orange;
      var size = 30 + (toggle % 3) * 3;                 // 30..36vw (big, hero-scale)
      var off = -13 - (toggle % 3) * 2;                 // -13..-17vw: only outer petals overlay edges
      var rot = (toggle % 2 === 0 ? -1 : 1) * (8 + (toggle % 4) * 4);
      SPOTS.push([Math.round(ty), side, off, size, img, rot]);
      toggle++;
    }
    SPOTS.forEach(function (s) {
      var el = document.createElement('div');
      el.className = 'sideflower';
      el.style.backgroundImage = 'url(' + s[4] + ')';
      el.style.top = s[0] + 'vh';
      el.style[s[1]] = s[2] + 'vw';
      el.style.width = s[3] + 'vw';
      el.style.height = s[3] + 'vw';
      el.style.setProperty('--r', s[5] + 'deg');
      el.style.animationDelay = (-(Math.random() * 9)).toFixed(1) + 's';
      host.appendChild(el);
    });
  }).catch(function () {});

  /* ---------- REVEAL ON SCROLL ---------- */
  (function reveal() {
    var secs = document.querySelectorAll('main .sec, .hero__photos');
    secs.forEach(function (s) { if (!s.classList.contains('hero__photos')) s.classList.add('reveal'); });
    var prog = document.querySelector('.program'); if (prog) prog.classList.add('reveal-stagger');
    var gal = document.querySelector('.venue__gallery'); if (gal) gal.classList.add('reveal-stagger');
    var hp = document.querySelector('.hero__photos'); if (hp) hp.classList.add('reveal-stagger', 'in');

    if (reduce || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal,.reveal-stagger').forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal,.reveal-stagger').forEach(function (e) { io.observe(e); });
  })();

  /* ---------- SCALLOP SEPARATORS (smooth block transitions) ---------- */
  // add a scalloped top edge to each main section whose bg differs from previous
  (function scallops() {
    var secs = document.querySelectorAll('main > .sec');
    var prevBg = 'cream'; // hero above is cream-ish
    secs.forEach(function (s) {
      var bg = s.classList.contains('sec--accent') ? 'accent'
             : s.classList.contains('sec--pink') ? 'pink'
             : s.classList.contains('sec--outro') ? 'outro' : 'cream';
      if (bg !== prevBg) s.classList.add('sec--scallop');
      prevBg = bg;
    });
  })();

  /* ---------- PARALLAX SIDE FLOWERS ---------- */
  if (!reduce) {
    var pxTicking = false;
    window.addEventListener('scroll', function () {
      if (pxTicking) return;
      pxTicking = true;
      requestAnimationFrame(function () {
        var y = window.pageYOffset;
        document.querySelectorAll('.sideflower').forEach(function (el, i) {
          var speed = (i % 2 === 0 ? 0.06 : -0.05) * (1 + (i % 3) * 0.3);
          el.style.setProperty('--px', (y * speed).toFixed(1) + 'px');
        });
        pxTicking = false;
      });
    }, { passive: true });
  }

  /* ---------- ADD TO CALENDAR (.ics) ---------- */
  var calBtn = document.getElementById('addToCal');
  if (calBtn) {
    calBtn.addEventListener('click', function () {
      function dt(s) { return s; }
      var ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//AF Wedding//RU',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'UID:wedding-af-20260908@site',
        'DTSTAMP:20260101T000000Z',
        'DTSTART;TZID=Europe/Moscow:20260908T163000',
        'DTEND;TZID=Europe/Moscow:20260909T000000',
        'SUMMARY:Свадьба Филиппа и Александры',
        'DESCRIPTION:Велком 16:30\\, церемония 19:00. Ждём вас!',
        'LOCATION:Original\\, Москва\\, Подколокольный пер.\\, 16 стр. 4',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'wedding-08-09-2026.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    });
  }

  /* ---------- CONFETTI on RSVP submit ---------- */
  function fireConfetti() {
    var canvas = document.getElementById('confetti');
    if (!canvas || reduce) return;
    var sec = canvas.closest('.sec') || canvas.parentNode;
    var W = canvas.width = sec.offsetWidth;
    var H = canvas.height = sec.offsetHeight;
    var ctx = canvas.getContext('2d');
    var colors = ['#e0592a', '#f2b8c6', '#9dcc2a', '#2b53b5', '#f7e08a', '#6b3fa0', '#ffffff'];
    var parts = [];
    var N = 140;
    for (var i = 0; i < N; i++) {
      parts.push({
        x: W / 2 + (Math.random() - 0.5) * 120,
        y: H * 0.35,
        vx: (Math.random() - 0.5) * 12,
        vy: -6 - Math.random() * 9,
        g: 0.28 + Math.random() * 0.12,
        s: 5 + Math.random() * 7,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.4,
        c: colors[(Math.random() * colors.length) | 0],
        shape: Math.random() > 0.5 ? 0 : 1
      });
    }
    var frames = 0;
    (function anim() {
      ctx.clearRect(0, 0, W, H);
      frames++;
      var alive = false;
      parts.forEach(function (p) {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vx *= 0.99;
        if (p.y < H + 20) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0, 1 - frames / 160);
        if (p.shape === 0) ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.5);
        else { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 6.28); ctx.fill(); }
        ctx.restore();
      });
      if (alive && frames < 170) requestAnimationFrame(anim);
      else ctx.clearRect(0, 0, W, H);
    })();
  }
  // hook confetti into successful "yes" submit
  if (form) {
    form.addEventListener('submit', function () {
      setTimeout(function () {
        var att = form.querySelector('input[name="attend"]:checked');
        var ok = note && note.classList.contains('ok');
        if (ok && att && att.value === 'yes') fireConfetti();
      }, 30);
    });
  }

  /* ---------- DECOR: cherubs + petals from green raws ---------- */
  Promise.all([
    loadImg('assets/cherubs_raw.png?v=3'),
    loadImg('assets/flowers_raw.png?v=3')
  ]).then(function (imgs) {
    var chImg = imgs[0], flImg = imgs[1];

    // cherubs: split into left / right halves
    var cw = chImg.width, ch = chImg.height;
    var cherubL = chromaKey(chImg, 0, 0, cw / 2, ch);
    var cherubR = chromaKey(chImg, cw / 2, 0, cw / 2, ch);
    var elL = document.querySelector('.hero__cherub--l');
    var elR = document.querySelector('.hero__cherub--r');
    if (elL) { elL.style.backgroundImage = 'url(' + cherubL + ')'; elL.style.backgroundSize = 'contain'; elL.style.backgroundPosition = 'center'; }
    if (elR) { elR.style.backgroundImage = 'url(' + cherubR + ')'; elR.style.backgroundSize = 'contain'; elR.style.backgroundPosition = 'center'; }

    // flowers: split into pink (left) / orange (right)
    var fw = flImg.width, fh = flImg.height;
    var flowerPink = chromaKey(flImg, 0, 0, fw / 2, fh);
    var flowerOrange = chromaKey(flImg, fw / 2, 0, fw / 2, fh);

    // floating petals
    var petals = document.getElementById('petals');
    if (petals && !reduce) {
      var COUNT = window.innerWidth < 640 ? 7 : 12;
      for (var i = 0; i < COUNT; i++) {
        var p = document.createElement('div');
        var size = 26 + Math.random() * 44;
        p.className = 'petal';
        p.style.backgroundImage = 'url(' + (Math.random() > 0.5 ? flowerPink : flowerOrange) + ')';
        p.style.backgroundSize = 'contain';
        p.style.backgroundRepeat = 'no-repeat';
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = (Math.random() * 100) + 'vw';
        var dur = 14 + Math.random() * 16;
        var delay = -Math.random() * dur;
        p.style.animation = 'fall ' + dur + 's linear ' + delay + 's infinite';
        petals.appendChild(p);
      }
      var st = document.createElement('style');
      st.textContent =
        '@keyframes fall{' +
        '0%{transform:translateY(-10vh) rotate(0deg)}' +
        '100%{transform:translateY(110vh) rotate(360deg)}}';
      document.head.appendChild(st);
    }
  }).catch(function () { /* decor optional */ });

  /* ---------- LIGHTBOX (open photos) ---------- */
  (function () {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var lbImg = document.getElementById('lbImg');
    var btnClose = document.getElementById('lbClose');
    var btnPrev = document.getElementById('lbPrev');
    var btnNext = document.getElementById('lbNext');
    var imgs = Array.prototype.slice.call(document.querySelectorAll('img[data-lb]'));
    var idx = 0;

    function show(i) {
      idx = (i + imgs.length) % imgs.length;
      var src = imgs[idx].getAttribute('src');
      lbImg.src = src;
      lbImg.alt = imgs[idx].alt || '';
    }
    function open(i) {
      show(i);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    imgs.forEach(function (im, i) {
      im.style.cursor = 'zoom-in';
      im.addEventListener('click', function () { open(i); });
    });
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    btnNext.addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbImg) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  })();
})();
