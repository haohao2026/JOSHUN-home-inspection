
const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQxNIXdiKBWG0_9QwSxgamlAlZ91ruNcD4GRUiRmND6OseR4FKpWdV-WlNKK4lB0zEhw/exec';

function updateHeader(){
  if(window.scrollY > 42) header.classList.add('is-scrolled');
  else header.classList.remove('is-scrolled');
}
window.addEventListener('scroll', updateHeader, {passive:true});
updateHeader();

if(menuToggle && mainNav){
  menuToggle.addEventListener('click',()=>{
    const open = mainNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 1024){
      mainNav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const slider = document.querySelector('[data-hero-slider]');
if(slider){
  const slides=[...slider.querySelectorAll('.hero-slide')];
  if(slides.length > 1){
    let i=0;
    setInterval(()=>{
      slides[i].classList.remove('active');
      i=(i+1)%slides.length;
      slides[i].classList.add('active');
    },5000);
  }
}


const faqItems = document.querySelectorAll('.faq-item');
let faqAutoTimer = null;

function openFaqItem(targetIndex){
  faqItems.forEach((item, index)=>{
    const isTarget = index === targetIndex;
    const trigger = item.querySelector('.faq-question');
    item.classList.toggle('is-open', isTarget);
    if(trigger) trigger.setAttribute('aria-expanded', String(isTarget));
  });
}

function scheduleFaqAuto(nextIndex){
  if(faqItems.length < 2) return;
  window.clearTimeout(faqAutoTimer);
  faqAutoTimer = window.setTimeout(()=>{
    const safeIndex = nextIndex % faqItems.length;
    openFaqItem(safeIndex);
    scheduleFaqAuto(safeIndex + 1);
  }, 3200);
}

faqItems.forEach((item, index)=>{
  const trigger = item.querySelector('.faq-question');
  if(!trigger) return;
  trigger.addEventListener('click', ()=>{
    window.clearTimeout(faqAutoTimer);
    openFaqItem(index);
    scheduleFaqAuto(index + 1);
  });
});

if(faqItems.length){
  openFaqItem(0);
  scheduleFaqAuto(1);
}

document.addEventListener('click', event=>{
  const trigger = event.target.closest('.faq-question');
  if(!trigger) return;
  const item = trigger.closest('.faq-item');
  const index = [...faqItems].indexOf(item);
  if(index < 0) return;
  window.clearTimeout(faqAutoTimer);
  openFaqItem(index);
  scheduleFaqAuto(index + 1);
}, true);

document.querySelectorAll('[data-card-link]').forEach(card=>{
  const href = card.getAttribute('data-card-link');
  if(!href) return;
  card.addEventListener('click', (event)=>{
    if(event.target.closest('a')) return;
    if(href.startsWith('http')) window.open(href, '_blank', 'noopener');
    else window.location.href = href;
  });
  card.addEventListener('keydown', (event)=>{
    if(event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if(href.startsWith('http')) window.open(href, '_blank', 'noopener');
    else window.location.href = href;
  });
});

const contactCards = [...document.querySelectorAll('.contact-method-card')];
const contactContent = [
  {
    title:'LINE 線上諮詢',
    text:'立即加入 LINE\n快速諮詢不漏訊',
    strong:'',
    linkText:'立即加入好友',
    aria:'加入究享驗屋 LINE 好友'
  },
  {
    title:'電話專人諮詢',
    text:'0928-866-458',
    strong:'週一至週日 09:00 - 18:00',
    linkText:'與我們聯絡',
    aria:'撥打究享驗屋電話'
  },
  {
    title:'電子郵件諮詢',
    text:'joshunyw@gmail.com',
    strong:'歡迎來信，我們將盡速聯絡您',
    linkText:'',
    aria:'寄信給究享驗屋'
  }
];

contactCards.forEach((card, index)=>{
  const data = contactContent[index];
  if(!data) return;
  const title = card.querySelector('h3');
  const text = card.querySelector('p');
  const strong = card.querySelector('strong');
  const action = card.querySelector('a');
  if(title) title.textContent = data.title;
  if(text){
    text.textContent = '';
    data.text.split('\n').forEach((line, lineIndex)=>{
      if(lineIndex) text.appendChild(document.createElement('br'));
      text.appendChild(document.createTextNode(line));
    });
  }
  if(strong) strong.textContent = data.strong;
  if(action){
    if(data.linkText){
      action.textContent = data.linkText;
    }else{
      action.setAttribute('aria-hidden', 'true');
      action.tabIndex = -1;
    }
  }
  if(data.aria) card.setAttribute('aria-label', data.aria);
});

const emailMethodCard = contactCards[2];
if(emailMethodCard){
  const emailFollowup = emailMethodCard.querySelector('strong');
  if(emailFollowup){
    emailFollowup.textContent = '';
    ['\u6b61\u8fce\u4f86\u4fe1', '\u6211\u5011\u5c07\u76e1\u901f\u806f\u7d61\u60a8'].forEach((line, index)=>{
      if(index) emailFollowup.appendChild(document.createElement('br'));
      emailFollowup.appendChild(document.createTextNode(line));
    });
  }
}

function syncContactActionButtons(){
  const baseWidth = window.innerWidth <= 430 ? 120 : window.innerWidth <= 820 ? 156 : window.innerWidth <= 1180 ? 168 : 178;
  contactCards.slice(0, 2).forEach(card=>{
    const action = card.querySelector('a');
    if(!action) return;
    const cardWidth = card.getBoundingClientRect().width || baseWidth;
    const actionWidth = Math.max(140, Math.min(baseWidth, cardWidth - 40));
    action.style.setProperty('width', `${actionWidth}px`, 'important');
    action.style.setProperty('max-width', '100%', 'important');
    action.style.setProperty('margin-left', 'auto', 'important');
    action.style.setProperty('margin-right', 'auto', 'important');
    action.style.setProperty('justify-content', 'center', 'important');
  });
}

syncContactActionButtons();
window.addEventListener('resize', syncContactActionButtons, {passive:true});

const mobileCarouselQuery = window.matchMedia('(max-width: 820px)');
const mobileCarousels = [
  {container:'.care-grid', slide:'.care-card', name:'belief', interval:4200},
  {container:'.plan-grid', slide:'.plan-card', name:'checklist', interval:4600},
  {container:'.workflow-timeline', slide:'.workflow-step', name:'process', interval:4400}
].map(config=>createMobileCarousel(config)).filter(Boolean);

function createMobileCarousel(config){
  const container = document.querySelector(config.container);
  if(!container) return null;
  const slides = [...container.querySelectorAll(config.slide)];
  if(slides.length < 2) return null;
  let index = 0;
  let timer = null;

  const controls = document.createElement('div');
  controls.className = `mobile-carousel-controls mobile-carousel-controls--${config.name}`;

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'mobile-carousel-control mobile-carousel-control--prev';
  prev.setAttribute('aria-label', '上一張');
  prev.textContent = '<';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'mobile-carousel-control mobile-carousel-control--next';
  next.setAttribute('aria-label', '下一張');
  next.textContent = '>';

  const dots = document.createElement('div');
  dots.className = 'mobile-carousel-dots';
  dots.setAttribute('aria-label', '輪播頁碼');

  const dotButtons = slides.map((_, dotIndex)=>{
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'mobile-carousel-dot';
    dot.setAttribute('aria-label', `切換到第 ${dotIndex + 1} 張`);
    dot.addEventListener('click', ()=>goTo(dotIndex, true));
    dots.appendChild(dot);
    return dot;
  });

  controls.append(prev, next, dots);
  container.appendChild(controls);

  function setActive(nextIndex){
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex)=>{
      const isActive = slideIndex === index;
      slide.classList.toggle('is-mobile-active', isActive);
      slide.setAttribute('aria-hidden', mobileCarouselQuery.matches ? String(!isActive) : 'false');
    });
    dotButtons.forEach((dot, dotIndex)=>{
      dot.classList.toggle('is-active', dotIndex === index);
      dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
    });
  }

  function stop(){
    if(timer) window.clearInterval(timer);
    timer = null;
  }

  function start(){
    stop();
    if(!mobileCarouselQuery.matches) return;
    timer = window.setInterval(()=>setActive(index + 1), config.interval);
  }

  function goTo(nextIndex, manual){
    setActive(nextIndex);
    if(manual) start();
  }

  prev.addEventListener('click', ()=>goTo(index - 1, true));
  next.addEventListener('click', ()=>goTo(index + 1, true));
  container.addEventListener('pointerenter', stop);
  container.addEventListener('pointerleave', start);
  container.addEventListener('focusin', stop);
  container.addEventListener('focusout', start);

  function enable(){
    container.classList.add('mobile-carousel', `mobile-carousel--${config.name}`);
    slides.forEach(slide=>{
      slide.classList.add('mobile-carousel-slide');
      if(config.name === 'belief' || config.name === 'checklist'){
        slide.style.setProperty('grid-template-columns', 'minmax(0, 1fr)', 'important');
        slide.style.setProperty('grid-template-areas', 'none', 'important');
      }
    });
    setActive(index);
    start();
  }

  function disable(){
    stop();
    container.classList.remove('mobile-carousel', `mobile-carousel--${config.name}`);
    slides.forEach(slide=>{
      slide.classList.remove('mobile-carousel-slide','is-mobile-active');
      slide.setAttribute('aria-hidden', 'false');
      slide.style.removeProperty('grid-template-columns');
      slide.style.removeProperty('grid-template-areas');
    });
    dotButtons.forEach(dot=>dot.classList.remove('is-active'));
  }

  return {enable, disable};
}

function syncMobileCarousels(){
  mobileCarousels.forEach(carousel=>{
    if(mobileCarouselQuery.matches) carousel.enable();
    else carousel.disable();
  });
}

syncMobileCarousels();
if(mobileCarouselQuery.addEventListener){
  mobileCarouselQuery.addEventListener('change', syncMobileCarousels);
}else{
  mobileCarouselQuery.addListener(syncMobileCarousels);
}

const revealTargets = [
  '.hero-copy-inner',
  '.hero-frame',
  '.why-left',
  '.why-card',
  '.care-heading',
  '.care-card',
  '.plan-heading',
  '.plan-card',
  '.workflow-head-left',
  '.workflow-head-right',
  '.workflow-step',
  '.faq-side',
  '.faq-item',
  '.pricing-intro',
  '.pricing-service-card',
  '.pricing-calc-card',
  '.contact-copy',
  '.contact-method-card',
  '.contact-panel--form'
].join(',');

const revealElements = [...document.querySelectorAll(revealTargets)];
if(revealElements.length){
  revealElements.forEach((element, index)=>{
    element.setAttribute('data-reveal', '');
    element.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 70, 350)}ms`);
  });

  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, {threshold:0.16, rootMargin:'0px 0px -8% 0px'});

    revealElements.forEach(element=>revealObserver.observe(element));
  }else{
    revealElements.forEach(element=>element.classList.add('is-visible'));
  }
}


const newHomeAreaInput = document.getElementById('newHomeAreaInput');
const townhouseAreaInput = document.getElementById('townhouseAreaInput');
const newHomeEstimateBtn = document.getElementById('newHomeEstimateBtn');
const townhouseEstimateBtn = document.getElementById('townhouseEstimateBtn');
const estimatePrice = document.getElementById('estimatePrice');
const estimateUnit = document.getElementById('estimateUnit');
const estimateResultLabel = document.getElementById('estimateResultLabel');
const estimateNote = document.getElementById('estimateNote');
let estimateAnimationFrame = null;

function formatPrice(num){
  return Number(num).toLocaleString('zh-TW');
}

function getNewHomeEstimatedPrice(area){
  if(!area || area <= 0) return {type:'empty', price:0, label:'新成屋驗屋費用'};
  if(area < 20) return {type:'price', price:9300, label:'新成屋驗屋費用'};
  if(area < 25) return {type:'price', price:10300, label:'新成屋驗屋費用'};
  if(area < 30) return {type:'price', price:11300, label:'新成屋驗屋費用'};
  if(area < 35) return {type:'price', price:12300, label:'新成屋驗屋費用'};
  if(area < 40) return {type:'price', price:13300, label:'新成屋驗屋費用'};
  if(area < 45) return {type:'price', price:14300, label:'新成屋驗屋費用'};
  if(area < 50) return {type:'price', price:15300, label:'新成屋驗屋費用'};
  if(area < 55) return {type:'price', price:16300, label:'新成屋驗屋費用'};
  if(area <= 60) return {type:'price', price:17300, label:'新成屋驗屋費用'};
  return {type:'quote', price:0, label:'新成屋驗屋費用'};
}

function getTownhouseEstimatedPrice(area){
  if(!area || area <= 0) return {type:'empty', price:0, label:'透天驗屋費用'};
  const roundedArea = Math.ceil(area);
  if(roundedArea >= 120) return {type:'quote', price:0, label:'透天驗屋費用'};
  return {type:'price', price:roundedArea * 400, label:'透天驗屋費用'};
}

function setEstimateMessage(result){
  if(!estimateResultLabel || !estimatePrice || !estimateUnit || !estimateNote) return;
  estimateResultLabel.textContent = result.label || '驗屋費用';
  estimatePrice.classList.remove('is-quote');
  if(result.type === 'quote'){
    if(estimateAnimationFrame) cancelAnimationFrame(estimateAnimationFrame);
    estimatePrice.textContent = '另行報價';
    estimatePrice.classList.add('is-quote');
    estimateUnit.textContent = '';
    estimateNote.textContent = '此坪數建議由專人依案件條件確認報價，歡迎直接聯繫究享驗屋。';
    return;
  }
  estimateUnit.textContent = '元起';
  estimateNote.textContent = result.price > 0
    ? '此為初步估算金額，實際費用將依現場狀況與檢測項目確認。'
    : '請輸入有效坪數後按下一鍵估價。';
  animateEstimateNumber(result.price || 0);
}

function animateEstimateNumber(target){
  if(!estimatePrice) return;
  if(estimateAnimationFrame) cancelAnimationFrame(estimateAnimationFrame);
  const duration = 780;
  const start = performance.now();
  estimatePrice.textContent = '0';
  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    estimatePrice.textContent = formatPrice(Math.round(target * eased));
    if(progress < 1){
      estimateAnimationFrame = requestAnimationFrame(tick);
    }
  }
  estimateAnimationFrame = requestAnimationFrame(tick);
}

function runEstimate(type){
  const input = type === 'townhouse' ? townhouseAreaInput : newHomeAreaInput;
  if(!input) return;
  const area = parseFloat(input.value);
  const result = type === 'townhouse' ? getTownhouseEstimatedPrice(area) : getNewHomeEstimatedPrice(area);
  setEstimateMessage(result);
}

if(newHomeEstimateBtn){
  newHomeEstimateBtn.addEventListener('click', ()=>runEstimate('new-home'));
}

if(townhouseEstimateBtn){
  townhouseEstimateBtn.addEventListener('click', ()=>runEstimate('townhouse'));
}

if(newHomeAreaInput){
  newHomeAreaInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') runEstimate('new-home');
  });
}

if(townhouseAreaInput){
  townhouseAreaInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') runEstimate('townhouse');
  });
}

document.querySelectorAll('[data-target-estimate]').forEach(card=>{
  const targetType = card.getAttribute('data-target-estimate');
  const activate = ()=>{
    const targetOption = targetType === 'townhouse'
      ? document.querySelector('.estimate-option--house')
      : document.querySelector('.estimate-option:not(.estimate-option--house)');
    const targetInput = targetType === 'townhouse' ? townhouseAreaInput : newHomeAreaInput;
    if(targetOption){
      targetOption.classList.add('is-highlight');
      window.setTimeout(()=>targetOption.classList.remove('is-highlight'), 1600);
    }
    if(targetInput){
      window.setTimeout(()=>targetInput.focus({preventScroll:true}), 80);
    }
  };
  card.addEventListener('click', activate);
  card.addEventListener('keydown', event=>{
    if(event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate();
  });
});


const captchaBox = document.getElementById('captchaBox');
const refreshCaptcha = document.getElementById('refreshCaptcha');
const contactForm = document.getElementById('contactForm');
const contactFormStatus = document.getElementById('contactFormStatus');
let captchaValue = '';

function generateCaptcha(){
  captchaValue = String(Math.floor(1000 + Math.random() * 9000));
  if(captchaBox) captchaBox.textContent = captchaValue;
}

if(refreshCaptcha){
  refreshCaptcha.addEventListener('click', generateCaptcha);
}
if(captchaBox){
  generateCaptcha();
}

if(contactForm){
  contactForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!contactFormStatus) return;
    contactFormStatus.classList.remove('is-error','is-success');
    const name = document.getElementById('contactName');
    const phone = document.getElementById('contactPhone');
    const captchaInput = document.getElementById('captchaInput');
    if(!name.value.trim() || !phone.value.trim() || !captchaInput.value.trim()){
      contactFormStatus.textContent = '請先完整填寫姓名、電話與驗證碼。';
      contactFormStatus.classList.add('is-error');
      return;
    }
    if(captchaInput.value.trim() !== captchaValue){
      contactFormStatus.textContent = '驗證碼輸入錯誤，請重新確認。';
      contactFormStatus.classList.add('is-error');
      generateCaptcha();
      captchaInput.value = '';
      captchaInput.focus();
      return;
    }
    const time = document.getElementById('contactTime');
    const note = document.getElementById('contactNote');
    const payload = new URLSearchParams({
      name: name.value.trim(),
      phone: phone.value.trim(),
      time: time && time.value.trim() ? time.value.trim() : '',
      note: note && note.value.trim() ? note.value.trim() : '',
      source: '究享驗屋網站'
    });

    if(GOOGLE_SCRIPT_URL){
      const submitBtn = contactForm.querySelector('.contact-submit');
      if(submitBtn) submitBtn.disabled = true;
      contactFormStatus.textContent = '表單送出中，請稍候。';
      try{
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: payload
        });
        contactFormStatus.textContent = '已送出表單，我們會盡快與您聯繫。';
        contactFormStatus.classList.add('is-success');
        contactForm.reset();
        generateCaptcha();
      }catch(error){
        contactFormStatus.textContent = '目前表單送出失敗，請改用 LINE、電話或 Email 聯繫我們。';
        contactFormStatus.classList.add('is-error');
      }finally{
        if(submitBtn) submitBtn.disabled = false;
      }
      return;
    }

    const mailBody = [
      '您好，我想預約或諮詢驗屋服務：',
      '',
      `姓名：${name.value.trim()}`,
      `電話：${phone.value.trim()}`,
      `方便聯絡時間：${time && time.value.trim() ? time.value.trim() : '未填寫'}`,
      '',
      '備註：',
      note && note.value.trim() ? note.value.trim() : '未填寫'
    ].join('\n');
    const mailto = `mailto:joshunyw@gmail.com?subject=${encodeURIComponent('究享驗屋網站表單諮詢')}&body=${encodeURIComponent(mailBody)}`;
    window.location.href = mailto;
    contactFormStatus.textContent = '已開啟您的郵件程式，請確認內容後送出信件。';
    contactFormStatus.classList.add('is-success');
    contactForm.reset();
    generateCaptcha();
  });
}
