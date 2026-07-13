/* ===== Wedding site logic ===== */
(function () {
  'use strict';

  var __assetPromises = []; // tracks decorative asset loads so splash preloader can wait for them

  /* ---------- BACKGROUND MUSIC + SOUND TOGGLE ----------
     A single looping track plays site-wide. Browsers block autoplay until a
     user gesture, so playback is kicked off from the wax-seal tap (see
     startMusic() called inside the splash's activateSeal). The on/off choice
     is stored in localStorage ('bg_sound') so it persists across reloads and
     navigation. The floating button (bottom-right, fixed) toggles it and is
     shown once the splash is dismissed. */
  var bgAudio = document.getElementById('bgAudio');
  var soundBtn = document.getElementById('soundBtn');
  // default ON: we WANT the music to greet guests; only stay off if the guest
  // explicitly muted it on a previous visit.
  var soundWanted = (function () {
    try { return localStorage.getItem('bg_sound') !== 'off'; } catch (e) { return true; }
  })();

  function reflectSoundUI() {
    if (!soundBtn) return;
    soundBtn.classList.toggle('is-on', soundWanted && bgAudio && !bgAudio.paused);
    soundBtn.setAttribute('aria-pressed', (soundWanted && bgAudio && !bgAudio.paused) ? 'true' : 'false');
  }

  function playMusic() {
    if (!bgAudio) return;
    bgAudio.volume = 0.55;
    var p = bgAudio.play();
    if (p && p.catch) {
      p.then(reflectSoundUI).catch(function () { reflectSoundUI(); });
    } else {
      reflectSoundUI();
    }
  }
  function pauseMusic() {
    if (!bgAudio) return;
    bgAudio.pause();
    reflectSoundUI();
  }

  // called once, from the wax-seal tap (a valid user gesture for autoplay)
  var musicStarted = false;
  function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    if (soundWanted) playMusic();
    else reflectSoundUI();
  }
  function showSoundBtn() {
    if (soundBtn) soundBtn.classList.add('soundbtn--ready');
  }

  if (soundBtn && bgAudio) {
    soundBtn.addEventListener('click', function () {
      soundWanted = !(soundWanted && !bgAudio.paused);
      if (soundWanted) {
        try { localStorage.setItem('bg_sound', 'on'); } catch (e) {}
        playMusic();
      } else {
        try { localStorage.setItem('bg_sound', 'off'); } catch (e) {}
        pauseMusic();
      }
    });
    // keep the icon in sync if playback state changes for any other reason
    bgAudio.addEventListener('play', reflectSoundUI);
    bgAudio.addEventListener('pause', reflectSoundUI);
    reflectSoundUI();
  }

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
    ['Где вообще всё это будет?',
     'Площадка Original. Точный адрес и схему проезда пришлём каждому гостю ближе к дате, не потеряетесь.'],
    ['Во сколько подтягиваться?',
     'Велком в 16:30, дальше программа, а в 19:00 — сама церемония. Опаздывать не надо, честно.'],
    ['Есть ли дресс-код?',
     'Да! Будет здорово, если вы поддержите нашу цветовую палитру. Главное — чтобы вам было комфортно, красиво и хотелось танцевать до самого вечера:)'],
    ['Как добраться до площадки?',
     'Проще всего на такси или своей машине, рядом есть парковка. Схему проезда пришлём вместе с подтверждением.'],
    ['Можно ли взять детей?',
     'Мы очень любим ваших малышей, но в этот раз хотим провести вечер в формате праздника для взрослых. Надеемся на ваше понимание и обещаем, что отлично проведём время вместе!'],
    ['До какого числа заполнить анкету?',
     'Будем благодарны, если вы подтвердите своё присутствие до 8 августа. Это очень поможет нам с организацией праздника)'],
    ['Что подарить?',
     'Больше всего мы будем рады денежному подарку, но любой знак внимания примем с благодарностью!'],
    ['Можно ли фотографировать?',
     'Конечно! Ловите самые счастливые моменты — нам будет очень приятно пересматривать этот день с разных ракурсов)'],
    ['Планы изменились после анкеты?',
     'Такое бывает( Если ваши планы изменились, просто сообщите об этом нашему свадебному организатору — мы всё обязательно решим.'],
    ['Остались вопросы?',
     'Если что-то непонятно или изменились планы — смело пишите или звоните нашему организатору Юле. Она знает о нашей свадьбе всё и иногда даже больше, чем мы:)',
     // trailing contact block rendered as real clickable links (tel: / t.me),
     // kept separate from the plain-text answer above which uses textContent
     '<p class="faq__contact"><a href="tel:+79003603951">📞 +7 900 360 3951</a><a href="https://t.me/yubudaevva" target="_blank" rel="noopener">@yubudaevva</a></p>']
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
      if (item[2]) ans.insertAdjacentHTML('beforeend', item[2]); // trusted, hardcoded contact links only
      wrap.appendChild(btn);
      wrap.appendChild(ans);
      faqBox.appendChild(wrap);
      btn.addEventListener('click', function () {
        wrap.classList.toggle('open');
      });
    });
  }

  /* ---------- TOAST (polished popup shown on top of the inline .rsvp__note) ---------- */
  var toastEl = document.getElementById('toast');
  var toastTitleEl = document.getElementById('toastTitle');
  var toastMsgEl = document.getElementById('toastMsg');
  var toastCloseBtn = document.getElementById('toastClose');
  var toastTimer = null;
  function showToast(type, title, msg) {
    if (!toastEl) return;
    toastEl.className = 'toast show toast--' + type;
    if (toastTitleEl) toastTitleEl.textContent = title;
    if (toastMsgEl) toastMsgEl.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4200);
  }
  function hideToast() {
    if (toastEl) toastEl.classList.remove('show');
  }
  if (toastCloseBtn) toastCloseBtn.addEventListener('click', hideToast);

  /* ---------- RSVP FORM ---------- */
  var form = document.getElementById('rsvpForm');
  var note = document.getElementById('rsvpNote');
  var DEADLINE = new Date('2026-08-08T23:59:59+03:00').getTime();

  // Backend API — submissions are stored server-side in Postgres (Railway),
  // so the couple can actually see the guest list (previously this only
  // lived in each guest's own browser localStorage and was never collected
  // anywhere). See server/index.js for the API implementation.
  var RSVP_API_URL = 'https://wedding-rsvp-api-production-d474.up.railway.app/api/rsvp';

  // localStorage is kept ONLY as a same-browser cache so the form can
  // prefill "you already answered" on a repeat visit, and as an offline
  // fallback if the request to the server fails (network down etc).
  function cacheRsvpLocally(data) {
    try {
      var list = JSON.parse(localStorage.getItem('rsvp_list') || '[]');
      list.push(data);
      localStorage.setItem('rsvp_list', JSON.stringify(list));
    } catch (e) { /* storage may be blocked */ }
  }

  // POST to the backend. Returns a promise that resolves with {ok, errors}.
  function submitRsvpToServer(data) {
    return fetch(RSVP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      return res.json().then(function (json) {
        return { ok: res.ok && json.ok, errors: json.errors || [] };
      });
    }).catch(function () {
      return { ok: false, errors: ['network'] };
    });
  }

  // Visibly highlight whichever "буду / не буду" option is selected — the
  // native radio dot alone is white-on-white here (see .opt.is-checked in
  // style.css) and was effectively invisible, so guests had no idea their
  // tap registered. Toggling a class in JS (rather than relying only on the
  // CSS `:has()` selector) keeps this working even in older in-app WebViews
  // (Telegram/Instagram Android) that may lack `:has()` support.
  function syncAttendOptionStyles() {
    if (!form) return;
    var radios = form.querySelectorAll('input[name="attend"]');
    for (var i = 0; i < radios.length; i++) {
      var label = radios[i].closest('.opt');
      if (label) label.classList.toggle('is-checked', radios[i].checked);
    }
  }
  if (form) {
    form.querySelectorAll('input[name="attend"]').forEach(function (r) {
      r.addEventListener('change', syncAttendOptionStyles);
    });
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
    syncAttendOptionStyles(); // reflect any prefilled choice immediately on load

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var contact = form.contact.value.trim();
      var attendEl = form.querySelector('input[name="attend"]:checked');

      if (!name || !contact || !attendEl) {
        note.textContent = 'Ой, что-то не заполнено — глянь ещё разок.';
        note.className = 'rsvp__note err';
        return;
      }
      if (Date.now() > DEADLINE) {
        note.textContent = 'Упс, анкеты уже не принимаем (дедлайн был 08.08.2026). Пиши нам в Telegram!';
        note.className = 'rsvp__note err';
        return;
      }

      var data = {
        name: name,
        contact: contact,
        attend: attendEl.value,
        ts: new Date().toISOString()
      };

      var submitBtn = form.querySelector('.rsvp__submit');
      var prevBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем…';
      note.className = 'rsvp__note';
      note.textContent = '';

      submitRsvpToServer(data).then(function (result) {
        submitBtn.disabled = false;
        if (result.ok) {
          // server has it now — cache locally too, purely so this browser
          // can prefill the form as "already answered" on a repeat visit
          cacheRsvpLocally(data);
          localStorage.setItem('rsvp_mine', JSON.stringify(data));
          note.className = 'rsvp__note ok';
          note.textContent = attendEl.value === 'yes'
            ? 'Ура! Спасибо, ждём вас 8 сентября ♥'
            : 'Спасибо, что дали знать. Будем скучать!';
          submitBtn.textContent = 'Обновить ответ';
          showToast('ok',
            attendEl.value === 'yes' ? 'Анкета отправлена ♥' : 'Анкета отправлена',
            attendEl.value === 'yes' ? 'Ура! Ждём вас 8 сентября.' : 'Спасибо, что дали знать — будем скучать!');
        } else if (result.errors.indexOf('network') !== -1) {
          // couldn't reach the server (offline / API down) — still save
          // locally so the answer isn't lost, but be upfront that the
          // organizers won't see it until the guest retries with connection.
          cacheRsvpLocally(data);
          localStorage.setItem('rsvp_mine', JSON.stringify(data));
          note.className = 'rsvp__note err';
          note.textContent = 'Не получилось отправить — проверь интернет и попробуй ещё раз. Если не выйдет, напиши нам в Telegram!';
          submitBtn.textContent = prevBtnText;
          showToast('err', 'Не получилось отправить', 'Сохранили в этом браузере — попробуй ещё раз, когда будет интернет.');
        } else {
          note.className = 'rsvp__note err';
          note.textContent = 'Ой, что-то не заполнено — глянь ещё разок.';
          submitBtn.textContent = prevBtnText;
        }
      });
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

  function loadImg(src, retries) {
    retries = retries == null ? 2 : retries; // survive transient mobile-network blips
    return new Promise(function (res, rej) {
      function attempt(triesLeft) {
        var im = new Image();
        im.crossOrigin = 'anonymous';
        im.onload = function () { res(im); };
        im.onerror = function () {
          if (triesLeft > 0) {
            setTimeout(function () { attempt(triesLeft - 1); }, 700);
          } else {
            rej(new Error('failed to load ' + src));
          }
        };
        im.src = src + (src.indexOf('?') === -1 ? '?r=' : '&r=') + triesLeft;
      }
      attempt(retries);
    });
  }

  // run heavy work (canvas decode) off the critical rendering path so it never
  // blocks scroll/input responsiveness right after the splash reveal
  function whenIdle(fn) {
    if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout: 2000 });
    else setTimeout(fn, 60);
  }

  // Pause CSS animations on decorative elements (sideflowers, cherubs, big
  // flowers) while they're far off-screen. With ~15-30 continuously-animated,
  // drop-shadow-filtered decor layers spread down a page ~16 viewports tall,
  // keeping ALL of them compositing at once is a real scroll-jank source on
  // low/mid-range phones — this cuts active work down to only what's near
  // the viewport at any given moment.
  var __decorIO = null;
  function pauseOffscreenDecor(els) {
    if (reduce || !('IntersectionObserver' in window)) {
      // no IO support (very old browser) or reduced-motion: skip the
      // pause/observe machinery entirely, but still flag elements as
      // "visible" so the scroll-parallax loop keeps updating them normally.
      (els || []).forEach(function (el) { el.dataset.decorVisible = '1'; });
      return;
    }
    if (!__decorIO) {
      __decorIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          en.target.style.animationPlayState = en.isIntersecting ? 'running' : 'paused';
          if (en.isIntersecting) en.target.dataset.decorVisible = '1';
          else delete en.target.dataset.decorVisible;
        });
      }, { rootMargin: '250px 0px' });
    }
    (els || []).forEach(function (el) { __decorIO.observe(el); });
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
  __assetPromises.push(loadImg('assets/icons2_raw.png?v=2').then(function (icImg) {
    return new Promise(function (resolve) {
      whenIdle(function () {
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
        resolve();
      });
    });
  }).catch(function () {}));

  /* ---------- PROGRAM ILLUSTRATIONS (pre-transparent PNGs, wedding-clipart style) ----------
     v3: replaced old green-screen-sprite + runtime chromaKey() canvas decode with plain
     individually pre-cropped, already-transparent PNGs. No canvas work needed at all here
     anymore -> one less main-thread-blocking decode step (see pinned perf notes re: mobile
     scroll jank from heavy canvas getImageData/putImageData on the old sprite sheets). */
  var PROG_ICONS = [
    'assets/prog_icons_v3/prog_0.webp', // Велком      – welcome drink (hand + coupe glass)
    'assets/prog_icons_v3/prog_1.webp', // Первый блок – vintage mic
    'assets/prog_icons_v3/prog_2.webp', // Муз пауза   – vinyl record
    'assets/prog_icons_v3/prog_3.webp', // Второй блок – confetti popper
    'assets/prog_icons_v3/prog_4.webp', // Церемония   – wedding rings + heart
    'assets/prog_icons_v3/prog_5.webp', // Вечеринка   – clinking cocktails
    'assets/prog_icons_v3/prog_6.webp'  // Торт        – wedding cake + slice
  ];
  document.querySelectorAll('.prog__img').forEach(function (el) {
    var idx = parseInt(el.getAttribute('data-prog'), 10);
    var src = PROG_ICONS[idx];
    if (!src) return;
    el.style.backgroundImage = 'url(' + src + ')';
    el.style.backgroundSize = 'contain';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';
  });

  /* ---------- BIG HALF-PAGE FLOWERS (green raw) ---------- */
  __assetPromises.push(loadImg('assets/bigflower_raw.png?v=2').then(function (bf) {
    return new Promise(function (resolve) {
      whenIdle(function () {
        var url = chromaKey(bf, 0, 0, bf.width, bf.height);
        var bfEls = document.querySelectorAll('.bigflower');
        bfEls.forEach(function (el) {
          el.style.backgroundImage = 'url(' + url + ')';
        });
        pauseOffscreenDecor(Array.prototype.slice.call(bfEls));
        resolve();
      });
    });
  }).catch(function () {}));

  /* ---------- BIG SIDE STAR-FLOWERS scattered along the page ---------- */
  __assetPromises.push(loadImg('assets/sideflowers_raw.png?v=2').then(function (sf) {
    return new Promise(function (resolve) {
      whenIdle(function () {
        var half = sf.width / 2;
        var lime = chromaKey(sf, 0, 0, half, sf.height);
        var orange = chromaKey(sf, half, 0, half, sf.height);
        var host = document.getElementById('sideflowers');
        if (!host) { resolve(); return; }
        // extra hue-rotate tints so consecutive flowers down the page differ in color
        // (base art only comes in 2 colors, so we recolor via CSS filter for real variety)
        var TINTS = [
          { hue: 0,    sat: 1 },      // as painted (lime / orange)
          { hue: 300,  sat: 0.9 },    // -> pink/fuchsia
          { hue: 195,  sat: 0.85 },   // -> blue
          { hue: 255,  sat: 0.8 },    // -> lilac/purple
          { hue: 40,   sat: 1.05 }    // -> warm yellow
        ];
        // {top(vh), side, offset(vw), size(vw), img, rot}
        // spread big side-flowers down the WHOLE page (page is ~16x viewport tall),
        // alternating left/right so every section (incl. dresscode) gets large flowers
        var docVH = (document.body.scrollHeight / window.innerHeight) * 100; // total page height in vh
        // fewer, further-apart flowers on narrow phones: each one is an
        // animated, drop-shadow-filtered layer, and having ~30 of them
        // compositing at once is a real scroll-jank contributor on low/mid
        // range Android devices (esp. inside Telegram's in-app webview).
        var STEP = window.innerWidth < 640 ? 78 : 52; // vertical gap between flowers (vh)
        var start = 50;                // start a bit below hero
        var SPOTS = [];
        var toggle = 0;
        for (var ty = start; ty < docVH - 20; ty += STEP) {
          var side = (toggle % 2 === 0) ? 'left' : 'right';
          var img = (toggle % 2 === 0) ? lime : orange;
          var size = 30 + (toggle % 3) * 3;                 // 30..36vw (big, hero-scale)
          var off = -13 - (toggle % 3) * 2;                 // -13..-17vw: only outer petals overlay edges
          var rot = (toggle % 2 === 0 ? -1 : 1) * (8 + (toggle % 4) * 4);
          var tint = TINTS[toggle % TINTS.length];
          SPOTS.push([Math.round(ty), side, off, size, img, rot, tint]);
          toggle++;
        }
        var flowerEls = [];
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
          var t = s[6];
          if (t.hue !== 0) {
            el.style.filter = 'hue-rotate(' + t.hue + 'deg) saturate(' + t.sat + ') drop-shadow(0 10px 22px rgba(42,36,29,.14))';
          }
          host.appendChild(el);
          flowerEls.push(el);
        });
        pauseOffscreenDecor(flowerEls);
        resolve();
      });
    });
  }).catch(function () {}));

  /* ---------- REVEAL ON SCROLL ---------- */
  /* ---------- SCALLOP FRINGE (decorative macrame-style hem) ---------- */
  // Every .sec gets its own trailing scalloped "fringe" strip glued flush to
  // ITS OWN bottom edge (own color, own section — never coupled to whatever
  // comes next). This is different from the old design (removed earlier)
  // where a connector div was inserted only between two DIFFERENT-colored
  // sections and literally fused them together with zero gap — that read as
  // "blocks glued together" once spacing was increased. Here the fringe is
  // purely a decoration OWNED by the section above it: we flatten that
  // section's own bottom corners + zero its own bottom margin (so the strip
  // sits flush, no gap, no seam), then let the NEXT section keep its normal
  // full border-radius + full margin-top untouched — that margin is exactly
  // what creates the clear, unambiguous gap between one card's fringe and
  // the next card. Because the strip is a permanent child of its own
  // section (not conditionally inserted based on a neighbor's color), it
  // can never desync from that section during the reveal animation either.
  // Scalloped fringe/hem fully removed per user request — every .sec now just
  // keeps its own rounded-card shape with normal margins (no decorative strip
  // between blocks at all). Left as a no-op so the reveal() code below that
  // looks for `.scallop-div` siblings simply never finds any.
  (function scallops() { /* intentionally disabled — fringe removed */ })();

  (function reveal() {
    var secs = document.querySelectorAll('main .sec, .hero__photos');
    secs.forEach(function (s) { if (!s.classList.contains('hero__photos')) s.classList.add('reveal'); });
    var prog = document.querySelector('.program'); if (prog) prog.classList.add('reveal-stagger');
    var gal = document.querySelector('.venue__gallery'); if (gal) gal.classList.add('reveal-stagger');
    var hp = document.querySelector('.hero__photos'); if (hp) hp.classList.add('reveal-stagger', 'in');

    // The scalloped fringe strip is now a PERMANENT child of its own section
    // (appended right after it in the DOM by scallops() above, which runs
    // before this so the divs already exist here) — it must fade in/out in
    // perfect lockstep with the section it's attached to, never on its own
    // independent timer. It's only ~11-16px tall, so on its own it would
    // cross the 12%-visible IntersectionObserver threshold almost the
    // instant its top edge scrolls into view (a sliver that small reads as
    // "12% visible" after just a couple of pixels), long before the much
    // taller section above it reaches that same 12% mark. That timing
    // mismatch used to make the colored fringe pop in fully-opaque and sit
    // there alone while its own section was still fading in above it. Fix:
    // give it the same .reveal opacity treatment, but never observe it
    // independently (see the io.observe selector below) — instead flip it to
    // .in in the exact same animation frame as the section that owns it, via
    // a nextElementSibling lookup inside that section's own IO entry.
    document.querySelectorAll('.scallop-div').forEach(function (d) { d.classList.add('reveal'); });

    if (reduce || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal,.reveal-stagger').forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          // pull this section's own trailing fringe along with it, same frame
          var nextSib = en.target.nextElementSibling;
          if (nextSib && nextSib.classList.contains('scallop-div')) nextSib.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    // scallop-div elements are deliberately excluded from the observed set
    // (see comment above) — only real sections/stagger groups get their own
    // trigger; scallops piggyback on their neighbor's trigger instead.
    document.querySelectorAll('.reveal:not(.scallop-div),.reveal-stagger').forEach(function (e) { io.observe(e); });
  })();



  /* ---------- PROGRAM TIMELINE: scroll-draw line + parallax steps ---------- */
  (function programLine() {
    var wrap = document.querySelector('.program__wrap');
    var fill = document.querySelector('.program__track-fill');
    var bg = document.querySelector('.program__track-bg');
    if (!wrap || !fill) return;

    function update() {
      var r = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      // fill grows from 0% to 100% as the timeline scrolls through the viewport
      var total = r.height + vh * 0.55;
      var passed = vh * 0.85 - r.top;
      var p = Math.max(0, Math.min(1, passed / total));
      fill.style.height = (p * 100).toFixed(1) + '%';

      if (bg && !reduce) {
        var center = r.top + r.height / 2;
        var delta = (vh / 2 - center) * 0.08;
        bg.style.transform = 'translateY(' + delta.toFixed(1) + 'px)';
      }
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  /* ---------- PARALLAX: side flowers + hero cherubs + big flowers ---------- */
  if (!reduce) {
    function clampPx(v, max) { return Math.max(-max, Math.min(max, v)); }
    var cherubL = document.querySelector('.hero__cherub--l');
    var cherubR = document.querySelector('.hero__cherub--r');
    var bigTL = document.querySelector('.bigflower--tl');
    var bigBR = document.querySelector('.bigflower--br');
    var pxTicking = false;
    window.addEventListener('scroll', function () {
      if (pxTicking) return;
      pxTicking = true;
      requestAnimationFrame(function () {
        var y = window.pageYOffset;
        document.querySelectorAll('.sideflower').forEach(function (el, i) {
          if (!el.dataset.decorVisible) return; // paused/off-screen, skip the write
          var speed = (i % 2 === 0 ? 0.06 : -0.05) * (1 + (i % 3) * 0.3);
          el.style.setProperty('--px', (y * speed).toFixed(1) + 'px');
        });
        // cherubs drift opposite directions at gentle depth-of-field speeds
        if (cherubL) cherubL.style.setProperty('--ppx', clampPx(y * 0.10, 70).toFixed(1) + 'px');
        if (cherubR) cherubR.style.setProperty('--ppx', clampPx(y * -0.13, 70).toFixed(1) + 'px');
        // big decorative flowers drift slower/subtler (background depth layer)
        if (bigTL) bigTL.style.setProperty('--ppx', clampPx(y * 0.05, 90).toFixed(1) + 'px');
        if (bigBR) bigBR.style.setProperty('--ppx', clampPx(y * -0.06, 90).toFixed(1) + 'px');
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
  __assetPromises.push(Promise.all([
    loadImg('assets/cherubs_raw.png?v=4'),
    loadImg('assets/flowers_raw.png?v=4')
  ]).then(function (imgs) {
    return new Promise(function (resolve) {
      whenIdle(function () {
        var chImg = imgs[0], flImg = imgs[1];

        // cherubs: split into left / right halves
        var cw = chImg.width, ch = chImg.height;
        var cherubL = chromaKey(chImg, 0, 0, cw / 2, ch);
        var cherubR = chromaKey(chImg, cw / 2, 0, cw / 2, ch);
        var elL = document.querySelector('.hero__cherub--l');
        var elR = document.querySelector('.hero__cherub--r');
        if (elL) { elL.style.backgroundImage = 'url(' + cherubL + ')'; elL.style.backgroundSize = 'contain'; elL.style.backgroundPosition = 'center'; }
        if (elR) { elR.style.backgroundImage = 'url(' + cherubR + ')'; elR.style.backgroundSize = 'contain'; elR.style.backgroundPosition = 'center'; }
        pauseOffscreenDecor([elL, elR].filter(Boolean));

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
        resolve();
      });
    });
  }).catch(function () { /* decor optional */ }));

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

    /* ---- touch gestures: swipe left/right = prev/next, swipe down = close ---- */
    var tStartX = 0, tStartY = 0, tCurX = 0, tCurY = 0, tDragging = false;
    lb.addEventListener('touchstart', function (e) {
      if (!lb.classList.contains('open') || e.touches.length !== 1) return;
      tStartX = tCurX = e.touches[0].clientX;
      tStartY = tCurY = e.touches[0].clientY;
      tDragging = true;
      lbImg.style.transition = 'none';
    }, { passive: true });
    lb.addEventListener('touchmove', function (e) {
      if (!tDragging || e.touches.length !== 1) return;
      tCurX = e.touches[0].clientX;
      tCurY = e.touches[0].clientY;
      var dx = tCurX - tStartX, dy = tCurY - tStartY;
      // follow the finger a little for visual feedback (drag-to-dismiss feel)
      if (Math.abs(dy) > Math.abs(dx)) {
        lbImg.style.transform = 'translateY(' + (dy * 0.5) + 'px) scale(' + Math.max(0.85, 1 - Math.abs(dy) / 1400) + ')';
      } else {
        lbImg.style.transform = 'translateX(' + (dx * 0.4) + 'px)';
      }
    }, { passive: true });
    lb.addEventListener('touchend', function () {
      if (!tDragging) return;
      tDragging = false;
      lbImg.style.transition = '';
      lbImg.style.transform = '';
      var dx = tCurX - tStartX, dy = tCurY - tStartY;
      var absX = Math.abs(dx), absY = Math.abs(dy);
      var SWIPE_MIN = 46;
      if (absY > absX && dy > 70) {
        close();                              // swipe down -> dismiss
      } else if (absX > absY && absX > SWIPE_MIN) {
        show(idx + (dx < 0 ? 1 : -1));         // swipe left -> next, right -> prev
      }
    });
  })();

  /* ---------- SPLASH SCREEN (envelope + wax seal reveal) ---------- */
  (function () {
    var splash = document.getElementById('splash');
    var sealBtn = document.getElementById('sealButton');
    var preloader = document.getElementById('preloader');
    if (!splash || !sealBtn) return;

    /* ---- Scroll lock (webview-safe: event-blocking only, NO layout change) ----
       IMPORTANT: this invite is shared mainly via Telegram (contacts are t.me
       handles), so guests open it inside Telegram's IN-APP BROWSER (WebView),
       not real mobile Safari/Chrome. The classic "freeze body with
       position:fixed" technique is well known to PERMANENTLY break scrolling
       in Telegram/Instagram/WeChat/some Android in-app webviews: removing
       position:fixed afterwards sometimes leaves the page scroll-locked
       forever, because it conflicts with the webview's own compositing of
       <body>. We deliberately do NOT touch body's position/layout at all.
       Instead we block scrolling purely at the event level — preventDefault()
       on touchmove/wheel while the splash is up, document-wide (touchstart is
       deliberately NOT blocked — see note below, it would break the seal tap).
       This never modifies layout, so it can never get permanently "stuck".
       CSS also sets touch-action:none directly on .splash (compositor-level
       block, works even before JS attaches listeners) as a second, completely
       independent layer that needs zero cleanup. */
    // IMPORTANT: never block 'touchstart' here — calling preventDefault() on
    // touchstart stops mobile browsers from synthesizing the 'click' event
    // afterwards, which silently broke tapping the seal button itself (the
    // tap did nothing because the click handler below never fired). Blocking
    // 'touchmove' alone is enough to stop scrolling — touchstart by itself
    // never scrolls anything.
    // NOTE: touch scrolling is blocked purely via the CSS `touch-action:none`
    // rule on `.splash` itself (see style.css) — that needs ZERO JS cleanup,
    // because touch-action is only evaluated on the element the touch
    // *starts* on: once `.splash` gets `pointer-events:none` (via the
    // `.hidden` class in finishReveal) it's no longer hit-tested at all, so
    // touch-action stops applying automatically. We deliberately do NOT also
    // block 'touchmove' at the document level in JS anymore — a prior
    // version did, and a document-wide touchmove listener that fails to
    // detach cleanly (some Telegram/Instagram in-app Android WebViews are
    // known to mishandle removeEventListener timing during compositor
    // transitions) was the prime suspect for guests getting permanently
    // stuck unable to scroll after opening the envelope. Only 'wheel' still
    // needs a JS block, because mouse-wheel-over-a-non-scrollable-overlay
    // bubbles up to scroll the body regardless of touch-action.
    function blockWheel(e) { e.preventDefault(); }
    function lockBodyScroll() {
      document.documentElement.classList.add('splash-active');
      document.body.classList.add('splash-active');
      document.addEventListener('wheel', blockWheel, { passive: false });
    }
    function unlockBodyScroll() {
      document.documentElement.classList.remove('splash-active');
      document.body.classList.remove('splash-active');
      document.removeEventListener('wheel', blockWheel, { passive: false });
      // hard-reset overflow inline as an extra safety net beyond the class
      // removal above (guards against any stray inline overflow from other
      // code paths, e.g. an interrupted lightbox open/close).
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      // Belt-and-suspenders: force the CSS touch-action:none rule off via an
      // inline style that wins regardless of specificity, in case some
      // WebView keeps hit-testing a technically-hidden element.
      if (splash) { splash.style.touchAction = 'auto'; splash.style.pointerEvents = 'none'; }
      // Firefox/WebKit trackpad-scroll quirk: if the seal button (now
      // display:none) keeps DOM focus, some browsers refuse to route
      // wheel/keyboard scroll until focus moves elsewhere. Explicitly blur it.
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
    }

    lockBodyScroll();

    var MIN_PRELOAD_MS = 900;   // keep preloader visible at least this long once shown
    var startTs = Date.now();
    var siteReady = false;
    var userClicked = false;
    var preloaderShownAt = 0;

    // "ready" = window fully loaded (all <img> etc. declared in the HTML — hero
    // photos, envelope, wax seal). We deliberately do NOT wait on the heavy
    // decorative sprite sheets (icons/program illustrations/flowers/cherubs,
    // ~14MB total, loaded dynamically via JS) — on a slow mobile connection
    // that download can take a long time or stall, which used to trap guests
    // behind the splash screen and made the whole experience feel broken.
    // Those assets now load fully independently in the background (with their
    // own retry logic in loadImg) and simply fade their icons/decor in
    // whenever they arrive, even after the site is already revealed.
    var loadEvt = new Promise(function (res) {
      if (document.readyState === 'complete') res();
      else window.addEventListener('load', res, { once: true });
    });
    // swallow any decor failures so a rejected promise never surfaces as an
    // unhandled rejection anywhere else in the app
    __assetPromises.forEach(function (p) { p.catch(function () {}); });

    function finishReveal() {
      splash.classList.add('hidden');
      showSoundBtn(); // reveal the floating music toggle now that the site is visible
      unlockBodyScroll(); // idempotent safety-net re-call, see activateSeal below
      setTimeout(function () {
        if (splash) splash.style.display = 'none';
      }, 850);
    }

    function markReady() {
      siteReady = true;
      if (!userClicked) return; // wait for the click — reveal only happens after seal is opened
      if (preloader && preloader.classList.contains('active')) {
        var shownFor = Date.now() - preloaderShownAt;
        var wait = Math.max(0, MIN_PRELOAD_MS - shownFor);
        setTimeout(finishReveal, wait);
      } else {
        finishReveal();
      }
    }

    loadEvt.then(function () {
      var elapsed = Date.now() - startTs;
      setTimeout(markReady, Math.max(0, 300 - elapsed)); // tiny grace period so it never feels instant
    });

    function activateSeal(e) {
      if (userClicked) return;
      userClicked = true;
      if (e && e.cancelable) e.preventDefault(); // stop a duplicate synthetic 'click' from firing after 'touchend'
      splash.classList.add('open-animation');

      // kick off background music here — the seal tap is a genuine user
      // gesture, which is exactly what browsers require before they'll allow
      // audio playback (autoplay is blocked otherwise).
      startMusic();

      // MOBILE FIX: unlock scroll/touch RIGHT NOW, at tap-time, instead of
      // waiting for the ~550ms opening animation to finish (that used to
      // happen only inside finishReveal). Reason: touch-action is decided
      // once per gesture, at touchstart, and never re-evaluated mid-gesture.
      // A guest who taps the seal and then almost immediately swipes down
      // (very common - people tap then instantly try to scroll) generates a
      // NEW touchstart that, while the splash overlay was still sitting on
      // top with touch-action:none, got permanently marked as "blocked" for
      // its whole duration - so that first swipe silently did nothing, and
      // only a second, later swipe (once the overlay had pointer-events:none)
      // actually scrolled. That's exactly the "not from the first try"
      // scrolling bug on phones. Making the overlay stop intercepting touches
      // immediately (it's still visible/opaque and fading out purely
      // visually) means ANY swipe from this point on reaches the real page
      // and scrolls right away, first try.
      unlockBodyScroll();

      if (siteReady) {
        // let the envelope-opening animation play, then reveal the site
        setTimeout(finishReveal, 550);
      } else {
        // main site is still loading its assets -> show the preloader spinner
        preloaderShownAt = Date.now();
        setTimeout(function () {
          if (preloader) preloader.classList.add('active');
        }, 450);
      }
    }
    // 'touchend' fires first on real touch devices and is handled here as the
    // primary path (with preventDefault to stop the ~300ms-later synthetic
    // 'click' from double-firing); 'click' remains as the fallback for mouse/
    // keyboard/any webview that doesn't fire touch events reliably.
    sealBtn.addEventListener('touchend', activateSeal, { passive: false });
    sealBtn.addEventListener('click', activateSeal);

    // safety net: never trap the guest behind the splash for more than ~8s
    setTimeout(function () {
      if (!siteReady) { siteReady = true; if (userClicked) finishReveal(); }
    }, 8000);
  })();
})();
