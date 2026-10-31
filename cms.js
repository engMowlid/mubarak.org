// Loads Programs, Projects, Impact, Partnerships and News & Stories from the backend API
// and shows them on the page in the visitor's language (English / Somali / Arabic).
// If the API cannot be reached, the original built-in content stays on the page.
(function () {
    'use strict';
    var data = {};

    function lang() { return (typeof currentLang !== 'undefined' && currentLang) || 'en'; }
    // Pick the visitor's language, falling back to English
    function tx(v) {
        if (v && typeof v === 'object') return (lang() !== 'en' && v[lang()]) || v.en || '';
        return v || '';
    }
    function tr(key) { return (typeof t === 'function') ? t(key) : key; }

    // Safe element builder - text is always inserted as text, never as HTML
    function el(tag, attrs, kids) {
        var n = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (k) {
            var v = attrs[k];
            if (v === undefined || v === null || v === false) return;
            if (k === 'text') n.textContent = v; else n.setAttribute(k, v);
        });
        (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
        return n;
    }
    function icon(name, extra) {
        var safe = /^[a-z0-9-]+$/i.test(name || '') ? name : '';
        return el('i', { 'class': 'fas ' + safe + (extra ? ' ' + extra : '') });
    }
    function imgSrc(u) {
        if (!u) return '';
        return /^(https?:)?\/\//i.test(u) || u.charAt(0) === '/' ? u : './' + u.replace(/^\.\//, '');
    }
    function itemUrl(type, item) {
        if (item.link_url) return safeUrl(item.link_url);
        return 'detail.html?type=' + type + '&slug=' + encodeURIComponent(item.slug || item.id);
    }
    // Reads published content straight from Supabase with the public (anon) key.
    // Row Level Security guarantees visitors can only ever get rows marked "published".
    var sb = null;
    try {
        if (window.supabase && /^https:\/\//.test(window.MASAD_SUPABASE_URL || '') && !/YOUR-/.test(window.MASAD_SUPABASE_ANON_KEY || 'YOUR-')) {
            sb = window.supabase.createClient(window.MASAD_SUPABASE_URL, window.MASAD_SUPABASE_ANON_KEY,
                { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
        }
    } catch (e) { sb = null; }
    var TABLES = {
        programs: { t: 'programs', o: [['sort_order', true], ['created_at', true]] },
        projects: { t: 'projects', o: [['sort_order', true], ['created_at', true]] },
        impact: { t: 'impact_stats', o: [['sort_order', true], ['created_at', true]] },
        partnerships: { t: 'partnerships', o: [['sort_order', true], ['created_at', true]] },
        news: { t: 'news', o: [['published_at', false], ['created_at', false]] }
    };
    var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    // never let a stored link run script (javascript:, data: ...)
    function safeUrl(u) {
        u = String(u || '').trim();
        return (/^[a-z][a-z0-9+.\-]*:/i.test(u) && !/^https?:/i.test(u)) || /^\/\//.test(u) ? '#' : u;
    }
    function get(path) {
        return new Promise(function (resolve, reject) {
            if (!sb) return reject(new Error('Supabase is not configured (frontend/config.js)'));
            var parts = path.split('?')[0].split('/'), name = parts[0], key = parts[1] ? decodeURIComponent(parts[1]) : null, def = TABLES[name];
            if (!def) return reject(new Error('Unknown ' + name));
            var q = sb.from(def.t).select('*').eq('published', true);
            if (key) {
                q = q.eq(UUID.test(key) ? 'id' : 'slug', key).maybeSingle();
            } else {
                def.o.forEach(function (o) { q = q.order(o[0], { ascending: o[1] }); });
                q = q.limit(name === 'news' ? 50 : 200);
            }
            q.then(function (r) {
                if (r.error) return reject(r.error);
                if (r.data === null) return reject(new Error('Not found'));
                resolve(r.data);
            }, reject);
        });
    }
    function readMore(href) {
        var a = el('a', { href: href, 'class': 'learn-more', 'data-translate': 'read-more', text: 'Read More ' });
        a.appendChild(icon('fa-arrow-right'));
        return a;
    }

    // ---------------- Programs ----------------
    function renderPrograms() {
        var grid = document.querySelector('.programs-grid');
        if (!grid || !data.programs) return;
        grid.textContent = '';
        data.programs.forEach(function (p) {
            var kids = [];
            if (p.image_url) kids.push(el('img', { src: imgSrc(p.image_url), alt: tx(p.title), loading: 'lazy' }));
            kids.push(el('h3', { text: tx(p.title) }));
            kids.push(el('p', { text: tx(p.description) }));
            kids.push(readMore(itemUrl('programs', p)));
            grid.appendChild(el('div', { 'class': 'program-card' }, kids));
        });
    }

    // ---------------- Projects ----------------
    var STATUS = { planned: { cls: 'ongoing', key: 'planned' }, ongoing: { cls: 'ongoing', key: 'ongoing' }, completed: { cls: 'completed', key: 'completed' } };
    function renderProjects() {
        var box = document.getElementById('projectsCarousel');
        if (!box || !data.projects) return;
        box.textContent = '';
        data.projects.forEach(function (p, i) {
            var st = STATUS[p.status] || STATUS.ongoing;
            var iconBox = el('div', { 'class': 'project-icon' }, [icon(p.icon || 'fa-project-diagram')]);
            var kids = [iconBox, el('h3', { text: tx(p.title) })];
            if (tx(p.location)) kids.push(el('p', { 'class': 'location', text: tx(p.location) }));
            kids.push(el('span', { 'class': 'status ' + st.cls, 'data-translate': st.key, text: st.key }));
            box.appendChild(el('a', { 'class': 'project-card' + (i >= 4 ? ' project-extra' : ''), href: itemUrl('projects', p) }, kids));
        });
        var btn = document.getElementById('toggleProjects');
        if (btn) btn.style.display = data.projects.length > 4 ? '' : 'none';
        box.classList.remove('expanded');
        if (typeof updateCarouselArrows === 'function') updateCarouselArrows('projects');
    }

    // ---------------- Impact ----------------
    function renderImpact() {
        var grid = document.querySelector('.impact-grid');
        if (!grid || !data.impact) return;
        grid.textContent = '';
        data.impact.forEach(function (s) {
            var counter = el('h3', { 'class': 'counter', 'data-target': String(s.value), 'data-suffix': s.suffix || '', text: '0' });
            if (typeof countersAnimated !== 'undefined' && countersAnimated) {
                counter.textContent = Number(s.value).toLocaleString('en-US') + (s.suffix || '');
            }
            grid.appendChild(el('div', { 'class': 'impact-card' }, [
                el('div', { 'class': 'impact-icon' }, [icon(s.icon || 'fa-chart-line')]),
                counter,
                el('p', { text: tx(s.label) })
            ]));
        });
    }

    // ---------------- Partnerships ----------------
    function renderPartnerships() {
        var sec = document.getElementById('partnership');
        if (!sec || !data.partnerships) return;
        var box = sec.querySelector('.container');
        box.textContent = '';
        sec.style.display = data.partnerships.length ? '' : 'none';
        data.partnerships.forEach(function (p, i) {
            var badge = el('div', { 'class': 'partnership-badge' }, p.logo_url ? [el('img', { src: imgSrc(p.logo_url), alt: p.name + ' logo' })] : []);
            var body = el('div', { 'class': 'partnership-body' }, [
                el('span', { 'class': 'partnership-label', 'data-translate': 'partnership-title', text: 'Our Partnership' }),
                el('h2', { text: p.name }),
                tx(p.subtitle) ? el('h3', { text: tx(p.subtitle) }) : null,
                tx(p.description) ? el('p', { text: tx(p.description) }) : null
            ]);
            var card = el('div', { 'class': 'partnership-card', style: i ? 'margin-top:24px' : null }, [badge, body]);
            if (/^https?:\/\//i.test(p.website_url || '')) {
                var a = el('a', { href: p.website_url, target: '_blank', rel: 'noopener noreferrer', style: 'text-decoration:none;color:inherit;display:block' }, [card]);
                box.appendChild(a);
            } else box.appendChild(card);
        });
    }

    // ---------------- News & Stories ----------------
    var newsExpanded = false;
    var TYPE_LABEL = { news: { en: 'News', so: 'War', ar: 'خبر' }, story: { en: 'Story', so: 'Sheeko', ar: 'قصة' } };
    function fmtDate(d) {
        try { return new Date(d).toLocaleDateString(lang() === 'so' ? 'so' : lang(), { year: 'numeric', month: 'short', day: 'numeric' }); }
        catch (e) { return ''; }
    }
    function renderNews() {
        var grid = document.querySelector('.news-grid');
        if (!grid || !data.news) return;
        grid.textContent = '';
        data.news.forEach(function (n, i) {
            var kids = [];
            if (n.image_url) kids.push(el('img', { src: imgSrc(n.image_url), alt: tx(n.title), loading: 'lazy' }));
            kids.push(el('h3', { text: tx(n.title) }));
            if (tx(n.summary)) kids.push(el('p', { text: tx(n.summary) }));
            var a = el('a', { href: itemUrl('news', n), 'class': 'read-more', 'data-translate': 'read-more', text: 'Read More ' });
            a.appendChild(icon('fa-arrow-right'));
            kids.push(a);
            var card = el('div', { 'class': 'news-card' }, kids);
            if (i >= 3 && !newsExpanded) card.hidden = true;
            grid.appendChild(card);
        });
        var btn = document.querySelector('#news .btn-outline');
        if (btn) {
            btn.style.display = data.news.length > 3 ? '' : 'none';
            if (!btn.dataset.cmsBound) {
                btn.dataset.cmsBound = '1';
                btn.addEventListener('click', function () {
                    newsExpanded = !newsExpanded;
                    grid.querySelectorAll('.news-card').forEach(function (c, i) { if (i >= 3) c.hidden = !newsExpanded; });
                    var key = newsExpanded ? 'show-fewer' : 'view-all-news';
                    btn.dataset.translate = key;
                    delete btn.dataset.i18nOriginal;
                    btn.textContent = translations.en[key];
                    translatePage(lang());
                });
            }
        }
    }

    function renderAll() {
        renderPrograms(); renderProjects(); renderImpact(); renderPartnerships(); renderNews();
        if (typeof translatePage === 'function') translatePage(lang());
    }

    // ---------------- Detail page (detail.html?type=news&slug=...) ----------------
    // Text written in the dashboard:  "### " subtitle, "## " heading, "- " bullet
    // (optional icon: "- (fa-tree) text"), blank line = new paragraph. Always inserted as plain text.
    function renderRich(parent, text) {
        var ul = null, para = [];
        function flush() { if (para.length) { parent.appendChild(el('p', { text: para.join(' ') })); para = []; } }
        String(text || '').replace(/\r/g, '').split('\n').forEach(function (raw) {
            var line = raw.trim(), m;
            if (!line) { flush(); ul = null; return; }
            if ((m = line.match(/^###\s+(.*)$/))) { flush(); ul = null; parent.appendChild(el('p', { 'class': 'subtitle', text: m[1] })); return; }
            if ((m = line.match(/^##\s+(.*)$/))) { flush(); ul = null; parent.appendChild(el('h2', { text: m[1] })); return; }
            if ((m = line.match(/^[-*\u2022]\s+(.*)$/))) {
                flush();
                if (!ul) { ul = el('ul', { 'class': 'dash-list' }); parent.appendChild(ul); }
                // older pages may still carry an icon mark such as "(fa-tree)" - it is simply ignored
                var item = m[1].replace(/^\((?:fa-[a-z0-9-]+|img:[^)\s]+)\)\s*/i, '');
                ul.appendChild(el('li', {}, [el('span', { text: item })]));
                return;
            }
            ul = null; para.push(line);
        });
        flush();
    }

    function renderDetail(box, type, item) {
        var cfg = {
            news: { back: 'index.html#news', key: 'news1-17', label: 'Back to News' },
            programs: { back: 'index.html#programs', key: 'back-programs', label: 'Back to Programs' },
            projects: { back: 'index.html#projects', key: 'our-projects', label: 'Our Projects' }
        }[type];
        var section = box.closest('section');
        var isNews = type === 'news';
        if (section) section.className = isNews ? 'news-detail' : 'program-detail';
        box.className = isNews ? 'news-detail-content' : 'detail-content';
        box.removeAttribute('style');
        document.title = tx(item.title) + ' - MASaD';

        var meta = [];
        if (isNews) meta.push((TYPE_LABEL[item.type] || TYPE_LABEL.news)[lang()], fmtDate(item.published_at));
        if (item.author) meta.push(item.author);
        if (type === 'projects' && tx(item.location)) meta.push(tx(item.location));

        var text = tx(item.content) || tx(item.summary) || tx(item.description);
        var cta = el('div', { 'class': isNews ? 'news-cta' : 'detail-cta' }, [
            el('button', { 'class': 'btn-primary', 'data-translate': 'donate-now', text: 'Donate Now', onclick: "window.location.href='donate.html'" }),
            el('button', { 'class': 'btn-secondary', 'data-translate': cfg.key, text: cfg.label, onclick: "window.location.href='" + cfg.back + "'" })
        ]);

        box.textContent = '';
        if (isNews) {
            box.appendChild(el('div', { 'class': 'news-header' }, [
                el('h1', { text: tx(item.title) }),
                meta.length ? el('p', { 'class': 'news-meta', text: meta.join(' | ') }) : null
            ]));
            if (item.image_url) box.appendChild(el('div', { 'class': 'news-image' }, [el('img', { src: imgSrc(item.image_url), alt: tx(item.title) })]));
            var body = el('div', { 'class': 'news-body' });
            renderRich(body, text);
            body.appendChild(cta);
            box.appendChild(body);
        } else {
            if (item.image_url) box.appendChild(el('div', { 'class': 'detail-image' }, [el('img', { src: imgSrc(item.image_url), alt: tx(item.title) })]));
            else box.style.gridTemplateColumns = '1fr';
            var dt = el('div', { 'class': 'detail-text' }, [el('h1', { text: tx(item.title) })]);
            if (meta.length) dt.appendChild(el('p', { 'class': 'subtitle', text: meta.join(' | ') }));
            renderRich(dt, text);
            dt.appendChild(cta);
            box.appendChild(dt);
        }
        if (typeof translatePage === 'function') translatePage(lang());
    }

    function initDetail(box) {
        var q = new URLSearchParams(location.search);
        var type = q.get('type'), slug = q.get('slug');
        if (['news', 'programs', 'projects'].indexOf(type) < 0 || !slug) {
            box.textContent = ''; box.appendChild(el('p', { text: 'Page not found.' })); return;
        }
        get(type + '/' + encodeURIComponent(slug)).then(function (item) {
            renderDetail(box, type, item);
            var sel = document.getElementById('languageSelect');
            if (sel) sel.addEventListener('change', function () { renderDetail(box, type, item); });
        }).catch(function () {
            box.textContent = ''; box.appendChild(el('p', { text: 'Sorry, this page could not be found.' }));
        });
    }

    // ---------------- start ----------------
    var detailBox = document.getElementById('cmsDetail');
    if (detailBox) { initDetail(detailBox); return; }

    var sources = { programs: 'programs', projects: 'projects', impact: 'impact', partnerships: 'partnerships', news: 'news?limit=50' };
    Object.keys(sources).forEach(function (k) {
        get(sources[k]).then(function (rows) { data[k] = rows; renderAll(); })
            .catch(function (e) { console.warn('MASaD: showing built-in content for ' + k, e.message); });
    });
    var sel = document.getElementById('languageSelect');
    if (sel) sel.addEventListener('change', function () { setTimeout(renderAll, 0); });
})();
