'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tslib = require('tslib');
var fs = require('fs');
var fs__default = _interopDefault(fs);
var path = require('path');
var path__default = _interopDefault(path);
var __chunk_4 = require('./chunk-7cffb8b5.js');

function toArr(any) {
	return any == null ? [] : Array.isArray(any) ? any : [any];
}

function toVal(out, key, val, opts) {
	var x, old=out[key], nxt=(
		!!~opts.string.indexOf(key) ? (val == null || val === true ? '' : String(val))
		: typeof val === 'boolean' ? val
		: !!~opts.boolean.indexOf(key) ? (val === 'false' ? false : val === 'true' || (out._.push((x = +val,x * 0 === 0) ? x : val),!!val))
		: (x = +val,x * 0 === 0) ? x : val
	);
	out[key] = old == null ? nxt : (Array.isArray(old) ? old.concat(nxt) : [old, nxt]);
}

function e (args, opts) {
	args = args || [];
	opts = opts || {};

	var k, arr, arg, name, val, out={ _:[] };
	var i=0, j=0, idx=0, len=args.length;

	const alibi = opts.alias !== void 0;
	const strict = opts.unknown !== void 0;
	const defaults = opts.default !== void 0;

	opts.alias = opts.alias || {};
	opts.string = toArr(opts.string);
	opts.boolean = toArr(opts.boolean);

	if (alibi) {
		for (k in opts.alias) {
			arr = opts.alias[k] = toArr(opts.alias[k]);
			for (i=0; i < arr.length; i++) {
				(opts.alias[arr[i]] = arr.concat(k)).splice(i, 1);
			}
		}
	}

	for (i=opts.boolean.length; i-- > 0;) {
		arr = opts.alias[opts.boolean[i]] || [];
		for (j=arr.length; j-- > 0;) opts.boolean.push(arr[j]);
	}

	for (i=opts.string.length; i-- > 0;) {
		arr = opts.alias[opts.string[i]] || [];
		for (j=arr.length; j-- > 0;) opts.string.push(arr[j]);
	}

	if (defaults) {
		for (k in opts.default) {
			name = typeof opts.default[k];
			arr = opts.alias[k] = opts.alias[k] || [];
			if (opts[name] !== void 0) {
				opts[name].push(k);
				for (i=0; i < arr.length; i++) {
					opts[name].push(arr[i]);
				}
			}
		}
	}

	const keys = strict ? Object.keys(opts.alias) : [];

	for (i=0; i < len; i++) {
		arg = args[i];

		if (arg === '--') {
			out._ = out._.concat(args.slice(++i));
			break;
		}

		for (j=0; j < arg.length; j++) {
			if (arg.charCodeAt(j) !== 45) break; // "-"
		}

		if (j === 0) {
			out._.push(arg);
		} else if (arg.substring(j, j + 3) === 'no-') {
			name = arg.substring(j + 3);
			if (strict && !~keys.indexOf(name)) {
				return opts.unknown(arg);
			}
			out[name] = false;
		} else {
			for (idx=j+1; idx < arg.length; idx++) {
				if (arg.charCodeAt(idx) === 61) break; // "="
			}

			name = arg.substring(j, idx);
			val = arg.substring(++idx) || (i+1 === len || (''+args[i+1]).charCodeAt(0) === 45 || args[++i]);
			arr = (j === 2 ? [name] : name);

			for (idx=0; idx < arr.length; idx++) {
				name = arr[idx];
				if (strict && !~keys.indexOf(name)) return opts.unknown('-'.repeat(j) + name);
				toVal(out, name, (idx + 1 < arr.length) || val, opts);
			}
		}
	}

	if (defaults) {
		for (k in opts.default) {
			if (out[k] === void 0) {
				out[k] = opts.default[k];
			}
		}
	}

	if (alibi) {
		for (k in out) {
			arr = opts.alias[k] || [];
			while (arr.length > 0) {
				out[arr.shift()] = out[k];
			}
		}
	}

	return out;
}

const t="__all__",i="__default__",s="\n";function r(e$$1){if(!e$$1.length)return "";let t=function(e$$1){let t=0,i=0,s=0,r=e$$1.length;if(r)for(;r--;)i=e$$1[r].length,i>t&&(s=r,t=i);return e$$1[s].length}(e$$1.map(e$$1=>e$$1[0]))+4;return e$$1.map(e$$1=>e$$1[0]+" ".repeat(t-e$$1[0].length)+e$$1[1]+(null==e$$1[2]?"":`  (default ${e$$1[2]})`))}function n(e$$1){return e$$1}function l(e$$1,t,i){if(!t||!t.length)return "";let r=0,n="";for(n+="\n  "+e$$1;r<t.length;r++)n+="\n    "+i(t[r]);return n+s}function a(e$$1,t,i=1){let s=l("ERROR",[t],n);s+=`\n  Run \`$ ${e$$1} --help\` for more info.\n`,console.error(s),process.exit(i);}class o{constructor(e$$1,s){let[r,...n]=e$$1.split(/\s+/);s=s||n.length>0,this.bin=r,this.ver="0.0.0",this.default="",this.tree={},this.command(t),this.command([i].concat(s?n:"<command>").join(" ")),this.single=s,this.curr="";}command(e$$1,t,i={}){if(this.single)throw new Error('Disable "single" mode to add commands');let s=[],r=[],n=/(\[|<)/;if(e$$1.split(/\s+/).forEach(e$$1=>{(n.test(e$$1.charAt(0))?r:s).push(e$$1);}),s=s.join(" "),s in this.tree)throw new Error("Command already exists: "+s);return s.includes("__")||r.unshift(s),r=r.join(" "),this.curr=s,i.default&&(this.default=s),this.tree[s]={usage:r,alibi:[],options:[],alias:{},default:{},examples:[]},i.alias&&this.alias(i.alias),t&&this.describe(t),this}describe(e$$1){return this.tree[this.curr||i].describe=Array.isArray(e$$1)?e$$1:function(e$$1){return (e$$1||"").replace(/([.?!])\s*(?=[A-Z])/g,"$1|").split("|")}(e$$1),this}alias(...e$$1){if(this.single)throw new Error('Cannot call `alias()` in "single" mode');if(!this.curr)throw new Error("Cannot call `alias()` before defining a command");return (this.tree[this.curr].alibi=this.tree[this.curr].alibi.concat(...e$$1)).forEach(e$$1=>this.tree[e$$1]=this.curr),this}option(e$$1,i,s){let r=this.tree[this.curr||t],[n,l]=function(e$$1){return (e$$1||"").split(/^-{1,2}|,|\s+-{1,2}|\s+/).filter(Boolean)}(e$$1);if(l&&l.length>1&&([n,l]=[l,n]),e$$1="--"+n,l&&l.length>0){e$$1=`-${l}, ${e$$1}`;let t=r.alias[l];r.alias[l]=(t||[]).concat(n);}let a=[e$$1,i||""];return void 0!==s?(a.push(s),r.default[n]=s):l||(r.default[n]=void 0),r.options.push(a),this}action(e$$1){return this.tree[this.curr||i].handler=e$$1,this}example(e$$1){return this.tree[this.curr||i].examples.push(e$$1),this}version(e$$1){return this.ver=e$$1,this}parse(s,r={}){s=s.slice();let n,l,o,h,u=2,f=e(s.slice(u),{alias:{h:"help",v:"version"}}),c=this.single,p=this.bin,d="";if(c)h=this.tree[i];else{let e$$1,t=1,i=f._.length+1;for(;t<i;t++)if(n=f._.slice(0,t).join(" "),e$$1=this.tree[n],"string"==typeof e$$1)l=(d=e$$1).split(" "),s.splice(s.indexOf(f._[0]),t,...l),t+=l.length-t;else if(e$$1)d=n;else if(d)break;if(h=this.tree[d],o=void 0===h,o)if(this.default)d=this.default,h=this.tree[d],s.unshift(d),u++;else if(n)return a(p,"Invalid command: "+n)}if(f.help)return this.help(!c&&!o&&d);if(f.version)return this._version();if(!c&&void 0===h)return a(p,"No command specified.");let g=this.tree[t];r.alias=Object.assign(g.alias,h.alias,r.alias),r.default=Object.assign(g.default,h.default,r.default),n=d.split(" "),l=s.indexOf(n[0],2),~l&&s.splice(l,n.length);let m=e(s.slice(u),r);if(!m||"string"==typeof m)return a(p,m||"Parsed unknown option flag(s)!");let b=h.usage.split(/\s+/),_=b.filter(e$$1=>"<"===e$$1.charAt(0)),v=m._.splice(0,_.length);if(v.length<_.length)return d&&(p+=" "+d),a(p,"Insufficient arguments!");b.filter(e$$1=>"["===e$$1.charAt(0)).forEach(e$$1=>{v.push(m._.shift());}),v.push(m);let $=h.handler;return r.lazy?{args:v,name:d,handler:$}:$.apply(null,v)}help(e$$1){console.log(function(e$$1,a,o,h){let u="",f=a[o],c="$ "+e$$1,p=a[t],d=e$$1=>`${c} ${e$$1}`.replace(/\s+/g," "),g=[["-h, --help","Displays this message"]];if(o===i&&g.unshift(["-v, --version","Displays current version"]),f.options=(f.options||[]).concat(p.options,g),f.options.length>0&&(f.usage+=" [options]"),u+=l("Description",f.describe,n),u+=l("Usage",[f.usage],d),h||o!==i)h||o===i||(u+=l("Aliases",f.alibi,d));else{let e$$1,t=/^__/,i="",o=[];for(e$$1 in a)"string"==typeof a[e$$1]||t.test(e$$1)||o.push([e$$1,(a[e$$1].describe||[""])[0]])<3&&(i+=`\n    ${c} ${e$$1} --help`);u+=l("Available Commands",r(o),n),u+="\n  For more info, run any command with the `--help` flag"+i+s;}return u+=l("Options",r(f.options),n),u+=l("Examples",f.examples.map(d),n),u}(this.bin,this.tree,e$$1||i,this.single));}_version(){console.log(`${this.bin}, ${this.ver}`);}}var sade = (e$$1,t)=>new o(e$$1,t);

var version = "0.27.12";

var prog = sade('sapper').version(version);
if (process.argv[2] === 'start') {
    // remove this in a future version
    console.error(__chunk_4.colors.bold.red("'sapper start' has been removed"));
    console.error("Use 'node [build_dir]' instead");
    process.exit(1);
}
var start = Date.now();
prog.command('dev')
    .describe('Start a development server')
    .option('-p, --port', 'Specify a port')
    .option('-o, --open', 'Open a browser window')
    .option('--dev-port', 'Specify a port for development server')
    .option('--hot', 'Use hot module replacement (requires webpack)', true)
    .option('--live', 'Reload on changes if not using --hot', true)
    .option('--bundler', 'Specify a bundler (rollup or webpack)')
    .option('--cwd', 'Current working directory', '.')
    .option('--src', 'Source directory', 'src')
    .option('--routes', 'Routes directory', 'src/routes')
    .option('--static', 'Static files directory', 'static')
    .option('--output', 'Sapper output directory', '__sapper__')
    .option('--build-dir', 'Development build directory', '__sapper__/dev')
    .action(function (opts) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    var dev, watcher, first_1;
    return tslib.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve(require("./dev.js"))];
            case 1:
                dev = (_a.sent()).dev;
                try {
                    watcher = dev({
                        cwd: opts.cwd,
                        src: opts.src,
                        routes: opts.routes,
                        static: opts.static,
                        output: opts.output,
                        dest: opts['build-dir'],
                        port: opts.port,
                        'dev-port': opts['dev-port'],
                        live: opts.live,
                        hot: opts.hot,
                        bundler: opts.bundler
                    });
                    first_1 = true;
                    watcher.on('stdout', function (data) {
                        process.stdout.write(data);
                    });
                    watcher.on('stderr', function (data) {
                        process.stderr.write(data);
                    });
                    watcher.on('ready', function (event) { return tslib.__awaiter(void 0, void 0, void 0, function () {
                        var exec;
                        return tslib.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!first_1) return [3 /*break*/, 3];
                                    console.log(__chunk_4.colors.bold.cyan("> Listening on http://localhost:" + event.port));
                                    if (!opts.open) return [3 /*break*/, 2];
                                    return [4 /*yield*/, Promise.resolve(require('child_process'))];
                                case 1:
                                    exec = (_a.sent()).exec;
                                    exec("open http://localhost:" + event.port);
                                    _a.label = 2;
                                case 2:
                                    first_1 = false;
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    watcher.on('invalid', function (event) {
                        var changed = event.changed.map(function (filename) { return path.relative(process.cwd(), filename); }).join(', ');
                        console.log("\n" + __chunk_4.colors.bold.cyan(changed) + " changed. rebuilding...");
                    });
                    watcher.on('error', function (event) {
                        console.log(__chunk_4.colors.red("\u2717 " + event.type));
                        console.log(__chunk_4.colors.red(event.message));
                    });
                    watcher.on('fatal', function (event) {
                        console.log(__chunk_4.colors.bold.red("> " + event.message));
                        if (event.log)
                            console.log(event.log);
                    });
                    watcher.on('build', function (event) {
                        if (event.errors.length) {
                            console.log(__chunk_4.colors.bold.red("\u2717 " + event.type));
                            event.errors.filter(function (e) { return !e.duplicate; }).forEach(function (error) {
                                if (error.file)
                                    console.log(__chunk_4.colors.bold(error.file));
                                console.log(error.message);
                            });
                            var hidden = event.errors.filter(function (e) { return e.duplicate; }).length;
                            if (hidden > 0) {
                                console.log(hidden + " duplicate " + (hidden === 1 ? 'error' : 'errors') + " hidden\n");
                            }
                        }
                        else if (event.warnings.length) {
                            console.log(__chunk_4.colors.bold.yellow("\u2022 " + event.type));
                            event.warnings.filter(function (e) { return !e.duplicate; }).forEach(function (warning) {
                                if (warning.file)
                                    console.log(__chunk_4.colors.bold(warning.file));
                                console.log(warning.message);
                            });
                            var hidden = event.warnings.filter(function (e) { return e.duplicate; }).length;
                            if (hidden > 0) {
                                console.log(hidden + " duplicate " + (hidden === 1 ? 'warning' : 'warnings') + " hidden\n");
                            }
                        }
                        else {
                            console.log(__chunk_4.colors.bold.green("\u2714 " + event.type) + " " + __chunk_4.colors.gray("(" + __chunk_4.format_milliseconds(event.duration) + ")"));
                        }
                    });
                }
                catch (err) {
                    console.log(__chunk_4.colors.bold.red("> " + err.message));
                    process.exit(1);
                }
                return [2 /*return*/];
        }
    });
}); });
prog.command('build [dest]')
    .describe('Create a production-ready version of your app')
    .option('-p, --port', 'Default of process.env.PORT', '3000')
    .option('--bundler', 'Specify a bundler (rollup or webpack, blank for auto)')
    .option('--legacy', 'Create separate legacy build')
    .option('--cwd', 'Current working directory', '.')
    .option('--src', 'Source directory', 'src')
    .option('--routes', 'Routes directory', 'src/routes')
    .option('--output', 'Sapper output directory', '__sapper__')
    .example("build custom-dir -p 4567")
    .action(function (dest, opts) {
    if (dest === void 0) { dest = '__sapper__/build'; }
    return tslib.__awaiter(void 0, void 0, void 0, function () {
        var launcher, err_1;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("> Building...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, _build(opts.bundler, opts.legacy, opts.cwd, opts.src, opts.routes, opts.output, dest)];
                case 2:
                    _a.sent();
                    launcher = path.resolve(dest, 'index.js');
                    fs.writeFileSync(launcher, ("\n\t\t\t\t// generated by sapper build at " + new Date().toISOString() + "\n\t\t\t\tprocess.env.NODE_ENV = process.env.NODE_ENV || 'production';\n\t\t\t\tprocess.env.PORT = process.env.PORT || " + (opts.port || 3000) + ";\n\n\t\t\t\tconsole.log('Starting server on port ' + process.env.PORT);\n\t\t\t\trequire('./server/server.js');\n\t\t\t").replace(/^\t+/gm, '').trim());
                    console.error("\n> Finished in " + __chunk_4.elapsed(start) + ". Type " + __chunk_4.colors.bold.cyan("node " + dest) + " to run the app.");
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log("" + __chunk_4.colors.bold.red("> " + err_1.message));
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
prog.command('export [dest]')
    .describe('Export your app as static files (if possible)')
    .option('--build', '(Re)build app before exporting', true)
    .option('--basepath', 'Specify a base path')
    .option('--timeout', 'Milliseconds to wait for a page (--no-timeout to disable)', 5000)
    .option('--legacy', 'Create separate legacy build')
    .option('--bundler', 'Specify a bundler (rollup or webpack, blank for auto)')
    .option('--cwd', 'Current working directory', '.')
    .option('--src', 'Source directory', 'src')
    .option('--routes', 'Routes directory', 'src/routes')
    .option('--static', 'Static files directory', 'static')
    .option('--output', 'Sapper output directory', '__sapper__')
    .option('--build-dir', 'Intermediate build directory', '__sapper__/build')
    .action(function (dest, opts) {
    if (dest === void 0) { dest = '__sapper__/export'; }
    return tslib.__awaiter(void 0, void 0, void 0, function () {
        var _export, pb_1, err_2;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    if (!opts.build) return [3 /*break*/, 2];
                    console.log("> Building...");
                    return [4 /*yield*/, _build(opts.bundler, opts.legacy, opts.cwd, opts.src, opts.routes, opts.output, opts['build-dir'])];
                case 1:
                    _a.sent();
                    console.error("\n> Built in " + __chunk_4.elapsed(start));
                    _a.label = 2;
                case 2: return [4 /*yield*/, Promise.resolve(require("./export.js"))];
                case 3:
                    _export = (_a.sent()).export;
                    return [4 /*yield*/, Promise.resolve(require("./pretty-bytes.js"))];
                case 4:
                    pb_1 = (_a.sent()).default;
                    return [4 /*yield*/, _export({
                            cwd: opts.cwd,
                            static: opts.static,
                            build_dir: opts['build-dir'],
                            export_dir: dest,
                            basepath: opts.basepath,
                            timeout: opts.timeout,
                            oninfo: function (event) {
                                console.log(__chunk_4.colors.bold.cyan("> " + event.message));
                            },
                            onfile: function (event) {
                                var size_color = event.size > 150000 ? __chunk_4.colors.bold.red : event.size > 50000 ? __chunk_4.colors.bold.yellow : __chunk_4.colors.bold.gray;
                                var size_label = size_color(__chunk_4.left_pad(pb_1(event.size), 10));
                                var file_label = event.status === 200
                                    ? event.file
                                    : __chunk_4.colors.bold[event.status >= 400 ? 'red' : 'yellow']("(" + event.status + ") " + event.file);
                                console.log(size_label + "   " + file_label);
                            }
                        })];
                case 5:
                    _a.sent();
                    console.error("\n> Finished in " + __chunk_4.elapsed(start) + ". Type " + __chunk_4.colors.bold.cyan("npx serve " + dest) + " to run the app.");
                    return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    console.error(__chunk_4.colors.bold.red("> " + err_2.message));
                    process.exit(1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
prog.parse(process.argv);
function _build(bundler, legacy, cwd, src, routes, output, dest) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var build;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve(require("./build.js"))];
                case 1:
                    build = (_a.sent()).build;
                    return [4 /*yield*/, build({
                            bundler: bundler,
                            legacy: legacy,
                            cwd: cwd,
                            src: src,
                            routes: routes,
                            dest: dest,
                            oncompile: function (event) {
                                var banner = "built " + event.type;
                                var c = __chunk_4.colors.cyan;
                                var warnings = event.result.warnings;
                                if (warnings.length > 0) {
                                    banner += " with " + warnings.length + " " + (warnings.length === 1 ? 'warning' : 'warnings');
                                    c = __chunk_4.colors.yellow;
                                }
                                console.log();
                                console.log(c("\u250C\u2500" + __chunk_4.repeat('─', banner.length) + "\u2500\u2510"));
                                console.log(c("\u2502 " + __chunk_4.colors.bold(banner) + " \u2502"));
                                console.log(c("\u2514\u2500" + __chunk_4.repeat('─', banner.length) + "\u2500\u2518"));
                                console.log(event.result.print());
                            }
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=cli.js.map
