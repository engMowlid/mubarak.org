// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link (but not dropdown toggles)
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Don't close if it's a dropdown toggle on mobile
        if (window.innerWidth <= 768 && link.parentElement.classList.contains('dropdown') && !link.closest('.dropdown-menu')) {
            return;
        }
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Mobile Dropdown Toggle
document.querySelectorAll('.dropdown > a').forEach(dropdownToggle => {
    dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = dropdownToggle.parentElement;
            dropdown.classList.toggle('active');
        }
    });
});

// Carousel functionality (left / right arrows scroll the cards)
function getCarousel(type) {
    return document.querySelector('.' + type + '-carousel');
}

function updateCarouselArrows(type) {
    const carousel = getCarousel(type);
    if (!carousel) return;
    const section = carousel.closest('section');
    const controls = section && section.querySelector('.carousel-controls');
    if (!controls) return;
    const prev = controls.querySelector('.prev');
    const next = controls.querySelector('.next');
    const max = carousel.scrollWidth - carousel.clientWidth;
    const pos = Math.abs(carousel.scrollLeft);
    const rtl = document.documentElement.dir === 'rtl';
    const atStart = pos <= 2;
    const atEnd = pos >= max - 2;
    // Left arrow always moves the cards to the left visually
    prev.disabled = rtl ? atEnd : atStart;
    next.disabled = rtl ? atStart : atEnd;
    // Nothing to scroll (e.g. four cards fit on a wide screen): hide the arrows
    controls.classList.toggle('no-scroll', max <= 2);
}

function moveCarousel(type, direction) {
    const carousel = getCarousel(type);
    if (!carousel) return;
    const card = Array.from(carousel.children).find(c => c.offsetWidth > 0);
    if (!card) return;
    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 20;
    carousel.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' });
}

const projectsCarousel = document.getElementById('projectsCarousel');
if (projectsCarousel) {
    projectsCarousel.addEventListener('scroll', () => updateCarouselArrows('projects'), { passive: true });
    window.addEventListener('resize', () => updateCarouselArrows('projects'));

    // "View All Projects" shows all six; clicking again goes back to four
    const toggleProjects = document.getElementById('toggleProjects');
    if (toggleProjects) {
        toggleProjects.addEventListener('click', () => {
            const expanded = projectsCarousel.classList.toggle('expanded');
            toggleProjects.setAttribute('aria-expanded', expanded);
            toggleProjects.querySelector('.vp-more').hidden = expanded;
            toggleProjects.querySelector('.vp-less').hidden = !expanded;
            projectsCarousel.scrollTo({ left: 0 });
            updateCarouselArrows('projects');
        });
    }
    updateCarouselArrows('projects');
}

// Floating WhatsApp button (sits below the language selector on every page)
const WHATSAPP_NUMBER = '252615833023'; // 0615833023 / 0613535457
const waLink = document.createElement('a');
waLink.className = 'whatsapp-float';
waLink.target = '_blank';
waLink.rel = 'noopener noreferrer';
waLink.innerHTML = '<svg viewBox="0 0 448 512" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>';
document.body.appendChild(waLink);

function updateWhatsApp() {
    const msg = (translations[currentLang] && translations[currentLang]['wa-message']) || translations.en['wa-message'];
    const label = (translations[currentLang] && translations[currentLang]['wa-label']) || translations.en['wa-label'];
    waLink.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    waLink.setAttribute('aria-label', label);
    waLink.title = label;
}

// Smooth scroll for navigation links (only for hash links on same page)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default if it's a hash link on the same page
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Newsletter form submission
document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    e.target.reset();
});

// Language Switching
const translations = {
    en: {
        'home': 'Home',
        'somalia-loc': 'Somalia',
        'show-fewer': 'Show Fewer',
        'wa-message': 'Hello MASaD, I would like to know more about your work.',
        'wa-label': 'Chat with us on WhatsApp',
        'about-us': 'About Us',
        'our-programs': 'Our Programs',
        'our-projects': 'Our Projects',
        'our-impact': 'Our Impact',
        'news-updates': 'News & Updates',
        'get-involved': 'Get Involved',
        'contact': 'Contact',
        'donate-now': 'Donate Now',
        'quick-links': 'Quick Links',
        'contact-info': 'Contact Info',
        'newsletter': 'Newsletter',
        'newsletter-text': 'Subscribe to our newsletter for updates.',
        'footer-slogan': 'Building Resilient Communities for Sustainable Development.',
        'email-placeholder': 'Your email',
        'hero-title': 'Mubarak Association for Sustainable and Development (MASaD)',
        'hero-subtitle': 'Is a non-profit organization dedicated to building resilient communities for sustainable development. We work to empower communities through sustainable development programs, advocacy, and humanitarian assistance in Somalia and beyond.',
        'explore-work': 'Explore Our Work',
        'focus-areas': 'Our Focus Areas',
        'focus-subtitle': 'We are committed to making a sustainable impact through our key focus areas.',
        'who-we-are': 'Who We Are',
        'who-we-are-text': 'Mubarak Association for Sustainable and Development (MASaD) is a non-profit organization dedicated to building resilient communities for sustainable development.',
        'our-mission': 'Our Mission',
        'our-vision': 'Our Vision',
        'empowering': 'Empowering Communities',
        'empowering-subtitle': 'Our programs are designed to create sustainable impact and empower communities to build self-sufficient futures.',
        'view-all-programs': 'View All Programs',
        'turning-support': 'Turning Support into Real Impact',
        'turning-subtitle': 'Our projects are making a tangible difference in communities across the regions we serve.',
        'real-people': 'Real People, Real Change',
        'real-subtitle': 'The numbers tell the story of our collective impact and the lives we\'ve transformed together.',
        'communities-served': 'Communities Served',
        'lives-impacted': 'Lives Impacted',
        'volunteers': 'Volunteers',
        'projects-completed': 'Projects Completed',
        'testimonials': 'What People Say',
        'testimonials-subtitle': 'Hear from the communities and individuals whose lives have been transformed by our work.',
        'latest-news': 'Latest News & Stories',
        'latest-news-subtitle': 'Stay updated with our latest initiatives, success stories, and news from the field.',
        'view-all-news': 'View All News',
        'be-part': 'Be Part of the Change',
        'be-part-subtitle': 'Your support can transform lives. Join us in making a difference today through donation, volunteering, or partnership.',
        'volunteer': 'Volunteer',
        'partner': 'Partner With Us',
        'get-in-touch': 'Get in Touch',
        'get-in-touch-subtitle': 'Have questions or want to learn more about our work? We\'d love to hear from you.',
        'location': 'Location',
        'phone': 'Phone',
        'email-label': 'Email',
        'send-message': 'Send us a Message',
        'full-name': 'Full Name',
        'email-address': 'Email Address',
        'phone-number': 'Phone Number',
        'message': 'Message',
        'your-message': 'Your message',
        'send-msg': 'Send Message',
        'make-donation': 'Make a Donation',
        'donation-subtitle': 'Your support helps us build resilient communities for sustainable development. Every contribution makes a difference in the lives of those we serve.',
        'ready-donate': 'Ready to Donate?',
        'ready-donate-text': 'Contact us to discuss your donation or learn more about how you can support our mission.',
        'contact-us': 'Contact Us',
        'view-all-projects': 'View All Projects',
        'water-well-project': 'Water Well Project',
        'school-construction': 'School Construction',
        'medical-clinic': 'Medical Clinic',
        'agricultural-support': 'Agricultural Support',
        'housing-initiative': 'Housing Initiative',
        'east-africa': 'East Africa',
        'south-asia': 'South Asia',
        'middle-east': 'Middle East',
        'latin-america': 'Latin America',
        'southeast-asia': 'Southeast Asia',
        'ongoing': 'Ongoing',
        'completed': 'Completed',
        'planned': 'Planned',
        'communities-served-text': 'Communities Served',
        'lives-impacted-text': 'Lives Impacted',
        'volunteers-text': 'Volunteers',
        'projects-completed-text': 'Projects Completed',
        'testimonial-1': '"HopeBridge transformed our village. The clean water project has changed our lives completely. Our children are healthier, and we have more time for productive work."',
        'testimonial-2': '"The education program gave my daughter opportunities I never had. She\'s now in high school and dreams of becoming a doctor. Thank you, HopeBridge."',
        'testimonial-3': '"As a volunteer, I\'ve seen firsthand the impact of HopeBridge\'s work. The dedication and compassion of the team is truly inspiring."',
        'maria-santos': 'Maria Santos',
        'village-elder': 'Village Elder, Philippines',
        'ahmed-hassan': 'Ahmed Hassan',
        'parent': 'Parent, Kenya',
        'sarah-johnson': 'Sarah Johnson',
        'news-1': 'New Water Well Project Launches in Rural Community',
        'news-1-text': 'We\'re excited to announce the launch of our latest water well project that will serve over 5,000 people.',
        'news-2': 'Education Program Reaches Milestone: 1,000 Students',
        'news-2-text': 'Our education initiative has achieved a significant milestone with over 1,000 children now enrolled.',
        'news-3': 'Volunteer Appreciation: Celebrating Our Heroes',
        'news-3-text': 'We honor the incredible volunteers who make our work possible through their dedication and service.',
        'read-more': 'Read More',
        'view-all-projects': 'View All Projects',
        'sustainable-dev': 'Sustainable Development',
        'sustainable-dev-text': 'Promoting long-term sustainable solutions for community growth and environmental stewardship.',
        'women-youth': 'Women & Youth Empowerment',
        'women-youth-text': 'Empowering women and youth through education, skills training, and leadership opportunities.',
        'community-dev': 'Community Development',
        'community-dev-text': 'Building strong, resilient communities through collaborative development initiatives.',
        'advocacy': 'Advocacy & Human Rights',
        'advocacy-text': 'Advocating for human rights and social justice for vulnerable populations.',
        'climate': 'Climate Change & Environmental Protection',
        'climate-text': 'Addressing climate challenges and protecting the environment for future generations.',
        'capacity': 'Capacity Building & Education',
        'capacity-text': 'Enhancing skills and knowledge through educational programs and capacity building.',
        'resilience': 'Resilience & Livelihoods',
        'resilience-text': 'Building economic resilience and sustainable livelihoods for communities.',
        'security': 'Security Awareness & Risk Management',
        'security-text': 'Promoting security awareness and effective risk management strategies.',
        'education-all': 'Education for All',
        'education-all-text': 'Providing quality education and learning resources to children in underserved communities.',
        'healthcare-access': 'Healthcare Access',
        'healthcare-access-text': 'Delivering essential healthcare services and medical supplies to remote areas.',
        'women-empower': 'Women Empowerment',
        'women-empower-text': 'Supporting women through skills training, microfinance, and leadership programs.',
        'child-protection': 'Child Protection',
        'child-protection-text': 'Ensuring the safety and well-being of children through protection programs and advocacy.',
        'livelihood-support': 'Livelihood Support',
        'livelihood-support-text': 'Creating economic opportunities through vocational training and small business support.',
        'environmental-sustain': 'Environmental Sustainability',
        'environmental-sustain-text': 'Promoting sustainable practices and environmental conservation in communities.',
        'learn-more': 'Learn More',
        'mission-text': 'To provide humanitarian assistance and sustainable development programs that empower communities to overcome challenges and build brighter futures.',
        'vision-text': 'A world where every individual has access to basic necessities, opportunities for growth, and the hope for a better tomorrow.',
        'mission-text-full': 'To advocate for and empower women, youth, marginalized and minority communities through education, sustainable development, human rights, and inclusive social protection initiatives. MASaD promotes equal access to education, healthcare, justice, and economic opportunities while combating discrimination, exclusion, and all forms of social injustice, enabling every individual to participate fully in the development of their communities.',
        'vision-text-full': 'To create a just and equitable society where every woman and marginalized individual has the opportunity to thrive, empowered by their rights, supported by sustainable practices, and actively participating in shaping their communities and future.',
        'who-we-are-text': 'Mubarak Association for Sustainable Development (MASaD) is a non-profit, non-governmental organization established in Baidoa south west state of Somalia, on 17 October 2020 and committed to promoting sustainable development and building resilient communities in South West State of Somalia and beyond.',
        'hero-subtitle': 'Is a non-profit organization dedicated to building resilient communities for sustainable development. We work to empower communities through sustainable development programs, advocacy, and humanitarian assistance in Somalia and beyond.',
        'advocacy-program': 'Advocacy',
        'advocacy-program-text': 'Advocating for human rights and social justice for vulnerable populations through policy change and community engagement.',
        'community-dev-program': 'Community Development',
        'community-dev-program-text': 'Building strong, resilient communities through collaborative development initiatives and infrastructure projects.',
        'climate-change-program': 'Climate Change',
        'climate-change-program-text': 'Addressing climate challenges through environmental protection, sustainable practices, and community resilience building.',
        'climate-subtitle': 'Addressing Climate Challenges for Future Generations',
        'climate-desc': 'MASaD\'s Climate Change program focuses on addressing climate challenges through environmental protection, sustainable practices, and community resilience building. We work with local communities to implement solutions that protect the environment and build resilience to climate impacts.',
        'climate-approach-text': 'We implement comprehensive climate change initiatives:',
        'climate-1': 'Environmental protection and conservation programs',
        'climate-2': 'Sustainable agriculture and farming practices',
        'climate-3': 'Water resource management and conservation',
        'climate-4': 'Renewable energy promotion and adoption',
        'climate-5': 'Community awareness and education on climate issues',
        'climate-6': 'Disaster risk reduction and preparedness',
        'climate-impact-text': 'Our climate change efforts have made a difference:',
        'climate-impact-1': 'Planted 130+ trees in communities',
        'climate-impact-3': 'Trained 40+ community members on sustainable practices',
        'support-climate': 'Support Climate Action',
        'security-program': 'Security Awareness & Risk Management',
        'security-program-text': 'Promoting security awareness and effective risk management strategies to protect communities.',
        'security-subtitle': 'Building Safe and Resilient Communities',
        'security-desc': 'MASaD\'s Security Awareness & Risk Management program focuses on promoting security awareness and implementing effective risk management strategies to protect communities. We work with local communities to identify security risks and develop comprehensive strategies to enhance safety and resilience.',
        'security-approach-text': 'We implement comprehensive security awareness initiatives:',
        'security-1': 'Security awareness training and education programs',
        'security-2': 'Risk assessment and vulnerability analysis',
        'security-3': 'Community-based security planning',
        'security-4': 'Early warning systems and emergency preparedness',
        'security-5': 'Conflict prevention and peacebuilding initiatives',
        'security-6': 'Protection of vulnerable populations',
        'security-impact-text': 'Our security awareness efforts have enhanced community safety:',
        'security-impact-1': 'Trained 20+ community members on security awareness',
        'security-impact-4': 'Protected 70+ vulnerable individuals through targeted programs',
        'support-security': 'Support Security Initiatives',
        'our-approach': 'Our Approach',
        'impact': 'Impact',
        'advocacy-subtitle': 'Amplifying Voices for Human Rights and Social Justice',
        'advocacy-desc': 'MASaD\'s Advocacy program works to promote human rights, social justice, and policy change for vulnerable populations. We engage with communities, governments, and international organizations to create lasting systemic change.',
        'advocacy-approach-text': 'We implement comprehensive advocacy initiatives:',
        'advocacy-1': 'Human rights awareness campaigns',
        'advocacy-2': 'Policy reform and legislative advocacy',
        'advocacy-3': 'Community mobilization and engagement',
        'advocacy-4': 'Partnership with local and international organizations',
        'advocacy-5': 'Legal aid and support services',
        'advocacy-6': 'Media and public awareness campaigns',
        'advocacy-impact-text': 'Our advocacy efforts have driven meaningful change:',
        'advocacy-impact-1': 'Influenced 10+ policy changes',
        'advocacy-impact-2': 'Mobilized 550+ community members',
        'advocacy-impact-3': 'Established 1 strategic partnerships & another one in progress',
        'advocacy-impact-4': 'Provided legal aid to 1,500+ cases',
        'support-advocacy': 'Support Advocacy',
        'back-programs': 'Back to Programs',
        'community-dev-subtitle': 'Building Strong, Resilient Communities Together',
        'community-dev-desc': 'MASaD\'s Community Development program focuses on building strong, resilient communities through collaborative development initiatives. We work with local communities to identify needs and implement sustainable solutions that improve quality of life.',
        'community-dev-approach-text': 'We implement comprehensive community development initiatives:',
        'community-dev-1': 'Infrastructure development and improvement',
        'community-dev-2': 'Community capacity building and training',
        'community-dev-3': 'Local governance and leadership support',
        'community-dev-4': 'Economic development and job creation',
        'community-dev-5': 'Social cohesion and peacebuilding programs',
        'community-dev-6': 'Public health and sanitation projects',
        'community-dev-impact-text': 'Our community development efforts have transformed lives:',
        'community-dev-impact-1': 'Built 50+ community facilities',
        'community-dev-impact-2': 'Improved infrastructure in 10+ villages',
        'community-dev-impact-3': 'Trained 100+ community members',
        'community-dev-impact-4': 'Created 50+ local jobs',
        'support-communities': 'Support Communities'
,
        // Forms, footer, mission/vision
        'copyright': '© 2026 Mubarak Association for Sustainable and Development (MASaD). All rights reserved.',
        'baidoa-somalia': 'Baidoa, Somalia',
        'follow-us': 'Follow Us',
        'families-served': 'Families Served',
        'partnership-title': 'Our Partnership',
        'partnership-sub': 'United Nations Transitional Assistance Mission in Somalia',
        'partnership-text': 'We are proud to have a partnership with UNTMIS, working together to support communities across in South West State Somalia.',
        'ph-name': 'Enter your full name',
        'ph-email': 'Enter your email',
        'ph-phone': 'Enter your phone number',
        'form-sending': 'Sending...',
        'form-success': 'Thank you! Your message has been sent. We will get back to you soon.',
        'form-error': 'Sorry, something went wrong. Please try again or email us directly.',
        'donate-form-title': 'Donation Form',
        'donate-message': 'How would you like to donate or support us?',
        'ph-donate-message': 'Tell us how you would like to help',
        'send-donation': 'Send Donation Request',
        'prefill-volunteer': 'I would like to volunteer with MASaD.',
        'prefill-partner': 'I would like to partner with MASaD.',
        'back-home': 'Back to Home',
        'mission-sub': 'Empowering communities to overcome challenges and build brighter futures',
        'mission-p2': 'MASaD is a non-profit organization based in Baidoa, Somalia. We work side by side with local communities, authorities and partners, including UNTMIS, to deliver humanitarian assistance and sustainable development programs that last.',
        'mission-h2': 'What Drives Us',
        'mission-1': 'Providing humanitarian assistance to people in need',
        'mission-2': 'Delivering sustainable development programs in education, health and livelihoods',
        'mission-3': 'Empowering women, youth and vulnerable groups',
        'mission-4': 'Strengthening community resilience and self-reliance',
        'mission-5': 'Building partnerships with local authorities and international organizations',
        'mission-h2b': 'Our Commitment',
        'mission-p3': 'We are committed to working transparently and respectfully with every community we serve, so that people can overcome challenges and build brighter futures for themselves and their children.',
        'vision-sub': 'A world of opportunity and hope',
        'vision-p2': 'We imagine communities in Somalia and beyond where families live with dignity, children learn and grow safely, and people are able to shape their own future.',
        'vision-h2': 'What We Envision',
        'vision-1': 'Every individual has access to basic necessities',
        'vision-2': 'Real opportunities for education, work and growth',
        'vision-3': 'Women, youth and children able to reach their full potential',
        'vision-4': 'Resilient, peaceful communities',
        'vision-5': 'The hope for a better tomorrow',
        'vision-h2b': 'Working Toward It Together',
        'vision-p3': 'Our vision guides every program we run. With our partners and the communities we serve, we take practical steps every day toward a more hopeful future.',
        // Impact figures (synced with HTML pages)
        'education-12': 'Enrolled over 50 students.',
        'education-13': 'Trained 20+ teachers',
        'education-14': 'Distributed 650+ textbooks and learning materials',
        'healthcare-12': 'Vaccinated 70+ children',
        'healthcare-13': 'Trained 53 community health workers',
        'healthcare-14': 'Distributed 50+ medical supplies',
        'livelihood-12': 'Supported 80+ small businesses',
        'livelihood-13': 'Trained over 10 small cooperative agriculture.',
        'livelihood-14': 'Established 30 savings groups',
        'women-empowerment-11': 'Trained 40+ women in vocational skills',
        'women-empowerment-12': 'Supported 40+ women-owned businesses',
    },
    so: {
        'home': 'Bogga Hore',
        'somalia-loc': 'Soomaaliya',
        'show-fewer': 'Muuji Yar',
        'wa-message': 'Salaan MASaD, waxaan jeclaan lahaa inaan wax badan ka ogaado shaqadiinna.',
        'wa-label': 'Nala Sheekayso WhatsApp',
        'about-us': 'Nagu Saabsan',
        'our-programs': 'Barnaamijyadda',
        'our-projects': 'Mashaariicdda',
        'our-impact': 'Saameynta',
        'news-updates': 'Wararka',
        'get-involved': 'Ka Qayb Qaado',
        'contact': 'Nala Soo Xiriir',
        'donate-now': 'Ku Deeq',
        'quick-links': 'Xiriiriyeyaasha Degdegga ah',
        'contact-info': 'Macluumaadka Xiriirka',
        'newsletter': 'Wargeyska Iimaylka',
        'newsletter-text': 'Is-diiwaangeli si aad u hesho wararka ugu dambeeya.',
        'footer-slogan': 'Dhisidda bulshooyin adkaysi leh iyo horumar waara.',
        'email-placeholder': 'Iimaylkaaga',
        'hero-title': 'Mubarak Association for Sustainable and Development (MASaD)',
        'hero-subtitle': 'Waa urur aan faa\'iido doonin oo dhex yahay dhisidda bulshooyin adkaysi leh ee horumar waara. Waxaan la shaqeynaa bulshooyinka si aan u awood-siiyo iyaga iyada oo la adeegsanayo barnaamijyo horumar waara, dood, iyo gargaar bani\'aadannimo Soomaaliya iyo inta kale.',
        'explore-work': 'Sahami Shaqadeena',
        'focus-areas': 'Qaybaha Aan Ku Xoogga Saarno',
        'focus-subtitle': 'Waxaan u heellanahay inaan saameyn waara ku yeelanno qaybaha ugu muhiimsan ee shaqadeenna.',
        'who-we-are': 'Nagu Saabsan',
        'who-we-are-text': 'Ururka Mubarak ee Horumarka Waara (MASaD) waa urur aan faa\'iido doon ahayn oo u heellan dhisidda bulshooyin adkaysi leh iyo horumar waara. Waxaan ka shaqeynaa Baydhabo iyo guud ahaan Soomaaliya, annagoo bulshada awood-siinaya iyada oo loo marayo barnaamijyo horumarineed, u doodis, iyo gargaar bani\'aadannimo. Waxaan rumaysan nahay in bulsho kasta ay leedahay awoodda ay ku beddeli karto mustaqbalkeeda marka la siiyo fursadaha iyo taageerada ku habboon.',
        'our-mission': 'Hadafkeenna',
        'our-vision': 'Aragtideenna',
        'empowering': 'Awood-siinta Bulshooyinka',
        'empowering-subtitle': 'Barnaamijyadayadu waxay u qaabaysan yihiin inay abuuraan saameyn waara una awood siiyaan bulshooyinka inay dhistaan mustaqbal iskood isku filan.',
        'view-all-programs': 'Eeg Dhammaan Barnaamijyadda',
        'turning-support': 'Ka Beddelidda Taageerada Saameyn Dhab Ah',
        'turning-subtitle': 'Mashaariicdayadu waxay isbeddel dhab ah ka keenayaan bulshooyinka aan u adeegno.',
        'real-people': 'Dad Dhab Ah, Isbeddel Dhab Ah',
        'real-subtitle': 'Tirooyinku waxay sheegayaan sheekada saameynteenna wadajirka ah iyo nolosha aan wada beddelnay.',
        'communities-served': 'Bulshooyinka La Caawiyay',
        'lives-impacted': 'Nolol La Saameeyay',
        'volunteers': 'Ragii Caawimada',
        'projects-completed': 'Mashaariic La Dhammeeyay',
        'testimonials': 'Waa Maxay Dadka La Yidhi',
        'testimonials-subtitle': 'Maqalka bulshooyinka iyo dadka noloshoodu ay beddelay shaqadayada.',
        'latest-news': 'Wararka Ugu Dambeeya iyo Sheekooyin',
        'latest-news-subtitle': 'Ka soo hel wararka ugu dambeeya ee hindisayaasheenna, sheekooyinka guusha, iyo xaaladaha goobta.',
        'view-all-news': 'Eeg Dhammaan Wararka',
        'be-part': 'Noqo Qayb Ka Mid Ah Isbeddelka',
        'be-part-subtitle': 'Taageeradaadu waxay beddeli kartaa nolosha. Nagu soo biir maanta adigoo ku deeqaya, mutadawaca, ama iskaashi nala yeelanaya.',
        'volunteer': 'Noqo Mutadawac',
        'partner': 'Nala Shariik Noqo',
        'get-in-touch': 'Nala Soo Xiriir',
        'get-in-touch-subtitle': 'Su\'aalo ma qabtaa, mise waxaad jeclaan lahayd inaad wax badan ka ogaato shaqadayada? Waan ku soo dhawaynaynaa inaan kaa maqalno.',
        'location': 'Goobta',
        'phone': 'Taleefan',
        'email-label': 'Iimayl',
        'send-message': 'Noo Soo Dir Fariin',
        'full-name': 'Magaca Oo Dhan',
        'email-address': 'Cinwaanka Iimaylka',
        'phone-number': 'Lambarka Taleefanka',
        'message': 'Fariinta',
        'your-message': 'Fariintaada',
        'send-msg': 'Dir Fariinta',
        'make-donation': 'Ku Dhiibo',
        'donation-subtitle': 'Caawimadaadu waxay caawinaysaa dhismayaal bulshooyin dheeraad ah. Har kasta waa muhiim.',
        'ready-donate': 'U Diiban Karo?',
        'ready-donate-text': 'Nala xiriir si aad uga wada hadasho taageeradaada ama waxaad ogaatay sida aad u caawin karto misionka.',
        'contact-us': 'La Xiriir',
        'view-all-projects': 'Eeg Dhammaan Mashaariicdda',
        'water-well-project': 'Mashruuca Biyaha',
        'school-construction': 'Dhismada Dugsiga',
        'medical-clinic': 'Cinwaanka Caafimaadka',
        'agricultural-support': 'Caawinta Beeraha',
        'housing-initiative': 'Mashruuca Guriga',
        'east-africa': 'Afrika Bari',
        'south-asia': 'Aasiya Koonfureed',
        'middle-east': 'Bariga Dhexe',
        'latin-america': 'Ameerika Latin',
        'southeast-asia': 'Aasiya Koonfureed Bari',
        'ongoing': 'Socda',
        'completed': 'La Dhammeeyay',
        'planned': 'La Qorsheeyay',
        'communities-served-text': 'Bulshooyinka La Caawiyay',
        'lives-impacted-text': 'Nolosha La Saamayntay',
        'volunteers-text': 'Ragii Caawimada',
        'projects-completed-text': 'Mashruucyada La Dhameystiray',
        'testimonial-1': '"HopeBridge waxay beddelaynay deggeena. Mashruuca biyaha wuxuu beddelay nolosheenna guud ahaan. Carruurtaadu way si fiican u tahay, waxaana waqtii u badan yahay shaqo wanaagsan."',
        'testimonial-2': '"Barnaamijka waxa uu ii siinay fursad aanan lahayn. Gabadhdu hadda waxay tahay dugsiga sare waxayna rajaysaa inay noqdo dhakhtar. Waad ku mahadsan tahay HopeBridge."',
        'testimonial-3': '"Sida caawime, waxaan arkay saamaynta shaqada HopeBridge. Dhiiradda iyo raxmadu waa wax aad u fiican."',
        'maria-santos': 'Maria Santos',
        'village-elder': 'Odaya Degmada, Filibiin',
        'ahmed-hassan': 'Axmed Xasan',
        'parent': 'Waalid, Kenya',
        'sarah-johnson': 'Sara Johnson',
        'news-1': 'Mashruuca Cusub ee Biyaha La Bilowday Degmo Baddan',
        'news-1-text': 'Waan farax nahay inaan ku dhawaaqno bilowga mashruuca biyaha ee ugu dambeeyay oo weli 5,000 oo qof caawin doono.',
        'news-2': 'Barnaamijka Waxbarashada Wuxuu Gaaray Heer: 1,000 Arday',
        'news-2-text': 'Barnaamijkeena waxa uu gaaray heer muhiim ah oo ka badan 1,000 oo carruur ah hadda ay diiwaan geli karaan.',
        'news-3': 'Mahadnaqadda Caawimada: Aqrisa Ragga Aduunka',
        'news-3-text': 'Waanu mahadnaqnaa ragga caawimada aad u wanaagsan oo shaqadayada suurta galinaya.',
        'read-more': 'Wax Dheeraad Ah Akhri',
        'view-all-projects': 'Eeg Dhammaan Mashaariicdda',
        'sustainable-dev': 'Horumar Waara',
        'sustainable-dev-text': 'Horumarinta xalal waara oo muddo-dheer ah oo kobciya bulshada una ilaaliya deegaanka.',
        'women-youth': 'Awood-siinta Haweenka iyo Dhallinyarada',
        'women-youth-text': 'Awood-siinta haweenka iyo dhallinyarada iyada oo loo marayo waxbarasho, tababar xirfadeed, iyo fursado hoggaamineed.',
        'community-dev': 'Horumarinta Bulshada',
        'community-dev-text': 'Dhisidda bulshooyin xoog leh oo adkaysi leh iyada oo la adeegsanayo hindisayaal wadajir ah oo horumarineed.',
        'advocacy': 'U Doodista iyo Xuquuqda Aadanaha',
        'advocacy-text': 'U doodista xuquuqda aadanaha iyo caddaaladda bulshada ee dadka nugul.',
        'climate': 'Isbeddelka Cimilada iyo Ilaalinta Deegaanka',
        'climate-text': 'La tacaalidda caqabadaha cimilada iyo ilaalinta deegaanka jiilalka soo socda.',
        'capacity': 'Dhisidda Awoodda iyo Waxbarashada',
        'capacity-text': 'Kobcinta aqoonta iyo xirfadaha iyada oo loo marayo barnaamijyo waxbarasho iyo dhisidda awood.',
        'resilience': 'Adkaysiga iyo Dakhliga Nolosha',
        'resilience-text': 'Dhisidda adkaysi dhaqaale iyo ilo-dakhli waara oo bulshooyinka loogu talagalay.',
        'security': 'Wacyigelinta Amniga iyo Maaraynta Khatarta',
        'security-text': 'Kor u qaadista wacyigelinta amniga iyo hababka waxtarka leh ee maaraynta khatarta.',
        'education-all': 'Waxbarasho Qof Walba',
        'education-all-text': 'Bixinta waxbarasho tayo leh iyo agabka waxbarashada ee carruurta ku nool bulshooyinka la dayacay.',
        'healthcare-access': 'Helitaanka Daryeel Caafimaad',
        'healthcare-access-text': 'Gaarsiinta adeegyada caafimaadka aasaasiga ah iyo agabka caafimaadka meelaha fogfog.',
        'women-empower': 'Awood-siinta Haweenka',
        'women-empower-text': 'Taageerista haweenka iyada oo loo marayo tababar xirfadeed, maalgelin yar-yar, iyo barnaamijyo hoggaamineed.',
        'child-protection': 'Ilaalinta Carruurta',
        'child-protection-text': 'Waad hubineysaa nolosha iyo wanaagsana carruurta iyadoo la adeegsado barnaamijyada ilaalinta iyo dhiirigelinta.',
        'livelihood-support': 'Taageerada Dakhliga Nolosha',
        'livelihood-support-text': 'Abuurista fursado dhaqaale iyada oo loo marayo tababar xirfadeed iyo taageerada ganacsiyada yaryar.',
        'community-dev-program': 'Horumarinta Bulshada',
        'community-dev-program-text': 'Dhisidda bulshooyin xoog leh oo adkaysi leh iyada oo la adeegsanayo hindisayaal wadajir ah iyo mashaariic kaabayaal ah.',
        'climate-change-program': 'Isbeddelka Cimilada',
        'climate-change-program-text': 'La tacaalidda caqabadaha cimilada iyada oo la ilaaliyo deegaanka, isticmaalka habab waara, iyo dhisidda adkaysiga bulshada.',
        'climate-subtitle': 'La Tacaalidda Caqabadaha Cimilada Jiilalka Soo Socda',
        'climate-desc': 'Barnaamijka Isbeddelka Cimilada ee MASaD wuxuu diir saaraya la tacaalidda caqabadaha cimilada iyada oo la ilaaliyo deegaanka, isticmaalka habab waara, iyo dhisidda adkaysiga bulshada. Waxaan la shaqeeynaa bulshooyinka deegaanka si aan hirgelino xeerarka ilaalinta deegaanka iyo dhisinta adkaysiga saamaynta cimilada.',
        'climate-approach-text': 'Waanu dhexeynay barnaamijyo isbeddel cimiladeed oo dhamaystiran:',
        'climate-1': 'Barnaamijyada ilaalinta deegaanka iyo dabacsanaanta',
        'climate-2': 'Beeraha wanaagsan iyo hababka beerta',
        'climate-3': 'Maamulka iyo ilaalinta biyaha',
        'climate-4': 'Kor u qaadinta tamarta cusub iyo isticmaalka',
        'climate-5': 'Wacyigelinta bulshada iyo waxbarashada arrimaha cimilada',
        'climate-6': 'Yareynta khatarta dhacdooyin iyo diyaaradda',
        'climate-impact-text': 'Dadkayada isbeddelka cimilada waxay saamayn ku yeelatay:',
        'climate-impact-1': 'Laday 130+ geed oo ku yaala bulshooyinka',
        'climate-impact-3': 'Tababnay 40+ xubnaha bulshada ee hababka wanaagsan',
        'support-climate': 'Caaw Ficilka Cimilada',
        'security-program': 'Wacyigelinta Amniga iyo Maaraynta Khatarta',
        'security-program-text': 'Kor u qaadista wacyigelinta amniga iyo hababka waxtarka leh ee maaraynta khatarta si loo ilaaliyo bulshooyinka.',
        'security-subtitle': 'Dhisidda Bulshooyin Nabad ah oo Adkaysi leh',
        'security-desc': 'Barnaamijka Wacyigelinta Amniga iyo Maaraynta Khatarta ee MASaD wuxuu diir saaraya kor u qaadinta wacyigelinta amniga iyo hirgelinta habab waxtarka leh ee maaraynta khatarta si loo ilaaliyo bulshooyinka. Waxaan la shaqeeynaa bulshooyinka deegaanka si aan ogaano khatarta amniga una abuurno istaraatiijyo dhamaystiran oo lagu xoojiyo nabadgurashada iyo adkaysiga.',
        'security-approach-text': 'Waanu dhexeynay barnaamijyo wacyigelin oo dhamaystiran:',
        'security-1': 'Tababarka wacyigelinta amniga iyo barnaamijyada waxbarashada',
        'security-2': 'Qiimeynta khatarta iyo falanqaynta daahirnimada',
        'security-3': 'Qorshaha amniga ee ku salaysan bulshada',
        'security-4': 'Nidaamka digninta hore iyo diyaaradda degdegga ah',
        'security-5': 'Ka hortagga dagaallada iyo barnaamijyada nabadda',
        'security-6': 'Ilaalinta dadka daallada ah',
        'security-impact-text': 'Dadkayada wacyigelinta amniga waxay xoojiyeen nabadgurashada bulshada:',
        'security-impact-1': 'Tababnay 20+ xubnaha bulshada ee wacyigelinta amniga',
        'security-impact-4': 'Ilaalnay 70+ qof oo daallan ah iyada oo la adeegsanayo barnaamijyo gaar ah',
        'support-security': 'Caaw Mashruucyada Amniga',
        'learn-more': 'Wax Dheeraad Ah Akhri',
        'mission-text': 'Inaan bixino gargaar bani\'aadannimo iyo barnaamijyo horumar waara oo awood u siiya bulshooyinka inay ka gudbaan caqabadaha una dhistaan mustaqbal ka roon.',
        'vision-text': 'Adduun uu qof kasta ku helo baahiyaha aasaasiga ah, fursado kobac, iyo rajo mustaqbal ka wanaagsan.',
        'mission-text-full': 'Inaan doono oo awood u siiyo haweenka, dhallinyarada, bulshooyinka daallada ah iyo qowmiyadaha yar-yar iyada oo la adeegsanayo waxbarasho, horumar waara, xuquuqda aadanaha, iyo barnaamijyo ilaalineed oo bulshooyinka dhamaystiran. MASaD waxay kor u qaadataan helitaanka siman ee waxbarashada, daryeelka caafimaadka, caddaaladda, iyo fursadaha dhaqaalaha iyada oo la dagaallamo kala-guurka, ka-ortirnimada, iyo dhamaan noocyaha cadaaladda bulshada, si qof kasta uga qayb galaan horumarka bulshadiisii.',
        'vision-text-full': 'Inaan abuurno bulsho caddaan ah oo siman halkii haween kasta iyo qof daallan ah ay heli karaan fursad kobac, awood u yeeshaan xuquuqahooda, taageerayaan habab waara, iyo si firfircoon uga qayb galaan abuurista bulshadooda iyo mustaqbalkooda.',
        'who-we-are-text': 'Mubarak Association for Sustainable Development (MASaD) waa urur aan faa\'iido doonin oo ah dowlad-goboleed oo la aasaasay Baidoa, koonfur-galbeed Soomaaliya, Oktoobar 17, 2020 kuna dhex yahay horumarka horumarka waara iyo dhisidda bulshooyin adkaysi leh gobolka Koonfur-Galbeed Soomaaliya iyo inta kale.',
        'hero-subtitle': 'Mubarak Association for Sustainable and Development (MASaD) waa urur aan faa\'iido doonin oo dhex yahay dhisidda bulshooyin adkaysi leh ee horumar waara. Waxaan la shaqeynaa bulshooyinka si aan u awood-siiyo iyaga iyada oo la adeegsanayo barnaamijyo horumar waara, dood, iyo gargaar bani\'aadannimo Soomaaliya iyo inta kale.',
        'advocacy-program': 'U Doodis',
        'advocacy-program-text': 'U doodista xuquuqda aadanaha iyo caddaaladda bulshada ee dadka nugul iyada oo loo marayo isbeddelka siyaasadda iyo ka qaybgalka bulshada.',
        'our-approach': 'Nashqadayada',
        'impact': 'Saamaynta',
        'advocacy-subtitle': 'Dhiirigelinta Codaha Xuquuqda Aadanaha iyo Caddaalda Bulshada',
        'advocacy-desc': 'Barnaamijka Dhiirigelinta ee MASaD waa ka dhexeya dhiirigelinta xuquuqda aadanaha, caddaalda bulshada, iyo beddelka siyaasadda ee dadka daallada ah. Waxaan la shaqeeynaa bulshooyinka, dowladda, iyo ururada caalamiga si aan u abuurno isbeddel nabad ah.',
        'advocacy-approach-text': 'Waanu dhexeynay barnaamijyo dhiirigelin oo dhamaystiran:',
        'advocacy-1': 'Dhiirigelinta xuquuqda aadanaha',
        'advocacy-2': 'Beddelka siyaasadda iyo dhiirigelinta sharciyada',
        'advocacy-3': 'Mobilizaynta bulshada iyo wada-shaqada',
        'advocacy-4': 'Wada-shaqo ururada gudaha iyo caalamiga',
        'advocacy-5': 'Caawinta sharci iyo adeegyo',
        'advocacy-6': 'Dhiirigelinta warbaahinta iyo dadweynaha',
        'advocacy-impact-text': 'Dhiirigelintayada waxay keenay beddel dhab ah:',
        'advocacy-impact-1': 'Influenced 10+ policy changes',
        'advocacy-impact-2': 'Dhaqaajinnay 550+ xubnood oo bulshada ka mid ah',
        'advocacy-impact-3': 'Aasaasnay 1 iskaashi istaraatiiji ah, mid kalena waa socdaa',
        'advocacy-impact-4': 'Provided legal aid to 1,500+ cases',
        'support-advocacy': 'Caaw Dhiirigelinta',
        'back-programs': 'Ku Noqo Barnaamijyadda',
        'community-dev-subtitle': 'Dhismayaal Bulshooyin Adag oo Dheeraad Ah',
        'community-dev-desc': 'Barnaamijka Horumarinta Bulshada ee MASaD wuxuu diir saaran yahay dhismayaal bulshooyin adag oo dheeraad ah iyadoo la wada shaqeeyo barnaamijyada horumarinta. Waxaan la shaqeeynaa bulshooyinka gudaha si aan u ogaano baahinta iyo hirgelinta xeerarka degdegga ah oo nolosha wanaagsan.',
        'community-dev-approach-text': 'Waanu dhexeynay barnaamijyo horumarinta bulshada oo dhamaystiran:',
        'community-dev-1': 'Horumarinta iyo wanaagsinta dhismaha',
        'community-dev-2': 'Dhismaha awoodda bulshada iyo tababarka',
        'community-dev-3': 'Maamulka gudaha iyo caawinta hogaaminta',
        'community-dev-4': 'Horumarinta dhaqaale iyo abuurista shaqooyin',
        'community-dev-5': 'Bulshada wada-shaqada iyo barnaamijyada nabadda',
        'community-dev-6': 'Caafimaadka dadweynaha iyo mashruucyada nadiifada',
        'community-dev-impact-text': 'Horumarinta bulshadayada waxay beddelay nolosha:',
        'community-dev-impact-1': 'Built 50+ community facilities',
        'community-dev-impact-2': 'Hagaajinnay kaabayaasha 10+ tuulo',
        'community-dev-impact-3': 'Tababarnay 100+ xubnood oo bulshada ka mid ah',
        'community-dev-impact-4': 'Abuurnay 50+ shaqo oo maxalli ah',
        'support-communities': 'Taageer Bulshooyinka'
,
        // Detail pages, forms, footer, mission/vision
        'education-1': 'Awood-siinta Bulshada Iyadoo Loo Marayo Aqoon',
        'education-2': 'Annaga oo ah MASaD, waxaan rumaysan nahay in waxbarashadu tahay aasaaska horumarka waara. Barnaamijkeena Waxbarasho Qof Walba wuxuu bartilmaameedsadaa in caruurta iyo dhalinyarada bulshooyinka la dayacay lagu siiyo waxbarasho tayo leh, si ay u yeeshaan aqoonta iyo xirfadaha lagama maaarmaanka u ah dhismaha mustaqbal ifaya.',
        'education-3': 'Waxaan si dhow ula shaqeynaa bulshooyinka deegaanka si aan u dhisno oo u taageerno machadyada waxbarashada, u bixino agabka waxbarashada, una tababarno macallimiinta. Habkeenu wuxuu xooggaa saaraa:',
        'education-4': 'Dhisidda iyo dayactirka dugsiyada meelaha fog',
        'education-5': 'Bixinta buugaagta, dharka dugsiga iyo agabka waxbarashada',
        'education-6': 'Tababarka macallimiinta iyo shaqaalaha waxbarashada',
        'education-7': 'Bixinta deeqaha waxbarasho ee ardayda istaahila',
        'education-8': 'Horumarinta barnaamijyada waxbarashada dadka waaweyn',
        'education-9': 'Abuurista jawi waxbarasho oo ammaan ah oo gabdhaha loogu talagalay',
        'education-10': 'Tan iyo bilowgii barnaamijkeena waxbarashada, waxaan sameynay:',
        'education-11': 'Built 15 schools in rural communities',
        'education-12': 'Diiwaangelinnay in ka badan 50 arday.',
        'education-13': 'Trained 20+ teachers',
        'education-14': 'Distributed 650+ textbooks and learning materials',
        'education-15': 'Taageer Waxbarashada',
        'education-16': '© 2024 Ururka Mubarak ee Horumarka Waara (MASaD). Xuquuqda oo dhan way dhowran tahay.',
        'healthcare-1': 'Gaarsiinta Adeegyada Caafimaadka Bulshooyinka Fogfog',
        'healthcare-2': 'Helitaanka daryeel caafimaad oo tayo leh waa xaq aasaasi ah oo aadanaha. Barnaamijka Helitaanka Caafimaadka ee MASaD wuxuu ka shaqeeyaa gaarsiinta adeegyada caafimaadka ee aasaasiga ah bulshooyinka fogfog iyo kuwa la dayacay, si aan qofna loo dhaafin.',
        'healthcare-3': 'Waxaan iskaashi la leenahay hay\'adaha caafimaadka deegaanka iyo ururada caalamiga ah si aan u bixino adeegyo caafimaad oo dhamaystiran:',
        'healthcare-4': 'Rugaha caafimaadka ee dhaqdhaqaaqa ah ee meelaha fog',
        'healthcare-5': 'Adeegyada caafimaadka hooyada iyo ilmaha',
        'healthcare-6': 'Ololeyaasha tallaalka',
        'healthcare-7': 'Barnaamijyada waxbarashada iyo wacyigelinta caafimaadka',
        'healthcare-8': 'Qaybinta daawooyinka aasaasiga ah',
        'healthcare-9': 'Tababarka shaqaalaha caafimaadka bulshada',
        'healthcare-10': 'Hindisayaasheena caafimaadku waxay horumar weyn ku sameeyeen caafimaadka bulshada:',
        'healthcare-11': 'Established 10 mobile health clinics',
        'healthcare-12': 'Tallaalnay 70+ carruur ah',
        'healthcare-13': 'Tababarnay 53 shaqaale caafimaad oo bulshada ka tirsan',
        'healthcare-14': 'Qaybinnay 50+ agab caafimaad',
        'healthcare-15': 'Taageer Caafimaadka',
        'women-empowerment-1': 'Awood-siinta Haweenka si ay u Beddelaan Bulshooyinka',
        'women-empowerment-2': 'Marka haweenka awood la siiyo, bulshada oo dhan way horumartaa. Barnaamijka Awood-siinta Haweenka ee MASaD wuxuu xooggaa saaraa siinta haweenka xirfadaha, agabka iyo fursadaha ay u baahan yihiin si ay u noqdaan hoggaamiyeyaal iyo wakiillo isbeddel ah bulshooyinkooda.',
        'women-empowerment-3': 'Waxaan fulinnaa barnaamijyo dhamaystiran oo taageera awood-siinta dhaqaale iyo bulsho ee haweenka:',
        'women-empowerment-4': 'Tababarka xirfadaha iyo barnaamijyada xirfadeed',
        'women-empowerment-5': 'Maalgelinta yar-yar iyo taageerada ganacsiyada yar-yar',
        'women-empowerment-6': 'Aqoon-isweydaarsiyo hoggaamineed iyo dhismaha awoodda',
        'women-empowerment-7': 'U doodista xuquuqda haweenka iyo wacyigelinta',
        'women-empowerment-8': 'Tilmaamid iyo fursado isku xirka xirfadeed',
        'women-empowerment-9': 'Taageerada haweenka ganacsatada ah',
        'women-empowerment-10': 'Hindisayaasheena awood-siinta haweenku waxay keeneen isbeddel waara:',
        'women-empowerment-11': 'Tababarnay 40+ naago xirfado farsamo',
        'women-empowerment-12': 'Taageernay 40+ ganacsi oo ay leeyihiin haween',
        'women-empowerment-13': 'Provided microloans to 800+ women',
        'women-empowerment-14': 'Established 25 women support groups',
        'women-empowerment-15': 'Taageer Haweenka',
        'livelihood-1': 'Dhismaha Madaxbannaanida Dhaqaale',
        'livelihood-2': 'Awood-siinta dhaqaaluhu waa furaha jebinta wareegga saboolnimada. Barnaamijka Taageerada Nolol-maalmeedka ee MASaD wuxuu abuuraa fursado dhaqaale oo waara oo shakhsiyaad iyo qoysas ah isagoo adeegsanaya tababarka xirfadaha, taageerada ganacsiyada yar-yar, iyo hindisayaasha ka qaybgalka maaliyadeed.',
        'livelihood-3': 'Waxaan bixinnaa taageero dhamaystiran si aan ugu caawino bulshooyinka inay gaaraan madaxbannaani dhaqaale:',
        'livelihood-4': 'Barnaamijyada tababarka xirfadaha iyo farsamada',
        'livelihood-5': 'Deeqaha iyo amaahda bilaabista ganacsiyada yar-yar',
        'livelihood-6': 'Taageerada beeraha iyo agabka beeraha',
        'livelihood-7': 'Aqoonta maaliyadeed iyo kooxaha kaydka',
        'livelihood-8': 'Helitaanka suuqa iyo horumarinta ganacsiga',
        'livelihood-9': 'Samaynta iyo taageerada ururada iskaashiga',
        'livelihood-10': 'Barnaamijyadayada nolol-maalmeedku waxay beddeleen nolosha dad aan tiro lahayn:',
        'livelihood-11': 'Trained 4,000+ people in vocational skills',
        'livelihood-12': 'Supported 80+ small businesses',
        'livelihood-13': 'Tababarnay in ka badan 10 iskaashato beereed oo yaryar.',
        'livelihood-14': 'Established 30 savings groups',
        'livelihood-15': 'Taageer Nolol-maalmeedka',
        'news1-1': 'Oktoobar',
        'news1-2': 'Waxaa qoray kooxda MASaD | Horumarinta Bulshada',
        'news1-3': 'Waxaan farxad ku shaaciyaynaa bilowga mashruucayada ugu dambeeya ee ceelka biyaha ee bulsho miyi ah oo sanado badan la tacaalaysay yaraanta biyaha. Hindisahani waa qayb ka mid ah ballanqaadkeena joogtada ah ee bixinta biyo cabbitaan nadiif ah oo badbaado leh bulshooyinka u baahan.',
        'news1-4': 'Caqabadda',
        'news1-5': 'Sanado badan, dadka deggan bulshadan waxay ku qasbanaayeen inay maalin kasta socdaan dhowr kiilomitir si ay biyo uga helaan ilo wasakhaysan. Tani kama aysan qaadan oo keliya waqti qiimo leh oo loogu isticmaali karay hawlo wax soo saar leh, laakiin waxay sidoo kale keentay khataro caafimaad oo halis ah, gaar ahaan carruurta iyo odayaasha.',
        'news1-6': 'Xalkeenna',
        'news1-7': 'MASaD, iyadoo iskaashi la leh maamulada deegaanka iyo deeq-bixiyeyaasha caalamiga ah, waxay dhistay ceel biyo casri ah oo lagu qalabeeyey nidaam biyo-qaad ah oo ku shaqeeya tamarta qorraxda. Ceelku waxaa loo qaabeeyey inuu u adeego in ka badan 5,000 qof ee aagga hareeraha ah, isagoo bixinaya biyo nadiif ah oo la cabbo, lagu kariyo, lagana isticmaalo nadaafadda.',
        'news1-8': 'Saamaynta Bulshada',
        'news1-9': 'Saamayntu mashruucan way ka weyn tahay bixinta biyaha oo keliya. Marka la helo biyo nadiif ah si fudud:',
        'news1-10': 'Cudurrada biyaha ka soo gala si weyn ayay hoos ugu dheceen',
        'news1-11': 'Carruurtu waxay waqti dheer ku qaataan dugsiga halkii ay biyo ka keeni lahaayeen',
        'news1-12': 'Haweenku waxay haystaan waqti badan oo ay ku sameeyaan hawlo dakhli keena',
        'news1-13': 'Caafimaadka guud ee bulshada iyo nadaafaddu way fiicnaadeen',
        'news1-14': 'Hore u Fiirsashada',
        'news1-15': 'Mashruucan ceelka biyuhu waa mid ka mid ah hindisayaal badan oo MASaD u qorsheysay gobolka. Waxaan ka go\'an nahay balaadhinta barnaamijyadayada helitaanka biyaha si aan u gaarno bulshooyin badan oo aan ku xaqiijino in biyaha nadiifka ahi noqdaan xaq, ee aanay noqon mudnaan.',
        'news1-16': 'Ma rabtaa inaad taageerto mashaariicdayada biyaha?',
        'news1-17': 'Ku laabo Wararka',
        'news2-1': 'Waxaa qoray kooxda MASaD | Waxbarasho',
        'news2-2': 'Waxaan ku faraxsanahay inaan shaacino in barnaamijkeena Waxbarasho Qof Walba uu gaaray heer muhiim ah, iyadoo in ka badan 1,000 oo caruur ah ay hadda ku diiwaangashan yihiin waxbarashada rasmiga ah iyada oo loo marayo dugsiyada aan taageerno. Guushani waxay ka dhigan tahay sanado dadaal iyo hawlkarnimo ah oo ay sameeyeen kooxdeenna, shuraakadeenna, iyo bulshooyinka aan u adeegno.',
        'news2-3': 'Safarka',
        'news2-4': 'Markii MASaD bilowday hindisaha waxbarashada, caruur badan oo ka tirsan bulshooyinka aan u adeegno ma heli jirin waxbarasho rasmi ah. Dugsiyadu ama ma jirin ama aad bay u fogaayeen, qoysaskuna ma awoodi jirin kharashaadka la xiriira. Waxaan go\'aansanay inaan beddelno xaqiiqadan.',
        'news2-5': 'Habkeenna dhamaystiran wuxuu ka kooban yahay:',
        'news2-6': 'Dhisidda iyo dayactirka kaabayaasha dugsiyada',
        'news2-7': 'Bixinta buugaagta iyo agabka waxbarashada',
        'news2-8': 'Tababarka iyo taageerada macallimiinta',
        'news2-9': 'Bixinta deeqo waxbarasho qoysaska baahan',
        'news2-10': 'Abuurista jawi waxbarasho oo ammaan ah, gaar ahaan gabdhaha',
        'news2-11': 'Sheekooyinka Saamaynta',
        'news2-12': 'Saamaynta guushan waxaa ugu fiican in laga sheego sheekooyinka carruurta noloshoodu isbeddeshay. Carruur hore u lahayn rajo ay dugsi ku tagi karaan hadda waxay baranayaan akhriska, qorista, waxayna ku riyoonayaan mustaqbal ifaya. Waalidiin ku dadaali jiray inay carruurtooda wax barsiiyaan hadda waxay arkaan rajo iyo suurtagalnimo.',
        'news2-13': 'Hore u Eegis',
        'news2-14': 'In kasta oo gaarista 1,000 arday ay tahay guul weyn, shaqadeenna weli ma dhamaan. Waxaan higsanaynaa inaan labanlaabno tiradan sannadaha soo socda oo aan balaarino barnaamijyadayada waxbarashada si aan u gaarno bulshooyin kale. Ilmo kasta wuxuu mudan yahay waxbarasho tayo leh, waxaana ka go\'an nahay inaan ka dhigno xaqiiqo.',
        'news2-15': 'Naga caawi inaan wax barno carruur dheeraad ah?',
        'news3-1': 'Waxaa qoray kooxda MASaD | Bulshada',
        'news3-2': 'Maanta, waxaan waqti ku qaadanaynaa inaan sharfno oo aan u dabaal-dagno mutadawiciinta cajiibka ah ee shaqadeenna suurtageliya. Shakhsiyaadkan u heellan waxay bixiyaan waqtigooda, tamartooda iyo qalbigooda si ay ugu adeegaan bulshooyinka u baahan, tabarucaadkooduna wuxuu qiimo aan la qiyaasi karin u leeyahay hadafka MASaD.',
        'news3-3': 'Awoodda Mutadawaciyaadka',
        'news3-4': 'Mutadawiciintu waa laf-dhabarta ururkeena. Laga bilaabo macallimiinta dugsiyadeena ilaa shaqaalaha caafimaadka rugaheenna, laga bilaabo kooxaha bulshada isu xiraya ilaa taageerada maamulka, mutadawac kasta wuxuu door muhiim ah ka ciyaaraa guusheena. Daacadnimadooda iyo xamaasadooda ayaa maalin kasta ina dhiirrigeliya.',
        'news3-5': 'Sheekooyinka Mutadawiciinta',
        'news3-6': 'Mutadawiciinteenu waxay ka yimaadaan asal kala duwan laakiin waxay wadaagaan hal hadaf: inay isbeddel keenaan. Qaarkood waa dadka bulshada deegaanka oo gargaar siinaya deriskooda, kuwa kalena waxay ka safraan dalalka caalamka si ay u soo bixiyaan xirfadahooda iyo khibraddooda. Mid kastaa wuxuu keenaa hibooyin iyo aragtiyo gaar ah oo kobciya barnaamijyadayada.',
        'news3-7': 'Saamaynta Shaqadooda',
        'news3-8': 'Saamayntii mutadawiciinteenu waa mid la cabbiri karo oo qoto dheer:',
        'news3-9': 'In ka badan 500 mutadawac ayaa la shaqeeyay MASaD sannadkan',
        'news3-10': 'Mutadawiciintu waxay bixiyeen in ka badan 20,000 saacadood oo adeeg ah',
        'news3-11': 'Barnaamijyada ay mutadawiciintu taageeraan waxay gaaraan in ka badan 10,000 oo macmiil',
        'news3-12': 'Hindisayaasha ay hoggaamiyaan mutadawiciintu waxay balaarreeyeen gaarista bulshooyin cusub',
        'news3-13': 'Ku soo biir Qoyskeena Mutadawiciinta',
        'news3-14': 'Haddii ay kugu dhiirrigeliyaan sheekooyinka mutadawiciinteena oo aad rabto inaad isbeddel keento, waan ku soo dhaweynaynaa inaad ku soo biirto qoyskeena mutadawiciinta. Haddii aad bixin karto dhowr saacadood usbuucii ama aad u hurto dhowr bilood, meel ayaa kuu taal hadafkeenna dhismaha bulshooyin adkeysi leh.',
        'news3-15': 'Ma rabtaa inaad nala mutadawacdo?',
        'news3-16': 'Noqo Mutadawac',
        'donate-1': '$25 waxay siisaa qoys biyo nadiif ah',
        'donate-2': '$50 waxay taageertaa waxbarashada ilmo',
        'donate-3': '$100 waxay bixisaa agab caafimaad',
        'donate-4': '$250 waxay caawisaa dhismaha hoy',
        'copyright': '© 2026 Ururka Mubarak ee Horumarka Waara (MASaD). Xuquuqda oo dhan way dhowran tahay.',
        'baidoa-somalia': 'Baydhabo, Soomaaliya',
        'follow-us': 'Nala Soo Raac',
        'families-served': 'Qoysas La Caawiyay',
        'partnership-title': 'Iskaashigeenna',
        'partnership-sub': 'Howlgalka Gargaarka Ku-meel-gaarka ah ee Qaramada Midoobay ee Soomaaliya',
        'partnership-text': 'Waxaan ku faraxsanahay inaan iskaashi la leenahay UNTMIS, annagoo wada shaqeynayna taageerista bulshooyinka Dowlad Goboleedka Koonfur Galbeed ee Soomaaliya.',
        'ph-name': 'Geli magacaaga oo dhan',
        'ph-email': 'Geli iimaylkaaga',
        'ph-phone': 'Geli lambarka taleefankaaga',
        'form-sending': 'Waa la dirayaa...',
        'form-success': 'Mahadsanid! Fariintaada waa la helay. Dhawaan ayaan kula soo xiriiri doonaa.',
        'form-error': 'Waan ka xunnahay, wax khalad ah ayaa dhacay. Fadlan mar kale isku day ama si toos ah iimayl noogu soo dir.',
        'donate-form-title': 'Foomka Deeqda',
        'donate-message': 'Sidee baad u dooneysaa inaad nooga deeqdo ama noo taageerto?',
        'ph-donate-message': 'Noo sheeg sida aad jeceshahay inaad ku caawiso',
        'send-donation': 'Dir Codsiga Deeqda',
        'prefill-volunteer': 'Waxaan jeclaan lahaa inaan MASaD la mutadawaco.',
        'prefill-partner': 'Waxaan jeclaan lahaa inaan iskaashi la yeesho MASaD.',
        'back-home': 'Ku Noqo Bogga Hore',
        'mission-sub': 'Awood-siinta bulshooyinka si ay uga gudbaan caqabadaha una dhistaan mustaqbal ifaya',
        'mission-p2': 'MASaD waa urur aan faa\'iido doon ahayn oo xarunteedu tahay Baydhabo, Soomaaliya. Waxaan garab-garab ula shaqeynaa bulshooyinka deegaanka, maamulada iyo shuraakada, oo ay ka mid tahay UNTMIS, si aan u gaarsiino gargaar bani\'aadantinimo iyo barnaamijyo horumar waara oo soconaya.',
        'mission-h2': 'Waxa Na Kicin',
        'mission-1': 'Bixinta gargaar bani\'aadantinimo dadka u baahan',
        'mission-2': 'Fulinta barnaamijyo horumar waara oo waxbarasho, caafimaad iyo nolol-maalmeed ah',
        'mission-3': 'Awood-siinta haweenka, dhalinyarada iyo kooxaha nugul',
        'mission-4': 'Xoojinta adkeysiga bulshada iyo isku-filnaanshaha',
        'mission-5': 'Dhismaha shuraako la leh maamulada deegaanka iyo ururada caalamiga ah',
        'mission-h2b': 'Ballanqaadkeena',
        'mission-p3': 'Waxaan ka go\'an nahay inaan si hufnaan iyo xushmad leh ula shaqeyno bulsho kasta oo aan u adeegno, si dadku uga gudbaan caqabadaha una dhistaan mustaqbal ifaya naftooda iyo carruurtooda.',
        'vision-sub': 'Adduun fursado iyo rajo ah',
        'vision-p2': 'Waxaan maanka ku haynaa bulshooyin ku yaal Soomaaliya iyo meelo kale oo qoysaska ku nool yihiin sharaf, carruurtu ku barato oo ku koraan ammaan, dadkuna awoodaan inay qaabeeyaan mustaqbalkooda.',
        'vision-h2': 'Waxa Aan Ku Riyoonno',
        'vision-1': 'Qof kasta oo heli kara baahiyaha aasaasiga ah',
        'vision-2': 'Fursado dhab ah oo waxbarasho, shaqo iyo kobac ah',
        'vision-3': 'Haween, dhalinyaro iyo carruur gaari kara awooddooda buuxda',
        'vision-4': 'Bulshooyin adkeysi leh oo nabad ah',
        'vision-5': 'Rajada berri ka wanaagsan',
        'vision-h2b': 'Si wadajir ah ayaan ugu shaqeynaa',
        'vision-p3': 'Aragtideennu waxay hagtaa barnaamij kasta oo aan fuliyo. Annagoo kaashanayna shuraakadeenna iyo bulshooyinka aan u adeegno, maalin kasta waxaan qaadnaa tillaabooyin wax ku ool ah oo ku aaddan mustaqbal rajo leh.'
    },
    ar: {
        'home': 'الرئيسية',
        'somalia-loc': 'الصومال',
        'show-fewer': 'عرض أقل',
        'wa-message': 'مرحباً MASaD، أود معرفة المزيد عن عملكم.',
        'wa-label': 'تحدث معنا عبر واتساب',
        'about-us': 'من نحن',
        'our-programs': 'برامجنا',
        'our-projects': 'مشاريعنا',
        'our-impact': 'تأثيرنا',
        'news-updates': 'الأخبار والتحديثات',
        'get-involved': 'شارك معنا',
        'contact': 'اتصل بنا',
        'donate-now': 'تبرع الآن',
        'quick-links': 'روابط سريعة',
        'contact-info': 'معلومات الاتصال',
        'newsletter': 'النشرة الإخبارية',
        'newsletter-text': 'اشترك في النشرة الإخبارية للحصول على التحديثات.',
        'footer-slogan': 'بناء مجتمعات مرنة للتنمية المستدامة.',
        'email-placeholder': 'بريدك الإلكتروني',
        'hero-title': 'Mubarak Association for Sustainable and Development (MASaD)',
        'hero-subtitle': 'هي منظمة غير ربحية مكرسة لبناء مجتمعات مرنة للتنمية المستدامة. نعمل لتمكين المجتمعات من خلال برامج التنمية المستدامة والدفاع والمساعدة الإنسانية في الصومال وما وراءها.',
        'explore-work': 'استكشف عملنا',
        'focus-areas': 'مناطق تركيزنا',
        'focus-subtitle': 'نحن ملتزمون بتحقيق تأثير مستدام من خلال مناطق التركيز الرئيسية لدينا.',
        'who-we-are': 'من نحن',
        'who-we-are-text': 'جمعية مبارك للتنمية المستدامة (MASaD) هي منظمة غير ربحية مكرسة لبناء مجتمعات مرنة للتنمية المستدامة.',
        'our-mission': 'مهمتنا',
        'our-vision': 'رؤيتنا',
        'empowering': 'تمكين المجتمعات',
        'empowering-subtitle': 'برامجنا مصممة لخلق تأثير مستدام وتمكين المجتمعات لبناء مستقبل مستقل.',
        'view-all-programs': 'عرض جميع البرامج',
        'turning-support': 'تحويل الدعم إلى تأثير حقيقي',
        'turning-subtitle': 'مشاريعنا تحدث فرقاً ملموساً في المجتمعات في المناطق التي نخدمها.',
        'real-people': 'أناس حقيقيون، تغيير حقيقي',
        'real-subtitle': 'الأرقام تحكي قصة تأثيرنا الجماعي والحياة التي حولناها معاً.',
        'communities-served': 'المجتمعات المخدمة',
        'lives-impacted': 'الحياة المتأثرة',
        'volunteers': 'المتطوعون',
        'projects-completed': 'المشاريع المكتملة',
        'testimonials': 'ماذا يقول الناس',
        'testimonials-subtitle': 'استمع من المجتمعات والأفراد الذين غيرت حياتهم عملنا.',
        'latest-news': 'أحدث الأخبار والقصص',
        'latest-news-subtitle': 'ابق على اطلاع بأحدث مبادراتنا وقصص النجاح والأخبار من الميدان.',
        'view-all-news': 'عرض جميع الأخبار',
        'be-part': 'كن جزءاً من التغيير',
        'be-part-subtitle': 'دعمك يمكن أن يغير الحياة. انضم إلينا اليوم لإحداث فرق من خلال التبرع أو التطوع أو الشراكة.',
        'volunteer': 'تطوع',
        'partner': 'كن شريكاً',
        'get-in-touch': 'تواصل معنا',
        'get-in-touch-subtitle': 'لديك أسئلة أو تريد معرفة المزيد عن عملنا؟ نود سماعك.',
        'location': 'الموقع',
        'phone': 'الهاتف',
        'email-label': 'البريد الإلكتروني',
        'send-message': 'أرسل لنا رسالة',
        'full-name': 'الاسم الكامل',
        'email-address': 'عنوان البريد الإلكتروني',
        'phone-number': 'رقم الهاتف',
        'message': 'الرسالة',
        'your-message': 'رسالتك',
        'send-msg': 'إرسال الرسالة',
        'make-donation': 'قدم تبرعاً',
        'donation-subtitle': 'دعمك يساعدنا في بناء مجتمعات مرنة للتنمية المستدامة. كل مساهمة تحدث فرقاً في حياة من نخدمهم.',
        'ready-donate': 'جاهز للتبرع؟',
        'ready-donate-text': 'اتصل بنا لمناقشة تبرعك أو معرفة المزيد عن كيفية دعم مهمتنا.',
        'contact-us': 'اتصل بنا',
        'view-all-projects': 'عرض جميع المشاريع',
        'water-well-project': 'مشروع بئر المياه',
        'school-construction': 'بناء المدرسة',
        'medical-clinic': 'العيادة الطبية',
        'agricultural-support': 'الدعم الزراعي',
        'housing-initiative': 'مبادرة الإسكان',
        'east-africa': 'شرق إفريقيا',
        'south-asia': 'جنوب آسيا',
        'middle-east': 'الشرق الأوسط',
        'latin-america': 'أمريكا اللاتينية',
        'southeast-asia': 'جنوب شرق آسيا',
        'ongoing': 'جاري',
        'completed': 'مكتمل',
        'planned': 'مخطط',
        'communities-served-text': 'المجتمعات المخدمة',
        'lives-impacted-text': 'الحياة المتأثرة',
        'volunteers-text': 'المتطوعون',
        'projects-completed-text': 'المشاريع المكتملة',
        'testimonial-1': '"غيّر HopeBridge قريتنا. مشروع المياه النظيفة غيّر حياتنا تماماً. أطفالنا أصبحوا أكثر صحة، ولدينا المزيد من الوقت للعمل المنتج."',
        'testimonial-2': '"منح برنامج التعليم ابنتي فرصاً لم أكن أملكها. هي الآن في المدرسة الثانوية وتحلم بأن تصبح طبيبة. شكراً لك، HopeBridge."',
        'testimonial-3': '"بصفتي متطوعاً، رأيت بنفسي تأثير عمل HopeBridge. التفاني والرحمة في الفريق ملهمان حقاً."',
        'maria-santos': 'ماريا سانتوس',
        'village-elder': 'عجوز القرية، الفلبين',
        'ahmed-hassan': 'أحمد حسن',
        'parent': 'والد، كينيا',
        'sarah-johnson': 'سارة جونسون',
        'news-1': 'إطلاق مشروع بئر مياه جديد في مجتمع ريفي',
        'news-1-text': 'يسعدنا الإعلان عن إطلاق أحدث مشروع لآبار المياه الذي سيخدم أكثر من 5,000 شخص.',
        'news-2': 'برنامج التعليم يصل إلى里程碑: 1,000 طالب',
        'news-2-text': 'حققت مبادرة التعليم لدينا معلماً هاماً مع أكثر من 1,000 طفل مسجلين الآن.',
        'news-3': 'تقدير المتطوعين: الاحتفال بأبطالنا',
        'news-3-text': 'نكرم المتطوعين الرائعين الذين يجعلون عملنا ممكناً من خلال تفانيهم وخدمتهم.',
        'read-more': 'اقرأ المزيد',
        'view-all-projects': 'عرض جميع المشاريع',
        'sustainable-dev': 'التنمية المستدامة',
        'sustainable-dev-text': 'تعزيز الحلول المستدامة طويلة الأجل لنمو المجتمع والإدارة البيئية.',
        'women-youth': 'تمكين المرأة والشباب',
        'women-youth-text': 'تمكين النساء والشباب من خلال التعليم والتدريب على المهارات وفرص القيادة.',
        'community-dev': 'تنمية المجتمع',
        'community-dev-text': 'بناء مجتمعات قوية ومرنة من خلال مبادرات التنمية التعاونية.',
        'advocacy': 'الدفاع عن حقوق الإنسان',
        'advocacy-text': 'الدفاع عن حقوق الإنسان والعدالة الاجتماعية للسكان الضعفاء.',
        'climate': 'تغير المناخ وحماية البيئة',
        'climate-text': 'معالجة تحديات المناخ وحماية البيئة للأجيال القادمة.',
        'capacity': 'بناء القدرات والتعليم',
        'capacity-text': 'تعزيز المهارات والمعرفة من خلال البرامج التعليمية وبناء القدرات.',
        'resilience': 'المرونة وسبل العيش',
        'resilience-text': 'بناء المرونة الاقتصادية وسبل العيش المستدامة للمجتمعات.',
        'security': 'التوعية الأمنية وإدارة المخاطر',
        'security-text': 'تعزيز التوعية الأمنية واستراتيجيات إدارة المخاطر الفعالة.',
        'education-all': 'التعليم للجميع',
        'education-all-text': 'توفير التعليم الجودة وموارد التعليم للأطفال في المجتمعات المحرومة.',
        'healthcare-access': 'الوصول إلى الرعاية الصحية',
        'healthcare-access-text': 'تقديم خدمات الرعاية الصحية الأساسية والإمدادات الطبية إلى المناطق النائية.',
        'women-empower': 'تمكين المرأة',
        'women-empower-text': 'دعم النساء من خلال تدريب المهارات والتمويل الصغير والبرامج القيادية.',
        'child-protection': 'حماية الطفل',
        'child-protection-text': 'ضمان سلامة ورفاهية الأطفال من خلال برامج الحماية والدعوة.',
        'livelihood-support': 'دعم سبل العيش',
        'livelihood-support-text': 'خلق فرص اقتصادية من خلال التدريب المهني ودعم الأعمال الصغيرة.',
        'environmental-sustain': 'الاستدامة البيئية',
        'environmental-sustain-text': 'تعزيز الممارسات المستدامة والحفاظ على البيئة في المجتمعات.',
        'community-dev-program': 'تنمية المجتمع',
        'community-dev-program-text': 'بناء مجتمعات قوية ومرنة من خلال مبادرات التنمية التعاونية ومشاريع البنية التحتية.',
        'climate-change-program': 'تغير المناخ',
        'climate-change-program-text': 'معالجة تحديات المناخ من خلال حماية البيئة والممارسات المستدامة وبناء مرونة المجتمع.',
        'climate-subtitle': 'معالجة تحديات المناخ للأجيال القادمة',
        'climate-desc': 'يركز برنامج تغير المناخ في MASaD على معالجة تحديات المناخ من خلال حماية البيئة والممارسات المستدامة وبناء مرونة المجتمع. نعمل مع المجتمعات المحلية لتنفيذ حلول تحمي البيئة وتبني المرونة لتأثيرات المناخ.',
        'climate-approach-text': 'نحن ننفذ مبادرات شاملة لتغير المناخ:',
        'climate-1': 'برامج حماية البيئة والمحافظة عليها',
        'climate-2': 'الممارسات الزراعية المستدامة',
        'climate-3': 'إدارة موارد المياه والمحافظة عليها',
        'climate-4': 'الترويج للطاقة المتجددة وتبنيها',
        'climate-5': 'التوعية المجتمعية والتعليم حول قضايا المناخ',
        'climate-6': 'تقليل مخاطر الكوارث والاستعداد لها',
        'climate-impact-text': 'بذلت جهود تغير المناخ لدينا فرقاً:',
        'climate-impact-1': 'زرعنا أكثر من 130 شجرة في المجتمعات',
        'climate-impact-3': 'درّبنا أكثر من 40 عضو في المجتمع على الممارسات المستدامة',
        'support-climate': 'دعم العمل المناخي',
        'security-program': 'التوعية الأمنية وإدارة المخاطر',
        'security-program-text': 'تعزيز التوعية الأمنية واستراتيجيات إدارة المخاطر الفعالة لحماية المجتمعات.',
        'security-subtitle': 'بناء مجتمعات آمنة ومرنة',
        'security-desc': 'يركز برنامج التوعية الأمنية وإدارة المخاطر في MASaD على تعزيز التوعية الأمنية وتنفيذ استراتيجيات فعالة لإدارة المخاطر لحماية المجتمعات. نعمل مع المجتمعات المحلية لتحديد مخاطر الأمن وتطوير استراتيجيات شاملة لتعزيز السلامة والمرونة.',
        'security-approach-text': 'نحن ننفذ مبادرات شاملة للتوعية الأمنية:',
        'security-1': 'برامج التدريب والتعليم على التوعية الأمنية',
        'security-2': 'تقييم المخاطر وتحليل الضعف',
        'security-3': 'التخطيط الأمني القائم على المجتمع',
        'security-4': 'أنظمة الإنذار المبكر والاستعداد للطوارئ',
        'security-5': 'منع النزاعات ومبادرات بناء السلام',
        'security-6': 'حماية السكان الضعفاء',
        'security-impact-text': 'بذلت جهود التوعية الأمنية لدينا في تعزيز سلامة المجتمع:',
        'security-impact-1': 'درّبنا أكثر من 20 عضو في المجتمع على التوعية الأمنية',
        'security-impact-4': 'حمينا أكثر من 70 فرد ضعيف من خلال البرامج المستهدفة',
        'support-security': 'دعم مبادرات الأمن',
        'learn-more': 'اقرأ المزيد',
        'mission-text': 'تقديم المساعدة الإنسانية وبرامج التنمية المستدامة التي تمكن المجتمعات من التغلب على التحديات وبناء مستقبل أكثر إشراقاً.',
        'vision-text': 'عالم يتمتع فيه كل فرد بالوصول إلى الضروريات الأساسية وفرص النمو والأمل في غد أفضل.',
        'mission-text-full': 'الدفاع عن وتمكين النساء والشباب والمجتمعات المهمشة والأقليات من خلال التعليم والتنمية المستدامة وحقوق الإنسان ومبادرات الحماية الاجتماعية الشاملة. يروج MASaD للوصول المتساوي إلى التعليم والرعاية الصحية والعدالة والفرص الاقتصادية مع مكافحة التمييز والإقصاء وجميع أشكال الظلم الاجتماعي، مما يمكّن كل فرد من المشاركة الكاملة في تنمية مجتمعاتهم.',
        'vision-text-full': 'خلق مجتمع عادل ومنصف حيث يكون لكل امرأة وفرد مهمش الفرصة للازدهار، ممكّنين بحقوقهم، مدعومين بالممارسات المستدامة، والمشاركة بنشاط في تشكيل مجتمعاتهم ومستقبلهم.',
        'who-we-are-text': 'Mubarak Association for Sustainable Development (MASaD) هي منظمة غير ربحية غير حكومية تأسست في بيدoa، جنوب غرب الصومال، في 17 أكتوبر 2020 ملتزمة بتعزيز التنمية المستدامة وبناء مجتمعات مرنة في ولاية جنوب غرب الصومال وما وراءها.',
        'hero-subtitle': 'Mubarak Association for Sustainable and Development (MASaD) هي منظمة غير ربحية مكرسة لبناء مجتمعات مرنة للتنمية المستدامة. نعمل لتمكين المجتمعات من خلال برامج التنمية المستدامة والدفاع والمساعدة الإنسانية في الصومال وما وراءها.',
        'advocacy-program': 'الدفاع',
        'advocacy-program-text': 'الدفاع عن حقوق الإنسان والعدالة الاجتماعية للسكان الضعفاء من خلال تغيير السياسات والمشاركة المجتمعية.',
        'our-approach': 'نهجنا',
        'impact': 'التأثير',
        'advocacy-subtitle': 'تضخيم الأصوات من أجل حقوق الإنسان والعدالة الاجتماعية',
        'advocacy-desc': 'يعمل برنامج الدفاع في MASaD على تعزيز حقوق الإنسان والعدالة الاجتماعية وتغيير السياسات للسكان الضعفاء. نحن نتعامل مع المجتمعات والحكومات والمنظمات الدولية لخلق تغيير منهجي دائم.',
        'advocacy-approach-text': 'نحن ننفذ مبادرات دفاع شاملة:',
        'advocacy-1': 'حملات التوعية بحقوق الإنسان',
        'advocacy-2': 'إصلاح السياسات والدفاع التشريعي',
        'advocacy-3': 'تعبئة المجتمع والمشاركة',
        'advocacy-4': 'الشراكة مع المنظمات المحلية والدولية',
        'advocacy-5': 'المساعدة القانونية وخدمات الدعم',
        'advocacy-6': 'حملات الإعلام والتوعية العامة',
        'advocacy-impact-text': 'أدت جهود الدفاع لدينا إلى تغيير ذي معنى:',
        'advocacy-impact-1': 'Influenced 10+ policy changes',
        'advocacy-impact-2': 'حشدنا أكثر من 550 فرداً من المجتمع',
        'advocacy-impact-3': 'أقمنا شراكة استراتيجية واحدة وأخرى قيد التنفيذ',
        'advocacy-impact-4': 'Provided legal aid to 1,500+ cases',
        'support-advocacy': 'ادعم الدفاع',
        'back-programs': 'العودة إلى البرامج',
        'community-dev-subtitle': 'بناء مجتمعات قوية ومرنة معاً',
        'community-dev-desc': 'يركز برنامج تنمية المجتمع في MASaD على بناء مجتمعات قوية ومرنة من خلال مبادرات التنمية التعاونية. نحن نعمل مع المجتمعات المحلية لتحديد الاحتياجات وتنفيذ حلول مستدامة تحسن جودة الحياة.',
        'community-dev-approach-text': 'نحن ننفذ مبادرات تنمية مجتمعية شاملة:',
        'community-dev-1': 'تطوير وتحسين البنية التحتية',
        'community-dev-2': 'بناء قدرات المجتمع والتدريب',
        'community-dev-3': 'دعم الحكم المحلي والقيادة',
        'community-dev-4': 'التنمية الاقتصادية وخلق الوظائف',
        'community-dev-5': 'برامج التماسك الاجتماعي وبناء السلام',
        'community-dev-6': 'الصحة العامة ومشاريع الصرف الصحي',
        'community-dev-impact-text': 'حولت جهود تنمية المجتمع حياة الناس:',
        'community-dev-impact-1': 'Built 50+ community facilities',
        'community-dev-impact-2': 'حسّنا البنية التحتية في أكثر من 10 قرى',
        'community-dev-impact-3': 'درّبنا أكثر من 100 عضو في المجتمع',
        'community-dev-impact-4': 'وفّرنا أكثر من 50 فرصة عمل محلية',
        'support-communities': 'ادعم المجتمعات',
        // Detail, news and donate pages
        'education-1': 'تمكين المجتمعات من خلال المعرفة',
        'education-2': 'نؤمن في MASaD بأن التعليم هو أساس التنمية المستدامة. يهدف برنامج التعليم للجميع إلى توفير تعليم جيد للأطفال والشباب في المجتمعات المحرومة، بما يضمن امتلاكهم المعرفة والمهارات اللازمة لبناء مستقبل أفضل.',
        'education-3': 'نعمل بشكل وثيق مع المجتمعات المحلية لإنشاء ودعم المؤسسات التعليمية، وتوفير المواد التعليمية، وتدريب المعلمين. يركز نهجنا على:',
        'education-4': 'بناء المدارس وتجديدها في المناطق النائية',
        'education-5': 'توفير الكتب المدرسية والزي المدرسي والمستلزمات التعليمية',
        'education-6': 'تدريب المعلمين والكوادر التعليمية',
        'education-7': 'تقديم منح دراسية للطلاب المستحقين',
        'education-8': 'تعزيز برامج محو أمية الكبار',
        'education-9': 'تهيئة بيئات تعليمية آمنة للفتيات',
        'education-10': 'منذ انطلاق برنامجنا التعليمي، قمنا بما يلي:',
        'education-11': 'Built 15 schools in rural communities',
        'education-12': 'سجّلنا أكثر من 50 طالباً.',
        'education-13': 'Trained 20+ teachers',
        'education-14': 'Distributed 650+ textbooks and learning materials',
        'education-15': 'ادعم التعليم',
        'education-16': '© 2024 جمعية مبارك للتنمية المستدامة (MASaD). جميع الحقوق محفوظة.',
        'healthcare-1': 'إيصال الخدمات الصحية إلى المجتمعات النائية',
        'healthcare-2': 'الحصول على رعاية صحية جيدة حق أساسي من حقوق الإنسان. يعمل برنامج الوصول إلى الرعاية الصحية في MASaD على تقديم الخدمات الطبية الأساسية للمجتمعات النائية والمحرومة، لضمان ألا يُترك أحد خلف الركب.',
        'healthcare-3': 'نتعاون مع السلطات الصحية المحلية والمنظمات الدولية لتقديم خدمات رعاية صحية شاملة:',
        'healthcare-4': 'عيادات طبية متنقلة في المناطق النائية',
        'healthcare-5': 'خدمات صحة الأم والطفل',
        'healthcare-6': 'حملات التطعيم',
        'healthcare-7': 'برامج التثقيف والتوعية الصحية',
        'healthcare-8': 'توزيع الأدوية الأساسية',
        'healthcare-9': 'تدريب العاملين الصحيين المجتمعيين',
        'healthcare-10': 'أحدثت مبادراتنا الصحية تحسينات كبيرة في صحة المجتمع:',
        'healthcare-11': 'Established 10 mobile health clinics',
        'healthcare-12': 'لقّحنا أكثر من 70 طفلاً',
        'healthcare-13': 'درّبنا 53 من العاملين الصحيين في المجتمع',
        'healthcare-14': 'وزّعنا أكثر من 50 من الإمدادات الطبية',
        'healthcare-15': 'ادعم الرعاية الصحية',
        'women-empowerment-1': 'تمكين المرأة لتغيير المجتمعات',
        'women-empowerment-2': 'عندما تتمكن المرأة، تزدهر المجتمعات بأكملها. يركز برنامج تمكين المرأة في MASaD على تزويد النساء بالمهارات والموارد والفرص التي يحتجن إليها ليصبحن قائدات وصانعات للتغيير في مجتمعاتهن.',
        'women-empowerment-3': 'ننفذ برامج شاملة لدعم التمكين الاقتصادي والاجتماعي للمرأة:',
        'women-empowerment-4': 'برامج التدريب على المهارات والتدريب المهني',
        'women-empowerment-5': 'التمويل الأصغر ودعم المشاريع الصغيرة',
        'women-empowerment-6': 'ورش عمل القيادة وبناء القدرات',
        'women-empowerment-7': 'الدفاع عن حقوق المرأة والتوعية بها',
        'women-empowerment-8': 'فرص الإرشاد وبناء العلاقات المهنية',
        'women-empowerment-9': 'دعم رائدات الأعمال',
        'women-empowerment-10': 'أحدثت مبادرات تمكين المرأة لدينا تغييراً دائماً:',
        'women-empowerment-11': 'درّبنا أكثر من 40 امرأة على المهارات المهنية',
        'women-empowerment-12': 'دعمنا أكثر من 40 مشروعاً تملكه نساء',
        'women-empowerment-13': 'تقديم قروض صغيرة لأكثر من 800 امرأة',
        'women-empowerment-14': 'إنشاء 25 مجموعة دعم للنساء',
        'women-empowerment-15': 'ادعم المرأة',
        'livelihood-1': 'بناء الاستقلال الاقتصادي',
        'livelihood-2': 'التمكين الاقتصادي هو مفتاح كسر دائرة الفقر. يوفر برنامج دعم سبل العيش في MASaD فرصاً اقتصادية مستدامة للأفراد والأسر من خلال التدريب على المهارات ودعم المشاريع الصغيرة ومبادرات الشمول المالي.',
        'livelihood-3': 'نقدم دعماً شاملاً لمساعدة المجتمعات على تحقيق الاستقلال الاقتصادي:',
        'livelihood-4': 'برامج التدريب المهني وتنمية المهارات',
        'livelihood-5': 'منح وقروض لإطلاق المشاريع الصغيرة',
        'livelihood-6': 'الدعم الزراعي وموارد الزراعة',
        'livelihood-7': 'الثقافة المالية ومجموعات الادخار',
        'livelihood-8': 'الوصول إلى الأسواق وتطوير الأعمال',
        'livelihood-9': 'تأسيس التعاونيات ودعمها',
        'livelihood-10': 'غيّرت برامج سبل العيش لدينا حياة الكثيرين:',
        'livelihood-11': 'تدريب أكثر من 4,000 شخص على المهارات المهنية',
        'livelihood-12': 'دعم أكثر من 80 مشروع صغير',
        'livelihood-13': 'درّبنا أكثر من 10 تعاونيات زراعية صغيرة.',
        'livelihood-14': 'إنشاء 30 مجموعة ادخار',
        'livelihood-15': 'ادعم سبل العيش',
        'news1-1': 'أكتوبر',
        'news1-2': 'بواسطة فريق MASaD | تنمية المجتمع',
        'news1-3': 'يسعدنا أن نعلن عن إطلاق أحدث مشاريعنا لحفر بئر مياه في مجتمع ريفي يعاني من شح المياه منذ سنوات. وتأتي هذه المبادرة ضمن التزامنا المستمر بتوفير مياه شرب نظيفة وآمنة للمجتمعات المحتاجة.',
        'news1-4': 'التحدي',
        'news1-5': 'على مدى سنوات، اضطر سكان هذا المجتمع إلى السير عدة كيلومترات يومياً للحصول على المياه من مصادر ملوثة. ولم يستهلك ذلك وقتاً ثميناً كان يمكن استغلاله في أنشطة منتجة فحسب، بل شكّل أيضاً مخاطر صحية جسيمة، خاصة على الأطفال وكبار السن.',
        'news1-6': 'حلّنا',
        'news1-7': 'قامت MASaD، بالشراكة مع السلطات المحلية والجهات المانحة الدولية، ببناء بئر مياه حديثة مزودة بنظام ضخ يعمل بالطاقة الشمسية. وقد صُممت البئر لخدمة أكثر من 5,000 شخص في المنطقة المحيطة، وتوفر مياهاً نظيفة للشرب والطهي والصرف الصحي.',
        'news1-8': 'الأثر على المجتمع',
        'news1-9': 'يتجاوز أثر هذا المشروع توفير المياه بكثير. فمع سهولة الحصول على مياه نظيفة:',
        'news1-10': 'انخفضت الأمراض المنقولة بالمياه بشكل ملحوظ',
        'news1-11': 'يقضي الأطفال وقتاً أطول في المدرسة بدلاً من جلب المياه',
        'news1-12': 'أصبح لدى النساء وقت أكبر للأنشطة المدرّة للدخل',
        'news1-13': 'تحسنت الصحة العامة والنظافة في المجتمع',
        'news1-14': 'نظرة إلى المستقبل',
        'news1-15': 'مشروع بئر المياه هذا ليس سوى واحد من مبادرات كثيرة خططت لها MASaD للمنطقة. نحن ملتزمون بتوسيع برامجنا للوصول إلى المياه لتشمل مجتمعات أكثر، وضمان أن تصبح المياه النظيفة حقاً لا امتيازاً.',
        'news1-16': 'هل تريد دعم مشاريع المياه لدينا؟',
        'news1-17': 'العودة إلى الأخبار',
        'news2-1': 'بواسطة فريق MASaD | التعليم',
        'news2-2': 'يسرنا أن نعلن أن برنامج التعليم للجميع بلغ مرحلة مهمة، إذ التحق أكثر من 1,000 طفل بالتعليم النظامي عبر المدارس التي ندعمها. ويمثل هذا الإنجاز سنوات من التفاني والعمل الجاد من فريقنا وشركائنا والمجتمعات التي نخدمها.',
        'news2-3': 'الرحلة',
        'news2-4': 'عندما بدأت MASaD مبادرتها التعليمية، لم تتح لكثير من الأطفال في المجتمعات التي نخدمها فرصة الالتحاق بالتعليم النظامي. فقد كانت المدارس إما غير موجودة أو بعيدة جداً، ولم تكن الأسر قادرة على تحمل التكاليف المرتبطة بها. فعزمنا على تغيير هذا الواقع.',
        'news2-5': 'شمل نهجنا الشامل ما يلي:',
        'news2-6': 'بناء البنية التحتية للمدارس وتجديدها',
        'news2-7': 'توفير الكتب المدرسية والمواد التعليمية',
        'news2-8': 'تدريب المعلمين ودعمهم',
        'news2-9': 'تقديم منح دراسية للأسر المحتاجة',
        'news2-10': 'تهيئة بيئات تعليمية آمنة، خاصة للفتيات',
        'news2-11': 'قصص الأثر',
        'news2-12': 'أصدق ما يروي أثر هذا الإنجاز قصص الأطفال الذين تغيرت حياتهم. فأطفال لم يكن لديهم أمل في الذهاب إلى المدرسة يتعلمون الآن القراءة والكتابة ويحلمون بمستقبل أفضل. وأولياء أمور كانوا يكافحون لتعليم أبنائهم يرون اليوم الأمل والإمكانيات.',
        'news2-13': 'نتطلع إلى المستقبل',
        'news2-14': 'رغم أن الوصول إلى 1,000 طالب إنجاز كبير، فإن عملنا لم ينتهِ بعد. نهدف إلى مضاعفة هذا العدد في السنوات القادمة وتوسيع برامجنا التعليمية لتصل إلى مجتمعات أكثر. فكل طفل يستحق الحصول على تعليم جيد، ونحن ملتزمون بتحقيق ذلك.',
        'news2-15': 'ساعدنا في تعليم المزيد من الأطفال؟',
        'news3-1': 'بواسطة فريق MASaD | المجتمع',
        'news3-2': 'نتوقف اليوم لنكرّم ونحتفي بالمتطوعين الرائعين الذين يجعلون عملنا ممكناً. يمنح هؤلاء الأفراد المخلصون وقتهم وطاقتهم وقلوبهم لخدمة المجتمعات المحتاجة، وإسهاماتهم لا تقدّر بثمن لرسالة MASaD.',
        'news3-3': 'قوة العمل التطوعي',
        'news3-4': 'المتطوعون هم العمود الفقري لمنظمتنا. فمن المعلمين في مدارسنا إلى العاملين الصحيين في عياداتنا، ومن منسقي المجتمع إلى الدعم الإداري، يؤدي كل متطوع دوراً حاسماً في نجاحنا. إن تفانيهم وشغفهم يلهماننا كل يوم.',
        'news3-5': 'قصص المتطوعين',
        'news3-6': 'يأتي متطوعونا من خلفيات متنوعة لكنهم يتشاركون هدفاً واحداً: إحداث فرق. بعضهم من أبناء المجتمع المحلي يردّون الجميل لجيرانهم، وآخرون يسافرون من مختلف أنحاء العالم للمساهمة بمهاراتهم وخبراتهم. ويضيف كل منهم مواهب ووجهات نظر فريدة تثري برامجنا.',
        'news3-7': 'أثر عملهم',
        'news3-8': 'أثر متطوعينا ملموس وعميق:',
        'news3-9': 'خدم أكثر من 500 متطوع مع MASaD هذا العام',
        'news3-10': 'ساهم المتطوعون بأكثر من 20,000 ساعة من العمل',
        'news3-11': 'تصل البرامج التي يدعمها المتطوعون إلى أكثر من 10,000 مستفيد',
        'news3-12': 'وسّعت المبادرات التي يقودها المتطوعون نطاق وصولنا إلى مجتمعات جديدة',
        'news3-13': 'انضم إلى أسرة المتطوعين لدينا',
        'news3-14': 'إذا ألهمتك قصص متطوعينا وتريد إحداث فرق، فنرحب بانضمامك إلى أسرة المتطوعين لدينا. سواء كان بإمكانك التطوع بضع ساعات أسبوعياً أو تكريس عدة أشهر، فهناك مكان لك في رسالتنا لبناء مجتمعات قادرة على الصمود.',
        'news3-15': 'هل ترغب في التطوع معنا؟',
        'news3-16': 'كن متطوعاً',
        'donate-1': '25 دولاراً توفر مياهاً نظيفة لأسرة',
        'donate-2': '50 دولاراً تدعم تعليم طفل',
        'donate-3': '100 دولار توفر مستلزمات طبية',
        'donate-4': '250 دولاراً تساعد في بناء مأوى'
,
        'copyright': '© 2026 جمعية مبارك للتنمية المستدامة (MASaD). جميع الحقوق محفوظة.',
        'baidoa-somalia': 'بيدوا، الصومال',
        'follow-us': 'تابعنا',
        'families-served': 'الأسر المستفيدة',
        'partnership-title': 'شراكتنا',
        'partnership-sub': 'بعثة الأمم المتحدة للمساعدة الانتقالية في الصومال',
        'partnership-text': 'نفخر بوجود شراكة بيننا وبين UNTMIS، حيث نعمل معاً لدعم المجتمعات في أنحاء ولاية جنوب غرب الصومال.',
        'ph-name': 'أدخل اسمك الكامل',
        'ph-email': 'أدخل بريدك الإلكتروني',
        'ph-phone': 'أدخل رقم هاتفك',
        'form-sending': 'جارٍ الإرسال...',
        'form-success': 'شكراً لك! تم إرسال رسالتك. سنتواصل معك قريباً.',
        'form-error': 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة عبر البريد الإلكتروني.',
        'donate-form-title': 'نموذج التبرع',
        'donate-message': 'كيف ترغب في التبرع أو دعمنا؟',
        'ph-donate-message': 'أخبرنا كيف ترغب في المساعدة',
        'send-donation': 'إرسال طلب التبرع',
        'prefill-volunteer': 'أرغب في التطوع مع MASaD.',
        'prefill-partner': 'أرغب في الشراكة مع MASaD.',
        'back-home': 'العودة إلى الرئيسية',
        'mission-sub': 'تمكين المجتمعات من تجاوز التحديات وبناء مستقبل أكثر إشراقاً',
        'mission-p2': 'MASaD منظمة غير ربحية مقرها بيدوا في الصومال. نعمل جنباً إلى جنب مع المجتمعات المحلية والسلطات والشركاء، ومنهم UNTMIS، لتقديم المساعدات الإنسانية وبرامج التنمية المستدامة التي تدوم.',
        'mission-h2': 'ما يدفعنا',
        'mission-1': 'تقديم المساعدات الإنسانية للمحتاجين',
        'mission-2': 'تنفيذ برامج التنمية المستدامة في التعليم والصحة وسبل العيش',
        'mission-3': 'تمكين النساء والشباب والفئات الضعيفة',
        'mission-4': 'تعزيز قدرة المجتمعات على الصمود والاعتماد على الذات',
        'mission-5': 'بناء شراكات مع السلطات المحلية والمنظمات الدولية',
        'mission-h2b': 'التزامنا',
        'mission-p3': 'نلتزم بالعمل بشفافية واحترام مع كل مجتمع نخدمه، ليتمكن الناس من تجاوز التحديات وبناء مستقبل أكثر إشراقاً لأنفسهم ولأطفالهم.',
        'vision-sub': 'عالم من الفرص والأمل',
        'vision-p2': 'نتخيل مجتمعات في الصومال وخارجه تعيش فيها الأسر بكرامة، ويتعلم الأطفال وينمون بأمان، ويتمكن الناس من صنع مستقبلهم بأنفسهم.',
        'vision-h2': 'ما نتطلع إليه',
        'vision-1': 'حصول كل فرد على الاحتياجات الأساسية',
        'vision-2': 'فرص حقيقية للتعليم والعمل والنمو',
        'vision-3': 'نساء وشباب وأطفال قادرون على تحقيق كامل إمكاناتهم',
        'vision-4': 'مجتمعات قادرة على الصمود وتنعم بالسلام',
        'vision-5': 'الأمل في غدٍ أفضل',
        'vision-h2b': 'نعمل نحوه معاً',
        'vision-p3': 'تقود رؤيتنا كل برنامج ننفذه. وبالتعاون مع شركائنا والمجتمعات التي نخدمها، نتخذ خطوات عملية كل يوم نحو مستقبل أكثر أملاً.'
    }
};

// Language selector functionality
const langSelect = document.getElementById('languageSelect');
let currentLang = 'en';
try {
    currentLang = localStorage.getItem('lang') || 'en';
} catch (e) { /* storage unavailable */ }
if (!translations[currentLang]) currentLang = 'en';

// Set dropdown value to English by default on first visit
if (langSelect) {
    langSelect.value = currentLang;
    // Ensure English is selected if no saved preference
    if (!localStorage.getItem('lang')) {
        langSelect.value = 'en';
        currentLang = 'en';
    }
}

// Replace only the text of an element, keeping child elements such as icons.
// The original (English) text is remembered so any language can be switched
// back to English, and so missing translations fall back to English.
function setElementText(el, lang, key) {
    const textNodes = Array.from(el.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim() !== '');
    if (el.dataset.i18nOriginal === undefined) {
        el.dataset.i18nOriginal = textNodes.length
            ? textNodes[0].nodeValue.trim()
            : el.textContent.trim();
    }
    const dict = translations[lang] || {};
    const text = (lang !== 'en' && dict[key]) ? dict[key] : el.dataset.i18nOriginal;

    if (!textNodes.length) {
        if (el.children.length === 0) el.textContent = text;
        return;
    }
    const first = textNodes[0];
    const lead = first.nodeValue.match(/^\s*/)[0];
    const trail = first.nodeValue.match(/\s*$/)[0];
    first.nodeValue = lead + text + trail;
    textNodes.slice(1).forEach(n => { n.nodeValue = ''; });
}

// Look up a translation (falls back to English)
function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;
}

// Translate elements
function translatePage(lang) {
    document.querySelectorAll('[data-translate]').forEach(el => {
        setElementText(el, lang, el.dataset.translate);
    });

    // Translate placeholders
    document.querySelectorAll('[data-placeholder]').forEach(el => {
        if (el.dataset.i18nOriginal === undefined) {
            el.dataset.i18nOriginal = el.placeholder;
        }
        const dict = translations[lang] || {};
        const key = el.dataset.placeholder;
        el.placeholder = (lang !== 'en' && dict[key]) ? dict[key] : el.dataset.i18nOriginal;
    });

    // Re-translate any form status message that is showing
    document.querySelectorAll('.form-status[data-status-key]').forEach(el => {
        el.textContent = (translations[lang] && translations[lang][el.dataset.statusKey]) || translations.en[el.dataset.statusKey];
    });

    // Language and direction (RTL for Arabic)
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    updateWhatsApp();
    updateCarouselArrows('projects');
}

// Apply the saved language straight away (this script is at the end of <body>)
translatePage(currentLang);

// Language dropdown change handler
if (langSelect) {
    langSelect.addEventListener('change', () => {
        const lang = langSelect.value;
        currentLang = lang;
        try {
            localStorage.setItem('lang', lang);
        } catch (e) { /* storage unavailable */ }
        translatePage(lang);
    });
}

// Donate button handler
const donateBtn = document.querySelector('.donate-btn');
if (donateBtn) {
    donateBtn.addEventListener('click', () => {
        window.location.href = 'donate.html';
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to cards
document.querySelectorAll('.service-card, .program-card, .project-card, .impact-card, .news-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Counter animation for impact statistics
function animateCounter(element, target, duration = 2000) {
    const start = performance.now();
    const suffix = element.dataset.suffix || '';
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        element.textContent = Math.floor(progress * target).toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else element.textContent = target.toLocaleString('en-US') + suffix;
    }
    requestAnimationFrame(step);
}

const impactSection = document.querySelector('.impact');
let countersAnimated = false;
if (impactSection) {
    const impactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                document.querySelectorAll('.counter').forEach(counter => {
                    animateCounter(counter, parseInt(counter.dataset.target, 10) || 0);
                });
            }
        });
    }, { threshold: 0.3 });
    impactObserver.observe(impactSection);
}

// Button hover effects
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ---------- Forms: send the filled data to the MASaD WhatsApp number ----------
function setFormStatus(form, type, key) {
    const el = form.querySelector('.form-status');
    if (!el) return;
    el.className = 'form-status ' + type;
    el.dataset.statusKey = key;
    el.textContent = t(key);
}

document.querySelectorAll('form[data-subject]').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        if (data._honey) return; // spam trap

        const isDonation = form.id === 'donateForm';
        const lines = [
            '*' + (isDonation ? 'New donation request' : 'New message') + ' - MASaD website*',
            '',
            '*Name:* ' + (data.name || '-'),
            '*Email:* ' + (data.email || '-'),
            '*Phone:* ' + (data.phone || '-'),
            '*' + (isDonation ? 'Donation / support details' : 'Message') + ':*',
            data.message || '-'
        ];
        const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));

        // Opened synchronously inside the click handler so popup blockers allow it
        const win = window.open(url, '_blank', 'noopener');
        if (!win) window.location.href = url;

        setFormStatus(form, 'success', 'form-success');
        form.reset();
    });
});

// Volunteer / Partner buttons: scroll to the contact form and pre-fill the message
document.querySelectorAll('[data-prefill]').forEach(btn => {
    btn.addEventListener('click', () => {
        const contact = document.getElementById('contact');
        if (!contact) return;
        const box = document.getElementById('message');
        if (box) box.value = t(btn.dataset.prefill);
        contact.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { if (box) box.focus({ preventScroll: true }); }, 700);
    });
});
