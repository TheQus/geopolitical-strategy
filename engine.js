// GEOSTRAT - Game Engine

const ENGINE = {
  state: null,

  init() {
    const countries = {};
    WORLD_COUNTRIES.forEach(c => {
      countries[c.id] = {
        ...c,
        relations: {},
        atWar: [],
        alliances: [],
        buildings: { factory: 0, barracks: 0, port: 0 },
        economy: c.econ,
        brigades: c.brigades,
        population: c.pop,
        provinces: [],
        aiMemory: {
          aggression: (c.ideology === 'fascist' ? 0.7 : c.ideology === 'authoritarian' ? 0.4 : 0.15) + Math.random() * 0.2,
          focusCountry: null,
          casusBelli: {},
          casusBelliProgress: {},
        }
      };
      // assign provinces
      const count = c.econ > 100 ? 3 : c.econ > 50 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        countries[c.id].provinces.push(`${c.id}_${i}`);
      }
    });

    initRelations(countries);

    this.state = {
      myId: null,
      date: new Date(2024, 0, 1),
      turnMode: 'month',
      turn: 0,
      countries,
      provinces: generateProvinces(),
      actionQueue: [],
      wars: [],
      alliances: [],
      news: [],
      selectedId: null,
      casusBelli: {}, // myId -> targetId -> turns left
      chatTarget: null,
    };
    return this;
  },

  get my() { return this.state.countries[this.state.myId]; },
  get sel() { return this.state.countries[this.state.selectedId]; },

  // ─── TURN ────────────────────────────────────────────────
  nextTurn() {
    const S = this.state;
    S.turn++;

    // Advance date
    if (S.turnMode === 'month') {
      S.date = new Date(S.date.getFullYear(), S.date.getMonth() + 1, 1);
    } else {
      S.date = new Date(S.date.getTime() + 7 * 86400000);
    }

    // Process my action queue
    const done = [];
    S.actionQueue = S.actionQueue.filter(a => {
      a.remaining--;
      if (a.remaining <= 0) { done.push(a); return false; }
      return true;
    });
    done.forEach(a => { if (a.onComplete) a.onComplete(); });

    // Economy tick for all
    Object.values(S.countries).forEach(c => {
      const baseIncome = 8 + c.buildings.factory * 12;
      c.economy = Math.min(500, c.economy + baseIncome);
      // War drain
      c.atWar.forEach(() => { c.economy = Math.max(0, c.economy - 5); });
      // Population growth (yearly)
      if (S.turn % 12 === 0) c.population = Math.round(c.population * 1.008);
    });

    // Process casus belli timers (mine)
    if (!S.casusBelli[S.myId]) S.casusBelli[S.myId] = {};
    Object.keys(S.casusBelli[S.myId] || {}).forEach(tid => {
      if (S.casusBelli[S.myId][tid] > 0) {
        S.casusBelli[S.myId][tid]--;
        if (S.casusBelli[S.myId][tid] === 0) {
          const tc = S.countries[tid];
          this.addNews('casus', `CASUS BELLI ГОТОВ: ${tc?.name}`, `Оправдание войны против ${tc?.flag} ${tc?.name} завершено. Можете объявить войну.`, [this.my?.id, tid]);
          UI.showNotif(`⚔ Casus Belli готов! Можно атаковать ${tc?.name}`, 'war');
        }
      }
    });

    // Process wars
    this._processWars();

    // AI turns
    this._runAI();

    return this;
  },

  // ─── ACTIONS ─────────────────────────────────────────────
  queueAction(action) {
    this.state.actionQueue.push({ ...action, owner: this.state.myId });
  },

  trainBrigade() {
    const my = this.my;
    if (my.economy < 30) return { ok: false, msg: 'Недостаточно экономики (нужно 30)' };
    my.economy -= 30;
    this.queueAction({
      type: 'military', icon: '⚔', name: 'Формирование бригады',
      total: 3, remaining: 3, cost: 30,
      onComplete: () => {
        my.brigades++;
        this.addNews('military', `Новая бригада сформирована`,
          `${my.flag} ${my.name} завершила формирование боевой бригады. Армия усилилась до ${my.brigades} бригад.`,
          [my.id]);
      }
    });
    this.addNews('military', `Формирование бригады начато`,
      `${my.flag} ${my.name} приступила к формированию новой военной бригады. Завершение через 3 хода.`, [my.id]);
    return { ok: true };
  },

  buildFactory() {
    const my = this.my;
    if (my.economy < 50) return { ok: false, msg: 'Недостаточно экономики (нужно 50)' };
    my.economy -= 50;
    this.queueAction({
      type: 'build', icon: '🏭', name: 'Строительство завода',
      total: 4, remaining: 4, cost: 50,
      onComplete: () => {
        my.buildings.factory++;
        this.addNews('build', `Завод построен`,
          `${my.flag} ${my.name} завершила строительство промышленного завода. Ежемесячный доход увеличен на +12 единиц.`,
          [my.id]);
      }
    });
    this.addNews('build', `Начато строительство завода`,
      `${my.flag} ${my.name} выделила средства на строительство нового промышленного комплекса.`, [my.id]);
    return { ok: true };
  },

  buildBarracks() {
    const my = this.my;
    if (my.economy < 40) return { ok: false, msg: 'Недостаточно экономики (нужно 40)' };
    my.economy -= 40;
    this.queueAction({
      type: 'build', icon: '🏰', name: 'Строительство казарм',
      total: 3, remaining: 3, cost: 40,
      onComplete: () => {
        my.buildings.barracks++;
        this.addNews('build', `Казармы построены`,
          `${my.flag} ${my.name} завершила строительство военных казарм. Скорость формирования бригад увеличена.`,
          [my.id]);
      }
    });
    return { ok: true };
  },

  mobilize() {
    const my = this.my;
    if (my.economy < 15) return { ok: false, msg: 'Недостаточно экономики (нужно 15)' };
    my.economy -= 15;
    my.population = Math.round(my.population * 0.96);
    this.queueAction({
      type: 'military', icon: '👥', name: 'Мобилизация',
      total: 1, remaining: 1, cost: 15,
      onComplete: () => {
        my.brigades += 8;
        this.addNews('military', `Мобилизация завершена`,
          `${my.flag} ${my.name} провела мобилизацию резервистов. +8 бригад. Население сократилось на 4%.`,
          [my.id]);
      }
    });
    this.addNews('military', `Объявлена мобилизация`, `${my.flag} ${my.name} объявила о всеобщей мобилизации резервных сил.`, [my.id]);
    return { ok: true };
  },

  improveRelations(targetId) {
    const my = this.my;
    const tc = this.state.countries[targetId];
    if (!tc) return { ok: false, msg: 'Страна не найдена' };
    if (my.economy < 10) return { ok: false, msg: 'Недостаточно экономики (нужно 10)' };
    if (my.atWar.includes(targetId)) return { ok: false, msg: 'Нельзя во время войны' };
    my.economy -= 10;
    this.queueAction({
      type: 'diplo', icon: '🤝', name: `Переговоры с ${tc.name}`,
      total: 2, remaining: 2, cost: 10,
      onComplete: () => {
        my.relations[targetId] = Math.min(100, (my.relations[targetId] || 0) + 22);
        tc.relations[this.state.myId] = Math.min(100, (tc.relations[this.state.myId] || 0) + 12);
        this.addNews('diplo', `Отношения улучшены: ${tc.name}`,
          `Дипломатическая миссия ${my.flag} ${my.name} в ${tc.flag} ${tc.name} завершена успешно. Отношения: ${my.relations[targetId]}.`,
          [my.id, targetId]);
      }
    });
    return { ok: true };
  },

  proposeAlliance(targetId) {
    const my = this.my;
    const tc = this.state.countries[targetId];
    if (!tc) return { ok: false, msg: 'Страна не найдена' };
    const rel = my.relations[targetId] || 0;
    if (rel < 60) return { ok: false, msg: `Отношения слишком низкие (${rel}/60)` };
    if (this.state.alliances.some(a => a.includes(this.state.myId) && a.includes(targetId))) {
      return { ok: false, msg: 'Уже в союзе' };
    }
    this.state.alliances.push([this.state.myId, targetId]);
    my.alliances = my.alliances || [];
    tc.alliances = tc.alliances || [];
    my.alliances.push(targetId);
    tc.alliances.push(this.state.myId);
    this.addNews('diplo', `Военный союз заключён!`,
      `${my.flag} ${my.name} и ${tc.flag} ${tc.name} официально подписали договор о военном союзе. Мировое сообщество реагирует на новый геополитический блок.`,
      [my.id, targetId]);
    return { ok: true };
  },

  startCasusBelli(targetId) {
    const my = this.my;
    const tc = this.state.countries[targetId];
    if (!tc) return { ok: false, msg: 'Страна не найдена' };
    if (my.economy < 20) return { ok: false, msg: 'Недостаточно экономики (нужно 20)' };
    if (my.atWar.includes(targetId)) return { ok: false, msg: 'Уже в состоянии войны' };

    const S = this.state;
    if (!S.casusBelli[S.myId]) S.casusBelli[S.myId] = {};
    if (S.casusBelli[S.myId][targetId] !== undefined) return { ok: false, msg: 'Уже оправдывается' };

    my.economy -= 20;
    S.casusBelli[S.myId][targetId] = 4;

    // Relations penalty worldwide
    Object.keys(my.relations).forEach(id => {
      my.relations[id] = Math.max(-100, (my.relations[id] || 0) - 8);
    });

    this.queueAction({
      type: 'casus', icon: '⚖', name: `Casus Belli: ${tc.name}`,
      total: 4, remaining: 4, cost: 20,
      onComplete: () => {} // handled by turn timer above
    });

    this.addNews('war', `Оправдание войны против ${tc.name}`,
      `${my.flag} ${my.name} начала юридическую процедуру обоснования войны против ${tc.flag} ${tc.name}. Мировые СМИ наполнены тревогой. Завершение через 4 хода.`,
      [my.id, targetId]);
    return { ok: true };
  },

  declareWar(targetId) {
    const my = this.my;
    const tc = this.state.countries[targetId];
    const S = this.state;
    if (!tc) return { ok: false, msg: 'Страна не найдена' };
    if (my.brigades < 3) return { ok: false, msg: 'Нужно минимум 3 бригады' };
    if (my.atWar.includes(targetId)) return { ok: false, msg: 'Уже воюете' };
    // Check casus belli
    const hasCB = S.casusBelli[S.myId]?.[targetId] === 0;
    if (!hasCB) return { ok: false, msg: 'Сначала получите Casus Belli (4 хода)' };

    my.atWar.push(targetId);
    tc.atWar.push(S.myId);
    delete S.casusBelli[S.myId][targetId];

    // Remove casus belli action from queue
    S.actionQueue = S.actionQueue.filter(a => !(a.type === 'casus' && a.name.includes(tc.name)));

    S.wars.push({ id: `war_${S.turn}`, attacker: S.myId, defender: targetId, startTurn: S.turn, battles: 0 });

    // Massive relation drop
    Object.keys(my.relations).forEach(id => { my.relations[id] = Math.max(-100, (my.relations[id] || 0) - 20); });

    this.addNews('war', `⚔ ВОЙНА ОБЪЯВЛЕНА: ${my.name} → ${tc.name}`,
      `${my.flag} ${my.name} официально объявила войну ${tc.flag} ${tc.name}. Военные колонны пересекают границу. Мир стоит на пороге масштабного конфликта.`,
      [my.id, targetId]);
    return { ok: true };
  },

  makePeace(targetId) {
    const my = this.my;
    const tc = this.state.countries[targetId];
    const S = this.state;
    const wi = S.wars.findIndex(w =>
      (w.attacker === S.myId && w.defender === targetId) ||
      (w.attacker === targetId && w.defender === S.myId));
    if (wi < 0) return { ok: false, msg: 'Войны нет' };
    S.wars.splice(wi, 1);
    my.atWar = my.atWar.filter(x => x !== targetId);
    tc.atWar = tc.atWar.filter(x => x !== S.myId);
    my.relations[targetId] = Math.min(100, (my.relations[targetId] || 0) + 15);
    tc.relations[S.myId] = Math.min(100, (tc.relations[S.myId] || 0) + 15);
    this.addNews('diplo', `Мирный договор: ${my.name} — ${tc.name}`,
      `${my.flag} ${my.name} и ${tc.flag} ${tc.name} подписали мирный договор. Война завершена. Обе стороны начинают восстановление.`,
      [my.id, targetId]);
    return { ok: true };
  },

  // ─── WARS ────────────────────────────────────────────────
  _processWars() {
    const S = this.state;
    const toEnd = [];

    S.wars.forEach(war => {
      const att = S.countries[war.attacker];
      const def = S.countries[war.defender];
      if (!att || !def) { toEnd.push(war.id); return; }
      war.battles++;

      const attPow = att.brigades * (1 + att.economy / 250) * (1 + att.buildings.barracks * 0.1);
      const defPow = def.brigades * (1 + def.economy / 250) * 1.15; // defender bonus

      // Ally support
      const getAllyPow = (id) => {
        let bonus = 0;
        S.alliances.forEach(a => {
          if (a.includes(id)) {
            const allyId = a.find(x => x !== id);
            const ally = S.countries[allyId];
            if (ally && !ally.atWar.includes(id === war.attacker ? war.defender : war.attacker)) {
              bonus += ally.brigades * 0.3;
            }
          }
        });
        return bonus;
      };

      const totalAtt = attPow + getAllyPow(war.attacker);
      const totalDef = defPow + getAllyPow(war.defender);

      // Attrition
      att.brigades = Math.max(0, att.brigades - Math.ceil(totalDef / 40));
      def.brigades = Math.max(0, def.brigades - Math.ceil(totalAtt / 40));

      // Territory capture
      if (totalAtt > totalDef * 1.25 && war.battles % 2 === 0) {
        const defProvinces = def.provinces.filter(p => S.provinces[p]?.owner === def.id);
        if (defProvinces.length > 0) {
          const captured = defProvinces[Math.floor(Math.random() * defProvinces.length)];
          S.provinces[captured].owner = att.id;
          att.provinces.push(captured);
          def.provinces.splice(def.provinces.indexOf(captured), 1);

          const isMyWar = war.attacker === S.myId || war.defender === S.myId;
          this.addNews('war',
            `${att.name} захватила провинцию у ${def.name}`,
            `Войска ${att.flag} ${att.name} заняли ещё одну провинцию ${def.flag} ${def.name}. Линия фронта смещается. Потери с обеих сторон исчисляются тысячами.`,
            [att.id, def.id]);

          if (defProvinces.length === 1) {
            this._endWar(war, 'attacker');
            toEnd.push(war.id);
          }
        }
      } else if (totalDef > totalAtt * 1.4 && att.brigades < 2) {
        this._endWar(war, 'defender');
        toEnd.push(war.id);
      }
    });

    S.wars = S.wars.filter(w => !toEnd.includes(w.id));
  },

  _endWar(war, winner) {
    const S = this.state;
    const att = S.countries[war.attacker];
    const def = S.countries[war.defender];
    if (!att || !def) return;
    att.atWar = att.atWar.filter(x => x !== war.defender);
    def.atWar = def.atWar.filter(x => x !== war.attacker);
    const winnerC = winner === 'attacker' ? att : def;
    const loserC = winner === 'attacker' ? def : att;
    this.addNews('war',
      `⚔ Война завершена: ${winnerC.name} победила!`,
      `${winnerC.flag} ${winnerC.name} одержала победу в войне против ${loserC.flag} ${loserC.name}. ${loserC.name} подписала капитуляцию. Геополитический баланс изменился.`,
      [winnerC.id, loserC.id]);
  },

  // ─── AI ──────────────────────────────────────────────────
  _runAI() {
    const S = this.state;
    Object.values(S.countries).forEach(c => {
      if (c.id === S.myId) return;
      const mem = c.aiMemory;
      const r = Math.random();

      // Economy building
      if (c.economy > 55 && c.buildings.factory < 6 && r < 0.12) {
        c.economy -= 50;
        c.buildings.factory++;
      }

      // Brigade training (simplified, instant for AI)
      if (c.economy > 35 && r < 0.18) {
        c.economy -= 30;
        c.brigades++;
      }

      // Diplomacy: improve with ideology allies
      if (r < 0.08) {
        const candidates = Object.values(S.countries).filter(o =>
          o.id !== c.id && o.ideology === c.ideology && (c.relations[o.id] || 0) < 75);
        if (candidates.length > 0) {
          const t = candidates[Math.floor(Math.random() * candidates.length)];
          c.relations[t.id] = Math.min(100, (c.relations[t.id] || 0) + 6);
          t.relations[c.id] = Math.min(100, (t.relations[c.id] || 0) + 4);
        }
      }

      // Alliance formation
      if (r < 0.02 && c.atWar.length === 0) {
        const potential = Object.values(S.countries).filter(o =>
          o.id !== c.id &&
          (c.relations[o.id] || 0) >= 65 &&
          !S.alliances.some(a => a.includes(c.id) && a.includes(o.id)));
        if (potential.length > 0) {
          const ally = potential[0];
          S.alliances.push([c.id, ally.id]);
          c.alliances = c.alliances || [];
          ally.alliances = ally.alliances || [];
          c.alliances.push(ally.id);
          ally.alliances.push(c.id);
          this.addNews('diplo',
            `Союз: ${c.name} и ${ally.name}`,
            `${c.flag} ${c.name} и ${ally.flag} ${ally.name} подписали договор о взаимной обороне. Новый альянс меняет расстановку сил.`,
            [c.id, ally.id]);
        }
      }

      // AI wars
      if (r < 0.025 * mem.aggression && c.brigades > 12 && c.atWar.length === 0 && S.turn > 3) {
        const enemies = Object.values(S.countries).filter(o =>
          o.id !== c.id &&
          o.id !== S.myId &&
          o.atWar.length === 0 &&
          (c.relations[o.id] || 0) < -25 &&
          o.brigades < c.brigades * 1.8 &&
          !S.alliances.some(a => a.includes(c.id) && a.includes(o.id)));
        if (enemies.length > 0) {
          const enemy = enemies[Math.floor(Math.random() * enemies.length)];
          c.atWar.push(enemy.id);
          enemy.atWar.push(c.id);
          S.wars.push({ id: `aiwar_${S.turn}_${c.id}`, attacker: c.id, defender: enemy.id, startTurn: S.turn, battles: 0 });
          this.addNews('war',
            `⚔ ${c.name} объявила войну ${enemy.name}!`,
            `${c.flag} ${c.name} перешла к открытой агрессии против ${enemy.flag} ${enemy.name}. Армии движутся к границе. ООН экстренно созывает заседание Совета Безопасности.`,
            [c.id, enemy.id]);
        }
      }

      // AI peace if losing badly
      c.atWar.forEach(eid => {
        const enemy = S.countries[eid];
        if (!enemy) return;
        if (c.brigades < 2 && Math.random() < 0.45) {
          const wi = S.wars.findIndex(w =>
            (w.attacker === c.id && w.defender === eid) ||
            (w.attacker === eid && w.defender === c.id));
          if (wi >= 0) {
            S.wars.splice(wi, 1);
            c.atWar = c.atWar.filter(x => x !== eid);
            enemy.atWar = enemy.atWar.filter(x => x !== c.id);
            this.addNews('diplo',
              `Перемирие: ${c.name} — ${enemy.name}`,
              `Истощённые войной ${c.flag} ${c.name} и ${enemy.flag} ${enemy.name} согласились на перемирие. Военные действия приостановлены.`,
              [c.id, eid]);
          }
        }
      });

      // Secessionism: if many provinces lost, may split
      if (c.provinces.length === 0 && r < 0.3) {
        // Country dissolved - mark as conquered
        c.dissolved = true;
      }
    });
  },

  // ─── NEWS ────────────────────────────────────────────────
  addNews(type, title, body, countryIds = []) {
    const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
    const d = this.state.date;
    const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    const countries = countryIds.map(id => this.state.countries[id]).filter(Boolean);
    this.state.news.push({ type, title, body, dateStr, countries, id: Date.now() + Math.random() });
    // Notify UI
    if (typeof UI !== 'undefined') UI.onNewNews(this.state.news[this.state.news.length - 1]);
  },

  // ─── HELPERS ─────────────────────────────────────────────
  getRelLabel(val) {
    if (val >= 70) return 'Союзник';
    if (val >= 40) return 'Дружелюбный';
    if (val >= 10) return 'Нейтральный';
    if (val >= -30) return 'Напряжённый';
    if (val >= -60) return 'Враждебный';
    return 'Заклятый враг';
  },

  getEconLabel(val) {
    if (val > 180) return 'Супердержава';
    if (val > 110) return 'Великая держава';
    if (val > 70) return 'Региональная держава';
    if (val > 35) return 'Средняя держава';
    if (val > 15) return 'Малая держава';
    return 'Слабая страна';
  },

  getFuzzyBrigades(count) {
    const fuzz = 0.65 + Math.random() * 0.7;
    return '~' + Math.round(count * fuzz);
  },

  hasCasusBelli(targetId) {
    const S = this.state;
    return S.casusBelli[S.myId]?.[targetId] === 0;
  },

  casusBelliProgress(targetId) {
    const S = this.state;
    const v = S.casusBelli[S.myId]?.[targetId];
    return v;
  },

  isAllied(a, b) {
    return this.state.alliances.some(al => al.includes(a) && al.includes(b));
  },

  myAllies() {
    return this.state.alliances
      .filter(a => a.includes(this.state.myId))
      .map(a => a.find(id => id !== this.state.myId))
      .map(id => this.state.countries[id])
      .filter(Boolean);
  },
};
