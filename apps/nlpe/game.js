// Current game.js with added Luck Upgrade functionality, new shop items, 
// dynamic "All Black" background for top 10 players, "Pure Gold" background for top 50 players,
// and new upgrades including "No Cooldown" and "Accidents Happen".

const room = new WebsimSocket();

let newGamblingEnabled = false; // Toggle for new gambling system
// Global variable: number of leaderboard entries to show (10 or all users when set to Infinity)
let leaderboardCount = 10;

let score = 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;
let clickCount = 0;
let canClick = true;
let isDangerous = false;
let plusesInterval = null; // For pattern effect
let accidentsGoodClickCount = 0; // For "Accidents Happen" upgrade good click accumulation

// Global variable to store player's current rank in the global leaderboard (1-indexed)
let playerRank = null; 

const button = document.getElementById('gambleButton');
const resetButton = document.getElementById('resetButton');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const leaderboardDiv = document.getElementById('leaderboard');

highScoreDisplay.textContent = highScore;

// Shop items with categories: 'upgrades', 'bgs' and 'patterns'
const shopItems = [
  { id: 'upgrade-luck', category: 'upgrades', name: 'Luck Upgrade', cost: 25, description: 'Increases your luck by 2%.' },
  { id: 'upgrade-no-cooldown', category: 'upgrades', name: 'No Cooldown', cost: 40, description: 'Reduces Cooldown To 0%!' },
  { id: 'upgrade-accidents', category: 'upgrades', name: 'Accidents Happen', cost: 65, description: 'At 30 pts: +2 per good click; at 70 pts: +3 per good click; at 100 pts: every 3 good clicks yields +5 and bad clicks subtract -2.' },
  { id: 'bg-red', category: 'bgs', name: 'BG Change to Red', cost: 5, color: '#ff9999' },
  { id: 'bg-yellow', category: 'bgs', name: 'BG Change to Yellow', cost: 10, color: '#ffff99' },
  { id: 'bg-pgreen', category: 'bgs', name: 'BG Change to Pastel Green', cost: 20, color: '#77dd77' },
  { id: 'bg-darkgrey', category: 'bgs', name: 'BG Change to Dark Grey', cost: 50, color: '#696969' },
  { id: 'bg-pblue', category: 'bgs', name: 'BG Change to Pastel Blue', cost: 75, color: '#add8e6' },
  { id: 'bg-ppurple', category: 'bgs', name: 'BG Change to Pastel Purple', cost: 100, color: '#c3a6e3' },
  { id: 'bg-porange', category: 'bgs', name: 'BG Change to Pastel Orange', cost: 125, color: '#ffb347' },
  // Note: 'bg-all-black' will be added dynamically for top 10 players in the shop UI.
  { id: 'pattern-pluses', category: 'patterns', name: 'Pluses', cost: 15 },
  { id: 'pattern-snowflakes', category: 'patterns', name: 'Snowflakes', cost: 50 },
  { id: 'pattern-squares', category: 'patterns', name: 'Squares', cost: 85 }
];

/* ---------- SCORE AND GAME LOGIC ---------- */
function updateScore(newScore) {
  if (newScore < 0) newScore = 0;
  score = newScore;
  scoreDisplay.textContent = score;
  
  if (score > highScore) {
    highScore = score;
    highScoreDisplay.textContent = highScore;
    localStorage.setItem('highScore', highScore.toString());
    submitScore(score);
  }
}

function setButtonState() {
  if (score <= 0) {
    isDangerous = false;
    button.classList.remove('danger');
  } else {
    let luckBonus = localStorage.getItem('upgrade_luck') === 'true' ? 0.02 : 0;
    let dangerChance = 0.5 - luckBonus;
    isDangerous = Math.random() < dangerChance;
    if (isDangerous) {
      button.classList.add('danger');
    } else {
      button.classList.remove('danger');
    }
  }
}

function updateResetTooltip() {
  const remainingClicks = Math.max(0, 15 - clickCount);
  resetButton.querySelector('.tooltip').textContent = 
    remainingClicks > 0 ? 
    `${remainingClicks} more clicks needed` : 
    'Reset score';
}

function startCooldown() {
  // Set cooldown duration: if "No Cooldown" upgrade is purchased, reduce cooldown to 0.17 seconds; otherwise, use 0.2 seconds (200ms)
  let cooldownDuration = (localStorage.getItem('upgrade_no-cooldown') === 'true' || localStorage.getItem('upgrade_no_cooldown') === 'true') ? 170 : 200;
  canClick = false;
  button.disabled = true;
  
  const overlay = document.createElement('div');
  overlay.className = 'cooldown-overlay';
  button.appendChild(overlay);
  
  requestAnimationFrame(() => {
    overlay.style.width = '100%';
    setTimeout(() => {
      overlay.style.width = '0%';
    }, 0);
  });
  
  setTimeout(() => {
    canClick = true;
    button.disabled = false;
    overlay.remove();
  }, cooldownDuration);
}

async function resetLeaderboards() {
  try {
    const globalScores = await room.collection('highscores_v3').getList();
    const date = new Date().toISOString().split('T')[0];
    const dailyScores = await room.collection('daily_highscores_v3').filter({ date: date }).getList();
    
    for (const score of globalScores) {
      if (score.username === room.party.client.username) {
        await room.collection('highscores_v3').delete(score.id);
      }
    }
    
    for (const score of dailyScores) {
      if (score.username === room.party.client.username) {
        await room.collection('daily_highscores_v3').delete(score.id);
      }
    }
  } catch (error) {
    console.error('Error resetting leaderboards:', error);
  }
}

button.addEventListener('click', () => {
  if (!canClick) return;
  
  clickCount++;
  const accidentsActive = localStorage.getItem('upgrade_accidents') === 'true';
  
  if (accidentsActive) {
    if (isDangerous) {
      // For bad clicks under "Accidents Happen" upgrade: subtract extra if score >= 100.
      if (score >= 100) {
        updateScore(score - 2);
      } else {
        updateScore(score - 1);
      }
    } else {
      // Good click logic based on score thresholds.
      if (score < 30) {
        updateScore(score + 1);
      } else if (score >= 30 && score < 70) {
        updateScore(score + 2);
      } else if (score >= 70 && score < 100) {
        updateScore(score + 3);
      } else { // score >= 100: every 3 good clicks give bonus
        accidentsGoodClickCount++;
        if (accidentsGoodClickCount >= 3) {
          updateScore(score + 5);
          accidentsGoodClickCount = 0;
        }
      }
    }
  } else {
    if (isDangerous) {
      updateScore(score - 1);
    } else {
      updateScore(score + 1);
    }
  }
  setButtonState();
  updateResetTooltip();
  startCooldown();
});

resetButton.addEventListener('click', () => {
  if (clickCount >= 15) {
    clickCount = 0;
    updateScore(0);
    updateResetTooltip();
  }
});

/* ---------- LEADERBOARD FUNCTIONALITY ---------- */
function updateLeaderboard(scores) {
  leaderboardDiv.innerHTML = '';
  const sortedScores = scores.sort((a, b) => b.score - a.score);
  const topScores = sortedScores.slice(0, leaderboardCount);
  
  if (topScores.length === 0) {
    const div = document.createElement('div');
    div.className = 'leaderboard-entry';
    div.innerHTML = `<div class="player-info">No scores yet!</div>`;
    leaderboardDiv.appendChild(div);
    return;
  }

  topScores.forEach((entry, index) => {
    if (!entry.username) return;
    const div = document.createElement('div');
    div.className = 'leaderboard-entry';
    
    const cleanUsername = entry.username.replace(/[^a-zA-Z0-9_]/g, '');
    const avatarUrl = `https://images.websim.ai/avatar/${cleanUsername}`;
    const profileUrl = `https://websim.ai/@${cleanUsername}`;
    
    div.innerHTML = `
      <div class="player-info">
        <img src="${avatarUrl}" class="avatar" alt="${cleanUsername}'s avatar" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><circle cx=%2212%22 cy=%2212%22 r=%2212%22 fill=%22%23ccc%22/></svg>'">
        <a href="${profileUrl}" target="_blank" class="username">
          #${index + 1} @${cleanUsername}
        </a>
      </div>
      <span class="score">${entry.score}</span>
    `;
    leaderboardDiv.appendChild(div);
  });
}

async function removeDuplicateScores(scores) {
  const uniqueEntries = {};
  for (const entry of scores) {
    if (!entry.username) continue;
    if (!uniqueEntries[entry.username]) {
      uniqueEntries[entry.username] = entry;
    } else {
      if (entry.score > uniqueEntries[entry.username].score) {
        try {
          await room.collection('highscores_v3').delete(uniqueEntries[entry.username].id);
        } catch (error) {
          console.error('Error deleting duplicate for', entry.username, error);
        }
        uniqueEntries[entry.username] = entry;
      } else {
        try {
          await room.collection('highscores_v3').delete(entry.id);
        } catch (error) {
          console.error('Error deleting duplicate for', entry.username, error);
        }
      }
    }
  }
  return Object.values(uniqueEntries);
}

async function updateLeaderboardDisplay() {
  try {
    let scores = await room.collection('highscores_v3').getList();
    if (!Array.isArray(scores)) {
      scores = [];
    }
    const dedupedScores = await removeDuplicateScores(scores);
    updateLeaderboard(dedupedScores);
    // Compute the player's rank based on global scores regardless of leaderboardCount
    const sortedScores = [...dedupedScores].sort((a, b) => b.score - a.score);
    const username = room.party.client.username;
    const idx = sortedScores.findIndex(entry => entry.username === username);
    playerRank = (idx !== -1) ? (idx + 1) : null;
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    leaderboardDiv.innerHTML = `
      <div class="leaderboard-entry">
        <div class="player-info">Error loading leaderboard</div>
      </div>
    `;
  }
  // Refresh shop UI to reflect potential changes in player rank (for exclusive backgrounds availability)
  updateShopUI();
}

async function submitScore(score) {
  if (newGamblingEnabled) {
    console.log("New gambling system enabled, score submission is disabled.");
    return;
  }
  try {
    const date = new Date().toISOString().split('T')[0];
    const username = room.party.client.username;
    
    if (!username) {
      console.error('No username available');
      return;
    }
    
    const globalScores = await room.collection('highscores_v3').getList();
    const existingGlobalScore = globalScores.find(s => s.username === username);
    
    if (existingGlobalScore) {
      if (score > existingGlobalScore.score) {
        await room.collection('highscores_v3').update(existingGlobalScore.id, {
          score: score
        });
      }
    } else {
      await room.collection('highscores_v3').create({
        score: score,
        username: username
      });
    }
    
    const dailyScores = await room.collection('daily_highscores_v3').filter({ date: date }).getList();
    const existingDailyScore = dailyScores.find(s => s.username === username);
    
    if (existingDailyScore) {
      if (score > existingDailyScore.score) {
        await room.collection('daily_highscores_v3').update(existingDailyScore.id, {
          score: score,
          date: date
        });
      }
    } else {
      await room.collection('daily_highscores_v3').create({
        score: score,
        date: date,
        username: username
      });
    }
    
    await updateLeaderboardDisplay();
  } catch (error) {
    console.error('Error submitting score:', error);
  }
}

room.collection('highscores_v3').subscribe(updateLeaderboardDisplay);

/* ---------- SHOP FUNCTIONALITY ---------- */
function getPurchasedItems() {
  const data = localStorage.getItem('purchasedShopItems');
  return data ? JSON.parse(data) : {};
}

function setPurchasedItems(items) {
  localStorage.setItem('purchasedShopItems', JSON.stringify(items));
}

function getEquippedBgItem() {
  return localStorage.getItem('equippedBgItem') || null;
}

function getEquippedPatternItem() {
  return localStorage.getItem('equippedPatternItem') || null;
}

function updateBackgroundColor() {
  const equippedBg = getEquippedBgItem();
  const equippedPattern = getEquippedPatternItem();
  const patternOverlay = document.getElementById('patternOverlay');

  if (equippedBg) {
    if (equippedBg === 'bg-all-black') {
      if (playerRank !== null && playerRank <= 10) {
        document.body.style.background = "#000000";
      } else {
        localStorage.removeItem('equippedBgItem');
        document.body.style.background = "linear-gradient(#008080, #00a0a0)";
      }
    } else if (equippedBg === 'bg-pure-gold') {
      if (playerRank !== null && playerRank <= 50) {
        document.body.style.background = "#FFD700";
      } else {
        localStorage.removeItem('equippedBgItem');
        document.body.style.background = "linear-gradient(#008080, #00a0a0)";
      }
    } else {
      const bgItem = shopItems.find(item => item.id === equippedBg);
      if (bgItem) {
        document.body.style.background = bgItem.color;
      } else {
        document.body.style.background = "linear-gradient(#008080, #00a0a0)";
      }
    }
  } else {
    document.body.style.background = "linear-gradient(#008080, #00a0a0)";
  }

  if (equippedPattern) {
    if (patternOverlay) {
      patternOverlay.style.display = 'block';
    }
    startPatternEffect();
  } else {
    if (patternOverlay) {
      patternOverlay.style.display = 'none';
    }
    stopPatternEffect();
  }
}

function purchaseItem(itemId) {
  const item = shopItems.find(i => i.id === itemId);
  if (!item) return;
  if (highScore >= item.cost) {
    let purchased = getPurchasedItems();
    purchased[itemId] = true;
    setPurchasedItems(purchased);
    updateShopUI();
  } else {
    alert("Not enough high score to purchase this item.");
  }
}

function equipItem(itemId) {
  // Special handling for the exclusive "All Black" background
  if (itemId === 'bg-all-black') {
    if (!(playerRank !== null && playerRank <= 10)) {
      alert("All Black background is only available for Top 10 players!");
      return;
    }
    localStorage.setItem('equippedBgItem', 'bg-all-black');
    updateBackgroundColor();
    updateShopUI();
    return;
  }
  // Special handling for the exclusive "Pure Gold" background
  if (itemId === 'bg-pure-gold') {
    if (!(playerRank !== null && playerRank <= 50)) {
      alert("Pure Gold background is only available for Top 50 players!");
      return;
    }
    localStorage.setItem('equippedBgItem', 'bg-pure-gold');
    updateBackgroundColor();
    updateShopUI();
    return;
  }
  const item = shopItems.find(item => item.id === itemId);
  if (!item) return;
  const purchased = getPurchasedItems();
  if (!purchased[itemId]) {
    alert("You haven't purchased this item yet!");
    return;
  }
  if (item.category === 'bgs') {
    localStorage.setItem('equippedBgItem', itemId);
  } else if (item.category === 'patterns') {
    localStorage.setItem('equippedPatternItem', itemId);
  }
  updateBackgroundColor();
  updateShopUI();
}

function unequipItem(itemId) {
  const item = shopItems.find(i => i.id === itemId);
  if (!item && itemId !== 'bg-all-black' && itemId !== 'bg-pure-gold') return;
  if (itemId === 'bg-all-black' || (item && item.category === 'bgs')) {
    localStorage.removeItem('equippedBgItem');
  } else if (item && item.category === 'patterns') {
    localStorage.removeItem('equippedPatternItem');
  }
  updateBackgroundColor();
  updateShopUI();
}

/* ---------- UPDATED SHOP UI FUNCTIONALITY ---------- */
function updateShopUI() {
  const shopContent = document.getElementById('shopContent');
  shopContent.innerHTML = '';

  // Group shop items by category.
  const categories = { upgrades: [], bgs: [], patterns: [] };
  shopItems.forEach(item => {
    if (categories[item.category] !== undefined) {
      categories[item.category].push(item);
    }
  });

  // Upgrades section (vertical)
  if (categories['upgrades'].length > 0) {
    const upgradeSection = document.createElement('div');
    upgradeSection.className = 'shop-category';
    const header = document.createElement('h3');
    header.textContent = 'UPGRADES';
    upgradeSection.appendChild(header);
    const container = document.createElement('div');
    container.className = 'shop-items-container';
    
    categories['upgrades'].forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'shop-item';
      let extraContent = `<div class="upgrade-icon">★</div>`;
      itemDiv.innerHTML = `
        <div class="shop-item-header">
          ${extraContent}
          <div class="item-name">${item.name}</div>
        </div>
        <div class="item-cost">Highscore Cost: ${item.cost}</div>
        <div class="item-description">${item.description}</div>
        <div class="item-actions"></div>
      `;
      const actionsDiv = itemDiv.querySelector('.item-actions');
      const purchased = getPurchasedItems();
      if (purchased[item.id]) {
        const upgradedBtn = document.createElement('button');
        upgradedBtn.className = 'button shop-button';
        upgradedBtn.textContent = 'Upgraded';
        upgradedBtn.disabled = true;
        actionsDiv.appendChild(upgradedBtn);
      } else {
        const buyBtn = document.createElement('button');
        buyBtn.className = 'button shop-button';
        buyBtn.textContent = 'Buy';
        buyBtn.addEventListener('click', () => {
          purchaseUpgrade(item.id);
        });
        actionsDiv.appendChild(buyBtn);
      }
      container.appendChild(itemDiv);
    });
    upgradeSection.appendChild(container);
    shopContent.appendChild(upgradeSection);
  }

  // Flex container for Backgrounds and Patterns side by side
  const flexContainer = document.createElement('div');
  flexContainer.className = 'shop-flex-container';

  // Background items section
  const bgsSection = document.createElement('div');
  bgsSection.className = 'shop-category';
  const bgsHeader = document.createElement('h3');
  bgsHeader.textContent = 'BACKGROUNDS';
  bgsSection.appendChild(bgsHeader);
  const bgsContainer = document.createElement('div');
  bgsContainer.className = 'shop-items-container';
  categories['bgs'].forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'shop-item';
    let extraContent = `<div class="item-swatch" style="background-color: ${item.color};"></div>`;
    itemDiv.innerHTML = `
      <div class="shop-item-header">
        ${extraContent}
        <div class="item-name">${item.name}</div>
      </div>
      <div class="item-cost">Highscore Cost: ${item.cost}</div>
      <div class="item-actions"></div>
    `;
    const actionsDiv = itemDiv.querySelector('.item-actions');
    const purchased = getPurchasedItems();
    if (purchased[item.id]) {
      if (getEquippedBgItem() === item.id) {
        const unequipBtn = document.createElement('button');
        unequipBtn.className = 'button shop-button';
        unequipBtn.textContent = 'Unequip';
        unequipBtn.addEventListener('click', () => {
          unequipItem(item.id);
        });
        actionsDiv.appendChild(unequipBtn);
      } else {
        const equipBtn = document.createElement('button');
        equipBtn.className = 'button shop-button';
        equipBtn.textContent = 'Equip';
        equipBtn.addEventListener('click', () => {
          equipItem(item.id);
        });
        actionsDiv.appendChild(equipBtn);
      }
    } else {
      const buyBtn = document.createElement('button');
      buyBtn.className = 'button shop-button';
      buyBtn.textContent = 'Buy';
      buyBtn.addEventListener('click', () => {
        purchaseItem(item.id);
      });
      actionsDiv.appendChild(buyBtn);
    }
    bgsContainer.appendChild(itemDiv);
  });
  // Add the exclusive "All Black" background if the player is in the Top 10
  if (playerRank !== null && playerRank <= 10) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'shop-item';
    let extraContent = `<div class="item-swatch" style="background-color: #000000;"></div>`;
    itemDiv.innerHTML = `
      <div class="shop-item-header">
        ${extraContent}
        <div class="item-name">All Black (Top 10 Exclusive)</div>
      </div>
      <div class="item-cost">Exclusive Reward</div>
      <div class="item-actions"></div>
    `;
    const actionsDiv = itemDiv.querySelector('.item-actions');
    if (getEquippedBgItem() === 'bg-all-black') {
      const unequipBtn = document.createElement('button');
      unequipBtn.className = 'button shop-button';
      unequipBtn.textContent = 'Unequip';
      unequipBtn.addEventListener('click', () => {
        unequipItem('bg-all-black');
      });
      actionsDiv.appendChild(unequipBtn);
    } else {
      const equipBtn = document.createElement('button');
      equipBtn.className = 'button shop-button';
      equipBtn.textContent = 'Equip';
      equipBtn.addEventListener('click', () => {
        equipItem('bg-all-black');
      });
      actionsDiv.appendChild(equipBtn);
    }
    bgsContainer.appendChild(itemDiv);
  }
  // Add the exclusive "Pure Gold" background if the player is in the Top 50
  if (playerRank !== null && playerRank <= 50) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'shop-item';
    let extraContent = `<div class="item-swatch" style="background-color: #FFD700;"></div>`;
    itemDiv.innerHTML = `
      <div class="shop-item-header">
        ${extraContent}
        <div class="item-name">Pure Gold (Top 50 Exclusive)</div>
      </div>
      <div class="item-cost">Exclusive Reward</div>
      <div class="item-actions"></div>
    `;
    const actionsDiv = itemDiv.querySelector('.item-actions');
    if (getEquippedBgItem() === 'bg-pure-gold') {
      const unequipBtn = document.createElement('button');
      unequipBtn.className = 'button shop-button';
      unequipBtn.textContent = 'Unequip';
      unequipBtn.addEventListener('click', () => {
        unequipItem('bg-pure-gold');
      });
      actionsDiv.appendChild(unequipBtn);
    } else {
      const equipBtn = document.createElement('button');
      equipBtn.className = 'button shop-button';
      equipBtn.textContent = 'Equip';
      equipBtn.addEventListener('click', () => {
        equipItem('bg-pure-gold');
      });
      actionsDiv.appendChild(equipBtn);
    }
    bgsContainer.appendChild(itemDiv);
  }
  bgsSection.appendChild(bgsContainer);

  // Patterns items section with hex color picker next to the header text
  const patternsSection = document.createElement('div');
  patternsSection.className = 'shop-category';
  const patternsHeaderContainer = document.createElement('div');
  patternsHeaderContainer.style.display = 'flex';
  patternsHeaderContainer.style.justifyContent = 'space-between';
  patternsHeaderContainer.style.alignItems = 'center';

  const patternsHeader = document.createElement('h3');
  patternsHeader.textContent = 'PATTERNS';
  patternsHeaderContainer.appendChild(patternsHeader);

  const patternColorPicker = document.createElement('input');
  patternColorPicker.type = 'color';
  patternColorPicker.value = localStorage.getItem('patternColor') || '#ffffff';
  patternColorPicker.style.marginLeft = '10px';
  patternColorPicker.addEventListener('input', (e) => {
    localStorage.setItem('patternColor', e.target.value);
  });
  patternsHeaderContainer.appendChild(patternColorPicker);

  patternsSection.appendChild(patternsHeaderContainer);

  const patternsContainer = document.createElement('div');
  patternsContainer.className = 'shop-items-container';
  categories['patterns'].forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'shop-item';
    let extraContent = '';
    if(item.id === 'pattern-pluses'){
      extraContent = `<div class="pattern-swatch">+++</div>`;
    } else if(item.id === 'pattern-snowflakes'){
      extraContent = `<div class="pattern-swatch">❄</div>`;
    } else if(item.id === 'pattern-squares'){
      extraContent = `<div class="pattern-swatch">▦</div>`;
    }
    itemDiv.innerHTML = `
      <div class="shop-item-header">
        ${extraContent}
        <div class="item-name">${item.name}</div>
      </div>
      <div class="item-cost">Highscore Cost: ${item.cost}</div>
      <div class="item-actions"></div>
    `;
    const actionsDiv = itemDiv.querySelector('.item-actions');
    const purchased = getPurchasedItems();
    if (purchased[item.id]) {
      if(getEquippedPatternItem() === item.id) {
        const unequipBtn = document.createElement('button');
        unequipBtn.className = 'button shop-button';
        unequipBtn.textContent = 'Unequip';
        unequipBtn.addEventListener('click', () => {
          unequipItem(item.id);
        });
        actionsDiv.appendChild(unequipBtn);
      } else {
        const equipBtn = document.createElement('button');
        equipBtn.className = 'button shop-button';
        equipBtn.textContent = 'Equip';
        equipBtn.addEventListener('click', () => {
          equipItem(item.id);
        });
        actionsDiv.appendChild(equipBtn);
      }
    } else {
      const buyBtn = document.createElement('button');
      buyBtn.className = 'button shop-button';
      buyBtn.textContent = 'Buy';
      buyBtn.addEventListener('click', () => {
        purchaseItem(item.id);
      });
      actionsDiv.appendChild(buyBtn);
    }
    patternsContainer.appendChild(itemDiv);
  });
  patternsSection.appendChild(patternsContainer);

  // Append the BGs and Patterns sections side by side
  flexContainer.appendChild(bgsSection);
  flexContainer.appendChild(patternsSection);
  
  shopContent.appendChild(flexContainer);
}

function purchaseUpgrade(itemId) {
  const item = shopItems.find(i => i.id === itemId);
  if (!item) return;
  if (highScore < item.cost) {
    alert("Not enough high score to purchase this upgrade.");
    return;
  }
  let purchased = getPurchasedItems();
  if (purchased[itemId]) {
    alert("Upgrade already purchased!");
    return;
  }
  purchased[itemId] = true;
  setPurchasedItems(purchased);
  if (itemId === 'upgrade-luck') {
    localStorage.setItem('upgrade_luck', 'true');
    alert("Luck Upgrade purchased! You now have 2% more luck.");
  } else if (itemId === 'upgrade-no-cooldown') {
    localStorage.setItem('upgrade_no_cooldown', 'true');
    alert("No Cooldown upgrade purchased! Cooldown is now 0.17 seconds!");
  } else if (itemId === 'upgrade-accidents') {
    localStorage.setItem('upgrade_accidents', 'true');
    alert("Accidents Happen purchased! At 30 pts: +2 per good click; at 70 pts: +3 per good click; at 100 pts: every 3 good clicks yields +5 and bad clicks subtract -2.");
  }
  updateShopUI();
}

/* ---------- SHOP WINDOW TOGGLE (No Animation) ---------- */
function toggleShopWindow() {
  const shopWindow = document.getElementById('shopWindow');
  if (shopWindow.style.display === 'none' || shopWindow.style.display === '') {
    shopWindow.style.display = 'block';
    updateShopUI();
    addTaskbarItem('shopWindow', 'shop.exe');
  } else {
    shopWindow.style.display = 'none';
  }
}

document.getElementById('shopButton').addEventListener('click', toggleShopWindow);

/* ---------- PATTERN EFFECT FUNCTIONALITY ---------- */
function startPatternEffect() {
  if (plusesInterval) return; // already running
  const overlay = document.getElementById('patternOverlay');
  if (!overlay) return;
  overlay.innerHTML = '';
  plusesInterval = setInterval(() => {
    const plus = document.createElement('div');
    plus.className = 'plus';
    plus.textContent = '+';
    plus.style.left = Math.random() * 100 + 'vw';
    const size = Math.floor(Math.random() * 30) + 20;
    plus.style.fontSize = size + 'px';
    const color = localStorage.getItem('patternColor') || 'rgba(255,255,255,0.8)';
    plus.style.color = color;
    overlay.appendChild(plus);
    setTimeout(() => {
      plus.remove();
    }, 5000);
  }, 300);
}

function stopPatternEffect() {
  if (plusesInterval) {
    clearInterval(plusesInterval);
    plusesInterval = null;
  }
}

/* ---------- DRAGGABLE UI FUNCTIONALITY (Improved Bulge On Move) ---------- */
function makeDraggable(el) {
  const header = el.querySelector('.title-bar');
  if (!header) return;
  header.style.cursor = 'grab';
  header.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    
    const computedStyle = getComputedStyle(el);
    if (computedStyle.position === 'static') {
      el.style.position = 'absolute';
      const rect = el.getBoundingClientRect();
      el.style.left = rect.left + 'px';
      el.style.top = rect.top + 'px';
    }
    
    header.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = el.getBoundingClientRect();
    const origLeft = rect.left;
    const origTop = rect.top;
    function onPointerMove(e) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      el.style.left = `${origLeft + deltaX}px`;
      el.style.top = `${origTop + deltaY}px`;
      const angleX = 8 + deltaY / 20;
      const angleY = 8 - deltaX / 20;
      el.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
    }
    function onPointerUp(e) {
      header.releasePointerCapture(e.pointerId);
      header.removeEventListener('pointermove', onPointerMove);
      header.removeEventListener('pointerup', onPointerUp);
      el.style.transform = `perspective(1000px) rotateX(8deg) rotateY(8deg) scale(1.05)`;
    }
    header.addEventListener('pointermove', onPointerMove);
    header.addEventListener('pointerup', onPointerUp);
  });
}

window.addEventListener('load', () => {
  const gameWindow = document.getElementById('gameWindow');
  const shopWindow = document.getElementById('shopWindow');
  if (gameWindow) makeDraggable(gameWindow);
  if (shopWindow) makeDraggable(shopWindow);
});

function initWindowControls(win) {
  const minimizeBtn = win.querySelector('.minimize');
  const maximizeBtn = win.querySelector('.maximize');
  const closeBtn = win.querySelector('.close');
  
  [minimizeBtn, maximizeBtn, closeBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('pointerdown', (e) => e.stopPropagation());
    }
  });
  
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      win.style.display = 'none';
    });
  }
  if (maximizeBtn) {
    maximizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMaximize(win);
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      win.style.display = 'none';
      if (win.id === 'shopWindow') {
        const taskbar = document.getElementById('taskbar');
        const item = taskbar.querySelector(`.taskbar-item[data-window-id="shopWindow"]`);
        if (item) item.remove();
      }
    });
  }
}

/* ---------- WINDOW CONTROLS ---------- */
function toggleMaximize(win) {
  if (win.classList.contains('maximized')) {
    win.classList.remove('maximized');
    win.style.position = '';
    win.style.top = '';
    win.style.left = '';
    win.style.width = '';
    win.style.height = '';
  } else {
    win.classList.add('maximized');
    win.style.position = 'fixed';
    win.style.top = '0';
    win.style.left = '0';
    win.style.width = '100%';
    win.style.height = 'calc(100% - 32px)';
  }
}

function initTaskbar() {
  const taskbarItems = document.querySelectorAll('.taskbar-item');
  taskbarItems.forEach(item => {
    item.addEventListener('click', () => {
      const winId = item.getAttribute('data-window-id');
      const winEl = document.getElementById(winId);
      if (!winEl) return;
      if (getComputedStyle(winEl).display === 'none' || getComputedStyle(winEl).display === '') {
        winEl.style.display = 'block';
        winEl.style.zIndex = Date.now();
      } else {
        winEl.style.display = 'none';
      }
    });
  });
}

function addTaskbarItem(windowId, label) {
  const taskbar = document.getElementById('taskbar');
  if (!taskbar) return;
  if (!taskbar.querySelector(`.taskbar-item[data-window-id="${windowId}"]`)) {
    const button = document.createElement('button');
    button.className = 'taskbar-item';
    button.setAttribute('data-window-id', windowId);
    button.textContent = label;
    button.addEventListener('click', () => {
      const winEl = document.getElementById(windowId);
      if (!winEl) return;
      if (getComputedStyle(winEl).display === 'none' || getComputedStyle(winEl).display === '') {
        winEl.style.display = 'block';
        winEl.style.zIndex = Date.now();
      } else {
        winEl.style.display = 'none';
      }
    });
    taskbar.appendChild(button);
  }
}

window.addEventListener('load', () => {
  const gameWin = document.getElementById('gameWindow');
  const shopWin = document.getElementById('shopWindow');
  if (gameWin) initWindowControls(gameWin);
  if (shopWin) initWindowControls(shopWin);
  initTaskbar();
});

function initLeaderboardButtons() {
  const top10Btn = document.getElementById('top10Btn');
  const top50Btn = document.getElementById('top50Btn');
  if (!top10Btn || !top50Btn) return;
  top10Btn.addEventListener('click', () => {
    leaderboardCount = 10;
    top10Btn.classList.add('selected');
    top50Btn.classList.remove('selected');
    updateLeaderboardDisplay();
  });
  top50Btn.addEventListener('click', () => {
    leaderboardCount = Infinity;
    top50Btn.classList.add('selected');
    top10Btn.classList.remove('selected');
    updateLeaderboardDisplay();
  });
}

window.addEventListener('load', () => {
  initLeaderboardButtons();
});

setButtonState();
updateResetTooltip();
updateLeaderboardDisplay();
updateBackgroundColor();

if (highScore > 0) {
  submitScore(highScore);
}