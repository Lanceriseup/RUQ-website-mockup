// VSL playback: autoplay muted and looping on load, unmute on click.
//
// Browsers block autoplay with sound, universally and by design. Wistia's
// silentAutoPlay option is the supported way to ask for muted autoplay; the
// video then plays as an ambient loop until someone opts into sound.
//
// Unmuting goes through Wistia's JS API rather than reloading the iframe with
// different parameters, so playback is not interrupted. Clicking also seeks
// back to 0, because the first real view should start at the beginning rather
// than wherever the silent loop happened to be.
(function () {
  'use strict';

  var mount = document.querySelector('[data-vsl-id]');
  if (!mount) return;

  var ID = mount.dataset.vslId;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;

  function soundBadgesOn() {
    document.querySelectorAll('.vsl-sound').forEach(function (b) {
      b.querySelector('.vsl-icon-muted').classList.add('hidden');
      b.querySelector('.vsl-icon-on').classList.remove('hidden');
      b.querySelector('.vsl-label').textContent = 'Sound on';
      b.classList.add('opacity-0', 'pointer-events-none');
    });
  }

  // A local MP4 in the same frame (the about hero's promo). No autoplay
  // (2026-11-10): it waits on its poster, and the play button, or the
  // picture, starts it with sound. Then the native controls own the clicks.
  var native = mount.querySelector('[data-vsl-video]');
  if (native) {
    var on = false;
    var stageEl = mount.querySelector('[data-vsl-stage]');
    var playBtn = mount.querySelector('[data-vsl-play]');
    var vig = mount.querySelector('.vsl-vig');
    function nativePlay() {
      if (on) return;
      on = true;
      if (stageEl) stageEl.classList.add('is-playing');
      if (playBtn) playBtn.hidden = true;
      if (vig) vig.hidden = true;
      native.muted = false; native.controls = true;
      var p = native.play(); if (p && p.catch) p.catch(function () {});
    }
    mount.addEventListener('click', nativePlay);
    return;
  }

  window._wq = window._wq || [];
  window._wq.push({
    id: ID,
    options: {
      // No silent autoplay for reduced-motion or metered connections: those
      // visitors get a poster and an explicit play button instead.
      autoPlay: !(reduced || saveData),
      silentAutoPlay: (reduced || saveData) ? false : 'allow',
      muted: !(reduced || saveData),
      endVideoBehavior: 'loop',
      playbar: false,
      controlsVisibleOnLoad: false,
      settingsControl: false,
      qualityControl: false,
      smallPlayButton: false,
      fullscreenButton: true,
      playButton: (reduced || saveData),
      videoFoam: true,
    },
    onReady: function (video) {
      var unmuted = false;

      // The frame opens here rather than on load. The video is already
      // playing as a silent loop when the page arrives; the moment worth
      // marking is someone choosing to actually watch it, which is the same
      // moment the about hero's play button represents.
      var stage = mount.querySelector('[data-vsl-stage]');

      function turnOnSound() {
        if (unmuted) return;
        unmuted = true;
        if (stage) stage.classList.add('is-playing');
        try {
          video.unmute();
          video.time(0);
          video.play();
        } catch (e) { /* API shape changed — the player still works muted */ }

        soundBadgesOn();
      }

      // Either the badge or the video surface itself starts sound.
      document.querySelectorAll('.vsl-sound').forEach(function (b) {
        b.addEventListener('click', function (e) { e.stopPropagation(); turnOnSound(); });
      });
      video.bind('play', function () { /* keeps Wistia's own play button working */ });
      mount.addEventListener('click', turnOnSound);
    },
  });
})();
