(function() {
  var waitFor = {
    // story sequence
    playClickDelay: 1 * 1000,
    logoFadeIn: 6 * 1000,
    musicCrescendoStart: 27.5 * 1000,
    musicCrescendoEnd: 39.3 * 1000,
    logoFlyAcrossSome: 46 * 1000,
    logoFlyAcrossSomeMore: 72 * 1000,

    // dialog
    dialogStartDelay: 2 * 1000,
    dialogContinueDelay: 0.25 * 1000,
    dialogCloseDelay: 5 * 1000
  };
  // dialog text
  var text1 =
    "they thought they didn't know anything but,\n" +
    "they made the most" +
    " amazing videoGames ever.";
  var text2 =
    "And now they are ready to fly among The\n" +
    "stars, to backend and beyond...";

  // cache jQuery wrappers
  var $body = $("body");
  var $getReady = $(".get-ready");
  var $splash = $(".splash");
  var $start = $(".start");
  var $logo = $(".logo");
  var $dialog = $(".dialog");
  var $theEnd = $(".the-end");
  var $audio = $("audio");
  var $bliss = $(".bliss");
  var $tobe = $(".tobe");

  // cache audio elements
  var music = document.getElementById("music");
  var play = document.getElementById("play");
  var typing = document.getElementById("typing");

  // other vars
  var preloadsRemaining;
  var isAudioEnabled;

  // this kicks everything off
  startPreloads();

  function startPreloads() {
    preloadsRemaining = 0;

    // audio is a hassle on mobile, disabling until future Will decides to revisit
    isAudioEnabled = !/android|iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isAudioEnabled) {
      $audio.each(addPreload);
    }

    // immediate check in case everything is cached or audio is disabled
    checkPreloadsRemaining();
  }

  function addPreload(index, audio) {
    if (audio.readyState !== 4) {
      preloadsRemaining++;
      audio.addEventListener(
        "canplaythrough",
        decrementPreloadsRemaining,
        false
      );
    }
  }

  function decrementPreloadsRemaining() {
    preloadsRemaining--;
    checkPreloadsRemaining();
  }

  function checkPreloadsRemaining() {
    if (preloadsRemaining === 0) {
      showSplash();
    }
  }

  function playAudio(audio) {
    if (isAudioEnabled) {
      audio.play();
    }
  }

  function showSplash() {
    $getReady.hide();
    $splash.show();
    $start.prop("disabled", false);
    $start.on("click", start);
  }

  function start() {
    $start.prop("disabled", true);
    playAudio(play);
    setTimeout(playCutscene, waitFor.playClickDelay);
  }

  function playCutscene() {
    $splash.hide();
    $logo.show();
    playAudio(music);

    setTimeout(startDialog.bind(this, text1), waitFor.toastFadeIn);
    setTimeout(logoFlyUp, waitFor.musicCrescendoStart);
    setTimeout(logoFlyAcross, waitFor.musicCrescendoEnd);
    setTimeout(startDialog.bind(this, text2), waitFor.logoFlyAcrossSome);
    setTimeout(showTheEnd, waitFor.logoFlyAcrossSomeMore);
  }

  function startDialog(text) {
    $dialog.show();
    setTimeout(continueDialog.bind(this, text), waitFor.dialogStartDelay);
  }

  function continueDialog(text) {
    var char = text.charAt(0);
    $dialog.append(char);

    if (/\S/.test(char)) {
      playAudio(typing);
    }

    text = text.slice(1);
    if (text.length > 0) {
      setTimeout(continueDialog.bind(this, text), waitFor.dialogContinueDelay);
    } else {
      setTimeout(closeDialog, waitFor.dialogCloseDelay);
    }
  }

  function closeDialog() {
    //$dialog.hide().empty();
    $dialog.empty();
    $dialog.addClass("close");
    setTimeout(function() {
      $dialog.removeClass("close");
      $dialog.hide();
    }, 1000);
  }

  function showTheEnd() {
    $theEnd.show();
    $bliss.show();
    $tobe.show();
  }

  function logoFlyUp() {
    $body.addClass("fly-up");
  }

  function logoFlyAcross() {
    $body.removeClass("fly-up").addClass("fly-across");
  }
})();
