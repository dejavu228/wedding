/* ==========================================================================
   СВАДЬБА ИСЛАМА И ЖАСМИНЫ — СКРИПТ
   Никакие данные посетителя не собираются и никуда не отправляются.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. ОБРАТНЫЙ ОТСЧЁТ ДО СВАДЬБЫ
     ------------------------------------------------------------------
     Дата и время свадьбы заданы ниже. При необходимости измените их —
     это единственное место, где нужно вносить изменения.
     Указан часовой пояс Шымкента (Казахстан, UTC+5).
  ------------------------------------------------------------------ */
  var WEDDING_DATE_ISO = '2026-08-03T19:00:00+05:00';
  var weddingDate = new Date(WEDDING_DATE_ISO);

  var elDays = document.getElementById('cd-days');
  var elHours = document.getElementById('cd-hours');
  var elMinutes = document.getElementById('cd-minutes');
  var elSeconds = document.getElementById('cd-seconds');
  var elTimer = document.getElementById('countdown-timer');
  var elDone = document.getElementById('countdown-done');

  var countdownIntervalId = null;

  function pad(number) {
    return String(number).padStart(2, '0');
  }

  function updateCountdown() {
    var now = new Date();
    var diff = weddingDate.getTime() - now.getTime();

    if (diff <= 0) {
      // Свадьба наступила — останавливаем таймер и показываем поздравительную надпись
      clearInterval(countdownIntervalId);
      if (elTimer) elTimer.hidden = true;
      if (elDone) elDone.hidden = false;
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    if (elDays) elDays.textContent = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMinutes) elMinutes.textContent = pad(minutes);
    if (elSeconds) elSeconds.textContent = pad(seconds);
  }

  if (elTimer) {
    updateCountdown();
    countdownIntervalId = setInterval(updateCountdown, 1000);
  }

  /* ------------------------------------------------------------------
     2. ФОНОВАЯ МУЗЫКА
     ------------------------------------------------------------------
     Файл музыки можно заменить: music/wedding.mp3
  ------------------------------------------------------------------ */
  var audio = document.getElementById('wedding-audio');
  var musicToggle = document.getElementById('music-toggle');
  var isPlaying = false;

  function setPlayingState(playing) {
    isPlaying = playing;
    if (!musicToggle) return;
    musicToggle.classList.toggle('is-playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
  }

  // Пытаемся запустить музыку автоматически при загрузке страницы.
  // Многие мобильные браузеры блокируют автовоспроизведение со звуком —
  // в этом случае просто ничего не делаем и ждём нажатия кнопки пользователем.
  function tryAutoplay() {
    if (!audio) return;
    var playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(function () {
          setPlayingState(true);
        })
        .catch(function () {
          // Автовоспроизведение заблокировано браузером — это нормально,
          // сайт продолжает работать без ошибок.
          setPlayingState(false);
        });
    }
  }

  window.addEventListener('load', tryAutoplay);

  if (musicToggle && audio) {
    musicToggle.addEventListener('click', function () {
      if (isPlaying) {
        audio.pause();
        setPlayingState(false);
      } else {
        audio.play()
          .then(function () {
            setPlayingState(true);
          })
          .catch(function () {
            setPlayingState(false);
          });
      }
    });
  }

  /* ------------------------------------------------------------------
     3. ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ ПРОКРУТКЕ (IntersectionObserver)
     ------------------------------------------------------------------ */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Если пользователь отключил анимации в системе — просто показываем всё сразу
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }
})();
