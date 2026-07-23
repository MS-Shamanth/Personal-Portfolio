/* ========================================
   PORTFOLIO - Animations & Interactions
   ======================================== */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  //  LOADING SCREEN
  // ==========================================
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger hero animations after loader
      document.querySelectorAll('#home .reveal-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 150);
      });
    }, 1800);
  });

  // ==========================================
  //  PARTICLE SYSTEM
  // ==========================================
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0, mouseY = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '124, 58, 237' : '168, 85, 247';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 2;
        this.y += (dy / dist) * force * 2;
      }

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Initialize particles
  const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================
  //  CURSOR GLOW FOLLOWER
  // ==========================================
  const cursorGlow = document.getElementById('cursorGlow');
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });

  // ==========================================
  //  TYPING ANIMATION
  // ==========================================
  const typingEl = document.getElementById('typingText');
  const phrases = [
    'AI Systems',
    'ML Pipelines',
    'Neural Networks',
    'Web Applications',
    'Production Models',
    'Smart Solutions'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(typeWriter, speed);
  }
  typeWriter();

  // ==========================================
  //  HEADER SCROLL EFFECT
  // ==========================================
  const header = document.getElementById('mainHeader');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ==========================================
  //  ACTIVE NAV LINK HIGHLIGHT
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ==========================================
  //  MOBILE HAMBURGER MENU
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
  });

  // Close menu on link click
  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('open');
    });
  });

  // ==========================================
  //  SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  });

  revealElements.forEach(el => {
    // Skip hero elements (handled by loader callback)
    if (!el.closest('#home')) {
      revealObserver.observe(el);
    }
  });

  // ==========================================
  //  3D HERO CARD TILT
  // ==========================================
  const heroCard = document.getElementById('heroCard3D');
  if (heroCard) {
    const heroSection = document.getElementById('home');

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / rect.height) * -15;
      const rotateY = ((e.clientX - centerX) / rect.width) * 15;
      heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'rotateX(0) rotateY(0)';
      heroCard.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        heroCard.style.transition = 'transform 0.1s ease-out';
      }, 500);
    });
  }

  // ==========================================
  //  3D TILT EFFECT FOR CARDS
  // ==========================================
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.4s ease';
      setTimeout(() => {
        card.style.transition = 'transform 0.1s ease-out';
      }, 400);
    });
  });

  // ==========================================
  //  STAT COUNTER ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statAnimated = false;

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statAnimated) {
        statAnimated = true;
        statNumbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'));
          const duration = 2000;
          const start = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            num.textContent = Math.floor(eased * target);
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              num.textContent = target;
            }
          }
          requestAnimationFrame(updateCount);
        });
      }
    });
  }, { threshold: 0.5 });

  if (statNumbers.length > 0) {
    statObserver.observe(statNumbers[0].closest('.hero-stats'));
  }

  // ==========================================
  //  SMOOTH SCROLL FOR NAV LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  //  MAGNETIC BUTTON EFFECT
  // ==========================================
  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .resume-btn');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // ==========================================
  //  SKILL TAGS HOVER RIPPLE
  // ==========================================
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function(e) {
      this.style.transition = 'none';
      requestAnimationFrame(() => {
        this.style.transition = '';
      });
    });
  });

  // ==========================================
  //  CONTACT FORM HANDLING
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const btn = contactForm.querySelector('.submit-btn');
      btn.innerHTML = '<span>Sending...</span>';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    });
  }

  // ==========================================
  //  PAGE VISIBILITY – TITLE ANIMATION
  // ==========================================
  const originalTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '👋 Come back!' : originalTitle;
  });

  // ==========================================
  //  AI ORB — CURSOR TRACKING & CHATBOT
  // ==========================================
  const aiOrb = document.getElementById('aiOrb');
  const chatbotPanel = document.getElementById('chatbotPanel');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSend = document.getElementById('chatbotSend');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const orbEyes = document.querySelectorAll('.ai-orb-eye');

  // Orb eyes follow cursor + blink
  document.addEventListener('mousemove', (e) => {
    if (!aiOrb) return;
    const orbRect = aiOrb.getBoundingClientRect();
    const orbCenterX = orbRect.left + orbRect.width / 2;
    const orbCenterY = orbRect.top + orbRect.height / 2;
    const dx = e.clientX - orbCenterX;
    const dy = e.clientY - orbCenterY;
    const maxMove = 3;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const moveX = (dx / Math.max(dist, 1)) * maxMove;
    const moveY = (dy / Math.max(dist, 1)) * maxMove;
    orbEyes.forEach(eye => {
      eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  // Blink: squish to flat in 0.75s, then wait 4s
  function doBlink() {
    orbEyes.forEach(eye => {
      eye.style.transition = 'transform 0.15s ease-in';
      const current = eye.style.transform || '';
      const base = current.replace(/scaleY\([^)]*\)/, '').trim();
      eye.style.transform = base + ' scaleY(0.1)';
    });
    setTimeout(() => {
      orbEyes.forEach(eye => {
        eye.style.transition = 'transform 0.15s ease-out';
        const current = eye.style.transform || '';
        const base = current.replace(/scaleY\([^)]*\)/, '').trim();
        eye.style.transform = base + ' scaleY(1)';
      });
    }, 150);
  }

  setInterval(doBlink, 4000);
  setTimeout(doBlink, 1500);

  // Toggle chatbot
  const orbBubble = document.querySelector('.ai-orb-bubble');
  if (aiOrb) {
    aiOrb.addEventListener('click', () => {
      chatbotPanel.classList.toggle('open');
      if (chatbotPanel.classList.contains('open')) {
        chatbotInput.focus();
        if (orbBubble) orbBubble.style.display = 'none';
      } else {
        if (orbBubble) orbBubble.style.display = 'block';
      }
    });
  }

  if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
      chatbotPanel.classList.remove('open');
      if (orbBubble) orbBubble.style.display = 'block';
    });
  }

  // Chatbot knowledge base
  const botKnowledge = {
    name: "Shamanth M S",
    role: "ML Engineer & Web Developer",
    year: "Final-year B.E. CSE (AIML) student",
    college: "Vidyavardhaka College of Engineering, Mysuru",
    gpa: "8.31/10",
    email: "shamanthms1@gmail.com",
    phone: "+91 7019378029",
    location: "Mysuru, Karnataka, India",
    github: "https://github.com/MS-Shamanth",
    linkedin: "https://www.linkedin.com/in/ms-shamanth/",
    skills: "Python, JavaScript, Java, SQL, PyTorch, TensorFlow, HuggingFace, Scikit-Learn, Docker, Kubernetes, MLflow, Databricks, React, Node.js, FastAPI, PostgreSQL",
    projects: [
      "Neuro-Symbolic System-2 Reasoning — Hybrid LLM + ACT-R for hallucination reduction (~35% improvement)",
      "NyayaFlow — AI Judicial System handling 10,000+ cases with 87% accuracy",
      "DocuParse AI — Multimodal document parser with ~88% accuracy",
      "CreditPathAI — Loan default prediction with 148K+ financial records",
      "InterviewSim — AI Interview Simulator with Mistral AI, ElevenLabs voice, 10+ tools",
      "Chrono Weather — NASA-powered forecasting across 193 countries with 95%+ uptime"
    ],
    experience: [
      "AI/ML Intern at Infosys Springboard (Feb-Apr 2026) — Random Forest model with 0.96 ROC-AUC",
      "Website Developer at Eureka Institute (Nov 2025-Jan 2026) — React/TypeScript, 95% merge acceptance rate",
      "Freelance Web Developer for PROFORMA, Germany (Oct 2024) — 13,000+ lines CSS, 45% usability improvement"
    ],
    achievements: [
      "Finalist — Infosys Global Hackathon 2025 (Top 2/32 at Mysuru DC, Grand Finale in Hyderabad)",
      "Runner-Up — TiE U Global Hackathon 2024 (VIP invite to TiE Global Summit 2025)",
      "Finalist — Meta PyTorch OpenEnv Hackathon 2025 (Top 800/30,000+ teams)",
      "1st Place — Eurekathon 2025 (Coding Track)",
      "2nd Place — HAXLR8 2.0 (24-Hour Hackathon, MIT Mysuru)",
      "Artificial Intelligence Primer — Certificate of Achievement (Infosys)"
    ],
    certifications: [
      "Salesforce Certified Platform Developer I (2026)",
      "Machine Learning Specialization — DeepLearning.AI & Stanford (Coursera, 2025)",
      "NPTEL — Introduction to IoT (2026)",
      "Alibaba Cloud Computing Specialization (Coursera, 2026)",
      "Google Cloud Career Launchpad — Cloud Engineer (2025)",
      "Google Cloud Career Launchpad — Data Analytics (2026)",
      "Software Development Lifecycle Specialization — University of Minnesota (2026)",
      "Artificial Intelligence Primer — Infosys (2026)"
    ]
  };

  function getBotResponse(input) {
    const q = input.toLowerCase().trim();

    // Greetings
    if (q.match(/^(hi|hello|hey|sup|yo|hola|greetings)/)) return `Hey there! 👋 I'm Timi. Ask me about Shamanth's skills, projects, experience, achievements, certifications, or education!`;

    // Skills
    if (q.match(/skill|tech|stack|language|tool|framework|what.*(know|use|work with)/)) return `His tech stack includes:\n\n🐍 Languages: Python, JavaScript, Java, SQL\n🧠 ML/AI: PyTorch, TensorFlow, HuggingFace, Scikit-Learn, Keras, Pandas, NumPy\n🛠️ MLOps: Docker, Kubernetes, MLflow, Databricks\n🌐 Web: React.js, Node.js, FastAPI\n💾 Databases: PostgreSQL, MySQL`;

    // Projects - general
    if (q.match(/project|what.*(built|build|made|create)/)) return `He's built 6+ projects:\n\n1. 🧠 Neuro-Symbolic System-2 Reasoning — ~35% hallucination reduction\n2. ⚖️ NyayaFlow — AI Judicial System (87% accuracy, 10K+ cases)\n3. 📄 DocuParse AI — Document parser (~88% accuracy)\n4. 💳 CreditPathAI — Loan default prediction (148K+ records)\n5. 🎤 InterviewSim — AI Interview Simulator with Mistral AI\n6. 🌦️ Chrono Weather — NASA forecasting (193 countries)`;

    // Individual projects
    if (q.match(/neuro|symbolic|reason|hallucin/)) return `Neuro-Symbolic System-2 Reasoning: A hybrid LLM + ACT-R architecture that reduces hallucinations by ~35%. Built with PyTorch, HuggingFace Transformers, and Python.\n\nGitHub: github.com/MS-Shamanth/Neuro-Symbolic-Agent`;
    if (q.match(/nyaya|judicial|court|legal/)) return `NyayaFlow — AI Judicial Case Intelligence System running on Databricks (Delta Lake, MLflow). Handles 10,000+ cases in <2 seconds with ~87% accuracy. Saves 40% research time.`;
    if (q.match(/docu|parse|ocr|document/)) return `DocuParse AI — Multimodal document parser handling 1,000+ PDFs/images with ~88% accuracy. Uses Tesseract OCR with bounding box detection, deployed with Docker and MLflow.`;
    if (q.match(/credit|loan|default|xgboost/)) return `CreditPathAI — AI loan default prediction system. Ingests 148K+ financial records into PostgreSQL, benchmarks XGBoost and LightGBM for risk assessment.\n\nGitHub: github.com/springboardmentor14065l/ai-creditPath/tree/MS_Shamanth`;
    if (q.match(/interview|sim|mock|mistral/)) return `InterviewSim — AI Interview Rehearsal Simulator built with FastAPI, React.js, PostgreSQL, and Node.js. Features 10+ career-prep tools, a 4-metric AI scoring system using Mistral AI, and ElevenLabs voice-based interviewing.\n\nGitHub: github.com/MS-Shamanth/Interview_Simulator`;
    if (q.match(/chrono|weather|nasa|forecast|climate/)) return `Chrono Weather — AI-Powered NASA Analog Forecasting System. Full-stack platform using React.js and Node.js, integrating 7+ NASA APIs. Processes 40+ years of satellite data with 5 km accuracy across 193 countries.\n\nGitHub: github.com/MS-Shamanth/ChronoWeather`;

    // Experience
    if (q.match(/experience|intern|work|job|company|where.*(work|intern)/)) return `Work experience:\n\n1. 🤖 AI/ML Intern — Infosys Springboard (Feb-Apr 2026)\n   • Random Forest model with 0.96 ROC-AUC\n   • Engineered 14+ financial risk features\n\n2. 🌐 Website Developer — Eureka Institute (Nov 2025-Jan 2026)\n   • React/TypeScript, 95% merge rate\n\n3. 💻 Freelance Web Dev — PROFORMA, Germany (Oct 2024)\n   • 13,000+ lines CSS, 45% usability boost`;
    if (q.match(/infosys/)) return `AI/ML Intern at Infosys Springboard (Feb-Apr 2026): Automated preprocessing for thousands of records (~40% time saved), engineered 14+ financial risk features, built a Random Forest model achieving 0.96 ROC-AUC.`;
    if (q.match(/eureka/)) return `Website Developer at Eureka Institute (Nov 2025-Jan 2026): Built core frontend modules in React/TypeScript, improved page load by ~28%, delivered weekly features with a 95% merge acceptance rate.`;
    if (q.match(/proforma|freelance|german/)) return `Freelance Web Developer for PROFORMA, Germany (Oct 2024): Delivered a full-scale frontend with 13,000+ lines of custom CSS, improved usability by ~45%, 100% on-time delivery.`;

    // Achievements
    if (q.match(/achieve|award|hackathon|winner|won|prize|place/)) return `Achievements:\n\n🏆 Finalist — Infosys Global Hackathon 2025 (Top 2/32, Grand Finale in Hyderabad)\n🥈 Runner-Up — TiE U Global Hackathon 2024 (VIP invite to TiE Global Summit)\n🔥 Finalist — Meta PyTorch OpenEnv Hackathon 2025 (Top 800/30,000+)\n🥇 1st Place — Eurekathon 2025 (Coding Track)\n🥈 2nd Place — HAXLR8 2.0 (24-Hour Hackathon, MIT Mysuru)\n📜 AI Primer — Certificate of Achievement (Infosys)`;

    // Certifications
    if (q.match(/cert|credential|course|certification/)) return `Certifications:\n\n• Salesforce Certified Platform Developer I (2026)\n• Machine Learning Specialization — Stanford/DeepLearning.AI (2025)\n• NPTEL — Introduction to IoT (2026)\n• Alibaba Cloud Computing Specialization (2026)\n• Google Cloud — Cloud Engineer Track (2025)\n• Google Cloud — Data Analytics Track (2026)\n• SDLC Specialization — Univ. of Minnesota (2026)\n• AI Primer — Infosys (2026)`;

    // Education
    if (q.match(/college|university|school|education|degree|study|gpa|grade|score/)) return `🎓 Final-year B.E. CSE (AIML) at Vidyavardhaka College of Engineering, Mysuru.\nGPA: 8.31/10 | Expected graduation: Aug 2027`;

    // Contact
    if (q.match(/email|mail|contact|reach|connect/)) return `📧 Email: shamanthms1@gmail.com\n📞 Phone: +91 7019378029\n📍 Location: Mysuru, Karnataka, India\n\nOr use the contact form on this site!`;
    if (q.match(/phone|call|number/)) return `📞 Phone: +91 7019378029`;
    if (q.match(/github|repo|code/)) return `GitHub: github.com/MS-Shamanth\nHe has repos for Neuro-Symbolic Agent, ChronoWeather, Interview Simulator, and CreditPathAI.`;
    if (q.match(/linkedin/)) return `LinkedIn: linkedin.com/in/ms-shamanth/`;
    if (q.match(/location|city|where|live|from|based/)) return `He's based in Mysuru, Karnataka, India.`;
    if (q.match(/resume|cv|download/)) return `You can download his resume using the "Resume" button in the top-right corner of the navigation bar!`;

    // About / Who
    if (q.match(/who|about|tell me about|introduce/)) return `Shamanth M S is a final-year AIML student at VVCE, Mysuru. He's an ML Engineer & Web Developer who builds production-ready AI systems using PyTorch, HuggingFace, and modern MLOps. He has 6+ projects, 3 internships, and multiple hackathon wins.`;
    if (q.match(/name/)) return `His name is Shamanth M S.`;

    // ML specific
    if (q.match(/python|pytorch|ml|machine learn|deep learn|ai|artificial intel/)) return `He's proficient in Python, PyTorch, TensorFlow, Scikit-Learn, HuggingFace, Keras, and modern MLOps tools like Docker, Kubernetes, MLflow, and Databricks.`;
    if (q.match(/web|react|frontend|full.?stack|backend|node/)) return `He does full-stack web dev with React.js, Node.js, FastAPI, TypeScript, and has delivered production platforms for clients in Germany and India.`;
    if (q.match(/docker|kubernetes|mlops|deploy|devops/)) return `He's experienced with Docker, Kubernetes, MLflow, and Databricks for containerization, orchestration, and ML model deployment.`;

    // Fun / misc
    if (q.match(/hobby|hobbies|fun|free time|interest/)) return `He's passionate about AI research, building full-stack apps, participating in hackathons, and exploring new ML papers!`;
    if (q.match(/age|old|born/)) return `He's a final-year student (expected graduation Aug 2027), so around 21-22 years old.`;
    if (q.match(/thank|bye|cool|great|awesome|nice/)) return `Glad I could help! Feel free to come back anytime. 😊`;
    if (q.match(/timi|your name|who are you/)) return `I'm Timi! Shamanth's personal AI assistant built into this portfolio. I know everything about his work, skills, and achievements. Ask away!`;

    // Fallback
    return `Hmm, I'm not sure about that specific topic. Try asking about:\n• Skills & tech stack\n• Projects (6+ built)\n• Work experience & internships\n• Hackathon achievements\n• Certifications\n• Education & GPA\n• Contact info`;
  }

  function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = `chat-msg ${isUser ? 'chat-user' : 'chat-bot'}`;
    div.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function handleSend() {
    const val = chatbotInput.value.trim();
    if (!val) return;
    addMessage(val, true);
    chatbotInput.value = '';
    setTimeout(() => {
      addMessage(getBotResponse(val), false);
    }, 400);
  }

  if (chatbotSend) chatbotSend.addEventListener('click', handleSend);
  if (chatbotInput) chatbotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

});
