(function () {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const segment = (progress, start, end) => smooth(clamp((progress - start) / (end - start), 0, 1));
  const dataNumber = (element, name, fallback) => {
    const value = parseFloat(element?.dataset?.[name]);
    return Number.isFinite(value) ? value : fallback;
  };
  const cssNumber = (element, name, fallback) => {
    const value = parseFloat(getComputedStyle(element).getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };
  const scrollPoint = (root, key, fallback) => dataNumber(root, key, fallback * 100) / 100;
  const sceneOpacity = (progress, enterStart, enterEnd, exitStart, exitEnd) => {
    const enter = segment(progress, enterStart, enterEnd);
    const exit = segment(progress, exitStart, exitEnd);
    return clamp(enter * (1 - exit), 0, 1);
  };

  function initSection(root) {
    if (!root || root.__editorialStoryInit) return;
    root.__editorialStoryInit = true;

    const rail = root.querySelector('.es-story__rail');
    const scenes = Array.from(root.querySelectorAll('.es-story__scene'));
    const hero = root.querySelector('.es-story__scene--1');
    const heroTitle = hero?.querySelector('.es-story__title--hero');
    const heroEyebrow = hero?.querySelector('.es-story__eyebrow');
    const heroCard = hero?.querySelector('.es-story__hero-card');
    const heroBg = hero?.querySelector('.es-story__bgimg--hero');

    const scene2 = root.querySelector('.es-story__scene--2');
    const manifestoText = scene2?.querySelector('.es-story__manifesto-text');
    const manifestoCards = Array.from(scene2?.querySelectorAll('.es-story__manifesto-card') || []);
    const metaRow = scene2?.querySelector('.es-story__meta-row');

    const scene3 = root.querySelector('.es-story__scene--3');
    const galleryStrip = scene3?.querySelector('.es-story__gallery-strip');
    const galleryCopy = scene3?.querySelector('.es-story__gallery-copy');
    const galleryCards = Array.from(scene3?.querySelectorAll('.es-story__gallery-card') || []);
    const galleryHeadline = scene3?.querySelector('.es-story__gallery-headline');

    const scene4 = root.querySelector('.es-story__scene--4');
    const boardSymbols = scene4?.querySelector('.es-story__symbols');
    const boardHeadline = scene4?.querySelector('.es-story__board-headline');
    const boardChips = Array.from(scene4?.querySelectorAll('.es-story__board-chip') || []);
    const dashedLine = scene4?.querySelector('.es-story__dashed-line');
    const eventItems = Array.from(scene4?.querySelectorAll('.es-story__event-item') || []);

    const scene5 = root.querySelector('.es-story__scene--5');
    const returnBg = scene5?.querySelector('.es-story__bgimg--scene5');
    const infoCluster = scene5?.querySelector('.es-story__info-cluster');
    const returnHeadline = scene5?.querySelector('.es-story__return-headline');

    const scene6 = root.querySelector('.es-story__scene--6');
    const footerTop = scene6?.querySelector('.es-story__footer-top');
    const footerWord = scene6?.querySelector('.es-story__footer-word');

    const windows = {
      s1: { enterStart: scrollPoint(root, 's1EnterStart', 0.00), enterEnd: scrollPoint(root, 's1EnterEnd', 0.07), exitStart: scrollPoint(root, 's1ExitStart', 0.10), exitEnd: scrollPoint(root, 's1ExitEnd', 0.18) },
      s2: { enterStart: scrollPoint(root, 's2EnterStart', 0.12), enterEnd: scrollPoint(root, 's2EnterEnd', 0.22), exitStart: scrollPoint(root, 's2ExitStart', 0.28), exitEnd: scrollPoint(root, 's2ExitEnd', 0.36) },
      s3: { enterStart: scrollPoint(root, 's3EnterStart', 0.31), enterEnd: scrollPoint(root, 's3EnterEnd', 0.40), exitStart: scrollPoint(root, 's3ExitStart', 0.47), exitEnd: scrollPoint(root, 's3ExitEnd', 0.56) },
      s4: { enterStart: scrollPoint(root, 's4EnterStart', 0.50), enterEnd: scrollPoint(root, 's4EnterEnd', 0.58), exitStart: scrollPoint(root, 's4ExitStart', 0.67), exitEnd: scrollPoint(root, 's4ExitEnd', 0.75) },
      s5: { enterStart: scrollPoint(root, 's5EnterStart', 0.70), enterEnd: scrollPoint(root, 's5EnterEnd', 0.78), exitStart: scrollPoint(root, 's5ExitStart', 0.86), exitEnd: scrollPoint(root, 's5ExitEnd', 0.93) },
      s6: { enterStart: scrollPoint(root, 's6EnterStart', 0.88), enterEnd: scrollPoint(root, 's6EnterEnd', 0.95), exitStart: scrollPoint(root, 's6ExitStart', 0.985), exitEnd: scrollPoint(root, 's6ExitEnd', 1.00) }
    };

    let ticking = false;

    const applyHeight = () => {
      const desktop = parseFloat(root.dataset.scrollHeight || '580');
      const mobile = parseFloat(root.dataset.mobileHeight || '520');
      const breakpoint = parseInt(root.dataset.mobileBreakpoint || '768', 10);
      const value = window.innerWidth < breakpoint ? mobile : desktop;
      root.style.setProperty('--es-scroll-height', `${value}vh`);
    };

    const update = () => {
      ticking = false;
      const rect = root.getBoundingClientRect();
      const scrollable = Math.max(root.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / scrollable, 0, 1);
      const mobileMotion = window.innerWidth < 768 ? 0.62 : 1;

      const s1 = sceneOpacity(progress, windows.s1.enterStart, windows.s1.enterEnd, windows.s1.exitStart, windows.s1.exitEnd);
      const s2 = sceneOpacity(progress, windows.s2.enterStart, windows.s2.enterEnd, windows.s2.exitStart, windows.s2.exitEnd);
      const s3 = sceneOpacity(progress, windows.s3.enterStart, windows.s3.enterEnd, windows.s3.exitStart, windows.s3.exitEnd);
      const s4 = sceneOpacity(progress, windows.s4.enterStart, windows.s4.enterEnd, windows.s4.exitStart, windows.s4.exitEnd);
      const s5 = sceneOpacity(progress, windows.s5.enterStart, windows.s5.enterEnd, windows.s5.exitStart, windows.s5.exitEnd);
      const s6 = sceneOpacity(progress, windows.s6.enterStart, windows.s6.enterEnd, windows.s6.exitStart, windows.s6.exitEnd);

      if (hero) {
        const outT = segment(progress, windows.s1.exitStart, windows.s1.exitEnd);
        const heroVisible = clamp(1 - outT * 0.95, 0, 1);
        hero.style.opacity = String(heroVisible);
        hero.style.transform = `translate3d(0, ${lerp(0, -10, outT)}%, 0)`;
        if (heroTitle) {
          heroTitle.style.opacity = String(clamp(1 - outT * 1.15, 0, 1));
          heroTitle.style.transform = `translate3d(0, ${lerp(0, -12, outT)}%, 0) scale(${lerp(1, 1.02, outT)})`;
        }
        if (heroEyebrow) {
          heroEyebrow.style.opacity = String(clamp(1 - outT * 1.2, 0, 1));
          heroEyebrow.style.transform = `translate3d(0, ${lerp(0, -18, outT)}px, 0)`;
        }
        if (heroCard) {
          heroCard.style.opacity = String(clamp(1 - outT * 1.05, 0, 1));
          const enterY = dataNumber(heroCard, 'enterY', 0) * mobileMotion;
          const exitY = dataNumber(heroCard, 'exitY', -88) * mobileMotion;
          const scaleFrom = dataNumber(heroCard, 'scaleFrom', 1);
          const scaleTo = dataNumber(heroCard, 'scaleTo', 1.025);
          heroCard.style.transform = `translate3d(0, ${lerp(enterY, exitY, outT)}px, 0) scale(${lerp(scaleFrom, scaleTo, outT)})`;
        }
        if (heroBg) {
          heroBg.style.transform = `translate3d(0, ${lerp(0, -7, progress)}%, 0) scale(${lerp(1.04, 1.01, outT)})`;
        }
      }

      if (scene2) {
        const inT = segment(progress, windows.s2.enterStart, windows.s2.enterEnd);
        const outT = segment(progress, windows.s2.exitStart, windows.s2.exitEnd);
        scene2.style.opacity = String(s2);
        scene2.style.transform = `translate3d(0, ${lerp(105, -18, inT) - outT * 20}%, 0)`;
        if (manifestoText) {
          manifestoText.style.opacity = String(clamp(inT * 1.05, 0, 1));
          manifestoText.style.transform = `scale(${lerp(1.04, 1.0, inT)}) translate3d(0, ${lerp(18, -8, outT)}px, 0)`;
        }
        manifestoCards.forEach((card, index) => {
          const offset = dataNumber(card, 'enterX', index === 0 ? -80 : index === 1 ? 80 : 24) * mobileMotion;
          const rise = dataNumber(card, 'enterY', index === 2 ? 80 : 54) * mobileMotion;
          const exitY = dataNumber(card, 'exitY', -24) * mobileMotion;
          const scaleFrom = dataNumber(card, 'scaleFrom', 0.92);
          const scaleTo = dataNumber(card, 'scaleTo', 1.02);
          const fadeMult = dataNumber(card, 'fadeMult', 0.4);
          const staggerAmount = dataNumber(card, 'stagger', 0.08);
          const restRotation = cssNumber(card, '--es-card-rotate', 0);
          const staggerIn = clamp(inT - index * staggerAmount, 0, 1);
          card.style.opacity = String(staggerIn * (1 - outT * fadeMult));
          card.style.transform = `translate3d(${lerp(offset, 0, staggerIn)}px, ${lerp(rise, exitY, outT)}px, 0) rotate(${restRotation}deg) scale(${lerp(scaleFrom, scaleTo, staggerIn)})`;
        });
        if (metaRow) {
          const metaIn = clamp(inT - 0.35, 0, 1);
          metaRow.style.opacity = String(metaIn * (1 - outT * 0.4));
          metaRow.style.transform = `translate3d(0, ${lerp(30, -8, outT)}px, 0)`;
        }
      }

      if (scene3) {
        const inT = segment(progress, windows.s3.enterStart, windows.s3.enterEnd);
        const outT = segment(progress, windows.s3.exitStart, windows.s3.exitEnd);
        scene3.style.opacity = String(s3);
        scene3.style.transform = `translate3d(0, ${lerp(110, -16, inT) - outT * 14}%, 0)`;
        if (galleryStrip) {
          galleryStrip.style.opacity = String(inT);
          galleryStrip.style.transform = `translate3d(0, ${lerp(40, -16, outT)}px, 0) scale(${lerp(1.06, 1.0, inT)})`;
        }
        if (galleryCopy) {
          galleryCopy.style.opacity = String(clamp(inT - 0.1, 0, 1));
          galleryCopy.style.transform = `translate3d(${lerp(-28, 0, inT)}px, ${lerp(12, -18, outT)}px, 0)`;
        }
        galleryCards.forEach((card, index) => {
          const staggerAmount = dataNumber(card, 'stagger', 0.07);
          const stagger = clamp(inT - index * staggerAmount, 0, 1);
          const xOffset = dataNumber(card, 'enterX', [-80, 56, 88, -48, 36][index] || 0) * mobileMotion;
          const yOffset = dataNumber(card, 'enterY', [70, 52, 38, 60, 40][index] || 50) * mobileMotion;
          const exitY = dataNumber(card, 'exitY', -24) * mobileMotion;
          const scaleFrom = dataNumber(card, 'scaleFrom', 1);
          const scaleTo = dataNumber(card, 'scaleTo', 1);
          const fadeMult = dataNumber(card, 'fadeMult', 0.35);
          const restRotation = cssNumber(card, '--es-card-rotate', 0);
          const enterRotation = restRotation + (index % 2 ? -2.8 : 2.8);
          card.style.opacity = String(stagger * (1 - outT * fadeMult));
          card.style.transform = `translate3d(${lerp(xOffset, 0, stagger)}px, ${lerp(yOffset, exitY, outT)}px, 0) rotate(${lerp(enterRotation, restRotation, stagger)}deg) scale(${lerp(scaleFrom, scaleTo, stagger)})`;
        });
        if (galleryHeadline) {
          const headlineIn = clamp(inT - 0.25, 0, 1);
          galleryHeadline.style.opacity = String(headlineIn * (1 - outT * 0.3));
          galleryHeadline.style.transform = `translate3d(0, ${lerp(46, -12, outT)}px, 0) scale(${lerp(0.96, 1.0, headlineIn)})`;
        }
      }

      if (scene4) {
        const inT = segment(progress, windows.s4.enterStart, windows.s4.enterEnd);
        const outT = segment(progress, windows.s4.exitStart, windows.s4.exitEnd);
        scene4.style.opacity = String(s4);
        scene4.style.transform = `translate3d(0, ${lerp(108, -14, inT) - outT * 18}%, 0)`;
        if (boardSymbols) {
          boardSymbols.style.opacity = String(inT);
          boardSymbols.style.transform = `translate3d(-50%, ${lerp(16, -8, outT)}px, 0)`;
        }
        if (boardHeadline) {
          boardHeadline.style.opacity = String(inT);
          boardHeadline.style.transform = `translate3d(-50%, ${lerp(34, -18, outT)}px, 0) scale(${lerp(1.04, 1.0, inT)})`;
        }
        boardChips.forEach((chip, index) => {
          const stagger = clamp(inT - 0.18 - index * 0.1, 0, 1);
          const xOffset = dataNumber(chip, 'enterX', index === 0 ? -30 : 30) * mobileMotion;
          const yOffset = dataNumber(chip, 'enterY', 26) * mobileMotion;
          const exitY = dataNumber(chip, 'exitY', -12) * mobileMotion;
          const scaleFrom = dataNumber(chip, 'scaleFrom', 0.92);
          const scaleTo = dataNumber(chip, 'scaleTo', 1);
          const restRotation = cssNumber(chip, '--es-card-rotate', 0);
          chip.style.opacity = String(stagger * (1 - outT * 0.45));
          chip.style.transform = `translate3d(${lerp(xOffset, 0, stagger)}px, ${lerp(yOffset, exitY, outT)}px, 0) rotate(${restRotation}deg) scale(${lerp(scaleFrom, scaleTo, stagger)})`;
        });
        if (dashedLine) {
          const lineIn = clamp(inT - 0.35, 0, 1);
          dashedLine.style.opacity = String(lineIn * (1 - outT * 0.2));
          dashedLine.style.transform = `scaleX(${lineIn}) translate3d(0, ${lerp(12, 0, lineIn)}px, 0)`;
          dashedLine.style.transformOrigin = 'center center';
        }
        eventItems.forEach((item, index) => {
          const rowDelay = (index % 4) * 0.04 + Math.floor(index / 4) * 0.08;
          const stagger = clamp(inT - 0.34 - rowDelay, 0, 1);
          item.style.opacity = String(stagger * (1 - outT * 0.25));
          item.style.transform = `translate3d(0, ${lerp(36, -8, outT)}px, 0)`;
        });
      }

      if (scene5) {
        const inT = segment(progress, windows.s5.enterStart, windows.s5.enterEnd);
        const outT = segment(progress, windows.s5.exitStart, windows.s5.exitEnd);
        scene5.style.opacity = String(s5);
        scene5.style.transform = `translate3d(0, ${lerp(102, -10, inT) - outT * 16}%, 0)`;
        if (returnBg) {
          returnBg.style.transform = `translate3d(0, ${lerp(0, -8, progress)}%, 0) scale(${lerp(1.07, 1.03, inT)})`;
        }
        if (infoCluster) {
          infoCluster.style.opacity = String(inT);
          infoCluster.style.transform = `translate3d(${lerp(42, -12, outT)}px, ${lerp(46, -20, outT)}px, 0) scale(${lerp(0.95, 1.0, inT)})`;
        }
        if (returnHeadline) {
          const headlineIn = clamp(inT - 0.2, 0, 1);
          returnHeadline.style.opacity = String(headlineIn * (1 - outT * 0.25));
          returnHeadline.style.transform = `translate3d(0, ${lerp(56, -12, outT)}px, 0) scale(${lerp(0.96, 1.0, headlineIn)})`;
        }
      }

      if (scene6) {
        const inT = segment(progress, windows.s6.enterStart, windows.s6.enterEnd);
        const outT = segment(progress, windows.s6.exitStart, windows.s6.exitEnd);
        scene6.style.opacity = String(s6);
        scene6.style.transform = `translate3d(0, ${lerp(100, 0, inT) - outT * 6}%, 0)`;
        if (footerTop) {
          footerTop.style.opacity = String(clamp(inT - 0.06, 0, 1));
          footerTop.style.transform = `translate3d(0, ${lerp(28, -10, outT)}px, 0)`;
        }
        if (footerWord) {
          footerWord.style.opacity = String(inT);
          footerWord.style.transform = `translate3d(0, ${lerp(70, -18, outT)}px, 0) scale(${lerp(1.02, 1.0, inT)})`;
        }
      }

      scenes.forEach((scene) => {
        const currentOpacity = parseFloat(scene.style.opacity || '0');
        scene.style.visibility = currentOpacity > 0.01 ? 'visible' : 'hidden';
      });
    };

    const requestTick = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    applyHeight();
    update();

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', () => {
      applyHeight();
      requestTick();
    }, { passive: true });

    document.addEventListener('shopify:section:reorder', requestTick);
    document.addEventListener('shopify:section:select', requestTick);
  }

  function boot() {
    document.querySelectorAll('[data-editorial-scroll-story]').forEach(initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (event) {
    const section = event.target?.querySelector?.('[data-editorial-scroll-story]') || event.target;
    if (section?.matches?.('[data-editorial-scroll-story]')) {
      initSection(section);
    }
  });
})();
