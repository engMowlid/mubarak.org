(function () {
    'use strict';
    var LANGS = [['en', 'English'], ['so', 'Somali'], ['ar', 'Arabic']];
    var FORMAT_HELP = 'Click on a line, then press a button to make it a heading, subtitle or list item (-). Press Enter for a new paragraph.';
    // ------------------------------------------------------------------
    // What each section contains.
    // type: i18n | i18n-area | text | number | select | image | check | date | datetime
    // adv:true -> shown under "Advanced options"; rich:true -> formatting buttons
    // ------------------------------------------------------------------
    var SECTIONS = {
        programs: {
            label: 'Programs', single: 'program', icon: 'fa-hand-holding-heart', ph: 'fa-hand-holding-heart', view: 'programs',
            desc: 'The programs shown on the home page. "Full details" is the page that opens when a visitor clicks Read More.',
            fields: [
                { k: 'title', l: 'Program title', type: 'i18n', req: true },
                { k: 'description', l: 'Short description (shown on the card)', type: 'i18n-area' },
                { k: 'image_url', l: 'Photo', type: 'image' },
                { k: 'content', l: 'Read More page - full details', type: 'i18n-area', big: true, rich: true },
                { k: 'link_url', l: 'Custom page address (leave empty to use the page above)', type: 'text', adv: true },
                { k: 'slug', l: 'Web address name (e.g. climate-change)', type: 'text', adv: true },
                { k: 'sort_order', l: 'Order (1 shows first)', type: 'number', def: 0, adv: true },
                { k: 'published', l: 'Show on the website', type: 'check', def: true }
            ],
            title: function (r) { return r.title; }, sub: function (r) { return r.description; }
        },
        projects: {
            label: 'Projects', single: 'project', icon: 'fa-diagram-project', ph: 'fa-diagram-project', view: 'projects',
            desc: 'Projects shown in the carousel. Choose a status, add a photo and write the Read More page.',
            fields: [
                { k: 'title', l: 'Project title', type: 'i18n', req: true },
                { k: 'description', l: 'Short description', type: 'i18n-area' },
                { k: 'location', l: 'Location', type: 'i18n' },
                { k: 'status', l: 'Status', type: 'select', options: [['ongoing', 'Ongoing'], ['completed', 'Completed'], ['planned', 'Planned']], def: 'ongoing' },
                { k: 'image_url', l: 'Photo', type: 'image' },
                { k: 'content', l: 'Read More page - full details', type: 'i18n-area', big: true, rich: true },
                { k: 'start_date', l: 'Start date', type: 'date', adv: true },
                { k: 'end_date', l: 'End date', type: 'date', adv: true },
                { k: 'link_url', l: 'Custom page address (leave empty to use the page above)', type: 'text', adv: true },
                { k: 'slug', l: 'Web address name', type: 'text', adv: true },
                { k: 'sort_order', l: 'Order (1 shows first)', type: 'number', def: 0, adv: true },
                { k: 'published', l: 'Show on the website', type: 'check', def: true }
            ],
            title: function (r) { return r.title; },
            sub: function (r) { return (r.location && r.location.en) || ''; }
        },
        impact: {
            label: 'Impact', single: 'impact number', icon: 'fa-chart-line', ph: 'fa-chart-line',
            desc: 'The big numbers on the home page, such as families served.',
            fields: [
                { k: 'label', l: 'What the number counts (e.g. Families Served)', type: 'i18n', req: true },
                { k: 'value', l: 'Number', type: 'number', req: true, def: 0 },
                { k: 'suffix', l: 'After the number (e.g. +)', type: 'text' },
                { k: 'sort_order', l: 'Order (1 shows first)', type: 'number', def: 0, adv: true },
                { k: 'published', l: 'Show on the website', type: 'check', def: true }
            ],
            title: function (r) { return r.label; }
        },
        partnerships: {
            label: 'Partnership', single: 'partner', icon: 'fa-handshake', ph: 'fa-handshake',
            desc: 'Partners shown in the "Our Partnership" section.',
            fields: [
                { k: 'name', l: 'Partner name', type: 'text', req: true },
                { k: 'subtitle', l: 'Full name / tagline', type: 'i18n' },
                { k: 'description', l: 'About the partnership', type: 'i18n-area' },
                { k: 'logo_url', l: 'Logo', type: 'image' },
                { k: 'website_url', l: 'Partner website (https://...)', type: 'text', adv: true },
                { k: 'sort_order', l: 'Order (1 shows first)', type: 'number', def: 0, adv: true },
                { k: 'published', l: 'Show on the website', type: 'check', def: true }
            ],
            title: function (r) { return r.name; }, sub: function (r) { return r.subtitle; }
        },
        news: {
            label: 'News & Stories', single: 'news or story', icon: 'fa-newspaper', ph: 'fa-newspaper', view: 'news',
            desc: 'Latest news and success stories. The newest appear first on the home page.',
            fields: [
                { k: 'type', l: 'Kind', type: 'select', options: [['news', 'News'], ['story', 'Story']], def: 'news' },
                { k: 'title', l: 'Title', type: 'i18n', req: true },
                { k: 'summary', l: 'Short summary (shown on the home page)', type: 'i18n-area' },
                { k: 'image_url', l: 'Photo', type: 'image' },
                { k: 'content', l: 'Read More page - full article', type: 'i18n-area', big: true, rich: true },
                { k: 'author', l: 'Author', type: 'text' },
                { k: 'published_at', l: 'Date (pick any day - leave empty to use today)', type: 'date', adv: true },
                { k: 'link_url', l: 'Custom page address (leave empty to use the page above)', type: 'text', adv: true },
                { k: 'slug', l: 'Web address name', type: 'text', adv: true },
                { k: 'published', l: 'Show on the website', type: 'check', def: true }
            ],
            title: function (r) { return r.title; }, sub: function (r) { return r.summary; }
        }
    };
    var ORDER = ['programs', 'projects', 'impact', 'partnerships', 'news'];

    // ------------------------------------------------------------------
    // helpers
    // ------------------------------------------------------------------
    var $ = function (id) { return document.getElementById(id); };
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
    function fa(name) { return el('i', { 'class': 'fas ' + (/^[a-z0-9-]+$/i.test(name || '') ? name : 'fa-circle') }); }
    var mem = {};
    function store(k, v) {
        try { if (v === null) sessionStorage.removeItem(k); else if (v !== undefined) sessionStorage.setItem(k, v); return sessionStorage.getItem(k); }
        catch (e) { if (v === null) delete mem[k]; else if (v !== undefined) mem[k] = v; return mem[k] || null; }
    }
    function toast(msg, kind) {
        var t = $('toast'); t.textContent = msg; t.className = 'toast ' + (kind || ''); t.hidden = false;
        clearTimeout(toast.t); toast.t = setTimeout(function () { t.hidden = true; }, 3500);
    }
    function imgSrc(u) { return !u ? '' : (/^(https?:)?\/\//i.test(u) || u.charAt(0) === '/' ? u : './' + u); }
    function en(v) { return v && typeof v === 'object' ? (v.en || v.so || v.ar || '') : (v || ''); }
    function plain(v) { return en(v).replace(/^#{2,3}\s+|^[-*]\s+(\([a-z0-9-]+\)\s*)?/gm, '').replace(/\s+/g, ' ').trim(); }
    function viewUrl(type, r) {
        if (r.link_url) return r.link_url;
        return 'detail.html?type=' + type + '&slug=' + encodeURIComponent(r.slug || r.id);
    }

    // ------------------------------------------------------------------
    // Data layer: the browser talks straight to Supabase (no Node server).
    // Only the public "anon" key is used. What an admin may change is decided by
    // Row Level Security in the database (see supabase/schema.sql), not by this file.
    // ------------------------------------------------------------------
    var sb = null;
    try {
        if (window.supabase && /^https:\/\//.test(window.MASAD_SUPABASE_URL || '') && !/YOUR-/.test(window.MASAD_SUPABASE_ANON_KEY || 'YOUR-')) {
            sb = window.supabase.createClient(window.MASAD_SUPABASE_URL, window.MASAD_SUPABASE_ANON_KEY, {
                auth: {
                    persistSession: true, autoRefreshToken: true, detectSessionInUrl: true,
                    // session lives in sessionStorage: closing the tab logs the admin out
                    storage: { getItem: function (k) { return store(k); }, setItem: function (k, v) { store(k, v); }, removeItem: function (k) { store(k, null); } }
                }
            });
        }
    } catch (e) { sb = null; }

    function sbErr(status, msg) { var e = new Error(msg); e.status = status; return e; }
    function dbErr(er) {
        var msg = (er && er.message) || 'Something went wrong', c = er && er.code;
        if (c === '23505') return sbErr(409, 'That web address name (slug) is already used by another item - choose a different one');
        if (c === '23514') return sbErr(400, 'A web address is not allowed. Use https://... or a page name like detail.html');
        if (c === '42501' || /row-level security|permission denied/i.test(msg)) return sbErr(403, 'You are not allowed to do that. Please log in again as an admin.');
        if (/jwt|not authenticated/i.test(msg) || (er && er.status === 401)) return sbErr(401, 'Session expired, please log in again');
        return sbErr(400, msg);
    }
    function unwrap(r) { if (r.error) throw dbErr(r.error); return r.data; }
    var MAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function sbMe() {
        return sb.auth.getUser().then(function (r) {
            if (r.error || !r.data || !r.data.user) throw sbErr(401, 'Session expired, please log in again');
            return sb.from('admins').select('id,email,full_name').eq('id', r.data.user.id).maybeSingle();
        }).then(function (r) {
            if (r.error) throw dbErr(r.error);
            if (!r.data) throw sbErr(403, 'This account is not an admin');
            return r.data;
        });
    }
    function sbLogin(b) {
        return sb.auth.signInWithPassword({ email: b.email, password: b.password }).then(function (r) {
            if (r.error || !r.data.session) throw sbErr(401, 'Wrong email or password');
            return sbMe().catch(function (e) { return sb.auth.signOut().then(function () { throw e; }); });
        }).then(function (a) { return { admin: a }; });
    }

    // ---- validation (was on the Node server) ----
    var URL_OK = /^(https?:\/\/\S+|(?!\/\/)[\w\-./%()?=&#]+)$/i;
    var MAXLEN = { title: 200, description: 600, content: 20000, location: 120, label: 120, subtitle: 250, summary: 600 };
    function sbClean(name, b) {
        var out = {};
        SECTIONS[name].fields.forEach(function (f) {
            var v = b[f.k];
            if (v === undefined) return;
            if (f.type === 'i18n' || f.type === 'i18n-area') {
                var max = name === 'news' && f.k === 'content' ? 30000 : name === 'partnerships' && f.k === 'description' ? 1200 : (MAXLEN[f.k] || 300), o = {};
                LANGS.forEach(function (lg) {
                    o[lg[0]] = String((v && v[lg[0]]) || '').trim();
                    if (o[lg[0]].length > max) throw sbErr(400, f.l + ' (' + lg[1] + ') is too long - maximum ' + max + ' characters');
                });
                if (f.req && !o.en) throw sbErr(400, 'English text is required for: ' + f.l);
                v = o;
            } else if (f.type === 'number') {
                v = Math.round(Number(v));
                if (!isFinite(v) || (f.k === 'value' && v < 0)) throw sbErr(400, f.l + ' must be a whole number' + (f.k === 'value' ? ', 0 or more' : ''));
            } else if (f.type === 'check') {
                v = !!v;
            } else if (f.type !== 'select') {
                v = String(v).trim();
                if (f.k === 'name' && !v) throw sbErr(400, 'Name is required');
                if (f.k === 'suffix' && v.length > 10) throw sbErr(400, 'Text after the number is too long');
                if (v === '' && f.k !== 'suffix' && f.k !== 'name') v = null;
                if (v && /_url$/.test(f.k) && !URL_OK.test(v)) throw sbErr(400, f.l + ': use a web address (https://...) or a page name like detail.html');
                if (v && f.k === 'slug') {
                    v = v.toLowerCase();
                    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) throw sbErr(400, 'Web address name: lowercase letters, numbers and dashes only');
                }
            }
            out[f.k] = v;
        });
        if (!Object.keys(out).length) throw sbErr(400, 'Nothing to save');
        return out;
    }

    var TABLE = { programs: 'programs', projects: 'projects', impact: 'impact_stats', partnerships: 'partnerships', news: 'news' };
    function sbCrud(method, name, id, body) {
        var t = TABLE[name], q;
        if (method === 'GET') {
            q = sb.from(t).select('*');
            (name === 'news' ? [['published_at', false], ['created_at', false]] : [['sort_order', true], ['created_at', true]])
                .forEach(function (o) { q = q.order(o[0], { ascending: o[1] }); });
            return q.then(unwrap);
        }
        if (method === 'DELETE') {
            return sb.from(t).delete().eq('id', id).select('id').maybeSingle().then(function (r) {
                if (r.error) throw dbErr(r.error);
                if (!r.data) throw sbErr(403, 'Nothing was deleted. Please log in again as an admin.');
                return { deleted: true, id: id };
            });
        }
        var row = sbClean(name, body || {});
        q = id ? sb.from(t).update(row).eq('id', id) : sb.from(t).insert(row);
        return q.select().maybeSingle().then(function (r) {
            if (r.error) throw dbErr(r.error);
            if (!r.data) throw sbErr(403, 'Nothing was saved. Please log in again as an admin.');
            return r.data;
        });
    }

    // ---- photo upload (Supabase Storage, bucket "media") ----
    var IMG = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
    function sbUpload(file, folder) {
        if (!file) return Promise.reject(sbErr(400, 'Choose an image file'));
        if (!IMG[file.type]) return Promise.reject(sbErr(400, 'Only JPG, PNG, WEBP or GIF images are allowed'));
        if (file.size > 5 * 1024 * 1024) return Promise.reject(sbErr(413, 'Image is too large (max 5 MB)'));
        return file.slice(0, 12).arrayBuffer().then(function (buf) {
            var b = new Uint8Array(buf), s = String.fromCharCode.apply(null, b);
            var ok = file.type === 'image/jpeg' ? (b[0] === 0xff && b[1] === 0xd8)
                : file.type === 'image/png' ? (b[0] === 0x89 && s.slice(1, 4) === 'PNG')
                : file.type === 'image/gif' ? s.slice(0, 3) === 'GIF'
                : (s.slice(0, 4) === 'RIFF' && s.slice(8, 12) === 'WEBP');
            if (!ok) throw sbErr(400, 'That file is not a valid image');
            var rnd = Array.prototype.map.call(crypto.getRandomValues(new Uint8Array(5)), function (n) { return ('0' + n.toString(16)).slice(-2); }).join('');
            var path = (String(folder || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 30) || 'general') + '/' + Date.now() + '-' + rnd + '.' + IMG[file.type];
            return sb.storage.from('media').upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false }).then(function (r) {
                if (r.error) throw dbErr(r.error);
                return { url: sb.storage.from('media').getPublicUrl(path).data.publicUrl, path: path };
            });
        });
    }

    // ---- my profile ----
    function sbProfile(b) {
        var me0, changesPw = false;
        return sbMe().then(function (a) {
            me0 = a;
            var newMail = b.new_email ? String(b.new_email).trim().toLowerCase() : '';
            var changesMail = !!newMail && newMail !== a.email.toLowerCase();
            changesPw = !!b.new_password;
            if (changesPw && b.new_password.length < 10) throw sbErr(400, 'Password must be at least 10 characters');
            if (changesMail && !MAIL_OK.test(newMail)) throw sbErr(400, 'Enter a valid email address');
            if (!changesMail && !changesPw) return { mail: false };
            if (!b.current_password) throw sbErr(400, 'Enter your current password to change your email or password');
            return sb.auth.signInWithPassword({ email: a.email, password: b.current_password }).then(function (r) {
                if (r.error) throw sbErr(403, 'Your current password is wrong');
                if (!changesMail) return null;
                return sbFn('change-email', { new_email: newMail, current_password: b.current_password });   // email first, while the old password still works
            }).then(function () {
                if (!changesPw) return null;
                return sb.auth.updateUser({ password: b.new_password }).then(function (r) { if (r.error) throw sbErr(400, r.error.message); });
            }).then(function () { return { changed: true }; });
        }).then(function (st) {
            if (b.full_name === undefined) return st;
            return sb.from('admins').update({ full_name: b.full_name || null }).eq('id', me0.id).select('id,email,full_name').single()
                .then(function (r) { if (r.error) throw dbErr(r.error); me0 = r.data; return st; });
        }).then(function (st) { return { admin: me0, relogin: !!st.changed, emailPending: false }; });
    }

    // ---- administrators ----
    function sbAdmins() {
        return sbMe().then(function (a) {
            return sb.from('admins').select('id,email,full_name,created_at').order('created_at', { ascending: true }).then(function (r) {
                return unwrap(r).map(function (x) { x.you = x.id === a.id; return x; });
            });
        });
    }
    // call a Supabase Edge Function (runs inside Supabase, holds the secret key)
    function sbFn(name, body) {
        return sb.functions.invoke(name, { body: body }).then(function (r) {
            if (!r.error) return r.data;
            var ctx = r.error.context;
            if (ctx && typeof ctx.json === 'function') {
                return ctx.json().catch(function () { return {}; }).then(function (j) {
                    if (ctx.status === 404) throw sbErr(404, 'The "' + name + '" function is not deployed yet (see README).');
                    throw sbErr(ctx.status || 400, j.error || j.message || 'Request failed');
                });
            }
            throw sbErr(500, 'Could not reach Supabase. Check your internet.');
        });
    }
    function sbAddAdmin(b) {
        var mail = String(b.email || '').trim().toLowerCase(), pw = String(b.password || '');
        if (!MAIL_OK.test(mail)) return Promise.reject(sbErr(400, 'Enter a valid email address'));
        if (pw.length < 10) return Promise.reject(sbErr(400, 'Password must be at least 10 characters'));
        // runs inside Supabase (Edge Function "create-admin"): the secret key never reaches the browser
        return sb.functions.invoke('create-admin', { body: { email: mail, password: pw, full_name: String(b.full_name || '').trim() } }).then(function (r) {
            if (!r.error) return r.data.admin;
            var ctx = r.error.context;
            if (ctx && typeof ctx.json === 'function') {
                return ctx.json().catch(function () { return {}; }).then(function (j) {
                    if (ctx.status === 404) throw sbErr(404, 'The "create-admin" function is not deployed yet (see README, step "Add admins from the portal").');
                    throw sbErr(ctx.status || 400, j.error || j.message || 'Could not add the administrator');
                });
            }
            throw sbErr(500, 'Could not reach Supabase. Check your internet and that the "create-admin" function is deployed.');
        });
    }
    function sbRemoveAdmin(id) {
        return sb.rpc('remove_admin', { p_id: id }).then(function (r) { if (r.error) throw dbErr(r.error); return { deleted: true, id: id }; });
    }

    // Same call style the dashboard always used: api('/admin/news', {method, json})
    function api(path, opts) {
        opts = opts || {};
        return Promise.resolve().then(function () {
            if (!sb) throw sbErr(500, 'The website is not connected to Supabase yet. Fill in frontend/config.js (see README).');
            var method = opts.method || 'GET', m;
            if (path === '/auth/login') return sbLogin(opts.json || {});
            if (path === '/auth/me') return sbMe().then(function (a) { return { admin: a }; });
            if (path.indexOf('/admin/upload') === 0) return sbUpload(opts.body && opts.body.get('file'), path.split('folder=')[1] || '');
            if (path === '/admin/profile') return method === 'PUT' ? sbProfile(opts.json || {}) : sbMe().then(function (a) { return { admin: a }; });
            if (path === '/admin/admins') return method === 'POST' ? sbAddAdmin(opts.json || {}) : sbAdmins();
            if ((m = path.match(/^\/admin\/admins\/([0-9a-f-]{36})$/i))) return sbRemoveAdmin(m[1]);
            if ((m = path.match(/^\/admin\/(\w+)(?:\/([0-9a-f-]{36}))?$/i)) && TABLE[m[1]]) return sbCrud(method, m[1], m[2], opts.json);
            throw sbErr(404, 'Unknown request');
        });
    }
    function saveSession() { /* the Supabase library keeps the session itself */ }
    function logout() { drawer(false); if (sb) sb.auth.signOut().catch(function () {}); store('masad_who', null); cache = {}; show('login'); }

    function show(which) { $('loginView').hidden = which !== 'login'; $('appView').hidden = which !== 'app'; }

    $('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target, btn = f.querySelector('button[type=submit]'); $('loginError').textContent = ''; $('loginOk').textContent = ''; busy(btn, true, 'Logging in...');
        api('/auth/login', { method: 'POST', json: { email: f.email.value.trim(), password: f.password.value } })
            .then(function (s) { saveSession(s); store('masad_who', s.admin.full_name || s.admin.email); f.reset(); start(); })
            .catch(function (err) { $('loginError').textContent = err.message; })
            .then(function () { busy(btn, false); });
    });
    $('logoutBtn').addEventListener('click', logout);

    // ------------------------------------------------------------------
    // dashboard
    // ------------------------------------------------------------------
    var current = 'overview', cache = {}, query = '';

    function loadSection(k) {
        return api('/admin/' + k).then(function (rows) { cache[k] = rows; return rows; });
    }
    function loadAll() {
        return Promise.all(ORDER.map(loadSection)).catch(function (e) {
            if (e.status === 401 || e.status === 403) { logout(); return; }
            $('listMsg').textContent = 'Could not load: ' + e.message;
        });
    }

    function start() {
        show('app');
        var who = store('masad_who') || '';
        $('whoami').textContent = who; $('avatar').textContent = (who.trim().charAt(0) || 'A').toUpperCase();
        $('listMsg').textContent = 'Loading...';
        $('view').textContent = '';
        render();
        loadAll().then(function () { $('listMsg').textContent = ''; render(); });
    }

    function go(k) { drawer(false); current = k; query = ''; $('search').value = ''; render(); window.scrollTo(0, 0); }

    function renderNav() {
        var nav = $('nav'); nav.textContent = '';
        var items = [['overview', 'Overview', 'fa-gauge-high']].concat(ORDER.map(function (k) { return [k, SECTIONS[k].label, SECTIONS[k].icon]; }))
            .concat([['sep'], ['profile', 'My profile', 'fa-user-gear'], ['admins', 'Administrators', 'fa-user-shield']]);
        items.forEach(function (it) {
            if (it[0] === 'sep') { nav.appendChild(el('div', { 'class': 'nav-sep', text: 'Account' })); return; }
            var b = el('button', { 'class': 'nav-item' + (it[0] === current ? ' active' : ''), type: 'button' }, [fa(it[2]), el('span', { text: it[1] })]);
            if (cache[it[0]]) b.appendChild(el('span', { 'class': 'count', text: String(cache[it[0]].length) }));
            b.addEventListener('click', function () { go(it[0]); });
            nav.appendChild(b);
        });
    }

    function render() {
        renderNav();
        if (current === 'profile' || current === 'admins') return renderAccountPage();
        var isOv = current === 'overview';
        $('searchWrap').hidden = isOv; $('addBtn').hidden = isOv;
        if (isOv) {
            $('sectionTitle').textContent = 'Overview';
            $('sectionDesc').textContent = 'Everything on your website, in one place.';
            return renderOverview();
        }
        var sec = SECTIONS[current];
        $('sectionTitle').textContent = sec.label; $('sectionDesc').textContent = sec.desc;
        $('addBtn').textContent = ''; $('addBtn').appendChild(fa('fa-plus')); $('addBtn').appendChild(document.createTextNode(' Add ' + sec.single));
        renderList();
    }

    function renderOverview() {
        var v = $('view'); v.textContent = '';
        var who = (store('masad_who') || '').split(' ')[0];
        v.appendChild(el('div', { 'class': 'hello' }, [
            el('h2', { text: 'Welcome' + (who ? ', ' + who : '') + '!' }),
            el('p', { text: 'Add, edit, hide or delete anything on the website. Changes appear on the site straight away.' })
        ]));
        var stats = el('div', { 'class': 'stats' });
        ORDER.forEach(function (k) {
            var rows = cache[k] || [], shown = rows.filter(function (r) { return r.published; }).length;
            var b = el('button', { 'class': 'stat', type: 'button' }, [
                el('div', { 'class': 'ico' }, [fa(SECTIONS[k].icon)]),
                el('div', { 'class': 'num', text: cache[k] ? String(rows.length) : '-' }),
                el('div', { 'class': 'lbl', text: SECTIONS[k].label }),
                el('div', { 'class': 'sub', text: cache[k] ? shown + ' shown' + (rows.length - shown ? ', ' + (rows.length - shown) + ' hidden' : '') : 'Loading...' })
            ]);
            b.addEventListener('click', function () { go(k); });
            stats.appendChild(b);
        });
        v.appendChild(stats);
        v.appendChild(el('div', { 'class': 'tip' }, [fa('fa-lightbulb'), el('div', {}, [
            el('strong', { text: 'Want to change what opens after "Read More"?' }),
            el('p', { text: 'Open Programs, Projects or News & Stories, tap Edit, then change "Read More page". Use the English, Somali and Arabic switch at the top of the form to write each language.' })
        ])]));
    }

    function renderList() {
        var sec = SECTIONS[current], v = $('view'); v.textContent = '';
        var rows = cache[current];
        if (!rows) { $('listMsg').textContent = 'Loading...'; return; }
        var q = query.trim().toLowerCase();
        var list = !q ? rows : rows.filter(function (r) { return JSON.stringify(r).toLowerCase().indexOf(q) >= 0; });
        $('listMsg').textContent = '';
        if (!list.length) {
            v.appendChild(el('div', { 'class': 'empty' }, [fa(sec.icon), el('p', { text: rows.length ? 'Nothing matches your search.' : 'Nothing here yet. Tap "Add ' + sec.single + '" to create the first one.' })]));
            return;
        }
        var grid = el('div', { 'class': 'grid' });
        list.forEach(function (r) { grid.appendChild(card(sec, r)); });
        v.appendChild(grid);
    }

    function card(sec, r) {
        var img = r.image_url || r.logo_url;
        var cover = el('div', { 'class': 'cover' });
        if (img) cover.appendChild(el('img', { src: imgSrc(img), alt: '', loading: 'lazy', 'class': r.logo_url && !r.image_url ? 'contain' : '' }));
        else if (r.value !== undefined) cover.appendChild(el('span', { 'class': 'big', text: Number(r.value).toLocaleString('en-US') + (r.suffix || '') }));
        else cover.appendChild(fa(r.icon || sec.ph));

        var badges = el('div', { 'class': 'badges' });
        if (r.status) badges.appendChild(el('span', { 'class': 'badge ' + r.status, text: r.status }));
        if (r.type) badges.appendChild(el('span', { 'class': 'badge ' + r.type, text: r.type }));
        if (!r.published) badges.appendChild(el('span', { 'class': 'badge draft', text: 'Hidden' }));
        if (r.published_at) badges.appendChild(el('span', { 'class': 'badge', text: new Date(r.published_at).toLocaleDateString() }));
        if (!badges.childNodes.length) badges.appendChild(el('span', { 'class': 'badge', text: 'Shown' }));

        var body = el('div', { 'class': 'card-body' }, [badges, el('h3', { text: plain(sec.title(r)) || '(no title)' })]);
        var sub = sec.sub ? plain(sec.sub(r)) : '';
        if (sub) body.appendChild(el('p', { 'class': 'sub', text: sub }));

        var edit = el('button', { 'class': 'btn small primary edit', type: 'button' }, [fa('fa-pen'), document.createTextNode(' Edit')]);
        edit.addEventListener('click', function () { openForm(r); });
        var foot = el('div', { 'class': 'card-foot' }, [edit]);
        if (sec.view) foot.appendChild(el('a', { 'class': 'btn small', href: viewUrl(sec.view, r), target: '_blank', rel: 'noopener', title: 'Open the page on the website' }, [fa('fa-eye'), document.createTextNode(' View')]));
        var del = el('button', { 'class': 'btn small danger', type: 'button', title: 'Delete', 'aria-label': 'Delete' }, [fa('fa-trash')]);
        del.style.flex = '0 0 auto';
        del.addEventListener('click', function () { remove(r, plain(sec.title(r))); });
        foot.appendChild(del);
        return el('div', { 'class': 'card' }, [cover, body, foot]);
    }

    $('search').addEventListener('input', function (e) { query = e.target.value; if (current !== 'overview') renderList(); });

    function remove(r, title) {
        if (!confirm('Delete "' + title + '"?\nThis cannot be undone.\n\n(Tip: you can instead edit it and switch off "Show on the website" to hide it.)')) return;
        var k = current;
        api('/admin/' + k + '/' + r.id, { method: 'DELETE' })
            .then(function () { toast('Deleted', 'ok'); return loadSection(k); })
            .then(render)
            .catch(function (e) { toast(e.message, 'err'); });
    }

    // ------------------------------------------------------------------
    // add / edit panel
    // ------------------------------------------------------------------
    var editing = null, formLang = 'en';

    function setFormLang(l) {
        formLang = l;
        document.querySelectorAll('#langSwitch .pill').forEach(function (p) { p.classList.toggle('active', p.dataset.lang === l); });
        document.querySelectorAll('#fields .lang-pane').forEach(function (p) { p.hidden = p.dataset.lang !== l; });
    }
    function buildLangSwitch(show) {
        var box = $('langSwitch'); box.textContent = ''; box.hidden = !show;
        LANGS.forEach(function (lg) {
            var b = el('button', { type: 'button', 'class': 'pill', 'data-lang': lg[0], text: lg[1] });
            b.addEventListener('click', function () { setFormLang(lg[0]); });
            box.appendChild(b);
        });
    }
    function toLocalInput(iso) {
        var d = new Date(iso); if (isNaN(d)) return '';
        var p = function (n) { return String(n).padStart(2, '0'); };
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
    }
    // ------------------------------------------------------------------
    // Visual editor for the Read More pages.
    // Admins see real headings / lists. Behind the scenes the text is stored with simple marks
    // (### subtitle, ## heading, - list item), which the website turns into the page.
    // ------------------------------------------------------------------
    function mdToEditor(text, ed) {
        ed.textContent = '';
        var ul = null, para = [];
        function flush() { if (para.length) { ed.appendChild(el('p', { text: para.join(' ') })); para = []; } }
        String(text || '').replace(/\r/g, '').split('\n').forEach(function (raw) {
            var line = raw.trim(), m;
            if (!line) { flush(); ul = null; return; }
            if ((m = line.match(/^###\s+(.*)$/))) { flush(); ul = null; ed.appendChild(el('h3', { text: m[1] })); return; }
            if ((m = line.match(/^##\s+(.*)$/))) { flush(); ul = null; ed.appendChild(el('h2', { text: m[1] })); return; }
            if ((m = line.match(/^[-*•]\s+(.*)$/))) {
                flush(); if (!ul) { ul = el('ul'); ed.appendChild(ul); }
                var t = m[1].replace(/^\((?:fa-[a-z0-9-]+|img:[^)\s]+)\)\s*/i, ''), li = el('li');
                li.appendChild(document.createTextNode(t)); ul.appendChild(li); return;
            }
            ul = null; para.push(line);
        });
        flush();
        if (!ed.firstChild) ed.appendChild(el('p', {}, [el('br')]));
    }
    function editorToMd(ed) {
        var items = [];
        function textOf(n) {
            var s = '';
            n.childNodes.forEach(function (c) {
                if (c.nodeType === 3) s += c.nodeValue;
                else if (c.nodeName === 'BR') s += ' ';
                else if (c.nodeName === 'I' || c.nodeName === 'IMG') return;
                else if (c.nodeType === 1) s += textOf(c);
            });
            return s.replace(/\s+/g, ' ').trim();
        }
        function walk(n) {
            if (n.nodeType === 3) { var t = n.nodeValue.trim(); if (t) items.push({ k: 'p', t: t }); return; }
            if (n.nodeType !== 1) return;
            var nm = n.nodeName;
            if (nm === 'UL' || nm === 'OL') {
                Array.prototype.forEach.call(n.children, function (li) {
                    var t = textOf(li); if (!t) return;
                    items.push({ k: 'li', t: '- ' + t });
                });
            } else if (nm === 'H1' || nm === 'H2') { var h = textOf(n); if (h) items.push({ k: 'h', t: '## ' + h }); }
            else if (nm === 'H3' || nm === 'H4') { var h3 = textOf(n); if (h3) items.push({ k: 'h', t: '### ' + h3 }); }
            else if (n.querySelector('ul,ol,h1,h2,h3,h4,p,div')) Array.prototype.forEach.call(n.childNodes, walk);
            else { var p = textOf(n); if (p) items.push({ k: 'p', t: p }); }
        }
        Array.prototype.forEach.call(ed.childNodes, walk);
        return items.map(function (it, i) { return (i ? (it.k === 'li' && items[i - 1].k === 'li' ? '\n' : '\n\n') : '') + it.t; }).join('');
    }
    function buildRichEditor(lg, cur, placeholder) {
        var pane = el('div', { 'class': 'rte-wrap' });
        var ed = el('div', { 'class': 'rte', contenteditable: 'true', 'data-name': lg, 'data-placeholder': placeholder, role: 'textbox', 'aria-multiline': 'true' });
        if (lg === 'ar') ed.setAttribute('dir', 'rtl');
        mdToEditor(cur, ed);
        function exec(cmd, val) { ed.focus(); document.execCommand(cmd, false, val || null); }
        var tb = el('div', { 'class': 'toolbar' });
        [['Normal text', 'fa-paragraph', function () { exec('formatBlock', '<p>'); }],
         ['Heading', 'fa-heading', function () { exec('formatBlock', '<h2>'); }],
         ['Subtitle', 'fa-font', function () { exec('formatBlock', '<h3>'); }],
         ['List (-)', 'fa-list-ul', function () { exec('insertUnorderedList'); }]].forEach(function (b) {
            var btn = el('button', { type: 'button', title: b[0] }, [fa(b[1]), document.createTextNode(' ' + b[0])]);
            btn.addEventListener('mousedown', function (e) { e.preventDefault(); });   // keep the cursor in the text
            btn.addEventListener('click', b[2]);
            tb.appendChild(btn);
        });
        // paste as plain text only
        ed.addEventListener('paste', function (e) {
            e.preventDefault();
            var t = (e.clipboardData || window.clipboardData).getData('text/plain');
            document.execCommand('insertText', false, t);
        });
        pane.appendChild(tb); pane.appendChild(ed);
        return pane;
    }

    function buildField(f, rec) {
        var val = rec ? rec[f.k] : undefined;
        var id = 'f_' + f.k;
        if (f.type === 'i18n' || f.type === 'i18n-area') {
            var wrap = el('div', { 'class': 'field', 'data-k': f.k }, [
                el('span', { 'class': 'flabel' }, [document.createTextNode(f.l), f.req ? el('span', { 'class': 'req', text: ' *' }) : null])
            ]);
            if (f.rich) wrap.appendChild(el('div', { 'class': 'hint', text: FORMAT_HELP }));
            LANGS.forEach(function (lg) {
                var cur = (val && val[lg[0]]) || '';
                var pane = el('div', { 'class': 'lang-pane', 'data-lang': lg[0] });
                var ph = lg[1] + (lg[0] === 'en' && f.req ? ' (required)' : lg[0] === 'en' ? '' : ' (optional - English is shown if empty)');
                if (f.rich) { pane.appendChild(buildRichEditor(lg[0], cur, ph)); wrap.appendChild(pane); return; }
                var inp = f.type === 'i18n'
                    ? el('input', { type: 'text', name: lg[0], value: cur, maxlength: 400, placeholder: ph })
                    : el('textarea', { name: lg[0], rows: f.big ? 14 : 3, placeholder: ph, text: cur });
                if (lg[0] === 'ar') inp.setAttribute('dir', 'rtl');
                pane.appendChild(inp);
                wrap.appendChild(pane);
            });
            return wrap;
        }
        if (f.type === 'check') {
            var cb = el('input', { type: 'checkbox', id: id, name: f.k });
            cb.checked = val === undefined ? !!f.def : !!val;
            return el('div', { 'class': 'switch-row' }, [el('label', { 'class': 'check', 'for': id }, [cb, document.createTextNode(f.l)])]);
        }
        if (f.type === 'image') {
            var hidden = el('input', { type: 'hidden', name: f.k, value: val || '' });
            var prev = el('img', { alt: '', src: val ? imgSrc(val) : null }); if (!val) prev.hidden = true;
            var file = el('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp,image/gif' });
            var up = el('label', { 'class': 'btn small upload', style: 'margin:0' }, [fa('fa-cloud-arrow-up'), document.createTextNode(' Upload photo'), file]);
            var rm = el('button', { type: 'button', 'class': 'btn small danger', text: 'Remove' }); rm.hidden = !val;
            var status = el('div', { 'class': 'hint', text: 'JPG, PNG, WEBP or GIF, up to 5 MB.' });
            file.addEventListener('change', function () {
                if (!file.files[0]) return;
                var fd = new FormData(); fd.append('file', file.files[0]);
                status.textContent = 'Uploading...';
                api('/admin/upload?folder=' + current, { method: 'POST', body: fd }).then(function (r) {
                    hidden.value = r.url; prev.src = r.url; prev.hidden = false; rm.hidden = false; status.textContent = 'Uploaded. Remember to tap Save.';
                }).catch(function (e) { status.textContent = ''; toast(e.message, 'err'); }).then(function () { file.value = ''; });
            });
            rm.addEventListener('click', function () { hidden.value = ''; prev.hidden = true; rm.hidden = true; });
            return el('div', { 'class': 'img-field' }, [el('span', { 'class': 'flabel', text: f.l }), prev, el('div', { 'class': 'row' }, [up, rm]), status, hidden]);
        }
        // plain inputs
        var v = val === undefined || val === null ? (f.def !== undefined ? f.def : '') : val, node;
        if (f.type === 'select') {
            node = el('select', { id: id, name: f.k });
            f.options.forEach(function (o) { var op = el('option', { value: o[0], text: o[1] }); if (o[0] === v) op.selected = true; node.appendChild(op); });
        } else {
            if (f.type === 'date' && v) v = f.k === 'published_at' ? toLocalInput(v).slice(0, 10) : String(v).slice(0, 10);
            node = el('input', { id: id, name: f.k, type: f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : f.type === 'datetime' ? 'datetime-local' : 'text', value: v });
        }
        return el('div', { 'class': 'field' }, [el('label', { 'for': id, style: 'margin-top:14px' }, [document.createTextNode(f.l), f.req ? el('span', { 'class': 'req', text: ' *' }) : null, node])]);
    }

    function openForm(rec) {
        editing = rec || null;
        var sec = SECTIONS[current];
        $('formTitle').textContent = (rec ? 'Edit ' : 'Add ') + sec.single;
        $('formError').textContent = '';
        var hasI18n = sec.fields.some(function (f) { return f.type.indexOf('i18n') === 0; });
        buildLangSwitch(hasI18n);
        var box = $('fields'); box.textContent = '';
        var adv = el('details', { 'class': 'adv' }, [el('summary', { text: 'Advanced options' })]), hasAdv = false;
        sec.fields.forEach(function (f) {
            var node = buildField(f, rec);
            if (f.adv) { adv.appendChild(node); hasAdv = true; } else box.appendChild(node);
        });
        if (hasAdv) box.appendChild(adv);
        setFormLang('en');
        $('modal').hidden = false; document.body.style.overflow = 'hidden';
        $('fields').scrollTop = 0;
    }
    function closeForm() { $('modal').hidden = true; document.body.style.overflow = ''; editing = null; }
    $('addBtn').addEventListener('click', function () { if (current === 'admins') openAdminForm(); else openForm(null); });
    $('closeForm').addEventListener('click', closeForm);
    $('cancelForm').addEventListener('click', closeForm);
    $('modal').addEventListener('mousedown', function (e) { if (e.target === $('modal')) closeForm(); });
    document.addEventListener('keydown', function (e) { if (e.key !== 'Escape') return; drawer(false); if (!$('modal').hidden) closeForm(); if (!$('adminModal').hidden) closeAdminForm(); });

    function collect() {
        var out = {}, root = $('fields');
        SECTIONS[current].fields.forEach(function (f) {
            if (f.type === 'i18n' || f.type === 'i18n-area') {
                var o = {}, wrap = root.querySelector('.field[data-k="' + f.k + '"]');
                LANGS.forEach(function (lg) {
                    var ed = wrap.querySelector('.rte[data-name="' + lg[0] + '"]');
                    o[lg[0]] = ed ? editorToMd(ed) : wrap.querySelector('[name="' + lg[0] + '"]').value;
                });
                out[f.k] = o;
            } else {
                var n = root.querySelector('[name="' + f.k + '"]');
                if (f.type === 'check') out[f.k] = n.checked;
                else if (f.type === 'number') out[f.k] = n.value === '' ? (f.def || 0) : Number(n.value);
                else if (f.k === 'published_at') out[f.k] = n.value ? new Date(n.value + 'T12:00:00').toISOString() : undefined;
                else out[f.k] = n.value.trim();
            }
        });
        return out;
    }

    $('itemForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var body = collect(), btn = $('saveBtn'), k = current;
        $('formError').textContent = ''; btn.disabled = true;
        var req = editing
            ? api('/admin/' + k + '/' + editing.id, { method: 'PUT', json: body })
            : api('/admin/' + k, { method: 'POST', json: body });
        req.then(function () { toast('Saved - live on the website', 'ok'); closeForm(); return loadSection(k); })
            .then(render)
            .catch(function (err) {
                $('formError').textContent = err.message;
                if (/English|\.en\b/.test(err.message)) setFormLang('en');
            })
            .then(function () { btn.disabled = false; });
    });

    // ------------------------------------------------------------------
    // Account pages: My profile + Administrators
    // ------------------------------------------------------------------
    function passwordField(label, name, autocomplete, hint) {
        var inp = el('input', { type: 'password', name: name, autocomplete: autocomplete, placeholder: label });
        var eye = el('button', { type: 'button', 'class': 'eye', 'aria-label': 'Show or hide password', title: 'Show / hide' }, [fa('fa-eye')]);
        eye.addEventListener('click', function () { var show = inp.type === 'password'; inp.type = show ? 'text' : 'password'; eye.firstChild.className = 'fas ' + (show ? 'fa-eye-slash' : 'fa-eye'); });
        var kids = [document.createTextNode(label), el('span', { 'class': 'pw' }, [inp, eye])];
        if (hint) kids.push(el('div', { 'class': 'hint', text: hint }));
        return { node: el('label', {}, kids), input: inp };
    }
    function randomPassword() {
        var chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = '', a = new Uint32Array(14);
        (window.crypto || window.msCrypto).getRandomValues(a);
        a.forEach(function (n) { out += chars[n % chars.length]; });
        return out;
    }

    function renderAccountPage() {
        $('searchWrap').hidden = true;
        var v = $('view'); v.textContent = ''; $('listMsg').textContent = '';
        if (current === 'profile') {
            $('sectionTitle').textContent = 'My profile';
            $('sectionDesc').textContent = 'Change your name, email address or password.';
            $('addBtn').hidden = true;
            return renderProfile(v);
        }
        $('sectionTitle').textContent = 'Administrators';
        $('sectionDesc').textContent = 'People who can log in and manage the whole website.';
        $('addBtn').hidden = false; $('addBtn').textContent = ''; $('addBtn').appendChild(fa('fa-user-plus')); $('addBtn').appendChild(document.createTextNode(' Add admin'));
        renderAdmins(v);
    }

    function renderProfile(v) {
        v.appendChild(el('div', { 'class': 'acct-card acct' }, [el('p', { 'class': 'muted', text: 'Loading...' })]));
        api('/admin/profile').then(function (r) {
            var me = r.admin, box = v.firstChild; box.textContent = '';
            var form = el('form', { novalidate: 'novalidate', autocomplete: 'off' });
            var name = el('input', { type: 'text', name: 'full_name', value: me.full_name || '', maxlength: 100, placeholder: 'Your name' });
            var mail = el('input', { type: 'email', name: 'email', value: me.email, placeholder: 'you@gmail.com', autocomplete: 'username' });
            var np = passwordField('New password (leave empty to keep your current one)', 'new_password', 'new-password', 'At least 10 characters.');
            var np2 = passwordField('Repeat the new password', 'new_password2', 'new-password');
            var cp = passwordField('Your current password', 'current_password', 'current-password', 'Needed only when you change your email or password.');
            var err = el('p', { 'class': 'error', role: 'alert' });
            var save = el('button', { type: 'submit', 'class': 'btn primary' }, [fa('fa-check'), document.createTextNode(' Save changes')]);
            box.appendChild(el('div', { 'class': 'acct-top' }, [el('span', { 'class': 'avatar', text: ((me.full_name || me.email).charAt(0) || 'A').toUpperCase() }), el('div', {}, [el('strong', { text: me.full_name || 'Administrator' }), el('span', { 'class': 'm', text: me.email })])]));
            form.appendChild(el('h3', { text: 'Your details' }));
            form.appendChild(el('label', {}, [document.createTextNode('Full name'), name]));
            form.appendChild(el('label', {}, [document.createTextNode('Email (Gmail) - you log in with this'), mail]));
            form.appendChild(el('h3', { text: 'Password' }));
            form.appendChild(np.node); form.appendChild(np2.node);
            form.appendChild(el('h3', { text: 'Confirm it is you' }));
            form.appendChild(cp.node);
            form.appendChild(err); form.appendChild(save);
            box.appendChild(form);
            form.addEventListener('submit', function (e) {
                e.preventDefault(); err.textContent = '';
                var body = { full_name: name.value.trim() };
                var newMail = mail.value.trim().toLowerCase();
                if (newMail && newMail !== me.email.toLowerCase()) body.new_email = newMail;
                if (np.input.value || np2.input.value) {
                    if (np.input.value !== np2.input.value) { err.textContent = 'The two new passwords are not the same.'; return; }
                    body.new_password = np.input.value;
                }
                if (body.new_email || body.new_password) {
                    if (!cp.input.value) { err.textContent = 'Enter your current password to change your email or password.'; return; }
                    body.current_password = cp.input.value;
                }
                save.disabled = true;
                api('/admin/profile', { method: 'PUT', json: body }).then(function (res) {
                    if (res.emailPending) { toast('Saved. A confirmation link was sent to your new email - click it to finish. Until then, log in with your old email.', 'ok'); if (!res.relogin) { renderProfile((v.textContent = '', v)); return; } }
                    if (res.relogin) { toast('Saved. Please log in again with your new details.', 'ok'); setTimeout(logout, 1500); return; }
                    store('masad_who', res.admin.full_name || res.admin.email);
                    $('whoami').textContent = store('masad_who'); $('avatar').textContent = store('masad_who').charAt(0).toUpperCase();
                    toast('Saved', 'ok'); renderProfile((v.textContent = '', v));
                }).catch(function (e2) { err.textContent = e2.message; }).then(function () { save.disabled = false; });
            });
        }).catch(function (e) { v.textContent = ''; v.appendChild(el('p', { 'class': 'error', text: 'Could not load: ' + e.message })); });
    }

    function renderAdmins(v) {
        v.appendChild(el('p', { 'class': 'muted', text: 'Loading...' }));
        api('/admin/admins').then(function (rows) {
            cache.admins = rows; renderNav();
            v.textContent = '';
            v.appendChild(el('div', { 'class': 'warn' }, [el('strong', { text: 'Every administrator has full access. ' }), document.createTextNode('They can change anything on the website and add or remove other administrators. Only add people you trust.')]));
            var list = el('div', { 'class': 'admin-list', style: 'margin-top:16px' });
            rows.forEach(function (a) {
                var nm = a.full_name || a.email;
                var who = el('div', { 'class': 'who' }, [el('strong', {}, [document.createTextNode(nm), a.you ? el('span', { 'class': 'badge you', text: 'You' }) : null]), el('span', { 'class': 'm', text: a.email })]);
                var row = el('div', { 'class': 'admin-row' }, [el('span', { 'class': 'avatar', text: nm.charAt(0).toUpperCase() }), who]);
                if (a.you) {
                    var prof = el('button', { type: 'button', 'class': 'btn small' }, [fa('fa-user-gear'), document.createTextNode(' My profile')]);
                    prof.addEventListener('click', function () { go('profile'); }); row.appendChild(prof);
                } else {
                    var rm = el('button', { type: 'button', 'class': 'btn small danger' }, [fa('fa-user-minus'), document.createTextNode(' Remove')]);
                    rm.addEventListener('click', function () {
                        if (!confirm('Remove ' + nm + ' (' + a.email + ')?\nThey will no longer be able to log in or manage the website.')) return;
                        api('/admin/admins/' + a.id, { method: 'DELETE' }).then(function () { toast('Administrator removed', 'ok'); render(); })
                            .catch(function (e) { toast(e.message, 'err'); });
                    });
                    row.appendChild(rm);
                }
                list.appendChild(row);
            });
            v.appendChild(list);
        }).catch(function (e) { v.textContent = ''; v.appendChild(el('p', { 'class': 'error', text: 'Could not load: ' + e.message })); });
    }

    // ---- add administrator panel ----
    var adminRefs = null;
    function openAdminForm() {
        var box = $('adminFields'); box.textContent = ''; $('adminError').textContent = '';
        var name = el('input', { type: 'text', name: 'full_name', maxlength: 100, placeholder: 'Their name' });
        var mail = el('input', { type: 'email', name: 'email', placeholder: 'their.name@gmail.com', autocomplete: 'off' });
        box.appendChild(el('label', { style: 'margin-top:6px' }, [document.createTextNode('Full name'), name]));
        box.appendChild(el('label', {}, [document.createTextNode('Email (Gmail) - they log in with this'), mail]));
        var pw = passwordField('Password for them (at least 10 characters)', 'password', 'new-password');
        var gen = el('button', { type: 'button', 'class': 'btn small' }, [fa('fa-wand-magic-sparkles'), document.createTextNode(' Generate a strong password')]);
        gen.addEventListener('click', function () { pw.input.value = randomPassword(); pw.input.type = 'text'; });
        box.appendChild(pw.node);
        box.appendChild(el('div', { 'class': 'gen-row' }, [gen]));
        box.appendChild(el('div', { 'class': 'warn' }, [document.createTextNode('Send them the email and password privately (in person or WhatsApp). They can change the password later in My profile.')]));
        adminRefs = { name: name, mail: mail, pw: pw.input };
        $('adminModal').hidden = false; document.body.style.overflow = 'hidden';
        mail.focus();
    }
    function closeAdminForm() { $('adminModal').hidden = true; document.body.style.overflow = ''; }
    $('closeAdmin').addEventListener('click', closeAdminForm);
    $('cancelAdmin').addEventListener('click', closeAdminForm);
    $('adminModal').addEventListener('mousedown', function (e) { if (e.target === $('adminModal')) closeAdminForm(); });
    $('adminForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = $('saveAdmin'); $('adminError').textContent = ''; busy(btn, true, 'Adding...');
        api('/admin/admins', { method: 'POST', json: { full_name: adminRefs.name.value.trim(), email: adminRefs.mail.value.trim(), password: adminRefs.pw.value } })
            .then(function (a) { toast('Administrator added: ' + a.email, 'ok'); closeAdminForm(); render(); })
            .catch(function (err) { $('adminError').textContent = err.message; })
            .then(function () { busy(btn, false); });
    });

    // ------------------------------------------------------------------
    // loading spinner on buttons, mobile drawer, forgot / reset password
    // ------------------------------------------------------------------
    function busy(btn, on, label) {
        if (on) { btn._h = btn.innerHTML; btn.innerHTML = '<span class="spinner"></span> ' + label; btn.classList.add('loading'); btn.disabled = true; }
        else { if (btn._h) btn.innerHTML = btn._h; btn.classList.remove('loading'); btn.disabled = false; }
    }
    function drawer(open) {
        $('sidebar').classList.toggle('open', open);
        $('scrim').hidden = !open;
        $('menuBtn').setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
    }
    $('menuBtn').addEventListener('click', function () { drawer(!$('sidebar').classList.contains('open')); });
    $('scrim').addEventListener('click', function () { drawer(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) drawer(false); });

    function loginPane(which) { ['loginForm', 'forgotForm', 'resetForm'].forEach(function (id) { $(id).hidden = id !== which; }); }
    $('forgotLink').addEventListener('click', function () { $('forgotError').textContent = ''; $('forgotOk').textContent = ''; loginPane('forgotForm'); $('forgotForm').email.focus(); });
    $('forgotBack').addEventListener('click', function () { loginPane('loginForm'); });
    $('forgotForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target, btn = f.querySelector('button[type=submit]'), mail = f.email.value.trim().toLowerCase();
        $('forgotError').textContent = ''; $('forgotOk').textContent = '';
        if (!MAIL_OK.test(mail)) { $('forgotError').textContent = 'Enter your email address.'; return; }
        if (!sb) { $('forgotError').textContent = 'The website is not connected to Supabase yet.'; return; }
        busy(btn, true, 'Sending...');
        sb.auth.resetPasswordForEmail(mail, { redirectTo: location.origin + location.pathname }).then(function (r) {
            if (r.error) { $('forgotError').textContent = /rate|second|too many/i.test(r.error.message) ? 'Please wait a minute before asking again.' : 'Could not send the email. Please try again later.'; return; }
            $('forgotOk').textContent = 'If that email belongs to an administrator, a reset link is on its way. Check your inbox and spam folder.';
        }).catch(function () { $('forgotError').textContent = 'Could not reach the server. Check your internet.'; })
          .then(function () { busy(btn, false); });
    });
    // the link in the email brings the admin back here with #...type=recovery
    function recoveryFromUrl() {
        var h = location.hash || '';
        if (/error_description=/.test(h)) {
            show('login'); loginPane('loginForm');
            $('loginError').textContent = 'That reset link has expired or was already used. Tap "Forgot password?" to get a new one.';
            history.replaceState(null, '', location.pathname); return true;
        }
        if (!/type=recovery/.test(h)) return false;
        show('login'); loginPane('resetForm'); return true;
    }
    $('resetForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target, btn = f.querySelector('button[type=submit]'), err = $('resetError');
        err.textContent = '';
        if (f.password.value.length < 10) { err.textContent = 'Password must be at least 10 characters.'; return; }
        if (f.password.value !== f.password2.value) { err.textContent = 'The two passwords are not the same.'; return; }
        busy(btn, true, 'Saving...');
        sb.auth.getSession().then(function (r) {
            if (!r.data.session) throw new Error('This reset link has expired. Please request a new one.');
            return sb.auth.updateUser({ password: f.password.value });
        }).then(function (r) {
            if (r.error) throw new Error(r.error.message);
            f.reset(); history.replaceState(null, '', location.pathname);
            return sb.auth.signOut();
        }).then(function () {
            loginPane('loginForm'); $('loginOk').textContent = 'Password changed. Log in with your new password.';
        }).catch(function (e2) { err.textContent = e2.message; })
          .then(function () { busy(btn, false); });
    });

    // ------------------------------------------------------------------
    // boot: reuse the session if it is still valid
    // ------------------------------------------------------------------
    if (!recoveryFromUrl()) api('/auth/me').then(function (r) { store('masad_who', r.admin.full_name || r.admin.email); start(); }).catch(function () { show('login'); });
})();
