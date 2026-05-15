<<<<<<< HEAD
/* ==============================
   GAME HUB JAVASCRIPT
================================= */

=======
>>>>>>> 1f44c87b5d66bbe8b5b9f1d8cd8487396b24dd35
const stage = document.getElementById('stage');
const currentGame = document.getElementById('currentGame');
const placeholder = document.getElementById('placeholder');
const buttons = document.querySelectorAll('.game-btn');

function loadGame(path, btn) {
  stage.src = path;
  currentGame.textContent = btn.textContent;

  placeholder.classList.add('hidden');
  stage.classList.remove('hidden');

  buttons.forEach(b => b.removeAttribute('aria-current'));
  btn.setAttribute('aria-current', 'page');

  stage.animate(
    [
      { opacity: 0, transform: 'translateY(14px) scale(0.99)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ],
    {
      duration: 380,
      easing: 'ease-out'
    }
  );
}

<<<<<<< HEAD
if (stage && currentGame && placeholder && buttons.length > 0) {
  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const path = this.getAttribute('data-path');
      loadGame(path, this);
    });
  });
}


/* ==============================
   COREBREAK GAME JAVASCRIPT
   This only runs on corebreak.html
================================= */

if (document.getElementById("gameCanvas")) {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const overlayContent = document.getElementById("overlayContent");
  const muteBtn = document.getElementById("muteBtn");

  const W = canvas.width;
  const H = canvas.height;

  const GROUND_Y = 666;
  const PLAYER_START_X = 180;
  const ENEMY_START_X = 850;
  const ROUND_TIME = 60;
  const MIN_DISTANCE = 28;
  const SPECIAL_LIMIT = 2;

  const CHARACTERS = {
    blaze: {
      display: "Blaze",
      folder: "blaze",
      hp: 100,
      speed: 7,
      punch: 8,
      kick: 12,
      special: 20,
      arena: "Volcanic arena.png"
    },

    shadow: {
      display: "Shadow",
      folder: "shadow",
      hp: 90,
      speed: 9,
      punch: 7,
      kick: 11,
      special: 18,
      arena: "Moonlit arena.png"
    },

    frost: {
      display: "Frost",
      folder: "frost",
      hp: 110,
      speed: 5,
      punch: 9,
      kick: 13,
      special: 22,
      arena: "Icy arena.png"
    },

    titan: {
      display: "Titan",
      folder: "Titan",
      hp: 140,
      speed: 3,
      punch: 15,
      kick: 18,
      special: 30,
      arena: "Futuristic arena.png"
    },

    volt: {
      display: "Volt",
      folder: "volt",
      hp: 95,
      speed: 10,
      punch: 6,
      kick: 10,
      special: 17,
      arena: "Futuristic arena.png"
    }
  };

  const ACTIONS = [
    "idle",
    "walk",
    "punch",
    "kick",
    "hurt",
    "special",
    "block",
    "slide",
    "jump",
    "jump_kick"
  ];

  const ATTACKS = new Set(["punch", "kick", "special", "slide", "jump_kick"]);
  const ONE_TIME = new Set(["punch", "kick", "hurt", "special", "slide", "jump_kick"]);

  const HIT_FRAME = {
    punch: 1,
    kick: 1,
    special: 0,
    slide: 1,
    jump_kick: 1
  };

  const COOLDOWN = {
    punch: 260,
    kick: 360,
    special: 700,
    slide: 650,
    jump_kick: 520
  };

  const REACH = {
    punch: 52,
    kick: 70,
    special: 82,
    slide: 92,
    jump_kick: 92
  };

  const ANIM_SPEED = {
    idle: 140,
    walk: 110,
    punch: 95,
    kick: 95,
    hurt: 120,
    special: 130,
    block: 120,
    slide: 85,
    jump: 90,
    jump_kick: 80
  };

  const sounds = {
    punch: new Audio("assets/music/punch.mp3"),
    kick: new Audio("assets/music/kick.mp3"),
    hurt: new Audio("assets/music/hurt.wav"),
    special: new Audio("assets/music/super power.wav"),
    ko: new Audio("assets/music/k-o-sfx.mp3"),
    win: new Audio("assets/music/you-win.mp3"),
    lose: new Audio("assets/music/you-lose.mp3"),
    time: new Audio("assets/music/time-up.mp3"),
    bg: new Audio("assets/music/background.mp3")
  };

  sounds.bg.loop = true;
  sounds.bg.volume = 0.28;

  let muted = false;
  let images = {};
  let arenaImages = {};
  let keys = {};

  let scene = "loading";

  let player = null;
  let enemy = null;
  let ai = null;

  let selectedDifficulty = "medium";
  let selectedPlayer = "blaze";

  let roundNumber = 1;
  let playerWins = 0;
  let enemyWins = 0;

  let roundStartedAt = 0;
  let roundPausedUntil = 0;
  let roundEnding = false;

  let messageText = "";
  let messageUntil = 0;

  function characterImagePaths(charKey, action, index) {
    const folder = CHARACTERS[charKey].folder;
    const fileName = `${action}${index}.png`;

    return [
      `assets/Images/chracters/${folder}/${fileName}`,
      `assets/Images/characters/${folder}/${fileName}`,
      `assets/images/chracters/${folder}/${fileName}`,
      `assets/images/characters/${folder}/${fileName}`,
      `assets/Images/Chracters/${folder}/${fileName}`,
      `assets/Images/Characters/${folder}/${fileName}`
    ];
  }

  function arenaImagePaths(arenaName) {
    return [
      `assets/Images/arena/${arenaName}`,
      `assets/Images/arenas/${arenaName}`,
      `assets/images/arena/${arenaName}`,
      `assets/images/arenas/${arenaName}`,
      `assets/Images/Arena/${arenaName}`,
      `assets/Images/Arenas/${arenaName}`
    ];
  }

  function loadImage(src) {
    return new Promise(resolve => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);

      img.src = src;
    });
  }

  async function loadFirstWorkingImage(paths) {
    for (const path of paths) {
      const img = await loadImage(path);

      if (img) {
        console.log("Loaded image:", path);
        return img;
      }
    }

    console.warn("Image not found. Tried:", paths);
    return null;
  }

  async function loadAssets() {
    for (const key of Object.keys(CHARACTERS)) {
      images[key] = {};

      for (const action of ACTIONS) {
        images[key][action] = [];

        for (let i = 1; i <= 5; i++) {
          const img = await loadFirstWorkingImage(
            characterImagePaths(key, action, i)
          );

          if (img) {
            images[key][action].push(img);
          }
        }
      }
    }

    for (const data of Object.values(CHARACTERS)) {
      if (!arenaImages[data.arena]) {
        arenaImages[data.arena] = await loadFirstWorkingImage(
          arenaImagePaths(data.arena)
        );
      }
    }
  }

  function playSound(name) {
    if (muted || !sounds[name]) return;

    try {
      sounds[name].currentTime = 0;
      sounds[name].play().catch(() => {});
    } catch (e) {}
  }

  function playBg() {
    if (muted) return;

    sounds.bg.play().catch(() => {});
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      muted = !muted;

      muteBtn.textContent = muted ? "Sound: Off" : "Sound: On";

      Object.values(sounds).forEach(sound => {
        sound.muted = muted;
      });

      if (!muted) {
        playBg();
      }
    });
  }

  canvas.addEventListener("click", () => {
    canvas.focus();
  });

  class Fighter {
    constructor(charKey, x, side) {
      this.key = charKey;
      this.data = CHARACTERS[charKey];

      this.x = x;
      this.y = GROUND_Y;
      this.side = side;

      this.facingRight = side === "player";

      this.maxHp = this.data.hp;
      this.hp = this.maxHp;

      this.action = "idle";
      this.frame = 0;
      this.lastFrameAt = performance.now();

      this.locked = false;
      this.dead = false;
      this.damageDone = false;

      this.ready = {
        punch: 0,
        kick: 0,
        special: 0,
        slide: 0,
        jump_kick: 0
      };

      this.specialUsed = 0;

      this.vy = 0;
      this.air = false;
      this.airSpeed = 0;

      this.slideDir = this.facingRight ? 1 : -1;
    }

    reset(x, side) {
      this.x = x;
      this.side = side;
      this.y = GROUND_Y;

      this.facingRight = side === "player";

      this.hp = this.maxHp;

      this.action = "idle";
      this.frame = 0;

      this.locked = false;
      this.dead = false;
      this.damageDone = false;

      this.ready = {
        punch: 0,
        kick: 0,
        special: 0,
        slide: 0,
        jump_kick: 0
      };

      this.vy = 0;
      this.air = false;
      this.airSpeed = 0;

      this.slideDir = this.facingRight ? 1 : -1;
    }

    resetSpecials() {
      this.specialUsed = 0;
    }

    frames(action = this.action) {
      const found = images[this.key]?.[action] || [];

      if (found.length > 0) {
        return found;
      }

      return images[this.key]?.idle || [];
    }

    currentImg() {
      const frames = this.frames();

      return frames[Math.min(this.frame, frames.length - 1)] || null;
    }

    width() {
      const img = this.currentImg();

      return img ? img.width : 100;
    }

    height() {
      const img = this.currentImg();

      return img ? img.height : 160;
    }

    bodyRect() {
      return {
        x: this.x,
        y: this.y - this.height(),
        w: this.width(),
        h: this.height(),
        left: this.x,
        right: this.x + this.width(),
        top: this.y - this.height(),
        bottom: this.y,
        cx: this.x + this.width() / 2
      };
    }

    changeAction(action) {
      if (this.action !== action) {
        this.action = action;
        this.frame = 0;
        this.lastFrameAt = performance.now();
        this.damageDone = false;
      }
    }

    canAttack(action) {
      const now = performance.now();

      if (this.dead) return false;
      if (this.action === "block") return false;
      if (!ATTACKS.has(action)) return false;
      if (now < this.ready[action]) return false;

      if (action === "special" && this.specialUsed >= SPECIAL_LIMIT) {
        return false;
      }

      if (action === "jump_kick") {
        return this.air || !this.locked;
      }

      return !this.locked && !this.air;
    }

    attack(action) {
      if (!this.canAttack(action)) return false;

      const now = performance.now();

      this.locked = true;
      this.damageDone = false;
      this.ready[action] = now + COOLDOWN[action];

      if (action === "special") {
        this.specialUsed++;
      }

      if (action === "slide") {
        this.slideDir = this.facingRight ? 1 : -1;
      }

      if (action === "jump_kick") {
        if (!this.air) {
          this.jump(this.facingRight ? 1 : -1, true);
        }

        this.locked = true;
      }

      this.changeAction(action);

      if (action === "punch") {
        playSound("punch");
      } else if (action === "kick") {
        playSound("kick");
      } else if (action === "special") {
        playSound("special");
      } else {
        playSound("kick");
      }

      return true;
    }

    block(start) {
      if (this.dead || this.air) return;

      if (start && !this.locked) {
        this.locked = true;
        this.changeAction("block");
      } else if (!start && this.action === "block") {
        this.locked = false;
        this.changeAction("idle");
      }
    }

    jump(direction = 0, fromAttack = false) {
      if (this.dead || this.air || (this.locked && !fromAttack)) {
        return false;
      }

      this.air = true;
      this.locked = true;
      this.vy = -17;
      this.airSpeed = direction * (this.data.speed + 1);

      this.changeAction(fromAttack ? "jump_kick" : "jump");

      return true;
    }

    move(dir) {
      if (this.dead || this.action === "block" || this.action === "slide") {
        return;
      }

      if (this.air) {
        this.airSpeed = dir * (this.data.speed + 1);
        this.facingRight = dir > 0;
        return;
      }

      if (this.locked) return;

      this.x += dir * this.data.speed;
      this.facingRight = dir > 0;

      this.changeAction("walk");
    }

    setIdle() {
      if (!this.dead && !this.locked && !this.air) {
        this.changeAction("idle");
      }
    }

    attackRect(action = this.action) {
      const b = this.bodyRect();
      const reach = REACH[action] || 0;

      let top = b.top + 34;
      let height = Math.max(24, b.h - 64);

      if (action === "slide") {
        top = b.bottom - 72;
        height = 52;
      }

      if (action === "jump_kick") {
        top = b.top + 18;
        height = Math.max(40, b.h - 44);
      }

      if (this.facingRight) {
        return {
          x: b.right - 8,
          y: top,
          w: reach,
          h: height
        };
      }

      return {
        x: b.left - reach + 8,
        y: top,
        w: reach,
        h: height
      };
    }

    targetInRange(target, action = this.action) {
      return rectsOverlap(this.attackRect(action), target.bodyRect());
    }

    damage() {
      if (this.action === "punch") return this.data.punch;
      if (this.action === "kick") return this.data.kick;
      if (this.action === "special") return this.data.special;
      if (this.action === "slide") return Math.max(6, this.data.kick - 2);
      if (this.action === "jump_kick") return this.data.kick + 4;

      return 0;
    }

    takeHit(amount) {
      if (this.action === "block") {
        return "blocked";
      }

      this.hp = Math.max(0, this.hp - amount);

      if (this.hp <= 0) {
        this.dead = true;
        this.locked = true;

        this.changeAction("idle");
        playSound("ko");

        return "dead";
      }

      this.locked = true;
      this.changeAction("hurt");

      playSound("hurt");

      return "hit";
    }

    update() {
      const now = performance.now();

      if (this.action === "slide") {
        this.x += this.slideDir * Math.max(10, this.data.speed * 3);
      }

      if (this.air) {
        this.x += this.airSpeed;
        this.y += this.vy;
        this.vy += 1.05;

        if (this.y >= GROUND_Y) {
          this.y = GROUND_Y;
          this.vy = 0;
          this.air = false;
          this.airSpeed = 0;
          this.locked = false;

          this.changeAction("idle");
        }
      }

      this.x = Math.max(20, Math.min(W - this.width() - 20, this.x));

      const frames = this.frames();

      if (!frames.length) return;

      if (now - this.lastFrameAt > (ANIM_SPEED[this.action] || 120)) {
        this.lastFrameAt = now;
        this.frame++;

        if (this.frame >= frames.length) {
          if (ONE_TIME.has(this.action)) {
            this.frame = frames.length - 1;
            this.locked = false;
            this.damageDone = false;

            if (!this.air && !this.dead) {
              this.changeAction("idle");
            }
          } else {
            this.frame = 0;
          }
        }
      }
    }

    draw() {
      const img = this.currentImg();

      if (!img) {
        ctx.fillStyle = this.side === "player" ? "#7c5cff" : "#ff5ea8";
        ctx.fillRect(this.x, this.y - 150, 80, 150);
        return;
      }

      ctx.save();

      if (this.facingRight) {
        ctx.drawImage(img, this.x, this.y - img.height);
      } else {
        ctx.translate(this.x + img.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, this.y - img.height);
      }

      ctx.restore();
    }
  }

  class EnemyAI {
    constructor(level) {
      this.level = level;
      this.nextThink = 0;
      this.nextAttack = 0;
      this.blockUntil = 0;

      this.settings = {
        easy: {
          thinkDelay: 450,
          attackDelay: 900,
          attackChance: 0.35,
          blockChance: 0.08,
          walkRange: 170,
          stopRange: 95,
          attackRange: 115
        },

        medium: {
          thinkDelay: 330,
          attackDelay: 650,
          attackChance: 0.55,
          blockChance: 0.16,
          walkRange: 180,
          stopRange: 100,
          attackRange: 125
        },

        hard: {
          thinkDelay: 230,
          attackDelay: 500,
          attackChance: 0.72,
          blockChance: 0.25,
          walkRange: 190,
          stopRange: 105,
          attackRange: 135
        }
      }[level];
    }

    wait() {
      this.nextThink = performance.now() + this.settings.thinkDelay;
    }

    update(bot, target) {
      if (!bot || !target) return;
      if (bot.dead || target.dead) return;
      if (scene !== "fight") return;

      const now = performance.now();

      const botRect = bot.bodyRect();
      const targetRect = target.bodyRect();

      const distance = Math.abs(botRect.cx - targetRect.cx);
      const direction = targetRect.cx > botRect.cx ? 1 : -1;

      bot.facingRight = direction === 1;

      if (now < this.blockUntil) {
        bot.block(true);
        return;
      }

      if (bot.action === "block") {
        bot.block(false);
      }

      const targetIsAttacking = ATTACKS.has(target.action);

      if (targetIsAttacking && distance <= this.settings.attackRange && now >= this.nextThink) {
        this.nextThink = now + this.settings.thinkDelay;

        if (Math.random() < this.settings.blockChance) {
          this.blockUntil = now + 400;
          bot.block(true);
          return;
        }
      }

      if (distance > this.settings.walkRange) {
        bot.move(direction);
        return;
      }

      if (distance > this.settings.stopRange && distance <= this.settings.walkRange) {
        bot.move(direction);
        return;
      }

      if (distance <= this.settings.stopRange) {
        bot.setIdle();
      }

      if (distance <= this.settings.attackRange && now >= this.nextAttack) {
        this.nextAttack = now + this.settings.attackDelay;

        if (Math.random() < this.settings.attackChance) {
          let options = [];

          if (distance <= 80) {
            options = ["punch", "kick"];
          } else if (distance <= 120) {
            options = ["kick", "slide"];
          } else {
            options = ["slide"];
          }

          if (bot.specialUsed < SPECIAL_LIMIT && distance <= 130) {
            options.push("special");
          }

          const choice = options[Math.floor(Math.random() * options.length)];
          bot.attack(choice);
        }
      }
    }
  }

  function rectsOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function showOverlay() {
    overlay.classList.remove("hidden");
  }

  function hideOverlay() {
    overlay.classList.add("hidden");
  }

  function showHome() {
    scene = "home";
    showOverlay();

    overlayTitle.textContent = "CoreBreak";

    overlayText.textContent =
      "A 2D fighting game. Choose a difficulty, select your fighter, and win best of three rounds.";

    overlayContent.innerHTML = `
      <div class="menu-actions">
        <button class="menu-btn primary" onclick="showDifficulty()">Start Game</button>
      </div>

      <div class="controls-panel">
        <div>
          <h3>Controls</h3>
          <p>
            Move Left: Left Arrow<br>
            Move Right: Right Arrow<br><br>

            Jump: W<br>
            Block: A<br>
            Slide: S<br>
            Jump Kick: D<br><br>

            Punch: Q<br>
            Kick: E<br>
            Special: R
          </p>
        </div>

        <div>
          <h3>Goal</h3>
          <p>
            Win 2 rounds before the enemy does.<br><br>
            Special move can only be used 2 times in the full match.
          </p>
        </div>
      </div>
    `;
  }

  function showDifficulty() {
    scene = "difficulty";

    overlayTitle.textContent = "Select Difficulty";
    overlayText.textContent =
      "Easy gives slower enemy reaction. Hard makes the enemy faster and more defensive.";

    overlayContent.innerHTML = `
      <div class="grid-list">
        <button class="difficulty-card" onclick="selectDifficulty('easy')">
          <strong>EASY</strong>
          <span class="card-stats">Slower AI</span>
        </button>

        <button class="difficulty-card" onclick="selectDifficulty('medium')">
          <strong>MEDIUM</strong>
          <span class="card-stats">Balanced fight</span>
        </button>

        <button class="difficulty-card" onclick="selectDifficulty('hard')">
          <strong>HARD</strong>
          <span class="card-stats">Fast AI reactions</span>
        </button>
      </div>
    `;
  }

  window.selectDifficulty = function (diff) {
    selectedDifficulty = diff;
    showCharacterSelect();
  };

  function showCharacterSelect() {
    scene = "select";

    overlayTitle.textContent = "Choose Fighter";

    overlayText.textContent =
      "Each fighter has different health, speed, and damage. Your enemy will be picked from the remaining fighters.";

    overlayContent.innerHTML = `
      <div class="grid-list">
        ${Object.keys(CHARACTERS).map(key => {
          const c = CHARACTERS[key];

          return `
            <button class="character-card" onclick="startMatch('${key}')">
              <img src="assets/Images/chracters/${c.folder}/idle1.png" alt="${c.display}">
              <strong>${c.display}</strong>
              <span class="card-stats">
                HP ${c.hp} · Speed ${c.speed}<br>
                P ${c.punch} · K ${c.kick} · S ${c.special}
              </span>
            </button>
          `;
        }).join("")}
      </div>
    `;
  }

  window.startMatch = function (charKey) {
    selectedPlayer = charKey;

    const enemies = Object.keys(CHARACTERS).filter(k => k !== charKey);
    const enemyKey = enemies[Math.floor(Math.random() * enemies.length)];

    player = new Fighter(charKey, PLAYER_START_X, "player");
    enemy = new Fighter(enemyKey, ENEMY_START_X, "enemy");

    player.resetSpecials();
    enemy.resetSpecials();

    ai = new EnemyAI(selectedDifficulty);
    ai.wait();

    playerWins = 0;
    enemyWins = 0;
    roundNumber = 1;

    roundStartedAt = performance.now();
    roundPausedUntil = 0;
    roundEnding = false;

    message("Round 1 - Fight!", 1800);
    hideOverlay();

    scene = "fight";

    canvas.focus();

    playBg();
  };

  function nextRound() {
    player.reset(PLAYER_START_X, "player");
    enemy.reset(ENEMY_START_X, "enemy");

    roundNumber++;
    roundStartedAt = performance.now();
    roundPausedUntil = 0;
    roundEnding = false;

    ai = new EnemyAI(selectedDifficulty);
    ai.wait();

    canvas.focus();

    if (roundNumber >= 3) {
      message("Final Round - Fight!", 1800);
    } else {
      message(`Round ${roundNumber} - Fight!`, 1800);
    }
  }

  function endMatch(text) {
    scene = "result";

    if (text.includes("WIN")) {
      playSound("win");
    } else {
      playSound("lose");
    }

    overlay.classList.remove("hidden");

    overlayTitle.textContent = text;

    overlayText.textContent =
      `Final Score: You ${playerWins} - Enemy ${enemyWins}. Play again or return to your Game Hub.`;

    overlayContent.innerHTML = `
      <div class="menu-actions">
        <button class="menu-btn primary" onclick="showDifficulty()">Play Again</button>
        <button class="menu-btn" onclick="showHome()">Main Menu</button>
      </div>
    `;
  }

  window.showDifficulty = showDifficulty;
  window.showHome = showHome;

  function message(text, ms = 1200) {
    messageText = text;
    messageUntil = performance.now() + ms;
  }

  function handleInput() {
    if (scene !== "fight" || performance.now() < roundPausedUntil) return;

    let moved = false;

    if (keys["arrowleft"]) {
      player.move(-1);
      moved = true;
    }

    if (keys["arrowright"]) {
      player.move(1);
      moved = true;
    }

    if (keys["w"] && !player.air) {
      player.jump(0);
    }

    if (keys["a"]) {
      player.block(true);
    } else {
      player.block(false);
    }

    if (!moved && !keys["a"]) {
      player.setIdle();
    }
  }

  function keyAttack(key) {
    if (scene !== "fight" || performance.now() < roundPausedUntil) return;

    if (key === "q") {
      player.attack("punch");
    }

    if (key === "e") {
      player.attack("kick");
    }

    if (key === "r") {
      player.attack("special");
    }

    if (key === "s") {
      player.attack("slide");
    }

    if (key === "d") {
      player.attack("jump_kick");
    }
  }

  window.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();

    keys[key] = true;

    if (["q", "e", "r", "s", "d"].includes(key)) {
      keyAttack(key);
    }

    if (["arrowleft", "arrowright", "w", "a", "s", "d", "q", "e", "r", " "].includes(key)) {
      e.preventDefault();
    }
  });

  window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
  });

  function solveDistance() {
    if (!player || !enemy) return;

    const p = player.bodyRect();
    const e = enemy.bodyRect();

    const gap = Math.abs(p.cx - e.cx);

    if (gap < MIN_DISTANCE) {
      const push = (MIN_DISTANCE - gap) / 2;

      if (p.cx < e.cx) {
        player.x -= push;
        enemy.x += push;
      } else {
        player.x += push;
        enemy.x -= push;
      }
    }

    player.facingRight = enemy.bodyRect().cx > player.bodyRect().cx;
    enemy.facingRight = player.bodyRect().cx > enemy.bodyRect().cx;
  }

  function applyHits() {
    for (const [attacker, target] of [[player, enemy], [enemy, player]]) {
      if (!attacker || !target || attacker.dead || target.dead) continue;
      if (!ATTACKS.has(attacker.action)) continue;
      if (attacker.damageDone) continue;

      const hitFrame = HIT_FRAME[attacker.action] ?? 1;

      if (attacker.frame !== hitFrame) continue;

      if (attacker.targetInRange(target)) {
        attacker.damageDone = true;
        target.takeHit(attacker.damage());
      }
    }
  }

  function checkRoundEnd() {
    if (roundEnding) return;
    if (performance.now() < roundPausedUntil) return;

    const elapsed = Math.floor((performance.now() - roundStartedAt) / 1000);
    const left = Math.max(0, ROUND_TIME - elapsed);

    let result = null;

    if (player.hp <= 0 && enemy.hp <= 0) {
      result = "draw";
    } else if (enemy.hp <= 0) {
      result = "player";
    } else if (player.hp <= 0) {
      result = "enemy";
    } else if (left <= 0) {
      playSound("time");

      if (player.hp > enemy.hp) {
        result = "player";
      } else if (enemy.hp > player.hp) {
        result = "enemy";
      } else {
        result = "draw";
      }
    }

    if (!result) return;

    roundEnding = true;
    roundPausedUntil = performance.now() + 1800;

    if (result === "player") {
      playerWins++;
      message("You Win The Round!", 1800);
    } else if (result === "enemy") {
      enemyWins++;
      message("Enemy Wins The Round!", 1800);
    } else {
      message("Draw Round!", 1800);
    }

    setTimeout(() => {
      if (playerWins >= 2) {
        endMatch("YOU WIN!");
      } else if (enemyWins >= 2) {
        endMatch("YOU LOSE!");
      } else if (scene === "fight") {
        nextRound();
      }
    }, 1850);
  }

  function drawBackground() {
    const arena = player ? CHARACTERS[player.key].arena : "Volcanic arena.png";
    const img = arenaImages[arena];

    if (img) {
      ctx.drawImage(img, 0, 0, W, H);
    } else {
      const grad = ctx.createLinearGradient(0, 0, W, H);

      grad.addColorStop(0, "#202746");
      grad.addColorStop(1, "#101426");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.fillStyle = "rgba(0,0,0,0.34)";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.fillRect(0, GROUND_Y - 18, W, H - GROUND_Y + 18);
  }

  function drawBar(x, y, w, h, value, max, name, align = "left") {
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    roundRect(x, y, w, h, 12, true);

    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 2;
    roundRect(x, y, w, h, 12, false);

    const pct = Math.max(0, value / max);
    const fillW = (w - 8) * pct;

    if (pct > 0.45) {
      ctx.fillStyle = "#51f5a4";
    } else if (pct > 0.22) {
      ctx.fillStyle = "#ffd66b";
    } else {
      ctx.fillStyle = "#ff4f6d";
    }

    if (align === "right") {
      roundRect(x + w - 4 - fillW, y + 4, fillW, h - 8, 9, true);
    } else {
      roundRect(x + 4, y + 4, fillW, h - 8, 9, true);
    }

    ctx.fillStyle = "white";
    ctx.font = "700 18px Inter";
    ctx.textAlign = align;

    ctx.fillText(
      `${name}  ${Math.ceil(value)}/${max}`,
      align === "right" ? x + w - 10 : x + 10,
      y - 8
    );
  }

  function drawUI() {
    if (!player || !enemy) return;

    drawBar(42, 54, 430, 30, player.hp, player.maxHp, player.data.display, "left");
    drawBar(W - 472, 54, 430, 30, enemy.hp, enemy.maxHp, enemy.data.display, "right");

    const elapsed = Math.floor((performance.now() - roundStartedAt) / 1000);
    const left = Math.max(0, ROUND_TIME - elapsed);

    ctx.fillStyle = "rgba(0,0,0,0.62)";
    roundRect(W / 2 - 62, 28, 124, 72, 18, true);

    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "900 34px Orbitron";
    ctx.fillText(left.toString().padStart(2, "0"), W / 2, 76);

    ctx.font = "800 18px Inter";
    ctx.fillStyle = "#ffd66b";
    ctx.fillText(`Round ${roundNumber}`, W / 2, 122);
    ctx.fillText(`You ${playerWins} - ${enemyWins} Enemy`, W / 2, 148);

    ctx.font = "700 16px Inter";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.textAlign = "left";
    ctx.fillText(`Specials left: ${SPECIAL_LIMIT - player.specialUsed}`, 42, 112);

    ctx.textAlign = "right";
    ctx.fillText(`${selectedDifficulty.toUpperCase()} AI`, W - 42, 112);

    if (messageText && performance.now() < messageUntil) {
      ctx.save();

      ctx.textAlign = "center";
      ctx.font = "900 56px Orbitron";
      ctx.lineWidth = 8;
      ctx.strokeStyle = "rgba(0,0,0,0.72)";
      ctx.strokeText(messageText, W / 2, 250);

      ctx.fillStyle = "#fff";
      ctx.fillText(messageText, W / 2, 250);

      ctx.restore();
    }
  }

  function roundRect(x, y, w, h, r, fill) {
    ctx.beginPath();

    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);

    if (fill) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }

  function update() {
    if (scene === "fight") {
      handleInput();

      if (ai) {
        ai.update(enemy, player);
      }

      player.update();
      enemy.update();

      solveDistance();
      applyHits();
      checkRoundEnd();
    }
  }

  function draw() {
    drawBackground();

    if (enemy) {
      enemy.draw();
    }

    if (player) {
      player.draw();
    }

    drawUI();
  }

  function loop() {
    update();
    draw();

    requestAnimationFrame(loop);
  }

  async function init() {
    overlayTitle.textContent = "Loading CoreBreak...";
    overlayText.textContent = "Preparing fighters, arenas, and sound files.";
    overlayContent.innerHTML = "";

    await loadAssets();

    showHome();

    requestAnimationFrame(loop);
  }

  init();
}
=======
buttons.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const path = this.getAttribute('data-path');
    loadGame(path, this);
  });
});
>>>>>>> 1f44c87b5d66bbe8b5b9f1d8cd8487396b24dd35
