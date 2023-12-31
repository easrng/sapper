import RootComponent from '__ROOT__';
import ErrorComponent from '__ERROR__';

function goto(href, opts = { replaceState: false }) {
    const target$$1 = select_route(new URL(href, document.baseURI));
    if (target$$1) {
        _history[opts.replaceState ? 'replaceState' : 'pushState']({ id: cid }, '', href);
        return navigate(target$$1, null).then(() => { });
    }
    location.href = href;
    return new Promise(f => { }); // never resolves
}

const ignore = __IGNORE__;
const components = __COMPONENTS__;
const pages = __PAGES__;
let ready = false;
let root_component;
let segments = [];
let current_token;
let root_preload;
let root_data;
let firstTime = true;
const root_props = {
    path: null,
    params: null,
    query: null,
    child: {
        segment: null,
        component: null,
        props: {}
    }
};
let prefetching = null;
function set_prefetching(href, promise) {
    prefetching = { href, promise };
}
let store;
function set_store(fn) {
    store = fn(initial_data.store);
}
let target;
function set_target(element) {
    target = element;
}
let uid = 1;
function set_uid(n) {
    uid = n;
}
let cid;
function set_cid(n) {
    cid = n;
}
const initial_data = typeof __SAPPER__ !== 'undefined' && __SAPPER__;
const _history = typeof history !== 'undefined' ? history : {
    pushState: (state, title, href) => { },
    replaceState: (state, title, href) => { },
    scrollRestoration: ''
};
const scroll_history = {};
function select_route(url) {
    if (url.origin !== location.origin)
        return null;
    if (!url.pathname.startsWith(initial_data.baseUrl))
        return null;
    const path = url.pathname.slice(initial_data.baseUrl.length);
    // avoid accidental clashes between server routes and pages
    if (ignore.some(pattern => pattern.test(path)))
        return;
    for (let i = 0; i < pages.length; i += 1) {
        const page = pages[i];
        const match = page.pattern.exec(path);
        if (match) {
            const query = Object.create(null);
            if (url.search.length > 0) {
                url.search.slice(1).split('&').forEach(searchParam => {
                    let [, key, value] = /([^=]*)(?:=(.*))?/.exec(decodeURIComponent(searchParam));
                    value = (value || '').replace(/\+/g, ' ');
                    if (typeof query[key] === 'string')
                        query[key] = [query[key]];
                    if (typeof query[key] === 'object')
                        query[key].push(value);
                    else
                        query[key] = value;
                });
            }
            return { url, path, page, match, query };
        }
    }
}
function scroll_state() {
    return {
        x: pageXOffset,
        y: pageYOffset
    };
}
function navigate(target, id, noscroll, hash) {
    if (id) {
        // popstate or initial navigation
        cid = id;
    }
    else {
        const current_scroll = scroll_state();
        // clicked on a link. preserve scroll state
        scroll_history[cid] = current_scroll;
        id = cid = ++uid;
        scroll_history[cid] = noscroll ? current_scroll : { x: 0, y: 0 };
    }
    cid = id;
    if (root_component) {
        root_component.set({ preloading: true });
    }
    const loaded = prefetching && prefetching.href === target.url.href ?
        prefetching.promise :
        prepare_page(target);
    prefetching = null;
    const token = current_token = {};
    return loaded.then(({ redirect, data, nullable_depth, new_segments }) => {
        try {
            if (redirect) {
                return goto(redirect.location, { replaceState: true });
            }
            if (!firstTime && segments.length === new_segments.length && segments.every((_, i) => _ === new_segments[i])) {
                return; // nothing changed
            }
            if (new_segments) {
                segments = new_segments;
            }
            render(data, nullable_depth, scroll_history[id], noscroll, hash, token);
            if (document.activeElement)
                document.activeElement.blur();
        }
        finally {
            firstTime = false;
        }
    });
}
function render(data, nullable_depth, scroll, noscroll, hash, token) {
    if (current_token !== token)
        return;
    if (root_component) {
        // first, clear out highest-level root component
        let level = data.child;
        for (let i = 0; i < nullable_depth; i += 1) {
            if (i === nullable_depth)
                break;
            level = level.props.child;
        }
        const { component } = level;
        level.component = null;
        root_component.set({ child: data.child });
        // then render new stuff
        level.component = component;
        root_component.set(data);
    }
    else {
        // first load — remove SSR'd <head> contents
        const start = document.querySelector('#sapper-head-start');
        const end = document.querySelector('#sapper-head-end');
        if (start && end) {
            while (start.nextSibling !== end)
                detach(start.nextSibling);
            detach(start);
            detach(end);
        }
        Object.assign(data, root_data);
        root_component = new RootComponent({
            target,
            data,
            store,
            hydrate: true
        });
    }
    if (!noscroll) {
        if (hash) {
            try {
                // scroll is an element id (from a hash), we need to compute y.
                const deep_linked = document.querySelector(hash);
                if (deep_linked) {
                    scroll = {
                        x: 0,
                        y: deep_linked.getBoundingClientRect().top
                    };
                }
            }
            catch (e) { }
        }
        scroll_history[cid] = scroll;
        if (scroll)
            scrollTo(scroll.x, scroll.y);
    }
    Object.assign(root_props, data);
    ready = true;
}
function prepare_page(target) {
    const { page, path, query } = target;
    const new_segments = path.split('/').filter(Boolean);
    let changed_from = 0;
    while (segments[changed_from] &&
        new_segments[changed_from] &&
        segments[changed_from] === new_segments[changed_from])
        changed_from += 1;
    if (changed_from === new_segments.length) {
        changed_from -= 1;
    }
    let redirect = null;
    let error = null;
    const preload_context = {
        store,
        fetch: (url, opts) => fetch(url, opts),
        redirect: (statusCode, location) => {
            if (redirect && (redirect.statusCode !== statusCode || redirect.location !== location)) {
                throw new Error(`Conflicting redirects`);
            }
            redirect = { statusCode, location };
        },
        error: (statusCode, message) => {
            error = { statusCode, message };
        }
    };
    if (!root_preload) {
        root_preload = RootComponent.preload
            ? initial_data.preloaded[0] || RootComponent.preload.call(preload_context, {
                path,
                query,
                params: {}
            })
            : {};
    }
    return Promise.all(page.parts.map((part, i) => {
        if (i < changed_from)
            return null;
        if (!part)
            return null;
        return load_component(components[part.i]).then(Component => {
            const req = {
                path,
                query,
                params: part.params ? part.params(target.match) : {}
            };
            let preloaded;
            if (ready || !initial_data.preloaded[i + 1]) {
                preloaded = Component.preload
                    ? Component.preload.call(preload_context, req)
                    : {};
            }
            else {
                preloaded = initial_data.preloaded[i + 1];
            }
            return Promise.resolve(preloaded).then(preloaded => {
                return { Component, preloaded };
            });
        });
    })).catch(err => {
        error = { statusCode: 500, message: err };
        return [];
    }).then(results => {
        if (root_data) {
            return results;
        }
        else {
            return Promise.resolve(root_preload).then(value => {
                root_data = value;
                return results;
            });
        }
    }).then(results => {
        if (redirect) {
            return { redirect, new_segments };
        }
        const get_params = page.parts[page.parts.length - 1].params || (() => ({}));
        const params = get_params(target.match);
        if (error) {
            const props = {
                path,
                query,
                params,
                error: typeof error.message === 'string' ? new Error(error.message) : error.message,
                status: error.statusCode
            };
            return {
                new_segments,
                data: Object.assign({}, props, {
                    preloading: false,
                    child: {
                        component: ErrorComponent,
                        props
                    }
                })
            };
        }
        const props = { path, query, error: null, status: null };
        const data = {
            path,
            preloading: false,
            child: Object.assign({}, root_props.child, {
                segment: new_segments[0]
            })
        };
        if (changed(query, root_props.query))
            data.query = query;
        if (changed(params, root_props.params))
            data.params = params;
        let level = data.child;
        let nullable_depth = 0;
        for (let i = 0; i < page.parts.length; i += 1) {
            const part = page.parts[i];
            if (!part)
                continue;
            const get_params = part.params || (() => ({}));
            if (i < changed_from) {
                level.props.path = path;
                level.props.query = query;
                level.props.child = Object.assign({}, level.props.child);
                level.props.params = get_params(target.match);
                nullable_depth += 1;
            }
            else {
                level.component = results[i].Component;
                level.props = Object.assign({}, level.props, props, {
                    params: get_params(target.match),
                }, results[i].preloaded);
                level.props.child = {};
            }
            level = level.props.child;
            level.segment = new_segments[i + 1];
        }
        return { data, nullable_depth, new_segments };
    });
}
function load_css(chunk) {
    const href = `client/${chunk}`;
    if (document.querySelector(`link[href="${href}"]`))
        return;
    return new Promise((fulfil, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => fulfil();
        link.onerror = reject;
        document.head.appendChild(link);
    });
}
function load_component(component) {
    // TODO this is temporary — once placeholders are
    // always rewritten, scratch the ternary
    const promises = (typeof component.css === 'string' ? [] : component.css.map(load_css));
    promises.unshift(component.js());
    return Promise.all(promises).then(values => values[0].default);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function changed(a, b) {
    return JSON.stringify(a) !== JSON.stringify(b);
}

function prefetch(href) {
    const target$$1 = select_route(new URL(href, document.baseURI));
    if (target$$1) {
        if (!prefetching || href !== prefetching.href) {
            set_prefetching(href, prepare_page(target$$1));
        }
        return prefetching.promise;
    }
}

function start(opts) {
    if ('scrollRestoration' in _history) {
        _history.scrollRestoration = 'manual';
    }
    set_target(opts.target);
    if (opts.store)
        set_store(opts.store);
    addEventListener('click', handle_click);
    addEventListener('popstate', handle_popstate);
    // prefetch
    addEventListener('touchstart', trigger_prefetch);
    addEventListener('mousemove', handle_mousemove);
    return Promise.resolve().then(() => {
        const { hash, href } = location;
        _history.replaceState({ id: uid }, '', href);
        if (!initial_data.error) {
            const target$$1 = select_route(new URL(location.href));
            if (target$$1)
                return navigate(target$$1, uid, false, hash);
        }
    });
}
let mousemove_timeout;
function handle_mousemove(event) {
    clearTimeout(mousemove_timeout);
    mousemove_timeout = setTimeout(() => {
        trigger_prefetch(event);
    }, 20);
}
function trigger_prefetch(event) {
    const a = find_anchor(event.target);
    if (!a || a.rel !== 'prefetch')
        return;
    prefetch(a.href);
}
function handle_click(event) {
    // Adapted from https://github.com/visionmedia/page.js
    // MIT license https://github.com/visionmedia/page.js#license
    if (which(event) !== 1)
        return;
    if (event.metaKey || event.ctrlKey || event.shiftKey)
        return;
    if (event.defaultPrevented)
        return;
    const a = find_anchor(event.target);
    if (!a)
        return;
    if (!a.href)
        return;
    // check if link is inside an svg
    // in this case, both href and target are always inside an object
    const svg = typeof a.href === 'object' && a.href.constructor.name === 'SVGAnimatedString';
    const href = String(svg ? a.href.baseVal : a.href);
    if (href === location.href) {
        if (!location.hash)
            event.preventDefault();
        return;
    }
    // Ignore if tag has
    // 1. 'download' attribute
    // 2. rel='external' attribute
    if (a.hasAttribute('download') || a.getAttribute('rel') === 'external')
        return;
    // Ignore if <a> has a target
    if (svg ? a.target.baseVal : a.target)
        return;
    const url = new URL(href);
    // Don't handle hash changes
    if (url.pathname === location.pathname && url.search === location.search)
        return;
    const target$$1 = select_route(url);
    if (target$$1) {
        const noscroll = a.hasAttribute('sapper-noscroll');
        navigate(target$$1, null, noscroll, url.hash);
        event.preventDefault();
        _history.pushState({ id: cid }, '', url.href);
    }
}
function which(event) {
    return event.which === null ? event.button : event.which;
}
function find_anchor(node) {
    while (node && node.nodeName.toUpperCase() !== 'A')
        node = node.parentNode; // SVG <a> elements have a lowercase name
    return node;
}
function handle_popstate(event) {
    scroll_history[cid] = scroll_state();
    if (event.state) {
        const url = new URL(location.href);
        const target$$1 = select_route(url);
        if (target$$1) {
            navigate(target$$1, event.state.id);
        }
        else {
            location.href = location.href;
        }
    }
    else {
        // hashchange
        set_uid(uid + 1);
        set_cid(uid);
        _history.replaceState({ id: cid }, '', location.href);
    }
}

function prefetchRoutes(pathnames) {
    return pages
        .filter(route => {
        if (!pathnames)
            return true;
        return pathnames.some(pathname => route.pattern.test(pathname));
    })
        .reduce((promise, route) => promise.then(() => {
        return Promise.all(route.parts.map(part => part && load_component(components[part.i])));
    }), Promise.resolve());
}

export { start, goto, prefetch, prefetchRoutes };
