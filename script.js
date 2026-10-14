/* WireFizz website interactions */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  // Mobile navigation and sticky header style.
  const header = $('.site-header');
  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');

  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    mainNav.classList.remove('is-open');
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(willOpen));
      menuToggle.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
      mainNav.classList.toggle('is-open', willOpen);
    });
    $$('.main-nav a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (event) => {
      if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 15);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Reveal-on-scroll, with a graceful fallback for older browsers.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Keep the navigation's active marker aligned with the visible section.
  const navLinks = $$('.nav-link');
  const navSections = navLinks.map((link) => $(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && navSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.35] });
    navSections.forEach((section) => sectionObserver.observe(section));
  }

  // Portfolio rendering and category filters.
  const projects = Array.isArray(window.WIREFIZZ_PROJECTS) ? window.WIREFIZZ_PROJECTS : [];
  const projectGrid = $('#projectGrid');
  const projectFilters = $('#projectFilters');
  const projectCount = $('#projectCount');
  const dialog = $('#projectDialog');
  const dialogContent = $('#dialogContent');
  const dialogClose = $('#dialogClose');
  let activeFilter = 'All';

  const categories = ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))];

  const renderFilters = () => {
    if (!projectFilters) return;
    projectFilters.innerHTML = categories.map((category) => `
      <button type="button" class="filter-btn${category === activeFilter ? ' active' : ''}"
        aria-pressed="${category === activeFilter}" data-filter="${escapeHTML(category)}">${escapeHTML(category)}</button>
    `).join('');
    $$('.filter-btn', projectFilters).forEach((button) => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'All';
      renderFilters();
      renderProjects();
    }));
  };

  const projectCard = (project) => {
    const title = escapeHTML(project.title || 'Untitled project');
    const category = escapeHTML(project.category || 'Project');
    const type = escapeHTML(project.type || 'Portfolio project');
    const description = escapeHTML(project.description || 'Project details coming soon.');
    const image = escapeHTML(project.image || 'assets/wirefizz-mark.svg');
    const alt = escapeHTML(project.alt || `${project.title || 'Project'} preview image`);
    const imageCount = Array.isArray(project.gallery) && project.gallery.length
      ? project.gallery.length : 1;
    const tags = (Array.isArray(project.tags) ? project.tags : []).slice(0, 5)
      .map((tag) => `<span class="project-tag">${escapeHTML(tag)}</span>`).join('');
    return `
      <article class="project-card reveal is-visible" data-project-id="${escapeHTML(project.id || '')}">
        <div class="project-image-wrap">
          <button type="button" class="project-image-trigger" data-open-project="${escapeHTML(project.id || '')}"
            aria-label="Open ${title} image gallery with ${imageCount} screenshots">
            <img class="project-image" src="${image}" alt="${alt}" loading="lazy" />
            <span class="project-image-badge"><i></i> SAMPLE PROJECT</span>
            <span class="project-image-open"><span aria-hidden="true">⌕</span> View ${imageCount} images</span>
          </button>
        </div>
        <div class="project-body">
          <div class="project-meta"><span class="project-category">${category}</span><span class="project-concept">${type}</span></div>
          <h3 class="project-title">${title}</h3>
          <p class="project-description">${description}</p>
          <div class="project-tags">${tags}</div>
          <div class="project-footer"><span class="project-footer-note">${imageCount} screenshots · No sign-in needed</span><button type="button" class="project-open" data-open-project="${escapeHTML(project.id || '')}" aria-label="Preview ${title}">View project <span aria-hidden="true">↗</span></button></div>
        </div>
      </article>`;
  };

  const renderProjects = () => {
    if (!projectGrid) return;
    const filtered = activeFilter === 'All' ? projects : projects.filter((project) => project.category === activeFilter);
    if (!filtered.length) {
      projectGrid.innerHTML = '<div class="project-empty">No projects in this category yet. Choose another filter to explore more.</div>';
    } else {
      projectGrid.innerHTML = filtered.map(projectCard).join('');
      // Attach image fallback after rendering.
      $$('.project-image', projectGrid).forEach((img) => img.addEventListener('error', () => {
        img.src = 'assets/wirefizz-mark.svg';
        img.alt = 'WireFizz project preview placeholder';
      }, { once: true }));
      $$('[data-open-project]', projectGrid).forEach((button) => button.addEventListener('click', () => openProject(button.dataset.openProject)));
    }
    if (projectCount) projectCount.textContent = `${filtered.length} sample ${filtered.length === 1 ? 'concept' : 'concepts'}`;
  };

  let currentProjectGallery = [];
  let currentGalleryIndex = 0;

  const normalizeGallery = (project) => {
    const rawGallery = Array.isArray(project.gallery) && project.gallery.length
      ? project.gallery : [{ src: project.image || 'assets/wirefizz-mark.svg', label: 'Preview', alt: project.alt || project.title || 'Project screenshot' }];
    return rawGallery.map((item, index) => {
      if (typeof item === 'string') return { src: item, label: `Screenshot ${index + 1}`, alt: `${project.title || 'Project'} screenshot ${index + 1}` };
      return {
        src: item.src || project.image || 'assets/wirefizz-mark.svg',
        label: item.label || `Screenshot ${index + 1}`,
        alt: item.alt || `${project.title || 'Project'} screenshot ${index + 1}`
      };
    });
  };

  const setGalleryImage = (index) => {
    if (!currentProjectGallery.length || !dialogContent) return;
    currentGalleryIndex = (index + currentProjectGallery.length) % currentProjectGallery.length;
    const active = currentProjectGallery[currentGalleryIndex];
    const mainImage = $('.dialog-image', dialogContent);
    const caption = $('.gallery-caption', dialogContent);
    const counter = $('.gallery-counter', dialogContent);
    if (mainImage) {
      mainImage.src = active.src;
      mainImage.alt = active.alt;
      mainImage.onerror = () => { mainImage.onerror = null; mainImage.src = 'assets/wirefizz-mark.svg'; };
    }
    if (caption) caption.textContent = active.label;
    if (counter) counter.textContent = `${String(currentGalleryIndex + 1).padStart(2, '0')} / ${String(currentProjectGallery.length).padStart(2, '0')}`;
    $$('.gallery-thumb', dialogContent).forEach((thumb, thumbIndex) => {
      const isActive = thumbIndex === currentGalleryIndex;
      thumb.classList.toggle('active', isActive);
      thumb.setAttribute('aria-pressed', String(isActive));
      if (isActive) thumb.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    });
  };

  const openProject = (projectId) => {
    const project = projects.find((item) => String(item.id) === String(projectId));
    if (!project || !dialog || !dialogContent) return;
    currentProjectGallery = normalizeGallery(project);
    currentGalleryIndex = 0;
    const tags = (Array.isArray(project.tags) ? project.tags : []).map((tag) => `<span class="project-tag">${escapeHTML(tag)}</span>`).join('');
    const hasDemo = typeof project.demoUrl === 'string' && /^https?:\/\//i.test(project.demoUrl);
    const hasSource = typeof project.sourceUrl === 'string' && /^https?:\/\//i.test(project.sourceUrl);
    const externalLinks = [
      hasDemo ? `<a class="btn btn-primary" href="${escapeHTML(project.demoUrl)}" target="_blank" rel="noopener noreferrer">Open live demo ↗</a>` : '',
      hasSource ? `<a class="btn btn-secondary" href="${escapeHTML(project.sourceUrl)}" target="_blank" rel="noopener noreferrer">View source ↗</a>` : ''
    ].filter(Boolean).join('');
    const thumbnails = currentProjectGallery.map((item, index) => `
      <button type="button" class="gallery-thumb${index === 0 ? ' active' : ''}" data-gallery-index="${index}"
        aria-pressed="${index === 0}" aria-label="Show ${escapeHTML(item.label)}">
        <img src="${escapeHTML(item.src)}" alt="" loading="lazy" />
        <span>${escapeHTML(item.label)}</span>
      </button>`).join('');
    dialogContent.innerHTML = `
      <section class="project-gallery-viewer" aria-label="Project screenshots">
        <div class="gallery-main">
          <button type="button" class="gallery-arrow gallery-prev" aria-label="Previous screenshot">‹</button>
          <img class="dialog-image" src="${escapeHTML(currentProjectGallery[0].src)}" alt="${escapeHTML(currentProjectGallery[0].alt)}" />
          <button type="button" class="gallery-arrow gallery-next" aria-label="Next screenshot">›</button>
          <span class="gallery-counter">01 / ${String(currentProjectGallery.length).padStart(2, '0')}</span>
        </div>
        <div class="gallery-caption">${escapeHTML(currentProjectGallery[0].label)}</div>
        <div class="gallery-thumbnails" role="group" aria-label="Choose a project screenshot">${thumbnails}</div>
      </section>
      <div class="dialog-details">
        <div>
          <span class="project-category">${escapeHTML(project.category || 'Portfolio')}</span>
          <h2 id="dialogTitle">${escapeHTML(project.title || 'Project preview')}</h2>
          <p>${escapeHTML(project.description || '')}</p>
          <div class="project-tags" style="margin-top:16px">${tags}</div>
        </div>
        <aside class="dialog-side-note">
          <strong>${escapeHTML(project.type || 'Project preview')}</strong>
          <p>${escapeHTML(project.note || 'A sample project preview. Replace this note with a concise summary of your real project.')}</p>
          ${externalLinks ? `<div class="dialog-link-actions">${externalLinks}</div>` : '<p class="preview-no-link">Browse all screenshots here—no sign-in or live application required.</p>'}
        </aside>
      </div>`;

    $$('.gallery-thumb', dialogContent).forEach((button) => button.addEventListener('click', () => setGalleryImage(Number(button.dataset.galleryIndex) || 0)));
    $('.gallery-prev', dialogContent)?.addEventListener('click', () => setGalleryImage(currentGalleryIndex - 1));
    $('.gallery-next', dialogContent)?.addEventListener('click', () => setGalleryImage(currentGalleryIndex + 1));
    const mainImage = $('.dialog-image', dialogContent);
    mainImage?.addEventListener('error', () => { mainImage.onerror = null; mainImage.src = 'assets/wirefizz-mark.svg'; }, { once: true });

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      document.body.classList.add('dialog-open');
      dialogClose?.focus();
    }
  };

  // Use the left/right keys to move through screenshots while a project is open.
  document.addEventListener('keydown', (event) => {
    if (!dialog?.open || !currentProjectGallery.length) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); setGalleryImage(currentGalleryIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); setGalleryImage(currentGalleryIndex + 1); }
  });

  renderFilters();
  renderProjects();

  if (dialog && dialogClose) {
    dialogClose.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  // Guided service selector: lead-generation website + CRM + follow-up automation.
  const leadFinder = $('#leadFinder');
  if (leadFinder) {
    const answerState = { source: '', challenge: '', setup: '' };
    let leadStep = 1;
    const stepPanels = $$('[data-step-panel]', leadFinder);
    const stepLabel = $('#leadFinderStepLabel');
    const progressText = $('#leadFinderProgressText');
    const progressBars = $$('.lead-progress span', leadFinder);
    const backButton = $('#leadFinderBack');
    const nextButton = $('#leadFinderNext');
    const buildButton = $('#leadFinderBuild');
    const controls = $('#leadFinderControls');
    const result = $('#leadFinderResult');
    const selectionHint = $('#leadSelectionHint');
    const notice = $('#leadFinderNotice');
    const answerForStep = { 1: 'source', 2: 'challenge', 3: 'setup' };
    const stepHeadings = {
      1: 'Your current setup',
      2: 'Your biggest bottleneck',
      3: 'Your existing tools'
    };

    const renderLeadStep = () => {
      stepPanels.forEach((panel) => { panel.hidden = Number(panel.dataset.stepPanel) !== leadStep; });
      if (stepLabel) stepLabel.innerHTML = `STEP 0${leadStep} <i>/</i> 03`;
      if (progressText) progressText.textContent = stepHeadings[leadStep];
      progressBars.forEach((bar, index) => bar.classList.toggle('is-active', index < leadStep));
      const selected = answerState[answerForStep[leadStep]];
      if (selectionHint) selectionHint.textContent = selected ? `Selected: ${selected}` : 'Choose one option to continue';
      if (backButton) backButton.disabled = leadStep === 1;
      if (nextButton) {
        nextButton.hidden = leadStep === 3;
        nextButton.disabled = !selected;
      }
      if (buildButton) {
        buildButton.hidden = leadStep !== 3;
        buildButton.disabled = !selected;
      }
      if (result) result.hidden = true;
      if (controls) controls.hidden = false;
      if (notice) notice.hidden = true;
      // Keep the selected state available to screen readers and keyboard users.
      $$('.lead-option', leadFinder).forEach((button) => {
        const active = button.dataset.answer === answerForStep[leadStep] && button.dataset.value === selected;
        button.setAttribute('aria-pressed', String(active));
      });
      // Focus the new question heading only after explicit navigation.
    };

    $$('.lead-option', leadFinder).forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.answer;
        if (!Object.prototype.hasOwnProperty.call(answerState, key)) return;
        answerState[key] = button.dataset.value || '';
        $$(`.lead-option[data-answer="${key}"]`, leadFinder).forEach((option) => {
          option.setAttribute('aria-pressed', String(option === button));
        });
        if (selectionHint) selectionHint.textContent = `Selected: ${answerState[key]}`;
        if (leadStep === 3) {
          if (buildButton) buildButton.disabled = !answerState.setup;
        } else if (nextButton) {
          nextButton.disabled = !answerState[answerForStep[leadStep]];
        }
      });
    });

    nextButton?.addEventListener('click', () => {
      if (!answerState[answerForStep[leadStep]] || leadStep >= 3) return;
      leadStep += 1;
      renderLeadStep();
      $(`[data-step-panel="${leadStep}"] h3`, leadFinder)?.focus({ preventScroll: true });
    });

    backButton?.addEventListener('click', () => {
      if (leadStep <= 1) return;
      leadStep -= 1;
      renderLeadStep();
      $(`[data-step-panel="${leadStep}"] h3`, leadFinder)?.focus({ preventScroll: true });
    });

    const leadChallengeAdvice = {
      'Not enough enquiries': {
        title: 'Make the offer and next step clearer.',
        description: 'Start by tightening the landing-page message, making the value easy to understand, and reducing friction in the enquiry form.'
      },
      'Slow or inconsistent follow-up': {
        title: 'Respond quickly and make follow-up consistent.',
        description: 'Connect enquiry forms to your CRM, send an immediate acknowledgement, notify the right person, and create reminders for the next action.'
      },
      'Lead information is scattered': {
        title: 'Bring every enquiry into one place.',
        description: 'Create one central lead pipeline with contact details, source, status, owner, and next follow-up so opportunities are easier to manage.'
      },
      'Website visitors do not convert': {
        title: 'Improve the path from visit to enquiry.',
        description: 'Review the offer, calls to action, proof points, mobile experience, and enquiry form before investing in more traffic.'
      }
    };
    const leadSetupAdvice = {
      'No website or CRM yet': 'Start lean: create a focused lead-generation page, capture enquiries in a simple CRM pipeline, and add follow-up automation once the capture journey is clear.',
      'Website but no central CRM': 'Keep the existing website if it is doing its job. Connect its forms to a central CRM first, then automate acknowledgements, team alerts, and reminders.',
      'Website and CRM but manual follow-up': 'Connect the existing website and CRM. Automate routine confirmations, owner notifications, and follow-up reminders while keeping personal sales conversations human.',
      'Existing setup needs better conversion': 'Audit the current journey before replacing tools. Identify where visitors or enquiries drop off, then improve the highest-friction page, form, or follow-up step.'
    };
    const leadSourceAdvice = {
      'Website or landing pages': 'Prioritize clearer calls to action, shorter forms, conversion tracking, and reliable hand-off into your lead pipeline.',
      'Social media or paid campaigns': 'Use a focused landing page for each important offer, track the source of each enquiry, and route new leads into the same follow-up process.',
      'Referrals and direct outreach': 'Give every referral or conversation a simple destination and capture process so warm leads are recorded and followed up consistently.',
      'No consistent lead source yet': 'Start with one clear audience and offer, build a focused landing page, and track enquiries before spreading effort across more channels.'
    };

    const makeLeadRecommendation = () => {
      const challenge = leadChallengeAdvice[answerState.challenge] || leadChallengeAdvice['Not enough enquiries'];
      const setupAdvice = leadSetupAdvice[answerState.setup] || leadSetupAdvice['No website or CRM yet'];
      const sourceAdvice = leadSourceAdvice[answerState.source] || leadSourceAdvice['No consistent lead source yet'];
      const details = [
        { number: '01', title: 'Lead-generation website', copy: 'A focused landing page with a clear offer, trust-building content, prominent calls to action, and an easy enquiry form.' },
        { number: '02', title: 'Simple CRM pipeline', copy: 'Capture each enquiry with its source, status, owner, and next action—so leads are not lost in scattered inboxes or sheets.' },
        { number: '03', title: 'Follow-up automation', copy: 'Send an immediate acknowledgement, alert the right person, and schedule reminders to help every enquiry get a timely response.' }
      ];
      const summary = [
        'WireFizz lead-generation solution enquiry',
        '',
        `Current lead sources: ${answerState.source}`,
        `Biggest challenge: ${answerState.challenge}`,
        `Current setup: ${answerState.setup}`,
        '',
        'Recommended solution: Lead-generation website + CRM + follow-up automation.',
        `Priority: ${challenge.title}`,
        challenge.description,
        '',
        `Suggested starting point: ${setupAdvice}`,
        `Lead-source consideration: ${sourceAdvice}`,
        '',
        'Please discuss the scope, integrations, and suitable first phase with me.'
      ].join('\n');
      return { challenge, setupAdvice, sourceAdvice, details, summary };
    };

    const renderLeadRecommendation = () => {
      if (!answerState.source || !answerState.challenge || !answerState.setup || !result) return;
      const recommendation = makeLeadRecommendation();
      stepPanels.forEach((panel) => { panel.hidden = true; });
      const detailsMarkup = recommendation.details.map((item) => `
        <article class="lead-deliverable"><span>${escapeHTML(item.number)}</span><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.copy)}</p></article>
      `).join('');
      result.innerHTML = `
        <div class="lead-result-eyebrow"><span>✓</span> YOUR RECOMMENDED SETUP</div>
        <h3>A connected system for <em style="color:var(--lime);font-style:normal">more and better-managed leads.</em></h3>
        <p>Rather than adding disconnected tools, start with a clear way to attract enquiries, capture every lead, and follow up consistently.</p>
        <div class="lead-result-meta"><span>${escapeHTML(answerState.source)}</span><span>${escapeHTML(answerState.challenge)}</span><span>${escapeHTML(answerState.setup)}</span></div>
        <div class="lead-recommendation-grid">${detailsMarkup}</div>
        <div class="lead-first-step"><span>YOUR BEST FIRST STEP</span><strong>${escapeHTML(recommendation.challenge.title)}</strong><p>${escapeHTML(recommendation.challenge.description)} ${escapeHTML(recommendation.setupAdvice)}</p></div>
        <div class="lead-result-actions"><button type="button" class="btn btn-primary" id="sendLeadPlan">Discuss this setup <span aria-hidden="true">↗</span></button><button type="button" class="lead-reset" id="resetLeadFinder">← Change answers</button></div>
      `;
      result.hidden = false;
      if (controls) controls.hidden = true;
      if (stepLabel) stepLabel.textContent = 'RECOMMENDATION READY';
      if (progressText) progressText.textContent = 'A practical first step';
      progressBars.forEach((bar) => bar.classList.add('is-active'));
      if (notice) notice.hidden = true;

      $('#sendLeadPlan', result)?.addEventListener('click', () => {
        const serviceSelect = $('#service');
        const messageField = $('#message');
        const contactSection = $('#contact');
        if (serviceSelect) serviceSelect.value = 'Lead generation system (website + CRM + automation)';
        if (messageField) messageField.value = recommendation.summary;
        if (notice) {
          notice.textContent = 'Your recommendation has been added to the enquiry form. Review the summary, add your contact details, and send it when you are ready.';
          notice.hidden = false;
        }
        contactSection?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        $('#firstName')?.focus({ preventScroll: true });
      });
      $('#resetLeadFinder', result)?.addEventListener('click', () => {
        leadStep = 1;
        renderLeadStep();
        $(`[data-step-panel="1"] h3`, leadFinder)?.focus({ preventScroll: true });
      });
    };

    buildButton?.addEventListener('click', renderLeadRecommendation);
    renderLeadStep();
  }

  // Switch between the two customer-goal journeys without leaving the solution finder.
  const goalButtons = $$('[data-finder-goal]');
  const leadFinderPanel = $('#leadFinder');
  const dataFinderPanel = $('#dataFinder');
  const finderTitleMain = $('#solutionFinderTitleMain');
  const finderTitleAccent = $('#solutionFinderTitleAccent');
  const finderDescription = $('#solutionFinderDescription');
  const setFinderGoal = (goal) => {
    if (!leadFinderPanel || !dataFinderPanel) return;
    const isData = goal === 'data';
    leadFinderPanel.hidden = isData;
    dataFinderPanel.hidden = !isData;
    goalButtons.forEach((button) => {
      const active = button.dataset.finderGoal === goal;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (finderTitleMain) finderTitleMain.textContent = isData ? 'Understand your data.' : 'More leads.';
    if (finderTitleAccent) finderTitleAccent.textContent = isData ? 'Make better decisions.' : 'Less guesswork.';
    if (finderDescription) finderDescription.textContent = isData
      ? 'Answer three quick questions to get a practical starting point for dashboards, reporting, and business intelligence.'
      : 'Choose what you want to improve. Answer three quick questions and get a practical starting recommendation tailored to your business.';
  };
  goalButtons.forEach((button) => button.addEventListener('click', () => setFinderGoal(button.dataset.finderGoal || 'leads')));

  // Guided data and business-intelligence selector: dashboards, reporting, and actionable insight.
  const dataFinder = $('#dataFinder');
  if (dataFinder) {
    const answerState = { source: '', challenge: '', setup: '' };
    let dataStep = 1;
    const stepPanels = $$('[data-data-step-panel]', dataFinder);
    const stepLabel = $('#dataFinderStepLabel');
    const progressText = $('#dataFinderProgressText');
    const progressBars = $$('.data-progress span', dataFinder);
    const backButton = $('#dataFinderBack');
    const nextButton = $('#dataFinderNext');
    const buildButton = $('#dataFinderBuild');
    const controls = $('#dataFinderControls');
    const result = $('#dataFinderResult');
    const selectionHint = $('#dataSelectionHint');
    const notice = $('#dataFinderNotice');
    const answerForStep = { 1: 'source', 2: 'challenge', 3: 'setup' };
    const stepHeadings = { 1: 'Your data sources', 2: 'Your insight priorities', 3: 'Your reporting setup' };

    const renderDataStep = () => {
      stepPanels.forEach((panel) => { panel.hidden = Number(panel.dataset.dataStepPanel) !== dataStep; });
      if (stepLabel) stepLabel.innerHTML = `STEP 0${dataStep} <i>/</i> 03`;
      if (progressText) progressText.textContent = stepHeadings[dataStep];
      progressBars.forEach((bar, index) => bar.classList.toggle('is-active', index < dataStep));
      const selected = answerState[answerForStep[dataStep]];
      if (selectionHint) selectionHint.textContent = selected ? `Selected: ${selected}` : 'Choose one option to continue';
      if (backButton) backButton.disabled = dataStep === 1;
      if (nextButton) {
        nextButton.hidden = dataStep === 3;
        nextButton.disabled = !selected;
      }
      if (buildButton) {
        buildButton.hidden = dataStep !== 3;
        buildButton.disabled = !selected;
      }
      if (result) result.hidden = true;
      if (controls) controls.hidden = false;
      if (notice) notice.hidden = true;
      $$('[data-data-answer]', dataFinder).forEach((button) => {
        const active = button.dataset.dataAnswer === answerForStep[dataStep] && button.dataset.value === selected;
        button.setAttribute('aria-pressed', String(active));
      });
    };

    $$('[data-data-answer]', dataFinder).forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.dataAnswer;
        if (!Object.prototype.hasOwnProperty.call(answerState, key)) return;
        answerState[key] = button.dataset.value || '';
        $$(`[data-data-answer="${key}"]`, dataFinder).forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
        if (selectionHint) selectionHint.textContent = `Selected: ${answerState[key]}`;
        if (dataStep === 3) {
          if (buildButton) buildButton.disabled = !answerState.setup;
        } else if (nextButton) {
          nextButton.disabled = !answerState[answerForStep[dataStep]];
        }
      });
    });

    nextButton?.addEventListener('click', () => {
      if (!answerState[answerForStep[dataStep]] || dataStep >= 3) return;
      dataStep += 1;
      renderDataStep();
      $(`[data-data-step-panel="${dataStep}"] h3`, dataFinder)?.focus({ preventScroll: true });
    });
    backButton?.addEventListener('click', () => {
      if (dataStep <= 1) return;
      dataStep -= 1;
      renderDataStep();
      $(`[data-data-step-panel="${dataStep}"] h3`, dataFinder)?.focus({ preventScroll: true });
    });

    const challengeAdvice = {
      'Overall business performance and KPIs': {
        title: 'Start with a clear business performance scorecard.',
        description: 'Agree on a small set of useful KPIs, define how each is calculated, and show current performance alongside a meaningful target or previous period.'
      },
      'Sales, revenue, and profitability': {
        title: 'Make sales and revenue trends easy to spot.',
        description: 'Prioritize revenue, sales pipeline, conversion, product or service performance, and profitability measures that help explain what is changing.'
      },
      'Customer behavior and lead performance': {
        title: 'Connect customer activity to outcomes.',
        description: 'Bring channels, enquiries, conversions, and customer segments into a common view so you can identify where valuable relationships start and where they drop off.'
      },
      'Operations and team productivity': {
        title: 'Reveal bottlenecks in day-to-day operations.',
        description: 'Track workload, turnaround time, service levels, and process stages to show where work slows down or needs attention.'
      }
    };
    const sourceAdvice = {
      'Spreadsheets and manual files': 'Begin with a short inventory of key spreadsheets, their owners, update frequency, and any conflicting definitions. Then create a consistent data model before building visuals.',
      'Several business tools': 'Map which systems hold each important metric, then plan how those sources should be connected or combined. Begin with the few sources needed to answer the highest-value business question.',
      'Database, exports, or APIs': 'Confirm source fields, refresh options, data quality, and access requirements, then model the relevant measures for reliable reporting.',
      'Data is scattered or unclear': 'Start with a discovery session and data-source inventory. Identify what is available, which decisions need support, and which gaps should be addressed first.'
    };
    const setupAdvice = {
      'Manual spreadsheet reports': 'Reduce repeated copy-and-paste work by standardizing the key metrics first, then move the most valuable recurring report into a reusable dashboard or refreshable report.',
      'Existing dashboard but missing insights': 'Review the questions users need answered, remove low-value charts, clarify KPI definitions, and redesign the dashboard around decisions rather than decoration.',
      'Reports are slow or outdated': 'Investigate data preparation and refresh bottlenecks, then prioritize repeatable transformations, refresh scheduling, and basic quality checks.',
      'Starting business reporting from scratch': 'Choose one high-value business question, define its KPIs and owners, and deliver a focused first dashboard before expanding to a wider BI environment.'
    };

    const makeDataRecommendation = () => {
      const challenge = challengeAdvice[answerState.challenge] || challengeAdvice['Overall business performance and KPIs'];
      const source = sourceAdvice[answerState.source] || sourceAdvice['Data is scattered or unclear'];
      const setup = setupAdvice[answerState.setup] || setupAdvice['Starting business reporting from scratch'];
      const details = [
        { number: '01', title: 'Data sources & KPI definitions', copy: 'Identify the right source data, agree on metric definitions, and establish a dependable foundation for reporting.' },
        { number: '02', title: 'Decision-ready BI dashboard', copy: 'Design a focused dashboard for the KPIs, comparisons, trends, and drill-downs that help your team answer real business questions.' },
        { number: '03', title: 'Reporting & data refresh', copy: 'Replace avoidable manual steps with repeatable reporting, clear refresh expectations, and proportionate data-quality checks.' }
      ];
      const summary = [
        'WireFizz business data and BI solution enquiry',
        '',
        `Current data sources: ${answerState.source}`,
        `Main insight priority: ${answerState.challenge}`,
        `Current reporting setup: ${answerState.setup}`,
        '',
        'Recommended solution: Dashboards + reporting + business intelligence.',
        `Recommended first step: ${challenge.title}`,
        challenge.description,
        '',
        `Data-source consideration: ${source}`,
        `Reporting consideration: ${setup}`,
        '',
        'Please discuss the suitable data sources, integrations, dashboard scope, refresh needs, and a practical first phase with me.'
      ].join('\n');
      return { challenge, source, setup, details, summary };
    };

    const renderDataRecommendation = () => {
      if (!answerState.source || !answerState.challenge || !answerState.setup || !result) return;
      const recommendation = makeDataRecommendation();
      stepPanels.forEach((panel) => { panel.hidden = true; });
      const detailsMarkup = recommendation.details.map((item) => `
        <article class="lead-deliverable"><span>${escapeHTML(item.number)}</span><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.copy)}</p></article>
      `).join('');
      result.innerHTML = `
        <div class="lead-result-eyebrow"><span>✓</span> YOUR RECOMMENDED STARTING POINT</div>
        <h3>Turn business data into <em style="color:var(--lime);font-style:normal">clearer decisions.</em></h3>
        <p>Start with the questions your business needs to answer, then build the reporting foundation and dashboards that make those answers visible and useful.</p>
        <div class="lead-result-meta"><span>${escapeHTML(answerState.source)}</span><span>${escapeHTML(answerState.challenge)}</span><span>${escapeHTML(answerState.setup)}</span></div>
        <div class="lead-recommendation-grid">${detailsMarkup}</div>
        <div class="lead-first-step"><span>YOUR BEST FIRST STEP</span><strong>${escapeHTML(recommendation.challenge.title)}</strong><p>${escapeHTML(recommendation.challenge.description)} ${escapeHTML(recommendation.source)} ${escapeHTML(recommendation.setup)}</p></div>
        <div class="lead-result-actions"><button type="button" class="btn btn-primary" id="sendDataPlan">Discuss this setup <span aria-hidden="true">↗</span></button><button type="button" class="lead-reset" id="resetDataFinder">← Change answers</button></div>
      `;
      result.hidden = false;
      if (controls) controls.hidden = true;
      if (stepLabel) stepLabel.textContent = 'RECOMMENDATION READY';
      if (progressText) progressText.textContent = 'A practical first step';
      progressBars.forEach((bar) => bar.classList.add('is-active'));
      if (notice) notice.hidden = true;

      $('#sendDataPlan', result)?.addEventListener('click', () => {
        const serviceSelect = $('#service');
        const messageField = $('#message');
        const contactSection = $('#contact');
        if (serviceSelect) serviceSelect.value = 'Data analytics & dashboards';
        if (messageField) messageField.value = recommendation.summary;
        if (notice) {
          notice.textContent = 'Your data and reporting recommendation has been added to the enquiry form. Review it, add your contact details, and send it when you are ready.';
          notice.hidden = false;
        }
        contactSection?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        $('#firstName')?.focus({ preventScroll: true });
      });
      $('#resetDataFinder', result)?.addEventListener('click', () => {
        dataStep = 1;
        renderDataStep();
        $('[data-data-step-panel="1"] h3', dataFinder)?.focus({ preventScroll: true });
      });
    };

    buildButton?.addEventListener('click', renderDataRecommendation);
    renderDataStep();
  }

  // Service cards can preselect the relevant option in the project form.
  $$('[data-service]').forEach((link) => link.addEventListener('click', () => {
    const serviceSelect = $('#service');
    if (serviceSelect) serviceSelect.value = link.dataset.service || '';
  }));

  // Contact form — preserves the existing WireFizz EmailJS integration.
  const contactForm = $('#contactForm');
  const submitBtn = $('#submitBtn');
  const submitText = $('#submitText');
  const submitSpinner = $('#submitSpinner');
  const formToast = $('#formToast');
  const EMAILJS_PUBLIC_KEY = 'mEWt5UGvndb6dCW3T';
  const EMAILJS_SERVICE_ID = 'service_9tujwrx';
  const EMAILJS_TEMPLATE_ID = 'template_ttpqeob';

  if (window.emailjs) {
    try { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (error) {
      console.warn('EmailJS could not be initialized:', error);
    }
  }

  const showToast = (message, type) => {
    if (!formToast) return;
    formToast.textContent = message;
    formToast.className = `form-toast ${type}`;
    formToast.hidden = false;
  };

  const setLoading = (isLoading) => {
    if (submitBtn) submitBtn.disabled = isLoading;
    if (submitText) submitText.hidden = isLoading;
    if (submitSpinner) submitSpinner.hidden = !isLoading;
  };

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      if (formToast) formToast.hidden = true;

      if (!window.emailjs || typeof window.emailjs.send !== 'function') {
        showToast('The message service is unavailable right now. Please try again in a moment.', 'error');
        return;
      }

      const firstName = $('#firstName')?.value.trim() || '';
      const lastName = $('#lastName')?.value.trim() || '';
      const templateParams = {
        name: `${firstName} ${lastName}`.trim(),
        email: $('#workEmail')?.value.trim() || '',
        company: $('#company')?.value.trim() || 'N/A',
        service: $('#service')?.value || 'Not specified',
        message: $('#message')?.value.trim() || '',
        time: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
      };

      setLoading(true);
      try {
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        contactForm.reset();
        showToast('Thanks for reaching out — your enquiry has been sent.', 'success');
      } catch (error) {
        console.error('WireFizz contact form error:', error);
        showToast('We could not send your enquiry. Please try again shortly.', 'error');
      } finally {
        setLoading(false);
      }
    });
  }

  const year = $('#currentYear');
  if (year) year.textContent = String(new Date().getFullYear());
})();
