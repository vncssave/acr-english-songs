// Carrega dados do JSON e renderiza a pagina
async function loadAndRender() {
  try {
    const jsonFile = document.body.getAttribute('data-json') || 'data.json';
    const response = await fetch(jsonFile);
    const data = await response.json();
    renderPage(data);
  } catch (error) {
    console.error('Erro ao carregar data.json:', error);
  }
}

function renderPage(data) {
  document.getElementById('logo-img').src = data.schoolLogo;
  document.getElementById('class-badge').textContent = data.classLabel;
  document.getElementById('intro-text').textContent = data.intro;
  document.getElementById('playlist-link').href = data.spotifyPlaylistUrl;
  const container = document.getElementById('songs-container');
  container.innerHTML = '';
  data.songs.forEach((song, index) => {
    const songCard = createSongCard(song, index);
    container.appendChild(songCard);
  });
}

function createSongCard(song, index) {
  const card = document.createElement('div');
  card.className = 'song-card';
  const header = document.createElement('div');
  header.className = 'song-header';
  header.onclick = function() { toggleCard(this); };
  header.innerHTML = '<div class="song-number">' + song.id + '</div>' +
    '<div class="song-info"><div class="song-title">' + song.title + '</div>' +
    '<div class="song-artist">' + song.artist + '</div></div>' +
    '<div class="song-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>';
  const body = document.createElement('div');
  body.className = 'song-body';
  const bodyInner = document.createElement('div');
  bodyInner.className = 'song-body-inner';
  const tabRow = document.createElement('div');
  tabRow.className = 'tab-row';
  tabRow.innerHTML = '<button class="tab-btn active" onclick="switchTab(this, \'lyrics\')">Letra</button>' +
    '<button class="tab-btn" onclick="switchTab(this, \'vocab\')">Vocabul\u00e1rio</button>' +
    '<button class="tab-btn" onclick="switchTab(this, \'tips\')">Pratique em Casa</button>';
  const tabContents = document.createElement('div');
  const lyricsTab = document.createElement('div');
  lyricsTab.className = 'tab-content active';
  lyricsTab.setAttribute('data-tab', 'lyrics');
  const lyricsBlock = document.createElement('div');
  lyricsBlock.className = 'lyrics-block';
  song.lyrics.forEach(function(lyric) {
    const line = document.createElement('div');
    line.className = lyric.en === '' ? 'lyric-line lyric-break' : 'lyric-line';
    if (lyric.en !== '') {
      line.innerHTML = '<span class="lyric-en">' + lyric.en + '</span><span class="lyric-pt">' + lyric.pt + '</span>';
    }
    lyricsBlock.appendChild(line);
  });
  lyricsTab.appendChild(lyricsBlock);
  tabContents.appendChild(lyricsTab);
  const vocabTab = document.createElement('div');
  vocabTab.className = 'tab-content';
  vocabTab.setAttribute('data-tab', 'vocab');
  const vocabGrid = document.createElement('div');
  vocabGrid.className = 'vocab-grid';
  song.vocab.forEach(function(vocab) {
    const item = document.createElement('div');
    item.className = 'vocab-item';
    item.innerHTML = '<div class="vocab-emoji">' + vocab.emoji + '</div><div class="vocab-en">' + vocab.en + '</div><div class="vocab-pt">' + vocab.pt + '</div>';
    vocabGrid.appendChild(item);
  });
  vocabTab.appendChild(vocabGrid);
  tabContents.appendChild(vocabTab);
  const tipsTab = document.createElement('div');
  tipsTab.className = 'tab-content';
  tipsTab.setAttribute('data-tab', 'tips');
  const tipCard = document.createElement('div');
  tipCard.className = 'tip-card';
  tipCard.innerHTML = '<div class="tip-title">Dica para os pais</div><div class="tip-text">' + song.tips + '</div>';
  const spotifyContainer = document.createElement('div');
  spotifyContainer.className = 'spotify-embed';
  spotifyContainer.innerHTML = song.spotifyEmbed;
  tipsTab.appendChild(tipCard);
  tipsTab.appendChild(spotifyContainer);
  tabContents.appendChild(tipsTab);
  bodyInner.appendChild(tabRow);
  bodyInner.appendChild(tabContents);
  body.appendChild(bodyInner);
  card.appendChild(header);
  card.appendChild(body);
  return card;
}

function toggleCard(headerElement) {
  const card = headerElement.closest('.song-card');
  card.classList.toggle('open');
  const body = card.querySelector('.song-body');
  if (card.classList.contains('open')) {
    body.style.maxHeight = body.scrollHeight + 'px';
  } else {
    body.style.maxHeight = '0px';
  }
}

function switchTab(button, tabName) {
  const card = button.closest('.song-card');
  card.querySelectorAll('.tab-btn').forEach(function(btn) { btn.classList.remove('active'); });
  card.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
  button.classList.add('active');
  card.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
}

function copyLink() {
  var link = window.location.href;
  navigator.clipboard.writeText(link).then(function() {
    showToast('Link copiado!');
    var btn = document.getElementById('share-copy');
    btn.classList.add('copied');
    setTimeout(function() { btn.classList.remove('copied'); }, 2000);
  });
}

function shareWhatsApp() {
  var text = 'Confira as musicas das aulas de ingles da Academy Christ Realm! ' + window.location.href;
  var encoded = encodeURIComponent(text);
  window.open('https://wa.me/?text=' + encoded, '_blank');
}

function showToast(message) {
  var toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 2000);
}

document.getElementById('share-whatsapp').addEventListener('click', shareWhatsApp);
document.getElementById('share-copy').addEventListener('click', copyLink);
document.addEventListener('DOMContentLoaded', loadAndRender);
