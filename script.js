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

buttons.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const path = this.getAttribute('data-path');
    loadGame(path, this);
  });
});