import { useState, useEffect } from 'react';

function App() {
  const [activePage, setActivePage] = useState('wing-calculator');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ==================== WING CALCULATOR ====================
  const [wingInputs, setWingInputs] = useState({
    coeff: { percent: '', level: '', rarity: 'scarce' },
    atbm: { coeff: '', level: '', rarity: 'scarce' }
  });

  const wingRarityData = {
    scarce: { value: 6, name: 'Scarce', color: 'from-purple-500 to-purple-600' },
    epic: { value: 7, name: 'Epic', color: 'from-amber-500 to-amber-600' },
    legendary: { value: 8, name: 'Legendary', color: 'from-pink-500 to-pink-600' },
    immortal: { value: 9, name: 'Immortal', color: 'from-red-500 to-red-600' },
    myth: { value: 10, name: 'Myth', color: 'from-orange-500 to-orange-600' },
    eternal: { value: 11, name: 'Eternal', color: 'from-yellow-500 to-yellow-600' },
    celestial: { value: 12, name: 'Celestial', color: 'from-cyan-500 to-cyan-600' }
  };

  const maxCoefficients = {
    ATBM: 1.500,
    DTM: 1.200,
    DTP: 1.050,
    HPBM: 1.500,
    Speed: 0.900
  };

  const WING_LEVEL_MULTIPLIER = 0.0000555555555555556;

  const calculateWingBaseFormula = (level, rarityValue) => {
    if (rarityValue <= 5) return 0;
    const term1 = 0.05 + (level - 1) * WING_LEVEL_MULTIPLIER;
    const term2 = 1 + (rarityValue - 5) * 0.1;
    const term3 = 6.25;
    const term4 = (rarityValue - 5) / 7;
    return term1 * term2 * term3 * term4;
  };

  const wingResults = {
    coefficient: (() => {
      const { percent, level, rarity } = wingInputs.coeff;
      const percentNum = parseFloat(percent) || 0;
      const levelNum = parseInt(level) || 1;
      const rarityValue = wingRarityData[rarity]?.value || 6;
      const baseResult = calculateWingBaseFormula(levelNum, rarityValue);
      let wingCoeff = 0;
      if (baseResult !== 0) {
        wingCoeff = (percentNum / 100) / baseResult;
      }
      return wingCoeff;
    })(),
    atbm: (() => {
      const { coeff, level, rarity } = wingInputs.atbm;
      const coeffNum = parseFloat(coeff) || 0;
      const levelNum = parseInt(level) || 1;
      const rarityValue = wingRarityData[rarity]?.value || 6;
      const baseResult = calculateWingBaseFormula(levelNum, rarityValue);
      const finalATBM = coeffNum * baseResult * 100;
      return finalATBM;
    })()
  };

  const handleWingInputChange = (type, field, value) => {
    setWingInputs(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  // ==================== ELIXIR CALCULATOR ====================
  const [elixirQuantities, setElixirQuantities] = useState({});
  const [elixirChecked, setElixirChecked] = useState({});

  const elixirData = {
    rarities: [
      { name: 'Common', value: 1, id: 'common', defaultChecked: true },
      { name: 'Good', value: 2, id: 'good', defaultChecked: true },
      { name: 'Sturdy', value: 3, id: 'sturdy', defaultChecked: false },
      { name: 'Rare', value: 4, id: 'rare', defaultChecked: false },
      { name: 'Perfect', value: 5, id: 'perfect', defaultChecked: false },
      { name: 'Scarce', value: 6, id: 'scarce', defaultChecked: false },
      { name: 'Epic', value: 8, id: 'epic', defaultChecked: false },
      { name: 'Legendary', value: 10, id: 'legendary', defaultChecked: false },
      { name: 'Immortal', value: 14, id: 'immortal', defaultChecked: false },
      { name: 'Myth', value: 20, id: 'myth', defaultChecked: false },
      { name: 'Eternal', value: 28, id: 'eternal', defaultChecked: false }
    ],
    stats: [
      { name: 'Attack', id: 'attack', isPercentage: false },
      { name: 'Critical Hit Damage', id: 'crit', isPercentage: true, decimals: 2 },
      { name: 'Talisman Damage', id: 'talisman', isPercentage: true, decimals: 3 },
      { name: 'HP', id: 'hp', isPercentage: false },
      { name: 'Skill Damage', id: 'skill', isPercentage: true, decimals: 3 }
    ]
  };

  const elixirAbsorbData = {
    common: { attack: 100, crit: 0.01, talisman: 0.001, hp: 10000, skill: 0.002 },
    good: { attack: 200, crit: 0.02, talisman: 0.002, hp: 20000, skill: 0.004 },
    sturdy: { attack: 300, crit: 0.03, talisman: 0.003, hp: 30000, skill: 0.006 },
    rare: { attack: 400, crit: 0.04, talisman: 0.004, hp: 40000, skill: 0.008 },
    perfect: { attack: 600, crit: 0.05, talisman: 0.005, hp: 60000, skill: 0.010 },
    scarce: { attack: 800, crit: 0.06, talisman: 0.006, hp: 80000, skill: 0.012 },
    epic: { attack: 1200, crit: 0.08, talisman: 0.008, hp: 120000, skill: 0.016 },
    legendary: { attack: 1600, crit: 0.10, talisman: 0.010, hp: 160000, skill: 0.020 },
    immortal: { attack: 2400, crit: 0.14, talisman: 0.014, hp: 240000, skill: 0.028 },
    myth: { attack: 4000, crit: 0.20, talisman: 0.020, hp: 400000, skill: 0.040 },
    eternal: { attack: 6000, crit: 0.28, talisman: 0.028, hp: 600000, skill: 0.056 }
  };

  useEffect(() => {
    const initialQuantities = {};
    const initialChecked = {};
    
    elixirData.rarities.forEach(rarity => {
      elixirData.stats.forEach(stat => {
        initialQuantities[`${rarity.id}-${stat.id}`] = '';
      });
      initialChecked[rarity.id] = rarity.defaultChecked;
    });
    
    setElixirQuantities(initialQuantities);
    setElixirChecked(initialChecked);
  }, []);

  const formatStatNumber = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toLocaleString('id-ID');
  };

  const calculateElixirTotals = () => {
    const pointTotals = {};
    const absorbTotals = {};
    
    elixirData.stats.forEach(stat => {
      pointTotals[stat.id] = 0;
      absorbTotals[stat.id] = 0;
    });

    elixirData.rarities.forEach(rarity => {
      if (elixirChecked[rarity.id]) {
        elixirData.stats.forEach(stat => {
          const quantity = parseInt(elixirQuantities[`${rarity.id}-${stat.id}`]) || 0;
          pointTotals[stat.id] += quantity * rarity.value;
          absorbTotals[stat.id] += quantity * elixirAbsorbData[rarity.id][stat.id];
        });
      }
    });

    return { pointTotals, absorbTotals };
  };

  const { pointTotals, absorbTotals } = calculateElixirTotals();

  const handleElixirQuantityChange = (rarityId, statId, value) => {
    setElixirQuantities(prev => ({
      ...prev,
      [`${rarityId}-${statId}`]: value
    }));
  };

  const handleElixirCheckChange = (rarityId, checked) => {
    setElixirChecked(prev => ({
      ...prev,
      [rarityId]: checked
    }));
  };

  // ==================== WORLD CALCULATOR ====================
  const [worldInputs, setWorldInputs] = useState({
    difficulty: 'Easy',
    world: '1',
    clearTime: '',
    goldDropRate: '100',
    oreDropRate: '100',
    expGainRate: '100',
    goldExtraDrop: '',
    expExtraDrop: ''
  });
  const [comparisonData, setComparisonData] = useState([]);

  const worldData = {
    Easy: Array.from({length: 20}, (_, i) => ({ id: i + 1, name: `World Easy ${i + 1}` })),
    Normal: Array.from({length: 20}, (_, i) => ({ id: i + 21, name: `World Normal ${i + 1}` })),
    Hard: Array.from({length: 20}, (_, i) => ({ id: i + 41, name: `World Hard ${i + 1}` })),
    Expert: Array.from({length: 20}, (_, i) => ({ id: i + 61, name: `World Expert ${i + 1}` })),
    Master: Array.from({length: 20}, (_, i) => ({ id: i + 81, name: `World Master ${i + 1}` }))
  };

  const worldStats = {
    1:{xp:500,ore:1,coins:1500},2:{xp:500,ore:1,coins:1500},3:{xp:500,ore:1,coins:1500},4:{xp:500,ore:2,coins:1500},5:{xp:500,ore:2,coins:1500},6:{xp:550,ore:2,coins:1500},7:{xp:550,ore:2,coins:2000},8:{xp:550,ore:3,coins:2600},9:{xp:600,ore:3,coins:3200},10:{xp:600,ore:3,coins:3200},11:{xp:700,ore:3,coins:3500},12:{xp:1000,ore:3,coins:3500},13:{xp:1000,ore:4,coins:3500},14:{xp:1000,ore:4,coins:3800},15:{xp:1000,ore:4,coins:4000},16:{xp:1000,ore:4,coins:4100},17:{xp:1500,ore:4,coins:4200},18:{xp:1500,ore:5,coins:4600},19:{xp:2000,ore:5,coins:5000},20:{xp:2000,ore:5,coins:7600},21:{xp:2500,ore:5,coins:8600},22:{xp:2500,ore:5,coins:9300},23:{xp:3000,ore:5,coins:10000},24:{xp:3000,ore:6,coins:10600},25:{xp:3500,ore:6,coins:11300},26:{xp:3500,ore:6,coins:12000},27:{xp:3500,ore:6,coins:13300},28:{xp:4500,ore:6,coins:14000},29:{xp:4500,ore:7,coins:14600},30:{xp:5000,ore:7,coins:16000},31:{xp:5000,ore:7,coins:16600},32:{xp:5000,ore:7,coins:17300},33:{xp:5500,ore:7,coins:18000},34:{xp:5500,ore:7,coins:18600},35:{xp:6000,ore:8,coins:19300},36:{xp:6500,ore:8,coins:20600},37:{xp:6500,ore:8,coins:20600},38:{xp:6500,ore:8,coins:22600},39:{xp:7000,ore:9,coins:22600},40:{xp:7500,ore:9,coins:26000},41:{xp:8500,ore:9,coins:50000},42:{xp:8500,ore:9,coins:52600},43:{xp:9500,ore:9,coins:56000},44:{xp:9500,ore:9,coins:57300},45:{xp:10000,ore:10,coins:59300},46:{xp:10000,ore:10,coins:61300},47:{xp:10000,ore:10,coins:63300},48:{xp:11000,ore:10,coins:64600},49:{xp:11000,ore:10,coins:66600},50:{xp:11000,ore:11,coins:67600},51:{xp:12000,ore:11,coins:70600},52:{xp:12000,ore:11,coins:72600},53:{xp:12000,ore:12,coins:74600},54:{xp:13000,ore:11,coins:76600},55:{xp:13000,ore:11,coins:78000},56:{xp:16500,ore:12,coins:79300},57:{xp:18500,ore:12,coins:81300},58:{xp:20500,ore:12,coins:82000},59:{xp:25000,ore:12,coins:84600},60:{xp:27500,ore:12,coins:86600},61:{xp:31500,ore:13,coins:100400},62:{xp:32300,ore:13,coins:101000},63:{xp:32800,ore:13,coins:101200},64:{xp:33200,ore:13,coins:101600},65:{xp:33700,ore:13,coins:103000},66:{xp:34200,ore:13,coins:104900},67:{xp:35000,ore:14,coins:106500},68:{xp:35500,ore:14,coins:108700},69:{xp:35900,ore:14,coins:110300},70:{xp:36900,ore:14,coins:112300},71:{xp:41800,ore:14,coins:125300},72:{xp:42300,ore:15,coins:127500},73:{xp:43100,ore:15,coins:129900},74:{xp:44100,ore:15,coins:132000},75:{xp:44400,ore:15,coins:134400},76:{xp:46000,ore:15,coins:137100},77:{xp:46300,ore:16,coins:139700},78:{xp:47200,ore:16,coins:143700},79:{xp:48100,ore:16,coins:145200},80:{xp:49400,ore:16,coins:148300},81:{xp:50000,ore:16,coins:152800},82:{xp:52000,ore:16,coins:154800},83:{xp:52800,ore:16,coins:157200},84:{xp:53600,ore:16,coins:160400},85:{xp:54400,ore:16,coins:163600},86:{xp:55600,ore:16,coins:167600},87:{xp:57200,ore:16,coins:171200},88:{xp:58400,ore:16,coins:174400},89:{xp:59200,ore:16,coins:180600},90:{xp:60000,ore:17,coins:181600},91:{xp:60800,ore:18,coins:183080},92:{xp:62800,ore:19,coins:187080},93:{xp:64800,ore:19,coins:191080},94:{xp:65000,ore:19,coins:195080},95:{xp:66800,ore:19,coins:201080},96:{xp:68800,ore:19,coins:203080},97:{xp:70800,ore:19,coins:205480},98:{xp:73000,ore:19,coins:211080},99:{xp:76560,ore:19,coins:215080},100:{xp:78800,ore:19,coins:219080}
  };

  const calculateWorldRates = () => {
    const stats = worldStats[worldInputs.world];
    if (!stats) return { xpHour: 0, oreHour: 0, coinsHour: 0, clearsHour: 0, baseStats: { xp: 0, ore: 0, coins: 0 } };

    const expGainRate = (parseInt(worldInputs.expGainRate) || 100) / 100;
    const oreDropRate = (parseInt(worldInputs.oreDropRate) || 100) / 100;
    const goldDropRate = (parseInt(worldInputs.goldDropRate) || 100) / 100;
    const expExtraDrop = parseInt(worldInputs.expExtraDrop) || 0;
    const goldExtraDrop = parseInt(worldInputs.goldExtraDrop) || 0;
    const clearTime = parseInt(worldInputs.clearTime) || 0;

    const timeFactor = clearTime > 0 ? 3600 / (clearTime + 5) : 0;
    
    const xpHour = timeFactor * (stats.xp + 460 * expExtraDrop) * expGainRate;
    const oreHour = timeFactor * stats.ore * oreDropRate;
    const coinsHour = timeFactor * (stats.coins + 460 * goldExtraDrop) * goldDropRate;
    const clearsHour = timeFactor;

    return {
      xpHour: Math.round(xpHour),
      oreHour: Math.round(oreHour),
      coinsHour: Math.round(coinsHour),
      clearsHour: clearsHour.toFixed(1),
      baseStats: stats
    };
  };

  const worldResults = calculateWorldRates();

  const handleWorldInputChange = (field, value) => {
    setWorldInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addToCompare = () => {
    const selectedWorld = worldData[worldInputs.difficulty]?.find(w => w.id.toString() === worldInputs.world);
    if (!selectedWorld) return;

    const newComparison = {
      name: selectedWorld.name,
      xp: worldResults.xpHour,
      ore: worldResults.oreHour,
      coins: worldResults.coinsHour,
      clears: worldResults.clearsHour,
      clearTime: parseInt(worldInputs.clearTime) || 0,
    };

    setComparisonData(prev => [...prev, newComparison]);
  };

  const clearCompare = () => {
    setComparisonData([]);
  };

  const availableWorlds = worldData[worldInputs.difficulty] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CN</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Code Name Blue</h1>
                <p className="text-sm text-slate-600">Calculator</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:shadow-none transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 border-r border-slate-200`}>
          <div className="p-6 h-full overflow-y-auto">
            <nav className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Tools</h3>
              
              {[
                { id: 'wing-calculator', name: 'Wing Calculator', icon: '🪽' },
                { id: 'elixir-calculator', name: 'Elixir Calculator', icon: '🧪' },
                { id: 'world-calculator', name: 'World Calculator', icon: '🌍' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                    activePage === item.id 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              ))}

              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4">Social Links</h3>
              
              {[
                { name: 'Roblox Game', icon: '🎮', url: 'https://www.roblox.com/games/18645473062/Guild-War-V35-Cultivation-Mortal-to-Immortal' },
                { name: 'Discord Server', icon: '💬', url: 'https://discord.com/invite/gFgcEavupb' }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent transition-all duration-200"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-sm">{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          
          {/* Wing Calculator */}
          {activePage === 'wing-calculator' && (
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Wing Calculator</h1>
                <p className="text-slate-600">ATBM & Coefficient Wing Calculator</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="text-yellow-600 mt-0.5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800 font-medium">Best way to get accurate stats of scarce wing is to trade wing to low level alts as it would give 3 decimal instead of 1 decimal</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Max Coefficients Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Max Wing Coefficients</h2>
                  <div className="space-y-3">
                    {Object.entries(maxCoefficients).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="font-medium text-slate-700 text-sm">{stat}</span>
                        <span className="font-bold text-slate-900 font-mono">{value.toFixed(3)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Coefficient Calculator */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Wing Coefficient Calculation</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Wing Percentage (%)</label>
                        <input 
                          type="number" 
                          value={wingInputs.coeff.percent}
                          onChange={(e) => handleWingInputChange('coeff', 'percent', e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                          step="0.001"
                          placeholder="7.521"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level</label>
                        <input 
                          type="number" 
                          value={wingInputs.coeff.level}
                          onChange={(e) => handleWingInputChange('coeff', 'level', e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                          placeholder="722"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rarity Wing</label>
                        <select 
                          value={wingInputs.coeff.rarity}
                          onChange={(e) => handleWingInputChange('coeff', 'rarity', e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                        >
                          {Object.entries(wingRarityData).map(([key, data]) => (
                            <option key={key} value={key}>{data.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">Wing Coefficient</span>
                          <span className="text-lg font-bold font-mono">{wingResults.coefficient.toFixed(5)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ATBM Calculator */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Wing Percentage Calculation</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Wing Coefficient</label>
                        <input 
                          type="number" 
                          value={wingInputs.atbm.coeff}
                          onChange={(e) => handleWingInputChange('atbm', 'coeff', e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                          step="0.00001"
                          placeholder="0.85034"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level</label>
                        <input 
                          type="number" 
                          value={wingInputs.atbm.level}
                          onChange={(e) => handleWingInputChange('atbm', 'level', e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                          placeholder="722"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rarity Wing</label>
                        <select 
                          value={wingInputs.atbm.rarity}
                          onChange={(e) => handleWingInputChange('atbm', 'rarity', e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                        >
                          {Object.entries(wingRarityData).map(([key, data]) => (
                            <option key={key} value={key}>{data.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">Final Wing Percentage</span>
                          <span className="text-lg font-bold font-mono">{wingResults.atbm.toFixed(3)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Elixir Calculator */}
          {activePage === 'elixir-calculator' && (
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Elixir Calculator</h1>
                <p className="text-slate-600">Calculate total points and stats from your elixirs</p>
              </div>

              {/* Rarity Checkboxes */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Select Rarities</h3>
                <div className="flex flex-wrap gap-2">
                  {elixirData.rarities.map(rarity => (
                    <label key={rarity.id} className="flex items-center space-x-2 px-3 py-2 rounded-lg border-2 cursor-pointer hover:shadow-sm transition-all text-sm font-medium"
                      style={{
                        backgroundColor: elixirChecked[rarity.id] ? 
                          (rarity.id === 'common' ? '#f3f4f6' : 
                           rarity.id === 'good' ? '#dcfce7' :
                           rarity.id === 'sturdy' ? '#dbeafe' :
                           rarity.id === 'rare' ? '#f0fdf4' :
                           rarity.id === 'perfect' ? '#eff6ff' :
                           rarity.id === 'scarce' ? '#faf5ff' :
                           rarity.id === 'epic' ? '#fef3c7' :
                           rarity.id === 'legendary' ? '#fce7f3' :
                           rarity.id === 'immortal' ? '#ffe4e6' :
                           rarity.id === 'myth' ? '#ffedd5' :
                           '#fef9c3') : 'white',
                        borderColor: elixirChecked[rarity.id] ? 
                          (rarity.id === 'common' ? '#d1d5db' : 
                           rarity.id === 'good' ? '#bbf7d0' :
                           rarity.id === 'sturdy' ? '#bfdbfe' :
                           rarity.id === 'rare' ? '#dcfce7' :
                           rarity.id === 'perfect' ? '#dbeafe' :
                           rarity.id === 'scarce' ? '#e9d5ff' :
                           rarity.id === 'epic' ? '#fde68a' :
                           rarity.id === 'legendary' ? '#fbcfe8' :
                           rarity.id === 'immortal' ? '#fecdd3' :
                           rarity.id === 'myth' ? '#fed7aa' :
                           '#fef08a') : '#e5e7eb',
                        color: elixirChecked[rarity.id] ? 
                          (rarity.id === 'common' ? '#374151' : 
                           rarity.id === 'good' ? '#166534' :
                           rarity.id === 'sturdy' ? '#1e40af' :
                           rarity.id === 'rare' ? '#15803d' :
                           rarity.id === 'perfect' ? '#1d4ed8' :
                           rarity.id === 'scarce' ? '#7e22ce' :
                           rarity.id === 'epic' ? '#92400e' :
                           rarity.id === 'legendary' ? '#be185d' :
                           rarity.id === 'immortal' ? '#be123c' :
                           rarity.id === 'myth' ? '#9a3412' :
                           '#854d0e') : '#6b7280'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={elixirChecked[rarity.id] || false}
                        onChange={(e) => handleElixirCheckChange(rarity.id, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{rarity.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Elixir Input Sections */}
              <div className="space-y-4">
                {elixirData.rarities.map(rarity => (
                  <div 
                    key={rarity.id} 
                    className={`bg-white rounded-2xl shadow-sm border-2 p-6 transition-all duration-300 ${
                      !elixirChecked[rarity.id] ? 'opacity-40' : ''
                    }`}
                    style={{
                      borderColor: rarity.id === 'common' ? '#d1d5db' : 
                                  rarity.id === 'good' ? '#bbf7d0' :
                                  rarity.id === 'sturdy' ? '#bfdbfe' :
                                  rarity.id === 'rare' ? '#dcfce7' :
                                  rarity.id === 'perfect' ? '#dbeafe' :
                                  rarity.id === 'scarce' ? '#e9d5ff' :
                                  rarity.id === 'epic' ? '#fde68a' :
                                  rarity.id === 'legendary' ? '#fbcfe8' :
                                  rarity.id === 'immortal' ? '#fecdd3' :
                                  rarity.id === 'myth' ? '#fed7aa' :
                                  '#fef08a'
                    }}
                  >
                    <h4 className="text-lg font-bold mb-4 pb-3 border-b border-slate-200" style={{
                      color: rarity.id === 'common' ? '#374151' : 
                            rarity.id === 'good' ? '#166534' :
                            rarity.id === 'sturdy' ? '#1e40af' :
                            rarity.id === 'rare' ? '#15803d' :
                            rarity.id === 'perfect' ? '#1d4ed8' :
                            rarity.id === 'scarce' ? '#7e22ce' :
                            rarity.id === 'epic' ? '#92400e' :
                            rarity.id === 'legendary' ? '#be185d' :
                            rarity.id === 'immortal' ? '#be123c' :
                            rarity.id === 'myth' ? '#9a3412' :
                            '#854d0e'
                    }}>
                      {rarity.name} Elixirs
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {elixirData.stats.map(stat => (
                        <div key={stat.id}>
                          <label className="block text-sm font-medium text-slate-700 mb-2">{stat.name}</label>
                          <input
                            type="number"
                            value={elixirQuantities[`${rarity.id}-${stat.id}`] || ''}
                            onChange={(e) => handleElixirQuantityChange(rarity.id, stat.id, e.target.value)}
                            disabled={!elixirChecked[rarity.id]}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all text-sm"
                            min="0"
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Points Total */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Total Points</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {elixirData.stats.map(stat => (
                      <div key={stat.id} className="text-center">
                        <div className="text-sm text-slate-600 mb-2">{stat.name}</div>
                        <div className="text-xl font-bold text-blue-600">{formatStatNumber(pointTotals[stat.id] || 0)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Absorb Stats Total */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Total Absorb Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {elixirData.stats.map(stat => (
                      <div key={stat.id} className="text-center">
                        <div className="text-sm text-slate-600 mb-2">{stat.name}</div>
                        <div className="text-lg font-bold text-green-600">
                          {stat.isPercentage 
                            ? `${((absorbTotals[stat.id] || 0)).toFixed(stat.decimals)}%`
                            : formatStatNumber(absorbTotals[stat.id] || 0)
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* World Calculator */}
          {activePage === 'world-calculator' && (
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">World Rate Calculator</h1>
                <p className="text-slate-600">Calculate your farming rate per hour</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* World Selection */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">World Selection</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                      <select 
                        value={worldInputs.difficulty}
                        onChange={(e) => handleWorldInputChange('difficulty', e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                      >
                        {Object.keys(worldData).map(difficulty => (
                          <option key={difficulty} value={difficulty}>{difficulty}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">World</label>
                      <select 
                        value={worldInputs.world}
                        onChange={(e) => handleWorldInputChange('world', e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                      >
                        {availableWorlds.map(world => (
                          <option key={world.id} value={world.id}>{world.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Base Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Base Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-medium text-slate-700 text-sm">Exp / Clear</span>
                      <span className="font-bold text-slate-900 text-sm">{worldResults.baseStats.xp.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-medium text-slate-700 text-sm">Ore / Drop</span>
                      <span className="font-bold text-slate-900 text-sm">{worldResults.baseStats.ore.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-medium text-slate-700 text-sm">Gold / Clear</span>
                      <span className="font-bold text-slate-900 text-sm">{worldResults.baseStats.coins.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {/* Clear Time */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Clear Time</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Clear Time (seconds)</label>
                    <input
                      type="number"
                      value={worldInputs.clearTime}
                      onChange={(e) => handleWorldInputChange('clearTime', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                      min="0"
                      placeholder="60"
                    />
                  </div>
                </div>

                {/* Drop Buff Adjustment */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Drop Buff Adjustment</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'goldDropRate', label: 'Gold Drop Rate (%)', min: 100 },
                      { id: 'oreDropRate', label: 'Ore Drop Rate (%)', min: 100 },
                      { id: 'expGainRate', label: 'Exp Gain Rate (%)', min: 100 }
                    ].map(field => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
                        <input
                          type="number"
                          value={worldInputs[field.id]}
                          onChange={(e) => handleWorldInputChange(field.id, e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                          min={field.min}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extra Drop Adjustment */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Extra Drop Adjustment</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'goldExtraDrop', label: 'Extra Gold Drop' },
                      { id: 'expExtraDrop', label: 'Extra Exp Drop' }
                    ].map(field => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
                        <input
                          type="number"
                          value={worldInputs[field.id]}
                          onChange={(e) => handleWorldInputChange(field.id, e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                          min="0"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-sm p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Results Per Hour</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Exp / Hour', value: worldResults.xpHour.toLocaleString('id-ID'), color: 'text-green-200' },
                      { label: 'Ore / Hour', value: worldResults.oreHour.toLocaleString('id-ID'), color: 'text-yellow-200' },
                      { label: 'Gold / Hour', value: worldResults.coinsHour.toLocaleString('id-ID'), color: 'text-yellow-200' },
                      { label: 'Clears / Hour', value: worldResults.clearsHour, color: 'text-blue-200' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span className="font-medium text-sm">{item.label}</span>
                        <span className={`text-base font-bold font-mono ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                    <button 
                      onClick={addToCompare}
                      className="w-full mt-4 bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm text-sm"
                    >
                      Add to Compare
                    </button>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              {comparisonData.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mt-6 border border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900">World Comparison</h3>
                    <button 
                      onClick={clearCompare}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm text-sm"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="text-left py-3 font-semibold text-slate-700">World</th>
                          <th className="text-left py-3 font-semibold text-slate-700">Exp/Hour</th>
                          <th className="text-left py-3 font-semibold text-slate-700">Ore/Hour</th>
                          <th className="text-left py-3 font-semibold text-slate-700">Gold/Hour</th>
                          <th className="text-left py-3 font-semibold text-slate-700">Clears/Hour</th>
                          <th className="text-left py-3 font-semibold text-slate-700">Clear Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((data, index) => (
                          <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="py-3 text-slate-900 font-medium">{data.name}</td>
                            <td className="py-3 font-mono text-slate-700">{data.xp.toLocaleString('id-ID')}</td>
                            <td className="py-3 font-mono text-slate-700">{data.ore.toLocaleString('id-ID')}</td>
                            <td className="py-3 font-mono text-slate-700">{data.coins.toLocaleString('id-ID')}</td>
                            <td className="py-3 font-mono text-slate-700">{data.clears}</td>
                            <td className="py-3 font-mono text-slate-700">{data.clearTime}s</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;