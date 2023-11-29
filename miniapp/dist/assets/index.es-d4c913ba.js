import { am as getAugmentedNamespace, an as cjs$3, ao as binary, ap as wipe, aq as random, ar as fromString, as as toString, at as concat, au as commonjsGlobal, a5 as getDefaultExportFromCjs, av as w$1, aw as Dt$1, ax as kt$1, ay as N$2, az as jn, aA as Dn, aB as kn, aC as Vn$1, aD as Re, aE as Fn, aF as Kn, aG as xn, aH as Ln, aI as ee$1, aJ as $$1, aK as p$2, aL as it$1, aM as Zt, aN as Jn, aO as Xt, aP as _$2, aQ as lt$1, aR as Nt$1, aS as bt$1, aT as st$1, aU as ft$2, aV as U$2, aW as dt$1, aX as xt$1, aY as jt, aZ as h$2, a_ as ut$1, a$ as ct$1, b0 as at$1, b1 as j$2, b2 as q$1, b3 as te, b4 as et$1, b5 as nt$1, b6 as Mn, b7 as mt$1, b8 as yt$1, b9 as D$3, ba as zn, bb as B$1, bc as At$1, bd as pt$1, be as $t$1, bf as er$1, bg as Kt$1, bh as Mt$1, bi as cn, bj as un, bk as Ft$1, bl as an, bm as Vt$1, bn as Gt, bo as Ht, bp as Wt, bq as Qt, br as qt$1, bs as Bt$1, bt as zt$1, bu as Lt$1, bv as Xe$1, bw as oe$2, bx as S$2, by as ve, bz as Rn, a9 as __vitePreload } from "./index-d859b153.js";
import { e as eventsExports, $ as $g } from "./events-62bb3456.js";
const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.at(-1) === '"' && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
function checkBufferSupport() {
  if (typeof Buffer === void 0) {
    throw new TypeError("[unstorage] Buffer is not supported!");
  }
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  checkBufferSupport();
  const base64 = Buffer.from(value).toString("base64");
  return BASE64_PREFIX + base64;
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  checkBufferSupport();
  return Buffer.from(value.slice(BASE64_PREFIX.length), "base64");
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}
function joinKeys(...keys2) {
  return normalizeKey(keys2.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey(base);
  return base ? base + ":" : "";
}
function defineDriver(factory) {
  return factory;
}
const DRIVER_NAME = "memory";
const memory = defineDriver(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME,
    options: {},
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return Array.from(data.keys());
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});
function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          await asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      for (const mount of mounts) {
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        const keys2 = rawKeys.map((key) => mount.mountpoint + normalizeKey(key)).filter((key) => !maskedMounts.some((p3) => key.startsWith(p3)));
        allKeys.push(...keys2);
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p3) => !p3.startsWith(mount.mountpoint))
        ];
      }
      return base ? allKeys.filter((key) => key.startsWith(base) && !key.endsWith("$")) : allKeys.filter((key) => !key.endsWith("$"));
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m2) => {
          if (m2.driver.clear) {
            return asyncCall(m2.driver.clear, m2.relativeBase, opts);
          }
          if (m2.driver.removeItem) {
            const keys2 = await m2.driver.getKeys(m2.relativeBase || "", opts);
            return Promise.all(
              keys2.map((key) => m2.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a2, b3) => b3.length - a2.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      const m2 = getMount(key);
      return {
        driver: m2.driver,
        base: m2.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m2) => ({
        driver: m2.driver,
        base: m2.mountpoint
      }));
    }
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  const request = indexedDB.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbp = promisifyRequest(request);
  return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
let defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
function get(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function set(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
function del(key, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
}
function clear(customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.clear();
    return promisifyRequest(store.transaction);
  });
}
function eachCursor(store, callback) {
  store.openCursor().onsuccess = function() {
    if (!this.result)
      return;
    callback(this.result);
    this.result.continue();
  };
  return promisifyRequest(store.transaction);
}
function keys(customStore = defaultGetStore()) {
  return customStore("readonly", (store) => {
    if (store.getAllKeys) {
      return promisifyRequest(store.getAllKeys());
    }
    const items = [];
    return eachCursor(store, (cursor) => items.push(cursor.key)).then(() => items);
  });
}
const JSONStringify = (data) => JSON.stringify(data, (_3, value) => typeof value === "bigint" ? value.toString() + "n" : value);
const JSONParse = (json) => {
  const numbersBiggerThanMaxInt = /([\[:])?(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))([,\}\]])/g;
  const serializedData = json.replace(numbersBiggerThanMaxInt, '$1"$2n"$3');
  return JSON.parse(serializedData, (_3, value) => {
    const isCustomFormatBigInt = typeof value === "string" && value.match(/^\d+n$/);
    if (isCustomFormatBigInt)
      return BigInt(value.substring(0, value.length - 1));
    return value;
  });
};
function safeJsonParse(value) {
  if (typeof value !== "string") {
    throw new Error(`Cannot safe json parse value of type ${typeof value}`);
  }
  try {
    return JSONParse(value);
  } catch (_a) {
    return value;
  }
}
function safeJsonStringify(value) {
  return typeof value === "string" ? value : JSONStringify(value) || "";
}
const x = "idb-keyval";
var z$1 = (i = {}) => {
  const t = i.base && i.base.length > 0 ? `${i.base}:` : "", e = (s) => t + s;
  let n2;
  return i.dbName && i.storeName && (n2 = createStore(i.dbName, i.storeName)), { name: x, options: i, async hasItem(s) {
    return !(typeof await get(e(s), n2) > "u");
  }, async getItem(s) {
    return await get(e(s), n2) ?? null;
  }, setItem(s, a2) {
    return set(e(s), a2, n2);
  }, removeItem(s) {
    return del(e(s), n2);
  }, getKeys() {
    return keys(n2);
  }, clear() {
    return clear(n2);
  } };
};
const D$2 = "WALLET_CONNECT_V2_INDEXED_DB", E$2 = "keyvaluestorage";
let _$1 = class _ {
  constructor() {
    this.indexedDb = createStorage({ driver: z$1({ dbName: D$2, storeName: E$2 }) });
  }
  async getKeys() {
    return this.indexedDb.getKeys();
  }
  async getEntries() {
    return (await this.indexedDb.getItems(await this.indexedDb.getKeys())).map((t) => [t.key, t.value]);
  }
  async getItem(t) {
    const e = await this.indexedDb.getItem(t);
    if (e !== null)
      return e;
  }
  async setItem(t, e) {
    await this.indexedDb.setItem(t, safeJsonStringify(e));
  }
  async removeItem(t) {
    await this.indexedDb.removeItem(t);
  }
};
var l = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, c = { exports: {} };
(function() {
  let i;
  function t() {
  }
  i = t, i.prototype.getItem = function(e) {
    return this.hasOwnProperty(e) ? String(this[e]) : null;
  }, i.prototype.setItem = function(e, n2) {
    this[e] = String(n2);
  }, i.prototype.removeItem = function(e) {
    delete this[e];
  }, i.prototype.clear = function() {
    const e = this;
    Object.keys(e).forEach(function(n2) {
      e[n2] = void 0, delete e[n2];
    });
  }, i.prototype.key = function(e) {
    return e = e || 0, Object.keys(this)[e];
  }, i.prototype.__defineGetter__("length", function() {
    return Object.keys(this).length;
  }), typeof l < "u" && l.localStorage ? c.exports = l.localStorage : typeof window < "u" && window.localStorage ? c.exports = window.localStorage : c.exports = new t();
})();
function k(i) {
  var t;
  return [i[0], safeJsonParse((t = i[1]) != null ? t : "")];
}
let K$1 = class K {
  constructor() {
    this.localStorage = c.exports;
  }
  async getKeys() {
    return Object.keys(this.localStorage);
  }
  async getEntries() {
    return Object.entries(this.localStorage).map(k);
  }
  async getItem(t) {
    const e = this.localStorage.getItem(t);
    if (e !== null)
      return safeJsonParse(e);
  }
  async setItem(t, e) {
    this.localStorage.setItem(t, safeJsonStringify(e));
  }
  async removeItem(t) {
    this.localStorage.removeItem(t);
  }
};
const N$1 = "wc_storage_version", y$2 = 1, O$2 = async (i, t, e) => {
  const n2 = N$1, s = await t.getItem(n2);
  if (s && s >= y$2) {
    e(t);
    return;
  }
  const a2 = await i.getKeys();
  if (!a2.length) {
    e(t);
    return;
  }
  const m2 = [];
  for (; a2.length; ) {
    const r = a2.shift();
    if (!r)
      continue;
    const o = r.toLowerCase();
    if (o.includes("wc@") || o.includes("walletconnect") || o.includes("wc_") || o.includes("wallet_connect")) {
      const f2 = await i.getItem(r);
      await t.setItem(r, f2), m2.push(r);
    }
  }
  await t.setItem(n2, y$2), e(t), j$1(i, m2);
}, j$1 = async (i, t) => {
  t.length && t.forEach(async (e) => {
    await i.removeItem(e);
  });
};
let h$1 = class h {
  constructor() {
    this.initialized = false, this.setInitialized = (e) => {
      this.storage = e, this.initialized = true;
    };
    const t = new K$1();
    this.storage = t;
    try {
      const e = new _$1();
      O$2(t, e, this.setInitialized);
    } catch {
      this.initialized = true;
    }
  }
  async getKeys() {
    return await this.initialize(), this.storage.getKeys();
  }
  async getEntries() {
    return await this.initialize(), this.storage.getEntries();
  }
  async getItem(t) {
    return await this.initialize(), this.storage.getItem(t);
  }
  async setItem(t, e) {
    return await this.initialize(), this.storage.setItem(t, e);
  }
  async removeItem(t) {
    return await this.initialize(), this.storage.removeItem(t);
  }
  async initialize() {
    this.initialized || await new Promise((t) => {
      const e = setInterval(() => {
        this.initialized && (clearInterval(e), t());
      }, 20);
    });
  }
};
var cjs$2 = {};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$2 = function(d2, b3) {
  extendStatics$2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b4) {
    d3.__proto__ = b4;
  } || function(d3, b4) {
    for (var p3 in b4)
      if (b4.hasOwnProperty(p3))
        d3[p3] = b4[p3];
  };
  return extendStatics$2(d2, b3);
};
function __extends$2(d2, b3) {
  extendStatics$2(d2, b3);
  function __() {
    this.constructor = d2;
  }
  d2.prototype = b3 === null ? Object.create(b3) : (__.prototype = b3.prototype, new __());
}
var __assign$2 = function() {
  __assign$2 = Object.assign || function __assign2(t) {
    for (var s, i = 1, n2 = arguments.length; i < n2; i++) {
      s = arguments[i];
      for (var p3 in s)
        if (Object.prototype.hasOwnProperty.call(s, p3))
          t[p3] = s[p3];
    }
    return t;
  };
  return __assign$2.apply(this, arguments);
};
function __rest$2(s, e) {
  var t = {};
  for (var p3 in s)
    if (Object.prototype.hasOwnProperty.call(s, p3) && e.indexOf(p3) < 0)
      t[p3] = s[p3];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p3 = Object.getOwnPropertySymbols(s); i < p3.length; i++) {
      if (e.indexOf(p3[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p3[i]))
        t[p3[i]] = s[p3[i]];
    }
  return t;
}
function __decorate$2(decorators, target, key, desc) {
  var c2 = arguments.length, r = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d2 = decorators[i])
        r = (c2 < 3 ? d2(r) : c2 > 3 ? d2(target, key, r) : d2(target, key)) || r;
  return c2 > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param$2(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __metadata$2(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter$2(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator$2(thisArg, body) {
  var _3 = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f2, y3, t, g3;
  return g3 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g3[Symbol.iterator] = function() {
    return this;
  }), g3;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
    };
  }
  function step(op) {
    if (f2)
      throw new TypeError("Generator is already executing.");
    while (_3)
      try {
        if (f2 = 1, y3 && (t = op[0] & 2 ? y3["return"] : op[0] ? y3["throw"] || ((t = y3["return"]) && t.call(y3), 0) : y3.next) && !(t = t.call(y3, op[1])).done)
          return t;
        if (y3 = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _3.label++;
            return { value: op[1], done: false };
          case 5:
            _3.label++;
            y3 = op[1];
            op = [0];
            continue;
          case 7:
            op = _3.ops.pop();
            _3.trys.pop();
            continue;
          default:
            if (!(t = _3.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _3 = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _3.label = op[1];
              break;
            }
            if (op[0] === 6 && _3.label < t[1]) {
              _3.label = t[1];
              t = op;
              break;
            }
            if (t && _3.label < t[2]) {
              _3.label = t[2];
              _3.ops.push(op);
              break;
            }
            if (t[2])
              _3.ops.pop();
            _3.trys.pop();
            continue;
        }
        op = body.call(thisArg, _3);
      } catch (e) {
        op = [6, e];
        y3 = 0;
      } finally {
        f2 = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __createBinding$2(o, m2, k2, k22) {
  if (k22 === void 0)
    k22 = k2;
  o[k22] = m2[k2];
}
function __exportStar$2(m2, exports) {
  for (var p3 in m2)
    if (p3 !== "default" && !exports.hasOwnProperty(p3))
      exports[p3] = m2[p3];
}
function __values$2(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m2 = s && o[s], i = 0;
  if (m2)
    return m2.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read$2(o, n2) {
  var m2 = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m2)
    return o;
  var i = m2.call(o), r, ar2 = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done)
      ar2.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m2 = i["return"]))
        m2.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar2;
}
function __spread$2() {
  for (var ar2 = [], i = 0; i < arguments.length; i++)
    ar2 = ar2.concat(__read$2(arguments[i]));
  return ar2;
}
function __spreadArrays$2() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++)
    s += arguments[i].length;
  for (var r = Array(s), k2 = 0, i = 0; i < il; i++)
    for (var a2 = arguments[i], j2 = 0, jl = a2.length; j2 < jl; j2++, k2++)
      r[k2] = a2[j2];
  return r;
}
function __await$2(v2) {
  return this instanceof __await$2 ? (this.v = v2, this) : new __await$2(v2);
}
function __asyncGenerator$2(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g3 = generator.apply(thisArg, _arguments || []), i, q2 = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n2) {
    if (g3[n2])
      i[n2] = function(v2) {
        return new Promise(function(a2, b3) {
          q2.push([n2, v2, a2, b3]) > 1 || resume(n2, v2);
        });
      };
  }
  function resume(n2, v2) {
    try {
      step(g3[n2](v2));
    } catch (e) {
      settle(q2[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await$2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q2[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f2, v2) {
    if (f2(v2), q2.shift(), q2.length)
      resume(q2[0][0], q2[0][1]);
  }
}
function __asyncDelegator$2(o) {
  var i, p3;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n2, f2) {
    i[n2] = o[n2] ? function(v2) {
      return (p3 = !p3) ? { value: __await$2(o[n2](v2)), done: n2 === "return" } : f2 ? f2(v2) : v2;
    } : f2;
  }
}
function __asyncValues$2(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m2 = o[Symbol.asyncIterator], i;
  return m2 ? m2.call(o) : (o = typeof __values$2 === "function" ? __values$2(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n2) {
    i[n2] = o[n2] && function(v2) {
      return new Promise(function(resolve, reject) {
        v2 = o[n2](v2), settle(resolve, reject, v2.done, v2.value);
      });
    };
  }
  function settle(resolve, reject, d2, v2) {
    Promise.resolve(v2).then(function(v3) {
      resolve({ value: v3, done: d2 });
    }, reject);
  }
}
function __makeTemplateObject$2(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar$2(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k2 in mod)
      if (Object.hasOwnProperty.call(mod, k2))
        result[k2] = mod[k2];
  }
  result.default = mod;
  return result;
}
function __importDefault$2(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet$2(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return privateMap.get(receiver);
}
function __classPrivateFieldSet$2(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }
  privateMap.set(receiver, value);
  return value;
}
const tslib_es6$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get __assign() {
    return __assign$2;
  },
  __asyncDelegator: __asyncDelegator$2,
  __asyncGenerator: __asyncGenerator$2,
  __asyncValues: __asyncValues$2,
  __await: __await$2,
  __awaiter: __awaiter$2,
  __classPrivateFieldGet: __classPrivateFieldGet$2,
  __classPrivateFieldSet: __classPrivateFieldSet$2,
  __createBinding: __createBinding$2,
  __decorate: __decorate$2,
  __exportStar: __exportStar$2,
  __extends: __extends$2,
  __generator: __generator$2,
  __importDefault: __importDefault$2,
  __importStar: __importStar$2,
  __makeTemplateObject: __makeTemplateObject$2,
  __metadata: __metadata$2,
  __param: __param$2,
  __read: __read$2,
  __rest: __rest$2,
  __spread: __spread$2,
  __spreadArrays: __spreadArrays$2,
  __values: __values$2
}, Symbol.toStringTag, { value: "Module" }));
const require$$0$3 = /* @__PURE__ */ getAugmentedNamespace(tslib_es6$2);
var heartbeat$2 = {};
var types = {};
var heartbeat$1 = {};
let IEvents$1 = class IEvents {
};
const esm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  IEvents: IEvents$1
}, Symbol.toStringTag, { value: "Module" }));
const require$$0$2 = /* @__PURE__ */ getAugmentedNamespace(esm);
var hasRequiredHeartbeat$2;
function requireHeartbeat$2() {
  if (hasRequiredHeartbeat$2)
    return heartbeat$1;
  hasRequiredHeartbeat$2 = 1;
  Object.defineProperty(heartbeat$1, "__esModule", { value: true });
  heartbeat$1.IHeartBeat = void 0;
  const events_1 = require$$0$2;
  class IHeartBeat extends events_1.IEvents {
    constructor(opts) {
      super();
    }
  }
  heartbeat$1.IHeartBeat = IHeartBeat;
  return heartbeat$1;
}
var hasRequiredTypes;
function requireTypes() {
  if (hasRequiredTypes)
    return types;
  hasRequiredTypes = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require$$0$3;
    tslib_1.__exportStar(requireHeartbeat$2(), exports);
  })(types);
  return types;
}
var constants$1 = {};
var heartbeat = {};
var hasRequiredHeartbeat$1;
function requireHeartbeat$1() {
  if (hasRequiredHeartbeat$1)
    return heartbeat;
  hasRequiredHeartbeat$1 = 1;
  Object.defineProperty(heartbeat, "__esModule", { value: true });
  heartbeat.HEARTBEAT_EVENTS = heartbeat.HEARTBEAT_INTERVAL = void 0;
  const time_1 = cjs$3;
  heartbeat.HEARTBEAT_INTERVAL = time_1.FIVE_SECONDS;
  heartbeat.HEARTBEAT_EVENTS = {
    pulse: "heartbeat_pulse"
  };
  return heartbeat;
}
var hasRequiredConstants$1;
function requireConstants$1() {
  if (hasRequiredConstants$1)
    return constants$1;
  hasRequiredConstants$1 = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require$$0$3;
    tslib_1.__exportStar(requireHeartbeat$1(), exports);
  })(constants$1);
  return constants$1;
}
var hasRequiredHeartbeat;
function requireHeartbeat() {
  if (hasRequiredHeartbeat)
    return heartbeat$2;
  hasRequiredHeartbeat = 1;
  Object.defineProperty(heartbeat$2, "__esModule", { value: true });
  heartbeat$2.HeartBeat = void 0;
  const tslib_1 = require$$0$3;
  const events_1 = eventsExports;
  const time_1 = cjs$3;
  const types_1 = requireTypes();
  const constants_1 = requireConstants$1();
  class HeartBeat extends types_1.IHeartBeat {
    constructor(opts) {
      super(opts);
      this.events = new events_1.EventEmitter();
      this.interval = constants_1.HEARTBEAT_INTERVAL;
      this.interval = (opts === null || opts === void 0 ? void 0 : opts.interval) || constants_1.HEARTBEAT_INTERVAL;
    }
    static init(opts) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const heartbeat2 = new HeartBeat(opts);
        yield heartbeat2.init();
        return heartbeat2;
      });
    }
    init() {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield this.initialize();
      });
    }
    stop() {
      clearInterval(this.intervalRef);
    }
    on(event, listener) {
      this.events.on(event, listener);
    }
    once(event, listener) {
      this.events.once(event, listener);
    }
    off(event, listener) {
      this.events.off(event, listener);
    }
    removeListener(event, listener) {
      this.events.removeListener(event, listener);
    }
    initialize() {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        this.intervalRef = setInterval(() => this.pulse(), time_1.toMiliseconds(this.interval));
      });
    }
    pulse() {
      this.events.emit(constants_1.HEARTBEAT_EVENTS.pulse);
    }
  }
  heartbeat$2.HeartBeat = HeartBeat;
  return heartbeat$2;
}
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  const tslib_1 = require$$0$3;
  tslib_1.__exportStar(requireHeartbeat(), exports);
  tslib_1.__exportStar(requireTypes(), exports);
  tslib_1.__exportStar(requireConstants$1(), exports);
})(cjs$2);
var cjs$1 = {};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$1 = function(d2, b3) {
  extendStatics$1 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b4) {
    d3.__proto__ = b4;
  } || function(d3, b4) {
    for (var p3 in b4)
      if (b4.hasOwnProperty(p3))
        d3[p3] = b4[p3];
  };
  return extendStatics$1(d2, b3);
};
function __extends$1(d2, b3) {
  extendStatics$1(d2, b3);
  function __() {
    this.constructor = d2;
  }
  d2.prototype = b3 === null ? Object.create(b3) : (__.prototype = b3.prototype, new __());
}
var __assign$1 = function() {
  __assign$1 = Object.assign || function __assign2(t) {
    for (var s, i = 1, n2 = arguments.length; i < n2; i++) {
      s = arguments[i];
      for (var p3 in s)
        if (Object.prototype.hasOwnProperty.call(s, p3))
          t[p3] = s[p3];
    }
    return t;
  };
  return __assign$1.apply(this, arguments);
};
function __rest$1(s, e) {
  var t = {};
  for (var p3 in s)
    if (Object.prototype.hasOwnProperty.call(s, p3) && e.indexOf(p3) < 0)
      t[p3] = s[p3];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p3 = Object.getOwnPropertySymbols(s); i < p3.length; i++) {
      if (e.indexOf(p3[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p3[i]))
        t[p3[i]] = s[p3[i]];
    }
  return t;
}
function __decorate$1(decorators, target, key, desc) {
  var c2 = arguments.length, r = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d2 = decorators[i])
        r = (c2 < 3 ? d2(r) : c2 > 3 ? d2(target, key, r) : d2(target, key)) || r;
  return c2 > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param$1(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __metadata$1(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter$1(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator$1(thisArg, body) {
  var _3 = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f2, y3, t, g3;
  return g3 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g3[Symbol.iterator] = function() {
    return this;
  }), g3;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
    };
  }
  function step(op) {
    if (f2)
      throw new TypeError("Generator is already executing.");
    while (_3)
      try {
        if (f2 = 1, y3 && (t = op[0] & 2 ? y3["return"] : op[0] ? y3["throw"] || ((t = y3["return"]) && t.call(y3), 0) : y3.next) && !(t = t.call(y3, op[1])).done)
          return t;
        if (y3 = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _3.label++;
            return { value: op[1], done: false };
          case 5:
            _3.label++;
            y3 = op[1];
            op = [0];
            continue;
          case 7:
            op = _3.ops.pop();
            _3.trys.pop();
            continue;
          default:
            if (!(t = _3.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _3 = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _3.label = op[1];
              break;
            }
            if (op[0] === 6 && _3.label < t[1]) {
              _3.label = t[1];
              t = op;
              break;
            }
            if (t && _3.label < t[2]) {
              _3.label = t[2];
              _3.ops.push(op);
              break;
            }
            if (t[2])
              _3.ops.pop();
            _3.trys.pop();
            continue;
        }
        op = body.call(thisArg, _3);
      } catch (e) {
        op = [6, e];
        y3 = 0;
      } finally {
        f2 = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __createBinding$1(o, m2, k2, k22) {
  if (k22 === void 0)
    k22 = k2;
  o[k22] = m2[k2];
}
function __exportStar$1(m2, exports) {
  for (var p3 in m2)
    if (p3 !== "default" && !exports.hasOwnProperty(p3))
      exports[p3] = m2[p3];
}
function __values$1(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m2 = s && o[s], i = 0;
  if (m2)
    return m2.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read$1(o, n2) {
  var m2 = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m2)
    return o;
  var i = m2.call(o), r, ar2 = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done)
      ar2.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m2 = i["return"]))
        m2.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar2;
}
function __spread$1() {
  for (var ar2 = [], i = 0; i < arguments.length; i++)
    ar2 = ar2.concat(__read$1(arguments[i]));
  return ar2;
}
function __spreadArrays$1() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++)
    s += arguments[i].length;
  for (var r = Array(s), k2 = 0, i = 0; i < il; i++)
    for (var a2 = arguments[i], j2 = 0, jl = a2.length; j2 < jl; j2++, k2++)
      r[k2] = a2[j2];
  return r;
}
function __await$1(v2) {
  return this instanceof __await$1 ? (this.v = v2, this) : new __await$1(v2);
}
function __asyncGenerator$1(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g3 = generator.apply(thisArg, _arguments || []), i, q2 = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n2) {
    if (g3[n2])
      i[n2] = function(v2) {
        return new Promise(function(a2, b3) {
          q2.push([n2, v2, a2, b3]) > 1 || resume(n2, v2);
        });
      };
  }
  function resume(n2, v2) {
    try {
      step(g3[n2](v2));
    } catch (e) {
      settle(q2[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await$1 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q2[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f2, v2) {
    if (f2(v2), q2.shift(), q2.length)
      resume(q2[0][0], q2[0][1]);
  }
}
function __asyncDelegator$1(o) {
  var i, p3;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n2, f2) {
    i[n2] = o[n2] ? function(v2) {
      return (p3 = !p3) ? { value: __await$1(o[n2](v2)), done: n2 === "return" } : f2 ? f2(v2) : v2;
    } : f2;
  }
}
function __asyncValues$1(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m2 = o[Symbol.asyncIterator], i;
  return m2 ? m2.call(o) : (o = typeof __values$1 === "function" ? __values$1(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n2) {
    i[n2] = o[n2] && function(v2) {
      return new Promise(function(resolve, reject) {
        v2 = o[n2](v2), settle(resolve, reject, v2.done, v2.value);
      });
    };
  }
  function settle(resolve, reject, d2, v2) {
    Promise.resolve(v2).then(function(v3) {
      resolve({ value: v3, done: d2 });
    }, reject);
  }
}
function __makeTemplateObject$1(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar$1(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k2 in mod)
      if (Object.hasOwnProperty.call(mod, k2))
        result[k2] = mod[k2];
  }
  result.default = mod;
  return result;
}
function __importDefault$1(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet$1(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return privateMap.get(receiver);
}
function __classPrivateFieldSet$1(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }
  privateMap.set(receiver, value);
  return value;
}
const tslib_es6$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get __assign() {
    return __assign$1;
  },
  __asyncDelegator: __asyncDelegator$1,
  __asyncGenerator: __asyncGenerator$1,
  __asyncValues: __asyncValues$1,
  __await: __await$1,
  __awaiter: __awaiter$1,
  __classPrivateFieldGet: __classPrivateFieldGet$1,
  __classPrivateFieldSet: __classPrivateFieldSet$1,
  __createBinding: __createBinding$1,
  __decorate: __decorate$1,
  __exportStar: __exportStar$1,
  __extends: __extends$1,
  __generator: __generator$1,
  __importDefault: __importDefault$1,
  __importStar: __importStar$1,
  __makeTemplateObject: __makeTemplateObject$1,
  __metadata: __metadata$1,
  __param: __param$1,
  __read: __read$1,
  __rest: __rest$1,
  __spread: __spread$1,
  __spreadArrays: __spreadArrays$1,
  __values: __values$1
}, Symbol.toStringTag, { value: "Module" }));
const require$$0$1 = /* @__PURE__ */ getAugmentedNamespace(tslib_es6$1);
var quickFormatUnescaped;
var hasRequiredQuickFormatUnescaped;
function requireQuickFormatUnescaped() {
  if (hasRequiredQuickFormatUnescaped)
    return quickFormatUnescaped;
  hasRequiredQuickFormatUnescaped = 1;
  function tryStringify(o) {
    try {
      return JSON.stringify(o);
    } catch (e) {
      return '"[Circular]"';
    }
  }
  quickFormatUnescaped = format;
  function format(f2, args, opts) {
    var ss2 = opts && opts.stringify || tryStringify;
    var offset = 1;
    if (typeof f2 === "object" && f2 !== null) {
      var len = args.length + offset;
      if (len === 1)
        return f2;
      var objects = new Array(len);
      objects[0] = ss2(f2);
      for (var index = 1; index < len; index++) {
        objects[index] = ss2(args[index]);
      }
      return objects.join(" ");
    }
    if (typeof f2 !== "string") {
      return f2;
    }
    var argLen = args.length;
    if (argLen === 0)
      return f2;
    var str = "";
    var a2 = 1 - offset;
    var lastPos = -1;
    var flen = f2 && f2.length || 0;
    for (var i = 0; i < flen; ) {
      if (f2.charCodeAt(i) === 37 && i + 1 < flen) {
        lastPos = lastPos > -1 ? lastPos : 0;
        switch (f2.charCodeAt(i + 1)) {
          case 100:
          case 102:
            if (a2 >= argLen)
              break;
            if (args[a2] == null)
              break;
            if (lastPos < i)
              str += f2.slice(lastPos, i);
            str += Number(args[a2]);
            lastPos = i + 2;
            i++;
            break;
          case 105:
            if (a2 >= argLen)
              break;
            if (args[a2] == null)
              break;
            if (lastPos < i)
              str += f2.slice(lastPos, i);
            str += Math.floor(Number(args[a2]));
            lastPos = i + 2;
            i++;
            break;
          case 79:
          case 111:
          case 106:
            if (a2 >= argLen)
              break;
            if (args[a2] === void 0)
              break;
            if (lastPos < i)
              str += f2.slice(lastPos, i);
            var type = typeof args[a2];
            if (type === "string") {
              str += "'" + args[a2] + "'";
              lastPos = i + 2;
              i++;
              break;
            }
            if (type === "function") {
              str += args[a2].name || "<anonymous>";
              lastPos = i + 2;
              i++;
              break;
            }
            str += ss2(args[a2]);
            lastPos = i + 2;
            i++;
            break;
          case 115:
            if (a2 >= argLen)
              break;
            if (lastPos < i)
              str += f2.slice(lastPos, i);
            str += String(args[a2]);
            lastPos = i + 2;
            i++;
            break;
          case 37:
            if (lastPos < i)
              str += f2.slice(lastPos, i);
            str += "%";
            lastPos = i + 2;
            i++;
            a2--;
            break;
        }
        ++a2;
      }
      ++i;
    }
    if (lastPos === -1)
      return f2;
    else if (lastPos < flen) {
      str += f2.slice(lastPos);
    }
    return str;
  }
  return quickFormatUnescaped;
}
var browser;
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser)
    return browser;
  hasRequiredBrowser = 1;
  const format = requireQuickFormatUnescaped();
  browser = pino;
  const _console = pfGlobalThisOrFallback().console || {};
  const stdSerializers = {
    mapHttpRequest: mock,
    mapHttpResponse: mock,
    wrapRequestSerializer: passthrough,
    wrapResponseSerializer: passthrough,
    wrapErrorSerializer: passthrough,
    req: mock,
    res: mock,
    err: asErrValue
  };
  function shouldSerialize(serialize, serializers) {
    if (Array.isArray(serialize)) {
      const hasToFilter = serialize.filter(function(k2) {
        return k2 !== "!stdSerializers.err";
      });
      return hasToFilter;
    } else if (serialize === true) {
      return Object.keys(serializers);
    }
    return false;
  }
  function pino(opts) {
    opts = opts || {};
    opts.browser = opts.browser || {};
    const transmit2 = opts.browser.transmit;
    if (transmit2 && typeof transmit2.send !== "function") {
      throw Error("pino: transmit option must have a send function");
    }
    const proto = opts.browser.write || _console;
    if (opts.browser.write)
      opts.browser.asObject = true;
    const serializers = opts.serializers || {};
    const serialize = shouldSerialize(opts.browser.serialize, serializers);
    let stdErrSerialize = opts.browser.serialize;
    if (Array.isArray(opts.browser.serialize) && opts.browser.serialize.indexOf("!stdSerializers.err") > -1)
      stdErrSerialize = false;
    const levels = ["error", "fatal", "warn", "info", "debug", "trace"];
    if (typeof proto === "function") {
      proto.error = proto.fatal = proto.warn = proto.info = proto.debug = proto.trace = proto;
    }
    if (opts.enabled === false)
      opts.level = "silent";
    const level = opts.level || "info";
    const logger = Object.create(proto);
    if (!logger.log)
      logger.log = noop;
    Object.defineProperty(logger, "levelVal", {
      get: getLevelVal
    });
    Object.defineProperty(logger, "level", {
      get: getLevel,
      set: setLevel
    });
    const setOpts = {
      transmit: transmit2,
      serialize,
      asObject: opts.browser.asObject,
      levels,
      timestamp: getTimeFunction(opts)
    };
    logger.levels = pino.levels;
    logger.level = level;
    logger.setMaxListeners = logger.getMaxListeners = logger.emit = logger.addListener = logger.on = logger.prependListener = logger.once = logger.prependOnceListener = logger.removeListener = logger.removeAllListeners = logger.listeners = logger.listenerCount = logger.eventNames = logger.write = logger.flush = noop;
    logger.serializers = serializers;
    logger._serialize = serialize;
    logger._stdErrSerialize = stdErrSerialize;
    logger.child = child;
    if (transmit2)
      logger._logEvent = createLogEventShape();
    function getLevelVal() {
      return this.level === "silent" ? Infinity : this.levels.values[this.level];
    }
    function getLevel() {
      return this._level;
    }
    function setLevel(level2) {
      if (level2 !== "silent" && !this.levels.values[level2]) {
        throw Error("unknown level " + level2);
      }
      this._level = level2;
      set2(setOpts, logger, "error", "log");
      set2(setOpts, logger, "fatal", "error");
      set2(setOpts, logger, "warn", "error");
      set2(setOpts, logger, "info", "log");
      set2(setOpts, logger, "debug", "log");
      set2(setOpts, logger, "trace", "log");
    }
    function child(bindings, childOptions) {
      if (!bindings) {
        throw new Error("missing bindings for child Pino");
      }
      childOptions = childOptions || {};
      if (serialize && bindings.serializers) {
        childOptions.serializers = bindings.serializers;
      }
      const childOptionsSerializers = childOptions.serializers;
      if (serialize && childOptionsSerializers) {
        var childSerializers = Object.assign({}, serializers, childOptionsSerializers);
        var childSerialize = opts.browser.serialize === true ? Object.keys(childSerializers) : serialize;
        delete bindings.serializers;
        applySerializers([bindings], childSerialize, childSerializers, this._stdErrSerialize);
      }
      function Child(parent) {
        this._childLevel = (parent._childLevel | 0) + 1;
        this.error = bind(parent, bindings, "error");
        this.fatal = bind(parent, bindings, "fatal");
        this.warn = bind(parent, bindings, "warn");
        this.info = bind(parent, bindings, "info");
        this.debug = bind(parent, bindings, "debug");
        this.trace = bind(parent, bindings, "trace");
        if (childSerializers) {
          this.serializers = childSerializers;
          this._serialize = childSerialize;
        }
        if (transmit2) {
          this._logEvent = createLogEventShape(
            [].concat(parent._logEvent.bindings, bindings)
          );
        }
      }
      Child.prototype = this;
      return new Child(this);
    }
    return logger;
  }
  pino.levels = {
    values: {
      fatal: 60,
      error: 50,
      warn: 40,
      info: 30,
      debug: 20,
      trace: 10
    },
    labels: {
      10: "trace",
      20: "debug",
      30: "info",
      40: "warn",
      50: "error",
      60: "fatal"
    }
  };
  pino.stdSerializers = stdSerializers;
  pino.stdTimeFunctions = Object.assign({}, { nullTime, epochTime, unixTime, isoTime });
  function set2(opts, logger, level, fallback) {
    const proto = Object.getPrototypeOf(logger);
    logger[level] = logger.levelVal > logger.levels.values[level] ? noop : proto[level] ? proto[level] : _console[level] || _console[fallback] || noop;
    wrap(opts, logger, level);
  }
  function wrap(opts, logger, level) {
    if (!opts.transmit && logger[level] === noop)
      return;
    logger[level] = function(write) {
      return function LOG() {
        const ts2 = opts.timestamp();
        const args = new Array(arguments.length);
        const proto = Object.getPrototypeOf && Object.getPrototypeOf(this) === _console ? _console : this;
        for (var i = 0; i < args.length; i++)
          args[i] = arguments[i];
        if (opts.serialize && !opts.asObject) {
          applySerializers(args, this._serialize, this.serializers, this._stdErrSerialize);
        }
        if (opts.asObject)
          write.call(proto, asObject(this, level, args, ts2));
        else
          write.apply(proto, args);
        if (opts.transmit) {
          const transmitLevel = opts.transmit.level || logger.level;
          const transmitValue = pino.levels.values[transmitLevel];
          const methodValue = pino.levels.values[level];
          if (methodValue < transmitValue)
            return;
          transmit(this, {
            ts: ts2,
            methodLevel: level,
            methodValue,
            transmitLevel,
            transmitValue: pino.levels.values[opts.transmit.level || logger.level],
            send: opts.transmit.send,
            val: logger.levelVal
          }, args);
        }
      };
    }(logger[level]);
  }
  function asObject(logger, level, args, ts2) {
    if (logger._serialize)
      applySerializers(args, logger._serialize, logger.serializers, logger._stdErrSerialize);
    const argsCloned = args.slice();
    let msg = argsCloned[0];
    const o = {};
    if (ts2) {
      o.time = ts2;
    }
    o.level = pino.levels.values[level];
    let lvl = (logger._childLevel | 0) + 1;
    if (lvl < 1)
      lvl = 1;
    if (msg !== null && typeof msg === "object") {
      while (lvl-- && typeof argsCloned[0] === "object") {
        Object.assign(o, argsCloned.shift());
      }
      msg = argsCloned.length ? format(argsCloned.shift(), argsCloned) : void 0;
    } else if (typeof msg === "string")
      msg = format(argsCloned.shift(), argsCloned);
    if (msg !== void 0)
      o.msg = msg;
    return o;
  }
  function applySerializers(args, serialize, serializers, stdErrSerialize) {
    for (const i in args) {
      if (stdErrSerialize && args[i] instanceof Error) {
        args[i] = pino.stdSerializers.err(args[i]);
      } else if (typeof args[i] === "object" && !Array.isArray(args[i])) {
        for (const k2 in args[i]) {
          if (serialize && serialize.indexOf(k2) > -1 && k2 in serializers) {
            args[i][k2] = serializers[k2](args[i][k2]);
          }
        }
      }
    }
  }
  function bind(parent, bindings, level) {
    return function() {
      const args = new Array(1 + arguments.length);
      args[0] = bindings;
      for (var i = 1; i < args.length; i++) {
        args[i] = arguments[i - 1];
      }
      return parent[level].apply(this, args);
    };
  }
  function transmit(logger, opts, args) {
    const send = opts.send;
    const ts2 = opts.ts;
    const methodLevel = opts.methodLevel;
    const methodValue = opts.methodValue;
    const val = opts.val;
    const bindings = logger._logEvent.bindings;
    applySerializers(
      args,
      logger._serialize || Object.keys(logger.serializers),
      logger.serializers,
      logger._stdErrSerialize === void 0 ? true : logger._stdErrSerialize
    );
    logger._logEvent.ts = ts2;
    logger._logEvent.messages = args.filter(function(arg) {
      return bindings.indexOf(arg) === -1;
    });
    logger._logEvent.level.label = methodLevel;
    logger._logEvent.level.value = methodValue;
    send(methodLevel, logger._logEvent, val);
    logger._logEvent = createLogEventShape(bindings);
  }
  function createLogEventShape(bindings) {
    return {
      ts: 0,
      messages: [],
      bindings: bindings || [],
      level: { label: "", value: 0 }
    };
  }
  function asErrValue(err) {
    const obj = {
      type: err.constructor.name,
      msg: err.message,
      stack: err.stack
    };
    for (const key in err) {
      if (obj[key] === void 0) {
        obj[key] = err[key];
      }
    }
    return obj;
  }
  function getTimeFunction(opts) {
    if (typeof opts.timestamp === "function") {
      return opts.timestamp;
    }
    if (opts.timestamp === false) {
      return nullTime;
    }
    return epochTime;
  }
  function mock() {
    return {};
  }
  function passthrough(a2) {
    return a2;
  }
  function noop() {
  }
  function nullTime() {
    return false;
  }
  function epochTime() {
    return Date.now();
  }
  function unixTime() {
    return Math.round(Date.now() / 1e3);
  }
  function isoTime() {
    return new Date(Date.now()).toISOString();
  }
  function pfGlobalThisOrFallback() {
    function defd(o) {
      return typeof o !== "undefined" && o;
    }
    try {
      if (typeof globalThis !== "undefined")
        return globalThis;
      Object.defineProperty(Object.prototype, "globalThis", {
        get: function() {
          delete Object.prototype.globalThis;
          return this.globalThis = this;
        },
        configurable: true
      });
      return globalThis;
    } catch (e) {
      return defd(self) || defd(window) || defd(this) || {};
    }
  }
  return browser;
}
var constants = {};
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants)
    return constants;
  hasRequiredConstants = 1;
  Object.defineProperty(constants, "__esModule", { value: true });
  constants.PINO_CUSTOM_CONTEXT_KEY = constants.PINO_LOGGER_DEFAULTS = void 0;
  constants.PINO_LOGGER_DEFAULTS = {
    level: "info"
  };
  constants.PINO_CUSTOM_CONTEXT_KEY = "custom_context";
  return constants;
}
var utils = {};
var hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils)
    return utils;
  hasRequiredUtils = 1;
  Object.defineProperty(utils, "__esModule", { value: true });
  utils.generateChildLogger = utils.formatChildLoggerContext = utils.getLoggerContext = utils.setBrowserLoggerContext = utils.getBrowserLoggerContext = utils.getDefaultLoggerOptions = void 0;
  const constants_1 = requireConstants();
  function getDefaultLoggerOptions(opts) {
    return Object.assign(Object.assign({}, opts), { level: (opts === null || opts === void 0 ? void 0 : opts.level) || constants_1.PINO_LOGGER_DEFAULTS.level });
  }
  utils.getDefaultLoggerOptions = getDefaultLoggerOptions;
  function getBrowserLoggerContext(logger, customContextKey = constants_1.PINO_CUSTOM_CONTEXT_KEY) {
    return logger[customContextKey] || "";
  }
  utils.getBrowserLoggerContext = getBrowserLoggerContext;
  function setBrowserLoggerContext(logger, context, customContextKey = constants_1.PINO_CUSTOM_CONTEXT_KEY) {
    logger[customContextKey] = context;
    return logger;
  }
  utils.setBrowserLoggerContext = setBrowserLoggerContext;
  function getLoggerContext(logger, customContextKey = constants_1.PINO_CUSTOM_CONTEXT_KEY) {
    let context = "";
    if (typeof logger.bindings === "undefined") {
      context = getBrowserLoggerContext(logger, customContextKey);
    } else {
      context = logger.bindings().context || "";
    }
    return context;
  }
  utils.getLoggerContext = getLoggerContext;
  function formatChildLoggerContext(logger, childContext, customContextKey = constants_1.PINO_CUSTOM_CONTEXT_KEY) {
    const parentContext = getLoggerContext(logger, customContextKey);
    const context = parentContext.trim() ? `${parentContext}/${childContext}` : childContext;
    return context;
  }
  utils.formatChildLoggerContext = formatChildLoggerContext;
  function generateChildLogger(logger, childContext, customContextKey = constants_1.PINO_CUSTOM_CONTEXT_KEY) {
    const context = formatChildLoggerContext(logger, childContext, customContextKey);
    const child = logger.child({ context });
    return setBrowserLoggerContext(child, context, customContextKey);
  }
  utils.generateChildLogger = generateChildLogger;
  return utils;
}
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.pino = void 0;
  const tslib_1 = require$$0$1;
  const pino_1 = tslib_1.__importDefault(requireBrowser());
  Object.defineProperty(exports, "pino", { enumerable: true, get: function() {
    return pino_1.default;
  } });
  tslib_1.__exportStar(requireConstants(), exports);
  tslib_1.__exportStar(requireUtils(), exports);
})(cjs$1);
class n extends IEvents$1 {
  constructor(s) {
    super(), this.opts = s, this.protocol = "wc", this.version = 2;
  }
}
class h2 extends IEvents$1 {
  constructor(s, t) {
    super(), this.core = s, this.logger = t, this.records = /* @__PURE__ */ new Map();
  }
}
class a {
  constructor(s, t) {
    this.logger = s, this.core = t;
  }
}
let u$1 = class u extends IEvents$1 {
  constructor(s, t) {
    super(), this.relayer = s, this.logger = t;
  }
};
let g$3 = class g extends IEvents$1 {
  constructor(s) {
    super();
  }
};
let p$1 = class p {
  constructor(s, t, o, w2) {
    this.core = s, this.logger = t, this.name = o;
  }
};
class d extends IEvents$1 {
  constructor(s, t) {
    super(), this.relayer = s, this.logger = t;
  }
}
let E$1 = class E extends IEvents$1 {
  constructor(s, t) {
    super(), this.core = s, this.logger = t;
  }
};
let y$1 = class y {
  constructor(s, t) {
    this.projectId = s, this.logger = t;
  }
};
let b$1 = class b {
  constructor(s) {
    this.opts = s, this.protocol = "wc", this.version = 2;
  }
};
let S$1 = class S {
  constructor(s) {
    this.client = s;
  }
};
var ed25519 = {};
var sha512 = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var binary_1 = binary;
  var wipe_1 = wipe;
  exports.DIGEST_LENGTH = 64;
  exports.BLOCK_SIZE = 128;
  var SHA512 = (
    /** @class */
    function() {
      function SHA5122() {
        this.digestLength = exports.DIGEST_LENGTH;
        this.blockSize = exports.BLOCK_SIZE;
        this._stateHi = new Int32Array(8);
        this._stateLo = new Int32Array(8);
        this._tempHi = new Int32Array(16);
        this._tempLo = new Int32Array(16);
        this._buffer = new Uint8Array(256);
        this._bufferLength = 0;
        this._bytesHashed = 0;
        this._finished = false;
        this.reset();
      }
      SHA5122.prototype._initState = function() {
        this._stateHi[0] = 1779033703;
        this._stateHi[1] = 3144134277;
        this._stateHi[2] = 1013904242;
        this._stateHi[3] = 2773480762;
        this._stateHi[4] = 1359893119;
        this._stateHi[5] = 2600822924;
        this._stateHi[6] = 528734635;
        this._stateHi[7] = 1541459225;
        this._stateLo[0] = 4089235720;
        this._stateLo[1] = 2227873595;
        this._stateLo[2] = 4271175723;
        this._stateLo[3] = 1595750129;
        this._stateLo[4] = 2917565137;
        this._stateLo[5] = 725511199;
        this._stateLo[6] = 4215389547;
        this._stateLo[7] = 327033209;
      };
      SHA5122.prototype.reset = function() {
        this._initState();
        this._bufferLength = 0;
        this._bytesHashed = 0;
        this._finished = false;
        return this;
      };
      SHA5122.prototype.clean = function() {
        wipe_1.wipe(this._buffer);
        wipe_1.wipe(this._tempHi);
        wipe_1.wipe(this._tempLo);
        this.reset();
      };
      SHA5122.prototype.update = function(data, dataLength) {
        if (dataLength === void 0) {
          dataLength = data.length;
        }
        if (this._finished) {
          throw new Error("SHA512: can't update because hash was finished.");
        }
        var dataPos = 0;
        this._bytesHashed += dataLength;
        if (this._bufferLength > 0) {
          while (this._bufferLength < exports.BLOCK_SIZE && dataLength > 0) {
            this._buffer[this._bufferLength++] = data[dataPos++];
            dataLength--;
          }
          if (this._bufferLength === this.blockSize) {
            hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, this.blockSize);
            this._bufferLength = 0;
          }
        }
        if (dataLength >= this.blockSize) {
          dataPos = hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, data, dataPos, dataLength);
          dataLength %= this.blockSize;
        }
        while (dataLength > 0) {
          this._buffer[this._bufferLength++] = data[dataPos++];
          dataLength--;
        }
        return this;
      };
      SHA5122.prototype.finish = function(out) {
        if (!this._finished) {
          var bytesHashed = this._bytesHashed;
          var left = this._bufferLength;
          var bitLenHi = bytesHashed / 536870912 | 0;
          var bitLenLo = bytesHashed << 3;
          var padLength = bytesHashed % 128 < 112 ? 128 : 256;
          this._buffer[left] = 128;
          for (var i = left + 1; i < padLength - 8; i++) {
            this._buffer[i] = 0;
          }
          binary_1.writeUint32BE(bitLenHi, this._buffer, padLength - 8);
          binary_1.writeUint32BE(bitLenLo, this._buffer, padLength - 4);
          hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, padLength);
          this._finished = true;
        }
        for (var i = 0; i < this.digestLength / 8; i++) {
          binary_1.writeUint32BE(this._stateHi[i], out, i * 8);
          binary_1.writeUint32BE(this._stateLo[i], out, i * 8 + 4);
        }
        return this;
      };
      SHA5122.prototype.digest = function() {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
      };
      SHA5122.prototype.saveState = function() {
        if (this._finished) {
          throw new Error("SHA256: cannot save finished state");
        }
        return {
          stateHi: new Int32Array(this._stateHi),
          stateLo: new Int32Array(this._stateLo),
          buffer: this._bufferLength > 0 ? new Uint8Array(this._buffer) : void 0,
          bufferLength: this._bufferLength,
          bytesHashed: this._bytesHashed
        };
      };
      SHA5122.prototype.restoreState = function(savedState) {
        this._stateHi.set(savedState.stateHi);
        this._stateLo.set(savedState.stateLo);
        this._bufferLength = savedState.bufferLength;
        if (savedState.buffer) {
          this._buffer.set(savedState.buffer);
        }
        this._bytesHashed = savedState.bytesHashed;
        this._finished = false;
        return this;
      };
      SHA5122.prototype.cleanSavedState = function(savedState) {
        wipe_1.wipe(savedState.stateHi);
        wipe_1.wipe(savedState.stateLo);
        if (savedState.buffer) {
          wipe_1.wipe(savedState.buffer);
        }
        savedState.bufferLength = 0;
        savedState.bytesHashed = 0;
      };
      return SHA5122;
    }()
  );
  exports.SHA512 = SHA512;
  var K3 = new Int32Array([
    1116352408,
    3609767458,
    1899447441,
    602891725,
    3049323471,
    3964484399,
    3921009573,
    2173295548,
    961987163,
    4081628472,
    1508970993,
    3053834265,
    2453635748,
    2937671579,
    2870763221,
    3664609560,
    3624381080,
    2734883394,
    310598401,
    1164996542,
    607225278,
    1323610764,
    1426881987,
    3590304994,
    1925078388,
    4068182383,
    2162078206,
    991336113,
    2614888103,
    633803317,
    3248222580,
    3479774868,
    3835390401,
    2666613458,
    4022224774,
    944711139,
    264347078,
    2341262773,
    604807628,
    2007800933,
    770255983,
    1495990901,
    1249150122,
    1856431235,
    1555081692,
    3175218132,
    1996064986,
    2198950837,
    2554220882,
    3999719339,
    2821834349,
    766784016,
    2952996808,
    2566594879,
    3210313671,
    3203337956,
    3336571891,
    1034457026,
    3584528711,
    2466948901,
    113926993,
    3758326383,
    338241895,
    168717936,
    666307205,
    1188179964,
    773529912,
    1546045734,
    1294757372,
    1522805485,
    1396182291,
    2643833823,
    1695183700,
    2343527390,
    1986661051,
    1014477480,
    2177026350,
    1206759142,
    2456956037,
    344077627,
    2730485921,
    1290863460,
    2820302411,
    3158454273,
    3259730800,
    3505952657,
    3345764771,
    106217008,
    3516065817,
    3606008344,
    3600352804,
    1432725776,
    4094571909,
    1467031594,
    275423344,
    851169720,
    430227734,
    3100823752,
    506948616,
    1363258195,
    659060556,
    3750685593,
    883997877,
    3785050280,
    958139571,
    3318307427,
    1322822218,
    3812723403,
    1537002063,
    2003034995,
    1747873779,
    3602036899,
    1955562222,
    1575990012,
    2024104815,
    1125592928,
    2227730452,
    2716904306,
    2361852424,
    442776044,
    2428436474,
    593698344,
    2756734187,
    3733110249,
    3204031479,
    2999351573,
    3329325298,
    3815920427,
    3391569614,
    3928383900,
    3515267271,
    566280711,
    3940187606,
    3454069534,
    4118630271,
    4000239992,
    116418474,
    1914138554,
    174292421,
    2731055270,
    289380356,
    3203993006,
    460393269,
    320620315,
    685471733,
    587496836,
    852142971,
    1086792851,
    1017036298,
    365543100,
    1126000580,
    2618297676,
    1288033470,
    3409855158,
    1501505948,
    4234509866,
    1607167915,
    987167468,
    1816402316,
    1246189591
  ]);
  function hashBlocks(wh, wl, hh, hl, m2, pos, len) {
    var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
    var h3, l2;
    var th, tl;
    var a2, b3, c2, d2;
    while (len >= 128) {
      for (var i = 0; i < 16; i++) {
        var j2 = 8 * i + pos;
        wh[i] = binary_1.readUint32BE(m2, j2);
        wl[i] = binary_1.readUint32BE(m2, j2 + 4);
      }
      for (var i = 0; i < 80; i++) {
        var bh0 = ah0;
        var bh1 = ah1;
        var bh2 = ah2;
        var bh3 = ah3;
        var bh4 = ah4;
        var bh5 = ah5;
        var bh6 = ah6;
        var bh7 = ah7;
        var bl0 = al0;
        var bl1 = al1;
        var bl2 = al2;
        var bl3 = al3;
        var bl4 = al4;
        var bl5 = al5;
        var bl6 = al6;
        var bl7 = al7;
        h3 = ah7;
        l2 = al7;
        a2 = l2 & 65535;
        b3 = l2 >>> 16;
        c2 = h3 & 65535;
        d2 = h3 >>> 16;
        h3 = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
        l2 = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
        a2 += l2 & 65535;
        b3 += l2 >>> 16;
        c2 += h3 & 65535;
        d2 += h3 >>> 16;
        h3 = ah4 & ah5 ^ ~ah4 & ah6;
        l2 = al4 & al5 ^ ~al4 & al6;
        a2 += l2 & 65535;
        b3 += l2 >>> 16;
        c2 += h3 & 65535;
        d2 += h3 >>> 16;
        h3 = K3[i * 2];
        l2 = K3[i * 2 + 1];
        a2 += l2 & 65535;
        b3 += l2 >>> 16;
        c2 += h3 & 65535;
        d2 += h3 >>> 16;
        h3 = wh[i % 16];
        l2 = wl[i % 16];
        a2 += l2 & 65535;
        b3 += l2 >>> 16;
        c2 += h3 & 65535;
        d2 += h3 >>> 16;
        b3 += a2 >>> 16;
        c2 += b3 >>> 16;
        d2 += c2 >>> 16;
        th = c2 & 65535 | d2 << 16;
        tl = a2 & 65535 | b3 << 16;
        h3 = th;
        l2 = tl;
        a2 = l2 & 65535;
        b3 = l2 >>> 16;
        c2 = h3 & 65535;
        d2 = h3 >>> 16;
        h3 = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
        l2 = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
        a2 += l2 & 65535;
        b3 += l2 >>> 16;
        c2 += h3 & 65535;
        d2 += h3 >>> 16;
        h3 = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
        l2 = al0 & al1 ^ al0 & al2 ^ al1 & al2;
        a2 += l2 & 65535;
        b3 += l2 >>> 16;
        c2 += h3 & 65535;
        d2 += h3 >>> 16;
        b3 += a2 >>> 16;
        c2 += b3 >>> 16;
        d2 += c2 >>> 16;
        bh7 = c2 & 65535 | d2 << 16;
        bl7 = a2 & 65535 | b3 << 16;
        h3 = bh3;
        l2 = bl3;
        a2 = l2 & 65535;
        b3 = l2 >>> 16;
        c2 = h3 & 65535;
        d2 = h3 >>> 16;
        h3 = th;
        l2 = tl;
        a2 += l2 & 65535;
        b3 += l2 >>> 16;
        c2 += h3 & 65535;
        d2 += h3 >>> 16;
        b3 += a2 >>> 16;
        c2 += b3 >>> 16;
        d2 += c2 >>> 16;
        bh3 = c2 & 65535 | d2 << 16;
        bl3 = a2 & 65535 | b3 << 16;
        ah1 = bh0;
        ah2 = bh1;
        ah3 = bh2;
        ah4 = bh3;
        ah5 = bh4;
        ah6 = bh5;
        ah7 = bh6;
        ah0 = bh7;
        al1 = bl0;
        al2 = bl1;
        al3 = bl2;
        al4 = bl3;
        al5 = bl4;
        al6 = bl5;
        al7 = bl6;
        al0 = bl7;
        if (i % 16 === 15) {
          for (var j2 = 0; j2 < 16; j2++) {
            h3 = wh[j2];
            l2 = wl[j2];
            a2 = l2 & 65535;
            b3 = l2 >>> 16;
            c2 = h3 & 65535;
            d2 = h3 >>> 16;
            h3 = wh[(j2 + 9) % 16];
            l2 = wl[(j2 + 9) % 16];
            a2 += l2 & 65535;
            b3 += l2 >>> 16;
            c2 += h3 & 65535;
            d2 += h3 >>> 16;
            th = wh[(j2 + 1) % 16];
            tl = wl[(j2 + 1) % 16];
            h3 = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
            l2 = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
            a2 += l2 & 65535;
            b3 += l2 >>> 16;
            c2 += h3 & 65535;
            d2 += h3 >>> 16;
            th = wh[(j2 + 14) % 16];
            tl = wl[(j2 + 14) % 16];
            h3 = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
            l2 = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
            a2 += l2 & 65535;
            b3 += l2 >>> 16;
            c2 += h3 & 65535;
            d2 += h3 >>> 16;
            b3 += a2 >>> 16;
            c2 += b3 >>> 16;
            d2 += c2 >>> 16;
            wh[j2] = c2 & 65535 | d2 << 16;
            wl[j2] = a2 & 65535 | b3 << 16;
          }
        }
      }
      h3 = ah0;
      l2 = al0;
      a2 = l2 & 65535;
      b3 = l2 >>> 16;
      c2 = h3 & 65535;
      d2 = h3 >>> 16;
      h3 = hh[0];
      l2 = hl[0];
      a2 += l2 & 65535;
      b3 += l2 >>> 16;
      c2 += h3 & 65535;
      d2 += h3 >>> 16;
      b3 += a2 >>> 16;
      c2 += b3 >>> 16;
      d2 += c2 >>> 16;
      hh[0] = ah0 = c2 & 65535 | d2 << 16;
      hl[0] = al0 = a2 & 65535 | b3 << 16;
      h3 = ah1;
      l2 = al1;
      a2 = l2 & 65535;
      b3 = l2 >>> 16;
      c2 = h3 & 65535;
      d2 = h3 >>> 16;
      h3 = hh[1];
      l2 = hl[1];
      a2 += l2 & 65535;
      b3 += l2 >>> 16;
      c2 += h3 & 65535;
      d2 += h3 >>> 16;
      b3 += a2 >>> 16;
      c2 += b3 >>> 16;
      d2 += c2 >>> 16;
      hh[1] = ah1 = c2 & 65535 | d2 << 16;
      hl[1] = al1 = a2 & 65535 | b3 << 16;
      h3 = ah2;
      l2 = al2;
      a2 = l2 & 65535;
      b3 = l2 >>> 16;
      c2 = h3 & 65535;
      d2 = h3 >>> 16;
      h3 = hh[2];
      l2 = hl[2];
      a2 += l2 & 65535;
      b3 += l2 >>> 16;
      c2 += h3 & 65535;
      d2 += h3 >>> 16;
      b3 += a2 >>> 16;
      c2 += b3 >>> 16;
      d2 += c2 >>> 16;
      hh[2] = ah2 = c2 & 65535 | d2 << 16;
      hl[2] = al2 = a2 & 65535 | b3 << 16;
      h3 = ah3;
      l2 = al3;
      a2 = l2 & 65535;
      b3 = l2 >>> 16;
      c2 = h3 & 65535;
      d2 = h3 >>> 16;
      h3 = hh[3];
      l2 = hl[3];
      a2 += l2 & 65535;
      b3 += l2 >>> 16;
      c2 += h3 & 65535;
      d2 += h3 >>> 16;
      b3 += a2 >>> 16;
      c2 += b3 >>> 16;
      d2 += c2 >>> 16;
      hh[3] = ah3 = c2 & 65535 | d2 << 16;
      hl[3] = al3 = a2 & 65535 | b3 << 16;
      h3 = ah4;
      l2 = al4;
      a2 = l2 & 65535;
      b3 = l2 >>> 16;
      c2 = h3 & 65535;
      d2 = h3 >>> 16;
      h3 = hh[4];
      l2 = hl[4];
      a2 += l2 & 65535;
      b3 += l2 >>> 16;
      c2 += h3 & 65535;
      d2 += h3 >>> 16;
      b3 += a2 >>> 16;
      c2 += b3 >>> 16;
      d2 += c2 >>> 16;
      hh[4] = ah4 = c2 & 65535 | d2 << 16;
      hl[4] = al4 = a2 & 65535 | b3 << 16;
      h3 = ah5;
      l2 = al5;
      a2 = l2 & 65535;
      b3 = l2 >>> 16;
      c2 = h3 & 65535;
      d2 = h3 >>> 16;
      h3 = hh[5];
      l2 = hl[5];
      a2 += l2 & 65535;
      b3 += l2 >>> 16;
      c2 += h3 & 65535;
      d2 += h3 >>> 16;
      b3 += a2 >>> 16;
      c2 += b3 >>> 16;
      d2 += c2 >>> 16;
      hh[5] = ah5 = c2 & 65535 | d2 << 16;
      hl[5] = al5 = a2 & 65535 | b3 << 16;
      h3 = ah6;
      l2 = al6;
      a2 = l2 & 65535;
      b3 = l2 >>> 16;
      c2 = h3 & 65535;
      d2 = h3 >>> 16;
      h3 = hh[6];
      l2 = hl[6];
      a2 += l2 & 65535;
      b3 += l2 >>> 16;
      c2 += h3 & 65535;
      d2 += h3 >>> 16;
      b3 += a2 >>> 16;
      c2 += b3 >>> 16;
      d2 += c2 >>> 16;
      hh[6] = ah6 = c2 & 65535 | d2 << 16;
      hl[6] = al6 = a2 & 65535 | b3 << 16;
      h3 = ah7;
      l2 = al7;
      a2 = l2 & 65535;
      b3 = l2 >>> 16;
      c2 = h3 & 65535;
      d2 = h3 >>> 16;
      h3 = hh[7];
      l2 = hl[7];
      a2 += l2 & 65535;
      b3 += l2 >>> 16;
      c2 += h3 & 65535;
      d2 += h3 >>> 16;
      b3 += a2 >>> 16;
      c2 += b3 >>> 16;
      d2 += c2 >>> 16;
      hh[7] = ah7 = c2 & 65535 | d2 << 16;
      hl[7] = al7 = a2 & 65535 | b3 << 16;
      pos += 128;
      len -= 128;
    }
    return pos;
  }
  function hash(data) {
    var h3 = new SHA512();
    h3.update(data);
    var digest = h3.digest();
    h3.clean();
    return digest;
  }
  exports.hash = hash;
})(sha512);
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.convertSecretKeyToX25519 = exports.convertPublicKeyToX25519 = exports.verify = exports.sign = exports.extractPublicKeyFromSecretKey = exports.generateKeyPair = exports.generateKeyPairFromSeed = exports.SEED_LENGTH = exports.SECRET_KEY_LENGTH = exports.PUBLIC_KEY_LENGTH = exports.SIGNATURE_LENGTH = void 0;
  const random_1 = random;
  const sha512_1 = sha512;
  const wipe_1 = wipe;
  exports.SIGNATURE_LENGTH = 64;
  exports.PUBLIC_KEY_LENGTH = 32;
  exports.SECRET_KEY_LENGTH = 64;
  exports.SEED_LENGTH = 32;
  function gf(init) {
    const r = new Float64Array(16);
    if (init) {
      for (let i = 0; i < init.length; i++) {
        r[i] = init[i];
      }
    }
    return r;
  }
  const _9 = new Uint8Array(32);
  _9[0] = 9;
  const gf0 = gf();
  const gf1 = gf([1]);
  const D2 = gf([
    30883,
    4953,
    19914,
    30187,
    55467,
    16705,
    2637,
    112,
    59544,
    30585,
    16505,
    36039,
    65139,
    11119,
    27886,
    20995
  ]);
  const D22 = gf([
    61785,
    9906,
    39828,
    60374,
    45398,
    33411,
    5274,
    224,
    53552,
    61171,
    33010,
    6542,
    64743,
    22239,
    55772,
    9222
  ]);
  const X2 = gf([
    54554,
    36645,
    11616,
    51542,
    42930,
    38181,
    51040,
    26924,
    56412,
    64982,
    57905,
    49316,
    21502,
    52590,
    14035,
    8553
  ]);
  const Y = gf([
    26200,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214
  ]);
  const I2 = gf([
    41136,
    18958,
    6951,
    50414,
    58488,
    44335,
    6150,
    12099,
    55207,
    15867,
    153,
    11085,
    57099,
    20417,
    9344,
    11139
  ]);
  function set25519(r, a2) {
    for (let i = 0; i < 16; i++) {
      r[i] = a2[i] | 0;
    }
  }
  function car25519(o) {
    let c2 = 1;
    for (let i = 0; i < 16; i++) {
      let v2 = o[i] + c2 + 65535;
      c2 = Math.floor(v2 / 65536);
      o[i] = v2 - c2 * 65536;
    }
    o[0] += c2 - 1 + 37 * (c2 - 1);
  }
  function sel25519(p3, q2, b3) {
    const c2 = ~(b3 - 1);
    for (let i = 0; i < 16; i++) {
      const t = c2 & (p3[i] ^ q2[i]);
      p3[i] ^= t;
      q2[i] ^= t;
    }
  }
  function pack25519(o, n2) {
    const m2 = gf();
    const t = gf();
    for (let i = 0; i < 16; i++) {
      t[i] = n2[i];
    }
    car25519(t);
    car25519(t);
    car25519(t);
    for (let j2 = 0; j2 < 2; j2++) {
      m2[0] = t[0] - 65517;
      for (let i = 1; i < 15; i++) {
        m2[i] = t[i] - 65535 - (m2[i - 1] >> 16 & 1);
        m2[i - 1] &= 65535;
      }
      m2[15] = t[15] - 32767 - (m2[14] >> 16 & 1);
      const b3 = m2[15] >> 16 & 1;
      m2[14] &= 65535;
      sel25519(t, m2, 1 - b3);
    }
    for (let i = 0; i < 16; i++) {
      o[2 * i] = t[i] & 255;
      o[2 * i + 1] = t[i] >> 8;
    }
  }
  function verify32(x2, y3) {
    let d2 = 0;
    for (let i = 0; i < 32; i++) {
      d2 |= x2[i] ^ y3[i];
    }
    return (1 & d2 - 1 >>> 8) - 1;
  }
  function neq25519(a2, b3) {
    const c2 = new Uint8Array(32);
    const d2 = new Uint8Array(32);
    pack25519(c2, a2);
    pack25519(d2, b3);
    return verify32(c2, d2);
  }
  function par25519(a2) {
    const d2 = new Uint8Array(32);
    pack25519(d2, a2);
    return d2[0] & 1;
  }
  function unpack25519(o, n2) {
    for (let i = 0; i < 16; i++) {
      o[i] = n2[2 * i] + (n2[2 * i + 1] << 8);
    }
    o[15] &= 32767;
  }
  function add(o, a2, b3) {
    for (let i = 0; i < 16; i++) {
      o[i] = a2[i] + b3[i];
    }
  }
  function sub(o, a2, b3) {
    for (let i = 0; i < 16; i++) {
      o[i] = a2[i] - b3[i];
    }
  }
  function mul(o, a2, b3) {
    let v2, c2, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b3[0], b1 = b3[1], b22 = b3[2], b32 = b3[3], b4 = b3[4], b5 = b3[5], b6 = b3[6], b7 = b3[7], b8 = b3[8], b9 = b3[9], b10 = b3[10], b11 = b3[11], b12 = b3[12], b13 = b3[13], b14 = b3[14], b15 = b3[15];
    v2 = a2[0];
    t0 += v2 * b0;
    t1 += v2 * b1;
    t2 += v2 * b22;
    t3 += v2 * b32;
    t4 += v2 * b4;
    t5 += v2 * b5;
    t6 += v2 * b6;
    t7 += v2 * b7;
    t8 += v2 * b8;
    t9 += v2 * b9;
    t10 += v2 * b10;
    t11 += v2 * b11;
    t12 += v2 * b12;
    t13 += v2 * b13;
    t14 += v2 * b14;
    t15 += v2 * b15;
    v2 = a2[1];
    t1 += v2 * b0;
    t2 += v2 * b1;
    t3 += v2 * b22;
    t4 += v2 * b32;
    t5 += v2 * b4;
    t6 += v2 * b5;
    t7 += v2 * b6;
    t8 += v2 * b7;
    t9 += v2 * b8;
    t10 += v2 * b9;
    t11 += v2 * b10;
    t12 += v2 * b11;
    t13 += v2 * b12;
    t14 += v2 * b13;
    t15 += v2 * b14;
    t16 += v2 * b15;
    v2 = a2[2];
    t2 += v2 * b0;
    t3 += v2 * b1;
    t4 += v2 * b22;
    t5 += v2 * b32;
    t6 += v2 * b4;
    t7 += v2 * b5;
    t8 += v2 * b6;
    t9 += v2 * b7;
    t10 += v2 * b8;
    t11 += v2 * b9;
    t12 += v2 * b10;
    t13 += v2 * b11;
    t14 += v2 * b12;
    t15 += v2 * b13;
    t16 += v2 * b14;
    t17 += v2 * b15;
    v2 = a2[3];
    t3 += v2 * b0;
    t4 += v2 * b1;
    t5 += v2 * b22;
    t6 += v2 * b32;
    t7 += v2 * b4;
    t8 += v2 * b5;
    t9 += v2 * b6;
    t10 += v2 * b7;
    t11 += v2 * b8;
    t12 += v2 * b9;
    t13 += v2 * b10;
    t14 += v2 * b11;
    t15 += v2 * b12;
    t16 += v2 * b13;
    t17 += v2 * b14;
    t18 += v2 * b15;
    v2 = a2[4];
    t4 += v2 * b0;
    t5 += v2 * b1;
    t6 += v2 * b22;
    t7 += v2 * b32;
    t8 += v2 * b4;
    t9 += v2 * b5;
    t10 += v2 * b6;
    t11 += v2 * b7;
    t12 += v2 * b8;
    t13 += v2 * b9;
    t14 += v2 * b10;
    t15 += v2 * b11;
    t16 += v2 * b12;
    t17 += v2 * b13;
    t18 += v2 * b14;
    t19 += v2 * b15;
    v2 = a2[5];
    t5 += v2 * b0;
    t6 += v2 * b1;
    t7 += v2 * b22;
    t8 += v2 * b32;
    t9 += v2 * b4;
    t10 += v2 * b5;
    t11 += v2 * b6;
    t12 += v2 * b7;
    t13 += v2 * b8;
    t14 += v2 * b9;
    t15 += v2 * b10;
    t16 += v2 * b11;
    t17 += v2 * b12;
    t18 += v2 * b13;
    t19 += v2 * b14;
    t20 += v2 * b15;
    v2 = a2[6];
    t6 += v2 * b0;
    t7 += v2 * b1;
    t8 += v2 * b22;
    t9 += v2 * b32;
    t10 += v2 * b4;
    t11 += v2 * b5;
    t12 += v2 * b6;
    t13 += v2 * b7;
    t14 += v2 * b8;
    t15 += v2 * b9;
    t16 += v2 * b10;
    t17 += v2 * b11;
    t18 += v2 * b12;
    t19 += v2 * b13;
    t20 += v2 * b14;
    t21 += v2 * b15;
    v2 = a2[7];
    t7 += v2 * b0;
    t8 += v2 * b1;
    t9 += v2 * b22;
    t10 += v2 * b32;
    t11 += v2 * b4;
    t12 += v2 * b5;
    t13 += v2 * b6;
    t14 += v2 * b7;
    t15 += v2 * b8;
    t16 += v2 * b9;
    t17 += v2 * b10;
    t18 += v2 * b11;
    t19 += v2 * b12;
    t20 += v2 * b13;
    t21 += v2 * b14;
    t22 += v2 * b15;
    v2 = a2[8];
    t8 += v2 * b0;
    t9 += v2 * b1;
    t10 += v2 * b22;
    t11 += v2 * b32;
    t12 += v2 * b4;
    t13 += v2 * b5;
    t14 += v2 * b6;
    t15 += v2 * b7;
    t16 += v2 * b8;
    t17 += v2 * b9;
    t18 += v2 * b10;
    t19 += v2 * b11;
    t20 += v2 * b12;
    t21 += v2 * b13;
    t22 += v2 * b14;
    t23 += v2 * b15;
    v2 = a2[9];
    t9 += v2 * b0;
    t10 += v2 * b1;
    t11 += v2 * b22;
    t12 += v2 * b32;
    t13 += v2 * b4;
    t14 += v2 * b5;
    t15 += v2 * b6;
    t16 += v2 * b7;
    t17 += v2 * b8;
    t18 += v2 * b9;
    t19 += v2 * b10;
    t20 += v2 * b11;
    t21 += v2 * b12;
    t22 += v2 * b13;
    t23 += v2 * b14;
    t24 += v2 * b15;
    v2 = a2[10];
    t10 += v2 * b0;
    t11 += v2 * b1;
    t12 += v2 * b22;
    t13 += v2 * b32;
    t14 += v2 * b4;
    t15 += v2 * b5;
    t16 += v2 * b6;
    t17 += v2 * b7;
    t18 += v2 * b8;
    t19 += v2 * b9;
    t20 += v2 * b10;
    t21 += v2 * b11;
    t22 += v2 * b12;
    t23 += v2 * b13;
    t24 += v2 * b14;
    t25 += v2 * b15;
    v2 = a2[11];
    t11 += v2 * b0;
    t12 += v2 * b1;
    t13 += v2 * b22;
    t14 += v2 * b32;
    t15 += v2 * b4;
    t16 += v2 * b5;
    t17 += v2 * b6;
    t18 += v2 * b7;
    t19 += v2 * b8;
    t20 += v2 * b9;
    t21 += v2 * b10;
    t22 += v2 * b11;
    t23 += v2 * b12;
    t24 += v2 * b13;
    t25 += v2 * b14;
    t26 += v2 * b15;
    v2 = a2[12];
    t12 += v2 * b0;
    t13 += v2 * b1;
    t14 += v2 * b22;
    t15 += v2 * b32;
    t16 += v2 * b4;
    t17 += v2 * b5;
    t18 += v2 * b6;
    t19 += v2 * b7;
    t20 += v2 * b8;
    t21 += v2 * b9;
    t22 += v2 * b10;
    t23 += v2 * b11;
    t24 += v2 * b12;
    t25 += v2 * b13;
    t26 += v2 * b14;
    t27 += v2 * b15;
    v2 = a2[13];
    t13 += v2 * b0;
    t14 += v2 * b1;
    t15 += v2 * b22;
    t16 += v2 * b32;
    t17 += v2 * b4;
    t18 += v2 * b5;
    t19 += v2 * b6;
    t20 += v2 * b7;
    t21 += v2 * b8;
    t22 += v2 * b9;
    t23 += v2 * b10;
    t24 += v2 * b11;
    t25 += v2 * b12;
    t26 += v2 * b13;
    t27 += v2 * b14;
    t28 += v2 * b15;
    v2 = a2[14];
    t14 += v2 * b0;
    t15 += v2 * b1;
    t16 += v2 * b22;
    t17 += v2 * b32;
    t18 += v2 * b4;
    t19 += v2 * b5;
    t20 += v2 * b6;
    t21 += v2 * b7;
    t22 += v2 * b8;
    t23 += v2 * b9;
    t24 += v2 * b10;
    t25 += v2 * b11;
    t26 += v2 * b12;
    t27 += v2 * b13;
    t28 += v2 * b14;
    t29 += v2 * b15;
    v2 = a2[15];
    t15 += v2 * b0;
    t16 += v2 * b1;
    t17 += v2 * b22;
    t18 += v2 * b32;
    t19 += v2 * b4;
    t20 += v2 * b5;
    t21 += v2 * b6;
    t22 += v2 * b7;
    t23 += v2 * b8;
    t24 += v2 * b9;
    t25 += v2 * b10;
    t26 += v2 * b11;
    t27 += v2 * b12;
    t28 += v2 * b13;
    t29 += v2 * b14;
    t30 += v2 * b15;
    t0 += 38 * t16;
    t1 += 38 * t17;
    t2 += 38 * t18;
    t3 += 38 * t19;
    t4 += 38 * t20;
    t5 += 38 * t21;
    t6 += 38 * t22;
    t7 += 38 * t23;
    t8 += 38 * t24;
    t9 += 38 * t25;
    t10 += 38 * t26;
    t11 += 38 * t27;
    t12 += 38 * t28;
    t13 += 38 * t29;
    t14 += 38 * t30;
    c2 = 1;
    v2 = t0 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t0 = v2 - c2 * 65536;
    v2 = t1 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t1 = v2 - c2 * 65536;
    v2 = t2 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t2 = v2 - c2 * 65536;
    v2 = t3 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t3 = v2 - c2 * 65536;
    v2 = t4 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t4 = v2 - c2 * 65536;
    v2 = t5 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t5 = v2 - c2 * 65536;
    v2 = t6 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t6 = v2 - c2 * 65536;
    v2 = t7 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t7 = v2 - c2 * 65536;
    v2 = t8 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t8 = v2 - c2 * 65536;
    v2 = t9 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t9 = v2 - c2 * 65536;
    v2 = t10 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t10 = v2 - c2 * 65536;
    v2 = t11 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t11 = v2 - c2 * 65536;
    v2 = t12 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t12 = v2 - c2 * 65536;
    v2 = t13 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t13 = v2 - c2 * 65536;
    v2 = t14 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t14 = v2 - c2 * 65536;
    v2 = t15 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t15 = v2 - c2 * 65536;
    t0 += c2 - 1 + 37 * (c2 - 1);
    c2 = 1;
    v2 = t0 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t0 = v2 - c2 * 65536;
    v2 = t1 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t1 = v2 - c2 * 65536;
    v2 = t2 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t2 = v2 - c2 * 65536;
    v2 = t3 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t3 = v2 - c2 * 65536;
    v2 = t4 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t4 = v2 - c2 * 65536;
    v2 = t5 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t5 = v2 - c2 * 65536;
    v2 = t6 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t6 = v2 - c2 * 65536;
    v2 = t7 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t7 = v2 - c2 * 65536;
    v2 = t8 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t8 = v2 - c2 * 65536;
    v2 = t9 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t9 = v2 - c2 * 65536;
    v2 = t10 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t10 = v2 - c2 * 65536;
    v2 = t11 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t11 = v2 - c2 * 65536;
    v2 = t12 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t12 = v2 - c2 * 65536;
    v2 = t13 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t13 = v2 - c2 * 65536;
    v2 = t14 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t14 = v2 - c2 * 65536;
    v2 = t15 + c2 + 65535;
    c2 = Math.floor(v2 / 65536);
    t15 = v2 - c2 * 65536;
    t0 += c2 - 1 + 37 * (c2 - 1);
    o[0] = t0;
    o[1] = t1;
    o[2] = t2;
    o[3] = t3;
    o[4] = t4;
    o[5] = t5;
    o[6] = t6;
    o[7] = t7;
    o[8] = t8;
    o[9] = t9;
    o[10] = t10;
    o[11] = t11;
    o[12] = t12;
    o[13] = t13;
    o[14] = t14;
    o[15] = t15;
  }
  function square(o, a2) {
    mul(o, a2, a2);
  }
  function inv25519(o, i) {
    const c2 = gf();
    let a2;
    for (a2 = 0; a2 < 16; a2++) {
      c2[a2] = i[a2];
    }
    for (a2 = 253; a2 >= 0; a2--) {
      square(c2, c2);
      if (a2 !== 2 && a2 !== 4) {
        mul(c2, c2, i);
      }
    }
    for (a2 = 0; a2 < 16; a2++) {
      o[a2] = c2[a2];
    }
  }
  function pow2523(o, i) {
    const c2 = gf();
    let a2;
    for (a2 = 0; a2 < 16; a2++) {
      c2[a2] = i[a2];
    }
    for (a2 = 250; a2 >= 0; a2--) {
      square(c2, c2);
      if (a2 !== 1) {
        mul(c2, c2, i);
      }
    }
    for (a2 = 0; a2 < 16; a2++) {
      o[a2] = c2[a2];
    }
  }
  function edadd(p3, q2) {
    const a2 = gf(), b3 = gf(), c2 = gf(), d2 = gf(), e = gf(), f2 = gf(), g3 = gf(), h3 = gf(), t = gf();
    sub(a2, p3[1], p3[0]);
    sub(t, q2[1], q2[0]);
    mul(a2, a2, t);
    add(b3, p3[0], p3[1]);
    add(t, q2[0], q2[1]);
    mul(b3, b3, t);
    mul(c2, p3[3], q2[3]);
    mul(c2, c2, D22);
    mul(d2, p3[2], q2[2]);
    add(d2, d2, d2);
    sub(e, b3, a2);
    sub(f2, d2, c2);
    add(g3, d2, c2);
    add(h3, b3, a2);
    mul(p3[0], e, f2);
    mul(p3[1], h3, g3);
    mul(p3[2], g3, f2);
    mul(p3[3], e, h3);
  }
  function cswap(p3, q2, b3) {
    for (let i = 0; i < 4; i++) {
      sel25519(p3[i], q2[i], b3);
    }
  }
  function pack(r, p3) {
    const tx = gf(), ty = gf(), zi = gf();
    inv25519(zi, p3[2]);
    mul(tx, p3[0], zi);
    mul(ty, p3[1], zi);
    pack25519(r, ty);
    r[31] ^= par25519(tx) << 7;
  }
  function scalarmult(p3, q2, s) {
    set25519(p3[0], gf0);
    set25519(p3[1], gf1);
    set25519(p3[2], gf1);
    set25519(p3[3], gf0);
    for (let i = 255; i >= 0; --i) {
      const b3 = s[i / 8 | 0] >> (i & 7) & 1;
      cswap(p3, q2, b3);
      edadd(q2, p3);
      edadd(p3, p3);
      cswap(p3, q2, b3);
    }
  }
  function scalarbase(p3, s) {
    const q2 = [gf(), gf(), gf(), gf()];
    set25519(q2[0], X2);
    set25519(q2[1], Y);
    set25519(q2[2], gf1);
    mul(q2[3], X2, Y);
    scalarmult(p3, q2, s);
  }
  function generateKeyPairFromSeed(seed) {
    if (seed.length !== exports.SEED_LENGTH) {
      throw new Error(`ed25519: seed must be ${exports.SEED_LENGTH} bytes`);
    }
    const d2 = (0, sha512_1.hash)(seed);
    d2[0] &= 248;
    d2[31] &= 127;
    d2[31] |= 64;
    const publicKey = new Uint8Array(32);
    const p3 = [gf(), gf(), gf(), gf()];
    scalarbase(p3, d2);
    pack(publicKey, p3);
    const secretKey = new Uint8Array(64);
    secretKey.set(seed);
    secretKey.set(publicKey, 32);
    return {
      publicKey,
      secretKey
    };
  }
  exports.generateKeyPairFromSeed = generateKeyPairFromSeed;
  function generateKeyPair2(prng) {
    const seed = (0, random_1.randomBytes)(32, prng);
    const result = generateKeyPairFromSeed(seed);
    (0, wipe_1.wipe)(seed);
    return result;
  }
  exports.generateKeyPair = generateKeyPair2;
  function extractPublicKeyFromSecretKey(secretKey) {
    if (secretKey.length !== exports.SECRET_KEY_LENGTH) {
      throw new Error(`ed25519: secret key must be ${exports.SECRET_KEY_LENGTH} bytes`);
    }
    return new Uint8Array(secretKey.subarray(32));
  }
  exports.extractPublicKeyFromSecretKey = extractPublicKeyFromSecretKey;
  const L2 = new Float64Array([
    237,
    211,
    245,
    92,
    26,
    99,
    18,
    88,
    214,
    156,
    247,
    162,
    222,
    249,
    222,
    20,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    16
  ]);
  function modL(r, x2) {
    let carry;
    let i;
    let j2;
    let k2;
    for (i = 63; i >= 32; --i) {
      carry = 0;
      for (j2 = i - 32, k2 = i - 12; j2 < k2; ++j2) {
        x2[j2] += carry - 16 * x2[i] * L2[j2 - (i - 32)];
        carry = Math.floor((x2[j2] + 128) / 256);
        x2[j2] -= carry * 256;
      }
      x2[j2] += carry;
      x2[i] = 0;
    }
    carry = 0;
    for (j2 = 0; j2 < 32; j2++) {
      x2[j2] += carry - (x2[31] >> 4) * L2[j2];
      carry = x2[j2] >> 8;
      x2[j2] &= 255;
    }
    for (j2 = 0; j2 < 32; j2++) {
      x2[j2] -= carry * L2[j2];
    }
    for (i = 0; i < 32; i++) {
      x2[i + 1] += x2[i] >> 8;
      r[i] = x2[i] & 255;
    }
  }
  function reduce(r) {
    const x2 = new Float64Array(64);
    for (let i = 0; i < 64; i++) {
      x2[i] = r[i];
    }
    for (let i = 0; i < 64; i++) {
      r[i] = 0;
    }
    modL(r, x2);
  }
  function sign(secretKey, message) {
    const x2 = new Float64Array(64);
    const p3 = [gf(), gf(), gf(), gf()];
    const d2 = (0, sha512_1.hash)(secretKey.subarray(0, 32));
    d2[0] &= 248;
    d2[31] &= 127;
    d2[31] |= 64;
    const signature = new Uint8Array(64);
    signature.set(d2.subarray(32), 32);
    const hs2 = new sha512_1.SHA512();
    hs2.update(signature.subarray(32));
    hs2.update(message);
    const r = hs2.digest();
    hs2.clean();
    reduce(r);
    scalarbase(p3, r);
    pack(signature, p3);
    hs2.reset();
    hs2.update(signature.subarray(0, 32));
    hs2.update(secretKey.subarray(32));
    hs2.update(message);
    const h3 = hs2.digest();
    reduce(h3);
    for (let i = 0; i < 32; i++) {
      x2[i] = r[i];
    }
    for (let i = 0; i < 32; i++) {
      for (let j2 = 0; j2 < 32; j2++) {
        x2[i + j2] += h3[i] * d2[j2];
      }
    }
    modL(signature.subarray(32), x2);
    return signature;
  }
  exports.sign = sign;
  function unpackneg(r, p3) {
    const t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
    set25519(r[2], gf1);
    unpack25519(r[1], p3);
    square(num, r[1]);
    mul(den, num, D2);
    sub(num, num, r[2]);
    add(den, r[2], den);
    square(den2, den);
    square(den4, den2);
    mul(den6, den4, den2);
    mul(t, den6, num);
    mul(t, t, den);
    pow2523(t, t);
    mul(t, t, num);
    mul(t, t, den);
    mul(t, t, den);
    mul(r[0], t, den);
    square(chk, r[0]);
    mul(chk, chk, den);
    if (neq25519(chk, num)) {
      mul(r[0], r[0], I2);
    }
    square(chk, r[0]);
    mul(chk, chk, den);
    if (neq25519(chk, num)) {
      return -1;
    }
    if (par25519(r[0]) === p3[31] >> 7) {
      sub(r[0], gf0, r[0]);
    }
    mul(r[3], r[0], r[1]);
    return 0;
  }
  function verify(publicKey, message, signature) {
    const t = new Uint8Array(32);
    const p3 = [gf(), gf(), gf(), gf()];
    const q2 = [gf(), gf(), gf(), gf()];
    if (signature.length !== exports.SIGNATURE_LENGTH) {
      throw new Error(`ed25519: signature must be ${exports.SIGNATURE_LENGTH} bytes`);
    }
    if (unpackneg(q2, publicKey)) {
      return false;
    }
    const hs2 = new sha512_1.SHA512();
    hs2.update(signature.subarray(0, 32));
    hs2.update(publicKey);
    hs2.update(message);
    const h3 = hs2.digest();
    reduce(h3);
    scalarmult(p3, q2, h3);
    scalarbase(q2, signature.subarray(32));
    edadd(p3, q2);
    pack(t, p3);
    if (verify32(signature, t)) {
      return false;
    }
    return true;
  }
  exports.verify = verify;
  function convertPublicKeyToX25519(publicKey) {
    let q2 = [gf(), gf(), gf(), gf()];
    if (unpackneg(q2, publicKey)) {
      throw new Error("Ed25519: invalid public key");
    }
    let a2 = gf();
    let b3 = gf();
    let y3 = q2[1];
    add(a2, gf1, y3);
    sub(b3, gf1, y3);
    inv25519(b3, b3);
    mul(a2, a2, b3);
    let z2 = new Uint8Array(32);
    pack25519(z2, a2);
    return z2;
  }
  exports.convertPublicKeyToX25519 = convertPublicKeyToX25519;
  function convertSecretKeyToX25519(secretKey) {
    const d2 = (0, sha512_1.hash)(secretKey.subarray(0, 32));
    d2[0] &= 248;
    d2[31] &= 127;
    d2[31] |= 64;
    const o = new Uint8Array(d2.subarray(0, 32));
    (0, wipe_1.wipe)(d2);
    return o;
  }
  exports.convertSecretKeyToX25519 = convertSecretKeyToX25519;
})(ed25519);
const JWT_IRIDIUM_ALG = "EdDSA";
const JWT_IRIDIUM_TYP = "JWT";
const JWT_DELIMITER = ".";
const JWT_ENCODING = "base64url";
const JSON_ENCODING = "utf8";
const DATA_ENCODING = "utf8";
const DID_DELIMITER = ":";
const DID_PREFIX = "did";
const DID_METHOD = "key";
const MULTICODEC_ED25519_ENCODING = "base58btc";
const MULTICODEC_ED25519_BASE = "z";
const MULTICODEC_ED25519_HEADER = "K36";
const KEY_PAIR_SEED_LENGTH = 32;
function encodeJSON(val) {
  return toString(fromString(safeJsonStringify(val), JSON_ENCODING), JWT_ENCODING);
}
function encodeIss(publicKey) {
  const header = fromString(MULTICODEC_ED25519_HEADER, MULTICODEC_ED25519_ENCODING);
  const multicodec = MULTICODEC_ED25519_BASE + toString(concat([header, publicKey]), MULTICODEC_ED25519_ENCODING);
  return [DID_PREFIX, DID_METHOD, multicodec].join(DID_DELIMITER);
}
function encodeSig(bytes) {
  return toString(bytes, JWT_ENCODING);
}
function encodeData(params) {
  return fromString([encodeJSON(params.header), encodeJSON(params.payload)].join(JWT_DELIMITER), DATA_ENCODING);
}
function encodeJWT(params) {
  return [
    encodeJSON(params.header),
    encodeJSON(params.payload),
    encodeSig(params.signature)
  ].join(JWT_DELIMITER);
}
function generateKeyPair(seed = random.randomBytes(KEY_PAIR_SEED_LENGTH)) {
  return ed25519.generateKeyPairFromSeed(seed);
}
async function signJWT(sub, aud, ttl, keyPair, iat = cjs$3.fromMiliseconds(Date.now())) {
  const header = { alg: JWT_IRIDIUM_ALG, typ: JWT_IRIDIUM_TYP };
  const iss = encodeIss(keyPair.publicKey);
  const exp = iat + ttl;
  const payload = { iss, sub, aud, iat, exp };
  const data = encodeData({ header, payload });
  const signature = ed25519.sign(keyPair.secretKey, data);
  return encodeJWT({ header, payload, signature });
}
const PARSE_ERROR = "PARSE_ERROR";
const INVALID_REQUEST = "INVALID_REQUEST";
const METHOD_NOT_FOUND = "METHOD_NOT_FOUND";
const INVALID_PARAMS = "INVALID_PARAMS";
const INTERNAL_ERROR = "INTERNAL_ERROR";
const SERVER_ERROR = "SERVER_ERROR";
const RESERVED_ERROR_CODES = [-32700, -32600, -32601, -32602, -32603];
const STANDARD_ERROR_MAP = {
  [PARSE_ERROR]: { code: -32700, message: "Parse error" },
  [INVALID_REQUEST]: { code: -32600, message: "Invalid Request" },
  [METHOD_NOT_FOUND]: { code: -32601, message: "Method not found" },
  [INVALID_PARAMS]: { code: -32602, message: "Invalid params" },
  [INTERNAL_ERROR]: { code: -32603, message: "Internal error" },
  [SERVER_ERROR]: { code: -32e3, message: "Server error" }
};
const DEFAULT_ERROR = SERVER_ERROR;
function isReservedErrorCode(code) {
  return RESERVED_ERROR_CODES.includes(code);
}
function getError(type) {
  if (!Object.keys(STANDARD_ERROR_MAP).includes(type)) {
    return STANDARD_ERROR_MAP[DEFAULT_ERROR];
  }
  return STANDARD_ERROR_MAP[type];
}
function getErrorByCode(code) {
  const match = Object.values(STANDARD_ERROR_MAP).find((e) => e.code === code);
  if (!match) {
    return STANDARD_ERROR_MAP[DEFAULT_ERROR];
  }
  return match;
}
function parseConnectionError(e, url, type) {
  return e.message.includes("getaddrinfo ENOTFOUND") || e.message.includes("connect ECONNREFUSED") ? new Error(`Unavailable ${type} RPC url at ${url}`) : e;
}
var cjs = {};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d2, b3) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b4) {
    d3.__proto__ = b4;
  } || function(d3, b4) {
    for (var p3 in b4)
      if (b4.hasOwnProperty(p3))
        d3[p3] = b4[p3];
  };
  return extendStatics(d2, b3);
};
function __extends(d2, b3) {
  extendStatics(d2, b3);
  function __() {
    this.constructor = d2;
  }
  d2.prototype = b3 === null ? Object.create(b3) : (__.prototype = b3.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n2 = arguments.length; i < n2; i++) {
      s = arguments[i];
      for (var p3 in s)
        if (Object.prototype.hasOwnProperty.call(s, p3))
          t[p3] = s[p3];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};
  for (var p3 in s)
    if (Object.prototype.hasOwnProperty.call(s, p3) && e.indexOf(p3) < 0)
      t[p3] = s[p3];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p3 = Object.getOwnPropertySymbols(s); i < p3.length; i++) {
      if (e.indexOf(p3[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p3[i]))
        t[p3[i]] = s[p3[i]];
    }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c2 = arguments.length, r = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d2 = decorators[i])
        r = (c2 < 3 ? d2(r) : c2 > 3 ? d2(target, key, r) : d2(target, key)) || r;
  return c2 > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _3 = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f2, y3, t, g3;
  return g3 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g3[Symbol.iterator] = function() {
    return this;
  }), g3;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
    };
  }
  function step(op) {
    if (f2)
      throw new TypeError("Generator is already executing.");
    while (_3)
      try {
        if (f2 = 1, y3 && (t = op[0] & 2 ? y3["return"] : op[0] ? y3["throw"] || ((t = y3["return"]) && t.call(y3), 0) : y3.next) && !(t = t.call(y3, op[1])).done)
          return t;
        if (y3 = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _3.label++;
            return { value: op[1], done: false };
          case 5:
            _3.label++;
            y3 = op[1];
            op = [0];
            continue;
          case 7:
            op = _3.ops.pop();
            _3.trys.pop();
            continue;
          default:
            if (!(t = _3.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _3 = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _3.label = op[1];
              break;
            }
            if (op[0] === 6 && _3.label < t[1]) {
              _3.label = t[1];
              t = op;
              break;
            }
            if (t && _3.label < t[2]) {
              _3.label = t[2];
              _3.ops.push(op);
              break;
            }
            if (t[2])
              _3.ops.pop();
            _3.trys.pop();
            continue;
        }
        op = body.call(thisArg, _3);
      } catch (e) {
        op = [6, e];
        y3 = 0;
      } finally {
        f2 = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __createBinding(o, m2, k2, k22) {
  if (k22 === void 0)
    k22 = k2;
  o[k22] = m2[k2];
}
function __exportStar(m2, exports) {
  for (var p3 in m2)
    if (p3 !== "default" && !exports.hasOwnProperty(p3))
      exports[p3] = m2[p3];
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m2 = s && o[s], i = 0;
  if (m2)
    return m2.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n2) {
  var m2 = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m2)
    return o;
  var i = m2.call(o), r, ar2 = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done)
      ar2.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m2 = i["return"]))
        m2.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar2;
}
function __spread() {
  for (var ar2 = [], i = 0; i < arguments.length; i++)
    ar2 = ar2.concat(__read(arguments[i]));
  return ar2;
}
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++)
    s += arguments[i].length;
  for (var r = Array(s), k2 = 0, i = 0; i < il; i++)
    for (var a2 = arguments[i], j2 = 0, jl = a2.length; j2 < jl; j2++, k2++)
      r[k2] = a2[j2];
  return r;
}
function __await(v2) {
  return this instanceof __await ? (this.v = v2, this) : new __await(v2);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g3 = generator.apply(thisArg, _arguments || []), i, q2 = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n2) {
    if (g3[n2])
      i[n2] = function(v2) {
        return new Promise(function(a2, b3) {
          q2.push([n2, v2, a2, b3]) > 1 || resume(n2, v2);
        });
      };
  }
  function resume(n2, v2) {
    try {
      step(g3[n2](v2));
    } catch (e) {
      settle(q2[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q2[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f2, v2) {
    if (f2(v2), q2.shift(), q2.length)
      resume(q2[0][0], q2[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p3;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n2, f2) {
    i[n2] = o[n2] ? function(v2) {
      return (p3 = !p3) ? { value: __await(o[n2](v2)), done: n2 === "return" } : f2 ? f2(v2) : v2;
    } : f2;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m2 = o[Symbol.asyncIterator], i;
  return m2 ? m2.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n2) {
    i[n2] = o[n2] && function(v2) {
      return new Promise(function(resolve, reject) {
        v2 = o[n2](v2), settle(resolve, reject, v2.done, v2.value);
      });
    };
  }
  function settle(resolve, reject, d2, v2) {
    Promise.resolve(v2).then(function(v3) {
      resolve({ value: v3, done: d2 });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k2 in mod)
      if (Object.hasOwnProperty.call(mod, k2))
        result[k2] = mod[k2];
  }
  result.default = mod;
  return result;
}
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return privateMap.get(receiver);
}
function __classPrivateFieldSet(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }
  privateMap.set(receiver, value);
  return value;
}
const tslib_es6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get __assign() {
    return __assign;
  },
  __asyncDelegator,
  __asyncGenerator,
  __asyncValues,
  __await,
  __awaiter,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __createBinding,
  __decorate,
  __exportStar,
  __extends,
  __generator,
  __importDefault,
  __importStar,
  __makeTemplateObject,
  __metadata,
  __param,
  __read,
  __rest,
  __spread,
  __spreadArrays,
  __values
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(tslib_es6);
var crypto$1 = {};
var hasRequiredCrypto;
function requireCrypto() {
  if (hasRequiredCrypto)
    return crypto$1;
  hasRequiredCrypto = 1;
  Object.defineProperty(crypto$1, "__esModule", { value: true });
  crypto$1.isBrowserCryptoAvailable = crypto$1.getSubtleCrypto = crypto$1.getBrowerCrypto = void 0;
  function getBrowerCrypto() {
    return (commonjsGlobal === null || commonjsGlobal === void 0 ? void 0 : commonjsGlobal.crypto) || (commonjsGlobal === null || commonjsGlobal === void 0 ? void 0 : commonjsGlobal.msCrypto) || {};
  }
  crypto$1.getBrowerCrypto = getBrowerCrypto;
  function getSubtleCrypto() {
    const browserCrypto = getBrowerCrypto();
    return browserCrypto.subtle || browserCrypto.webkitSubtle;
  }
  crypto$1.getSubtleCrypto = getSubtleCrypto;
  function isBrowserCryptoAvailable() {
    return !!getBrowerCrypto() && !!getSubtleCrypto();
  }
  crypto$1.isBrowserCryptoAvailable = isBrowserCryptoAvailable;
  return crypto$1;
}
var env = {};
var hasRequiredEnv;
function requireEnv() {
  if (hasRequiredEnv)
    return env;
  hasRequiredEnv = 1;
  Object.defineProperty(env, "__esModule", { value: true });
  env.isBrowser = env.isNode = env.isReactNative = void 0;
  function isReactNative() {
    return typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative";
  }
  env.isReactNative = isReactNative;
  function isNode() {
    return typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined";
  }
  env.isNode = isNode;
  function isBrowser() {
    return !isReactNative() && !isNode();
  }
  env.isBrowser = isBrowser;
  return env;
}
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  const tslib_1 = require$$0;
  tslib_1.__exportStar(requireCrypto(), exports);
  tslib_1.__exportStar(requireEnv(), exports);
})(cjs);
function payloadId(entropy = 3) {
  const date = Date.now() * Math.pow(10, entropy);
  const extra = Math.floor(Math.random() * Math.pow(10, entropy));
  return date + extra;
}
function getBigIntRpcId(entropy = 6) {
  return BigInt(payloadId(entropy));
}
function formatJsonRpcRequest(method, params, id) {
  return {
    id: id || payloadId(),
    jsonrpc: "2.0",
    method,
    params
  };
}
function formatJsonRpcResult(id, result) {
  return {
    id,
    jsonrpc: "2.0",
    result
  };
}
function formatJsonRpcError(id, error, data) {
  return {
    id,
    jsonrpc: "2.0",
    error: formatErrorMessage(error, data)
  };
}
function formatErrorMessage(error, data) {
  if (typeof error === "undefined") {
    return getError(INTERNAL_ERROR);
  }
  if (typeof error === "string") {
    error = Object.assign(Object.assign({}, getError(SERVER_ERROR)), { message: error });
  }
  if (typeof data !== "undefined") {
    error.data = data;
  }
  if (isReservedErrorCode(error.code)) {
    error = getErrorByCode(error.code);
  }
  return error;
}
class IEvents2 {
}
class IBaseJsonRpcProvider extends IEvents2 {
  constructor() {
    super();
  }
}
class IJsonRpcProvider extends IBaseJsonRpcProvider {
  constructor(connection) {
    super();
  }
}
const HTTP_REGEX = "^https?:";
const WS_REGEX = "^wss?:";
function getUrlProtocol(url) {
  const matches = url.match(new RegExp(/^\w+:/, "gi"));
  if (!matches || !matches.length)
    return;
  return matches[0];
}
function matchRegexProtocol(url, regex) {
  const protocol = getUrlProtocol(url);
  if (typeof protocol === "undefined")
    return false;
  return new RegExp(regex).test(protocol);
}
function isHttpUrl(url) {
  return matchRegexProtocol(url, HTTP_REGEX);
}
function isWsUrl(url) {
  return matchRegexProtocol(url, WS_REGEX);
}
function isLocalhostUrl(url) {
  return new RegExp("wss?://localhost(:d{2,5})?").test(url);
}
function isJsonRpcPayload(payload) {
  return typeof payload === "object" && "id" in payload && "jsonrpc" in payload && payload.jsonrpc === "2.0";
}
function isJsonRpcRequest(payload) {
  return isJsonRpcPayload(payload) && "method" in payload;
}
function isJsonRpcResponse(payload) {
  return isJsonRpcPayload(payload) && (isJsonRpcResult(payload) || isJsonRpcError(payload));
}
function isJsonRpcResult(payload) {
  return "result" in payload;
}
function isJsonRpcError(payload) {
  return "error" in payload;
}
class JsonRpcProvider extends IJsonRpcProvider {
  constructor(connection) {
    super(connection);
    this.events = new eventsExports.EventEmitter();
    this.hasRegisteredEventListeners = false;
    this.connection = this.setConnection(connection);
    if (this.connection.connected) {
      this.registerEventListeners();
    }
  }
  async connect(connection = this.connection) {
    await this.open(connection);
  }
  async disconnect() {
    await this.close();
  }
  on(event, listener) {
    this.events.on(event, listener);
  }
  once(event, listener) {
    this.events.once(event, listener);
  }
  off(event, listener) {
    this.events.off(event, listener);
  }
  removeListener(event, listener) {
    this.events.removeListener(event, listener);
  }
  async request(request, context) {
    return this.requestStrict(formatJsonRpcRequest(request.method, request.params || [], request.id || getBigIntRpcId().toString()), context);
  }
  async requestStrict(request, context) {
    return new Promise(async (resolve, reject) => {
      if (!this.connection.connected) {
        try {
          await this.open();
        } catch (e) {
          reject(e);
        }
      }
      this.events.on(`${request.id}`, (response) => {
        if (isJsonRpcError(response)) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
      try {
        await this.connection.send(request, context);
      } catch (e) {
        reject(e);
      }
    });
  }
  setConnection(connection = this.connection) {
    return connection;
  }
  onPayload(payload) {
    this.events.emit("payload", payload);
    if (isJsonRpcResponse(payload)) {
      this.events.emit(`${payload.id}`, payload);
    } else {
      this.events.emit("message", {
        type: payload.method,
        data: payload.params
      });
    }
  }
  onClose(event) {
    if (event && event.code === 3e3) {
      this.events.emit("error", new Error(`WebSocket connection closed abnormally with code: ${event.code} ${event.reason ? `(${event.reason})` : ""}`));
    }
    this.events.emit("disconnect");
  }
  async open(connection = this.connection) {
    if (this.connection === connection && this.connection.connected)
      return;
    if (this.connection.connected)
      this.close();
    if (typeof connection === "string") {
      await this.connection.open(connection);
      connection = this.connection;
    }
    this.connection = this.setConnection(connection);
    await this.connection.open();
    this.registerEventListeners();
    this.events.emit("connect");
  }
  async close() {
    await this.connection.close();
  }
  registerEventListeners() {
    if (this.hasRegisteredEventListeners)
      return;
    this.connection.on("payload", (payload) => this.onPayload(payload));
    this.connection.on("close", (event) => this.onClose(event));
    this.connection.on("error", (error) => this.events.emit("error", error));
    this.connection.on("register_error", (error) => this.onClose());
    this.hasRegisteredEventListeners = true;
  }
}
const resolveWebSocketImplementation = () => {
  if (typeof WebSocket !== "undefined") {
    return WebSocket;
  } else if (typeof global !== "undefined" && typeof global.WebSocket !== "undefined") {
    return global.WebSocket;
  } else if (typeof window !== "undefined" && typeof window.WebSocket !== "undefined") {
    return window.WebSocket;
  } else if (typeof self !== "undefined" && typeof self.WebSocket !== "undefined") {
    return self.WebSocket;
  }
  return require("ws");
};
const hasBuiltInWebSocket = () => typeof WebSocket !== "undefined" || typeof global !== "undefined" && typeof global.WebSocket !== "undefined" || typeof window !== "undefined" && typeof window.WebSocket !== "undefined" || typeof self !== "undefined" && typeof self.WebSocket !== "undefined";
const truncateQuery = (wssUrl) => wssUrl.split("?")[0];
const EVENT_EMITTER_MAX_LISTENERS_DEFAULT$1 = 10;
const WS = resolveWebSocketImplementation();
class WsConnection {
  constructor(url) {
    this.url = url;
    this.events = new eventsExports.EventEmitter();
    this.registering = false;
    if (!isWsUrl(url)) {
      throw new Error(`Provided URL is not compatible with WebSocket connection: ${url}`);
    }
    this.url = url;
  }
  get connected() {
    return typeof this.socket !== "undefined";
  }
  get connecting() {
    return this.registering;
  }
  on(event, listener) {
    this.events.on(event, listener);
  }
  once(event, listener) {
    this.events.once(event, listener);
  }
  off(event, listener) {
    this.events.off(event, listener);
  }
  removeListener(event, listener) {
    this.events.removeListener(event, listener);
  }
  async open(url = this.url) {
    await this.register(url);
  }
  async close() {
    return new Promise((resolve, reject) => {
      if (typeof this.socket === "undefined") {
        reject(new Error("Connection already closed"));
        return;
      }
      this.socket.onclose = (event) => {
        this.onClose(event);
        resolve();
      };
      this.socket.close();
    });
  }
  async send(payload, context) {
    if (typeof this.socket === "undefined") {
      this.socket = await this.register();
    }
    try {
      this.socket.send(safeJsonStringify(payload));
    } catch (e) {
      this.onError(payload.id, e);
    }
  }
  register(url = this.url) {
    if (!isWsUrl(url)) {
      throw new Error(`Provided URL is not compatible with WebSocket connection: ${url}`);
    }
    if (this.registering) {
      const currentMaxListeners = this.events.getMaxListeners();
      if (this.events.listenerCount("register_error") >= currentMaxListeners || this.events.listenerCount("open") >= currentMaxListeners) {
        this.events.setMaxListeners(currentMaxListeners + 1);
      }
      return new Promise((resolve, reject) => {
        this.events.once("register_error", (error) => {
          this.resetMaxListeners();
          reject(error);
        });
        this.events.once("open", () => {
          this.resetMaxListeners();
          if (typeof this.socket === "undefined") {
            return reject(new Error("WebSocket connection is missing or invalid"));
          }
          resolve(this.socket);
        });
      });
    }
    this.url = url;
    this.registering = true;
    return new Promise((resolve, reject) => {
      const opts = !cjs.isReactNative() ? { rejectUnauthorized: !isLocalhostUrl(url) } : void 0;
      const socket = new WS(url, [], opts);
      if (hasBuiltInWebSocket()) {
        socket.onerror = (event) => {
          const errorEvent = event;
          reject(this.emitError(errorEvent.error));
        };
      } else {
        socket.on("error", (errorEvent) => {
          reject(this.emitError(errorEvent));
        });
      }
      socket.onopen = () => {
        this.onOpen(socket);
        resolve(socket);
      };
    });
  }
  onOpen(socket) {
    socket.onmessage = (event) => this.onPayload(event);
    socket.onclose = (event) => this.onClose(event);
    this.socket = socket;
    this.registering = false;
    this.events.emit("open");
  }
  onClose(event) {
    this.socket = void 0;
    this.registering = false;
    this.events.emit("close", event);
  }
  onPayload(e) {
    if (typeof e.data === "undefined")
      return;
    const payload = typeof e.data === "string" ? safeJsonParse(e.data) : e.data;
    this.events.emit("payload", payload);
  }
  onError(id, e) {
    const error = this.parseError(e);
    const message = error.message || error.toString();
    const payload = formatJsonRpcError(id, message);
    this.events.emit("payload", payload);
  }
  parseError(e, url = this.url) {
    return parseConnectionError(e, truncateQuery(url), "WS");
  }
  resetMaxListeners() {
    if (this.events.getMaxListeners() > EVENT_EMITTER_MAX_LISTENERS_DEFAULT$1) {
      this.events.setMaxListeners(EVENT_EMITTER_MAX_LISTENERS_DEFAULT$1);
    }
  }
  emitError(errorEvent) {
    const error = this.parseError(new Error((errorEvent === null || errorEvent === void 0 ? void 0 : errorEvent.message) || `WebSocket connection failed for host: ${truncateQuery(this.url)}`));
    this.events.emit("register_error", error);
    return error;
  }
}
var lodash_isequal = { exports: {} };
lodash_isequal.exports;
(function(module, exports) {
  var LARGE_ARRAY_SIZE = 200;
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  var MAX_SAFE_INTEGER = 9007199254740991;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal.process;
  var nodeUtil = function() {
    try {
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  function baseTimes(n2, iteratee) {
    var index = -1, result = Array(n2);
    while (++index < n2) {
      result[index] = iteratee(index);
    }
    return result;
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function setToArray(set2) {
    var index = -1, result = Array(set2.size);
    set2.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
  var coreJsData = root["__core-js_shared__"];
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var nativeObjectToString = objectProto.toString;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  var Buffer2 = moduleExports ? root.Buffer : void 0, Symbol2 = root.Symbol, Uint8Array2 = root.Uint8Array, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
  var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0, nativeKeys = overArg(Object.keys, Object);
  var DataView2 = getNative(root, "DataView"), Map2 = getNative(root, "Map"), Promise2 = getNative(root, "Promise"), Set2 = getNative(root, "Set"), WeakMap = getNative(root, "WeakMap"), nativeCreate = getNative(Object, "create");
  var dataViewCtorString = toSource(DataView2), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap);
  var symbolProto = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : void 0;
  }
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
  }
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map2 || ListCache)(),
      "string": new Hash()
    };
  }
  function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
        return false;
      }
    }
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys2, getSymbols);
  }
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
      value[symToStringTag] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  var getTag = baseGetTag;
  if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
    return value === proto;
  }
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var isArguments = baseIsArguments(function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  var isArray = Array.isArray;
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  var isBuffer = nativeIsBuffer || stubFalse;
  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  function keys2(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  function stubArray() {
    return [];
  }
  function stubFalse() {
    return false;
  }
  module.exports = isEqual;
})(lodash_isequal, lodash_isequal.exports);
var lodash_isequalExports = lodash_isequal.exports;
const ki = /* @__PURE__ */ getDefaultExportFromCjs(lodash_isequalExports);
function Ki(r, e) {
  if (r.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), i = 0; i < t.length; i++)
    t[i] = 255;
  for (var s = 0; s < r.length; s++) {
    var n2 = r.charAt(s), a2 = n2.charCodeAt(0);
    if (t[a2] !== 255)
      throw new TypeError(n2 + " is ambiguous");
    t[a2] = s;
  }
  var o = r.length, h3 = r.charAt(0), u3 = Math.log(o) / Math.log(256), d2 = Math.log(256) / Math.log(o);
  function p3(c2) {
    if (c2 instanceof Uint8Array || (ArrayBuffer.isView(c2) ? c2 = new Uint8Array(c2.buffer, c2.byteOffset, c2.byteLength) : Array.isArray(c2) && (c2 = Uint8Array.from(c2))), !(c2 instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (c2.length === 0)
      return "";
    for (var m2 = 0, z2 = 0, I2 = 0, _3 = c2.length; I2 !== _3 && c2[I2] === 0; )
      I2++, m2++;
    for (var S3 = (_3 - I2) * d2 + 1 >>> 0, b3 = new Uint8Array(S3); I2 !== _3; ) {
      for (var P2 = c2[I2], A2 = 0, C = S3 - 1; (P2 !== 0 || A2 < z2) && C !== -1; C--, A2++)
        P2 += 256 * b3[C] >>> 0, b3[C] = P2 % o >>> 0, P2 = P2 / o >>> 0;
      if (P2 !== 0)
        throw new Error("Non-zero carry");
      z2 = A2, I2++;
    }
    for (var x2 = S3 - z2; x2 !== S3 && b3[x2] === 0; )
      x2++;
    for (var q2 = h3.repeat(m2); x2 < S3; ++x2)
      q2 += r.charAt(b3[x2]);
    return q2;
  }
  function y3(c2) {
    if (typeof c2 != "string")
      throw new TypeError("Expected String");
    if (c2.length === 0)
      return new Uint8Array();
    var m2 = 0;
    if (c2[m2] !== " ") {
      for (var z2 = 0, I2 = 0; c2[m2] === h3; )
        z2++, m2++;
      for (var _3 = (c2.length - m2) * u3 + 1 >>> 0, S3 = new Uint8Array(_3); c2[m2]; ) {
        var b3 = t[c2.charCodeAt(m2)];
        if (b3 === 255)
          return;
        for (var P2 = 0, A2 = _3 - 1; (b3 !== 0 || P2 < I2) && A2 !== -1; A2--, P2++)
          b3 += o * S3[A2] >>> 0, S3[A2] = b3 % 256 >>> 0, b3 = b3 / 256 >>> 0;
        if (b3 !== 0)
          throw new Error("Non-zero carry");
        I2 = P2, m2++;
      }
      if (c2[m2] !== " ") {
        for (var C = _3 - I2; C !== _3 && S3[C] === 0; )
          C++;
        for (var x2 = new Uint8Array(z2 + (_3 - C)), q2 = z2; C !== _3; )
          x2[q2++] = S3[C++];
        return x2;
      }
    }
  }
  function $2(c2) {
    var m2 = y3(c2);
    if (m2)
      return m2;
    throw new Error(`Non-${e} character`);
  }
  return { encode: p3, decodeUnsafe: y3, decode: $2 };
}
var Bi = Ki, Vi = Bi;
const ze = (r) => {
  if (r instanceof Uint8Array && r.constructor.name === "Uint8Array")
    return r;
  if (r instanceof ArrayBuffer)
    return new Uint8Array(r);
  if (ArrayBuffer.isView(r))
    return new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
  throw new Error("Unknown type, must be binary type");
}, qi = (r) => new TextEncoder().encode(r), ji = (r) => new TextDecoder().decode(r);
class Yi {
  constructor(e, t, i) {
    this.name = e, this.prefix = t, this.baseEncode = i;
  }
  encode(e) {
    if (e instanceof Uint8Array)
      return `${this.prefix}${this.baseEncode(e)}`;
    throw Error("Unknown type, must be binary type");
  }
}
class Gi {
  constructor(e, t, i) {
    if (this.name = e, this.prefix = t, t.codePointAt(0) === void 0)
      throw new Error("Invalid prefix character");
    this.prefixCodePoint = t.codePointAt(0), this.baseDecode = i;
  }
  decode(e) {
    if (typeof e == "string") {
      if (e.codePointAt(0) !== this.prefixCodePoint)
        throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      return this.baseDecode(e.slice(this.prefix.length));
    } else
      throw Error("Can only multibase decode strings");
  }
  or(e) {
    return Ne(this, e);
  }
}
class Hi {
  constructor(e) {
    this.decoders = e;
  }
  or(e) {
    return Ne(this, e);
  }
  decode(e) {
    const t = e[0], i = this.decoders[t];
    if (i)
      return i.decode(e);
    throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
  }
}
const Ne = (r, e) => new Hi({ ...r.decoders || { [r.prefix]: r }, ...e.decoders || { [e.prefix]: e } });
class Ji {
  constructor(e, t, i, s) {
    this.name = e, this.prefix = t, this.baseEncode = i, this.baseDecode = s, this.encoder = new Yi(e, t, i), this.decoder = new Gi(e, t, s);
  }
  encode(e) {
    return this.encoder.encode(e);
  }
  decode(e) {
    return this.decoder.decode(e);
  }
}
const W$1 = ({ name: r, prefix: e, encode: t, decode: i }) => new Ji(r, e, t, i), K2 = ({ prefix: r, name: e, alphabet: t }) => {
  const { encode: i, decode: s } = Vi(t, e);
  return W$1({ prefix: r, name: e, encode: i, decode: (n2) => ze(s(n2)) });
}, Wi$1 = (r, e, t, i) => {
  const s = {};
  for (let d2 = 0; d2 < e.length; ++d2)
    s[e[d2]] = d2;
  let n2 = r.length;
  for (; r[n2 - 1] === "="; )
    --n2;
  const a2 = new Uint8Array(n2 * t / 8 | 0);
  let o = 0, h3 = 0, u3 = 0;
  for (let d2 = 0; d2 < n2; ++d2) {
    const p3 = s[r[d2]];
    if (p3 === void 0)
      throw new SyntaxError(`Non-${i} character`);
    h3 = h3 << t | p3, o += t, o >= 8 && (o -= 8, a2[u3++] = 255 & h3 >> o);
  }
  if (o >= t || 255 & h3 << 8 - o)
    throw new SyntaxError("Unexpected end of data");
  return a2;
}, Xi = (r, e, t) => {
  const i = e[e.length - 1] === "=", s = (1 << t) - 1;
  let n2 = "", a2 = 0, o = 0;
  for (let h3 = 0; h3 < r.length; ++h3)
    for (o = o << 8 | r[h3], a2 += 8; a2 > t; )
      a2 -= t, n2 += e[s & o >> a2];
  if (a2 && (n2 += e[s & o << t - a2]), i)
    for (; n2.length * t & 7; )
      n2 += "=";
  return n2;
}, g$2 = ({ name: r, prefix: e, bitsPerChar: t, alphabet: i }) => W$1({ prefix: e, name: r, encode(s) {
  return Xi(s, i, t);
}, decode(s) {
  return Wi$1(s, i, t, r);
} }), Qi = W$1({ prefix: "\0", name: "identity", encode: (r) => ji(r), decode: (r) => qi(r) });
var Zi = Object.freeze({ __proto__: null, identity: Qi });
const es = g$2({ prefix: "0", name: "base2", alphabet: "01", bitsPerChar: 1 });
var ts = Object.freeze({ __proto__: null, base2: es });
const is = g$2({ prefix: "7", name: "base8", alphabet: "01234567", bitsPerChar: 3 });
var ss = Object.freeze({ __proto__: null, base8: is });
const rs = K2({ prefix: "9", name: "base10", alphabet: "0123456789" });
var ns$1 = Object.freeze({ __proto__: null, base10: rs });
const as$1 = g$2({ prefix: "f", name: "base16", alphabet: "0123456789abcdef", bitsPerChar: 4 }), os$1 = g$2({ prefix: "F", name: "base16upper", alphabet: "0123456789ABCDEF", bitsPerChar: 4 });
var hs$1 = Object.freeze({ __proto__: null, base16: as$1, base16upper: os$1 });
const cs$1 = g$2({ prefix: "b", name: "base32", alphabet: "abcdefghijklmnopqrstuvwxyz234567", bitsPerChar: 5 }), us$1 = g$2({ prefix: "B", name: "base32upper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", bitsPerChar: 5 }), ls$1 = g$2({ prefix: "c", name: "base32pad", alphabet: "abcdefghijklmnopqrstuvwxyz234567=", bitsPerChar: 5 }), ds$1 = g$2({ prefix: "C", name: "base32padupper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=", bitsPerChar: 5 }), gs = g$2({ prefix: "v", name: "base32hex", alphabet: "0123456789abcdefghijklmnopqrstuv", bitsPerChar: 5 }), ps$1 = g$2({ prefix: "V", name: "base32hexupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV", bitsPerChar: 5 }), Ds = g$2({ prefix: "t", name: "base32hexpad", alphabet: "0123456789abcdefghijklmnopqrstuv=", bitsPerChar: 5 }), ys = g$2({ prefix: "T", name: "base32hexpadupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=", bitsPerChar: 5 }), ms = g$2({ prefix: "h", name: "base32z", alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769", bitsPerChar: 5 });
var bs = Object.freeze({ __proto__: null, base32: cs$1, base32upper: us$1, base32pad: ls$1, base32padupper: ds$1, base32hex: gs, base32hexupper: ps$1, base32hexpad: Ds, base32hexpadupper: ys, base32z: ms });
const fs = K2({ prefix: "k", name: "base36", alphabet: "0123456789abcdefghijklmnopqrstuvwxyz" }), Es = K2({ prefix: "K", name: "base36upper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
var ws = Object.freeze({ __proto__: null, base36: fs, base36upper: Es });
const vs = K2({ name: "base58btc", prefix: "z", alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" }), Is = K2({ name: "base58flickr", prefix: "Z", alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ" });
var Cs = Object.freeze({ __proto__: null, base58btc: vs, base58flickr: Is });
const Rs = g$2({ prefix: "m", name: "base64", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", bitsPerChar: 6 }), _s = g$2({ prefix: "M", name: "base64pad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", bitsPerChar: 6 }), Ss = g$2({ prefix: "u", name: "base64url", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", bitsPerChar: 6 }), Ps = g$2({ prefix: "U", name: "base64urlpad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=", bitsPerChar: 6 });
var Ts = Object.freeze({ __proto__: null, base64: Rs, base64pad: _s, base64url: Ss, base64urlpad: Ps });
const Le = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), xs = Le.reduce((r, e, t) => (r[t] = e, r), []), Os = Le.reduce((r, e, t) => (r[e.codePointAt(0)] = t, r), []);
function As(r) {
  return r.reduce((e, t) => (e += xs[t], e), "");
}
function zs(r) {
  const e = [];
  for (const t of r) {
    const i = Os[t.codePointAt(0)];
    if (i === void 0)
      throw new Error(`Non-base256emoji character: ${t}`);
    e.push(i);
  }
  return new Uint8Array(e);
}
const Ns = W$1({ prefix: "🚀", name: "base256emoji", encode: As, decode: zs });
var Ls = Object.freeze({ __proto__: null, base256emoji: Ns }), Us = Fe, Ue = 128, Fs = 127, $s = ~Fs, Ms = Math.pow(2, 31);
function Fe(r, e, t) {
  e = e || [], t = t || 0;
  for (var i = t; r >= Ms; )
    e[t++] = r & 255 | Ue, r /= 128;
  for (; r & $s; )
    e[t++] = r & 255 | Ue, r >>>= 7;
  return e[t] = r | 0, Fe.bytes = t - i + 1, e;
}
var ks = oe$1, Ks = 128, $e = 127;
function oe$1(r, i) {
  var t = 0, i = i || 0, s = 0, n2 = i, a2, o = r.length;
  do {
    if (n2 >= o)
      throw oe$1.bytes = 0, new RangeError("Could not decode varint");
    a2 = r[n2++], t += s < 28 ? (a2 & $e) << s : (a2 & $e) * Math.pow(2, s), s += 7;
  } while (a2 >= Ks);
  return oe$1.bytes = n2 - i, t;
}
var Bs = Math.pow(2, 7), Vs = Math.pow(2, 14), qs = Math.pow(2, 21), js = Math.pow(2, 28), Ys = Math.pow(2, 35), Gs = Math.pow(2, 42), Hs = Math.pow(2, 49), Js = Math.pow(2, 56), Ws = Math.pow(2, 63), Xs = function(r) {
  return r < Bs ? 1 : r < Vs ? 2 : r < qs ? 3 : r < js ? 4 : r < Ys ? 5 : r < Gs ? 6 : r < Hs ? 7 : r < Js ? 8 : r < Ws ? 9 : 10;
}, Qs = { encode: Us, decode: ks, encodingLength: Xs }, Me = Qs;
const ke = (r, e, t = 0) => (Me.encode(r, e, t), e), Ke = (r) => Me.encodingLength(r), he$1 = (r, e) => {
  const t = e.byteLength, i = Ke(r), s = i + Ke(t), n2 = new Uint8Array(s + t);
  return ke(r, n2, 0), ke(t, n2, i), n2.set(e, s), new Zs(r, t, e, n2);
};
class Zs {
  constructor(e, t, i, s) {
    this.code = e, this.size = t, this.digest = i, this.bytes = s;
  }
}
const Be = ({ name: r, code: e, encode: t }) => new er(r, e, t);
class er {
  constructor(e, t, i) {
    this.name = e, this.code = t, this.encode = i;
  }
  digest(e) {
    if (e instanceof Uint8Array) {
      const t = this.encode(e);
      return t instanceof Uint8Array ? he$1(this.code, t) : t.then((i) => he$1(this.code, i));
    } else
      throw Error("Unknown type, must be binary type");
  }
}
const Ve = (r) => async (e) => new Uint8Array(await crypto.subtle.digest(r, e)), tr = Be({ name: "sha2-256", code: 18, encode: Ve("SHA-256") }), ir = Be({ name: "sha2-512", code: 19, encode: Ve("SHA-512") });
var sr = Object.freeze({ __proto__: null, sha256: tr, sha512: ir });
const qe = 0, rr = "identity", je = ze, nr = (r) => he$1(qe, je(r)), ar = { code: qe, name: rr, encode: je, digest: nr };
var or = Object.freeze({ __proto__: null, identity: ar });
new TextEncoder(), new TextDecoder();
const Ye = { ...Zi, ...ts, ...ss, ...ns$1, ...hs$1, ...bs, ...ws, ...Cs, ...Ts, ...Ls };
({ ...sr, ...or });
function Ge(r) {
  return globalThis.Buffer != null ? new Uint8Array(r.buffer, r.byteOffset, r.byteLength) : r;
}
function hr$1(r = 0) {
  return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? Ge(globalThis.Buffer.allocUnsafe(r)) : new Uint8Array(r);
}
function He(r, e, t, i) {
  return { name: r, prefix: e, encoder: { name: r, prefix: e, encode: t }, decoder: { decode: i } };
}
const Je = He("utf8", "u", (r) => "u" + new TextDecoder("utf8").decode(r), (r) => new TextEncoder().encode(r.substring(1))), ce$1 = He("ascii", "a", (r) => {
  let e = "a";
  for (let t = 0; t < r.length; t++)
    e += String.fromCharCode(r[t]);
  return e;
}, (r) => {
  r = r.substring(1);
  const e = hr$1(r.length);
  for (let t = 0; t < r.length; t++)
    e[t] = r.charCodeAt(t);
  return e;
}), cr$1 = { utf8: Je, "utf-8": Je, hex: Ye.base16, latin1: ce$1, ascii: ce$1, binary: ce$1, ...Ye };
function ur(r, e = "utf8") {
  const t = cr$1[e];
  if (!t)
    throw new Error(`Unsupported encoding "${e}"`);
  return (e === "utf8" || e === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? Ge(globalThis.Buffer.from(r, "utf-8")) : t.decoder.decode(`${t.prefix}${r}`);
}
const ue = "wc", We = 2, X$1 = "core", O$1 = `${ue}@2:${X$1}:`, Xe = { name: X$1, logger: "error" }, Qe = { database: ":memory:" }, Ze = "crypto", le$1 = "client_ed25519_seed", et = cjs$3.ONE_DAY, tt = "keychain", it = "0.3", st = "messages", rt = "0.3", nt = cjs$3.SIX_HOURS, at = "publisher", ot = "irn", ht = "error", de$1 = "wss://relay.walletconnect.com", ge$1 = "wss://relay.walletconnect.org", ct = "relayer", D$1 = { message: "relayer_message", message_ack: "relayer_message_ack", connect: "relayer_connect", disconnect: "relayer_disconnect", error: "relayer_error", connection_stalled: "relayer_connection_stalled", transport_closed: "relayer_transport_closed", publish: "relayer_publish" }, ut = "_subscription", T = { payload: "payload", connect: "connect", disconnect: "disconnect", error: "error" }, lt = cjs$3.ONE_SECOND, dt = "2.10.2", gt = 1e4, pt = "0.3", Dt = "WALLETCONNECT_CLIENT_ID", w = { created: "subscription_created", deleted: "subscription_deleted", expired: "subscription_expired", disabled: "subscription_disabled", sync: "subscription_sync", resubscribed: "subscription_resubscribed" }, yt = "subscription", mt = "0.3", bt = cjs$3.FIVE_SECONDS * 1e3, ft$1 = "pairing", Et = "0.3", F$1 = { wc_pairingDelete: { req: { ttl: cjs$3.ONE_DAY, prompt: false, tag: 1e3 }, res: { ttl: cjs$3.ONE_DAY, prompt: false, tag: 1001 } }, wc_pairingPing: { req: { ttl: cjs$3.THIRTY_SECONDS, prompt: false, tag: 1002 }, res: { ttl: cjs$3.THIRTY_SECONDS, prompt: false, tag: 1003 } }, unregistered_method: { req: { ttl: cjs$3.ONE_DAY, prompt: false, tag: 0 }, res: { ttl: cjs$3.ONE_DAY, prompt: false, tag: 0 } } }, B = { create: "pairing_create", expire: "pairing_expire", delete: "pairing_delete", ping: "pairing_ping" }, R = { created: "history_created", updated: "history_updated", deleted: "history_deleted", sync: "history_sync" }, wt = "history", vt = "0.3", It = "expirer", v$1 = { created: "expirer_created", deleted: "expirer_deleted", expired: "expirer_expired", sync: "expirer_sync" }, Ct$1 = "0.3", Q$2 = "verify-api", Z = "https://verify.walletconnect.com", pe$1 = "https://verify.walletconnect.org";
class Rt {
  constructor(e, t) {
    this.core = e, this.logger = t, this.keychain = /* @__PURE__ */ new Map(), this.name = tt, this.version = it, this.initialized = false, this.storagePrefix = O$1, this.init = async () => {
      if (!this.initialized) {
        const i = await this.getKeyChain();
        typeof i < "u" && (this.keychain = i), this.initialized = true;
      }
    }, this.has = (i) => (this.isInitialized(), this.keychain.has(i)), this.set = async (i, s) => {
      this.isInitialized(), this.keychain.set(i, s), await this.persist();
    }, this.get = (i) => {
      this.isInitialized();
      const s = this.keychain.get(i);
      if (typeof s > "u") {
        const { message: n2 } = N$2("NO_MATCHING_KEY", `${this.name}: ${i}`);
        throw new Error(n2);
      }
      return s;
    }, this.del = async (i) => {
      this.isInitialized(), this.keychain.delete(i), await this.persist();
    }, this.core = e, this.logger = cjs$1.generateChildLogger(t, this.name);
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  async setKeyChain(e) {
    await this.core.storage.setItem(this.storageKey, et$1(e));
  }
  async getKeyChain() {
    const e = await this.core.storage.getItem(this.storageKey);
    return typeof e < "u" ? nt$1(e) : void 0;
  }
  async persist() {
    await this.setKeyChain(this.keychain);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = N$2("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
class _t {
  constructor(e, t, i) {
    this.core = e, this.logger = t, this.name = Ze, this.initialized = false, this.init = async () => {
      this.initialized || (await this.keychain.init(), this.initialized = true);
    }, this.hasKeys = (s) => (this.isInitialized(), this.keychain.has(s)), this.getClientId = async () => {
      this.isInitialized();
      const s = await this.getClientSeed(), n2 = generateKeyPair(s);
      return encodeIss(n2.publicKey);
    }, this.generateKeyPair = () => {
      this.isInitialized();
      const s = jn();
      return this.setPrivateKey(s.publicKey, s.privateKey);
    }, this.signJWT = async (s) => {
      this.isInitialized();
      const n2 = await this.getClientSeed(), a2 = generateKeyPair(n2), o = Dn(), h3 = et;
      return await signJWT(o, s, h3, a2);
    }, this.generateSharedKey = (s, n2, a2) => {
      this.isInitialized();
      const o = this.getPrivateKey(s), h3 = kn(o, n2);
      return this.setSymKey(h3, a2);
    }, this.setSymKey = async (s, n2) => {
      this.isInitialized();
      const a2 = n2 || Vn$1(s);
      return await this.keychain.set(a2, s), a2;
    }, this.deleteKeyPair = async (s) => {
      this.isInitialized(), await this.keychain.del(s);
    }, this.deleteSymKey = async (s) => {
      this.isInitialized(), await this.keychain.del(s);
    }, this.encode = async (s, n2, a2) => {
      this.isInitialized();
      const o = Re(a2), h3 = safeJsonStringify(n2);
      if (Fn(o)) {
        const y3 = o.senderPublicKey, $2 = o.receiverPublicKey;
        s = await this.generateSharedKey(y3, $2);
      }
      const u3 = this.getSymKey(s), { type: d2, senderPublicKey: p3 } = o;
      return Kn({ type: d2, symKey: u3, message: h3, senderPublicKey: p3 });
    }, this.decode = async (s, n2, a2) => {
      this.isInitialized();
      const o = xn(n2, a2);
      if (Fn(o)) {
        const h3 = o.receiverPublicKey, u3 = o.senderPublicKey;
        s = await this.generateSharedKey(h3, u3);
      }
      try {
        const h3 = this.getSymKey(s), u3 = Ln({ symKey: h3, encoded: n2 });
        return safeJsonParse(u3);
      } catch (h3) {
        this.logger.error(`Failed to decode message from topic: '${s}', clientId: '${await this.getClientId()}'`), this.logger.error(h3);
      }
    }, this.getPayloadType = (s) => {
      const n2 = ee$1(s);
      return $$1(n2.type);
    }, this.getPayloadSenderPublicKey = (s) => {
      const n2 = ee$1(s);
      return n2.senderPublicKey ? toString(n2.senderPublicKey, p$2) : void 0;
    }, this.core = e, this.logger = cjs$1.generateChildLogger(t, this.name), this.keychain = i || new Rt(this.core, this.logger);
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  async setPrivateKey(e, t) {
    return await this.keychain.set(e, t), e;
  }
  getPrivateKey(e) {
    return this.keychain.get(e);
  }
  async getClientSeed() {
    let e = "";
    try {
      e = this.keychain.get(le$1);
    } catch {
      e = Dn(), await this.keychain.set(le$1, e);
    }
    return ur(e, "base16");
  }
  getSymKey(e) {
    return this.keychain.get(e);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = N$2("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
class St extends a {
  constructor(e, t) {
    super(e, t), this.logger = e, this.core = t, this.messages = /* @__PURE__ */ new Map(), this.name = st, this.version = rt, this.initialized = false, this.storagePrefix = O$1, this.init = async () => {
      if (!this.initialized) {
        this.logger.trace("Initialized");
        try {
          const i = await this.getRelayerMessages();
          typeof i < "u" && (this.messages = i), this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({ type: "method", method: "restore", size: this.messages.size });
        } catch (i) {
          this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(i);
        } finally {
          this.initialized = true;
        }
      }
    }, this.set = async (i, s) => {
      this.isInitialized();
      const n2 = Mn(s);
      let a2 = this.messages.get(i);
      return typeof a2 > "u" && (a2 = {}), typeof a2[n2] < "u" || (a2[n2] = s, this.messages.set(i, a2), await this.persist()), n2;
    }, this.get = (i) => {
      this.isInitialized();
      let s = this.messages.get(i);
      return typeof s > "u" && (s = {}), s;
    }, this.has = (i, s) => {
      this.isInitialized();
      const n2 = this.get(i), a2 = Mn(s);
      return typeof n2[a2] < "u";
    }, this.del = async (i) => {
      this.isInitialized(), this.messages.delete(i), await this.persist();
    }, this.logger = cjs$1.generateChildLogger(e, this.name), this.core = t;
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  async setRelayerMessages(e) {
    await this.core.storage.setItem(this.storageKey, et$1(e));
  }
  async getRelayerMessages() {
    const e = await this.core.storage.getItem(this.storageKey);
    return typeof e < "u" ? nt$1(e) : void 0;
  }
  async persist() {
    await this.setRelayerMessages(this.messages);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = N$2("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
class Dr extends u$1 {
  constructor(e, t) {
    super(e, t), this.relayer = e, this.logger = t, this.events = new eventsExports.EventEmitter(), this.name = at, this.queue = /* @__PURE__ */ new Map(), this.publishTimeout = cjs$3.toMiliseconds(cjs$3.TEN_SECONDS), this.needsTransportRestart = false, this.publish = async (i, s, n2) => {
      var a2;
      this.logger.debug("Publishing Payload"), this.logger.trace({ type: "method", method: "publish", params: { topic: i, message: s, opts: n2 } });
      try {
        const o = (n2 == null ? void 0 : n2.ttl) || nt, h3 = mt$1(n2), u3 = (n2 == null ? void 0 : n2.prompt) || false, d2 = (n2 == null ? void 0 : n2.tag) || 0, p3 = (n2 == null ? void 0 : n2.id) || getBigIntRpcId().toString(), y3 = { topic: i, message: s, opts: { ttl: o, relay: h3, prompt: u3, tag: d2, id: p3 } }, $2 = setTimeout(() => this.queue.set(p3, y3), this.publishTimeout);
        try {
          await await it$1(this.rpcPublish(i, s, o, h3, u3, d2, p3), this.publishTimeout, "Failed to publish payload, please try again."), this.removeRequestFromQueue(p3), this.relayer.events.emit(D$1.publish, y3);
        } catch (c2) {
          if (this.logger.debug("Publishing Payload stalled"), this.needsTransportRestart = true, (a2 = n2 == null ? void 0 : n2.internal) != null && a2.throwOnFailedPublish)
            throw this.removeRequestFromQueue(p3), c2;
          return;
        } finally {
          clearTimeout($2);
        }
        this.logger.debug("Successfully Published Payload"), this.logger.trace({ type: "method", method: "publish", params: { topic: i, message: s, opts: n2 } });
      } catch (o) {
        throw this.logger.debug("Failed to Publish Payload"), this.logger.error(o), o;
      }
    }, this.on = (i, s) => {
      this.events.on(i, s);
    }, this.once = (i, s) => {
      this.events.once(i, s);
    }, this.off = (i, s) => {
      this.events.off(i, s);
    }, this.removeListener = (i, s) => {
      this.events.removeListener(i, s);
    }, this.relayer = e, this.logger = cjs$1.generateChildLogger(t, this.name), this.registerEventListeners();
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  rpcPublish(e, t, i, s, n2, a2, o) {
    var h3, u3, d2, p3;
    const y3 = { method: yt$1(s.protocol).publish, params: { topic: e, message: t, ttl: i, prompt: n2, tag: a2 }, id: o };
    return w$1((h3 = y3.params) == null ? void 0 : h3.prompt) && ((u3 = y3.params) == null || delete u3.prompt), w$1((d2 = y3.params) == null ? void 0 : d2.tag) && ((p3 = y3.params) == null || delete p3.tag), this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "message", direction: "outgoing", request: y3 }), this.relayer.request(y3);
  }
  removeRequestFromQueue(e) {
    this.queue.delete(e);
  }
  checkQueue() {
    this.queue.forEach(async (e) => {
      const { topic: t, message: i, opts: s } = e;
      await this.publish(t, i, s);
    });
  }
  registerEventListeners() {
    this.relayer.core.heartbeat.on(cjs$2.HEARTBEAT_EVENTS.pulse, () => {
      if (this.needsTransportRestart) {
        this.needsTransportRestart = false, this.relayer.events.emit(D$1.connection_stalled);
        return;
      }
      this.checkQueue();
    }), this.relayer.on(D$1.message_ack, (e) => {
      this.removeRequestFromQueue(e.id.toString());
    });
  }
}
class yr {
  constructor() {
    this.map = /* @__PURE__ */ new Map(), this.set = (e, t) => {
      const i = this.get(e);
      this.exists(e, t) || this.map.set(e, [...i, t]);
    }, this.get = (e) => this.map.get(e) || [], this.exists = (e, t) => this.get(e).includes(t), this.delete = (e, t) => {
      if (typeof t > "u") {
        this.map.delete(e);
        return;
      }
      if (!this.map.has(e))
        return;
      const i = this.get(e);
      if (!this.exists(e, t))
        return;
      const s = i.filter((n2) => n2 !== t);
      if (!s.length) {
        this.map.delete(e);
        return;
      }
      this.map.set(e, s);
    }, this.clear = () => {
      this.map.clear();
    };
  }
  get topics() {
    return Array.from(this.map.keys());
  }
}
var mr = Object.defineProperty, br = Object.defineProperties, fr = Object.getOwnPropertyDescriptors, Pt = Object.getOwnPropertySymbols, Er = Object.prototype.hasOwnProperty, wr = Object.prototype.propertyIsEnumerable, Tt = (r, e, t) => e in r ? mr(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t, V$1 = (r, e) => {
  for (var t in e || (e = {}))
    Er.call(e, t) && Tt(r, t, e[t]);
  if (Pt)
    for (var t of Pt(e))
      wr.call(e, t) && Tt(r, t, e[t]);
  return r;
}, De = (r, e) => br(r, fr(e));
class xt extends d {
  constructor(e, t) {
    super(e, t), this.relayer = e, this.logger = t, this.subscriptions = /* @__PURE__ */ new Map(), this.topicMap = new yr(), this.events = new eventsExports.EventEmitter(), this.name = yt, this.version = mt, this.pending = /* @__PURE__ */ new Map(), this.cached = [], this.initialized = false, this.pendingSubscriptionWatchLabel = "pending_sub_watch_label", this.pollingInterval = 20, this.storagePrefix = O$1, this.subscribeTimeout = 1e4, this.restartInProgress = false, this.batchSubscribeTopicsLimit = 500, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), this.registerEventListeners(), this.clientId = await this.relayer.core.crypto.getClientId());
    }, this.subscribe = async (i, s) => {
      await this.restartToComplete(), this.isInitialized(), this.logger.debug("Subscribing Topic"), this.logger.trace({ type: "method", method: "subscribe", params: { topic: i, opts: s } });
      try {
        const n2 = mt$1(s), a2 = { topic: i, relay: n2 };
        this.pending.set(i, a2);
        const o = await this.rpcSubscribe(i, n2);
        return this.onSubscribe(o, a2), this.logger.debug("Successfully Subscribed Topic"), this.logger.trace({ type: "method", method: "subscribe", params: { topic: i, opts: s } }), o;
      } catch (n2) {
        throw this.logger.debug("Failed to Subscribe Topic"), this.logger.error(n2), n2;
      }
    }, this.unsubscribe = async (i, s) => {
      await this.restartToComplete(), this.isInitialized(), typeof (s == null ? void 0 : s.id) < "u" ? await this.unsubscribeById(i, s.id, s) : await this.unsubscribeByTopic(i, s);
    }, this.isSubscribed = async (i) => this.topics.includes(i) ? true : await new Promise((s, n2) => {
      const a2 = new cjs$3.Watch();
      a2.start(this.pendingSubscriptionWatchLabel);
      const o = setInterval(() => {
        !this.pending.has(i) && this.topics.includes(i) && (clearInterval(o), a2.stop(this.pendingSubscriptionWatchLabel), s(true)), a2.elapsed(this.pendingSubscriptionWatchLabel) >= bt && (clearInterval(o), a2.stop(this.pendingSubscriptionWatchLabel), n2(new Error("Subscription resolution timeout")));
      }, this.pollingInterval);
    }).catch(() => false), this.on = (i, s) => {
      this.events.on(i, s);
    }, this.once = (i, s) => {
      this.events.once(i, s);
    }, this.off = (i, s) => {
      this.events.off(i, s);
    }, this.removeListener = (i, s) => {
      this.events.removeListener(i, s);
    }, this.restart = async () => {
      this.restartInProgress = true, await this.restore(), await this.reset(), this.restartInProgress = false;
    }, this.relayer = e, this.logger = cjs$1.generateChildLogger(t, this.name), this.clientId = "";
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.relayer.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.subscriptions.size;
  }
  get ids() {
    return Array.from(this.subscriptions.keys());
  }
  get values() {
    return Array.from(this.subscriptions.values());
  }
  get topics() {
    return this.topicMap.topics;
  }
  hasSubscription(e, t) {
    let i = false;
    try {
      i = this.getSubscription(e).topic === t;
    } catch {
    }
    return i;
  }
  onEnable() {
    this.cached = [], this.initialized = true;
  }
  onDisable() {
    this.cached = this.values, this.subscriptions.clear(), this.topicMap.clear();
  }
  async unsubscribeByTopic(e, t) {
    const i = this.topicMap.get(e);
    await Promise.all(i.map(async (s) => await this.unsubscribeById(e, s, t)));
  }
  async unsubscribeById(e, t, i) {
    this.logger.debug("Unsubscribing Topic"), this.logger.trace({ type: "method", method: "unsubscribe", params: { topic: e, id: t, opts: i } });
    try {
      const s = mt$1(i);
      await this.rpcUnsubscribe(e, t, s);
      const n2 = U$2("USER_DISCONNECTED", `${this.name}, ${e}`);
      await this.onUnsubscribe(e, t, n2), this.logger.debug("Successfully Unsubscribed Topic"), this.logger.trace({ type: "method", method: "unsubscribe", params: { topic: e, id: t, opts: i } });
    } catch (s) {
      throw this.logger.debug("Failed to Unsubscribe Topic"), this.logger.error(s), s;
    }
  }
  async rpcSubscribe(e, t) {
    const i = { method: yt$1(t.protocol).subscribe, params: { topic: e } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: i });
    try {
      await await it$1(this.relayer.request(i), this.subscribeTimeout);
    } catch {
      this.logger.debug("Outgoing Relay Subscribe Payload stalled"), this.relayer.events.emit(D$1.connection_stalled);
    }
    return Mn(e + this.clientId);
  }
  async rpcBatchSubscribe(e) {
    if (!e.length)
      return;
    const t = e[0].relay, i = { method: yt$1(t.protocol).batchSubscribe, params: { topics: e.map((s) => s.topic) } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: i });
    try {
      return await await it$1(this.relayer.request(i), this.subscribeTimeout);
    } catch {
      this.logger.debug("Outgoing Relay Payload stalled"), this.relayer.events.emit(D$1.connection_stalled);
    }
  }
  rpcUnsubscribe(e, t, i) {
    const s = { method: yt$1(i.protocol).unsubscribe, params: { topic: e, id: t } };
    return this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: s }), this.relayer.request(s);
  }
  onSubscribe(e, t) {
    this.setSubscription(e, De(V$1({}, t), { id: e })), this.pending.delete(t.topic);
  }
  onBatchSubscribe(e) {
    e.length && e.forEach((t) => {
      this.setSubscription(t.id, V$1({}, t)), this.pending.delete(t.topic);
    });
  }
  async onUnsubscribe(e, t, i) {
    this.events.removeAllListeners(t), this.hasSubscription(t, e) && this.deleteSubscription(t, i), await this.relayer.messages.del(e);
  }
  async setRelayerSubscriptions(e) {
    await this.relayer.core.storage.setItem(this.storageKey, e);
  }
  async getRelayerSubscriptions() {
    return await this.relayer.core.storage.getItem(this.storageKey);
  }
  setSubscription(e, t) {
    this.subscriptions.has(e) || (this.logger.debug("Setting subscription"), this.logger.trace({ type: "method", method: "setSubscription", id: e, subscription: t }), this.addSubscription(e, t));
  }
  addSubscription(e, t) {
    this.subscriptions.set(e, V$1({}, t)), this.topicMap.set(t.topic, e), this.events.emit(w.created, t);
  }
  getSubscription(e) {
    this.logger.debug("Getting subscription"), this.logger.trace({ type: "method", method: "getSubscription", id: e });
    const t = this.subscriptions.get(e);
    if (!t) {
      const { message: i } = N$2("NO_MATCHING_KEY", `${this.name}: ${e}`);
      throw new Error(i);
    }
    return t;
  }
  deleteSubscription(e, t) {
    this.logger.debug("Deleting subscription"), this.logger.trace({ type: "method", method: "deleteSubscription", id: e, reason: t });
    const i = this.getSubscription(e);
    this.subscriptions.delete(e), this.topicMap.delete(i.topic, e), this.events.emit(w.deleted, De(V$1({}, i), { reason: t }));
  }
  async persist() {
    await this.setRelayerSubscriptions(this.values), this.events.emit(w.sync);
  }
  async reset() {
    if (this.cached.length) {
      const e = Math.ceil(this.cached.length / this.batchSubscribeTopicsLimit);
      for (let t = 0; t < e; t++) {
        const i = this.cached.splice(0, this.batchSubscribeTopicsLimit);
        await this.batchSubscribe(i);
      }
    }
    this.events.emit(w.resubscribed);
  }
  async restore() {
    try {
      const e = await this.getRelayerSubscriptions();
      if (typeof e > "u" || !e.length)
        return;
      if (this.subscriptions.size) {
        const { message: t } = N$2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`), new Error(t);
      }
      this.cached = e, this.logger.debug(`Successfully Restored subscriptions for ${this.name}`), this.logger.trace({ type: "method", method: "restore", subscriptions: this.values });
    } catch (e) {
      this.logger.debug(`Failed to Restore subscriptions for ${this.name}`), this.logger.error(e);
    }
  }
  async batchSubscribe(e) {
    if (!e.length)
      return;
    const t = await this.rpcBatchSubscribe(e);
    D$3(t) && this.onBatchSubscribe(t.map((i, s) => De(V$1({}, e[s]), { id: i })));
  }
  async onConnect() {
    this.restartInProgress || (await this.restart(), this.onEnable());
  }
  onDisconnect() {
    this.onDisable();
  }
  async checkPending() {
    if (!this.initialized || this.relayer.transportExplicitlyClosed)
      return;
    const e = [];
    this.pending.forEach((t) => {
      e.push(t);
    }), await this.batchSubscribe(e);
  }
  registerEventListeners() {
    this.relayer.core.heartbeat.on(cjs$2.HEARTBEAT_EVENTS.pulse, async () => {
      await this.checkPending();
    }), this.relayer.on(D$1.connect, async () => {
      await this.onConnect();
    }), this.relayer.on(D$1.disconnect, () => {
      this.onDisconnect();
    }), this.events.on(w.created, async (e) => {
      const t = w.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e }), await this.persist();
    }), this.events.on(w.deleted, async (e) => {
      const t = w.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e }), await this.persist();
    });
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = N$2("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
  async restartToComplete() {
    this.restartInProgress && await new Promise((e) => {
      const t = setInterval(() => {
        this.restartInProgress || (clearInterval(t), e());
      }, this.pollingInterval);
    });
  }
}
var vr = Object.defineProperty, Ot = Object.getOwnPropertySymbols, Ir = Object.prototype.hasOwnProperty, Cr = Object.prototype.propertyIsEnumerable, At = (r, e, t) => e in r ? vr(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t, Rr = (r, e) => {
  for (var t in e || (e = {}))
    Ir.call(e, t) && At(r, t, e[t]);
  if (Ot)
    for (var t of Ot(e))
      Cr.call(e, t) && At(r, t, e[t]);
  return r;
};
class zt extends g$3 {
  constructor(e) {
    super(e), this.protocol = "wc", this.version = 2, this.events = new eventsExports.EventEmitter(), this.name = ct, this.transportExplicitlyClosed = false, this.initialized = false, this.connectionAttemptInProgress = false, this.connectionStatusPollingInterval = 20, this.staleConnectionErrors = ["socket hang up", "socket stalled"], this.hasExperiencedNetworkDisruption = false, this.request = async (t) => {
      this.logger.debug("Publishing Request Payload");
      try {
        return await this.toEstablishConnection(), await this.provider.request(t);
      } catch (i) {
        throw this.logger.debug("Failed to Publish Request"), this.logger.error(i), i;
      }
    }, this.onPayloadHandler = (t) => {
      this.onProviderPayload(t);
    }, this.onConnectHandler = () => {
      this.events.emit(D$1.connect);
    }, this.onDisconnectHandler = () => {
      this.onProviderDisconnect();
    }, this.onProviderErrorHandler = (t) => {
      this.logger.error(t), this.events.emit(D$1.error, t), this.logger.info("Fatal socket error received, closing transport"), this.transportClose();
    }, this.registerProviderListeners = () => {
      this.provider.on(T.payload, this.onPayloadHandler), this.provider.on(T.connect, this.onConnectHandler), this.provider.on(T.disconnect, this.onDisconnectHandler), this.provider.on(T.error, this.onProviderErrorHandler);
    }, this.core = e.core, this.logger = typeof e.logger < "u" && typeof e.logger != "string" ? cjs$1.generateChildLogger(e.logger, this.name) : cjs$1.pino(cjs$1.getDefaultLoggerOptions({ level: e.logger || ht })), this.messages = new St(this.logger, e.core), this.subscriber = new xt(this, this.logger), this.publisher = new Dr(this, this.logger), this.relayUrl = (e == null ? void 0 : e.relayUrl) || de$1, this.projectId = e.projectId, this.provider = {};
  }
  async init() {
    this.logger.trace("Initialized"), this.registerEventListeners(), await this.createProvider(), await Promise.all([this.messages.init(), this.subscriber.init()]);
    try {
      await this.transportOpen();
    } catch {
      this.logger.warn(`Connection via ${this.relayUrl} failed, attempting to connect via failover domain ${ge$1}...`), await this.restartTransport(ge$1);
    }
    this.initialized = true, setTimeout(async () => {
      this.subscriber.topics.length === 0 && (this.logger.info("No topics subscribed to after init, closing transport"), await this.transportClose(), this.transportExplicitlyClosed = false);
    }, gt);
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  get connected() {
    return this.provider.connection.connected;
  }
  get connecting() {
    return this.provider.connection.connecting;
  }
  async publish(e, t, i) {
    this.isInitialized(), await this.publisher.publish(e, t, i), await this.recordMessageEvent({ topic: e, message: t, publishedAt: Date.now() });
  }
  async subscribe(e, t) {
    var i;
    this.isInitialized();
    let s = ((i = this.subscriber.topicMap.get(e)) == null ? void 0 : i[0]) || "";
    if (s)
      return s;
    let n2;
    const a2 = (o) => {
      o.topic === e && (this.subscriber.off(w.created, a2), n2());
    };
    return await Promise.all([new Promise((o) => {
      n2 = o, this.subscriber.on(w.created, a2);
    }), new Promise(async (o) => {
      s = await this.subscriber.subscribe(e, t), o();
    })]), s;
  }
  async unsubscribe(e, t) {
    this.isInitialized(), await this.subscriber.unsubscribe(e, t);
  }
  on(e, t) {
    this.events.on(e, t);
  }
  once(e, t) {
    this.events.once(e, t);
  }
  off(e, t) {
    this.events.off(e, t);
  }
  removeListener(e, t) {
    this.events.removeListener(e, t);
  }
  async transportClose() {
    this.transportExplicitlyClosed = true, this.hasExperiencedNetworkDisruption && this.connected ? await it$1(this.provider.disconnect(), 1e3, "provider.disconnect()").catch(() => this.onProviderDisconnect()) : this.connected && await this.provider.disconnect();
  }
  async transportOpen(e) {
    if (this.transportExplicitlyClosed = false, await this.confirmOnlineStateOrThrow(), !this.connectionAttemptInProgress) {
      e && e !== this.relayUrl && (this.relayUrl = e, await this.transportClose(), await this.createProvider()), this.connectionAttemptInProgress = true;
      try {
        await Promise.all([new Promise((t) => {
          if (!this.initialized)
            return t();
          this.subscriber.once(w.resubscribed, () => {
            t();
          });
        }), new Promise(async (t, i) => {
          try {
            await it$1(this.provider.connect(), 1e4, `Socket stalled when trying to connect to ${this.relayUrl}`);
          } catch (s) {
            i(s);
            return;
          }
          t();
        })]);
      } catch (t) {
        this.logger.error(t);
        const i = t;
        if (!this.isConnectionStalled(i.message))
          throw t;
        this.provider.events.emit(T.disconnect);
      } finally {
        this.connectionAttemptInProgress = false, this.hasExperiencedNetworkDisruption = false;
      }
    }
  }
  async restartTransport(e) {
    await this.confirmOnlineStateOrThrow(), !this.connectionAttemptInProgress && (this.relayUrl = e || this.relayUrl, await this.transportClose(), await this.createProvider(), await this.transportOpen());
  }
  async confirmOnlineStateOrThrow() {
    if (!await Zt())
      throw new Error("No internet connection detected. Please restart your network and try again.");
  }
  isConnectionStalled(e) {
    return this.staleConnectionErrors.some((t) => e.includes(t));
  }
  async createProvider() {
    this.provider.connection && this.unregisterProviderListeners();
    const e = await this.core.crypto.signJWT(this.relayUrl);
    this.provider = new JsonRpcProvider(new WsConnection(Jn({ sdkVersion: dt, protocol: this.protocol, version: this.version, relayUrl: this.relayUrl, projectId: this.projectId, auth: e, useOnCloseEvent: true }))), this.registerProviderListeners();
  }
  async recordMessageEvent(e) {
    const { topic: t, message: i } = e;
    await this.messages.set(t, i);
  }
  async shouldIgnoreMessageEvent(e) {
    const { topic: t, message: i } = e;
    if (!i || i.length === 0)
      return this.logger.debug(`Ignoring invalid/empty message: ${i}`), true;
    if (!await this.subscriber.isSubscribed(t))
      return this.logger.debug(`Ignoring message for non-subscribed topic ${t}`), true;
    const s = this.messages.has(t, i);
    return s && this.logger.debug(`Ignoring duplicate message: ${i}`), s;
  }
  async onProviderPayload(e) {
    if (this.logger.debug("Incoming Relay Payload"), this.logger.trace({ type: "payload", direction: "incoming", payload: e }), isJsonRpcRequest(e)) {
      if (!e.method.endsWith(ut))
        return;
      const t = e.params, { topic: i, message: s, publishedAt: n2 } = t.data, a2 = { topic: i, message: s, publishedAt: n2 };
      this.logger.debug("Emitting Relayer Payload"), this.logger.trace(Rr({ type: "event", event: t.id }, a2)), this.events.emit(t.id, a2), await this.acknowledgePayload(e), await this.onMessageEvent(a2);
    } else
      isJsonRpcResponse(e) && this.events.emit(D$1.message_ack, e);
  }
  async onMessageEvent(e) {
    await this.shouldIgnoreMessageEvent(e) || (this.events.emit(D$1.message, e), await this.recordMessageEvent(e));
  }
  async acknowledgePayload(e) {
    const t = formatJsonRpcResult(e.id, true);
    await this.provider.connection.send(t);
  }
  unregisterProviderListeners() {
    this.provider.off(T.payload, this.onPayloadHandler), this.provider.off(T.connect, this.onConnectHandler), this.provider.off(T.disconnect, this.onDisconnectHandler), this.provider.off(T.error, this.onProviderErrorHandler);
  }
  async registerEventListeners() {
    this.events.on(D$1.connection_stalled, () => {
      this.restartTransport().catch((t) => this.logger.error(t));
    });
    let e = await Zt();
    Xt(async (t) => {
      this.initialized && e !== t && (e = t, t ? await this.restartTransport().catch((i) => this.logger.error(i)) : (this.hasExperiencedNetworkDisruption = true, await this.transportClose().catch((i) => this.logger.error(i))));
    });
  }
  onProviderDisconnect() {
    this.events.emit(D$1.disconnect), this.attemptToReconnect();
  }
  attemptToReconnect() {
    this.transportExplicitlyClosed || (this.logger.info("attemptToReconnect called. Connecting..."), setTimeout(async () => {
      await this.restartTransport().catch((e) => this.logger.error(e));
    }, cjs$3.toMiliseconds(lt)));
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = N$2("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
  async toEstablishConnection() {
    if (await this.confirmOnlineStateOrThrow(), !this.connected) {
      if (this.connectionAttemptInProgress)
        return await new Promise((e) => {
          const t = setInterval(() => {
            this.connected && (clearInterval(t), e());
          }, this.connectionStatusPollingInterval);
        });
      await this.restartTransport();
    }
  }
}
var _r = Object.defineProperty, Nt = Object.getOwnPropertySymbols, Sr = Object.prototype.hasOwnProperty, Pr = Object.prototype.propertyIsEnumerable, Lt = (r, e, t) => e in r ? _r(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t, Ut = (r, e) => {
  for (var t in e || (e = {}))
    Sr.call(e, t) && Lt(r, t, e[t]);
  if (Nt)
    for (var t of Nt(e))
      Pr.call(e, t) && Lt(r, t, e[t]);
  return r;
};
class Ft extends p$1 {
  constructor(e, t, i, s = O$1, n2 = void 0) {
    super(e, t, i, s), this.core = e, this.logger = t, this.name = i, this.map = /* @__PURE__ */ new Map(), this.version = pt, this.cached = [], this.initialized = false, this.storagePrefix = O$1, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((a2) => {
        this.getKey && a2 !== null && !w$1(a2) ? this.map.set(this.getKey(a2), a2) : Dt$1(a2) ? this.map.set(a2.id, a2) : kt$1(a2) && this.map.set(a2.topic, a2);
      }), this.cached = [], this.initialized = true);
    }, this.set = async (a2, o) => {
      this.isInitialized(), this.map.has(a2) ? await this.update(a2, o) : (this.logger.debug("Setting value"), this.logger.trace({ type: "method", method: "set", key: a2, value: o }), this.map.set(a2, o), await this.persist());
    }, this.get = (a2) => (this.isInitialized(), this.logger.debug("Getting value"), this.logger.trace({ type: "method", method: "get", key: a2 }), this.getData(a2)), this.getAll = (a2) => (this.isInitialized(), a2 ? this.values.filter((o) => Object.keys(a2).every((h3) => ki(o[h3], a2[h3]))) : this.values), this.update = async (a2, o) => {
      this.isInitialized(), this.logger.debug("Updating value"), this.logger.trace({ type: "method", method: "update", key: a2, update: o });
      const h3 = Ut(Ut({}, this.getData(a2)), o);
      this.map.set(a2, h3), await this.persist();
    }, this.delete = async (a2, o) => {
      this.isInitialized(), this.map.has(a2) && (this.logger.debug("Deleting value"), this.logger.trace({ type: "method", method: "delete", key: a2, reason: o }), this.map.delete(a2), await this.persist());
    }, this.logger = cjs$1.generateChildLogger(t, this.name), this.storagePrefix = s, this.getKey = n2;
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.map.size;
  }
  get keys() {
    return Array.from(this.map.keys());
  }
  get values() {
    return Array.from(this.map.values());
  }
  async setDataStore(e) {
    await this.core.storage.setItem(this.storageKey, e);
  }
  async getDataStore() {
    return await this.core.storage.getItem(this.storageKey);
  }
  getData(e) {
    const t = this.map.get(e);
    if (!t) {
      const { message: i } = N$2("NO_MATCHING_KEY", `${this.name}: ${e}`);
      throw this.logger.error(i), new Error(i);
    }
    return t;
  }
  async persist() {
    await this.setDataStore(this.values);
  }
  async restore() {
    try {
      const e = await this.getDataStore();
      if (typeof e > "u" || !e.length)
        return;
      if (this.map.size) {
        const { message: t } = N$2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e, this.logger.debug(`Successfully Restored value for ${this.name}`), this.logger.trace({ type: "method", method: "restore", value: this.values });
    } catch (e) {
      this.logger.debug(`Failed to Restore value for ${this.name}`), this.logger.error(e);
    }
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = N$2("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
class $t {
  constructor(e, t) {
    this.core = e, this.logger = t, this.name = ft$1, this.version = Et, this.events = new $g(), this.initialized = false, this.storagePrefix = O$1, this.ignoredPayloadTypes = [_$2], this.registeredMethods = [], this.init = async () => {
      this.initialized || (await this.pairings.init(), await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.initialized = true, this.logger.trace("Initialized"));
    }, this.register = ({ methods: i }) => {
      this.isInitialized(), this.registeredMethods = [.../* @__PURE__ */ new Set([...this.registeredMethods, ...i])];
    }, this.create = async () => {
      this.isInitialized();
      const i = Dn(), s = await this.core.crypto.setSymKey(i), n2 = lt$1(cjs$3.FIVE_MINUTES), a2 = { protocol: ot }, o = { topic: s, expiry: n2, relay: a2, active: false }, h3 = Nt$1({ protocol: this.core.protocol, version: this.core.version, topic: s, symKey: i, relay: a2 });
      return await this.pairings.set(s, o), await this.core.relayer.subscribe(s), this.core.expirer.set(s, n2), { topic: s, uri: h3 };
    }, this.pair = async (i) => {
      this.isInitialized(), this.isValidPair(i);
      const { topic: s, symKey: n2, relay: a2 } = bt$1(i.uri);
      let o;
      if (this.pairings.keys.includes(s) && (o = this.pairings.get(s), o.active))
        throw new Error(`Pairing already exists: ${s}. Please try again with a new connection URI.`);
      this.core.crypto.keychain.has(s) || (await this.core.crypto.setSymKey(n2, s), await this.core.relayer.subscribe(s, { relay: a2 }));
      const h3 = lt$1(cjs$3.FIVE_MINUTES), u3 = { topic: s, relay: a2, expiry: h3, active: false };
      return await this.pairings.set(s, u3), this.core.expirer.set(s, h3), i.activatePairing && await this.activate({ topic: s }), this.events.emit(B.create, u3), u3;
    }, this.activate = async ({ topic: i }) => {
      this.isInitialized();
      const s = lt$1(cjs$3.THIRTY_DAYS);
      await this.pairings.update(i, { active: true, expiry: s }), this.core.expirer.set(i, s);
    }, this.ping = async (i) => {
      this.isInitialized(), await this.isValidPing(i);
      const { topic: s } = i;
      if (this.pairings.keys.includes(s)) {
        const n2 = await this.sendRequest(s, "wc_pairingPing", {}), { done: a2, resolve: o, reject: h3 } = st$1();
        this.events.once(ft$2("pairing_ping", n2), ({ error: u3 }) => {
          u3 ? h3(u3) : o();
        }), await a2();
      }
    }, this.updateExpiry = async ({ topic: i, expiry: s }) => {
      this.isInitialized(), await this.pairings.update(i, { expiry: s });
    }, this.updateMetadata = async ({ topic: i, metadata: s }) => {
      this.isInitialized(), await this.pairings.update(i, { peerMetadata: s });
    }, this.getPairings = () => (this.isInitialized(), this.pairings.values), this.disconnect = async (i) => {
      this.isInitialized(), await this.isValidDisconnect(i);
      const { topic: s } = i;
      this.pairings.keys.includes(s) && (await this.sendRequest(s, "wc_pairingDelete", U$2("USER_DISCONNECTED")), await this.deletePairing(s));
    }, this.sendRequest = async (i, s, n2) => {
      const a2 = formatJsonRpcRequest(s, n2), o = await this.core.crypto.encode(i, a2), h3 = F$1[s].req;
      return this.core.history.set(i, a2), this.core.relayer.publish(i, o, h3), a2.id;
    }, this.sendResult = async (i, s, n2) => {
      const a2 = formatJsonRpcResult(i, n2), o = await this.core.crypto.encode(s, a2), h3 = await this.core.history.get(s, i), u3 = F$1[h3.request.method].res;
      await this.core.relayer.publish(s, o, u3), await this.core.history.resolve(a2);
    }, this.sendError = async (i, s, n2) => {
      const a2 = formatJsonRpcError(i, n2), o = await this.core.crypto.encode(s, a2), h3 = await this.core.history.get(s, i), u3 = F$1[h3.request.method] ? F$1[h3.request.method].res : F$1.unregistered_method.res;
      await this.core.relayer.publish(s, o, u3), await this.core.history.resolve(a2);
    }, this.deletePairing = async (i, s) => {
      await this.core.relayer.unsubscribe(i), await Promise.all([this.pairings.delete(i, U$2("USER_DISCONNECTED")), this.core.crypto.deleteSymKey(i), s ? Promise.resolve() : this.core.expirer.del(i)]);
    }, this.cleanup = async () => {
      const i = this.pairings.getAll().filter((s) => dt$1(s.expiry));
      await Promise.all(i.map((s) => this.deletePairing(s.topic)));
    }, this.onRelayEventRequest = (i) => {
      const { topic: s, payload: n2 } = i;
      switch (n2.method) {
        case "wc_pairingPing":
          return this.onPairingPingRequest(s, n2);
        case "wc_pairingDelete":
          return this.onPairingDeleteRequest(s, n2);
        default:
          return this.onUnknownRpcMethodRequest(s, n2);
      }
    }, this.onRelayEventResponse = async (i) => {
      const { topic: s, payload: n2 } = i, a2 = (await this.core.history.get(s, n2.id)).request.method;
      switch (a2) {
        case "wc_pairingPing":
          return this.onPairingPingResponse(s, n2);
        default:
          return this.onUnknownRpcMethodResponse(a2);
      }
    }, this.onPairingPingRequest = async (i, s) => {
      const { id: n2 } = s;
      try {
        this.isValidPing({ topic: i }), await this.sendResult(n2, i, true), this.events.emit(B.ping, { id: n2, topic: i });
      } catch (a2) {
        await this.sendError(n2, i, a2), this.logger.error(a2);
      }
    }, this.onPairingPingResponse = (i, s) => {
      const { id: n2 } = s;
      setTimeout(() => {
        isJsonRpcResult(s) ? this.events.emit(ft$2("pairing_ping", n2), {}) : isJsonRpcError(s) && this.events.emit(ft$2("pairing_ping", n2), { error: s.error });
      }, 500);
    }, this.onPairingDeleteRequest = async (i, s) => {
      const { id: n2 } = s;
      try {
        this.isValidDisconnect({ topic: i }), await this.deletePairing(i), this.events.emit(B.delete, { id: n2, topic: i });
      } catch (a2) {
        await this.sendError(n2, i, a2), this.logger.error(a2);
      }
    }, this.onUnknownRpcMethodRequest = async (i, s) => {
      const { id: n2, method: a2 } = s;
      try {
        if (this.registeredMethods.includes(a2))
          return;
        const o = U$2("WC_METHOD_UNSUPPORTED", a2);
        await this.sendError(n2, i, o), this.logger.error(o);
      } catch (o) {
        await this.sendError(n2, i, o), this.logger.error(o);
      }
    }, this.onUnknownRpcMethodResponse = (i) => {
      this.registeredMethods.includes(i) || this.logger.error(U$2("WC_METHOD_UNSUPPORTED", i));
    }, this.isValidPair = (i) => {
      if (!xt$1(i)) {
        const { message: s } = N$2("MISSING_OR_INVALID", `pair() params: ${i}`);
        throw new Error(s);
      }
      if (!jt(i.uri)) {
        const { message: s } = N$2("MISSING_OR_INVALID", `pair() uri: ${i.uri}`);
        throw new Error(s);
      }
    }, this.isValidPing = async (i) => {
      if (!xt$1(i)) {
        const { message: n2 } = N$2("MISSING_OR_INVALID", `ping() params: ${i}`);
        throw new Error(n2);
      }
      const { topic: s } = i;
      await this.isValidPairingTopic(s);
    }, this.isValidDisconnect = async (i) => {
      if (!xt$1(i)) {
        const { message: n2 } = N$2("MISSING_OR_INVALID", `disconnect() params: ${i}`);
        throw new Error(n2);
      }
      const { topic: s } = i;
      await this.isValidPairingTopic(s);
    }, this.isValidPairingTopic = async (i) => {
      if (!h$2(i, false)) {
        const { message: s } = N$2("MISSING_OR_INVALID", `pairing topic should be a string: ${i}`);
        throw new Error(s);
      }
      if (!this.pairings.keys.includes(i)) {
        const { message: s } = N$2("NO_MATCHING_KEY", `pairing topic doesn't exist: ${i}`);
        throw new Error(s);
      }
      if (dt$1(this.pairings.get(i).expiry)) {
        await this.deletePairing(i);
        const { message: s } = N$2("EXPIRED", `pairing topic: ${i}`);
        throw new Error(s);
      }
    }, this.core = e, this.logger = cjs$1.generateChildLogger(t, this.name), this.pairings = new Ft(this.core, this.logger, this.name, this.storagePrefix);
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = N$2("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
  registerRelayerEvents() {
    this.core.relayer.on(D$1.message, async (e) => {
      const { topic: t, message: i } = e;
      if (!this.pairings.keys.includes(t) || this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(i)))
        return;
      const s = await this.core.crypto.decode(t, i);
      try {
        isJsonRpcRequest(s) ? (this.core.history.set(t, s), this.onRelayEventRequest({ topic: t, payload: s })) : isJsonRpcResponse(s) && (await this.core.history.resolve(s), await this.onRelayEventResponse({ topic: t, payload: s }), this.core.history.delete(t, s.id));
      } catch (n2) {
        this.logger.error(n2);
      }
    });
  }
  registerExpirerEvents() {
    this.core.expirer.on(v$1.expired, async (e) => {
      const { topic: t } = ut$1(e.target);
      t && this.pairings.keys.includes(t) && (await this.deletePairing(t, true), this.events.emit(B.expire, { topic: t }));
    });
  }
}
class Mt extends h2 {
  constructor(e, t) {
    super(e, t), this.core = e, this.logger = t, this.records = /* @__PURE__ */ new Map(), this.events = new eventsExports.EventEmitter(), this.name = wt, this.version = vt, this.cached = [], this.initialized = false, this.storagePrefix = O$1, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i) => this.records.set(i.id, i)), this.cached = [], this.registerEventListeners(), this.initialized = true);
    }, this.set = (i, s, n2) => {
      if (this.isInitialized(), this.logger.debug("Setting JSON-RPC request history record"), this.logger.trace({ type: "method", method: "set", topic: i, request: s, chainId: n2 }), this.records.has(s.id))
        return;
      const a2 = { id: s.id, topic: i, request: { method: s.method, params: s.params || null }, chainId: n2, expiry: lt$1(cjs$3.THIRTY_DAYS) };
      this.records.set(a2.id, a2), this.events.emit(R.created, a2);
    }, this.resolve = async (i) => {
      if (this.isInitialized(), this.logger.debug("Updating JSON-RPC response history record"), this.logger.trace({ type: "method", method: "update", response: i }), !this.records.has(i.id))
        return;
      const s = await this.getRecord(i.id);
      typeof s.response > "u" && (s.response = isJsonRpcError(i) ? { error: i.error } : { result: i.result }, this.records.set(s.id, s), this.events.emit(R.updated, s));
    }, this.get = async (i, s) => (this.isInitialized(), this.logger.debug("Getting record"), this.logger.trace({ type: "method", method: "get", topic: i, id: s }), await this.getRecord(s)), this.delete = (i, s) => {
      this.isInitialized(), this.logger.debug("Deleting record"), this.logger.trace({ type: "method", method: "delete", id: s }), this.values.forEach((n2) => {
        if (n2.topic === i) {
          if (typeof s < "u" && n2.id !== s)
            return;
          this.records.delete(n2.id), this.events.emit(R.deleted, n2);
        }
      });
    }, this.exists = async (i, s) => (this.isInitialized(), this.records.has(s) ? (await this.getRecord(s)).topic === i : false), this.on = (i, s) => {
      this.events.on(i, s);
    }, this.once = (i, s) => {
      this.events.once(i, s);
    }, this.off = (i, s) => {
      this.events.off(i, s);
    }, this.removeListener = (i, s) => {
      this.events.removeListener(i, s);
    }, this.logger = cjs$1.generateChildLogger(t, this.name);
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get size() {
    return this.records.size;
  }
  get keys() {
    return Array.from(this.records.keys());
  }
  get values() {
    return Array.from(this.records.values());
  }
  get pending() {
    const e = [];
    return this.values.forEach((t) => {
      if (typeof t.response < "u")
        return;
      const i = { topic: t.topic, request: formatJsonRpcRequest(t.request.method, t.request.params, t.id), chainId: t.chainId };
      return e.push(i);
    }), e;
  }
  async setJsonRpcRecords(e) {
    await this.core.storage.setItem(this.storageKey, e);
  }
  async getJsonRpcRecords() {
    return await this.core.storage.getItem(this.storageKey);
  }
  getRecord(e) {
    this.isInitialized();
    const t = this.records.get(e);
    if (!t) {
      const { message: i } = N$2("NO_MATCHING_KEY", `${this.name}: ${e}`);
      throw new Error(i);
    }
    return t;
  }
  async persist() {
    await this.setJsonRpcRecords(this.values), this.events.emit(R.sync);
  }
  async restore() {
    try {
      const e = await this.getJsonRpcRecords();
      if (typeof e > "u" || !e.length)
        return;
      if (this.records.size) {
        const { message: t } = N$2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e, this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({ type: "method", method: "restore", records: this.values });
    } catch (e) {
      this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(e);
    }
  }
  registerEventListeners() {
    this.events.on(R.created, (e) => {
      const t = R.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e }), this.persist();
    }), this.events.on(R.updated, (e) => {
      const t = R.updated;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e }), this.persist();
    }), this.events.on(R.deleted, (e) => {
      const t = R.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e }), this.persist();
    }), this.core.heartbeat.on(cjs$2.HEARTBEAT_EVENTS.pulse, () => {
      this.cleanup();
    });
  }
  cleanup() {
    try {
      this.records.forEach((e) => {
        cjs$3.toMiliseconds(e.expiry || 0) - Date.now() <= 0 && (this.logger.info(`Deleting expired history log: ${e.id}`), this.delete(e.topic, e.id));
      });
    } catch (e) {
      this.logger.warn(e);
    }
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = N$2("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
class kt extends E$1 {
  constructor(e, t) {
    super(e, t), this.core = e, this.logger = t, this.expirations = /* @__PURE__ */ new Map(), this.events = new eventsExports.EventEmitter(), this.name = It, this.version = Ct$1, this.cached = [], this.initialized = false, this.storagePrefix = O$1, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i) => this.expirations.set(i.target, i)), this.cached = [], this.registerEventListeners(), this.initialized = true);
    }, this.has = (i) => {
      try {
        const s = this.formatTarget(i);
        return typeof this.getExpiration(s) < "u";
      } catch {
        return false;
      }
    }, this.set = (i, s) => {
      this.isInitialized();
      const n2 = this.formatTarget(i), a2 = { target: n2, expiry: s };
      this.expirations.set(n2, a2), this.checkExpiry(n2, a2), this.events.emit(v$1.created, { target: n2, expiration: a2 });
    }, this.get = (i) => {
      this.isInitialized();
      const s = this.formatTarget(i);
      return this.getExpiration(s);
    }, this.del = (i) => {
      if (this.isInitialized(), this.has(i)) {
        const s = this.formatTarget(i), n2 = this.getExpiration(s);
        this.expirations.delete(s), this.events.emit(v$1.deleted, { target: s, expiration: n2 });
      }
    }, this.on = (i, s) => {
      this.events.on(i, s);
    }, this.once = (i, s) => {
      this.events.once(i, s);
    }, this.off = (i, s) => {
      this.events.off(i, s);
    }, this.removeListener = (i, s) => {
      this.events.removeListener(i, s);
    }, this.logger = cjs$1.generateChildLogger(t, this.name);
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.expirations.size;
  }
  get keys() {
    return Array.from(this.expirations.keys());
  }
  get values() {
    return Array.from(this.expirations.values());
  }
  formatTarget(e) {
    if (typeof e == "string")
      return ct$1(e);
    if (typeof e == "number")
      return at$1(e);
    const { message: t } = N$2("UNKNOWN_TYPE", `Target type: ${typeof e}`);
    throw new Error(t);
  }
  async setExpirations(e) {
    await this.core.storage.setItem(this.storageKey, e);
  }
  async getExpirations() {
    return await this.core.storage.getItem(this.storageKey);
  }
  async persist() {
    await this.setExpirations(this.values), this.events.emit(v$1.sync);
  }
  async restore() {
    try {
      const e = await this.getExpirations();
      if (typeof e > "u" || !e.length)
        return;
      if (this.expirations.size) {
        const { message: t } = N$2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e, this.logger.debug(`Successfully Restored expirations for ${this.name}`), this.logger.trace({ type: "method", method: "restore", expirations: this.values });
    } catch (e) {
      this.logger.debug(`Failed to Restore expirations for ${this.name}`), this.logger.error(e);
    }
  }
  getExpiration(e) {
    const t = this.expirations.get(e);
    if (!t) {
      const { message: i } = N$2("NO_MATCHING_KEY", `${this.name}: ${e}`);
      throw this.logger.error(i), new Error(i);
    }
    return t;
  }
  checkExpiry(e, t) {
    const { expiry: i } = t;
    cjs$3.toMiliseconds(i) - Date.now() <= 0 && this.expire(e, t);
  }
  expire(e, t) {
    this.expirations.delete(e), this.events.emit(v$1.expired, { target: e, expiration: t });
  }
  checkExpirations() {
    this.core.relayer.connected && this.expirations.forEach((e, t) => this.checkExpiry(t, e));
  }
  registerEventListeners() {
    this.core.heartbeat.on(cjs$2.HEARTBEAT_EVENTS.pulse, () => this.checkExpirations()), this.events.on(v$1.created, (e) => {
      const t = v$1.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e }), this.persist();
    }), this.events.on(v$1.expired, (e) => {
      const t = v$1.expired;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e }), this.persist();
    }), this.events.on(v$1.deleted, (e) => {
      const t = v$1.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e }), this.persist();
    });
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e } = N$2("NOT_INITIALIZED", this.name);
      throw new Error(e);
    }
  }
}
class Kt extends y$1 {
  constructor(e, t) {
    super(e, t), this.projectId = e, this.logger = t, this.name = Q$2, this.initialized = false, this.queue = [], this.verifyDisabled = false, this.init = async () => {
      if (this.verifyDisabled || j$2() || !q$1())
        return;
      const i = Z;
      this.verifyUrl !== i && this.removeIframe(), this.verifyUrl = i;
      try {
        await this.createIframe();
      } catch (s) {
        this.logger.info(`Verify iframe failed to load: ${this.verifyUrl}`), this.logger.info(s);
      }
      if (!this.initialized) {
        this.removeIframe(), this.verifyUrl = pe$1;
        try {
          await this.createIframe();
        } catch (s) {
          this.logger.info(`Verify iframe failed to load: ${this.verifyUrl}`), this.logger.info(s), this.verifyDisabled = true;
        }
      }
    }, this.register = async (i) => {
      this.initialized ? this.sendPost(i.attestationId) : (this.addToQueue(i.attestationId), await this.init());
    }, this.resolve = async (i) => {
      if (this.isDevEnv)
        return "";
      const s = (i == null ? void 0 : i.verifyUrl) || Z;
      let n2;
      try {
        n2 = await this.fetchAttestation(i.attestationId, s);
      } catch (a2) {
        this.logger.info(`failed to resolve attestation: ${i.attestationId} from url: ${s}`), this.logger.info(a2), n2 = await this.fetchAttestation(i.attestationId, pe$1);
      }
      return n2;
    }, this.fetchAttestation = async (i, s) => {
      this.logger.info(`resolving attestation: ${i} from url: ${s}`);
      const n2 = this.startAbortTimer(cjs$3.ONE_SECOND * 2), a2 = await fetch(`${s}/attestation/${i}`, { signal: this.abortController.signal });
      return clearTimeout(n2), a2.status === 200 ? await a2.json() : void 0;
    }, this.addToQueue = (i) => {
      this.queue.push(i);
    }, this.processQueue = () => {
      this.queue.length !== 0 && (this.queue.forEach((i) => this.sendPost(i)), this.queue = []);
    }, this.sendPost = (i) => {
      var s;
      try {
        if (!this.iframe)
          return;
        (s = this.iframe.contentWindow) == null || s.postMessage(i, "*"), this.logger.info(`postMessage sent: ${i} ${this.verifyUrl}`);
      } catch {
      }
    }, this.createIframe = async () => {
      let i;
      const s = (n2) => {
        n2.data === "verify_ready" && (this.initialized = true, this.processQueue(), window.removeEventListener("message", s), i());
      };
      await Promise.race([new Promise((n2) => {
        if (document.getElementById(Q$2))
          return n2();
        window.addEventListener("message", s);
        const a2 = document.createElement("iframe");
        a2.id = Q$2, a2.src = `${this.verifyUrl}/${this.projectId}`, a2.style.display = "none", document.body.append(a2), this.iframe = a2, i = n2;
      }), new Promise((n2, a2) => setTimeout(() => {
        window.removeEventListener("message", s), a2("verify iframe load timeout");
      }, cjs$3.toMiliseconds(cjs$3.FIVE_SECONDS)))]);
    }, this.removeIframe = () => {
      this.iframe && (this.iframe.remove(), this.iframe = void 0, this.initialized = false);
    }, this.logger = cjs$1.generateChildLogger(t, this.name), this.verifyUrl = Z, this.abortController = new AbortController(), this.isDevEnv = te() && { "NVM_INC": "/Users/chenwenjie/.nvm/versions/node/v18.12.1/include/node", "TERM_PROGRAM": "vscode", "rvm_bin_path": "/Users/chenwenjie/.rvm/bin", "NODE": "/Users/chenwenjie/.nvm/versions/node/v18.12.1/bin/node", "INIT_CWD": "/Users/chenwenjie/test/paytoview/miniapp", "ANDROID_HOME": "/Users/chenwenjie/Library/Android/sdk", "NVM_CD_FLAGS": "-q", "GEM_HOME": "/Users/chenwenjie/.rvm/gems/ruby-3.0.0", "SHELL": "/bin/zsh", "TERM": "xterm-256color", "npm_config_metrics_registry": "https://registry.npmjs.org/", "TMPDIR": "/var/folders/p6/bx85h6x50tj_dk600nvwgr440000gn/T/", "IRBRC": "/Users/chenwenjie/.rvm/rubies/ruby-3.0.0/.irbrc", "npm_config_global_prefix": "/Users/chenwenjie/.nvm/versions/node/v18.12.1", "GRADLE_HOME": "/Users/chenwenjie/.sdkman/candidates/gradle/current", "TERM_PROGRAM_VERSION": "1.84.2", "ZDOTDIR": "/Users/chenwenjie", "ORIGINAL_XDG_CURRENT_DESKTOP": "undefined", "COLOR": "1", "TERM_SESSION_ID": "w0t0p0:282ABC9F-6447-4D98-AF6B-D8DFB377DA57", "MY_RUBY_HOME": "/Users/chenwenjie/.rvm/rubies/ruby-3.0.0", "npm_config_noproxy": "", "SDKMAN_PLATFORM": "darwinx64", "npm_config_local_prefix": "/Users/chenwenjie/test/paytoview/miniapp", "ZSH": "/Users/chenwenjie/.oh-my-zsh", "USER": "chenwenjie", "NVM_DIR": "/Users/chenwenjie/.nvm", "LS_COLORS": "di=1;36:ln=35:so=32:pi=33:ex=31:bd=34;46:cd=34;43:su=30;41:sg=30;46:tw=30;42:ow=30;43", "npm_config_globalconfig": "/Users/chenwenjie/.nvm/versions/node/v18.12.1/etc/npmrc", "SDKMAN_CANDIDATES_API": "https://api.sdkman.io/2", "MONO_HOME": "/Library/Frameworks/Mono.framework/Versions/6.12.0", "rvm_path": "/Users/chenwenjie/.rvm", "SSH_AUTH_SOCK": "/private/tmp/com.apple.launchd.16tumr5bCj/Listeners", "__CF_USER_TEXT_ENCODING": "0x1F5:0x19:0x34", "npm_execpath": "/Users/chenwenjie/.nvm/versions/node/v18.12.1/lib/node_modules/npm/bin/npm-cli.js", "PAGER": "less", "LSCOLORS": "Gxfxcxdxbxegedabagacad", "rvm_prefix": "/Users/chenwenjie", "PATH": "/Users/chenwenjie/test/paytoview/miniapp/node_modules/.bin:/Users/chenwenjie/test/paytoview/node_modules/.bin:/Users/chenwenjie/test/node_modules/.bin:/Users/chenwenjie/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/chenwenjie/.nvm/versions/node/v18.12.1/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/Users/chenwenjie/.rvm/gems/ruby-3.0.0/bin:/Users/chenwenjie/.rvm/gems/ruby-3.0.0@global/bin:/Users/chenwenjie/.rvm/rubies/ruby-3.0.0/bin:/Users/chenwenjie/go/bin:/Users/chenwenjie/.nvm/versions/node/v18.12.1/bin:/Users/chenwenjie/.nvm/versions/node/v18.12.1/bin:/usr/local/eth/bin:/Users/chenwenjie/go/bin:/usr/local/sbin:/Users/chenwenjie/Library/Android/sdk:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/go/bin:/Library/Apple/usr/bin:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Users/chenwenjie/.go/bin:/Users/chenwenjie/.rvm/gems/ruby-3.0.0/bin:/Users/chenwenjie/.rvm/gems/ruby-3.0.0@global/bin:/Users/chenwenjie/.rvm/rubies/ruby-3.0.0/bin:/Users/chenwenjie/go/bin:/Users/chenwenjie/.nvm/versions/node/v18.12.1/bin:/usr/local/eth/bin:/usr/local/sbin:/Users/chenwenjie/Library/Android/sdk:/Users/chenwenjie/.sdkman/candidates/java/current/bin:/Users/chenwenjie/.sdkman/candidates/gradle/current/bin:/Users/chenwenjie/Library/Android/sdk/platform-tools:/Users/chenwenjie/Library/Android/sdk/tools:/Users/chenwenjie/Library/Android/sdk/emulator:/Library/Frameworks/Mono.framework/Versions/6.12.0/bin:/Users/chenwenjie/.rvm/bin:/Users/chenwenjie/Library/Android/sdk/platform-tools:/Users/chenwenjie/Library/Android/sdk/tools:/Users/chenwenjie/go/bin:/Users/chenwenjie/Library/Android/sdk/emulator:/Users/chenwenjie/Library/Android/sdk/platform-tools:/Library/Frameworks/Mono.framework/Versions/6.12.0/bin", "npm_package_json": "/Users/chenwenjie/test/paytoview/miniapp/package.json", "LaunchInstanceID": "D57D4E16-BEA6-43A7-9918-245B5D88BB71", "npm_config_userconfig": "/Users/chenwenjie/.npmrc", "npm_config_init_module": "/Users/chenwenjie/.npm-init.js", "USER_ZDOTDIR": "/Users/chenwenjie", "npm_command": "run-script", "PWD": "/Users/chenwenjie/test/paytoview/miniapp", "JAVA_HOME": "/Applications/Android Studio.app/Contents/jre/Contents/Home", "npm_lifecycle_event": "dbuild", "EDITOR": "vi", "npm_package_name": "miniapp", "LANG": "zh_CN.UTF-8", "ITERM_PROFILE": "Default", "VSCODE_GIT_ASKPASS_EXTRA_ARGS": "--ms-enable-electron-run-as-node", "XPC_FLAGS": "0x0", "npm_config_node_gyp": "/Users/chenwenjie/.nvm/versions/node/v18.12.1/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js", "npm_package_version": "0.0.0", "XPC_SERVICE_NAME": "0", "VSCODE_INJECTION": "1", "rvm_version": "1.29.12 (latest)", "COLORFGBG": "7;0", "HOME": "/Users/chenwenjie", "SHLVL": "4", "VSCODE_GIT_ASKPASS_MAIN": "/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass-main.js", "GOROOT": "/Users/chenwenjie/.go", "LC_TERMINAL_VERSION": "3.4.22", "ITERM_SESSION_ID": "w0t0p0:282ABC9F-6447-4D98-AF6B-D8DFB377DA57", "npm_config_cache": "/Users/chenwenjie/.npm", "VSCODE_PATH_PREFIX": "/Users/chenwenjie/.go/bin:", "LOGNAME": "chenwenjie", "LESS": "-R", "npm_lifecycle_script": "tsc && vite build --minify false", "SDKMAN_DIR": "/Users/chenwenjie/.sdkman", "VSCODE_GIT_IPC_HANDLE": "/var/folders/p6/bx85h6x50tj_dk600nvwgr440000gn/T/vscode-git-01227da02d.sock", "GEM_PATH": "/Users/chenwenjie/.rvm/gems/ruby-3.0.0:/Users/chenwenjie/.rvm/gems/ruby-3.0.0@global", "GOPATH": "/Users/chenwenjie/go", "NVM_BIN": "/Users/chenwenjie/.nvm/versions/node/v18.12.1/bin", "npm_config_user_agent": "npm/8.19.2 node/v18.12.1 darwin x64 workspaces/false", "VSCODE_GIT_ASKPASS_NODE": "/Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper (Plugin).app/Contents/MacOS/Code Helper (Plugin)", "GIT_ASKPASS": "/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass.sh", "SDKMAN_CANDIDATES_DIR": "/Users/chenwenjie/.sdkman/candidates", "ANDROID_NDK_HOME": "/Users/chenwenjie/Library/Android/sdk/ndk/25.2.9519653", "LC_TERMINAL": "iTerm2", "SECURITYSESSIONID": "186a6", "RUBY_VERSION": "ruby-3.0.0", "npm_node_execpath": "/Users/chenwenjie/.nvm/versions/node/v18.12.1/bin/node", "npm_config_prefix": "/Users/chenwenjie/.nvm/versions/node/v18.12.1", "COLORTERM": "truecolor", "_": "/Users/chenwenjie/test/paytoview/miniapp/node_modules/.bin/vite", "NODE_ENV": "production" }.IS_VITEST;
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  startAbortTimer(e) {
    return this.abortController = new AbortController(), setTimeout(() => this.abortController.abort(), cjs$3.toMiliseconds(e));
  }
}
var Tr = Object.defineProperty, Bt = Object.getOwnPropertySymbols, xr = Object.prototype.hasOwnProperty, Or = Object.prototype.propertyIsEnumerable, Vt = (r, e, t) => e in r ? Tr(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t, qt = (r, e) => {
  for (var t in e || (e = {}))
    xr.call(e, t) && Vt(r, t, e[t]);
  if (Bt)
    for (var t of Bt(e))
      Or.call(e, t) && Vt(r, t, e[t]);
  return r;
};
class ee extends n {
  constructor(e) {
    super(e), this.protocol = ue, this.version = We, this.name = X$1, this.events = new eventsExports.EventEmitter(), this.initialized = false, this.on = (i, s) => this.events.on(i, s), this.once = (i, s) => this.events.once(i, s), this.off = (i, s) => this.events.off(i, s), this.removeListener = (i, s) => this.events.removeListener(i, s), this.projectId = e == null ? void 0 : e.projectId, this.relayUrl = (e == null ? void 0 : e.relayUrl) || de$1, this.customStoragePrefix = e != null && e.customStoragePrefix ? `:${e.customStoragePrefix}` : "";
    const t = typeof (e == null ? void 0 : e.logger) < "u" && typeof (e == null ? void 0 : e.logger) != "string" ? e.logger : cjs$1.pino(cjs$1.getDefaultLoggerOptions({ level: (e == null ? void 0 : e.logger) || Xe.logger }));
    this.logger = cjs$1.generateChildLogger(t, this.name), this.heartbeat = new cjs$2.HeartBeat(), this.crypto = new _t(this, this.logger, e == null ? void 0 : e.keychain), this.history = new Mt(this, this.logger), this.expirer = new kt(this, this.logger), this.storage = e != null && e.storage ? e.storage : new h$1(qt(qt({}, Qe), e == null ? void 0 : e.storageOptions)), this.relayer = new zt({ core: this, logger: this.logger, relayUrl: this.relayUrl, projectId: this.projectId }), this.pairing = new $t(this, this.logger), this.verify = new Kt(this.projectId || "", this.logger);
  }
  static async init(e) {
    const t = new ee(e);
    await t.initialize();
    const i = await t.crypto.getClientId();
    return await t.storage.setItem(Dt, i), t;
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  async start() {
    this.initialized || await this.initialize();
  }
  async initialize() {
    this.logger.trace("Initialized");
    try {
      await this.crypto.init(), await this.history.init(), await this.expirer.init(), await this.relayer.init(), await this.heartbeat.init(), await this.pairing.init(), this.initialized = true, this.logger.info("Core Initialization Success");
    } catch (e) {
      throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`, e), this.logger.error(e.message), e;
    }
  }
}
const Ar = ee;
const X = "wc", F = 2, H = "client", G$1 = `${X}@${F}:${H}:`, M$1 = { name: H, logger: "error", controller: false, relayUrl: "wss://relay.walletconnect.com" }, W = "WALLETCONNECT_DEEPLINK_CHOICE", ne = "proposal", oe = "Proposal expired", ae = "session", A = cjs$3.SEVEN_DAYS, ce = "engine", V = { wc_sessionPropose: { req: { ttl: cjs$3.FIVE_MINUTES, prompt: true, tag: 1100 }, res: { ttl: cjs$3.FIVE_MINUTES, prompt: false, tag: 1101 } }, wc_sessionSettle: { req: { ttl: cjs$3.FIVE_MINUTES, prompt: false, tag: 1102 }, res: { ttl: cjs$3.FIVE_MINUTES, prompt: false, tag: 1103 } }, wc_sessionUpdate: { req: { ttl: cjs$3.ONE_DAY, prompt: false, tag: 1104 }, res: { ttl: cjs$3.ONE_DAY, prompt: false, tag: 1105 } }, wc_sessionExtend: { req: { ttl: cjs$3.ONE_DAY, prompt: false, tag: 1106 }, res: { ttl: cjs$3.ONE_DAY, prompt: false, tag: 1107 } }, wc_sessionRequest: { req: { ttl: cjs$3.FIVE_MINUTES, prompt: true, tag: 1108 }, res: { ttl: cjs$3.FIVE_MINUTES, prompt: false, tag: 1109 } }, wc_sessionEvent: { req: { ttl: cjs$3.FIVE_MINUTES, prompt: true, tag: 1110 }, res: { ttl: cjs$3.FIVE_MINUTES, prompt: false, tag: 1111 } }, wc_sessionDelete: { req: { ttl: cjs$3.ONE_DAY, prompt: false, tag: 1112 }, res: { ttl: cjs$3.ONE_DAY, prompt: false, tag: 1113 } }, wc_sessionPing: { req: { ttl: cjs$3.THIRTY_SECONDS, prompt: false, tag: 1114 }, res: { ttl: cjs$3.THIRTY_SECONDS, prompt: false, tag: 1115 } } }, U$1 = { min: cjs$3.FIVE_MINUTES, max: cjs$3.SEVEN_DAYS }, I = { idle: "IDLE", active: "ACTIVE" }, le = "request", pe = ["wc_sessionPropose", "wc_sessionRequest", "wc_authRequest"];
var ns = Object.defineProperty, os = Object.defineProperties, as = Object.getOwnPropertyDescriptors, he = Object.getOwnPropertySymbols, cs = Object.prototype.hasOwnProperty, ls = Object.prototype.propertyIsEnumerable, de = (m2, r, e) => r in m2 ? ns(m2, r, { enumerable: true, configurable: true, writable: true, value: e }) : m2[r] = e, g$1 = (m2, r) => {
  for (var e in r || (r = {}))
    cs.call(r, e) && de(m2, e, r[e]);
  if (he)
    for (var e of he(r))
      ls.call(r, e) && de(m2, e, r[e]);
  return m2;
}, b2 = (m2, r) => os(m2, as(r));
class ps extends S$1 {
  constructor(r) {
    super(r), this.name = ce, this.events = new $g(), this.initialized = false, this.ignoredPayloadTypes = [_$2], this.requestQueue = { state: I.idle, queue: [] }, this.sessionRequestQueue = { state: I.idle, queue: [] }, this.requestQueueDelay = cjs$3.ONE_SECOND, this.init = async () => {
      this.initialized || (await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.registerPairingEvents(), this.client.core.pairing.register({ methods: Object.keys(V) }), this.initialized = true, setTimeout(() => {
        this.sessionRequestQueue.queue = this.getPendingSessionRequests(), this.processSessionRequestQueue();
      }, cjs$3.toMiliseconds(this.requestQueueDelay)));
    }, this.connect = async (e) => {
      await this.isInitialized();
      const s = b2(g$1({}, e), { requiredNamespaces: e.requiredNamespaces || {}, optionalNamespaces: e.optionalNamespaces || {} });
      await this.isValidConnect(s);
      const { pairingTopic: t, requiredNamespaces: i, optionalNamespaces: n2, sessionProperties: o, relays: a2 } = s;
      let c2 = t, p3, d2 = false;
      if (c2 && (d2 = this.client.core.pairing.pairings.get(c2).active), !c2 || !d2) {
        const { topic: v2, uri: S3 } = await this.client.core.pairing.create();
        c2 = v2, p3 = S3;
      }
      const h3 = await this.client.core.crypto.generateKeyPair(), R2 = g$1({ requiredNamespaces: i, optionalNamespaces: n2, relays: a2 ?? [{ protocol: ot }], proposer: { publicKey: h3, metadata: this.client.metadata } }, o && { sessionProperties: o }), { reject: w2, resolve: T2, done: K3 } = st$1(cjs$3.FIVE_MINUTES, oe);
      if (this.events.once(ft$2("session_connect"), async ({ error: v2, session: S3 }) => {
        if (v2)
          w2(v2);
        else if (S3) {
          S3.self.publicKey = h3;
          const B2 = b2(g$1({}, S3), { requiredNamespaces: S3.requiredNamespaces, optionalNamespaces: S3.optionalNamespaces });
          await this.client.session.set(S3.topic, B2), await this.setExpiry(S3.topic, S3.expiry), c2 && await this.client.core.pairing.updateMetadata({ topic: c2, metadata: S3.peer.metadata }), T2(B2);
        }
      }), !c2) {
        const { message: v2 } = N$2("NO_MATCHING_KEY", `connect() pairing topic: ${c2}`);
        throw new Error(v2);
      }
      const L2 = await this.sendRequest({ topic: c2, method: "wc_sessionPropose", params: R2 }), ue2 = lt$1(cjs$3.FIVE_MINUTES);
      return await this.setProposal(L2, g$1({ id: L2, expiry: ue2 }, R2)), { uri: p3, approval: K3 };
    }, this.pair = async (e) => (await this.isInitialized(), await this.client.core.pairing.pair(e)), this.approve = async (e) => {
      await this.isInitialized(), await this.isValidApprove(e);
      const { id: s, relayProtocol: t, namespaces: i, sessionProperties: n2 } = e, o = this.client.proposal.get(s);
      let { pairingTopic: a2, proposer: c2, requiredNamespaces: p3, optionalNamespaces: d2 } = o;
      a2 = a2 || "", B$1(p3) || (p3 = At$1(i, "approve()"));
      const h3 = await this.client.core.crypto.generateKeyPair(), R2 = c2.publicKey, w2 = await this.client.core.crypto.generateSharedKey(h3, R2);
      a2 && s && (await this.client.core.pairing.updateMetadata({ topic: a2, metadata: c2.metadata }), await this.sendResult({ id: s, topic: a2, result: { relay: { protocol: t ?? "irn" }, responderPublicKey: h3 } }), await this.client.proposal.delete(s, U$2("USER_DISCONNECTED")), await this.client.core.pairing.activate({ topic: a2 }));
      const T2 = g$1({ relay: { protocol: t ?? "irn" }, namespaces: i, requiredNamespaces: p3, optionalNamespaces: d2, pairingTopic: a2, controller: { publicKey: h3, metadata: this.client.metadata }, expiry: lt$1(A) }, n2 && { sessionProperties: n2 });
      await this.client.core.relayer.subscribe(w2), await this.sendRequest({ topic: w2, method: "wc_sessionSettle", params: T2, throwOnFailedPublish: true });
      const K3 = b2(g$1({}, T2), { topic: w2, pairingTopic: a2, acknowledged: false, self: T2.controller, peer: { publicKey: c2.publicKey, metadata: c2.metadata }, controller: h3 });
      return await this.client.session.set(w2, K3), await this.setExpiry(w2, lt$1(A)), { topic: w2, acknowledged: () => new Promise((L2) => setTimeout(() => L2(this.client.session.get(w2)), 500)) };
    }, this.reject = async (e) => {
      await this.isInitialized(), await this.isValidReject(e);
      const { id: s, reason: t } = e, { pairingTopic: i } = this.client.proposal.get(s);
      i && (await this.sendError(s, i, t), await this.client.proposal.delete(s, U$2("USER_DISCONNECTED")));
    }, this.update = async (e) => {
      await this.isInitialized(), await this.isValidUpdate(e);
      const { topic: s, namespaces: t } = e, i = await this.sendRequest({ topic: s, method: "wc_sessionUpdate", params: { namespaces: t } }), { done: n2, resolve: o, reject: a2 } = st$1();
      return this.events.once(ft$2("session_update", i), ({ error: c2 }) => {
        c2 ? a2(c2) : o();
      }), await this.client.session.update(s, { namespaces: t }), { acknowledged: n2 };
    }, this.extend = async (e) => {
      await this.isInitialized(), await this.isValidExtend(e);
      const { topic: s } = e, t = await this.sendRequest({ topic: s, method: "wc_sessionExtend", params: {} }), { done: i, resolve: n2, reject: o } = st$1();
      return this.events.once(ft$2("session_extend", t), ({ error: a2 }) => {
        a2 ? o(a2) : n2();
      }), await this.setExpiry(s, lt$1(A)), { acknowledged: i };
    }, this.request = async (e) => {
      await this.isInitialized(), await this.isValidRequest(e);
      const { chainId: s, request: t, topic: i, expiry: n2 } = e, o = payloadId(), { done: a2, resolve: c2, reject: p3 } = st$1(n2, "Request expired. Please try again.");
      return this.events.once(ft$2("session_request", o), ({ error: d2, result: h3 }) => {
        d2 ? p3(d2) : c2(h3);
      }), await Promise.all([new Promise(async (d2) => {
        await this.sendRequest({ clientRpcId: o, topic: i, method: "wc_sessionRequest", params: { request: t, chainId: s }, expiry: n2, throwOnFailedPublish: true }).catch((h3) => p3(h3)), this.client.events.emit("session_request_sent", { topic: i, request: t, chainId: s, id: o }), d2();
      }), new Promise(async (d2) => {
        const h3 = await this.client.core.storage.getItem(W);
        pt$1({ id: o, topic: i, wcDeepLink: h3 }), d2();
      }), a2()]).then((d2) => d2[2]);
    }, this.respond = async (e) => {
      await this.isInitialized(), await this.isValidRespond(e);
      const { topic: s, response: t } = e, { id: i } = t;
      isJsonRpcResult(t) ? await this.sendResult({ id: i, topic: s, result: t.result, throwOnFailedPublish: true }) : isJsonRpcError(t) && await this.sendError(i, s, t.error), this.cleanupAfterResponse(e);
    }, this.ping = async (e) => {
      await this.isInitialized(), await this.isValidPing(e);
      const { topic: s } = e;
      if (this.client.session.keys.includes(s)) {
        const t = await this.sendRequest({ topic: s, method: "wc_sessionPing", params: {} }), { done: i, resolve: n2, reject: o } = st$1();
        this.events.once(ft$2("session_ping", t), ({ error: a2 }) => {
          a2 ? o(a2) : n2();
        }), await i();
      } else
        this.client.core.pairing.pairings.keys.includes(s) && await this.client.core.pairing.ping({ topic: s });
    }, this.emit = async (e) => {
      await this.isInitialized(), await this.isValidEmit(e);
      const { topic: s, event: t, chainId: i } = e;
      await this.sendRequest({ topic: s, method: "wc_sessionEvent", params: { event: t, chainId: i } });
    }, this.disconnect = async (e) => {
      await this.isInitialized(), await this.isValidDisconnect(e);
      const { topic: s } = e;
      this.client.session.keys.includes(s) ? (await this.sendRequest({ topic: s, method: "wc_sessionDelete", params: U$2("USER_DISCONNECTED"), throwOnFailedPublish: true }), await this.deleteSession(s)) : await this.client.core.pairing.disconnect({ topic: s });
    }, this.find = (e) => (this.isInitialized(), this.client.session.getAll().filter((s) => $t$1(s, e))), this.getPendingSessionRequests = () => (this.isInitialized(), this.client.pendingRequest.getAll()), this.cleanupDuplicatePairings = async (e) => {
      if (e.pairingTopic)
        try {
          const s = this.client.core.pairing.pairings.get(e.pairingTopic), t = this.client.core.pairing.pairings.getAll().filter((i) => {
            var n2, o;
            return ((n2 = i.peerMetadata) == null ? void 0 : n2.url) && ((o = i.peerMetadata) == null ? void 0 : o.url) === e.peer.metadata.url && i.topic && i.topic !== s.topic;
          });
          if (t.length === 0)
            return;
          this.client.logger.info(`Cleaning up ${t.length} duplicate pairing(s)`), await Promise.all(t.map((i) => this.client.core.pairing.disconnect({ topic: i.topic }))), this.client.logger.info("Duplicate pairings clean up finished");
        } catch (s) {
          this.client.logger.error(s);
        }
    }, this.deleteSession = async (e, s) => {
      const { self: t } = this.client.session.get(e);
      await this.client.core.relayer.unsubscribe(e), this.client.session.delete(e, U$2("USER_DISCONNECTED")), this.client.core.crypto.keychain.has(t.publicKey) && await this.client.core.crypto.deleteKeyPair(t.publicKey), this.client.core.crypto.keychain.has(e) && await this.client.core.crypto.deleteSymKey(e), s || this.client.core.expirer.del(e), this.client.core.storage.removeItem(W).catch((i) => this.client.logger.warn(i));
    }, this.deleteProposal = async (e, s) => {
      await Promise.all([this.client.proposal.delete(e, U$2("USER_DISCONNECTED")), s ? Promise.resolve() : this.client.core.expirer.del(e)]);
    }, this.deletePendingSessionRequest = async (e, s, t = false) => {
      await Promise.all([this.client.pendingRequest.delete(e, s), t ? Promise.resolve() : this.client.core.expirer.del(e)]), this.sessionRequestQueue.queue = this.sessionRequestQueue.queue.filter((i) => i.id !== e), t && (this.sessionRequestQueue.state = I.idle);
    }, this.setExpiry = async (e, s) => {
      this.client.session.keys.includes(e) && await this.client.session.update(e, { expiry: s }), this.client.core.expirer.set(e, s);
    }, this.setProposal = async (e, s) => {
      await this.client.proposal.set(e, s), this.client.core.expirer.set(e, s.expiry);
    }, this.setPendingSessionRequest = async (e) => {
      const s = V.wc_sessionRequest.req.ttl, { id: t, topic: i, params: n2, verifyContext: o } = e;
      await this.client.pendingRequest.set(t, { id: t, topic: i, params: n2, verifyContext: o }), s && this.client.core.expirer.set(t, lt$1(s));
    }, this.sendRequest = async (e) => {
      const { topic: s, method: t, params: i, expiry: n2, relayRpcId: o, clientRpcId: a2, throwOnFailedPublish: c2 } = e, p3 = formatJsonRpcRequest(t, i, a2);
      if (q$1() && pe.includes(t)) {
        const R2 = Mn(JSON.stringify(p3));
        this.client.core.verify.register({ attestationId: R2 });
      }
      const d2 = await this.client.core.crypto.encode(s, p3), h3 = V[t].req;
      return n2 && (h3.ttl = n2), o && (h3.id = o), this.client.core.history.set(s, p3), c2 ? (h3.internal = b2(g$1({}, h3.internal), { throwOnFailedPublish: true }), await this.client.core.relayer.publish(s, d2, h3)) : this.client.core.relayer.publish(s, d2, h3).catch((R2) => this.client.logger.error(R2)), p3.id;
    }, this.sendResult = async (e) => {
      const { id: s, topic: t, result: i, throwOnFailedPublish: n2 } = e, o = formatJsonRpcResult(s, i), a2 = await this.client.core.crypto.encode(t, o), c2 = await this.client.core.history.get(t, s), p3 = V[c2.request.method].res;
      n2 ? (p3.internal = b2(g$1({}, p3.internal), { throwOnFailedPublish: true }), await this.client.core.relayer.publish(t, a2, p3)) : this.client.core.relayer.publish(t, a2, p3).catch((d2) => this.client.logger.error(d2)), await this.client.core.history.resolve(o);
    }, this.sendError = async (e, s, t) => {
      const i = formatJsonRpcError(e, t), n2 = await this.client.core.crypto.encode(s, i), o = await this.client.core.history.get(s, e), a2 = V[o.request.method].res;
      this.client.core.relayer.publish(s, n2, a2), await this.client.core.history.resolve(i);
    }, this.cleanup = async () => {
      const e = [], s = [];
      this.client.session.getAll().forEach((t) => {
        dt$1(t.expiry) && e.push(t.topic);
      }), this.client.proposal.getAll().forEach((t) => {
        dt$1(t.expiry) && s.push(t.id);
      }), await Promise.all([...e.map((t) => this.deleteSession(t)), ...s.map((t) => this.deleteProposal(t))]);
    }, this.onRelayEventRequest = async (e) => {
      this.requestQueue.queue.push(e), await this.processRequestsQueue();
    }, this.processRequestsQueue = async () => {
      if (this.requestQueue.state === I.active) {
        this.client.logger.info("Request queue already active, skipping...");
        return;
      }
      for (this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`); this.requestQueue.queue.length > 0; ) {
        this.requestQueue.state = I.active;
        const e = this.requestQueue.queue.shift();
        if (e)
          try {
            this.processRequest(e), await new Promise((s) => setTimeout(s, 300));
          } catch (s) {
            this.client.logger.warn(s);
          }
      }
      this.requestQueue.state = I.idle;
    }, this.processRequest = (e) => {
      const { topic: s, payload: t } = e, i = t.method;
      switch (i) {
        case "wc_sessionPropose":
          return this.onSessionProposeRequest(s, t);
        case "wc_sessionSettle":
          return this.onSessionSettleRequest(s, t);
        case "wc_sessionUpdate":
          return this.onSessionUpdateRequest(s, t);
        case "wc_sessionExtend":
          return this.onSessionExtendRequest(s, t);
        case "wc_sessionPing":
          return this.onSessionPingRequest(s, t);
        case "wc_sessionDelete":
          return this.onSessionDeleteRequest(s, t);
        case "wc_sessionRequest":
          return this.onSessionRequest(s, t);
        case "wc_sessionEvent":
          return this.onSessionEventRequest(s, t);
        default:
          return this.client.logger.info(`Unsupported request method ${i}`);
      }
    }, this.onRelayEventResponse = async (e) => {
      const { topic: s, payload: t } = e, i = (await this.client.core.history.get(s, t.id)).request.method;
      switch (i) {
        case "wc_sessionPropose":
          return this.onSessionProposeResponse(s, t);
        case "wc_sessionSettle":
          return this.onSessionSettleResponse(s, t);
        case "wc_sessionUpdate":
          return this.onSessionUpdateResponse(s, t);
        case "wc_sessionExtend":
          return this.onSessionExtendResponse(s, t);
        case "wc_sessionPing":
          return this.onSessionPingResponse(s, t);
        case "wc_sessionRequest":
          return this.onSessionRequestResponse(s, t);
        default:
          return this.client.logger.info(`Unsupported response method ${i}`);
      }
    }, this.onRelayEventUnknownPayload = (e) => {
      const { topic: s } = e, { message: t } = N$2("MISSING_OR_INVALID", `Decoded payload on topic ${s} is not identifiable as a JSON-RPC request or a response.`);
      throw new Error(t);
    }, this.onSessionProposeRequest = async (e, s) => {
      const { params: t, id: i } = s;
      try {
        this.isValidConnect(g$1({}, s.params));
        const n2 = lt$1(cjs$3.FIVE_MINUTES), o = g$1({ id: i, pairingTopic: e, expiry: n2 }, t);
        await this.setProposal(i, o);
        const a2 = Mn(JSON.stringify(s)), c2 = await this.getVerifyContext(a2, o.proposer.metadata);
        this.client.events.emit("session_proposal", { id: i, params: o, verifyContext: c2 });
      } catch (n2) {
        await this.sendError(i, e, n2), this.client.logger.error(n2);
      }
    }, this.onSessionProposeResponse = async (e, s) => {
      const { id: t } = s;
      if (isJsonRpcResult(s)) {
        const { result: i } = s;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", result: i });
        const n2 = this.client.proposal.get(t);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", proposal: n2 });
        const o = n2.proposer.publicKey;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", selfPublicKey: o });
        const a2 = i.responderPublicKey;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", peerPublicKey: a2 });
        const c2 = await this.client.core.crypto.generateSharedKey(o, a2);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", sessionTopic: c2 });
        const p3 = await this.client.core.relayer.subscribe(c2);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", subscriptionId: p3 }), await this.client.core.pairing.activate({ topic: e });
      } else
        isJsonRpcError(s) && (await this.client.proposal.delete(t, U$2("USER_DISCONNECTED")), this.events.emit(ft$2("session_connect"), { error: s.error }));
    }, this.onSessionSettleRequest = async (e, s) => {
      const { id: t, params: i } = s;
      try {
        this.isValidSessionSettleRequest(i);
        const { relay: n2, controller: o, expiry: a2, namespaces: c2, requiredNamespaces: p3, optionalNamespaces: d2, sessionProperties: h3, pairingTopic: R2 } = s.params, w2 = g$1({ topic: e, relay: n2, expiry: a2, namespaces: c2, acknowledged: true, pairingTopic: R2, requiredNamespaces: p3, optionalNamespaces: d2, controller: o.publicKey, self: { publicKey: "", metadata: this.client.metadata }, peer: { publicKey: o.publicKey, metadata: o.metadata } }, h3 && { sessionProperties: h3 });
        await this.sendResult({ id: s.id, topic: e, result: true }), this.events.emit(ft$2("session_connect"), { session: w2 }), this.cleanupDuplicatePairings(w2);
      } catch (n2) {
        await this.sendError(t, e, n2), this.client.logger.error(n2);
      }
    }, this.onSessionSettleResponse = async (e, s) => {
      const { id: t } = s;
      isJsonRpcResult(s) ? (await this.client.session.update(e, { acknowledged: true }), this.events.emit(ft$2("session_approve", t), {})) : isJsonRpcError(s) && (await this.client.session.delete(e, U$2("USER_DISCONNECTED")), this.events.emit(ft$2("session_approve", t), { error: s.error }));
    }, this.onSessionUpdateRequest = async (e, s) => {
      const { params: t, id: i } = s;
      try {
        const n2 = `${e}_session_update`, o = er$1.get(n2);
        if (o && this.isRequestOutOfSync(o, i)) {
          this.client.logger.info(`Discarding out of sync request - ${i}`);
          return;
        }
        this.isValidUpdate(g$1({ topic: e }, t)), await this.client.session.update(e, { namespaces: t.namespaces }), await this.sendResult({ id: i, topic: e, result: true }), this.client.events.emit("session_update", { id: i, topic: e, params: t }), er$1.set(n2, i);
      } catch (n2) {
        await this.sendError(i, e, n2), this.client.logger.error(n2);
      }
    }, this.isRequestOutOfSync = (e, s) => parseInt(s.toString().slice(0, -3)) <= parseInt(e.toString().slice(0, -3)), this.onSessionUpdateResponse = (e, s) => {
      const { id: t } = s;
      isJsonRpcResult(s) ? this.events.emit(ft$2("session_update", t), {}) : isJsonRpcError(s) && this.events.emit(ft$2("session_update", t), { error: s.error });
    }, this.onSessionExtendRequest = async (e, s) => {
      const { id: t } = s;
      try {
        this.isValidExtend({ topic: e }), await this.setExpiry(e, lt$1(A)), await this.sendResult({ id: t, topic: e, result: true }), this.client.events.emit("session_extend", { id: t, topic: e });
      } catch (i) {
        await this.sendError(t, e, i), this.client.logger.error(i);
      }
    }, this.onSessionExtendResponse = (e, s) => {
      const { id: t } = s;
      isJsonRpcResult(s) ? this.events.emit(ft$2("session_extend", t), {}) : isJsonRpcError(s) && this.events.emit(ft$2("session_extend", t), { error: s.error });
    }, this.onSessionPingRequest = async (e, s) => {
      const { id: t } = s;
      try {
        this.isValidPing({ topic: e }), await this.sendResult({ id: t, topic: e, result: true }), this.client.events.emit("session_ping", { id: t, topic: e });
      } catch (i) {
        await this.sendError(t, e, i), this.client.logger.error(i);
      }
    }, this.onSessionPingResponse = (e, s) => {
      const { id: t } = s;
      setTimeout(() => {
        isJsonRpcResult(s) ? this.events.emit(ft$2("session_ping", t), {}) : isJsonRpcError(s) && this.events.emit(ft$2("session_ping", t), { error: s.error });
      }, 500);
    }, this.onSessionDeleteRequest = async (e, s) => {
      const { id: t } = s;
      try {
        this.isValidDisconnect({ topic: e, reason: s.params }), await Promise.all([new Promise((i) => {
          this.client.core.relayer.once(D$1.publish, async () => {
            i(await this.deleteSession(e));
          });
        }), this.sendResult({ id: t, topic: e, result: true })]), this.client.events.emit("session_delete", { id: t, topic: e });
      } catch (i) {
        this.client.logger.error(i);
      }
    }, this.onSessionRequest = async (e, s) => {
      const { id: t, params: i } = s;
      try {
        this.isValidRequest(g$1({ topic: e }, i));
        const n2 = Mn(JSON.stringify(formatJsonRpcRequest("wc_sessionRequest", i, t))), o = this.client.session.get(e), a2 = await this.getVerifyContext(n2, o.peer.metadata), c2 = { id: t, topic: e, params: i, verifyContext: a2 };
        await this.setPendingSessionRequest(c2), this.addSessionRequestToSessionRequestQueue(c2), this.processSessionRequestQueue();
      } catch (n2) {
        await this.sendError(t, e, n2), this.client.logger.error(n2);
      }
    }, this.onSessionRequestResponse = (e, s) => {
      const { id: t } = s;
      isJsonRpcResult(s) ? this.events.emit(ft$2("session_request", t), { result: s.result }) : isJsonRpcError(s) && this.events.emit(ft$2("session_request", t), { error: s.error });
    }, this.onSessionEventRequest = async (e, s) => {
      const { id: t, params: i } = s;
      try {
        const n2 = `${e}_session_event_${i.event.name}`, o = er$1.get(n2);
        if (o && this.isRequestOutOfSync(o, t)) {
          this.client.logger.info(`Discarding out of sync request - ${t}`);
          return;
        }
        this.isValidEmit(g$1({ topic: e }, i)), this.client.events.emit("session_event", { id: t, topic: e, params: i }), er$1.set(n2, t);
      } catch (n2) {
        await this.sendError(t, e, n2), this.client.logger.error(n2);
      }
    }, this.addSessionRequestToSessionRequestQueue = (e) => {
      this.sessionRequestQueue.queue.push(e);
    }, this.cleanupAfterResponse = (e) => {
      this.deletePendingSessionRequest(e.response.id, { message: "fulfilled", code: 0 }), setTimeout(() => {
        this.sessionRequestQueue.state = I.idle, this.processSessionRequestQueue();
      }, cjs$3.toMiliseconds(this.requestQueueDelay));
    }, this.processSessionRequestQueue = () => {
      if (this.sessionRequestQueue.state === I.active) {
        this.client.logger.info("session request queue is already active.");
        return;
      }
      const e = this.sessionRequestQueue.queue[0];
      if (!e) {
        this.client.logger.info("session request queue is empty.");
        return;
      }
      try {
        this.sessionRequestQueue.state = I.active, this.client.events.emit("session_request", e);
      } catch (s) {
        this.client.logger.error(s);
      }
    }, this.onPairingCreated = (e) => {
      if (e.active)
        return;
      const s = this.client.proposal.getAll().find((t) => t.pairingTopic === e.topic);
      s && this.onSessionProposeRequest(e.topic, formatJsonRpcRequest("wc_sessionPropose", { requiredNamespaces: s.requiredNamespaces, optionalNamespaces: s.optionalNamespaces, relays: s.relays, proposer: s.proposer }, s.id));
    }, this.isValidConnect = async (e) => {
      if (!xt$1(e)) {
        const { message: a2 } = N$2("MISSING_OR_INVALID", `connect() params: ${JSON.stringify(e)}`);
        throw new Error(a2);
      }
      const { pairingTopic: s, requiredNamespaces: t, optionalNamespaces: i, sessionProperties: n2, relays: o } = e;
      if (w$1(s) || await this.isValidPairingTopic(s), !Kt$1(o, true)) {
        const { message: a2 } = N$2("MISSING_OR_INVALID", `connect() relays: ${o}`);
        throw new Error(a2);
      }
      !w$1(t) && B$1(t) !== 0 && this.validateNamespaces(t, "requiredNamespaces"), !w$1(i) && B$1(i) !== 0 && this.validateNamespaces(i, "optionalNamespaces"), w$1(n2) || this.validateSessionProps(n2, "sessionProperties");
    }, this.validateNamespaces = (e, s) => {
      const t = Mt$1(e, "connect()", s);
      if (t)
        throw new Error(t.message);
    }, this.isValidApprove = async (e) => {
      if (!xt$1(e))
        throw new Error(N$2("MISSING_OR_INVALID", `approve() params: ${e}`).message);
      const { id: s, namespaces: t, relayProtocol: i, sessionProperties: n2 } = e;
      await this.isValidProposalId(s);
      const o = this.client.proposal.get(s), a2 = cn(t, "approve()");
      if (a2)
        throw new Error(a2.message);
      const c2 = un(o.requiredNamespaces, t, "approve()");
      if (c2)
        throw new Error(c2.message);
      if (!h$2(i, true)) {
        const { message: p3 } = N$2("MISSING_OR_INVALID", `approve() relayProtocol: ${i}`);
        throw new Error(p3);
      }
      w$1(n2) || this.validateSessionProps(n2, "sessionProperties");
    }, this.isValidReject = async (e) => {
      if (!xt$1(e)) {
        const { message: i } = N$2("MISSING_OR_INVALID", `reject() params: ${e}`);
        throw new Error(i);
      }
      const { id: s, reason: t } = e;
      if (await this.isValidProposalId(s), !Ft$1(t)) {
        const { message: i } = N$2("MISSING_OR_INVALID", `reject() reason: ${JSON.stringify(t)}`);
        throw new Error(i);
      }
    }, this.isValidSessionSettleRequest = (e) => {
      if (!xt$1(e)) {
        const { message: c2 } = N$2("MISSING_OR_INVALID", `onSessionSettleRequest() params: ${e}`);
        throw new Error(c2);
      }
      const { relay: s, controller: t, namespaces: i, expiry: n2 } = e;
      if (!an(s)) {
        const { message: c2 } = N$2("MISSING_OR_INVALID", "onSessionSettleRequest() relay protocol should be a string");
        throw new Error(c2);
      }
      const o = Vt$1(t, "onSessionSettleRequest()");
      if (o)
        throw new Error(o.message);
      const a2 = cn(i, "onSessionSettleRequest()");
      if (a2)
        throw new Error(a2.message);
      if (dt$1(n2)) {
        const { message: c2 } = N$2("EXPIRED", "onSessionSettleRequest()");
        throw new Error(c2);
      }
    }, this.isValidUpdate = async (e) => {
      if (!xt$1(e)) {
        const { message: a2 } = N$2("MISSING_OR_INVALID", `update() params: ${e}`);
        throw new Error(a2);
      }
      const { topic: s, namespaces: t } = e;
      await this.isValidSessionTopic(s);
      const i = this.client.session.get(s), n2 = cn(t, "update()");
      if (n2)
        throw new Error(n2.message);
      const o = un(i.requiredNamespaces, t, "update()");
      if (o)
        throw new Error(o.message);
    }, this.isValidExtend = async (e) => {
      if (!xt$1(e)) {
        const { message: t } = N$2("MISSING_OR_INVALID", `extend() params: ${e}`);
        throw new Error(t);
      }
      const { topic: s } = e;
      await this.isValidSessionTopic(s);
    }, this.isValidRequest = async (e) => {
      if (!xt$1(e)) {
        const { message: a2 } = N$2("MISSING_OR_INVALID", `request() params: ${e}`);
        throw new Error(a2);
      }
      const { topic: s, request: t, chainId: i, expiry: n2 } = e;
      await this.isValidSessionTopic(s);
      const { namespaces: o } = this.client.session.get(s);
      if (!Gt(o, i)) {
        const { message: a2 } = N$2("MISSING_OR_INVALID", `request() chainId: ${i}`);
        throw new Error(a2);
      }
      if (!Ht(t)) {
        const { message: a2 } = N$2("MISSING_OR_INVALID", `request() ${JSON.stringify(t)}`);
        throw new Error(a2);
      }
      if (!Wt(o, i, t.method)) {
        const { message: a2 } = N$2("MISSING_OR_INVALID", `request() method: ${t.method}`);
        throw new Error(a2);
      }
      if (n2 && !Qt(n2, U$1)) {
        const { message: a2 } = N$2("MISSING_OR_INVALID", `request() expiry: ${n2}. Expiry must be a number (in seconds) between ${U$1.min} and ${U$1.max}`);
        throw new Error(a2);
      }
    }, this.isValidRespond = async (e) => {
      if (!xt$1(e)) {
        const { message: i } = N$2("MISSING_OR_INVALID", `respond() params: ${e}`);
        throw new Error(i);
      }
      const { topic: s, response: t } = e;
      if (await this.isValidSessionTopic(s), !qt$1(t)) {
        const { message: i } = N$2("MISSING_OR_INVALID", `respond() response: ${JSON.stringify(t)}`);
        throw new Error(i);
      }
    }, this.isValidPing = async (e) => {
      if (!xt$1(e)) {
        const { message: t } = N$2("MISSING_OR_INVALID", `ping() params: ${e}`);
        throw new Error(t);
      }
      const { topic: s } = e;
      await this.isValidSessionOrPairingTopic(s);
    }, this.isValidEmit = async (e) => {
      if (!xt$1(e)) {
        const { message: o } = N$2("MISSING_OR_INVALID", `emit() params: ${e}`);
        throw new Error(o);
      }
      const { topic: s, event: t, chainId: i } = e;
      await this.isValidSessionTopic(s);
      const { namespaces: n2 } = this.client.session.get(s);
      if (!Gt(n2, i)) {
        const { message: o } = N$2("MISSING_OR_INVALID", `emit() chainId: ${i}`);
        throw new Error(o);
      }
      if (!Bt$1(t)) {
        const { message: o } = N$2("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(t)}`);
        throw new Error(o);
      }
      if (!zt$1(n2, i, t.name)) {
        const { message: o } = N$2("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(t)}`);
        throw new Error(o);
      }
    }, this.isValidDisconnect = async (e) => {
      if (!xt$1(e)) {
        const { message: t } = N$2("MISSING_OR_INVALID", `disconnect() params: ${e}`);
        throw new Error(t);
      }
      const { topic: s } = e;
      await this.isValidSessionOrPairingTopic(s);
    }, this.getVerifyContext = async (e, s) => {
      const t = { verified: { verifyUrl: s.verifyUrl || Z, validation: "UNKNOWN", origin: s.url || "" } };
      try {
        const i = await this.client.core.verify.resolve({ attestationId: e, verifyUrl: s.verifyUrl });
        i && (t.verified.origin = i.origin, t.verified.isScam = i.isScam, t.verified.validation = i.origin === new URL(s.url).origin ? "VALID" : "INVALID");
      } catch (i) {
        this.client.logger.info(i);
      }
      return this.client.logger.info(`Verify context: ${JSON.stringify(t)}`), t;
    }, this.validateSessionProps = (e, s) => {
      Object.values(e).forEach((t) => {
        if (!h$2(t, false)) {
          const { message: i } = N$2("MISSING_OR_INVALID", `${s} must be in Record<string, string> format. Received: ${JSON.stringify(t)}`);
          throw new Error(i);
        }
      });
    };
  }
  async isInitialized() {
    if (!this.initialized) {
      const { message: r } = N$2("NOT_INITIALIZED", this.name);
      throw new Error(r);
    }
    await this.client.core.relayer.confirmOnlineStateOrThrow();
  }
  registerRelayerEvents() {
    this.client.core.relayer.on(D$1.message, async (r) => {
      const { topic: e, message: s } = r;
      if (this.ignoredPayloadTypes.includes(this.client.core.crypto.getPayloadType(s)))
        return;
      const t = await this.client.core.crypto.decode(e, s);
      try {
        isJsonRpcRequest(t) ? (this.client.core.history.set(e, t), this.onRelayEventRequest({ topic: e, payload: t })) : isJsonRpcResponse(t) ? (await this.client.core.history.resolve(t), await this.onRelayEventResponse({ topic: e, payload: t }), this.client.core.history.delete(e, t.id)) : this.onRelayEventUnknownPayload({ topic: e, payload: t });
      } catch (i) {
        this.client.logger.error(i);
      }
    });
  }
  registerExpirerEvents() {
    this.client.core.expirer.on(v$1.expired, async (r) => {
      const { topic: e, id: s } = ut$1(r.target);
      if (s && this.client.pendingRequest.keys.includes(s))
        return await this.deletePendingSessionRequest(s, N$2("EXPIRED"), true);
      e ? this.client.session.keys.includes(e) && (await this.deleteSession(e, true), this.client.events.emit("session_expire", { topic: e })) : s && (await this.deleteProposal(s, true), this.client.events.emit("proposal_expire", { id: s }));
    });
  }
  registerPairingEvents() {
    this.client.core.pairing.events.on(B.create, (r) => this.onPairingCreated(r));
  }
  isValidPairingTopic(r) {
    if (!h$2(r, false)) {
      const { message: e } = N$2("MISSING_OR_INVALID", `pairing topic should be a string: ${r}`);
      throw new Error(e);
    }
    if (!this.client.core.pairing.pairings.keys.includes(r)) {
      const { message: e } = N$2("NO_MATCHING_KEY", `pairing topic doesn't exist: ${r}`);
      throw new Error(e);
    }
    if (dt$1(this.client.core.pairing.pairings.get(r).expiry)) {
      const { message: e } = N$2("EXPIRED", `pairing topic: ${r}`);
      throw new Error(e);
    }
  }
  async isValidSessionTopic(r) {
    if (!h$2(r, false)) {
      const { message: e } = N$2("MISSING_OR_INVALID", `session topic should be a string: ${r}`);
      throw new Error(e);
    }
    if (!this.client.session.keys.includes(r)) {
      const { message: e } = N$2("NO_MATCHING_KEY", `session topic doesn't exist: ${r}`);
      throw new Error(e);
    }
    if (dt$1(this.client.session.get(r).expiry)) {
      await this.deleteSession(r);
      const { message: e } = N$2("EXPIRED", `session topic: ${r}`);
      throw new Error(e);
    }
  }
  async isValidSessionOrPairingTopic(r) {
    if (this.client.session.keys.includes(r))
      await this.isValidSessionTopic(r);
    else if (this.client.core.pairing.pairings.keys.includes(r))
      this.isValidPairingTopic(r);
    else if (h$2(r, false)) {
      const { message: e } = N$2("NO_MATCHING_KEY", `session or pairing topic doesn't exist: ${r}`);
      throw new Error(e);
    } else {
      const { message: e } = N$2("MISSING_OR_INVALID", `session or pairing topic should be a string: ${r}`);
      throw new Error(e);
    }
  }
  async isValidProposalId(r) {
    if (!Lt$1(r)) {
      const { message: e } = N$2("MISSING_OR_INVALID", `proposal id should be a number: ${r}`);
      throw new Error(e);
    }
    if (!this.client.proposal.keys.includes(r)) {
      const { message: e } = N$2("NO_MATCHING_KEY", `proposal id doesn't exist: ${r}`);
      throw new Error(e);
    }
    if (dt$1(this.client.proposal.get(r).expiry)) {
      await this.deleteProposal(r);
      const { message: e } = N$2("EXPIRED", `proposal id: ${r}`);
      throw new Error(e);
    }
  }
}
class hs extends Ft {
  constructor(r, e) {
    super(r, e, ne, G$1), this.core = r, this.logger = e;
  }
}
class ds extends Ft {
  constructor(r, e) {
    super(r, e, ae, G$1), this.core = r, this.logger = e;
  }
}
class us extends Ft {
  constructor(r, e) {
    super(r, e, le, G$1, (s) => s.id), this.core = r, this.logger = e;
  }
}
let Q$1 = class Q extends b$1 {
  constructor(r) {
    super(r), this.protocol = X, this.version = F, this.name = M$1.name, this.events = new eventsExports.EventEmitter(), this.on = (s, t) => this.events.on(s, t), this.once = (s, t) => this.events.once(s, t), this.off = (s, t) => this.events.off(s, t), this.removeListener = (s, t) => this.events.removeListener(s, t), this.removeAllListeners = (s) => this.events.removeAllListeners(s), this.connect = async (s) => {
      try {
        return await this.engine.connect(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.pair = async (s) => {
      try {
        return await this.engine.pair(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.approve = async (s) => {
      try {
        return await this.engine.approve(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.reject = async (s) => {
      try {
        return await this.engine.reject(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.update = async (s) => {
      try {
        return await this.engine.update(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.extend = async (s) => {
      try {
        return await this.engine.extend(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.request = async (s) => {
      try {
        return await this.engine.request(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.respond = async (s) => {
      try {
        return await this.engine.respond(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.ping = async (s) => {
      try {
        return await this.engine.ping(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.emit = async (s) => {
      try {
        return await this.engine.emit(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.disconnect = async (s) => {
      try {
        return await this.engine.disconnect(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.find = (s) => {
      try {
        return this.engine.find(s);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.getPendingSessionRequests = () => {
      try {
        return this.engine.getPendingSessionRequests();
      } catch (s) {
        throw this.logger.error(s.message), s;
      }
    }, this.name = (r == null ? void 0 : r.name) || M$1.name, this.metadata = (r == null ? void 0 : r.metadata) || zn();
    const e = typeof (r == null ? void 0 : r.logger) < "u" && typeof (r == null ? void 0 : r.logger) != "string" ? r.logger : cjs$1.pino(cjs$1.getDefaultLoggerOptions({ level: (r == null ? void 0 : r.logger) || M$1.logger }));
    this.core = (r == null ? void 0 : r.core) || new Ar(r), this.logger = cjs$1.generateChildLogger(e, this.name), this.session = new ds(this.core, this.logger), this.proposal = new hs(this.core, this.logger), this.pendingRequest = new us(this.core, this.logger), this.engine = new ps(this);
  }
  static async init(r) {
    const e = new Q(r);
    return await e.initialize(), e;
  }
  get context() {
    return cjs$1.getLoggerContext(this.logger);
  }
  get pairing() {
    return this.core.pairing.pairings;
  }
  async initialize() {
    this.logger.trace("Initialized");
    try {
      await this.core.start(), await this.session.init(), await this.proposal.init(), await this.pendingRequest.init(), await this.engine.init(), this.core.verify.init({ verifyUrl: this.metadata.verifyUrl }), this.logger.info("SignClient Initialization Success");
    } catch (r) {
      throw this.logger.info("SignClient Initialization Failure"), this.logger.error(r.message), r;
    }
  }
};
var browserPonyfill = { exports: {} };
(function(module, exports) {
  var global2 = typeof self !== "undefined" ? self : commonjsGlobal;
  var __self__ = function() {
    function F2() {
      this.fetch = false;
      this.DOMException = global2.DOMException;
    }
    F2.prototype = global2;
    return new F2();
  }();
  (function(self2) {
    (function(exports2) {
      var support = {
        searchParams: "URLSearchParams" in self2,
        iterable: "Symbol" in self2 && "iterator" in Symbol,
        blob: "FileReader" in self2 && "Blob" in self2 && function() {
          try {
            new Blob();
            return true;
          } catch (e) {
            return false;
          }
        }(),
        formData: "FormData" in self2,
        arrayBuffer: "ArrayBuffer" in self2
      };
      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj);
      }
      if (support.arrayBuffer) {
        var viewClasses = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ];
        var isArrayBufferView = ArrayBuffer.isView || function(obj) {
          return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
        };
      }
      function normalizeName(name) {
        if (typeof name !== "string") {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
          throw new TypeError("Invalid character in header field name");
        }
        return name.toLowerCase();
      }
      function normalizeValue(value) {
        if (typeof value !== "string") {
          value = String(value);
        }
        return value;
      }
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return { done: value === void 0, value };
          }
        };
        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator;
          };
        }
        return iterator;
      }
      function Headers(headers) {
        this.map = {};
        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }
      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ", " + value : value;
      };
      Headers.prototype["delete"] = function(name) {
        delete this.map[normalizeName(name)];
      };
      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null;
      };
      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name));
      };
      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };
      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };
      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items);
      };
      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items);
      };
      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items);
      };
      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }
      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError("Already read"));
        }
        body.bodyUsed = true;
      }
      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        });
      }
      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise;
      }
      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise;
      }
      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);
        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join("");
      }
      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0);
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer;
        }
      }
      function Body() {
        this.bodyUsed = false;
        this._initBody = function(body) {
          this._bodyInit = body;
          if (!body) {
            this._bodyText = "";
          } else if (typeof body === "string") {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }
          if (!this.headers.get("content-type")) {
            if (typeof body === "string") {
              this.headers.set("content-type", "text/plain;charset=UTF-8");
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set("content-type", this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
            }
          }
        };
        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as blob");
            } else {
              return Promise.resolve(new Blob([this._bodyText]));
            }
          };
          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
            } else {
              return this.blob().then(readBlobAsArrayBuffer);
            }
          };
        }
        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected;
          }
          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob);
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
          } else if (this._bodyFormData) {
            throw new Error("could not read FormData body as text");
          } else {
            return Promise.resolve(this._bodyText);
          }
        };
        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode);
          };
        }
        this.json = function() {
          return this.text().then(JSON.parse);
        };
        return this;
      }
      var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method;
      }
      function Request(input, options) {
        options = options || {};
        var body = options.body;
        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError("Already read");
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }
        this.credentials = options.credentials || this.credentials || "same-origin";
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || "GET");
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;
        if ((this.method === "GET" || this.method === "HEAD") && body) {
          throw new TypeError("Body not allowed for GET or HEAD requests");
        }
        this._initBody(body);
      }
      Request.prototype.clone = function() {
        return new Request(this, { body: this._bodyInit });
      };
      function decode(body) {
        var form = new FormData();
        body.trim().split("&").forEach(function(bytes) {
          if (bytes) {
            var split = bytes.split("=");
            var name = split.shift().replace(/\+/g, " ");
            var value = split.join("=").replace(/\+/g, " ");
            form.append(decodeURIComponent(name), decodeURIComponent(value));
          }
        });
        return form;
      }
      function parseHeaders(rawHeaders) {
        var headers = new Headers();
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts = line.split(":");
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(":").trim();
            headers.append(key, value);
          }
        });
        return headers;
      }
      Body.call(Request.prototype);
      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }
        this.type = "default";
        this.status = options.status === void 0 ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = "statusText" in options ? options.statusText : "OK";
        this.headers = new Headers(options.headers);
        this.url = options.url || "";
        this._initBody(bodyInit);
      }
      Body.call(Response.prototype);
      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        });
      };
      Response.error = function() {
        var response = new Response(null, { status: 0, statusText: "" });
        response.type = "error";
        return response;
      };
      var redirectStatuses = [301, 302, 303, 307, 308];
      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError("Invalid status code");
        }
        return new Response(null, { status, headers: { location: url } });
      };
      exports2.DOMException = self2.DOMException;
      try {
        new exports2.DOMException();
      } catch (err) {
        exports2.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports2.DOMException.prototype = Object.create(Error.prototype);
        exports2.DOMException.prototype.constructor = exports2.DOMException;
      }
      function fetch2(input, init) {
        return new Promise(function(resolve, reject) {
          var request = new Request(input, init);
          if (request.signal && request.signal.aborted) {
            return reject(new exports2.DOMException("Aborted", "AbortError"));
          }
          var xhr = new XMLHttpRequest();
          function abortXhr() {
            xhr.abort();
          }
          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || "")
            };
            options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
            var body = "response" in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };
          xhr.onerror = function() {
            reject(new TypeError("Network request failed"));
          };
          xhr.ontimeout = function() {
            reject(new TypeError("Network request failed"));
          };
          xhr.onabort = function() {
            reject(new exports2.DOMException("Aborted", "AbortError"));
          };
          xhr.open(request.method, request.url, true);
          if (request.credentials === "include") {
            xhr.withCredentials = true;
          } else if (request.credentials === "omit") {
            xhr.withCredentials = false;
          }
          if ("responseType" in xhr && support.blob) {
            xhr.responseType = "blob";
          }
          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });
          if (request.signal) {
            request.signal.addEventListener("abort", abortXhr);
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                request.signal.removeEventListener("abort", abortXhr);
              }
            };
          }
          xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
        });
      }
      fetch2.polyfill = true;
      if (!self2.fetch) {
        self2.fetch = fetch2;
        self2.Headers = Headers;
        self2.Request = Request;
        self2.Response = Response;
      }
      exports2.Headers = Headers;
      exports2.Request = Request;
      exports2.Response = Response;
      exports2.fetch = fetch2;
      Object.defineProperty(exports2, "__esModule", { value: true });
      return exports2;
    })({});
  })(__self__);
  __self__.fetch.ponyfill = true;
  delete __self__.fetch.polyfill;
  var ctx = __self__;
  exports = ctx.fetch;
  exports.default = ctx.fetch;
  exports.fetch = ctx.fetch;
  exports.Headers = ctx.Headers;
  exports.Request = ctx.Request;
  exports.Response = ctx.Response;
  module.exports = exports;
})(browserPonyfill, browserPonyfill.exports);
var browserPonyfillExports = browserPonyfill.exports;
const fetch$1 = /* @__PURE__ */ getDefaultExportFromCjs(browserPonyfillExports);
const DEFAULT_HTTP_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json"
};
const DEFAULT_HTTP_METHOD = "POST";
const DEFAULT_FETCH_OPTS = {
  headers: DEFAULT_HTTP_HEADERS,
  method: DEFAULT_HTTP_METHOD
};
const EVENT_EMITTER_MAX_LISTENERS_DEFAULT = 10;
class HttpConnection {
  constructor(url, disableProviderPing = false) {
    this.url = url;
    this.disableProviderPing = disableProviderPing;
    this.events = new eventsExports.EventEmitter();
    this.isAvailable = false;
    this.registering = false;
    if (!isHttpUrl(url)) {
      throw new Error(`Provided URL is not compatible with HTTP connection: ${url}`);
    }
    this.url = url;
    this.disableProviderPing = disableProviderPing;
  }
  get connected() {
    return this.isAvailable;
  }
  get connecting() {
    return this.registering;
  }
  on(event, listener) {
    this.events.on(event, listener);
  }
  once(event, listener) {
    this.events.once(event, listener);
  }
  off(event, listener) {
    this.events.off(event, listener);
  }
  removeListener(event, listener) {
    this.events.removeListener(event, listener);
  }
  async open(url = this.url) {
    await this.register(url);
  }
  async close() {
    if (!this.isAvailable) {
      throw new Error("Connection already closed");
    }
    this.onClose();
  }
  async send(payload, context) {
    if (!this.isAvailable) {
      await this.register();
    }
    try {
      const body = safeJsonStringify(payload);
      const res = await fetch$1(this.url, Object.assign(Object.assign({}, DEFAULT_FETCH_OPTS), { body }));
      const data = await res.json();
      this.onPayload({ data });
    } catch (e) {
      this.onError(payload.id, e);
    }
  }
  async register(url = this.url) {
    if (!isHttpUrl(url)) {
      throw new Error(`Provided URL is not compatible with HTTP connection: ${url}`);
    }
    if (this.registering) {
      const currentMaxListeners = this.events.getMaxListeners();
      if (this.events.listenerCount("register_error") >= currentMaxListeners || this.events.listenerCount("open") >= currentMaxListeners) {
        this.events.setMaxListeners(currentMaxListeners + 1);
      }
      return new Promise((resolve, reject) => {
        this.events.once("register_error", (error) => {
          this.resetMaxListeners();
          reject(error);
        });
        this.events.once("open", () => {
          this.resetMaxListeners();
          if (typeof this.isAvailable === "undefined") {
            return reject(new Error("HTTP connection is missing or invalid"));
          }
          resolve();
        });
      });
    }
    this.url = url;
    this.registering = true;
    try {
      if (!this.disableProviderPing) {
        const body = safeJsonStringify({ id: 1, jsonrpc: "2.0", method: "test", params: [] });
        await fetch$1(url, Object.assign(Object.assign({}, DEFAULT_FETCH_OPTS), { body }));
      }
      this.onOpen();
    } catch (e) {
      const error = this.parseError(e);
      this.events.emit("register_error", error);
      this.onClose();
      throw error;
    }
  }
  onOpen() {
    this.isAvailable = true;
    this.registering = false;
    this.events.emit("open");
  }
  onClose() {
    this.isAvailable = false;
    this.registering = false;
    this.events.emit("close");
  }
  onPayload(e) {
    if (typeof e.data === "undefined")
      return;
    const payload = typeof e.data === "string" ? safeJsonParse(e.data) : e.data;
    this.events.emit("payload", payload);
  }
  onError(id, e) {
    const error = this.parseError(e);
    const message = error.message || error.toString();
    const payload = formatJsonRpcError(id, message);
    this.events.emit("payload", payload);
  }
  parseError(e, url = this.url) {
    return parseConnectionError(e, url, "HTTP");
  }
  resetMaxListeners() {
    if (this.events.getMaxListeners() > EVENT_EMITTER_MAX_LISTENERS_DEFAULT) {
      this.events.setMaxListeners(EVENT_EMITTER_MAX_LISTENERS_DEFAULT);
    }
  }
}
const Ia = "error", Ug = "wss://relay.walletconnect.com", Wg = "wc", Fg = "universal_provider", xa = `${Wg}@2:${Fg}:`, Mg = "https://rpc.walletconnect.com/v1/", Vn = { DEFAULT_CHAIN_CHANGED: "default_chain_changed" };
var ge = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ui = { exports: {} };
/**
* @license
* Lodash <https://lodash.com/>
* Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
* Released under MIT license <https://lodash.com/license>
* Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
* Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
*/
(function(C, u3) {
  (function() {
    var i, d2 = "4.17.21", w2 = 200, T2 = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", $2 = "Expected a function", En = "Invalid `variable` option passed into `_.template`", zt2 = "__lodash_hash_undefined__", pr = 500, It2 = "__lodash_placeholder__", Ln2 = 1, Fn2 = 2, xt2 = 4, Et2 = 1, ve2 = 2, vn = 1, ct2 = 2, qi2 = 4, Dn2 = 8, yt2 = 16, Hn = 32, St2 = 64, Mn2 = 128, Kt2 = 256, dr = 512, La = 30, Da = "...", Ha = 800, Na = 16, Bi2 = 1, $a = 2, Ua = 3, ht2 = 1 / 0, kn2 = 9007199254740991, Wa = 17976931348623157e292, _e = 0 / 0, Nn = 4294967295, Fa = Nn - 1, Ma = Nn >>> 1, qa = [["ary", Mn2], ["bind", vn], ["bindKey", ct2], ["curry", Dn2], ["curryRight", yt2], ["flip", dr], ["partial", Hn], ["partialRight", St2], ["rearg", Kt2]], Ot2 = "[object Arguments]", me = "[object Array]", Ba = "[object AsyncFunction]", Yt = "[object Boolean]", Zt2 = "[object Date]", Ga = "[object DOMException]", we = "[object Error]", Pe = "[object Function]", Gi2 = "[object GeneratorFunction]", yn = "[object Map]", Jt = "[object Number]", za = "[object Null]", qn = "[object Object]", zi = "[object Promise]", Ka = "[object Proxy]", Xt2 = "[object RegExp]", Sn = "[object Set]", Qt2 = "[object String]", Ae = "[object Symbol]", Ya = "[object Undefined]", Vt2 = "[object WeakMap]", Za = "[object WeakSet]", kt2 = "[object ArrayBuffer]", Rt2 = "[object DataView]", gr = "[object Float32Array]", vr2 = "[object Float64Array]", _r2 = "[object Int8Array]", mr2 = "[object Int16Array]", wr2 = "[object Int32Array]", Pr2 = "[object Uint8Array]", Ar2 = "[object Uint8ClampedArray]", Cr2 = "[object Uint16Array]", Ir2 = "[object Uint32Array]", Ja = /\b__p \+= '';/g, Xa = /\b(__p \+=) '' \+/g, Qa = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Ki2 = /&(?:amp|lt|gt|quot|#39);/g, Yi2 = /[&<>"']/g, Va = RegExp(Ki2.source), ka = RegExp(Yi2.source), ja = /<%-([\s\S]+?)%>/g, no = /<%([\s\S]+?)%>/g, Zi2 = /<%=([\s\S]+?)%>/g, to = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, eo = /^\w*$/, ro = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, xr2 = /[\\^$.*+?()[\]{}|]/g, io = RegExp(xr2.source), Er2 = /^\s+/, so = /\s/, uo = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, ao = /\{\n\/\* \[wrapped with (.+)\] \*/, oo = /,? & /, fo = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, co = /[()=,{}\[\]\/\s]/, ho = /\\(\\)?/g, lo = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Ji2 = /\w*$/, po = /^[-+]0x[0-9a-f]+$/i, go = /^0b[01]+$/i, vo = /^\[object .+?Constructor\]$/, _o = /^0o[0-7]+$/i, mo = /^(?:0|[1-9]\d*)$/, wo = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Ce = /($^)/, Po = /['\n\r\u2028\u2029\\]/g, Ie = "\\ud800-\\udfff", Ao = "\\u0300-\\u036f", Co = "\\ufe20-\\ufe2f", Io = "\\u20d0-\\u20ff", Xi2 = Ao + Co + Io, Qi2 = "\\u2700-\\u27bf", Vi2 = "a-z\\xdf-\\xf6\\xf8-\\xff", xo = "\\xac\\xb1\\xd7\\xf7", Eo = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", yo = "\\u2000-\\u206f", So = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", ki2 = "A-Z\\xc0-\\xd6\\xd8-\\xde", ji2 = "\\ufe0e\\ufe0f", ns2 = xo + Eo + yo + So, yr2 = "['’]", Oo = "[" + Ie + "]", ts2 = "[" + ns2 + "]", xe = "[" + Xi2 + "]", es2 = "\\d+", Ro = "[" + Qi2 + "]", rs2 = "[" + Vi2 + "]", is2 = "[^" + Ie + ns2 + es2 + Qi2 + Vi2 + ki2 + "]", Sr2 = "\\ud83c[\\udffb-\\udfff]", bo = "(?:" + xe + "|" + Sr2 + ")", ss2 = "[^" + Ie + "]", Or2 = "(?:\\ud83c[\\udde6-\\uddff]){2}", Rr2 = "[\\ud800-\\udbff][\\udc00-\\udfff]", bt2 = "[" + ki2 + "]", us2 = "\\u200d", as2 = "(?:" + rs2 + "|" + is2 + ")", To = "(?:" + bt2 + "|" + is2 + ")", os2 = "(?:" + yr2 + "(?:d|ll|m|re|s|t|ve))?", fs2 = "(?:" + yr2 + "(?:D|LL|M|RE|S|T|VE))?", cs2 = bo + "?", hs2 = "[" + ji2 + "]?", Lo = "(?:" + us2 + "(?:" + [ss2, Or2, Rr2].join("|") + ")" + hs2 + cs2 + ")*", Do = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", Ho = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", ls2 = hs2 + cs2 + Lo, No = "(?:" + [Ro, Or2, Rr2].join("|") + ")" + ls2, $o = "(?:" + [ss2 + xe + "?", xe, Or2, Rr2, Oo].join("|") + ")", Uo = RegExp(yr2, "g"), Wo = RegExp(xe, "g"), br2 = RegExp(Sr2 + "(?=" + Sr2 + ")|" + $o + ls2, "g"), Fo = RegExp([bt2 + "?" + rs2 + "+" + os2 + "(?=" + [ts2, bt2, "$"].join("|") + ")", To + "+" + fs2 + "(?=" + [ts2, bt2 + as2, "$"].join("|") + ")", bt2 + "?" + as2 + "+" + os2, bt2 + "+" + fs2, Ho, Do, es2, No].join("|"), "g"), Mo = RegExp("[" + us2 + Ie + Xi2 + ji2 + "]"), qo = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Bo = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"], Go = -1, B2 = {};
    B2[gr] = B2[vr2] = B2[_r2] = B2[mr2] = B2[wr2] = B2[Pr2] = B2[Ar2] = B2[Cr2] = B2[Ir2] = true, B2[Ot2] = B2[me] = B2[kt2] = B2[Yt] = B2[Rt2] = B2[Zt2] = B2[we] = B2[Pe] = B2[yn] = B2[Jt] = B2[qn] = B2[Xt2] = B2[Sn] = B2[Qt2] = B2[Vt2] = false;
    var q2 = {};
    q2[Ot2] = q2[me] = q2[kt2] = q2[Rt2] = q2[Yt] = q2[Zt2] = q2[gr] = q2[vr2] = q2[_r2] = q2[mr2] = q2[wr2] = q2[yn] = q2[Jt] = q2[qn] = q2[Xt2] = q2[Sn] = q2[Qt2] = q2[Ae] = q2[Pr2] = q2[Ar2] = q2[Cr2] = q2[Ir2] = true, q2[we] = q2[Pe] = q2[Vt2] = false;
    var zo = { À: "A", Á: "A", Â: "A", Ã: "A", Ä: "A", Å: "A", à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a", Ç: "C", ç: "c", Ð: "D", ð: "d", È: "E", É: "E", Ê: "E", Ë: "E", è: "e", é: "e", ê: "e", ë: "e", Ì: "I", Í: "I", Î: "I", Ï: "I", ì: "i", í: "i", î: "i", ï: "i", Ñ: "N", ñ: "n", Ò: "O", Ó: "O", Ô: "O", Õ: "O", Ö: "O", Ø: "O", ò: "o", ó: "o", ô: "o", õ: "o", ö: "o", ø: "o", Ù: "U", Ú: "U", Û: "U", Ü: "U", ù: "u", ú: "u", û: "u", ü: "u", Ý: "Y", ý: "y", ÿ: "y", Æ: "Ae", æ: "ae", Þ: "Th", þ: "th", ß: "ss", Ā: "A", Ă: "A", Ą: "A", ā: "a", ă: "a", ą: "a", Ć: "C", Ĉ: "C", Ċ: "C", Č: "C", ć: "c", ĉ: "c", ċ: "c", č: "c", Ď: "D", Đ: "D", ď: "d", đ: "d", Ē: "E", Ĕ: "E", Ė: "E", Ę: "E", Ě: "E", ē: "e", ĕ: "e", ė: "e", ę: "e", ě: "e", Ĝ: "G", Ğ: "G", Ġ: "G", Ģ: "G", ĝ: "g", ğ: "g", ġ: "g", ģ: "g", Ĥ: "H", Ħ: "H", ĥ: "h", ħ: "h", Ĩ: "I", Ī: "I", Ĭ: "I", Į: "I", İ: "I", ĩ: "i", ī: "i", ĭ: "i", į: "i", ı: "i", Ĵ: "J", ĵ: "j", Ķ: "K", ķ: "k", ĸ: "k", Ĺ: "L", Ļ: "L", Ľ: "L", Ŀ: "L", Ł: "L", ĺ: "l", ļ: "l", ľ: "l", ŀ: "l", ł: "l", Ń: "N", Ņ: "N", Ň: "N", Ŋ: "N", ń: "n", ņ: "n", ň: "n", ŋ: "n", Ō: "O", Ŏ: "O", Ő: "O", ō: "o", ŏ: "o", ő: "o", Ŕ: "R", Ŗ: "R", Ř: "R", ŕ: "r", ŗ: "r", ř: "r", Ś: "S", Ŝ: "S", Ş: "S", Š: "S", ś: "s", ŝ: "s", ş: "s", š: "s", Ţ: "T", Ť: "T", Ŧ: "T", ţ: "t", ť: "t", ŧ: "t", Ũ: "U", Ū: "U", Ŭ: "U", Ů: "U", Ű: "U", Ų: "U", ũ: "u", ū: "u", ŭ: "u", ů: "u", ű: "u", ų: "u", Ŵ: "W", ŵ: "w", Ŷ: "Y", ŷ: "y", Ÿ: "Y", Ź: "Z", Ż: "Z", Ž: "Z", ź: "z", ż: "z", ž: "z", Ĳ: "IJ", ĳ: "ij", Œ: "Oe", œ: "oe", ŉ: "'n", ſ: "s" }, Ko = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Yo = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }, Zo = { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" }, Jo = parseFloat, Xo = parseInt, ps2 = typeof ge == "object" && ge && ge.Object === Object && ge, Qo = typeof self == "object" && self && self.Object === Object && self, k2 = ps2 || Qo || Function("return this")(), Tr2 = u3 && !u3.nodeType && u3, lt2 = Tr2 && true && C && !C.nodeType && C, ds2 = lt2 && lt2.exports === Tr2, Lr = ds2 && ps2.process, _n = function() {
      try {
        var h3 = lt2 && lt2.require && lt2.require("util").types;
        return h3 || Lr && Lr.binding && Lr.binding("util");
      } catch {
      }
    }(), gs2 = _n && _n.isArrayBuffer, vs2 = _n && _n.isDate, _s2 = _n && _n.isMap, ms2 = _n && _n.isRegExp, ws2 = _n && _n.isSet, Ps2 = _n && _n.isTypedArray;
    function cn2(h3, g3, p3) {
      switch (p3.length) {
        case 0:
          return h3.call(g3);
        case 1:
          return h3.call(g3, p3[0]);
        case 2:
          return h3.call(g3, p3[0], p3[1]);
        case 3:
          return h3.call(g3, p3[0], p3[1], p3[2]);
      }
      return h3.apply(g3, p3);
    }
    function Vo(h3, g3, p3, A2) {
      for (var S3 = -1, U2 = h3 == null ? 0 : h3.length; ++S3 < U2; ) {
        var X2 = h3[S3];
        g3(A2, X2, p3(X2), h3);
      }
      return A2;
    }
    function mn(h3, g3) {
      for (var p3 = -1, A2 = h3 == null ? 0 : h3.length; ++p3 < A2 && g3(h3[p3], p3, h3) !== false; )
        ;
      return h3;
    }
    function ko(h3, g3) {
      for (var p3 = h3 == null ? 0 : h3.length; p3-- && g3(h3[p3], p3, h3) !== false; )
        ;
      return h3;
    }
    function As2(h3, g3) {
      for (var p3 = -1, A2 = h3 == null ? 0 : h3.length; ++p3 < A2; )
        if (!g3(h3[p3], p3, h3))
          return false;
      return true;
    }
    function jn2(h3, g3) {
      for (var p3 = -1, A2 = h3 == null ? 0 : h3.length, S3 = 0, U2 = []; ++p3 < A2; ) {
        var X2 = h3[p3];
        g3(X2, p3, h3) && (U2[S3++] = X2);
      }
      return U2;
    }
    function Ee(h3, g3) {
      var p3 = h3 == null ? 0 : h3.length;
      return !!p3 && Tt2(h3, g3, 0) > -1;
    }
    function Dr2(h3, g3, p3) {
      for (var A2 = -1, S3 = h3 == null ? 0 : h3.length; ++A2 < S3; )
        if (p3(g3, h3[A2]))
          return true;
      return false;
    }
    function G2(h3, g3) {
      for (var p3 = -1, A2 = h3 == null ? 0 : h3.length, S3 = Array(A2); ++p3 < A2; )
        S3[p3] = g3(h3[p3], p3, h3);
      return S3;
    }
    function nt2(h3, g3) {
      for (var p3 = -1, A2 = g3.length, S3 = h3.length; ++p3 < A2; )
        h3[S3 + p3] = g3[p3];
      return h3;
    }
    function Hr(h3, g3, p3, A2) {
      var S3 = -1, U2 = h3 == null ? 0 : h3.length;
      for (A2 && U2 && (p3 = h3[++S3]); ++S3 < U2; )
        p3 = g3(p3, h3[S3], S3, h3);
      return p3;
    }
    function jo(h3, g3, p3, A2) {
      var S3 = h3 == null ? 0 : h3.length;
      for (A2 && S3 && (p3 = h3[--S3]); S3--; )
        p3 = g3(p3, h3[S3], S3, h3);
      return p3;
    }
    function Nr(h3, g3) {
      for (var p3 = -1, A2 = h3 == null ? 0 : h3.length; ++p3 < A2; )
        if (g3(h3[p3], p3, h3))
          return true;
      return false;
    }
    var nf = $r("length");
    function tf(h3) {
      return h3.split("");
    }
    function ef(h3) {
      return h3.match(fo) || [];
    }
    function Cs2(h3, g3, p3) {
      var A2;
      return p3(h3, function(S3, U2, X2) {
        if (g3(S3, U2, X2))
          return A2 = U2, false;
      }), A2;
    }
    function ye(h3, g3, p3, A2) {
      for (var S3 = h3.length, U2 = p3 + (A2 ? 1 : -1); A2 ? U2-- : ++U2 < S3; )
        if (g3(h3[U2], U2, h3))
          return U2;
      return -1;
    }
    function Tt2(h3, g3, p3) {
      return g3 === g3 ? gf(h3, g3, p3) : ye(h3, Is2, p3);
    }
    function rf(h3, g3, p3, A2) {
      for (var S3 = p3 - 1, U2 = h3.length; ++S3 < U2; )
        if (A2(h3[S3], g3))
          return S3;
      return -1;
    }
    function Is2(h3) {
      return h3 !== h3;
    }
    function xs2(h3, g3) {
      var p3 = h3 == null ? 0 : h3.length;
      return p3 ? Wr(h3, g3) / p3 : _e;
    }
    function $r(h3) {
      return function(g3) {
        return g3 == null ? i : g3[h3];
      };
    }
    function Ur(h3) {
      return function(g3) {
        return h3 == null ? i : h3[g3];
      };
    }
    function Es2(h3, g3, p3, A2, S3) {
      return S3(h3, function(U2, X2, M2) {
        p3 = A2 ? (A2 = false, U2) : g3(p3, U2, X2, M2);
      }), p3;
    }
    function sf(h3, g3) {
      var p3 = h3.length;
      for (h3.sort(g3); p3--; )
        h3[p3] = h3[p3].value;
      return h3;
    }
    function Wr(h3, g3) {
      for (var p3, A2 = -1, S3 = h3.length; ++A2 < S3; ) {
        var U2 = g3(h3[A2]);
        U2 !== i && (p3 = p3 === i ? U2 : p3 + U2);
      }
      return p3;
    }
    function Fr(h3, g3) {
      for (var p3 = -1, A2 = Array(h3); ++p3 < h3; )
        A2[p3] = g3(p3);
      return A2;
    }
    function uf(h3, g3) {
      return G2(g3, function(p3) {
        return [p3, h3[p3]];
      });
    }
    function ys2(h3) {
      return h3 && h3.slice(0, bs2(h3) + 1).replace(Er2, "");
    }
    function hn(h3) {
      return function(g3) {
        return h3(g3);
      };
    }
    function Mr(h3, g3) {
      return G2(g3, function(p3) {
        return h3[p3];
      });
    }
    function jt2(h3, g3) {
      return h3.has(g3);
    }
    function Ss2(h3, g3) {
      for (var p3 = -1, A2 = h3.length; ++p3 < A2 && Tt2(g3, h3[p3], 0) > -1; )
        ;
      return p3;
    }
    function Os2(h3, g3) {
      for (var p3 = h3.length; p3-- && Tt2(g3, h3[p3], 0) > -1; )
        ;
      return p3;
    }
    function af(h3, g3) {
      for (var p3 = h3.length, A2 = 0; p3--; )
        h3[p3] === g3 && ++A2;
      return A2;
    }
    var of = Ur(zo), ff = Ur(Ko);
    function cf(h3) {
      return "\\" + Zo[h3];
    }
    function hf(h3, g3) {
      return h3 == null ? i : h3[g3];
    }
    function Lt2(h3) {
      return Mo.test(h3);
    }
    function lf(h3) {
      return qo.test(h3);
    }
    function pf(h3) {
      for (var g3, p3 = []; !(g3 = h3.next()).done; )
        p3.push(g3.value);
      return p3;
    }
    function qr(h3) {
      var g3 = -1, p3 = Array(h3.size);
      return h3.forEach(function(A2, S3) {
        p3[++g3] = [S3, A2];
      }), p3;
    }
    function Rs2(h3, g3) {
      return function(p3) {
        return h3(g3(p3));
      };
    }
    function tt2(h3, g3) {
      for (var p3 = -1, A2 = h3.length, S3 = 0, U2 = []; ++p3 < A2; ) {
        var X2 = h3[p3];
        (X2 === g3 || X2 === It2) && (h3[p3] = It2, U2[S3++] = p3);
      }
      return U2;
    }
    function Se(h3) {
      var g3 = -1, p3 = Array(h3.size);
      return h3.forEach(function(A2) {
        p3[++g3] = A2;
      }), p3;
    }
    function df(h3) {
      var g3 = -1, p3 = Array(h3.size);
      return h3.forEach(function(A2) {
        p3[++g3] = [A2, A2];
      }), p3;
    }
    function gf(h3, g3, p3) {
      for (var A2 = p3 - 1, S3 = h3.length; ++A2 < S3; )
        if (h3[A2] === g3)
          return A2;
      return -1;
    }
    function vf(h3, g3, p3) {
      for (var A2 = p3 + 1; A2--; )
        if (h3[A2] === g3)
          return A2;
      return A2;
    }
    function Dt2(h3) {
      return Lt2(h3) ? mf(h3) : nf(h3);
    }
    function On(h3) {
      return Lt2(h3) ? wf(h3) : tf(h3);
    }
    function bs2(h3) {
      for (var g3 = h3.length; g3-- && so.test(h3.charAt(g3)); )
        ;
      return g3;
    }
    var _f = Ur(Yo);
    function mf(h3) {
      for (var g3 = br2.lastIndex = 0; br2.test(h3); )
        ++g3;
      return g3;
    }
    function wf(h3) {
      return h3.match(br2) || [];
    }
    function Pf(h3) {
      return h3.match(Fo) || [];
    }
    var Af = function h3(g3) {
      g3 = g3 == null ? k2 : Ht2.defaults(k2.Object(), g3, Ht2.pick(k2, Bo));
      var p3 = g3.Array, A2 = g3.Date, S3 = g3.Error, U2 = g3.Function, X2 = g3.Math, M2 = g3.Object, Br = g3.RegExp, Cf = g3.String, wn = g3.TypeError, Oe = p3.prototype, If = U2.prototype, Nt2 = M2.prototype, Re2 = g3["__core-js_shared__"], be = If.toString, F2 = Nt2.hasOwnProperty, xf = 0, Ts2 = function() {
        var n2 = /[^.]+$/.exec(Re2 && Re2.keys && Re2.keys.IE_PROTO || "");
        return n2 ? "Symbol(src)_1." + n2 : "";
      }(), Te = Nt2.toString, Ef = be.call(M2), yf = k2._, Sf = Br("^" + be.call(F2).replace(xr2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), Le2 = ds2 ? g3.Buffer : i, et2 = g3.Symbol, De2 = g3.Uint8Array, Ls2 = Le2 ? Le2.allocUnsafe : i, He2 = Rs2(M2.getPrototypeOf, M2), Ds2 = M2.create, Hs2 = Nt2.propertyIsEnumerable, Ne2 = Oe.splice, Ns2 = et2 ? et2.isConcatSpreadable : i, ne2 = et2 ? et2.iterator : i, pt2 = et2 ? et2.toStringTag : i, $e2 = function() {
        try {
          var n2 = mt2(M2, "defineProperty");
          return n2({}, "", {}), n2;
        } catch {
        }
      }(), Of = g3.clearTimeout !== k2.clearTimeout && g3.clearTimeout, Rf = A2 && A2.now !== k2.Date.now && A2.now, bf = g3.setTimeout !== k2.setTimeout && g3.setTimeout, Ue2 = X2.ceil, We2 = X2.floor, Gr = M2.getOwnPropertySymbols, Tf = Le2 ? Le2.isBuffer : i, $s2 = g3.isFinite, Lf = Oe.join, Df = Rs2(M2.keys, M2), Q3 = X2.max, nn = X2.min, Hf = A2.now, Nf = g3.parseInt, Us2 = X2.random, $f = Oe.reverse, zr = mt2(g3, "DataView"), te2 = mt2(g3, "Map"), Kr = mt2(g3, "Promise"), $t2 = mt2(g3, "Set"), ee2 = mt2(g3, "WeakMap"), re = mt2(M2, "create"), Fe2 = ee2 && new ee2(), Ut2 = {}, Uf = wt2(zr), Wf = wt2(te2), Ff = wt2(Kr), Mf = wt2($t2), qf = wt2(ee2), Me2 = et2 ? et2.prototype : i, ie = Me2 ? Me2.valueOf : i, Ws2 = Me2 ? Me2.toString : i;
      function a2(n2) {
        if (Y(n2) && !O2(n2) && !(n2 instanceof H2)) {
          if (n2 instanceof Pn)
            return n2;
          if (F2.call(n2, "__wrapped__"))
            return Fu(n2);
        }
        return new Pn(n2);
      }
      var Wt2 = function() {
        function n2() {
        }
        return function(t) {
          if (!K3(t))
            return {};
          if (Ds2)
            return Ds2(t);
          n2.prototype = t;
          var e = new n2();
          return n2.prototype = i, e;
        };
      }();
      function qe2() {
      }
      function Pn(n2, t) {
        this.__wrapped__ = n2, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = i;
      }
      a2.templateSettings = { escape: ja, evaluate: no, interpolate: Zi2, variable: "", imports: { _: a2 } }, a2.prototype = qe2.prototype, a2.prototype.constructor = a2, Pn.prototype = Wt2(qe2.prototype), Pn.prototype.constructor = Pn;
      function H2(n2) {
        this.__wrapped__ = n2, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = Nn, this.__views__ = [];
      }
      function Bf() {
        var n2 = new H2(this.__wrapped__);
        return n2.__actions__ = un2(this.__actions__), n2.__dir__ = this.__dir__, n2.__filtered__ = this.__filtered__, n2.__iteratees__ = un2(this.__iteratees__), n2.__takeCount__ = this.__takeCount__, n2.__views__ = un2(this.__views__), n2;
      }
      function Gf() {
        if (this.__filtered__) {
          var n2 = new H2(this);
          n2.__dir__ = -1, n2.__filtered__ = true;
        } else
          n2 = this.clone(), n2.__dir__ *= -1;
        return n2;
      }
      function zf() {
        var n2 = this.__wrapped__.value(), t = this.__dir__, e = O2(n2), r = t < 0, s = e ? n2.length : 0, o = eh(0, s, this.__views__), f2 = o.start, c2 = o.end, l2 = c2 - f2, v2 = r ? c2 : f2 - 1, _3 = this.__iteratees__, m2 = _3.length, P2 = 0, I2 = nn(l2, this.__takeCount__);
        if (!e || !r && s == l2 && I2 == l2)
          return ou(n2, this.__actions__);
        var E3 = [];
        n:
          for (; l2-- && P2 < I2; ) {
            v2 += t;
            for (var b3 = -1, y3 = n2[v2]; ++b3 < m2; ) {
              var D2 = _3[b3], N2 = D2.iteratee, dn = D2.type, sn = N2(y3);
              if (dn == $a)
                y3 = sn;
              else if (!sn) {
                if (dn == Bi2)
                  continue n;
                break n;
              }
            }
            E3[P2++] = y3;
          }
        return E3;
      }
      H2.prototype = Wt2(qe2.prototype), H2.prototype.constructor = H2;
      function dt2(n2) {
        var t = -1, e = n2 == null ? 0 : n2.length;
        for (this.clear(); ++t < e; ) {
          var r = n2[t];
          this.set(r[0], r[1]);
        }
      }
      function Kf() {
        this.__data__ = re ? re(null) : {}, this.size = 0;
      }
      function Yf(n2) {
        var t = this.has(n2) && delete this.__data__[n2];
        return this.size -= t ? 1 : 0, t;
      }
      function Zf(n2) {
        var t = this.__data__;
        if (re) {
          var e = t[n2];
          return e === zt2 ? i : e;
        }
        return F2.call(t, n2) ? t[n2] : i;
      }
      function Jf(n2) {
        var t = this.__data__;
        return re ? t[n2] !== i : F2.call(t, n2);
      }
      function Xf(n2, t) {
        var e = this.__data__;
        return this.size += this.has(n2) ? 0 : 1, e[n2] = re && t === i ? zt2 : t, this;
      }
      dt2.prototype.clear = Kf, dt2.prototype.delete = Yf, dt2.prototype.get = Zf, dt2.prototype.has = Jf, dt2.prototype.set = Xf;
      function Bn(n2) {
        var t = -1, e = n2 == null ? 0 : n2.length;
        for (this.clear(); ++t < e; ) {
          var r = n2[t];
          this.set(r[0], r[1]);
        }
      }
      function Qf() {
        this.__data__ = [], this.size = 0;
      }
      function Vf(n2) {
        var t = this.__data__, e = Be2(t, n2);
        if (e < 0)
          return false;
        var r = t.length - 1;
        return e == r ? t.pop() : Ne2.call(t, e, 1), --this.size, true;
      }
      function kf(n2) {
        var t = this.__data__, e = Be2(t, n2);
        return e < 0 ? i : t[e][1];
      }
      function jf(n2) {
        return Be2(this.__data__, n2) > -1;
      }
      function nc(n2, t) {
        var e = this.__data__, r = Be2(e, n2);
        return r < 0 ? (++this.size, e.push([n2, t])) : e[r][1] = t, this;
      }
      Bn.prototype.clear = Qf, Bn.prototype.delete = Vf, Bn.prototype.get = kf, Bn.prototype.has = jf, Bn.prototype.set = nc;
      function Gn(n2) {
        var t = -1, e = n2 == null ? 0 : n2.length;
        for (this.clear(); ++t < e; ) {
          var r = n2[t];
          this.set(r[0], r[1]);
        }
      }
      function tc() {
        this.size = 0, this.__data__ = { hash: new dt2(), map: new (te2 || Bn)(), string: new dt2() };
      }
      function ec(n2) {
        var t = nr2(this, n2).delete(n2);
        return this.size -= t ? 1 : 0, t;
      }
      function rc(n2) {
        return nr2(this, n2).get(n2);
      }
      function ic(n2) {
        return nr2(this, n2).has(n2);
      }
      function sc(n2, t) {
        var e = nr2(this, n2), r = e.size;
        return e.set(n2, t), this.size += e.size == r ? 0 : 1, this;
      }
      Gn.prototype.clear = tc, Gn.prototype.delete = ec, Gn.prototype.get = rc, Gn.prototype.has = ic, Gn.prototype.set = sc;
      function gt2(n2) {
        var t = -1, e = n2 == null ? 0 : n2.length;
        for (this.__data__ = new Gn(); ++t < e; )
          this.add(n2[t]);
      }
      function uc(n2) {
        return this.__data__.set(n2, zt2), this;
      }
      function ac(n2) {
        return this.__data__.has(n2);
      }
      gt2.prototype.add = gt2.prototype.push = uc, gt2.prototype.has = ac;
      function Rn2(n2) {
        var t = this.__data__ = new Bn(n2);
        this.size = t.size;
      }
      function oc() {
        this.__data__ = new Bn(), this.size = 0;
      }
      function fc(n2) {
        var t = this.__data__, e = t.delete(n2);
        return this.size = t.size, e;
      }
      function cc(n2) {
        return this.__data__.get(n2);
      }
      function hc(n2) {
        return this.__data__.has(n2);
      }
      function lc(n2, t) {
        var e = this.__data__;
        if (e instanceof Bn) {
          var r = e.__data__;
          if (!te2 || r.length < w2 - 1)
            return r.push([n2, t]), this.size = ++e.size, this;
          e = this.__data__ = new Gn(r);
        }
        return e.set(n2, t), this.size = e.size, this;
      }
      Rn2.prototype.clear = oc, Rn2.prototype.delete = fc, Rn2.prototype.get = cc, Rn2.prototype.has = hc, Rn2.prototype.set = lc;
      function Fs2(n2, t) {
        var e = O2(n2), r = !e && Pt2(n2), s = !e && !r && at2(n2), o = !e && !r && !s && Bt2(n2), f2 = e || r || s || o, c2 = f2 ? Fr(n2.length, Cf) : [], l2 = c2.length;
        for (var v2 in n2)
          (t || F2.call(n2, v2)) && !(f2 && (v2 == "length" || s && (v2 == "offset" || v2 == "parent") || o && (v2 == "buffer" || v2 == "byteLength" || v2 == "byteOffset") || Zn(v2, l2))) && c2.push(v2);
        return c2;
      }
      function Ms2(n2) {
        var t = n2.length;
        return t ? n2[ei(0, t - 1)] : i;
      }
      function pc(n2, t) {
        return tr2(un2(n2), vt2(t, 0, n2.length));
      }
      function dc(n2) {
        return tr2(un2(n2));
      }
      function Yr(n2, t, e) {
        (e !== i && !bn(n2[t], e) || e === i && !(t in n2)) && zn2(n2, t, e);
      }
      function se(n2, t, e) {
        var r = n2[t];
        (!(F2.call(n2, t) && bn(r, e)) || e === i && !(t in n2)) && zn2(n2, t, e);
      }
      function Be2(n2, t) {
        for (var e = n2.length; e--; )
          if (bn(n2[e][0], t))
            return e;
        return -1;
      }
      function gc(n2, t, e, r) {
        return rt2(n2, function(s, o, f2) {
          t(r, s, e(s), f2);
        }), r;
      }
      function qs2(n2, t) {
        return n2 && Un(t, V2(t), n2);
      }
      function vc(n2, t) {
        return n2 && Un(t, on(t), n2);
      }
      function zn2(n2, t, e) {
        t == "__proto__" && $e2 ? $e2(n2, t, { configurable: true, enumerable: true, value: e, writable: true }) : n2[t] = e;
      }
      function Zr(n2, t) {
        for (var e = -1, r = t.length, s = p3(r), o = n2 == null; ++e < r; )
          s[e] = o ? i : Si(n2, t[e]);
        return s;
      }
      function vt2(n2, t, e) {
        return n2 === n2 && (e !== i && (n2 = n2 <= e ? n2 : e), t !== i && (n2 = n2 >= t ? n2 : t)), n2;
      }
      function An(n2, t, e, r, s, o) {
        var f2, c2 = t & Ln2, l2 = t & Fn2, v2 = t & xt2;
        if (e && (f2 = s ? e(n2, r, s, o) : e(n2)), f2 !== i)
          return f2;
        if (!K3(n2))
          return n2;
        var _3 = O2(n2);
        if (_3) {
          if (f2 = ih(n2), !c2)
            return un2(n2, f2);
        } else {
          var m2 = tn(n2), P2 = m2 == Pe || m2 == Gi2;
          if (at2(n2))
            return hu(n2, c2);
          if (m2 == qn || m2 == Ot2 || P2 && !s) {
            if (f2 = l2 || P2 ? {} : bu(n2), !c2)
              return l2 ? Zc(n2, vc(f2, n2)) : Yc(n2, qs2(f2, n2));
          } else {
            if (!q2[m2])
              return s ? n2 : {};
            f2 = sh(n2, m2, c2);
          }
        }
        o || (o = new Rn2());
        var I2 = o.get(n2);
        if (I2)
          return I2;
        o.set(n2, f2), sa(n2) ? n2.forEach(function(y3) {
          f2.add(An(y3, t, e, y3, n2, o));
        }) : ra(n2) && n2.forEach(function(y3, D2) {
          f2.set(D2, An(y3, t, e, D2, n2, o));
        });
        var E3 = v2 ? l2 ? pi : li : l2 ? on : V2, b3 = _3 ? i : E3(n2);
        return mn(b3 || n2, function(y3, D2) {
          b3 && (D2 = y3, y3 = n2[D2]), se(f2, D2, An(y3, t, e, D2, n2, o));
        }), f2;
      }
      function _c(n2) {
        var t = V2(n2);
        return function(e) {
          return Bs2(e, n2, t);
        };
      }
      function Bs2(n2, t, e) {
        var r = e.length;
        if (n2 == null)
          return !r;
        for (n2 = M2(n2); r--; ) {
          var s = e[r], o = t[s], f2 = n2[s];
          if (f2 === i && !(s in n2) || !o(f2))
            return false;
        }
        return true;
      }
      function Gs2(n2, t, e) {
        if (typeof n2 != "function")
          throw new wn($2);
        return le2(function() {
          n2.apply(i, e);
        }, t);
      }
      function ue2(n2, t, e, r) {
        var s = -1, o = Ee, f2 = true, c2 = n2.length, l2 = [], v2 = t.length;
        if (!c2)
          return l2;
        e && (t = G2(t, hn(e))), r ? (o = Dr2, f2 = false) : t.length >= w2 && (o = jt2, f2 = false, t = new gt2(t));
        n:
          for (; ++s < c2; ) {
            var _3 = n2[s], m2 = e == null ? _3 : e(_3);
            if (_3 = r || _3 !== 0 ? _3 : 0, f2 && m2 === m2) {
              for (var P2 = v2; P2--; )
                if (t[P2] === m2)
                  continue n;
              l2.push(_3);
            } else
              o(t, m2, r) || l2.push(_3);
          }
        return l2;
      }
      var rt2 = vu($n), zs2 = vu(Xr, true);
      function mc(n2, t) {
        var e = true;
        return rt2(n2, function(r, s, o) {
          return e = !!t(r, s, o), e;
        }), e;
      }
      function Ge2(n2, t, e) {
        for (var r = -1, s = n2.length; ++r < s; ) {
          var o = n2[r], f2 = t(o);
          if (f2 != null && (c2 === i ? f2 === f2 && !pn(f2) : e(f2, c2)))
            var c2 = f2, l2 = o;
        }
        return l2;
      }
      function wc(n2, t, e, r) {
        var s = n2.length;
        for (e = R2(e), e < 0 && (e = -e > s ? 0 : s + e), r = r === i || r > s ? s : R2(r), r < 0 && (r += s), r = e > r ? 0 : aa(r); e < r; )
          n2[e++] = t;
        return n2;
      }
      function Ks2(n2, t) {
        var e = [];
        return rt2(n2, function(r, s, o) {
          t(r, s, o) && e.push(r);
        }), e;
      }
      function j2(n2, t, e, r, s) {
        var o = -1, f2 = n2.length;
        for (e || (e = ah), s || (s = []); ++o < f2; ) {
          var c2 = n2[o];
          t > 0 && e(c2) ? t > 1 ? j2(c2, t - 1, e, r, s) : nt2(s, c2) : r || (s[s.length] = c2);
        }
        return s;
      }
      var Jr = _u(), Ys2 = _u(true);
      function $n(n2, t) {
        return n2 && Jr(n2, t, V2);
      }
      function Xr(n2, t) {
        return n2 && Ys2(n2, t, V2);
      }
      function ze2(n2, t) {
        return jn2(t, function(e) {
          return Jn2(n2[e]);
        });
      }
      function _t2(n2, t) {
        t = st2(t, n2);
        for (var e = 0, r = t.length; n2 != null && e < r; )
          n2 = n2[Wn(t[e++])];
        return e && e == r ? n2 : i;
      }
      function Zs2(n2, t, e) {
        var r = t(n2);
        return O2(n2) ? r : nt2(r, e(n2));
      }
      function en(n2) {
        return n2 == null ? n2 === i ? Ya : za : pt2 && pt2 in M2(n2) ? th(n2) : dh(n2);
      }
      function Qr(n2, t) {
        return n2 > t;
      }
      function Pc(n2, t) {
        return n2 != null && F2.call(n2, t);
      }
      function Ac(n2, t) {
        return n2 != null && t in M2(n2);
      }
      function Cc(n2, t, e) {
        return n2 >= nn(t, e) && n2 < Q3(t, e);
      }
      function Vr(n2, t, e) {
        for (var r = e ? Dr2 : Ee, s = n2[0].length, o = n2.length, f2 = o, c2 = p3(o), l2 = 1 / 0, v2 = []; f2--; ) {
          var _3 = n2[f2];
          f2 && t && (_3 = G2(_3, hn(t))), l2 = nn(_3.length, l2), c2[f2] = !e && (t || s >= 120 && _3.length >= 120) ? new gt2(f2 && _3) : i;
        }
        _3 = n2[0];
        var m2 = -1, P2 = c2[0];
        n:
          for (; ++m2 < s && v2.length < l2; ) {
            var I2 = _3[m2], E3 = t ? t(I2) : I2;
            if (I2 = e || I2 !== 0 ? I2 : 0, !(P2 ? jt2(P2, E3) : r(v2, E3, e))) {
              for (f2 = o; --f2; ) {
                var b3 = c2[f2];
                if (!(b3 ? jt2(b3, E3) : r(n2[f2], E3, e)))
                  continue n;
              }
              P2 && P2.push(E3), v2.push(I2);
            }
          }
        return v2;
      }
      function Ic(n2, t, e, r) {
        return $n(n2, function(s, o, f2) {
          t(r, e(s), o, f2);
        }), r;
      }
      function ae2(n2, t, e) {
        t = st2(t, n2), n2 = Hu(n2, t);
        var r = n2 == null ? n2 : n2[Wn(In(t))];
        return r == null ? i : cn2(r, n2, e);
      }
      function Js2(n2) {
        return Y(n2) && en(n2) == Ot2;
      }
      function xc(n2) {
        return Y(n2) && en(n2) == kt2;
      }
      function Ec(n2) {
        return Y(n2) && en(n2) == Zt2;
      }
      function oe2(n2, t, e, r, s) {
        return n2 === t ? true : n2 == null || t == null || !Y(n2) && !Y(t) ? n2 !== n2 && t !== t : yc(n2, t, e, r, oe2, s);
      }
      function yc(n2, t, e, r, s, o) {
        var f2 = O2(n2), c2 = O2(t), l2 = f2 ? me : tn(n2), v2 = c2 ? me : tn(t);
        l2 = l2 == Ot2 ? qn : l2, v2 = v2 == Ot2 ? qn : v2;
        var _3 = l2 == qn, m2 = v2 == qn, P2 = l2 == v2;
        if (P2 && at2(n2)) {
          if (!at2(t))
            return false;
          f2 = true, _3 = false;
        }
        if (P2 && !_3)
          return o || (o = new Rn2()), f2 || Bt2(n2) ? Su(n2, t, e, r, s, o) : jc(n2, t, l2, e, r, s, o);
        if (!(e & Et2)) {
          var I2 = _3 && F2.call(n2, "__wrapped__"), E3 = m2 && F2.call(t, "__wrapped__");
          if (I2 || E3) {
            var b3 = I2 ? n2.value() : n2, y3 = E3 ? t.value() : t;
            return o || (o = new Rn2()), s(b3, y3, e, r, o);
          }
        }
        return P2 ? (o || (o = new Rn2()), nh(n2, t, e, r, s, o)) : false;
      }
      function Sc(n2) {
        return Y(n2) && tn(n2) == yn;
      }
      function kr(n2, t, e, r) {
        var s = e.length, o = s, f2 = !r;
        if (n2 == null)
          return !o;
        for (n2 = M2(n2); s--; ) {
          var c2 = e[s];
          if (f2 && c2[2] ? c2[1] !== n2[c2[0]] : !(c2[0] in n2))
            return false;
        }
        for (; ++s < o; ) {
          c2 = e[s];
          var l2 = c2[0], v2 = n2[l2], _3 = c2[1];
          if (f2 && c2[2]) {
            if (v2 === i && !(l2 in n2))
              return false;
          } else {
            var m2 = new Rn2();
            if (r)
              var P2 = r(v2, _3, l2, n2, t, m2);
            if (!(P2 === i ? oe2(_3, v2, Et2 | ve2, r, m2) : P2))
              return false;
          }
        }
        return true;
      }
      function Xs2(n2) {
        if (!K3(n2) || fh(n2))
          return false;
        var t = Jn2(n2) ? Sf : vo;
        return t.test(wt2(n2));
      }
      function Oc(n2) {
        return Y(n2) && en(n2) == Xt2;
      }
      function Rc(n2) {
        return Y(n2) && tn(n2) == Sn;
      }
      function bc(n2) {
        return Y(n2) && ar2(n2.length) && !!B2[en(n2)];
      }
      function Qs2(n2) {
        return typeof n2 == "function" ? n2 : n2 == null ? fn : typeof n2 == "object" ? O2(n2) ? js2(n2[0], n2[1]) : ks2(n2) : ma(n2);
      }
      function jr(n2) {
        if (!he2(n2))
          return Df(n2);
        var t = [];
        for (var e in M2(n2))
          F2.call(n2, e) && e != "constructor" && t.push(e);
        return t;
      }
      function Tc(n2) {
        if (!K3(n2))
          return ph(n2);
        var t = he2(n2), e = [];
        for (var r in n2)
          r == "constructor" && (t || !F2.call(n2, r)) || e.push(r);
        return e;
      }
      function ni(n2, t) {
        return n2 < t;
      }
      function Vs2(n2, t) {
        var e = -1, r = an2(n2) ? p3(n2.length) : [];
        return rt2(n2, function(s, o, f2) {
          r[++e] = t(s, o, f2);
        }), r;
      }
      function ks2(n2) {
        var t = gi(n2);
        return t.length == 1 && t[0][2] ? Lu(t[0][0], t[0][1]) : function(e) {
          return e === n2 || kr(e, n2, t);
        };
      }
      function js2(n2, t) {
        return _i(n2) && Tu(t) ? Lu(Wn(n2), t) : function(e) {
          var r = Si(e, n2);
          return r === i && r === t ? Oi(e, n2) : oe2(t, r, Et2 | ve2);
        };
      }
      function Ke2(n2, t, e, r, s) {
        n2 !== t && Jr(t, function(o, f2) {
          if (s || (s = new Rn2()), K3(o))
            Lc(n2, t, f2, e, Ke2, r, s);
          else {
            var c2 = r ? r(wi(n2, f2), o, f2 + "", n2, t, s) : i;
            c2 === i && (c2 = o), Yr(n2, f2, c2);
          }
        }, on);
      }
      function Lc(n2, t, e, r, s, o, f2) {
        var c2 = wi(n2, e), l2 = wi(t, e), v2 = f2.get(l2);
        if (v2) {
          Yr(n2, e, v2);
          return;
        }
        var _3 = o ? o(c2, l2, e + "", n2, t, f2) : i, m2 = _3 === i;
        if (m2) {
          var P2 = O2(l2), I2 = !P2 && at2(l2), E3 = !P2 && !I2 && Bt2(l2);
          _3 = l2, P2 || I2 || E3 ? O2(c2) ? _3 = c2 : Z2(c2) ? _3 = un2(c2) : I2 ? (m2 = false, _3 = hu(l2, true)) : E3 ? (m2 = false, _3 = lu(l2, true)) : _3 = [] : pe2(l2) || Pt2(l2) ? (_3 = c2, Pt2(c2) ? _3 = oa(c2) : (!K3(c2) || Jn2(c2)) && (_3 = bu(l2))) : m2 = false;
        }
        m2 && (f2.set(l2, _3), s(_3, l2, r, o, f2), f2.delete(l2)), Yr(n2, e, _3);
      }
      function nu(n2, t) {
        var e = n2.length;
        if (e)
          return t += t < 0 ? e : 0, Zn(t, e) ? n2[t] : i;
      }
      function tu(n2, t, e) {
        t.length ? t = G2(t, function(o) {
          return O2(o) ? function(f2) {
            return _t2(f2, o.length === 1 ? o[0] : o);
          } : o;
        }) : t = [fn];
        var r = -1;
        t = G2(t, hn(x2()));
        var s = Vs2(n2, function(o, f2, c2) {
          var l2 = G2(t, function(v2) {
            return v2(o);
          });
          return { criteria: l2, index: ++r, value: o };
        });
        return sf(s, function(o, f2) {
          return Kc(o, f2, e);
        });
      }
      function Dc(n2, t) {
        return eu(n2, t, function(e, r) {
          return Oi(n2, r);
        });
      }
      function eu(n2, t, e) {
        for (var r = -1, s = t.length, o = {}; ++r < s; ) {
          var f2 = t[r], c2 = _t2(n2, f2);
          e(c2, f2) && fe(o, st2(f2, n2), c2);
        }
        return o;
      }
      function Hc(n2) {
        return function(t) {
          return _t2(t, n2);
        };
      }
      function ti(n2, t, e, r) {
        var s = r ? rf : Tt2, o = -1, f2 = t.length, c2 = n2;
        for (n2 === t && (t = un2(t)), e && (c2 = G2(n2, hn(e))); ++o < f2; )
          for (var l2 = 0, v2 = t[o], _3 = e ? e(v2) : v2; (l2 = s(c2, _3, l2, r)) > -1; )
            c2 !== n2 && Ne2.call(c2, l2, 1), Ne2.call(n2, l2, 1);
        return n2;
      }
      function ru(n2, t) {
        for (var e = n2 ? t.length : 0, r = e - 1; e--; ) {
          var s = t[e];
          if (e == r || s !== o) {
            var o = s;
            Zn(s) ? Ne2.call(n2, s, 1) : si(n2, s);
          }
        }
        return n2;
      }
      function ei(n2, t) {
        return n2 + We2(Us2() * (t - n2 + 1));
      }
      function Nc(n2, t, e, r) {
        for (var s = -1, o = Q3(Ue2((t - n2) / (e || 1)), 0), f2 = p3(o); o--; )
          f2[r ? o : ++s] = n2, n2 += e;
        return f2;
      }
      function ri(n2, t) {
        var e = "";
        if (!n2 || t < 1 || t > kn2)
          return e;
        do
          t % 2 && (e += n2), t = We2(t / 2), t && (n2 += n2);
        while (t);
        return e;
      }
      function L2(n2, t) {
        return Pi(Du(n2, t, fn), n2 + "");
      }
      function $c(n2) {
        return Ms2(Gt2(n2));
      }
      function Uc(n2, t) {
        var e = Gt2(n2);
        return tr2(e, vt2(t, 0, e.length));
      }
      function fe(n2, t, e, r) {
        if (!K3(n2))
          return n2;
        t = st2(t, n2);
        for (var s = -1, o = t.length, f2 = o - 1, c2 = n2; c2 != null && ++s < o; ) {
          var l2 = Wn(t[s]), v2 = e;
          if (l2 === "__proto__" || l2 === "constructor" || l2 === "prototype")
            return n2;
          if (s != f2) {
            var _3 = c2[l2];
            v2 = r ? r(_3, l2, c2) : i, v2 === i && (v2 = K3(_3) ? _3 : Zn(t[s + 1]) ? [] : {});
          }
          se(c2, l2, v2), c2 = c2[l2];
        }
        return n2;
      }
      var iu = Fe2 ? function(n2, t) {
        return Fe2.set(n2, t), n2;
      } : fn, Wc = $e2 ? function(n2, t) {
        return $e2(n2, "toString", { configurable: true, enumerable: false, value: bi(t), writable: true });
      } : fn;
      function Fc(n2) {
        return tr2(Gt2(n2));
      }
      function Cn(n2, t, e) {
        var r = -1, s = n2.length;
        t < 0 && (t = -t > s ? 0 : s + t), e = e > s ? s : e, e < 0 && (e += s), s = t > e ? 0 : e - t >>> 0, t >>>= 0;
        for (var o = p3(s); ++r < s; )
          o[r] = n2[r + t];
        return o;
      }
      function Mc(n2, t) {
        var e;
        return rt2(n2, function(r, s, o) {
          return e = t(r, s, o), !e;
        }), !!e;
      }
      function Ye2(n2, t, e) {
        var r = 0, s = n2 == null ? r : n2.length;
        if (typeof t == "number" && t === t && s <= Ma) {
          for (; r < s; ) {
            var o = r + s >>> 1, f2 = n2[o];
            f2 !== null && !pn(f2) && (e ? f2 <= t : f2 < t) ? r = o + 1 : s = o;
          }
          return s;
        }
        return ii(n2, t, fn, e);
      }
      function ii(n2, t, e, r) {
        var s = 0, o = n2 == null ? 0 : n2.length;
        if (o === 0)
          return 0;
        t = e(t);
        for (var f2 = t !== t, c2 = t === null, l2 = pn(t), v2 = t === i; s < o; ) {
          var _3 = We2((s + o) / 2), m2 = e(n2[_3]), P2 = m2 !== i, I2 = m2 === null, E3 = m2 === m2, b3 = pn(m2);
          if (f2)
            var y3 = r || E3;
          else
            v2 ? y3 = E3 && (r || P2) : c2 ? y3 = E3 && P2 && (r || !I2) : l2 ? y3 = E3 && P2 && !I2 && (r || !b3) : I2 || b3 ? y3 = false : y3 = r ? m2 <= t : m2 < t;
          y3 ? s = _3 + 1 : o = _3;
        }
        return nn(o, Fa);
      }
      function su(n2, t) {
        for (var e = -1, r = n2.length, s = 0, o = []; ++e < r; ) {
          var f2 = n2[e], c2 = t ? t(f2) : f2;
          if (!e || !bn(c2, l2)) {
            var l2 = c2;
            o[s++] = f2 === 0 ? 0 : f2;
          }
        }
        return o;
      }
      function uu(n2) {
        return typeof n2 == "number" ? n2 : pn(n2) ? _e : +n2;
      }
      function ln(n2) {
        if (typeof n2 == "string")
          return n2;
        if (O2(n2))
          return G2(n2, ln) + "";
        if (pn(n2))
          return Ws2 ? Ws2.call(n2) : "";
        var t = n2 + "";
        return t == "0" && 1 / n2 == -ht2 ? "-0" : t;
      }
      function it2(n2, t, e) {
        var r = -1, s = Ee, o = n2.length, f2 = true, c2 = [], l2 = c2;
        if (e)
          f2 = false, s = Dr2;
        else if (o >= w2) {
          var v2 = t ? null : Vc(n2);
          if (v2)
            return Se(v2);
          f2 = false, s = jt2, l2 = new gt2();
        } else
          l2 = t ? [] : c2;
        n:
          for (; ++r < o; ) {
            var _3 = n2[r], m2 = t ? t(_3) : _3;
            if (_3 = e || _3 !== 0 ? _3 : 0, f2 && m2 === m2) {
              for (var P2 = l2.length; P2--; )
                if (l2[P2] === m2)
                  continue n;
              t && l2.push(m2), c2.push(_3);
            } else
              s(l2, m2, e) || (l2 !== c2 && l2.push(m2), c2.push(_3));
          }
        return c2;
      }
      function si(n2, t) {
        return t = st2(t, n2), n2 = Hu(n2, t), n2 == null || delete n2[Wn(In(t))];
      }
      function au(n2, t, e, r) {
        return fe(n2, t, e(_t2(n2, t)), r);
      }
      function Ze2(n2, t, e, r) {
        for (var s = n2.length, o = r ? s : -1; (r ? o-- : ++o < s) && t(n2[o], o, n2); )
          ;
        return e ? Cn(n2, r ? 0 : o, r ? o + 1 : s) : Cn(n2, r ? o + 1 : 0, r ? s : o);
      }
      function ou(n2, t) {
        var e = n2;
        return e instanceof H2 && (e = e.value()), Hr(t, function(r, s) {
          return s.func.apply(s.thisArg, nt2([r], s.args));
        }, e);
      }
      function ui(n2, t, e) {
        var r = n2.length;
        if (r < 2)
          return r ? it2(n2[0]) : [];
        for (var s = -1, o = p3(r); ++s < r; )
          for (var f2 = n2[s], c2 = -1; ++c2 < r; )
            c2 != s && (o[s] = ue2(o[s] || f2, n2[c2], t, e));
        return it2(j2(o, 1), t, e);
      }
      function fu(n2, t, e) {
        for (var r = -1, s = n2.length, o = t.length, f2 = {}; ++r < s; ) {
          var c2 = r < o ? t[r] : i;
          e(f2, n2[r], c2);
        }
        return f2;
      }
      function ai(n2) {
        return Z2(n2) ? n2 : [];
      }
      function oi(n2) {
        return typeof n2 == "function" ? n2 : fn;
      }
      function st2(n2, t) {
        return O2(n2) ? n2 : _i(n2, t) ? [n2] : Wu(W2(n2));
      }
      var qc = L2;
      function ut2(n2, t, e) {
        var r = n2.length;
        return e = e === i ? r : e, !t && e >= r ? n2 : Cn(n2, t, e);
      }
      var cu = Of || function(n2) {
        return k2.clearTimeout(n2);
      };
      function hu(n2, t) {
        if (t)
          return n2.slice();
        var e = n2.length, r = Ls2 ? Ls2(e) : new n2.constructor(e);
        return n2.copy(r), r;
      }
      function fi(n2) {
        var t = new n2.constructor(n2.byteLength);
        return new De2(t).set(new De2(n2)), t;
      }
      function Bc(n2, t) {
        var e = t ? fi(n2.buffer) : n2.buffer;
        return new n2.constructor(e, n2.byteOffset, n2.byteLength);
      }
      function Gc(n2) {
        var t = new n2.constructor(n2.source, Ji2.exec(n2));
        return t.lastIndex = n2.lastIndex, t;
      }
      function zc(n2) {
        return ie ? M2(ie.call(n2)) : {};
      }
      function lu(n2, t) {
        var e = t ? fi(n2.buffer) : n2.buffer;
        return new n2.constructor(e, n2.byteOffset, n2.length);
      }
      function pu(n2, t) {
        if (n2 !== t) {
          var e = n2 !== i, r = n2 === null, s = n2 === n2, o = pn(n2), f2 = t !== i, c2 = t === null, l2 = t === t, v2 = pn(t);
          if (!c2 && !v2 && !o && n2 > t || o && f2 && l2 && !c2 && !v2 || r && f2 && l2 || !e && l2 || !s)
            return 1;
          if (!r && !o && !v2 && n2 < t || v2 && e && s && !r && !o || c2 && e && s || !f2 && s || !l2)
            return -1;
        }
        return 0;
      }
      function Kc(n2, t, e) {
        for (var r = -1, s = n2.criteria, o = t.criteria, f2 = s.length, c2 = e.length; ++r < f2; ) {
          var l2 = pu(s[r], o[r]);
          if (l2) {
            if (r >= c2)
              return l2;
            var v2 = e[r];
            return l2 * (v2 == "desc" ? -1 : 1);
          }
        }
        return n2.index - t.index;
      }
      function du(n2, t, e, r) {
        for (var s = -1, o = n2.length, f2 = e.length, c2 = -1, l2 = t.length, v2 = Q3(o - f2, 0), _3 = p3(l2 + v2), m2 = !r; ++c2 < l2; )
          _3[c2] = t[c2];
        for (; ++s < f2; )
          (m2 || s < o) && (_3[e[s]] = n2[s]);
        for (; v2--; )
          _3[c2++] = n2[s++];
        return _3;
      }
      function gu(n2, t, e, r) {
        for (var s = -1, o = n2.length, f2 = -1, c2 = e.length, l2 = -1, v2 = t.length, _3 = Q3(o - c2, 0), m2 = p3(_3 + v2), P2 = !r; ++s < _3; )
          m2[s] = n2[s];
        for (var I2 = s; ++l2 < v2; )
          m2[I2 + l2] = t[l2];
        for (; ++f2 < c2; )
          (P2 || s < o) && (m2[I2 + e[f2]] = n2[s++]);
        return m2;
      }
      function un2(n2, t) {
        var e = -1, r = n2.length;
        for (t || (t = p3(r)); ++e < r; )
          t[e] = n2[e];
        return t;
      }
      function Un(n2, t, e, r) {
        var s = !e;
        e || (e = {});
        for (var o = -1, f2 = t.length; ++o < f2; ) {
          var c2 = t[o], l2 = r ? r(e[c2], n2[c2], c2, e, n2) : i;
          l2 === i && (l2 = n2[c2]), s ? zn2(e, c2, l2) : se(e, c2, l2);
        }
        return e;
      }
      function Yc(n2, t) {
        return Un(n2, vi(n2), t);
      }
      function Zc(n2, t) {
        return Un(n2, Ou(n2), t);
      }
      function Je2(n2, t) {
        return function(e, r) {
          var s = O2(e) ? Vo : gc, o = t ? t() : {};
          return s(e, n2, x2(r, 2), o);
        };
      }
      function Ft2(n2) {
        return L2(function(t, e) {
          var r = -1, s = e.length, o = s > 1 ? e[s - 1] : i, f2 = s > 2 ? e[2] : i;
          for (o = n2.length > 3 && typeof o == "function" ? (s--, o) : i, f2 && rn(e[0], e[1], f2) && (o = s < 3 ? i : o, s = 1), t = M2(t); ++r < s; ) {
            var c2 = e[r];
            c2 && n2(t, c2, r, o);
          }
          return t;
        });
      }
      function vu(n2, t) {
        return function(e, r) {
          if (e == null)
            return e;
          if (!an2(e))
            return n2(e, r);
          for (var s = e.length, o = t ? s : -1, f2 = M2(e); (t ? o-- : ++o < s) && r(f2[o], o, f2) !== false; )
            ;
          return e;
        };
      }
      function _u(n2) {
        return function(t, e, r) {
          for (var s = -1, o = M2(t), f2 = r(t), c2 = f2.length; c2--; ) {
            var l2 = f2[n2 ? c2 : ++s];
            if (e(o[l2], l2, o) === false)
              break;
          }
          return t;
        };
      }
      function Jc(n2, t, e) {
        var r = t & vn, s = ce2(n2);
        function o() {
          var f2 = this && this !== k2 && this instanceof o ? s : n2;
          return f2.apply(r ? e : this, arguments);
        }
        return o;
      }
      function mu(n2) {
        return function(t) {
          t = W2(t);
          var e = Lt2(t) ? On(t) : i, r = e ? e[0] : t.charAt(0), s = e ? ut2(e, 1).join("") : t.slice(1);
          return r[n2]() + s;
        };
      }
      function Mt2(n2) {
        return function(t) {
          return Hr(va(ga(t).replace(Uo, "")), n2, "");
        };
      }
      function ce2(n2) {
        return function() {
          var t = arguments;
          switch (t.length) {
            case 0:
              return new n2();
            case 1:
              return new n2(t[0]);
            case 2:
              return new n2(t[0], t[1]);
            case 3:
              return new n2(t[0], t[1], t[2]);
            case 4:
              return new n2(t[0], t[1], t[2], t[3]);
            case 5:
              return new n2(t[0], t[1], t[2], t[3], t[4]);
            case 6:
              return new n2(t[0], t[1], t[2], t[3], t[4], t[5]);
            case 7:
              return new n2(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
          }
          var e = Wt2(n2.prototype), r = n2.apply(e, t);
          return K3(r) ? r : e;
        };
      }
      function Xc(n2, t, e) {
        var r = ce2(n2);
        function s() {
          for (var o = arguments.length, f2 = p3(o), c2 = o, l2 = qt2(s); c2--; )
            f2[c2] = arguments[c2];
          var v2 = o < 3 && f2[0] !== l2 && f2[o - 1] !== l2 ? [] : tt2(f2, l2);
          if (o -= v2.length, o < e)
            return Iu(n2, t, Xe2, s.placeholder, i, f2, v2, i, i, e - o);
          var _3 = this && this !== k2 && this instanceof s ? r : n2;
          return cn2(_3, this, f2);
        }
        return s;
      }
      function wu(n2) {
        return function(t, e, r) {
          var s = M2(t);
          if (!an2(t)) {
            var o = x2(e, 3);
            t = V2(t), e = function(c2) {
              return o(s[c2], c2, s);
            };
          }
          var f2 = n2(t, e, r);
          return f2 > -1 ? s[o ? t[f2] : f2] : i;
        };
      }
      function Pu(n2) {
        return Yn(function(t) {
          var e = t.length, r = e, s = Pn.prototype.thru;
          for (n2 && t.reverse(); r--; ) {
            var o = t[r];
            if (typeof o != "function")
              throw new wn($2);
            if (s && !f2 && je2(o) == "wrapper")
              var f2 = new Pn([], true);
          }
          for (r = f2 ? r : e; ++r < e; ) {
            o = t[r];
            var c2 = je2(o), l2 = c2 == "wrapper" ? di(o) : i;
            l2 && mi(l2[0]) && l2[1] == (Mn2 | Dn2 | Hn | Kt2) && !l2[4].length && l2[9] == 1 ? f2 = f2[je2(l2[0])].apply(f2, l2[3]) : f2 = o.length == 1 && mi(o) ? f2[c2]() : f2.thru(o);
          }
          return function() {
            var v2 = arguments, _3 = v2[0];
            if (f2 && v2.length == 1 && O2(_3))
              return f2.plant(_3).value();
            for (var m2 = 0, P2 = e ? t[m2].apply(this, v2) : _3; ++m2 < e; )
              P2 = t[m2].call(this, P2);
            return P2;
          };
        });
      }
      function Xe2(n2, t, e, r, s, o, f2, c2, l2, v2) {
        var _3 = t & Mn2, m2 = t & vn, P2 = t & ct2, I2 = t & (Dn2 | yt2), E3 = t & dr, b3 = P2 ? i : ce2(n2);
        function y3() {
          for (var D2 = arguments.length, N2 = p3(D2), dn = D2; dn--; )
            N2[dn] = arguments[dn];
          if (I2)
            var sn = qt2(y3), gn = af(N2, sn);
          if (r && (N2 = du(N2, r, s, I2)), o && (N2 = gu(N2, o, f2, I2)), D2 -= gn, I2 && D2 < v2) {
            var J = tt2(N2, sn);
            return Iu(n2, t, Xe2, y3.placeholder, e, N2, J, c2, l2, v2 - D2);
          }
          var Tn = m2 ? e : this, Qn = P2 ? Tn[n2] : n2;
          return D2 = N2.length, c2 ? N2 = gh(N2, c2) : E3 && D2 > 1 && N2.reverse(), _3 && l2 < D2 && (N2.length = l2), this && this !== k2 && this instanceof y3 && (Qn = b3 || ce2(Qn)), Qn.apply(Tn, N2);
        }
        return y3;
      }
      function Au(n2, t) {
        return function(e, r) {
          return Ic(e, n2, t(r), {});
        };
      }
      function Qe2(n2, t) {
        return function(e, r) {
          var s;
          if (e === i && r === i)
            return t;
          if (e !== i && (s = e), r !== i) {
            if (s === i)
              return r;
            typeof e == "string" || typeof r == "string" ? (e = ln(e), r = ln(r)) : (e = uu(e), r = uu(r)), s = n2(e, r);
          }
          return s;
        };
      }
      function ci(n2) {
        return Yn(function(t) {
          return t = G2(t, hn(x2())), L2(function(e) {
            var r = this;
            return n2(t, function(s) {
              return cn2(s, r, e);
            });
          });
        });
      }
      function Ve2(n2, t) {
        t = t === i ? " " : ln(t);
        var e = t.length;
        if (e < 2)
          return e ? ri(t, n2) : t;
        var r = ri(t, Ue2(n2 / Dt2(t)));
        return Lt2(t) ? ut2(On(r), 0, n2).join("") : r.slice(0, n2);
      }
      function Qc(n2, t, e, r) {
        var s = t & vn, o = ce2(n2);
        function f2() {
          for (var c2 = -1, l2 = arguments.length, v2 = -1, _3 = r.length, m2 = p3(_3 + l2), P2 = this && this !== k2 && this instanceof f2 ? o : n2; ++v2 < _3; )
            m2[v2] = r[v2];
          for (; l2--; )
            m2[v2++] = arguments[++c2];
          return cn2(P2, s ? e : this, m2);
        }
        return f2;
      }
      function Cu(n2) {
        return function(t, e, r) {
          return r && typeof r != "number" && rn(t, e, r) && (e = r = i), t = Xn(t), e === i ? (e = t, t = 0) : e = Xn(e), r = r === i ? t < e ? 1 : -1 : Xn(r), Nc(t, e, r, n2);
        };
      }
      function ke2(n2) {
        return function(t, e) {
          return typeof t == "string" && typeof e == "string" || (t = xn2(t), e = xn2(e)), n2(t, e);
        };
      }
      function Iu(n2, t, e, r, s, o, f2, c2, l2, v2) {
        var _3 = t & Dn2, m2 = _3 ? f2 : i, P2 = _3 ? i : f2, I2 = _3 ? o : i, E3 = _3 ? i : o;
        t |= _3 ? Hn : St2, t &= ~(_3 ? St2 : Hn), t & qi2 || (t &= ~(vn | ct2));
        var b3 = [n2, t, s, I2, m2, E3, P2, c2, l2, v2], y3 = e.apply(i, b3);
        return mi(n2) && Nu(y3, b3), y3.placeholder = r, $u(y3, n2, t);
      }
      function hi(n2) {
        var t = X2[n2];
        return function(e, r) {
          if (e = xn2(e), r = r == null ? 0 : nn(R2(r), 292), r && $s2(e)) {
            var s = (W2(e) + "e").split("e"), o = t(s[0] + "e" + (+s[1] + r));
            return s = (W2(o) + "e").split("e"), +(s[0] + "e" + (+s[1] - r));
          }
          return t(e);
        };
      }
      var Vc = $t2 && 1 / Se(new $t2([, -0]))[1] == ht2 ? function(n2) {
        return new $t2(n2);
      } : Di;
      function xu(n2) {
        return function(t) {
          var e = tn(t);
          return e == yn ? qr(t) : e == Sn ? df(t) : uf(t, n2(t));
        };
      }
      function Kn2(n2, t, e, r, s, o, f2, c2) {
        var l2 = t & ct2;
        if (!l2 && typeof n2 != "function")
          throw new wn($2);
        var v2 = r ? r.length : 0;
        if (v2 || (t &= ~(Hn | St2), r = s = i), f2 = f2 === i ? f2 : Q3(R2(f2), 0), c2 = c2 === i ? c2 : R2(c2), v2 -= s ? s.length : 0, t & St2) {
          var _3 = r, m2 = s;
          r = s = i;
        }
        var P2 = l2 ? i : di(n2), I2 = [n2, t, e, r, s, _3, m2, o, f2, c2];
        if (P2 && lh(I2, P2), n2 = I2[0], t = I2[1], e = I2[2], r = I2[3], s = I2[4], c2 = I2[9] = I2[9] === i ? l2 ? 0 : n2.length : Q3(I2[9] - v2, 0), !c2 && t & (Dn2 | yt2) && (t &= ~(Dn2 | yt2)), !t || t == vn)
          var E3 = Jc(n2, t, e);
        else
          t == Dn2 || t == yt2 ? E3 = Xc(n2, t, c2) : (t == Hn || t == (vn | Hn)) && !s.length ? E3 = Qc(n2, t, e, r) : E3 = Xe2.apply(i, I2);
        var b3 = P2 ? iu : Nu;
        return $u(b3(E3, I2), n2, t);
      }
      function Eu(n2, t, e, r) {
        return n2 === i || bn(n2, Nt2[e]) && !F2.call(r, e) ? t : n2;
      }
      function yu(n2, t, e, r, s, o) {
        return K3(n2) && K3(t) && (o.set(t, n2), Ke2(n2, t, i, yu, o), o.delete(t)), n2;
      }
      function kc(n2) {
        return pe2(n2) ? i : n2;
      }
      function Su(n2, t, e, r, s, o) {
        var f2 = e & Et2, c2 = n2.length, l2 = t.length;
        if (c2 != l2 && !(f2 && l2 > c2))
          return false;
        var v2 = o.get(n2), _3 = o.get(t);
        if (v2 && _3)
          return v2 == t && _3 == n2;
        var m2 = -1, P2 = true, I2 = e & ve2 ? new gt2() : i;
        for (o.set(n2, t), o.set(t, n2); ++m2 < c2; ) {
          var E3 = n2[m2], b3 = t[m2];
          if (r)
            var y3 = f2 ? r(b3, E3, m2, t, n2, o) : r(E3, b3, m2, n2, t, o);
          if (y3 !== i) {
            if (y3)
              continue;
            P2 = false;
            break;
          }
          if (I2) {
            if (!Nr(t, function(D2, N2) {
              if (!jt2(I2, N2) && (E3 === D2 || s(E3, D2, e, r, o)))
                return I2.push(N2);
            })) {
              P2 = false;
              break;
            }
          } else if (!(E3 === b3 || s(E3, b3, e, r, o))) {
            P2 = false;
            break;
          }
        }
        return o.delete(n2), o.delete(t), P2;
      }
      function jc(n2, t, e, r, s, o, f2) {
        switch (e) {
          case Rt2:
            if (n2.byteLength != t.byteLength || n2.byteOffset != t.byteOffset)
              return false;
            n2 = n2.buffer, t = t.buffer;
          case kt2:
            return !(n2.byteLength != t.byteLength || !o(new De2(n2), new De2(t)));
          case Yt:
          case Zt2:
          case Jt:
            return bn(+n2, +t);
          case we:
            return n2.name == t.name && n2.message == t.message;
          case Xt2:
          case Qt2:
            return n2 == t + "";
          case yn:
            var c2 = qr;
          case Sn:
            var l2 = r & Et2;
            if (c2 || (c2 = Se), n2.size != t.size && !l2)
              return false;
            var v2 = f2.get(n2);
            if (v2)
              return v2 == t;
            r |= ve2, f2.set(n2, t);
            var _3 = Su(c2(n2), c2(t), r, s, o, f2);
            return f2.delete(n2), _3;
          case Ae:
            if (ie)
              return ie.call(n2) == ie.call(t);
        }
        return false;
      }
      function nh(n2, t, e, r, s, o) {
        var f2 = e & Et2, c2 = li(n2), l2 = c2.length, v2 = li(t), _3 = v2.length;
        if (l2 != _3 && !f2)
          return false;
        for (var m2 = l2; m2--; ) {
          var P2 = c2[m2];
          if (!(f2 ? P2 in t : F2.call(t, P2)))
            return false;
        }
        var I2 = o.get(n2), E3 = o.get(t);
        if (I2 && E3)
          return I2 == t && E3 == n2;
        var b3 = true;
        o.set(n2, t), o.set(t, n2);
        for (var y3 = f2; ++m2 < l2; ) {
          P2 = c2[m2];
          var D2 = n2[P2], N2 = t[P2];
          if (r)
            var dn = f2 ? r(N2, D2, P2, t, n2, o) : r(D2, N2, P2, n2, t, o);
          if (!(dn === i ? D2 === N2 || s(D2, N2, e, r, o) : dn)) {
            b3 = false;
            break;
          }
          y3 || (y3 = P2 == "constructor");
        }
        if (b3 && !y3) {
          var sn = n2.constructor, gn = t.constructor;
          sn != gn && "constructor" in n2 && "constructor" in t && !(typeof sn == "function" && sn instanceof sn && typeof gn == "function" && gn instanceof gn) && (b3 = false);
        }
        return o.delete(n2), o.delete(t), b3;
      }
      function Yn(n2) {
        return Pi(Du(n2, i, Bu), n2 + "");
      }
      function li(n2) {
        return Zs2(n2, V2, vi);
      }
      function pi(n2) {
        return Zs2(n2, on, Ou);
      }
      var di = Fe2 ? function(n2) {
        return Fe2.get(n2);
      } : Di;
      function je2(n2) {
        for (var t = n2.name + "", e = Ut2[t], r = F2.call(Ut2, t) ? e.length : 0; r--; ) {
          var s = e[r], o = s.func;
          if (o == null || o == n2)
            return s.name;
        }
        return t;
      }
      function qt2(n2) {
        var t = F2.call(a2, "placeholder") ? a2 : n2;
        return t.placeholder;
      }
      function x2() {
        var n2 = a2.iteratee || Ti;
        return n2 = n2 === Ti ? Qs2 : n2, arguments.length ? n2(arguments[0], arguments[1]) : n2;
      }
      function nr2(n2, t) {
        var e = n2.__data__;
        return oh(t) ? e[typeof t == "string" ? "string" : "hash"] : e.map;
      }
      function gi(n2) {
        for (var t = V2(n2), e = t.length; e--; ) {
          var r = t[e], s = n2[r];
          t[e] = [r, s, Tu(s)];
        }
        return t;
      }
      function mt2(n2, t) {
        var e = hf(n2, t);
        return Xs2(e) ? e : i;
      }
      function th(n2) {
        var t = F2.call(n2, pt2), e = n2[pt2];
        try {
          n2[pt2] = i;
          var r = true;
        } catch {
        }
        var s = Te.call(n2);
        return r && (t ? n2[pt2] = e : delete n2[pt2]), s;
      }
      var vi = Gr ? function(n2) {
        return n2 == null ? [] : (n2 = M2(n2), jn2(Gr(n2), function(t) {
          return Hs2.call(n2, t);
        }));
      } : Hi2, Ou = Gr ? function(n2) {
        for (var t = []; n2; )
          nt2(t, vi(n2)), n2 = He2(n2);
        return t;
      } : Hi2, tn = en;
      (zr && tn(new zr(new ArrayBuffer(1))) != Rt2 || te2 && tn(new te2()) != yn || Kr && tn(Kr.resolve()) != zi || $t2 && tn(new $t2()) != Sn || ee2 && tn(new ee2()) != Vt2) && (tn = function(n2) {
        var t = en(n2), e = t == qn ? n2.constructor : i, r = e ? wt2(e) : "";
        if (r)
          switch (r) {
            case Uf:
              return Rt2;
            case Wf:
              return yn;
            case Ff:
              return zi;
            case Mf:
              return Sn;
            case qf:
              return Vt2;
          }
        return t;
      });
      function eh(n2, t, e) {
        for (var r = -1, s = e.length; ++r < s; ) {
          var o = e[r], f2 = o.size;
          switch (o.type) {
            case "drop":
              n2 += f2;
              break;
            case "dropRight":
              t -= f2;
              break;
            case "take":
              t = nn(t, n2 + f2);
              break;
            case "takeRight":
              n2 = Q3(n2, t - f2);
              break;
          }
        }
        return { start: n2, end: t };
      }
      function rh(n2) {
        var t = n2.match(ao);
        return t ? t[1].split(oo) : [];
      }
      function Ru(n2, t, e) {
        t = st2(t, n2);
        for (var r = -1, s = t.length, o = false; ++r < s; ) {
          var f2 = Wn(t[r]);
          if (!(o = n2 != null && e(n2, f2)))
            break;
          n2 = n2[f2];
        }
        return o || ++r != s ? o : (s = n2 == null ? 0 : n2.length, !!s && ar2(s) && Zn(f2, s) && (O2(n2) || Pt2(n2)));
      }
      function ih(n2) {
        var t = n2.length, e = new n2.constructor(t);
        return t && typeof n2[0] == "string" && F2.call(n2, "index") && (e.index = n2.index, e.input = n2.input), e;
      }
      function bu(n2) {
        return typeof n2.constructor == "function" && !he2(n2) ? Wt2(He2(n2)) : {};
      }
      function sh(n2, t, e) {
        var r = n2.constructor;
        switch (t) {
          case kt2:
            return fi(n2);
          case Yt:
          case Zt2:
            return new r(+n2);
          case Rt2:
            return Bc(n2, e);
          case gr:
          case vr2:
          case _r2:
          case mr2:
          case wr2:
          case Pr2:
          case Ar2:
          case Cr2:
          case Ir2:
            return lu(n2, e);
          case yn:
            return new r();
          case Jt:
          case Qt2:
            return new r(n2);
          case Xt2:
            return Gc(n2);
          case Sn:
            return new r();
          case Ae:
            return zc(n2);
        }
      }
      function uh(n2, t) {
        var e = t.length;
        if (!e)
          return n2;
        var r = e - 1;
        return t[r] = (e > 1 ? "& " : "") + t[r], t = t.join(e > 2 ? ", " : " "), n2.replace(uo, `{
/* [wrapped with ` + t + `] */
`);
      }
      function ah(n2) {
        return O2(n2) || Pt2(n2) || !!(Ns2 && n2 && n2[Ns2]);
      }
      function Zn(n2, t) {
        var e = typeof n2;
        return t = t ?? kn2, !!t && (e == "number" || e != "symbol" && mo.test(n2)) && n2 > -1 && n2 % 1 == 0 && n2 < t;
      }
      function rn(n2, t, e) {
        if (!K3(e))
          return false;
        var r = typeof t;
        return (r == "number" ? an2(e) && Zn(t, e.length) : r == "string" && t in e) ? bn(e[t], n2) : false;
      }
      function _i(n2, t) {
        if (O2(n2))
          return false;
        var e = typeof n2;
        return e == "number" || e == "symbol" || e == "boolean" || n2 == null || pn(n2) ? true : eo.test(n2) || !to.test(n2) || t != null && n2 in M2(t);
      }
      function oh(n2) {
        var t = typeof n2;
        return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? n2 !== "__proto__" : n2 === null;
      }
      function mi(n2) {
        var t = je2(n2), e = a2[t];
        if (typeof e != "function" || !(t in H2.prototype))
          return false;
        if (n2 === e)
          return true;
        var r = di(e);
        return !!r && n2 === r[0];
      }
      function fh(n2) {
        return !!Ts2 && Ts2 in n2;
      }
      var ch = Re2 ? Jn2 : Ni;
      function he2(n2) {
        var t = n2 && n2.constructor, e = typeof t == "function" && t.prototype || Nt2;
        return n2 === e;
      }
      function Tu(n2) {
        return n2 === n2 && !K3(n2);
      }
      function Lu(n2, t) {
        return function(e) {
          return e == null ? false : e[n2] === t && (t !== i || n2 in M2(e));
        };
      }
      function hh(n2) {
        var t = sr2(n2, function(r) {
          return e.size === pr && e.clear(), r;
        }), e = t.cache;
        return t;
      }
      function lh(n2, t) {
        var e = n2[1], r = t[1], s = e | r, o = s < (vn | ct2 | Mn2), f2 = r == Mn2 && e == Dn2 || r == Mn2 && e == Kt2 && n2[7].length <= t[8] || r == (Mn2 | Kt2) && t[7].length <= t[8] && e == Dn2;
        if (!(o || f2))
          return n2;
        r & vn && (n2[2] = t[2], s |= e & vn ? 0 : qi2);
        var c2 = t[3];
        if (c2) {
          var l2 = n2[3];
          n2[3] = l2 ? du(l2, c2, t[4]) : c2, n2[4] = l2 ? tt2(n2[3], It2) : t[4];
        }
        return c2 = t[5], c2 && (l2 = n2[5], n2[5] = l2 ? gu(l2, c2, t[6]) : c2, n2[6] = l2 ? tt2(n2[5], It2) : t[6]), c2 = t[7], c2 && (n2[7] = c2), r & Mn2 && (n2[8] = n2[8] == null ? t[8] : nn(n2[8], t[8])), n2[9] == null && (n2[9] = t[9]), n2[0] = t[0], n2[1] = s, n2;
      }
      function ph(n2) {
        var t = [];
        if (n2 != null)
          for (var e in M2(n2))
            t.push(e);
        return t;
      }
      function dh(n2) {
        return Te.call(n2);
      }
      function Du(n2, t, e) {
        return t = Q3(t === i ? n2.length - 1 : t, 0), function() {
          for (var r = arguments, s = -1, o = Q3(r.length - t, 0), f2 = p3(o); ++s < o; )
            f2[s] = r[t + s];
          s = -1;
          for (var c2 = p3(t + 1); ++s < t; )
            c2[s] = r[s];
          return c2[t] = e(f2), cn2(n2, this, c2);
        };
      }
      function Hu(n2, t) {
        return t.length < 2 ? n2 : _t2(n2, Cn(t, 0, -1));
      }
      function gh(n2, t) {
        for (var e = n2.length, r = nn(t.length, e), s = un2(n2); r--; ) {
          var o = t[r];
          n2[r] = Zn(o, e) ? s[o] : i;
        }
        return n2;
      }
      function wi(n2, t) {
        if (!(t === "constructor" && typeof n2[t] == "function") && t != "__proto__")
          return n2[t];
      }
      var Nu = Uu(iu), le2 = bf || function(n2, t) {
        return k2.setTimeout(n2, t);
      }, Pi = Uu(Wc);
      function $u(n2, t, e) {
        var r = t + "";
        return Pi(n2, uh(r, vh(rh(r), e)));
      }
      function Uu(n2) {
        var t = 0, e = 0;
        return function() {
          var r = Hf(), s = Na - (r - e);
          if (e = r, s > 0) {
            if (++t >= Ha)
              return arguments[0];
          } else
            t = 0;
          return n2.apply(i, arguments);
        };
      }
      function tr2(n2, t) {
        var e = -1, r = n2.length, s = r - 1;
        for (t = t === i ? r : t; ++e < t; ) {
          var o = ei(e, s), f2 = n2[o];
          n2[o] = n2[e], n2[e] = f2;
        }
        return n2.length = t, n2;
      }
      var Wu = hh(function(n2) {
        var t = [];
        return n2.charCodeAt(0) === 46 && t.push(""), n2.replace(ro, function(e, r, s, o) {
          t.push(s ? o.replace(ho, "$1") : r || e);
        }), t;
      });
      function Wn(n2) {
        if (typeof n2 == "string" || pn(n2))
          return n2;
        var t = n2 + "";
        return t == "0" && 1 / n2 == -ht2 ? "-0" : t;
      }
      function wt2(n2) {
        if (n2 != null) {
          try {
            return be.call(n2);
          } catch {
          }
          try {
            return n2 + "";
          } catch {
          }
        }
        return "";
      }
      function vh(n2, t) {
        return mn(qa, function(e) {
          var r = "_." + e[0];
          t & e[1] && !Ee(n2, r) && n2.push(r);
        }), n2.sort();
      }
      function Fu(n2) {
        if (n2 instanceof H2)
          return n2.clone();
        var t = new Pn(n2.__wrapped__, n2.__chain__);
        return t.__actions__ = un2(n2.__actions__), t.__index__ = n2.__index__, t.__values__ = n2.__values__, t;
      }
      function _h(n2, t, e) {
        (e ? rn(n2, t, e) : t === i) ? t = 1 : t = Q3(R2(t), 0);
        var r = n2 == null ? 0 : n2.length;
        if (!r || t < 1)
          return [];
        for (var s = 0, o = 0, f2 = p3(Ue2(r / t)); s < r; )
          f2[o++] = Cn(n2, s, s += t);
        return f2;
      }
      function mh(n2) {
        for (var t = -1, e = n2 == null ? 0 : n2.length, r = 0, s = []; ++t < e; ) {
          var o = n2[t];
          o && (s[r++] = o);
        }
        return s;
      }
      function wh() {
        var n2 = arguments.length;
        if (!n2)
          return [];
        for (var t = p3(n2 - 1), e = arguments[0], r = n2; r--; )
          t[r - 1] = arguments[r];
        return nt2(O2(e) ? un2(e) : [e], j2(t, 1));
      }
      var Ph = L2(function(n2, t) {
        return Z2(n2) ? ue2(n2, j2(t, 1, Z2, true)) : [];
      }), Ah = L2(function(n2, t) {
        var e = In(t);
        return Z2(e) && (e = i), Z2(n2) ? ue2(n2, j2(t, 1, Z2, true), x2(e, 2)) : [];
      }), Ch = L2(function(n2, t) {
        var e = In(t);
        return Z2(e) && (e = i), Z2(n2) ? ue2(n2, j2(t, 1, Z2, true), i, e) : [];
      });
      function Ih(n2, t, e) {
        var r = n2 == null ? 0 : n2.length;
        return r ? (t = e || t === i ? 1 : R2(t), Cn(n2, t < 0 ? 0 : t, r)) : [];
      }
      function xh(n2, t, e) {
        var r = n2 == null ? 0 : n2.length;
        return r ? (t = e || t === i ? 1 : R2(t), t = r - t, Cn(n2, 0, t < 0 ? 0 : t)) : [];
      }
      function Eh(n2, t) {
        return n2 && n2.length ? Ze2(n2, x2(t, 3), true, true) : [];
      }
      function yh(n2, t) {
        return n2 && n2.length ? Ze2(n2, x2(t, 3), true) : [];
      }
      function Sh(n2, t, e, r) {
        var s = n2 == null ? 0 : n2.length;
        return s ? (e && typeof e != "number" && rn(n2, t, e) && (e = 0, r = s), wc(n2, t, e, r)) : [];
      }
      function Mu(n2, t, e) {
        var r = n2 == null ? 0 : n2.length;
        if (!r)
          return -1;
        var s = e == null ? 0 : R2(e);
        return s < 0 && (s = Q3(r + s, 0)), ye(n2, x2(t, 3), s);
      }
      function qu(n2, t, e) {
        var r = n2 == null ? 0 : n2.length;
        if (!r)
          return -1;
        var s = r - 1;
        return e !== i && (s = R2(e), s = e < 0 ? Q3(r + s, 0) : nn(s, r - 1)), ye(n2, x2(t, 3), s, true);
      }
      function Bu(n2) {
        var t = n2 == null ? 0 : n2.length;
        return t ? j2(n2, 1) : [];
      }
      function Oh(n2) {
        var t = n2 == null ? 0 : n2.length;
        return t ? j2(n2, ht2) : [];
      }
      function Rh(n2, t) {
        var e = n2 == null ? 0 : n2.length;
        return e ? (t = t === i ? 1 : R2(t), j2(n2, t)) : [];
      }
      function bh(n2) {
        for (var t = -1, e = n2 == null ? 0 : n2.length, r = {}; ++t < e; ) {
          var s = n2[t];
          r[s[0]] = s[1];
        }
        return r;
      }
      function Gu(n2) {
        return n2 && n2.length ? n2[0] : i;
      }
      function Th(n2, t, e) {
        var r = n2 == null ? 0 : n2.length;
        if (!r)
          return -1;
        var s = e == null ? 0 : R2(e);
        return s < 0 && (s = Q3(r + s, 0)), Tt2(n2, t, s);
      }
      function Lh(n2) {
        var t = n2 == null ? 0 : n2.length;
        return t ? Cn(n2, 0, -1) : [];
      }
      var Dh = L2(function(n2) {
        var t = G2(n2, ai);
        return t.length && t[0] === n2[0] ? Vr(t) : [];
      }), Hh = L2(function(n2) {
        var t = In(n2), e = G2(n2, ai);
        return t === In(e) ? t = i : e.pop(), e.length && e[0] === n2[0] ? Vr(e, x2(t, 2)) : [];
      }), Nh = L2(function(n2) {
        var t = In(n2), e = G2(n2, ai);
        return t = typeof t == "function" ? t : i, t && e.pop(), e.length && e[0] === n2[0] ? Vr(e, i, t) : [];
      });
      function $h(n2, t) {
        return n2 == null ? "" : Lf.call(n2, t);
      }
      function In(n2) {
        var t = n2 == null ? 0 : n2.length;
        return t ? n2[t - 1] : i;
      }
      function Uh(n2, t, e) {
        var r = n2 == null ? 0 : n2.length;
        if (!r)
          return -1;
        var s = r;
        return e !== i && (s = R2(e), s = s < 0 ? Q3(r + s, 0) : nn(s, r - 1)), t === t ? vf(n2, t, s) : ye(n2, Is2, s, true);
      }
      function Wh(n2, t) {
        return n2 && n2.length ? nu(n2, R2(t)) : i;
      }
      var Fh = L2(zu);
      function zu(n2, t) {
        return n2 && n2.length && t && t.length ? ti(n2, t) : n2;
      }
      function Mh(n2, t, e) {
        return n2 && n2.length && t && t.length ? ti(n2, t, x2(e, 2)) : n2;
      }
      function qh(n2, t, e) {
        return n2 && n2.length && t && t.length ? ti(n2, t, i, e) : n2;
      }
      var Bh = Yn(function(n2, t) {
        var e = n2 == null ? 0 : n2.length, r = Zr(n2, t);
        return ru(n2, G2(t, function(s) {
          return Zn(s, e) ? +s : s;
        }).sort(pu)), r;
      });
      function Gh(n2, t) {
        var e = [];
        if (!(n2 && n2.length))
          return e;
        var r = -1, s = [], o = n2.length;
        for (t = x2(t, 3); ++r < o; ) {
          var f2 = n2[r];
          t(f2, r, n2) && (e.push(f2), s.push(r));
        }
        return ru(n2, s), e;
      }
      function Ai(n2) {
        return n2 == null ? n2 : $f.call(n2);
      }
      function zh(n2, t, e) {
        var r = n2 == null ? 0 : n2.length;
        return r ? (e && typeof e != "number" && rn(n2, t, e) ? (t = 0, e = r) : (t = t == null ? 0 : R2(t), e = e === i ? r : R2(e)), Cn(n2, t, e)) : [];
      }
      function Kh(n2, t) {
        return Ye2(n2, t);
      }
      function Yh(n2, t, e) {
        return ii(n2, t, x2(e, 2));
      }
      function Zh(n2, t) {
        var e = n2 == null ? 0 : n2.length;
        if (e) {
          var r = Ye2(n2, t);
          if (r < e && bn(n2[r], t))
            return r;
        }
        return -1;
      }
      function Jh(n2, t) {
        return Ye2(n2, t, true);
      }
      function Xh(n2, t, e) {
        return ii(n2, t, x2(e, 2), true);
      }
      function Qh(n2, t) {
        var e = n2 == null ? 0 : n2.length;
        if (e) {
          var r = Ye2(n2, t, true) - 1;
          if (bn(n2[r], t))
            return r;
        }
        return -1;
      }
      function Vh(n2) {
        return n2 && n2.length ? su(n2) : [];
      }
      function kh(n2, t) {
        return n2 && n2.length ? su(n2, x2(t, 2)) : [];
      }
      function jh(n2) {
        var t = n2 == null ? 0 : n2.length;
        return t ? Cn(n2, 1, t) : [];
      }
      function nl(n2, t, e) {
        return n2 && n2.length ? (t = e || t === i ? 1 : R2(t), Cn(n2, 0, t < 0 ? 0 : t)) : [];
      }
      function tl(n2, t, e) {
        var r = n2 == null ? 0 : n2.length;
        return r ? (t = e || t === i ? 1 : R2(t), t = r - t, Cn(n2, t < 0 ? 0 : t, r)) : [];
      }
      function el(n2, t) {
        return n2 && n2.length ? Ze2(n2, x2(t, 3), false, true) : [];
      }
      function rl(n2, t) {
        return n2 && n2.length ? Ze2(n2, x2(t, 3)) : [];
      }
      var il = L2(function(n2) {
        return it2(j2(n2, 1, Z2, true));
      }), sl = L2(function(n2) {
        var t = In(n2);
        return Z2(t) && (t = i), it2(j2(n2, 1, Z2, true), x2(t, 2));
      }), ul = L2(function(n2) {
        var t = In(n2);
        return t = typeof t == "function" ? t : i, it2(j2(n2, 1, Z2, true), i, t);
      });
      function al(n2) {
        return n2 && n2.length ? it2(n2) : [];
      }
      function ol(n2, t) {
        return n2 && n2.length ? it2(n2, x2(t, 2)) : [];
      }
      function fl(n2, t) {
        return t = typeof t == "function" ? t : i, n2 && n2.length ? it2(n2, i, t) : [];
      }
      function Ci(n2) {
        if (!(n2 && n2.length))
          return [];
        var t = 0;
        return n2 = jn2(n2, function(e) {
          if (Z2(e))
            return t = Q3(e.length, t), true;
        }), Fr(t, function(e) {
          return G2(n2, $r(e));
        });
      }
      function Ku(n2, t) {
        if (!(n2 && n2.length))
          return [];
        var e = Ci(n2);
        return t == null ? e : G2(e, function(r) {
          return cn2(t, i, r);
        });
      }
      var cl = L2(function(n2, t) {
        return Z2(n2) ? ue2(n2, t) : [];
      }), hl = L2(function(n2) {
        return ui(jn2(n2, Z2));
      }), ll = L2(function(n2) {
        var t = In(n2);
        return Z2(t) && (t = i), ui(jn2(n2, Z2), x2(t, 2));
      }), pl = L2(function(n2) {
        var t = In(n2);
        return t = typeof t == "function" ? t : i, ui(jn2(n2, Z2), i, t);
      }), dl = L2(Ci);
      function gl(n2, t) {
        return fu(n2 || [], t || [], se);
      }
      function vl(n2, t) {
        return fu(n2 || [], t || [], fe);
      }
      var _l = L2(function(n2) {
        var t = n2.length, e = t > 1 ? n2[t - 1] : i;
        return e = typeof e == "function" ? (n2.pop(), e) : i, Ku(n2, e);
      });
      function Yu(n2) {
        var t = a2(n2);
        return t.__chain__ = true, t;
      }
      function ml(n2, t) {
        return t(n2), n2;
      }
      function er2(n2, t) {
        return t(n2);
      }
      var wl = Yn(function(n2) {
        var t = n2.length, e = t ? n2[0] : 0, r = this.__wrapped__, s = function(o) {
          return Zr(o, n2);
        };
        return t > 1 || this.__actions__.length || !(r instanceof H2) || !Zn(e) ? this.thru(s) : (r = r.slice(e, +e + (t ? 1 : 0)), r.__actions__.push({ func: er2, args: [s], thisArg: i }), new Pn(r, this.__chain__).thru(function(o) {
          return t && !o.length && o.push(i), o;
        }));
      });
      function Pl() {
        return Yu(this);
      }
      function Al() {
        return new Pn(this.value(), this.__chain__);
      }
      function Cl() {
        this.__values__ === i && (this.__values__ = ua(this.value()));
        var n2 = this.__index__ >= this.__values__.length, t = n2 ? i : this.__values__[this.__index__++];
        return { done: n2, value: t };
      }
      function Il() {
        return this;
      }
      function xl(n2) {
        for (var t, e = this; e instanceof qe2; ) {
          var r = Fu(e);
          r.__index__ = 0, r.__values__ = i, t ? s.__wrapped__ = r : t = r;
          var s = r;
          e = e.__wrapped__;
        }
        return s.__wrapped__ = n2, t;
      }
      function El() {
        var n2 = this.__wrapped__;
        if (n2 instanceof H2) {
          var t = n2;
          return this.__actions__.length && (t = new H2(this)), t = t.reverse(), t.__actions__.push({ func: er2, args: [Ai], thisArg: i }), new Pn(t, this.__chain__);
        }
        return this.thru(Ai);
      }
      function yl() {
        return ou(this.__wrapped__, this.__actions__);
      }
      var Sl = Je2(function(n2, t, e) {
        F2.call(n2, e) ? ++n2[e] : zn2(n2, e, 1);
      });
      function Ol(n2, t, e) {
        var r = O2(n2) ? As2 : mc;
        return e && rn(n2, t, e) && (t = i), r(n2, x2(t, 3));
      }
      function Rl(n2, t) {
        var e = O2(n2) ? jn2 : Ks2;
        return e(n2, x2(t, 3));
      }
      var bl = wu(Mu), Tl = wu(qu);
      function Ll(n2, t) {
        return j2(rr2(n2, t), 1);
      }
      function Dl(n2, t) {
        return j2(rr2(n2, t), ht2);
      }
      function Hl(n2, t, e) {
        return e = e === i ? 1 : R2(e), j2(rr2(n2, t), e);
      }
      function Zu(n2, t) {
        var e = O2(n2) ? mn : rt2;
        return e(n2, x2(t, 3));
      }
      function Ju(n2, t) {
        var e = O2(n2) ? ko : zs2;
        return e(n2, x2(t, 3));
      }
      var Nl = Je2(function(n2, t, e) {
        F2.call(n2, e) ? n2[e].push(t) : zn2(n2, e, [t]);
      });
      function $l(n2, t, e, r) {
        n2 = an2(n2) ? n2 : Gt2(n2), e = e && !r ? R2(e) : 0;
        var s = n2.length;
        return e < 0 && (e = Q3(s + e, 0)), or2(n2) ? e <= s && n2.indexOf(t, e) > -1 : !!s && Tt2(n2, t, e) > -1;
      }
      var Ul = L2(function(n2, t, e) {
        var r = -1, s = typeof t == "function", o = an2(n2) ? p3(n2.length) : [];
        return rt2(n2, function(f2) {
          o[++r] = s ? cn2(t, f2, e) : ae2(f2, t, e);
        }), o;
      }), Wl = Je2(function(n2, t, e) {
        zn2(n2, e, t);
      });
      function rr2(n2, t) {
        var e = O2(n2) ? G2 : Vs2;
        return e(n2, x2(t, 3));
      }
      function Fl(n2, t, e, r) {
        return n2 == null ? [] : (O2(t) || (t = t == null ? [] : [t]), e = r ? i : e, O2(e) || (e = e == null ? [] : [e]), tu(n2, t, e));
      }
      var Ml = Je2(function(n2, t, e) {
        n2[e ? 0 : 1].push(t);
      }, function() {
        return [[], []];
      });
      function ql(n2, t, e) {
        var r = O2(n2) ? Hr : Es2, s = arguments.length < 3;
        return r(n2, x2(t, 4), e, s, rt2);
      }
      function Bl(n2, t, e) {
        var r = O2(n2) ? jo : Es2, s = arguments.length < 3;
        return r(n2, x2(t, 4), e, s, zs2);
      }
      function Gl(n2, t) {
        var e = O2(n2) ? jn2 : Ks2;
        return e(n2, ur2(x2(t, 3)));
      }
      function zl(n2) {
        var t = O2(n2) ? Ms2 : $c;
        return t(n2);
      }
      function Kl(n2, t, e) {
        (e ? rn(n2, t, e) : t === i) ? t = 1 : t = R2(t);
        var r = O2(n2) ? pc : Uc;
        return r(n2, t);
      }
      function Yl(n2) {
        var t = O2(n2) ? dc : Fc;
        return t(n2);
      }
      function Zl(n2) {
        if (n2 == null)
          return 0;
        if (an2(n2))
          return or2(n2) ? Dt2(n2) : n2.length;
        var t = tn(n2);
        return t == yn || t == Sn ? n2.size : jr(n2).length;
      }
      function Jl(n2, t, e) {
        var r = O2(n2) ? Nr : Mc;
        return e && rn(n2, t, e) && (t = i), r(n2, x2(t, 3));
      }
      var Xl = L2(function(n2, t) {
        if (n2 == null)
          return [];
        var e = t.length;
        return e > 1 && rn(n2, t[0], t[1]) ? t = [] : e > 2 && rn(t[0], t[1], t[2]) && (t = [t[0]]), tu(n2, j2(t, 1), []);
      }), ir2 = Rf || function() {
        return k2.Date.now();
      };
      function Ql(n2, t) {
        if (typeof t != "function")
          throw new wn($2);
        return n2 = R2(n2), function() {
          if (--n2 < 1)
            return t.apply(this, arguments);
        };
      }
      function Xu(n2, t, e) {
        return t = e ? i : t, t = n2 && t == null ? n2.length : t, Kn2(n2, Mn2, i, i, i, i, t);
      }
      function Qu(n2, t) {
        var e;
        if (typeof t != "function")
          throw new wn($2);
        return n2 = R2(n2), function() {
          return --n2 > 0 && (e = t.apply(this, arguments)), n2 <= 1 && (t = i), e;
        };
      }
      var Ii = L2(function(n2, t, e) {
        var r = vn;
        if (e.length) {
          var s = tt2(e, qt2(Ii));
          r |= Hn;
        }
        return Kn2(n2, r, t, e, s);
      }), Vu = L2(function(n2, t, e) {
        var r = vn | ct2;
        if (e.length) {
          var s = tt2(e, qt2(Vu));
          r |= Hn;
        }
        return Kn2(t, r, n2, e, s);
      });
      function ku(n2, t, e) {
        t = e ? i : t;
        var r = Kn2(n2, Dn2, i, i, i, i, i, t);
        return r.placeholder = ku.placeholder, r;
      }
      function ju(n2, t, e) {
        t = e ? i : t;
        var r = Kn2(n2, yt2, i, i, i, i, i, t);
        return r.placeholder = ju.placeholder, r;
      }
      function na(n2, t, e) {
        var r, s, o, f2, c2, l2, v2 = 0, _3 = false, m2 = false, P2 = true;
        if (typeof n2 != "function")
          throw new wn($2);
        t = xn2(t) || 0, K3(e) && (_3 = !!e.leading, m2 = "maxWait" in e, o = m2 ? Q3(xn2(e.maxWait) || 0, t) : o, P2 = "trailing" in e ? !!e.trailing : P2);
        function I2(J) {
          var Tn = r, Qn = s;
          return r = s = i, v2 = J, f2 = n2.apply(Qn, Tn), f2;
        }
        function E3(J) {
          return v2 = J, c2 = le2(D2, t), _3 ? I2(J) : f2;
        }
        function b3(J) {
          var Tn = J - l2, Qn = J - v2, wa = t - Tn;
          return m2 ? nn(wa, o - Qn) : wa;
        }
        function y3(J) {
          var Tn = J - l2, Qn = J - v2;
          return l2 === i || Tn >= t || Tn < 0 || m2 && Qn >= o;
        }
        function D2() {
          var J = ir2();
          if (y3(J))
            return N2(J);
          c2 = le2(D2, b3(J));
        }
        function N2(J) {
          return c2 = i, P2 && r ? I2(J) : (r = s = i, f2);
        }
        function dn() {
          c2 !== i && cu(c2), v2 = 0, r = l2 = s = c2 = i;
        }
        function sn() {
          return c2 === i ? f2 : N2(ir2());
        }
        function gn() {
          var J = ir2(), Tn = y3(J);
          if (r = arguments, s = this, l2 = J, Tn) {
            if (c2 === i)
              return E3(l2);
            if (m2)
              return cu(c2), c2 = le2(D2, t), I2(l2);
          }
          return c2 === i && (c2 = le2(D2, t)), f2;
        }
        return gn.cancel = dn, gn.flush = sn, gn;
      }
      var Vl = L2(function(n2, t) {
        return Gs2(n2, 1, t);
      }), kl = L2(function(n2, t, e) {
        return Gs2(n2, xn2(t) || 0, e);
      });
      function jl(n2) {
        return Kn2(n2, dr);
      }
      function sr2(n2, t) {
        if (typeof n2 != "function" || t != null && typeof t != "function")
          throw new wn($2);
        var e = function() {
          var r = arguments, s = t ? t.apply(this, r) : r[0], o = e.cache;
          if (o.has(s))
            return o.get(s);
          var f2 = n2.apply(this, r);
          return e.cache = o.set(s, f2) || o, f2;
        };
        return e.cache = new (sr2.Cache || Gn)(), e;
      }
      sr2.Cache = Gn;
      function ur2(n2) {
        if (typeof n2 != "function")
          throw new wn($2);
        return function() {
          var t = arguments;
          switch (t.length) {
            case 0:
              return !n2.call(this);
            case 1:
              return !n2.call(this, t[0]);
            case 2:
              return !n2.call(this, t[0], t[1]);
            case 3:
              return !n2.call(this, t[0], t[1], t[2]);
          }
          return !n2.apply(this, t);
        };
      }
      function np(n2) {
        return Qu(2, n2);
      }
      var tp = qc(function(n2, t) {
        t = t.length == 1 && O2(t[0]) ? G2(t[0], hn(x2())) : G2(j2(t, 1), hn(x2()));
        var e = t.length;
        return L2(function(r) {
          for (var s = -1, o = nn(r.length, e); ++s < o; )
            r[s] = t[s].call(this, r[s]);
          return cn2(n2, this, r);
        });
      }), xi = L2(function(n2, t) {
        var e = tt2(t, qt2(xi));
        return Kn2(n2, Hn, i, t, e);
      }), ta = L2(function(n2, t) {
        var e = tt2(t, qt2(ta));
        return Kn2(n2, St2, i, t, e);
      }), ep = Yn(function(n2, t) {
        return Kn2(n2, Kt2, i, i, i, t);
      });
      function rp(n2, t) {
        if (typeof n2 != "function")
          throw new wn($2);
        return t = t === i ? t : R2(t), L2(n2, t);
      }
      function ip(n2, t) {
        if (typeof n2 != "function")
          throw new wn($2);
        return t = t == null ? 0 : Q3(R2(t), 0), L2(function(e) {
          var r = e[t], s = ut2(e, 0, t);
          return r && nt2(s, r), cn2(n2, this, s);
        });
      }
      function sp(n2, t, e) {
        var r = true, s = true;
        if (typeof n2 != "function")
          throw new wn($2);
        return K3(e) && (r = "leading" in e ? !!e.leading : r, s = "trailing" in e ? !!e.trailing : s), na(n2, t, { leading: r, maxWait: t, trailing: s });
      }
      function up(n2) {
        return Xu(n2, 1);
      }
      function ap(n2, t) {
        return xi(oi(t), n2);
      }
      function op() {
        if (!arguments.length)
          return [];
        var n2 = arguments[0];
        return O2(n2) ? n2 : [n2];
      }
      function fp(n2) {
        return An(n2, xt2);
      }
      function cp(n2, t) {
        return t = typeof t == "function" ? t : i, An(n2, xt2, t);
      }
      function hp(n2) {
        return An(n2, Ln2 | xt2);
      }
      function lp(n2, t) {
        return t = typeof t == "function" ? t : i, An(n2, Ln2 | xt2, t);
      }
      function pp(n2, t) {
        return t == null || Bs2(n2, t, V2(t));
      }
      function bn(n2, t) {
        return n2 === t || n2 !== n2 && t !== t;
      }
      var dp = ke2(Qr), gp = ke2(function(n2, t) {
        return n2 >= t;
      }), Pt2 = Js2(function() {
        return arguments;
      }()) ? Js2 : function(n2) {
        return Y(n2) && F2.call(n2, "callee") && !Hs2.call(n2, "callee");
      }, O2 = p3.isArray, vp = gs2 ? hn(gs2) : xc;
      function an2(n2) {
        return n2 != null && ar2(n2.length) && !Jn2(n2);
      }
      function Z2(n2) {
        return Y(n2) && an2(n2);
      }
      function _p(n2) {
        return n2 === true || n2 === false || Y(n2) && en(n2) == Yt;
      }
      var at2 = Tf || Ni, mp = vs2 ? hn(vs2) : Ec;
      function wp(n2) {
        return Y(n2) && n2.nodeType === 1 && !pe2(n2);
      }
      function Pp(n2) {
        if (n2 == null)
          return true;
        if (an2(n2) && (O2(n2) || typeof n2 == "string" || typeof n2.splice == "function" || at2(n2) || Bt2(n2) || Pt2(n2)))
          return !n2.length;
        var t = tn(n2);
        if (t == yn || t == Sn)
          return !n2.size;
        if (he2(n2))
          return !jr(n2).length;
        for (var e in n2)
          if (F2.call(n2, e))
            return false;
        return true;
      }
      function Ap(n2, t) {
        return oe2(n2, t);
      }
      function Cp(n2, t, e) {
        e = typeof e == "function" ? e : i;
        var r = e ? e(n2, t) : i;
        return r === i ? oe2(n2, t, i, e) : !!r;
      }
      function Ei(n2) {
        if (!Y(n2))
          return false;
        var t = en(n2);
        return t == we || t == Ga || typeof n2.message == "string" && typeof n2.name == "string" && !pe2(n2);
      }
      function Ip(n2) {
        return typeof n2 == "number" && $s2(n2);
      }
      function Jn2(n2) {
        if (!K3(n2))
          return false;
        var t = en(n2);
        return t == Pe || t == Gi2 || t == Ba || t == Ka;
      }
      function ea(n2) {
        return typeof n2 == "number" && n2 == R2(n2);
      }
      function ar2(n2) {
        return typeof n2 == "number" && n2 > -1 && n2 % 1 == 0 && n2 <= kn2;
      }
      function K3(n2) {
        var t = typeof n2;
        return n2 != null && (t == "object" || t == "function");
      }
      function Y(n2) {
        return n2 != null && typeof n2 == "object";
      }
      var ra = _s2 ? hn(_s2) : Sc;
      function xp(n2, t) {
        return n2 === t || kr(n2, t, gi(t));
      }
      function Ep(n2, t, e) {
        return e = typeof e == "function" ? e : i, kr(n2, t, gi(t), e);
      }
      function yp(n2) {
        return ia(n2) && n2 != +n2;
      }
      function Sp(n2) {
        if (ch(n2))
          throw new S3(T2);
        return Xs2(n2);
      }
      function Op(n2) {
        return n2 === null;
      }
      function Rp(n2) {
        return n2 == null;
      }
      function ia(n2) {
        return typeof n2 == "number" || Y(n2) && en(n2) == Jt;
      }
      function pe2(n2) {
        if (!Y(n2) || en(n2) != qn)
          return false;
        var t = He2(n2);
        if (t === null)
          return true;
        var e = F2.call(t, "constructor") && t.constructor;
        return typeof e == "function" && e instanceof e && be.call(e) == Ef;
      }
      var yi = ms2 ? hn(ms2) : Oc;
      function bp(n2) {
        return ea(n2) && n2 >= -kn2 && n2 <= kn2;
      }
      var sa = ws2 ? hn(ws2) : Rc;
      function or2(n2) {
        return typeof n2 == "string" || !O2(n2) && Y(n2) && en(n2) == Qt2;
      }
      function pn(n2) {
        return typeof n2 == "symbol" || Y(n2) && en(n2) == Ae;
      }
      var Bt2 = Ps2 ? hn(Ps2) : bc;
      function Tp(n2) {
        return n2 === i;
      }
      function Lp(n2) {
        return Y(n2) && tn(n2) == Vt2;
      }
      function Dp(n2) {
        return Y(n2) && en(n2) == Za;
      }
      var Hp = ke2(ni), Np = ke2(function(n2, t) {
        return n2 <= t;
      });
      function ua(n2) {
        if (!n2)
          return [];
        if (an2(n2))
          return or2(n2) ? On(n2) : un2(n2);
        if (ne2 && n2[ne2])
          return pf(n2[ne2]());
        var t = tn(n2), e = t == yn ? qr : t == Sn ? Se : Gt2;
        return e(n2);
      }
      function Xn(n2) {
        if (!n2)
          return n2 === 0 ? n2 : 0;
        if (n2 = xn2(n2), n2 === ht2 || n2 === -ht2) {
          var t = n2 < 0 ? -1 : 1;
          return t * Wa;
        }
        return n2 === n2 ? n2 : 0;
      }
      function R2(n2) {
        var t = Xn(n2), e = t % 1;
        return t === t ? e ? t - e : t : 0;
      }
      function aa(n2) {
        return n2 ? vt2(R2(n2), 0, Nn) : 0;
      }
      function xn2(n2) {
        if (typeof n2 == "number")
          return n2;
        if (pn(n2))
          return _e;
        if (K3(n2)) {
          var t = typeof n2.valueOf == "function" ? n2.valueOf() : n2;
          n2 = K3(t) ? t + "" : t;
        }
        if (typeof n2 != "string")
          return n2 === 0 ? n2 : +n2;
        n2 = ys2(n2);
        var e = go.test(n2);
        return e || _o.test(n2) ? Xo(n2.slice(2), e ? 2 : 8) : po.test(n2) ? _e : +n2;
      }
      function oa(n2) {
        return Un(n2, on(n2));
      }
      function $p(n2) {
        return n2 ? vt2(R2(n2), -kn2, kn2) : n2 === 0 ? n2 : 0;
      }
      function W2(n2) {
        return n2 == null ? "" : ln(n2);
      }
      var Up = Ft2(function(n2, t) {
        if (he2(t) || an2(t)) {
          Un(t, V2(t), n2);
          return;
        }
        for (var e in t)
          F2.call(t, e) && se(n2, e, t[e]);
      }), fa = Ft2(function(n2, t) {
        Un(t, on(t), n2);
      }), fr2 = Ft2(function(n2, t, e, r) {
        Un(t, on(t), n2, r);
      }), Wp = Ft2(function(n2, t, e, r) {
        Un(t, V2(t), n2, r);
      }), Fp = Yn(Zr);
      function Mp(n2, t) {
        var e = Wt2(n2);
        return t == null ? e : qs2(e, t);
      }
      var qp = L2(function(n2, t) {
        n2 = M2(n2);
        var e = -1, r = t.length, s = r > 2 ? t[2] : i;
        for (s && rn(t[0], t[1], s) && (r = 1); ++e < r; )
          for (var o = t[e], f2 = on(o), c2 = -1, l2 = f2.length; ++c2 < l2; ) {
            var v2 = f2[c2], _3 = n2[v2];
            (_3 === i || bn(_3, Nt2[v2]) && !F2.call(n2, v2)) && (n2[v2] = o[v2]);
          }
        return n2;
      }), Bp = L2(function(n2) {
        return n2.push(i, yu), cn2(ca, i, n2);
      });
      function Gp(n2, t) {
        return Cs2(n2, x2(t, 3), $n);
      }
      function zp(n2, t) {
        return Cs2(n2, x2(t, 3), Xr);
      }
      function Kp(n2, t) {
        return n2 == null ? n2 : Jr(n2, x2(t, 3), on);
      }
      function Yp(n2, t) {
        return n2 == null ? n2 : Ys2(n2, x2(t, 3), on);
      }
      function Zp(n2, t) {
        return n2 && $n(n2, x2(t, 3));
      }
      function Jp(n2, t) {
        return n2 && Xr(n2, x2(t, 3));
      }
      function Xp(n2) {
        return n2 == null ? [] : ze2(n2, V2(n2));
      }
      function Qp(n2) {
        return n2 == null ? [] : ze2(n2, on(n2));
      }
      function Si(n2, t, e) {
        var r = n2 == null ? i : _t2(n2, t);
        return r === i ? e : r;
      }
      function Vp(n2, t) {
        return n2 != null && Ru(n2, t, Pc);
      }
      function Oi(n2, t) {
        return n2 != null && Ru(n2, t, Ac);
      }
      var kp = Au(function(n2, t, e) {
        t != null && typeof t.toString != "function" && (t = Te.call(t)), n2[t] = e;
      }, bi(fn)), jp = Au(function(n2, t, e) {
        t != null && typeof t.toString != "function" && (t = Te.call(t)), F2.call(n2, t) ? n2[t].push(e) : n2[t] = [e];
      }, x2), nd = L2(ae2);
      function V2(n2) {
        return an2(n2) ? Fs2(n2) : jr(n2);
      }
      function on(n2) {
        return an2(n2) ? Fs2(n2, true) : Tc(n2);
      }
      function td(n2, t) {
        var e = {};
        return t = x2(t, 3), $n(n2, function(r, s, o) {
          zn2(e, t(r, s, o), r);
        }), e;
      }
      function ed(n2, t) {
        var e = {};
        return t = x2(t, 3), $n(n2, function(r, s, o) {
          zn2(e, s, t(r, s, o));
        }), e;
      }
      var rd = Ft2(function(n2, t, e) {
        Ke2(n2, t, e);
      }), ca = Ft2(function(n2, t, e, r) {
        Ke2(n2, t, e, r);
      }), id = Yn(function(n2, t) {
        var e = {};
        if (n2 == null)
          return e;
        var r = false;
        t = G2(t, function(o) {
          return o = st2(o, n2), r || (r = o.length > 1), o;
        }), Un(n2, pi(n2), e), r && (e = An(e, Ln2 | Fn2 | xt2, kc));
        for (var s = t.length; s--; )
          si(e, t[s]);
        return e;
      });
      function sd(n2, t) {
        return ha(n2, ur2(x2(t)));
      }
      var ud = Yn(function(n2, t) {
        return n2 == null ? {} : Dc(n2, t);
      });
      function ha(n2, t) {
        if (n2 == null)
          return {};
        var e = G2(pi(n2), function(r) {
          return [r];
        });
        return t = x2(t), eu(n2, e, function(r, s) {
          return t(r, s[0]);
        });
      }
      function ad(n2, t, e) {
        t = st2(t, n2);
        var r = -1, s = t.length;
        for (s || (s = 1, n2 = i); ++r < s; ) {
          var o = n2 == null ? i : n2[Wn(t[r])];
          o === i && (r = s, o = e), n2 = Jn2(o) ? o.call(n2) : o;
        }
        return n2;
      }
      function od(n2, t, e) {
        return n2 == null ? n2 : fe(n2, t, e);
      }
      function fd(n2, t, e, r) {
        return r = typeof r == "function" ? r : i, n2 == null ? n2 : fe(n2, t, e, r);
      }
      var la = xu(V2), pa = xu(on);
      function cd(n2, t, e) {
        var r = O2(n2), s = r || at2(n2) || Bt2(n2);
        if (t = x2(t, 4), e == null) {
          var o = n2 && n2.constructor;
          s ? e = r ? new o() : [] : K3(n2) ? e = Jn2(o) ? Wt2(He2(n2)) : {} : e = {};
        }
        return (s ? mn : $n)(n2, function(f2, c2, l2) {
          return t(e, f2, c2, l2);
        }), e;
      }
      function hd(n2, t) {
        return n2 == null ? true : si(n2, t);
      }
      function ld(n2, t, e) {
        return n2 == null ? n2 : au(n2, t, oi(e));
      }
      function pd(n2, t, e, r) {
        return r = typeof r == "function" ? r : i, n2 == null ? n2 : au(n2, t, oi(e), r);
      }
      function Gt2(n2) {
        return n2 == null ? [] : Mr(n2, V2(n2));
      }
      function dd(n2) {
        return n2 == null ? [] : Mr(n2, on(n2));
      }
      function gd(n2, t, e) {
        return e === i && (e = t, t = i), e !== i && (e = xn2(e), e = e === e ? e : 0), t !== i && (t = xn2(t), t = t === t ? t : 0), vt2(xn2(n2), t, e);
      }
      function vd(n2, t, e) {
        return t = Xn(t), e === i ? (e = t, t = 0) : e = Xn(e), n2 = xn2(n2), Cc(n2, t, e);
      }
      function _d(n2, t, e) {
        if (e && typeof e != "boolean" && rn(n2, t, e) && (t = e = i), e === i && (typeof t == "boolean" ? (e = t, t = i) : typeof n2 == "boolean" && (e = n2, n2 = i)), n2 === i && t === i ? (n2 = 0, t = 1) : (n2 = Xn(n2), t === i ? (t = n2, n2 = 0) : t = Xn(t)), n2 > t) {
          var r = n2;
          n2 = t, t = r;
        }
        if (e || n2 % 1 || t % 1) {
          var s = Us2();
          return nn(n2 + s * (t - n2 + Jo("1e-" + ((s + "").length - 1))), t);
        }
        return ei(n2, t);
      }
      var md = Mt2(function(n2, t, e) {
        return t = t.toLowerCase(), n2 + (e ? da(t) : t);
      });
      function da(n2) {
        return Ri(W2(n2).toLowerCase());
      }
      function ga(n2) {
        return n2 = W2(n2), n2 && n2.replace(wo, of).replace(Wo, "");
      }
      function wd(n2, t, e) {
        n2 = W2(n2), t = ln(t);
        var r = n2.length;
        e = e === i ? r : vt2(R2(e), 0, r);
        var s = e;
        return e -= t.length, e >= 0 && n2.slice(e, s) == t;
      }
      function Pd(n2) {
        return n2 = W2(n2), n2 && ka.test(n2) ? n2.replace(Yi2, ff) : n2;
      }
      function Ad(n2) {
        return n2 = W2(n2), n2 && io.test(n2) ? n2.replace(xr2, "\\$&") : n2;
      }
      var Cd = Mt2(function(n2, t, e) {
        return n2 + (e ? "-" : "") + t.toLowerCase();
      }), Id = Mt2(function(n2, t, e) {
        return n2 + (e ? " " : "") + t.toLowerCase();
      }), xd = mu("toLowerCase");
      function Ed(n2, t, e) {
        n2 = W2(n2), t = R2(t);
        var r = t ? Dt2(n2) : 0;
        if (!t || r >= t)
          return n2;
        var s = (t - r) / 2;
        return Ve2(We2(s), e) + n2 + Ve2(Ue2(s), e);
      }
      function yd(n2, t, e) {
        n2 = W2(n2), t = R2(t);
        var r = t ? Dt2(n2) : 0;
        return t && r < t ? n2 + Ve2(t - r, e) : n2;
      }
      function Sd(n2, t, e) {
        n2 = W2(n2), t = R2(t);
        var r = t ? Dt2(n2) : 0;
        return t && r < t ? Ve2(t - r, e) + n2 : n2;
      }
      function Od(n2, t, e) {
        return e || t == null ? t = 0 : t && (t = +t), Nf(W2(n2).replace(Er2, ""), t || 0);
      }
      function Rd(n2, t, e) {
        return (e ? rn(n2, t, e) : t === i) ? t = 1 : t = R2(t), ri(W2(n2), t);
      }
      function bd() {
        var n2 = arguments, t = W2(n2[0]);
        return n2.length < 3 ? t : t.replace(n2[1], n2[2]);
      }
      var Td = Mt2(function(n2, t, e) {
        return n2 + (e ? "_" : "") + t.toLowerCase();
      });
      function Ld(n2, t, e) {
        return e && typeof e != "number" && rn(n2, t, e) && (t = e = i), e = e === i ? Nn : e >>> 0, e ? (n2 = W2(n2), n2 && (typeof t == "string" || t != null && !yi(t)) && (t = ln(t), !t && Lt2(n2)) ? ut2(On(n2), 0, e) : n2.split(t, e)) : [];
      }
      var Dd = Mt2(function(n2, t, e) {
        return n2 + (e ? " " : "") + Ri(t);
      });
      function Hd(n2, t, e) {
        return n2 = W2(n2), e = e == null ? 0 : vt2(R2(e), 0, n2.length), t = ln(t), n2.slice(e, e + t.length) == t;
      }
      function Nd(n2, t, e) {
        var r = a2.templateSettings;
        e && rn(n2, t, e) && (t = i), n2 = W2(n2), t = fr2({}, t, r, Eu);
        var s = fr2({}, t.imports, r.imports, Eu), o = V2(s), f2 = Mr(s, o), c2, l2, v2 = 0, _3 = t.interpolate || Ce, m2 = "__p += '", P2 = Br((t.escape || Ce).source + "|" + _3.source + "|" + (_3 === Zi2 ? lo : Ce).source + "|" + (t.evaluate || Ce).source + "|$", "g"), I2 = "//# sourceURL=" + (F2.call(t, "sourceURL") ? (t.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Go + "]") + `
`;
        n2.replace(P2, function(y3, D2, N2, dn, sn, gn) {
          return N2 || (N2 = dn), m2 += n2.slice(v2, gn).replace(Po, cf), D2 && (c2 = true, m2 += `' +
__e(` + D2 + `) +
'`), sn && (l2 = true, m2 += `';
` + sn + `;
__p += '`), N2 && (m2 += `' +
((__t = (` + N2 + `)) == null ? '' : __t) +
'`), v2 = gn + y3.length, y3;
        }), m2 += `';
`;
        var E3 = F2.call(t, "variable") && t.variable;
        if (!E3)
          m2 = `with (obj) {
` + m2 + `
}
`;
        else if (co.test(E3))
          throw new S3(En);
        m2 = (l2 ? m2.replace(Ja, "") : m2).replace(Xa, "$1").replace(Qa, "$1;"), m2 = "function(" + (E3 || "obj") + `) {
` + (E3 ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (c2 ? ", __e = _.escape" : "") + (l2 ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + m2 + `return __p
}`;
        var b3 = _a(function() {
          return U2(o, I2 + "return " + m2).apply(i, f2);
        });
        if (b3.source = m2, Ei(b3))
          throw b3;
        return b3;
      }
      function $d(n2) {
        return W2(n2).toLowerCase();
      }
      function Ud(n2) {
        return W2(n2).toUpperCase();
      }
      function Wd(n2, t, e) {
        if (n2 = W2(n2), n2 && (e || t === i))
          return ys2(n2);
        if (!n2 || !(t = ln(t)))
          return n2;
        var r = On(n2), s = On(t), o = Ss2(r, s), f2 = Os2(r, s) + 1;
        return ut2(r, o, f2).join("");
      }
      function Fd(n2, t, e) {
        if (n2 = W2(n2), n2 && (e || t === i))
          return n2.slice(0, bs2(n2) + 1);
        if (!n2 || !(t = ln(t)))
          return n2;
        var r = On(n2), s = Os2(r, On(t)) + 1;
        return ut2(r, 0, s).join("");
      }
      function Md(n2, t, e) {
        if (n2 = W2(n2), n2 && (e || t === i))
          return n2.replace(Er2, "");
        if (!n2 || !(t = ln(t)))
          return n2;
        var r = On(n2), s = Ss2(r, On(t));
        return ut2(r, s).join("");
      }
      function qd(n2, t) {
        var e = La, r = Da;
        if (K3(t)) {
          var s = "separator" in t ? t.separator : s;
          e = "length" in t ? R2(t.length) : e, r = "omission" in t ? ln(t.omission) : r;
        }
        n2 = W2(n2);
        var o = n2.length;
        if (Lt2(n2)) {
          var f2 = On(n2);
          o = f2.length;
        }
        if (e >= o)
          return n2;
        var c2 = e - Dt2(r);
        if (c2 < 1)
          return r;
        var l2 = f2 ? ut2(f2, 0, c2).join("") : n2.slice(0, c2);
        if (s === i)
          return l2 + r;
        if (f2 && (c2 += l2.length - c2), yi(s)) {
          if (n2.slice(c2).search(s)) {
            var v2, _3 = l2;
            for (s.global || (s = Br(s.source, W2(Ji2.exec(s)) + "g")), s.lastIndex = 0; v2 = s.exec(_3); )
              var m2 = v2.index;
            l2 = l2.slice(0, m2 === i ? c2 : m2);
          }
        } else if (n2.indexOf(ln(s), c2) != c2) {
          var P2 = l2.lastIndexOf(s);
          P2 > -1 && (l2 = l2.slice(0, P2));
        }
        return l2 + r;
      }
      function Bd(n2) {
        return n2 = W2(n2), n2 && Va.test(n2) ? n2.replace(Ki2, _f) : n2;
      }
      var Gd = Mt2(function(n2, t, e) {
        return n2 + (e ? " " : "") + t.toUpperCase();
      }), Ri = mu("toUpperCase");
      function va(n2, t, e) {
        return n2 = W2(n2), t = e ? i : t, t === i ? lf(n2) ? Pf(n2) : ef(n2) : n2.match(t) || [];
      }
      var _a = L2(function(n2, t) {
        try {
          return cn2(n2, i, t);
        } catch (e) {
          return Ei(e) ? e : new S3(e);
        }
      }), zd = Yn(function(n2, t) {
        return mn(t, function(e) {
          e = Wn(e), zn2(n2, e, Ii(n2[e], n2));
        }), n2;
      });
      function Kd(n2) {
        var t = n2 == null ? 0 : n2.length, e = x2();
        return n2 = t ? G2(n2, function(r) {
          if (typeof r[1] != "function")
            throw new wn($2);
          return [e(r[0]), r[1]];
        }) : [], L2(function(r) {
          for (var s = -1; ++s < t; ) {
            var o = n2[s];
            if (cn2(o[0], this, r))
              return cn2(o[1], this, r);
          }
        });
      }
      function Yd(n2) {
        return _c(An(n2, Ln2));
      }
      function bi(n2) {
        return function() {
          return n2;
        };
      }
      function Zd(n2, t) {
        return n2 == null || n2 !== n2 ? t : n2;
      }
      var Jd = Pu(), Xd = Pu(true);
      function fn(n2) {
        return n2;
      }
      function Ti(n2) {
        return Qs2(typeof n2 == "function" ? n2 : An(n2, Ln2));
      }
      function Qd(n2) {
        return ks2(An(n2, Ln2));
      }
      function Vd(n2, t) {
        return js2(n2, An(t, Ln2));
      }
      var kd = L2(function(n2, t) {
        return function(e) {
          return ae2(e, n2, t);
        };
      }), jd = L2(function(n2, t) {
        return function(e) {
          return ae2(n2, e, t);
        };
      });
      function Li(n2, t, e) {
        var r = V2(t), s = ze2(t, r);
        e == null && !(K3(t) && (s.length || !r.length)) && (e = t, t = n2, n2 = this, s = ze2(t, V2(t)));
        var o = !(K3(e) && "chain" in e) || !!e.chain, f2 = Jn2(n2);
        return mn(s, function(c2) {
          var l2 = t[c2];
          n2[c2] = l2, f2 && (n2.prototype[c2] = function() {
            var v2 = this.__chain__;
            if (o || v2) {
              var _3 = n2(this.__wrapped__), m2 = _3.__actions__ = un2(this.__actions__);
              return m2.push({ func: l2, args: arguments, thisArg: n2 }), _3.__chain__ = v2, _3;
            }
            return l2.apply(n2, nt2([this.value()], arguments));
          });
        }), n2;
      }
      function ng() {
        return k2._ === this && (k2._ = yf), this;
      }
      function Di() {
      }
      function tg(n2) {
        return n2 = R2(n2), L2(function(t) {
          return nu(t, n2);
        });
      }
      var eg = ci(G2), rg = ci(As2), ig = ci(Nr);
      function ma(n2) {
        return _i(n2) ? $r(Wn(n2)) : Hc(n2);
      }
      function sg(n2) {
        return function(t) {
          return n2 == null ? i : _t2(n2, t);
        };
      }
      var ug = Cu(), ag = Cu(true);
      function Hi2() {
        return [];
      }
      function Ni() {
        return false;
      }
      function og() {
        return {};
      }
      function fg() {
        return "";
      }
      function cg() {
        return true;
      }
      function hg(n2, t) {
        if (n2 = R2(n2), n2 < 1 || n2 > kn2)
          return [];
        var e = Nn, r = nn(n2, Nn);
        t = x2(t), n2 -= Nn;
        for (var s = Fr(r, t); ++e < n2; )
          t(e);
        return s;
      }
      function lg(n2) {
        return O2(n2) ? G2(n2, Wn) : pn(n2) ? [n2] : un2(Wu(W2(n2)));
      }
      function pg(n2) {
        var t = ++xf;
        return W2(n2) + t;
      }
      var dg = Qe2(function(n2, t) {
        return n2 + t;
      }, 0), gg = hi("ceil"), vg = Qe2(function(n2, t) {
        return n2 / t;
      }, 1), _g = hi("floor");
      function mg(n2) {
        return n2 && n2.length ? Ge2(n2, fn, Qr) : i;
      }
      function wg(n2, t) {
        return n2 && n2.length ? Ge2(n2, x2(t, 2), Qr) : i;
      }
      function Pg(n2) {
        return xs2(n2, fn);
      }
      function Ag(n2, t) {
        return xs2(n2, x2(t, 2));
      }
      function Cg(n2) {
        return n2 && n2.length ? Ge2(n2, fn, ni) : i;
      }
      function Ig(n2, t) {
        return n2 && n2.length ? Ge2(n2, x2(t, 2), ni) : i;
      }
      var xg = Qe2(function(n2, t) {
        return n2 * t;
      }, 1), Eg = hi("round"), yg = Qe2(function(n2, t) {
        return n2 - t;
      }, 0);
      function Sg(n2) {
        return n2 && n2.length ? Wr(n2, fn) : 0;
      }
      function Og(n2, t) {
        return n2 && n2.length ? Wr(n2, x2(t, 2)) : 0;
      }
      return a2.after = Ql, a2.ary = Xu, a2.assign = Up, a2.assignIn = fa, a2.assignInWith = fr2, a2.assignWith = Wp, a2.at = Fp, a2.before = Qu, a2.bind = Ii, a2.bindAll = zd, a2.bindKey = Vu, a2.castArray = op, a2.chain = Yu, a2.chunk = _h, a2.compact = mh, a2.concat = wh, a2.cond = Kd, a2.conforms = Yd, a2.constant = bi, a2.countBy = Sl, a2.create = Mp, a2.curry = ku, a2.curryRight = ju, a2.debounce = na, a2.defaults = qp, a2.defaultsDeep = Bp, a2.defer = Vl, a2.delay = kl, a2.difference = Ph, a2.differenceBy = Ah, a2.differenceWith = Ch, a2.drop = Ih, a2.dropRight = xh, a2.dropRightWhile = Eh, a2.dropWhile = yh, a2.fill = Sh, a2.filter = Rl, a2.flatMap = Ll, a2.flatMapDeep = Dl, a2.flatMapDepth = Hl, a2.flatten = Bu, a2.flattenDeep = Oh, a2.flattenDepth = Rh, a2.flip = jl, a2.flow = Jd, a2.flowRight = Xd, a2.fromPairs = bh, a2.functions = Xp, a2.functionsIn = Qp, a2.groupBy = Nl, a2.initial = Lh, a2.intersection = Dh, a2.intersectionBy = Hh, a2.intersectionWith = Nh, a2.invert = kp, a2.invertBy = jp, a2.invokeMap = Ul, a2.iteratee = Ti, a2.keyBy = Wl, a2.keys = V2, a2.keysIn = on, a2.map = rr2, a2.mapKeys = td, a2.mapValues = ed, a2.matches = Qd, a2.matchesProperty = Vd, a2.memoize = sr2, a2.merge = rd, a2.mergeWith = ca, a2.method = kd, a2.methodOf = jd, a2.mixin = Li, a2.negate = ur2, a2.nthArg = tg, a2.omit = id, a2.omitBy = sd, a2.once = np, a2.orderBy = Fl, a2.over = eg, a2.overArgs = tp, a2.overEvery = rg, a2.overSome = ig, a2.partial = xi, a2.partialRight = ta, a2.partition = Ml, a2.pick = ud, a2.pickBy = ha, a2.property = ma, a2.propertyOf = sg, a2.pull = Fh, a2.pullAll = zu, a2.pullAllBy = Mh, a2.pullAllWith = qh, a2.pullAt = Bh, a2.range = ug, a2.rangeRight = ag, a2.rearg = ep, a2.reject = Gl, a2.remove = Gh, a2.rest = rp, a2.reverse = Ai, a2.sampleSize = Kl, a2.set = od, a2.setWith = fd, a2.shuffle = Yl, a2.slice = zh, a2.sortBy = Xl, a2.sortedUniq = Vh, a2.sortedUniqBy = kh, a2.split = Ld, a2.spread = ip, a2.tail = jh, a2.take = nl, a2.takeRight = tl, a2.takeRightWhile = el, a2.takeWhile = rl, a2.tap = ml, a2.throttle = sp, a2.thru = er2, a2.toArray = ua, a2.toPairs = la, a2.toPairsIn = pa, a2.toPath = lg, a2.toPlainObject = oa, a2.transform = cd, a2.unary = up, a2.union = il, a2.unionBy = sl, a2.unionWith = ul, a2.uniq = al, a2.uniqBy = ol, a2.uniqWith = fl, a2.unset = hd, a2.unzip = Ci, a2.unzipWith = Ku, a2.update = ld, a2.updateWith = pd, a2.values = Gt2, a2.valuesIn = dd, a2.without = cl, a2.words = va, a2.wrap = ap, a2.xor = hl, a2.xorBy = ll, a2.xorWith = pl, a2.zip = dl, a2.zipObject = gl, a2.zipObjectDeep = vl, a2.zipWith = _l, a2.entries = la, a2.entriesIn = pa, a2.extend = fa, a2.extendWith = fr2, Li(a2, a2), a2.add = dg, a2.attempt = _a, a2.camelCase = md, a2.capitalize = da, a2.ceil = gg, a2.clamp = gd, a2.clone = fp, a2.cloneDeep = hp, a2.cloneDeepWith = lp, a2.cloneWith = cp, a2.conformsTo = pp, a2.deburr = ga, a2.defaultTo = Zd, a2.divide = vg, a2.endsWith = wd, a2.eq = bn, a2.escape = Pd, a2.escapeRegExp = Ad, a2.every = Ol, a2.find = bl, a2.findIndex = Mu, a2.findKey = Gp, a2.findLast = Tl, a2.findLastIndex = qu, a2.findLastKey = zp, a2.floor = _g, a2.forEach = Zu, a2.forEachRight = Ju, a2.forIn = Kp, a2.forInRight = Yp, a2.forOwn = Zp, a2.forOwnRight = Jp, a2.get = Si, a2.gt = dp, a2.gte = gp, a2.has = Vp, a2.hasIn = Oi, a2.head = Gu, a2.identity = fn, a2.includes = $l, a2.indexOf = Th, a2.inRange = vd, a2.invoke = nd, a2.isArguments = Pt2, a2.isArray = O2, a2.isArrayBuffer = vp, a2.isArrayLike = an2, a2.isArrayLikeObject = Z2, a2.isBoolean = _p, a2.isBuffer = at2, a2.isDate = mp, a2.isElement = wp, a2.isEmpty = Pp, a2.isEqual = Ap, a2.isEqualWith = Cp, a2.isError = Ei, a2.isFinite = Ip, a2.isFunction = Jn2, a2.isInteger = ea, a2.isLength = ar2, a2.isMap = ra, a2.isMatch = xp, a2.isMatchWith = Ep, a2.isNaN = yp, a2.isNative = Sp, a2.isNil = Rp, a2.isNull = Op, a2.isNumber = ia, a2.isObject = K3, a2.isObjectLike = Y, a2.isPlainObject = pe2, a2.isRegExp = yi, a2.isSafeInteger = bp, a2.isSet = sa, a2.isString = or2, a2.isSymbol = pn, a2.isTypedArray = Bt2, a2.isUndefined = Tp, a2.isWeakMap = Lp, a2.isWeakSet = Dp, a2.join = $h, a2.kebabCase = Cd, a2.last = In, a2.lastIndexOf = Uh, a2.lowerCase = Id, a2.lowerFirst = xd, a2.lt = Hp, a2.lte = Np, a2.max = mg, a2.maxBy = wg, a2.mean = Pg, a2.meanBy = Ag, a2.min = Cg, a2.minBy = Ig, a2.stubArray = Hi2, a2.stubFalse = Ni, a2.stubObject = og, a2.stubString = fg, a2.stubTrue = cg, a2.multiply = xg, a2.nth = Wh, a2.noConflict = ng, a2.noop = Di, a2.now = ir2, a2.pad = Ed, a2.padEnd = yd, a2.padStart = Sd, a2.parseInt = Od, a2.random = _d, a2.reduce = ql, a2.reduceRight = Bl, a2.repeat = Rd, a2.replace = bd, a2.result = ad, a2.round = Eg, a2.runInContext = h3, a2.sample = zl, a2.size = Zl, a2.snakeCase = Td, a2.some = Jl, a2.sortedIndex = Kh, a2.sortedIndexBy = Yh, a2.sortedIndexOf = Zh, a2.sortedLastIndex = Jh, a2.sortedLastIndexBy = Xh, a2.sortedLastIndexOf = Qh, a2.startCase = Dd, a2.startsWith = Hd, a2.subtract = yg, a2.sum = Sg, a2.sumBy = Og, a2.template = Nd, a2.times = hg, a2.toFinite = Xn, a2.toInteger = R2, a2.toLength = aa, a2.toLower = $d, a2.toNumber = xn2, a2.toSafeInteger = $p, a2.toString = W2, a2.toUpper = Ud, a2.trim = Wd, a2.trimEnd = Fd, a2.trimStart = Md, a2.truncate = qd, a2.unescape = Bd, a2.uniqueId = pg, a2.upperCase = Gd, a2.upperFirst = Ri, a2.each = Zu, a2.eachRight = Ju, a2.first = Gu, Li(a2, function() {
        var n2 = {};
        return $n(a2, function(t, e) {
          F2.call(a2.prototype, e) || (n2[e] = t);
        }), n2;
      }(), { chain: false }), a2.VERSION = d2, mn(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(n2) {
        a2[n2].placeholder = a2;
      }), mn(["drop", "take"], function(n2, t) {
        H2.prototype[n2] = function(e) {
          e = e === i ? 1 : Q3(R2(e), 0);
          var r = this.__filtered__ && !t ? new H2(this) : this.clone();
          return r.__filtered__ ? r.__takeCount__ = nn(e, r.__takeCount__) : r.__views__.push({ size: nn(e, Nn), type: n2 + (r.__dir__ < 0 ? "Right" : "") }), r;
        }, H2.prototype[n2 + "Right"] = function(e) {
          return this.reverse()[n2](e).reverse();
        };
      }), mn(["filter", "map", "takeWhile"], function(n2, t) {
        var e = t + 1, r = e == Bi2 || e == Ua;
        H2.prototype[n2] = function(s) {
          var o = this.clone();
          return o.__iteratees__.push({ iteratee: x2(s, 3), type: e }), o.__filtered__ = o.__filtered__ || r, o;
        };
      }), mn(["head", "last"], function(n2, t) {
        var e = "take" + (t ? "Right" : "");
        H2.prototype[n2] = function() {
          return this[e](1).value()[0];
        };
      }), mn(["initial", "tail"], function(n2, t) {
        var e = "drop" + (t ? "" : "Right");
        H2.prototype[n2] = function() {
          return this.__filtered__ ? new H2(this) : this[e](1);
        };
      }), H2.prototype.compact = function() {
        return this.filter(fn);
      }, H2.prototype.find = function(n2) {
        return this.filter(n2).head();
      }, H2.prototype.findLast = function(n2) {
        return this.reverse().find(n2);
      }, H2.prototype.invokeMap = L2(function(n2, t) {
        return typeof n2 == "function" ? new H2(this) : this.map(function(e) {
          return ae2(e, n2, t);
        });
      }), H2.prototype.reject = function(n2) {
        return this.filter(ur2(x2(n2)));
      }, H2.prototype.slice = function(n2, t) {
        n2 = R2(n2);
        var e = this;
        return e.__filtered__ && (n2 > 0 || t < 0) ? new H2(e) : (n2 < 0 ? e = e.takeRight(-n2) : n2 && (e = e.drop(n2)), t !== i && (t = R2(t), e = t < 0 ? e.dropRight(-t) : e.take(t - n2)), e);
      }, H2.prototype.takeRightWhile = function(n2) {
        return this.reverse().takeWhile(n2).reverse();
      }, H2.prototype.toArray = function() {
        return this.take(Nn);
      }, $n(H2.prototype, function(n2, t) {
        var e = /^(?:filter|find|map|reject)|While$/.test(t), r = /^(?:head|last)$/.test(t), s = a2[r ? "take" + (t == "last" ? "Right" : "") : t], o = r || /^find/.test(t);
        s && (a2.prototype[t] = function() {
          var f2 = this.__wrapped__, c2 = r ? [1] : arguments, l2 = f2 instanceof H2, v2 = c2[0], _3 = l2 || O2(f2), m2 = function(D2) {
            var N2 = s.apply(a2, nt2([D2], c2));
            return r && P2 ? N2[0] : N2;
          };
          _3 && e && typeof v2 == "function" && v2.length != 1 && (l2 = _3 = false);
          var P2 = this.__chain__, I2 = !!this.__actions__.length, E3 = o && !P2, b3 = l2 && !I2;
          if (!o && _3) {
            f2 = b3 ? f2 : new H2(this);
            var y3 = n2.apply(f2, c2);
            return y3.__actions__.push({ func: er2, args: [m2], thisArg: i }), new Pn(y3, P2);
          }
          return E3 && b3 ? n2.apply(this, c2) : (y3 = this.thru(m2), E3 ? r ? y3.value()[0] : y3.value() : y3);
        });
      }), mn(["pop", "push", "shift", "sort", "splice", "unshift"], function(n2) {
        var t = Oe[n2], e = /^(?:push|sort|unshift)$/.test(n2) ? "tap" : "thru", r = /^(?:pop|shift)$/.test(n2);
        a2.prototype[n2] = function() {
          var s = arguments;
          if (r && !this.__chain__) {
            var o = this.value();
            return t.apply(O2(o) ? o : [], s);
          }
          return this[e](function(f2) {
            return t.apply(O2(f2) ? f2 : [], s);
          });
        };
      }), $n(H2.prototype, function(n2, t) {
        var e = a2[t];
        if (e) {
          var r = e.name + "";
          F2.call(Ut2, r) || (Ut2[r] = []), Ut2[r].push({ name: t, func: e });
        }
      }), Ut2[Xe2(i, ct2).name] = [{ name: "wrapper", func: i }], H2.prototype.clone = Bf, H2.prototype.reverse = Gf, H2.prototype.value = zf, a2.prototype.at = wl, a2.prototype.chain = Pl, a2.prototype.commit = Al, a2.prototype.next = Cl, a2.prototype.plant = xl, a2.prototype.reverse = El, a2.prototype.toJSON = a2.prototype.valueOf = a2.prototype.value = yl, a2.prototype.first = a2.prototype.head, ne2 && (a2.prototype[ne2] = Il), a2;
    }, Ht2 = Af();
    lt2 ? ((lt2.exports = Ht2)._ = Ht2, Tr2._ = Ht2) : k2._ = Ht2;
  }).call(ge);
})(Ui, Ui.exports);
var qg = Object.defineProperty, Bg = Object.defineProperties, Gg = Object.getOwnPropertyDescriptors, Ea = Object.getOwnPropertySymbols, zg = Object.prototype.hasOwnProperty, Kg = Object.prototype.propertyIsEnumerable, ya = (C, u3, i) => u3 in C ? qg(C, u3, { enumerable: true, configurable: true, writable: true, value: i }) : C[u3] = i, cr = (C, u3) => {
  for (var i in u3 || (u3 = {}))
    zg.call(u3, i) && ya(C, i, u3[i]);
  if (Ea)
    for (var i of Ea(u3))
      Kg.call(u3, i) && ya(C, i, u3[i]);
  return C;
}, Yg = (C, u3) => Bg(C, Gg(u3));
function ft(C, u3, i) {
  var d2;
  const w2 = ve(C);
  return ((d2 = u3.rpcMap) == null ? void 0 : d2[w2.reference]) || `${Mg}?chainId=${w2.namespace}:${w2.reference}&projectId=${i}`;
}
function Ct(C) {
  return C.includes(":") ? C.split(":")[1] : C;
}
function Sa(C) {
  return C.map((u3) => `${u3.split(":")[0]}:${u3.split(":")[1]}`);
}
function Zg(C, u3) {
  const i = Object.keys(u3.namespaces).filter((w2) => w2.includes(C));
  if (!i.length)
    return [];
  const d2 = [];
  return i.forEach((w2) => {
    const T2 = u3.namespaces[w2].accounts;
    d2.push(...T2);
  }), d2;
}
function Jg(C = {}, u3 = {}) {
  const i = Oa(C), d2 = Oa(u3);
  return Ui.exports.merge(i, d2);
}
function Oa(C) {
  var u3, i, d2, w2;
  const T2 = {};
  if (!B$1(C))
    return T2;
  for (const [$2, En] of Object.entries(C)) {
    const zt2 = oe$2($2) ? [$2] : En.chains, pr = En.methods || [], It2 = En.events || [], Ln2 = En.rpcMap || {}, Fn2 = Xe$1($2);
    T2[Fn2] = Yg(cr(cr({}, T2[Fn2]), En), { chains: S$2(zt2, (u3 = T2[Fn2]) == null ? void 0 : u3.chains), methods: S$2(pr, (i = T2[Fn2]) == null ? void 0 : i.methods), events: S$2(It2, (d2 = T2[Fn2]) == null ? void 0 : d2.events), rpcMap: cr(cr({}, Ln2), (w2 = T2[Fn2]) == null ? void 0 : w2.rpcMap) });
  }
  return T2;
}
function Xg(C) {
  return C.includes(":") ? C.split(":")[2] : C;
}
function Qg(C) {
  const u3 = {};
  for (const [i, d2] of Object.entries(C)) {
    const w2 = d2.methods || [], T2 = d2.events || [], $2 = d2.accounts || [], En = oe$2(i) ? [i] : d2.chains ? d2.chains : Sa(d2.accounts);
    u3[i] = { chains: En, methods: w2, events: T2, accounts: $2 };
  }
  return u3;
}
function Wi(C) {
  return typeof C == "number" ? C : C.includes("0x") ? parseInt(C, 16) : C.includes(":") ? Number(C.split(":")[1]) : Number(C);
}
const Ra = {}, z = (C) => Ra[C], Fi = (C, u3) => {
  Ra[C] = u3;
};
class Vg {
  constructor(u3) {
    this.name = "polkadot", this.namespace = u3.namespace, this.events = z("events"), this.client = z("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u3) {
    this.namespace = Object.assign(this.namespace, u3);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId)
      return this.chainId;
    if (this.namespace.defaultChain)
      return this.namespace.defaultChain;
    const u3 = this.namespace.chains[0];
    if (!u3)
      throw new Error("ChainId not found");
    return u3.split(":")[1];
  }
  request(u3) {
    return this.namespace.methods.includes(u3.request.method) ? this.client.request(u3) : this.getHttpProvider().request(u3.request);
  }
  setDefaultChain(u3, i) {
    this.httpProviders[u3] || this.setHttpProvider(u3, i), this.chainId = u3, this.events.emit(Vn.DEFAULT_CHAIN_CHANGED, `${this.name}:${u3}`);
  }
  getAccounts() {
    const u3 = this.namespace.accounts;
    return u3 ? u3.filter((i) => i.split(":")[1] === this.chainId.toString()).map((i) => i.split(":")[2]) || [] : [];
  }
  createHttpProviders() {
    const u3 = {};
    return this.namespace.chains.forEach((i) => {
      var d2;
      const w2 = Ct(i);
      u3[w2] = this.createHttpProvider(w2, (d2 = this.namespace.rpcMap) == null ? void 0 : d2[i]);
    }), u3;
  }
  getHttpProvider() {
    const u3 = `${this.name}:${this.chainId}`, i = this.httpProviders[u3];
    if (typeof i > "u")
      throw new Error(`JSON-RPC provider for ${u3} not found`);
    return i;
  }
  setHttpProvider(u3, i) {
    const d2 = this.createHttpProvider(u3, i);
    d2 && (this.httpProviders[u3] = d2);
  }
  createHttpProvider(u3, i) {
    const d2 = i || ft(u3, this.namespace, this.client.core.projectId);
    if (!d2)
      throw new Error(`No RPC url provided for chainId: ${u3}`);
    return new JsonRpcProvider(new HttpConnection(d2, z("disableProviderPing")));
  }
}
class kg {
  constructor(u3) {
    this.name = "eip155", this.namespace = u3.namespace, this.events = z("events"), this.client = z("client"), this.httpProviders = this.createHttpProviders(), this.chainId = parseInt(this.getDefaultChain());
  }
  async request(u3) {
    switch (u3.request.method) {
      case "eth_requestAccounts":
        return this.getAccounts();
      case "eth_accounts":
        return this.getAccounts();
      case "wallet_switchEthereumChain":
        return await this.handleSwitchChain(u3);
      case "eth_chainId":
        return parseInt(this.getDefaultChain());
    }
    return this.namespace.methods.includes(u3.request.method) ? await this.client.request(u3) : this.getHttpProvider().request(u3.request);
  }
  updateNamespace(u3) {
    this.namespace = Object.assign(this.namespace, u3);
  }
  setDefaultChain(u3, i) {
    this.httpProviders[u3] || this.setHttpProvider(parseInt(u3), i), this.chainId = parseInt(u3), this.events.emit(Vn.DEFAULT_CHAIN_CHANGED, `${this.name}:${u3}`);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId)
      return this.chainId.toString();
    if (this.namespace.defaultChain)
      return this.namespace.defaultChain;
    const u3 = this.namespace.chains[0];
    if (!u3)
      throw new Error("ChainId not found");
    return u3.split(":")[1];
  }
  createHttpProvider(u3, i) {
    const d2 = i || ft(`${this.name}:${u3}`, this.namespace, this.client.core.projectId);
    if (!d2)
      throw new Error(`No RPC url provided for chainId: ${u3}`);
    return new JsonRpcProvider(new HttpConnection(d2, z("disableProviderPing")));
  }
  setHttpProvider(u3, i) {
    const d2 = this.createHttpProvider(u3, i);
    d2 && (this.httpProviders[u3] = d2);
  }
  createHttpProviders() {
    const u3 = {};
    return this.namespace.chains.forEach((i) => {
      var d2;
      const w2 = parseInt(Ct(i));
      u3[w2] = this.createHttpProvider(w2, (d2 = this.namespace.rpcMap) == null ? void 0 : d2[i]);
    }), u3;
  }
  getAccounts() {
    const u3 = this.namespace.accounts;
    return u3 ? [...new Set(u3.filter((i) => i.split(":")[1] === this.chainId.toString()).map((i) => i.split(":")[2]))] : [];
  }
  getHttpProvider() {
    const u3 = this.chainId, i = this.httpProviders[u3];
    if (typeof i > "u")
      throw new Error(`JSON-RPC provider for ${u3} not found`);
    return i;
  }
  async handleSwitchChain(u3) {
    var i, d2;
    let w2 = u3.request.params ? (i = u3.request.params[0]) == null ? void 0 : i.chainId : "0x0";
    w2 = w2.startsWith("0x") ? w2 : `0x${w2}`;
    const T2 = parseInt(w2, 16);
    if (this.isChainApproved(T2))
      this.setDefaultChain(`${T2}`);
    else if (this.namespace.methods.includes("wallet_switchEthereumChain"))
      await this.client.request({ topic: u3.topic, request: { method: u3.request.method, params: [{ chainId: w2 }] }, chainId: (d2 = this.namespace.chains) == null ? void 0 : d2[0] }), this.setDefaultChain(`${T2}`);
    else
      throw new Error(`Failed to switch to chain 'eip155:${T2}'. The chain is not approved or the wallet does not support 'wallet_switchEthereumChain' method.`);
    return null;
  }
  isChainApproved(u3) {
    return this.namespace.chains.includes(`${this.name}:${u3}`);
  }
}
class jg {
  constructor(u3) {
    this.name = "solana", this.namespace = u3.namespace, this.events = z("events"), this.client = z("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u3) {
    this.namespace = Object.assign(this.namespace, u3);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(u3) {
    return this.namespace.methods.includes(u3.request.method) ? this.client.request(u3) : this.getHttpProvider().request(u3.request);
  }
  setDefaultChain(u3, i) {
    this.httpProviders[u3] || this.setHttpProvider(u3, i), this.chainId = u3, this.events.emit(Vn.DEFAULT_CHAIN_CHANGED, `${this.name}:${u3}`);
  }
  getDefaultChain() {
    if (this.chainId)
      return this.chainId;
    if (this.namespace.defaultChain)
      return this.namespace.defaultChain;
    const u3 = this.namespace.chains[0];
    if (!u3)
      throw new Error("ChainId not found");
    return u3.split(":")[1];
  }
  getAccounts() {
    const u3 = this.namespace.accounts;
    return u3 ? [...new Set(u3.filter((i) => i.split(":")[1] === this.chainId.toString()).map((i) => i.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u3 = {};
    return this.namespace.chains.forEach((i) => {
      var d2;
      const w2 = Ct(i);
      u3[w2] = this.createHttpProvider(w2, (d2 = this.namespace.rpcMap) == null ? void 0 : d2[i]);
    }), u3;
  }
  getHttpProvider() {
    const u3 = `${this.name}:${this.chainId}`, i = this.httpProviders[u3];
    if (typeof i > "u")
      throw new Error(`JSON-RPC provider for ${u3} not found`);
    return i;
  }
  setHttpProvider(u3, i) {
    const d2 = this.createHttpProvider(u3, i);
    d2 && (this.httpProviders[u3] = d2);
  }
  createHttpProvider(u3, i) {
    const d2 = i || ft(u3, this.namespace, this.client.core.projectId);
    if (!d2)
      throw new Error(`No RPC url provided for chainId: ${u3}`);
    return new JsonRpcProvider(new HttpConnection(d2, z("disableProviderPing")));
  }
}
class nv {
  constructor(u3) {
    this.name = "cosmos", this.namespace = u3.namespace, this.events = z("events"), this.client = z("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u3) {
    this.namespace = Object.assign(this.namespace, u3);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId)
      return this.chainId;
    if (this.namespace.defaultChain)
      return this.namespace.defaultChain;
    const u3 = this.namespace.chains[0];
    if (!u3)
      throw new Error("ChainId not found");
    return u3.split(":")[1];
  }
  request(u3) {
    return this.namespace.methods.includes(u3.request.method) ? this.client.request(u3) : this.getHttpProvider().request(u3.request);
  }
  setDefaultChain(u3, i) {
    this.httpProviders[u3] || this.setHttpProvider(u3, i), this.chainId = u3, this.events.emit(Vn.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const u3 = this.namespace.accounts;
    return u3 ? [...new Set(u3.filter((i) => i.split(":")[1] === this.chainId.toString()).map((i) => i.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u3 = {};
    return this.namespace.chains.forEach((i) => {
      var d2;
      const w2 = Ct(i);
      u3[w2] = this.createHttpProvider(w2, (d2 = this.namespace.rpcMap) == null ? void 0 : d2[i]);
    }), u3;
  }
  getHttpProvider() {
    const u3 = `${this.name}:${this.chainId}`, i = this.httpProviders[u3];
    if (typeof i > "u")
      throw new Error(`JSON-RPC provider for ${u3} not found`);
    return i;
  }
  setHttpProvider(u3, i) {
    const d2 = this.createHttpProvider(u3, i);
    d2 && (this.httpProviders[u3] = d2);
  }
  createHttpProvider(u3, i) {
    const d2 = i || ft(u3, this.namespace, this.client.core.projectId);
    if (!d2)
      throw new Error(`No RPC url provided for chainId: ${u3}`);
    return new JsonRpcProvider(new HttpConnection(d2, z("disableProviderPing")));
  }
}
class tv {
  constructor(u3) {
    this.name = "cip34", this.namespace = u3.namespace, this.events = z("events"), this.client = z("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u3) {
    this.namespace = Object.assign(this.namespace, u3);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId)
      return this.chainId;
    if (this.namespace.defaultChain)
      return this.namespace.defaultChain;
    const u3 = this.namespace.chains[0];
    if (!u3)
      throw new Error("ChainId not found");
    return u3.split(":")[1];
  }
  request(u3) {
    return this.namespace.methods.includes(u3.request.method) ? this.client.request(u3) : this.getHttpProvider().request(u3.request);
  }
  setDefaultChain(u3, i) {
    this.httpProviders[u3] || this.setHttpProvider(u3, i), this.chainId = u3, this.events.emit(Vn.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const u3 = this.namespace.accounts;
    return u3 ? [...new Set(u3.filter((i) => i.split(":")[1] === this.chainId.toString()).map((i) => i.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u3 = {};
    return this.namespace.chains.forEach((i) => {
      const d2 = this.getCardanoRPCUrl(i), w2 = Ct(i);
      u3[w2] = this.createHttpProvider(w2, d2);
    }), u3;
  }
  getHttpProvider() {
    const u3 = `${this.name}:${this.chainId}`, i = this.httpProviders[u3];
    if (typeof i > "u")
      throw new Error(`JSON-RPC provider for ${u3} not found`);
    return i;
  }
  getCardanoRPCUrl(u3) {
    const i = this.namespace.rpcMap;
    if (i)
      return i[u3];
  }
  setHttpProvider(u3, i) {
    const d2 = this.createHttpProvider(u3, i);
    d2 && (this.httpProviders[u3] = d2);
  }
  createHttpProvider(u3, i) {
    const d2 = i || this.getCardanoRPCUrl(u3);
    if (!d2)
      throw new Error(`No RPC url provided for chainId: ${u3}`);
    return new JsonRpcProvider(new HttpConnection(d2, z("disableProviderPing")));
  }
}
class ev {
  constructor(u3) {
    this.name = "elrond", this.namespace = u3.namespace, this.events = z("events"), this.client = z("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u3) {
    this.namespace = Object.assign(this.namespace, u3);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(u3) {
    return this.namespace.methods.includes(u3.request.method) ? this.client.request(u3) : this.getHttpProvider().request(u3.request);
  }
  setDefaultChain(u3, i) {
    this.httpProviders[u3] || this.setHttpProvider(u3, i), this.chainId = u3, this.events.emit(Vn.DEFAULT_CHAIN_CHANGED, `${this.name}:${u3}`);
  }
  getDefaultChain() {
    if (this.chainId)
      return this.chainId;
    if (this.namespace.defaultChain)
      return this.namespace.defaultChain;
    const u3 = this.namespace.chains[0];
    if (!u3)
      throw new Error("ChainId not found");
    return u3.split(":")[1];
  }
  getAccounts() {
    const u3 = this.namespace.accounts;
    return u3 ? [...new Set(u3.filter((i) => i.split(":")[1] === this.chainId.toString()).map((i) => i.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u3 = {};
    return this.namespace.chains.forEach((i) => {
      var d2;
      const w2 = Ct(i);
      u3[w2] = this.createHttpProvider(w2, (d2 = this.namespace.rpcMap) == null ? void 0 : d2[i]);
    }), u3;
  }
  getHttpProvider() {
    const u3 = `${this.name}:${this.chainId}`, i = this.httpProviders[u3];
    if (typeof i > "u")
      throw new Error(`JSON-RPC provider for ${u3} not found`);
    return i;
  }
  setHttpProvider(u3, i) {
    const d2 = this.createHttpProvider(u3, i);
    d2 && (this.httpProviders[u3] = d2);
  }
  createHttpProvider(u3, i) {
    const d2 = i || ft(u3, this.namespace, this.client.core.projectId);
    if (!d2)
      throw new Error(`No RPC url provided for chainId: ${u3}`);
    return new JsonRpcProvider(new HttpConnection(d2, z("disableProviderPing")));
  }
}
class rv {
  constructor(u3) {
    this.name = "multiversx", this.namespace = u3.namespace, this.events = z("events"), this.client = z("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u3) {
    this.namespace = Object.assign(this.namespace, u3);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(u3) {
    return this.namespace.methods.includes(u3.request.method) ? this.client.request(u3) : this.getHttpProvider().request(u3.request);
  }
  setDefaultChain(u3, i) {
    this.httpProviders[u3] || this.setHttpProvider(u3, i), this.chainId = u3, this.events.emit(Vn.DEFAULT_CHAIN_CHANGED, `${this.name}:${u3}`);
  }
  getDefaultChain() {
    if (this.chainId)
      return this.chainId;
    if (this.namespace.defaultChain)
      return this.namespace.defaultChain;
    const u3 = this.namespace.chains[0];
    if (!u3)
      throw new Error("ChainId not found");
    return u3.split(":")[1];
  }
  getAccounts() {
    const u3 = this.namespace.accounts;
    return u3 ? [...new Set(u3.filter((i) => i.split(":")[1] === this.chainId.toString()).map((i) => i.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u3 = {};
    return this.namespace.chains.forEach((i) => {
      var d2;
      const w2 = Ct(i);
      u3[w2] = this.createHttpProvider(w2, (d2 = this.namespace.rpcMap) == null ? void 0 : d2[i]);
    }), u3;
  }
  getHttpProvider() {
    const u3 = `${this.name}:${this.chainId}`, i = this.httpProviders[u3];
    if (typeof i > "u")
      throw new Error(`JSON-RPC provider for ${u3} not found`);
    return i;
  }
  setHttpProvider(u3, i) {
    const d2 = this.createHttpProvider(u3, i);
    d2 && (this.httpProviders[u3] = d2);
  }
  createHttpProvider(u3, i) {
    const d2 = i || ft(u3, this.namespace, this.client.core.projectId);
    if (!d2)
      throw new Error(`No RPC url provided for chainId: ${u3}`);
    return new JsonRpcProvider(new HttpConnection(d2, z("disableProviderPing")));
  }
}
class iv {
  constructor(u3) {
    this.name = "near", this.namespace = u3.namespace, this.events = z("events"), this.client = z("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u3) {
    this.namespace = Object.assign(this.namespace, u3);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId)
      return this.chainId;
    if (this.namespace.defaultChain)
      return this.namespace.defaultChain;
    const u3 = this.namespace.chains[0];
    if (!u3)
      throw new Error("ChainId not found");
    return u3.split(":")[1];
  }
  request(u3) {
    return this.namespace.methods.includes(u3.request.method) ? this.client.request(u3) : this.getHttpProvider().request(u3.request);
  }
  setDefaultChain(u3, i) {
    if (this.chainId = u3, !this.httpProviders[u3]) {
      const d2 = i || ft(`${this.name}:${u3}`, this.namespace);
      if (!d2)
        throw new Error(`No RPC url provided for chainId: ${u3}`);
      this.setHttpProvider(u3, d2);
    }
    this.events.emit(Vn.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const u3 = this.namespace.accounts;
    return u3 ? u3.filter((i) => i.split(":")[1] === this.chainId.toString()).map((i) => i.split(":")[2]) || [] : [];
  }
  createHttpProviders() {
    const u3 = {};
    return this.namespace.chains.forEach((i) => {
      var d2;
      u3[i] = this.createHttpProvider(i, (d2 = this.namespace.rpcMap) == null ? void 0 : d2[i]);
    }), u3;
  }
  getHttpProvider() {
    const u3 = `${this.name}:${this.chainId}`, i = this.httpProviders[u3];
    if (typeof i > "u")
      throw new Error(`JSON-RPC provider for ${u3} not found`);
    return i;
  }
  setHttpProvider(u3, i) {
    const d2 = this.createHttpProvider(u3, i);
    d2 && (this.httpProviders[u3] = d2);
  }
  createHttpProvider(u3, i) {
    const d2 = i || ft(u3, this.namespace);
    return typeof d2 > "u" ? void 0 : new JsonRpcProvider(new HttpConnection(d2, z("disableProviderPing")));
  }
}
var sv = Object.defineProperty, uv = Object.defineProperties, av = Object.getOwnPropertyDescriptors, ba = Object.getOwnPropertySymbols, ov = Object.prototype.hasOwnProperty, fv = Object.prototype.propertyIsEnumerable, Ta = (C, u3, i) => u3 in C ? sv(C, u3, { enumerable: true, configurable: true, writable: true, value: i }) : C[u3] = i, hr = (C, u3) => {
  for (var i in u3 || (u3 = {}))
    ov.call(u3, i) && Ta(C, i, u3[i]);
  if (ba)
    for (var i of ba(u3))
      fv.call(u3, i) && Ta(C, i, u3[i]);
  return C;
}, Mi = (C, u3) => uv(C, av(u3));
class lr {
  constructor(u3) {
    this.events = new $g(), this.rpcProviders = {}, this.shouldAbortPairingAttempt = false, this.maxPairingAttempts = 10, this.disableProviderPing = false, this.providerOpts = u3, this.logger = typeof (u3 == null ? void 0 : u3.logger) < "u" && typeof (u3 == null ? void 0 : u3.logger) != "string" ? u3.logger : cjs$1.pino(cjs$1.getDefaultLoggerOptions({ level: (u3 == null ? void 0 : u3.logger) || Ia })), this.disableProviderPing = (u3 == null ? void 0 : u3.disableProviderPing) || false;
  }
  static async init(u3) {
    const i = new lr(u3);
    return await i.initialize(), i;
  }
  async request(u3, i) {
    const [d2, w2] = this.validateChain(i);
    if (!this.session)
      throw new Error("Please call connect() before request()");
    return await this.getProvider(d2).request({ request: hr({}, u3), chainId: `${d2}:${w2}`, topic: this.session.topic });
  }
  sendAsync(u3, i, d2) {
    this.request(u3, d2).then((w2) => i(null, w2)).catch((w2) => i(w2, void 0));
  }
  async enable() {
    if (!this.client)
      throw new Error("Sign Client not initialized");
    return this.session || await this.connect({ namespaces: this.namespaces, optionalNamespaces: this.optionalNamespaces, sessionProperties: this.sessionProperties }), await this.requestAccounts();
  }
  async disconnect() {
    var u3;
    if (!this.session)
      throw new Error("Please call connect() before enable()");
    await this.client.disconnect({ topic: (u3 = this.session) == null ? void 0 : u3.topic, reason: U$2("USER_DISCONNECTED") }), await this.cleanup();
  }
  async connect(u3) {
    if (!this.client)
      throw new Error("Sign Client not initialized");
    if (this.setNamespaces(u3), await this.cleanupPendingPairings(), !u3.skipPairing)
      return await this.pair(u3.pairingTopic);
  }
  on(u3, i) {
    this.events.on(u3, i);
  }
  once(u3, i) {
    this.events.once(u3, i);
  }
  removeListener(u3, i) {
    this.events.removeListener(u3, i);
  }
  off(u3, i) {
    this.events.off(u3, i);
  }
  get isWalletConnect() {
    return true;
  }
  async pair(u3) {
    this.shouldAbortPairingAttempt = false;
    let i = 0;
    do {
      if (this.shouldAbortPairingAttempt)
        throw new Error("Pairing aborted");
      if (i >= this.maxPairingAttempts)
        throw new Error("Max auto pairing attempts reached");
      const { uri: d2, approval: w2 } = await this.client.connect({ pairingTopic: u3, requiredNamespaces: this.namespaces, optionalNamespaces: this.optionalNamespaces, sessionProperties: this.sessionProperties });
      d2 && (this.uri = d2, this.events.emit("display_uri", d2)), await w2().then((T2) => {
        this.session = T2, this.namespaces || (this.namespaces = Qg(T2.namespaces), this.persist("namespaces", this.namespaces));
      }).catch((T2) => {
        if (T2.message !== oe)
          throw T2;
        i++;
      });
    } while (!this.session);
    return this.onConnect(), this.session;
  }
  setDefaultChain(u3, i) {
    try {
      if (!this.session)
        return;
      const [d2, w2] = this.validateChain(u3);
      this.getProvider(d2).setDefaultChain(w2, i);
    } catch (d2) {
      if (!/Please call connect/.test(d2.message))
        throw d2;
    }
  }
  async cleanupPendingPairings(u3 = {}) {
    this.logger.info("Cleaning up inactive pairings...");
    const i = this.client.pairing.getAll();
    if (D$3(i)) {
      for (const d2 of i)
        u3.deletePairings ? this.client.core.expirer.set(d2.topic, 0) : await this.client.core.relayer.subscriber.unsubscribe(d2.topic);
      this.logger.info(`Inactive pairings cleared: ${i.length}`);
    }
  }
  abortPairingAttempt() {
    this.shouldAbortPairingAttempt = true;
  }
  async checkStorage() {
    if (this.namespaces = await this.getFromStore("namespaces"), this.optionalNamespaces = await this.getFromStore("optionalNamespaces") || {}, this.client.session.length) {
      const u3 = this.client.session.keys.length - 1;
      this.session = this.client.session.get(this.client.session.keys[u3]), this.createProviders();
    }
  }
  async initialize() {
    this.logger.trace("Initialized"), await this.createClient(), await this.checkStorage(), this.registerEventListeners();
  }
  async createClient() {
    this.client = this.providerOpts.client || await Q$1.init({ logger: this.providerOpts.logger || Ia, relayUrl: this.providerOpts.relayUrl || Ug, projectId: this.providerOpts.projectId, metadata: this.providerOpts.metadata, storageOptions: this.providerOpts.storageOptions, storage: this.providerOpts.storage, name: this.providerOpts.name }), this.logger.trace("SignClient Initialized");
  }
  createProviders() {
    if (!this.client)
      throw new Error("Sign Client not initialized");
    if (!this.session)
      throw new Error("Session not initialized. Please call connect() before enable()");
    const u3 = [...new Set(Object.keys(this.session.namespaces).map((i) => Xe$1(i)))];
    Fi("client", this.client), Fi("events", this.events), Fi("disableProviderPing", this.disableProviderPing), u3.forEach((i) => {
      if (!this.session)
        return;
      const d2 = Zg(i, this.session), w2 = Sa(d2), T2 = Jg(this.namespaces, this.optionalNamespaces), $2 = Mi(hr({}, T2[i]), { accounts: d2, chains: w2 });
      switch (i) {
        case "eip155":
          this.rpcProviders[i] = new kg({ namespace: $2 });
          break;
        case "solana":
          this.rpcProviders[i] = new jg({ namespace: $2 });
          break;
        case "cosmos":
          this.rpcProviders[i] = new nv({ namespace: $2 });
          break;
        case "polkadot":
          this.rpcProviders[i] = new Vg({ namespace: $2 });
          break;
        case "cip34":
          this.rpcProviders[i] = new tv({ namespace: $2 });
          break;
        case "elrond":
          this.rpcProviders[i] = new ev({ namespace: $2 });
          break;
        case "multiversx":
          this.rpcProviders[i] = new rv({ namespace: $2 });
          break;
        case "near":
          this.rpcProviders[i] = new iv({ namespace: $2 });
          break;
      }
    });
  }
  registerEventListeners() {
    if (typeof this.client > "u")
      throw new Error("Sign Client is not initialized");
    this.client.on("session_ping", (u3) => {
      this.events.emit("session_ping", u3);
    }), this.client.on("session_event", (u3) => {
      const { params: i } = u3, { event: d2 } = i;
      if (d2.name === "accountsChanged") {
        const w2 = d2.data;
        w2 && D$3(w2) && this.events.emit("accountsChanged", w2.map(Xg));
      } else if (d2.name === "chainChanged") {
        const w2 = i.chainId, T2 = i.event.data, $2 = Xe$1(w2), En = Wi(w2) !== Wi(T2) ? `${$2}:${Wi(T2)}` : w2;
        this.onChainChanged(En);
      } else
        this.events.emit(d2.name, d2.data);
      this.events.emit("session_event", u3);
    }), this.client.on("session_update", ({ topic: u3, params: i }) => {
      var d2;
      const { namespaces: w2 } = i, T2 = (d2 = this.client) == null ? void 0 : d2.session.get(u3);
      this.session = Mi(hr({}, T2), { namespaces: w2 }), this.onSessionUpdate(), this.events.emit("session_update", { topic: u3, params: i });
    }), this.client.on("session_delete", async (u3) => {
      await this.cleanup(), this.events.emit("session_delete", u3), this.events.emit("disconnect", Mi(hr({}, U$2("USER_DISCONNECTED")), { data: u3.topic }));
    }), this.on(Vn.DEFAULT_CHAIN_CHANGED, (u3) => {
      this.onChainChanged(u3, true);
    });
  }
  getProvider(u3) {
    if (!this.rpcProviders[u3])
      throw new Error(`Provider not found: ${u3}`);
    return this.rpcProviders[u3];
  }
  onSessionUpdate() {
    Object.keys(this.rpcProviders).forEach((u3) => {
      var i;
      this.getProvider(u3).updateNamespace((i = this.session) == null ? void 0 : i.namespaces[u3]);
    });
  }
  setNamespaces(u3) {
    const { namespaces: i, optionalNamespaces: d2, sessionProperties: w2 } = u3;
    i && Object.keys(i).length && (this.namespaces = i), d2 && Object.keys(d2).length && (this.optionalNamespaces = d2), this.sessionProperties = w2, this.persist("namespaces", i), this.persist("optionalNamespaces", d2);
  }
  validateChain(u3) {
    const [i, d2] = (u3 == null ? void 0 : u3.split(":")) || ["", ""];
    if (!this.namespaces || !Object.keys(this.namespaces).length)
      return [i, d2];
    if (i && !Object.keys(this.namespaces || {}).map(($2) => Xe$1($2)).includes(i))
      throw new Error(`Namespace '${i}' is not configured. Please call connect() first with namespace config.`);
    if (i && d2)
      return [i, d2];
    const w2 = Xe$1(Object.keys(this.namespaces)[0]), T2 = this.rpcProviders[w2].getDefaultChain();
    return [w2, T2];
  }
  async requestAccounts() {
    const [u3] = this.validateChain();
    return await this.getProvider(u3).requestAccounts();
  }
  onChainChanged(u3, i = false) {
    var d2;
    if (!this.namespaces)
      return;
    const [w2, T2] = this.validateChain(u3);
    i || this.getProvider(w2).setDefaultChain(T2), ((d2 = this.namespaces[w2]) != null ? d2 : this.namespaces[`${w2}:${T2}`]).defaultChain = T2, this.persist("namespaces", this.namespaces), this.events.emit("chainChanged", T2);
  }
  onConnect() {
    this.createProviders(), this.events.emit("connect", { session: this.session });
  }
  async cleanup() {
    this.session = void 0, this.namespaces = void 0, this.optionalNamespaces = void 0, this.sessionProperties = void 0, this.persist("namespaces", void 0), this.persist("optionalNamespaces", void 0), this.persist("sessionProperties", void 0), await this.cleanupPendingPairings({ deletePairings: true });
  }
  persist(u3, i) {
    this.client.core.storage.setItem(`${xa}/${u3}`, i);
  }
  async getFromStore(u3) {
    return await this.client.core.storage.getItem(`${xa}/${u3}`);
  }
}
const cv = lr;
const P = "wc", S2 = "ethereum_provider", $ = `${P}@2:${S2}:`, j = "https://rpc.walletconnect.com/v1/", u2 = ["eth_sendTransaction", "personal_sign"], E2 = ["eth_accounts", "eth_requestAccounts", "eth_sendRawTransaction", "eth_sign", "eth_signTransaction", "eth_signTypedData", "eth_signTypedData_v3", "eth_signTypedData_v4", "eth_sendTransaction", "personal_sign", "wallet_switchEthereumChain", "wallet_addEthereumChain", "wallet_getPermissions", "wallet_requestPermissions", "wallet_registerOnboarding", "wallet_watchAsset", "wallet_scanQRCode"], m = ["chainChanged", "accountsChanged"], _2 = ["chainChanged", "accountsChanged", "message", "disconnect", "connect"];
var N = Object.defineProperty, q = Object.defineProperties, D = Object.getOwnPropertyDescriptors, y2 = Object.getOwnPropertySymbols, U = Object.prototype.hasOwnProperty, Q2 = Object.prototype.propertyIsEnumerable, O = (a2, t, s) => t in a2 ? N(a2, t, { enumerable: true, configurable: true, writable: true, value: s }) : a2[t] = s, p2 = (a2, t) => {
  for (var s in t || (t = {}))
    U.call(t, s) && O(a2, s, t[s]);
  if (y2)
    for (var s of y2(t))
      Q2.call(t, s) && O(a2, s, t[s]);
  return a2;
}, M = (a2, t) => q(a2, D(t));
function g2(a2) {
  return Number(a2[0].split(":")[1]);
}
function f(a2) {
  return `0x${a2.toString(16)}`;
}
function L(a2) {
  const { chains: t, optionalChains: s, methods: i, optionalMethods: n2, events: e, optionalEvents: h3, rpcMap: c2 } = a2;
  if (!D$3(t))
    throw new Error("Invalid chains");
  const o = { chains: t, methods: i || u2, events: e || m, rpcMap: p2({}, t.length ? { [g2(t)]: c2[g2(t)] } : {}) }, r = e == null ? void 0 : e.filter((l2) => !m.includes(l2)), d2 = i == null ? void 0 : i.filter((l2) => !u2.includes(l2));
  if (!s && !h3 && !n2 && !(r != null && r.length) && !(d2 != null && d2.length))
    return { required: t.length ? o : void 0 };
  const C = (r == null ? void 0 : r.length) && (d2 == null ? void 0 : d2.length) || !s, I2 = { chains: [...new Set(C ? o.chains.concat(s || []) : s)], methods: [...new Set(o.methods.concat(n2 != null && n2.length ? n2 : E2))], events: [...new Set(o.events.concat(h3 != null && h3.length ? h3 : _2))], rpcMap: c2 };
  return { required: t.length ? o : void 0, optional: s.length ? I2 : void 0 };
}
class v {
  constructor() {
    this.events = new eventsExports.EventEmitter(), this.namespace = "eip155", this.accounts = [], this.chainId = 1, this.STORAGE_KEY = $, this.on = (t, s) => (this.events.on(t, s), this), this.once = (t, s) => (this.events.once(t, s), this), this.removeListener = (t, s) => (this.events.removeListener(t, s), this), this.off = (t, s) => (this.events.off(t, s), this), this.parseAccount = (t) => this.isCompatibleChainId(t) ? this.parseAccountId(t).address : t, this.signer = {}, this.rpc = {};
  }
  static async init(t) {
    const s = new v();
    return await s.initialize(t), s;
  }
  async request(t) {
    return await this.signer.request(t, this.formatChainId(this.chainId));
  }
  sendAsync(t, s) {
    this.signer.sendAsync(t, s, this.formatChainId(this.chainId));
  }
  get connected() {
    return this.signer.client ? this.signer.client.core.relayer.connected : false;
  }
  get connecting() {
    return this.signer.client ? this.signer.client.core.relayer.connecting : false;
  }
  async enable() {
    return this.session || await this.connect(), await this.request({ method: "eth_requestAccounts" });
  }
  async connect(t) {
    if (!this.signer.client)
      throw new Error("Provider not initialized. Call init() first");
    this.loadConnectOpts(t);
    const { required: s, optional: i } = L(this.rpc);
    try {
      const n2 = await new Promise(async (h3, c2) => {
        var o;
        this.rpc.showQrModal && ((o = this.modal) == null || o.subscribeModal((r) => {
          !r.open && !this.signer.session && (this.signer.abortPairingAttempt(), c2(new Error("Connection request reset. Please try again.")));
        })), await this.signer.connect(M(p2({ namespaces: p2({}, s && { [this.namespace]: s }) }, i && { optionalNamespaces: { [this.namespace]: i } }), { pairingTopic: t == null ? void 0 : t.pairingTopic })).then((r) => {
          h3(r);
        }).catch((r) => {
          c2(new Error(r.message));
        });
      });
      if (!n2)
        return;
      const e = Rn(n2.namespaces, [this.namespace]);
      this.setChainIds(this.rpc.chains.length ? this.rpc.chains : e), this.setAccounts(e), this.events.emit("connect", { chainId: f(this.chainId) });
    } catch (n2) {
      throw this.signer.logger.error(n2), n2;
    } finally {
      this.modal && this.modal.closeModal();
    }
  }
  async disconnect() {
    this.session && await this.signer.disconnect(), this.reset();
  }
  get isWalletConnect() {
    return true;
  }
  get session() {
    return this.signer.session;
  }
  registerEventListeners() {
    this.signer.on("session_event", (t) => {
      const { params: s } = t, { event: i } = s;
      i.name === "accountsChanged" ? (this.accounts = this.parseAccounts(i.data), this.events.emit("accountsChanged", this.accounts)) : i.name === "chainChanged" ? this.setChainId(this.formatChainId(i.data)) : this.events.emit(i.name, i.data), this.events.emit("session_event", t);
    }), this.signer.on("chainChanged", (t) => {
      const s = parseInt(t);
      this.chainId = s, this.events.emit("chainChanged", f(this.chainId)), this.persist();
    }), this.signer.on("session_update", (t) => {
      this.events.emit("session_update", t);
    }), this.signer.on("session_delete", (t) => {
      this.reset(), this.events.emit("session_delete", t), this.events.emit("disconnect", M(p2({}, U$2("USER_DISCONNECTED")), { data: t.topic, name: "USER_DISCONNECTED" }));
    }), this.signer.on("display_uri", (t) => {
      var s, i;
      this.rpc.showQrModal && ((s = this.modal) == null || s.closeModal(), (i = this.modal) == null || i.openModal({ uri: t })), this.events.emit("display_uri", t);
    });
  }
  switchEthereumChain(t) {
    this.request({ method: "wallet_switchEthereumChain", params: [{ chainId: t.toString(16) }] });
  }
  isCompatibleChainId(t) {
    return typeof t == "string" ? t.startsWith(`${this.namespace}:`) : false;
  }
  formatChainId(t) {
    return `${this.namespace}:${t}`;
  }
  parseChainId(t) {
    return Number(t.split(":")[1]);
  }
  setChainIds(t) {
    const s = t.filter((i) => this.isCompatibleChainId(i)).map((i) => this.parseChainId(i));
    s.length && (this.chainId = s[0], this.events.emit("chainChanged", f(this.chainId)), this.persist());
  }
  setChainId(t) {
    if (this.isCompatibleChainId(t)) {
      const s = this.parseChainId(t);
      this.chainId = s, this.switchEthereumChain(s);
    }
  }
  parseAccountId(t) {
    const [s, i, n2] = t.split(":");
    return { chainId: `${s}:${i}`, address: n2 };
  }
  setAccounts(t) {
    this.accounts = t.filter((s) => this.parseChainId(this.parseAccountId(s).chainId) === this.chainId).map((s) => this.parseAccountId(s).address), this.events.emit("accountsChanged", this.accounts);
  }
  getRpcConfig(t) {
    var s, i;
    const n2 = (s = t == null ? void 0 : t.chains) != null ? s : [], e = (i = t == null ? void 0 : t.optionalChains) != null ? i : [], h3 = n2.concat(e);
    if (!h3.length)
      throw new Error("No chains specified in either `chains` or `optionalChains`");
    const c2 = n2.length ? (t == null ? void 0 : t.methods) || u2 : [], o = n2.length ? (t == null ? void 0 : t.events) || m : [], r = (t == null ? void 0 : t.optionalMethods) || [], d2 = (t == null ? void 0 : t.optionalEvents) || [], C = (t == null ? void 0 : t.rpcMap) || this.buildRpcMap(h3, t.projectId), I2 = (t == null ? void 0 : t.qrModalOptions) || void 0;
    return { chains: n2 == null ? void 0 : n2.map((l2) => this.formatChainId(l2)), optionalChains: e.map((l2) => this.formatChainId(l2)), methods: c2, events: o, optionalMethods: r, optionalEvents: d2, rpcMap: C, showQrModal: !!(t != null && t.showQrModal), qrModalOptions: I2, projectId: t.projectId, metadata: t.metadata };
  }
  buildRpcMap(t, s) {
    const i = {};
    return t.forEach((n2) => {
      i[n2] = this.getRpcUrl(n2, s);
    }), i;
  }
  async initialize(t) {
    if (this.rpc = this.getRpcConfig(t), this.chainId = this.rpc.chains.length ? g2(this.rpc.chains) : g2(this.rpc.optionalChains), this.signer = await cv.init({ projectId: this.rpc.projectId, metadata: this.rpc.metadata, disableProviderPing: t.disableProviderPing, relayUrl: t.relayUrl, storageOptions: t.storageOptions }), this.registerEventListeners(), await this.loadPersistedSession(), this.rpc.showQrModal) {
      let s;
      try {
        const { WalletConnectModal: i } = await __vitePreload(() => import("./index-5a8abe7b.js").then((n2) => n2.i), true ? ["assets/index-5a8abe7b.js","assets/index-d859b153.js","assets/index-061d3a5a.css"] : void 0);
        s = i;
      } catch {
        throw new Error("To use QR modal, please install @walletconnect/modal package");
      }
      if (s)
        try {
          this.modal = new s(p2({ walletConnectVersion: 2, projectId: this.rpc.projectId, standaloneChains: this.rpc.chains }, this.rpc.qrModalOptions));
        } catch (i) {
          throw this.signer.logger.error(i), new Error("Could not generate WalletConnectModal Instance");
        }
    }
  }
  loadConnectOpts(t) {
    if (!t)
      return;
    const { chains: s, optionalChains: i, rpcMap: n2 } = t;
    s && D$3(s) && (this.rpc.chains = s.map((e) => this.formatChainId(e)), s.forEach((e) => {
      this.rpc.rpcMap[e] = (n2 == null ? void 0 : n2[e]) || this.getRpcUrl(e);
    })), i && D$3(i) && (this.rpc.optionalChains = [], this.rpc.optionalChains = i == null ? void 0 : i.map((e) => this.formatChainId(e)), i.forEach((e) => {
      this.rpc.rpcMap[e] = (n2 == null ? void 0 : n2[e]) || this.getRpcUrl(e);
    }));
  }
  getRpcUrl(t, s) {
    var i;
    return ((i = this.rpc.rpcMap) == null ? void 0 : i[t]) || `${j}?chainId=eip155:${t}&projectId=${s || this.rpc.projectId}`;
  }
  async loadPersistedSession() {
    if (!this.session)
      return;
    const t = await this.signer.client.core.storage.getItem(`${this.STORAGE_KEY}/chainId`), s = this.session.namespaces[`${this.namespace}:${t}`] ? this.session.namespaces[`${this.namespace}:${t}`] : this.session.namespaces[this.namespace];
    this.setChainIds(t ? [this.formatChainId(t)] : s == null ? void 0 : s.accounts), this.setAccounts(s == null ? void 0 : s.accounts);
  }
  reset() {
    this.chainId = 1, this.accounts = [];
  }
  persist() {
    this.session && this.signer.client.core.storage.setItem(`${this.STORAGE_KEY}/chainId`, this.chainId);
  }
  parseAccounts(t) {
    return typeof t == "string" || t instanceof String ? [this.parseAccount(t)] : t.map((s) => this.parseAccount(s));
  }
}
const G = v;
export {
  G as EthereumProvider,
  _2 as OPTIONAL_EVENTS,
  E2 as OPTIONAL_METHODS,
  m as REQUIRED_EVENTS,
  u2 as REQUIRED_METHODS,
  v as default
};
