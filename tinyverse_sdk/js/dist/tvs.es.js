(() => {
  const o = () => {
    const a = new Error("not implemented");
    return a.code = "ENOSYS", a;
  };
  if (!globalThis.fs) {
    let a = "";
    globalThis.fs = {
      constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 },
      // unused
      writeSync(i, s) {
        a += d.decode(s);
        const n = a.lastIndexOf(`
`);
        return n != -1 && (console.log(a.substring(0, n)), a = a.substring(n + 1)), s.length;
      },
      write(i, s, n, h, u, c) {
        if (n !== 0 || h !== s.length || u !== null) {
          c(o());
          return;
        }
        const g = this.writeSync(i, s);
        c(null, g);
      },
      chmod(i, s, n) {
        n(o());
      },
      chown(i, s, n, h) {
        h(o());
      },
      close(i, s) {
        s(o());
      },
      fchmod(i, s, n) {
        n(o());
      },
      fchown(i, s, n, h) {
        h(o());
      },
      fstat(i, s) {
        s(o());
      },
      fsync(i, s) {
        s(null);
      },
      ftruncate(i, s, n) {
        n(o());
      },
      lchown(i, s, n, h) {
        h(o());
      },
      link(i, s, n) {
        n(o());
      },
      lstat(i, s) {
        s(o());
      },
      mkdir(i, s, n) {
        n(o());
      },
      open(i, s, n, h) {
        h(o());
      },
      read(i, s, n, h, u, c) {
        c(o());
      },
      readdir(i, s) {
        s(o());
      },
      readlink(i, s) {
        s(o());
      },
      rename(i, s, n) {
        n(o());
      },
      rmdir(i, s) {
        s(o());
      },
      stat(i, s) {
        s(o());
      },
      symlink(i, s, n) {
        n(o());
      },
      truncate(i, s, n) {
        n(o());
      },
      unlink(i, s) {
        s(o());
      },
      utimes(i, s, n, h) {
        h(o());
      }
    };
  }
  if (globalThis.process || (globalThis.process = {
    getuid() {
      return -1;
    },
    getgid() {
      return -1;
    },
    geteuid() {
      return -1;
    },
    getegid() {
      return -1;
    },
    getgroups() {
      throw o();
    },
    pid: -1,
    ppid: -1,
    umask() {
      throw o();
    },
    cwd() {
      throw o();
    },
    chdir() {
      throw o();
    }
  }), !globalThis.crypto)
    throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
  if (!globalThis.performance)
    throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
  if (!globalThis.TextEncoder)
    throw new Error("globalThis.TextEncoder is not available, polyfill required");
  if (!globalThis.TextDecoder)
    throw new Error("globalThis.TextDecoder is not available, polyfill required");
  const f = new TextEncoder("utf-8"), d = new TextDecoder("utf-8");
  globalThis.Go = class {
    constructor() {
      this.argv = ["js"], this.env = {}, this.exit = (t) => {
        t !== 0 && console.warn("exit code:", t);
      }, this._exitPromise = new Promise((t) => {
        this._resolveExitPromise = t;
      }), this._pendingEvent = null, this._scheduledTimeouts = /* @__PURE__ */ new Map(), this._nextCallbackTimeoutID = 1;
      const a = (t, e) => {
        this.mem.setUint32(t + 0, e, !0), this.mem.setUint32(t + 4, Math.floor(e / 4294967296), !0);
      }, i = (t) => {
        const e = this.mem.getUint32(t + 0, !0), r = this.mem.getInt32(t + 4, !0);
        return e + r * 4294967296;
      }, s = (t) => {
        const e = this.mem.getFloat64(t, !0);
        if (e === 0)
          return;
        if (!isNaN(e))
          return e;
        const r = this.mem.getUint32(t, !0);
        return this._values[r];
      }, n = (t, e) => {
        if (typeof e == "number" && e !== 0) {
          if (isNaN(e)) {
            this.mem.setUint32(t + 4, 2146959360, !0), this.mem.setUint32(t, 0, !0);
            return;
          }
          this.mem.setFloat64(t, e, !0);
          return;
        }
        if (e === void 0) {
          this.mem.setFloat64(t, 0, !0);
          return;
        }
        let l = this._ids.get(e);
        l === void 0 && (l = this._idPool.pop(), l === void 0 && (l = this._values.length), this._values[l] = e, this._goRefCounts[l] = 0, this._ids.set(e, l)), this._goRefCounts[l]++;
        let m = 0;
        switch (typeof e) {
          case "object":
            e !== null && (m = 1);
            break;
          case "string":
            m = 2;
            break;
          case "symbol":
            m = 3;
            break;
          case "function":
            m = 4;
            break;
        }
        this.mem.setUint32(t + 4, 2146959360 | m, !0), this.mem.setUint32(t, l, !0);
      }, h = (t) => {
        const e = i(t + 0), r = i(t + 8);
        return new Uint8Array(this._inst.exports.mem.buffer, e, r);
      }, u = (t) => {
        const e = i(t + 0), r = i(t + 8), l = new Array(r);
        for (let m = 0; m < r; m++)
          l[m] = s(e + m * 8);
        return l;
      }, c = (t) => {
        const e = i(t + 0), r = i(t + 8);
        return d.decode(new DataView(this._inst.exports.mem.buffer, e, r));
      }, g = Date.now() - performance.now();
      this.importObject = {
        go: {
          // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
          // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
          // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
          // This changes the SP, thus we have to update the SP used by the imported function.
          // func wasmExit(code int32)
          "runtime.wasmExit": (t) => {
            t >>>= 0;
            const e = this.mem.getInt32(t + 8, !0);
            this.exited = !0, delete this._inst, delete this._values, delete this._goRefCounts, delete this._ids, delete this._idPool, this.exit(e);
          },
          // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
          "runtime.wasmWrite": (t) => {
            t >>>= 0;
            const e = i(t + 8), r = i(t + 16), l = this.mem.getInt32(t + 24, !0);
            fs.writeSync(e, new Uint8Array(this._inst.exports.mem.buffer, r, l));
          },
          // func resetMemoryDataView()
          "runtime.resetMemoryDataView": (t) => {
            this.mem = new DataView(this._inst.exports.mem.buffer);
          },
          // func nanotime1() int64
          "runtime.nanotime1": (t) => {
            t >>>= 0, a(t + 8, (g + performance.now()) * 1e6);
          },
          // func walltime() (sec int64, nsec int32)
          "runtime.walltime": (t) => {
            t >>>= 0;
            const e = (/* @__PURE__ */ new Date()).getTime();
            a(t + 8, e / 1e3), this.mem.setInt32(t + 16, e % 1e3 * 1e6, !0);
          },
          // func scheduleTimeoutEvent(delay int64) int32
          "runtime.scheduleTimeoutEvent": (t) => {
            t >>>= 0;
            const e = this._nextCallbackTimeoutID;
            this._nextCallbackTimeoutID++, this._scheduledTimeouts.set(e, setTimeout(
              () => {
                for (this._resume(); this._scheduledTimeouts.has(e); )
                  console.warn("scheduleTimeoutEvent: missed timeout event"), this._resume();
              },
              i(t + 8) + 1
              // setTimeout has been seen to fire up to 1 millisecond early
            )), this.mem.setInt32(t + 16, e, !0);
          },
          // func clearTimeoutEvent(id int32)
          "runtime.clearTimeoutEvent": (t) => {
            t >>>= 0;
            const e = this.mem.getInt32(t + 8, !0);
            clearTimeout(this._scheduledTimeouts.get(e)), this._scheduledTimeouts.delete(e);
          },
          // func getRandomData(r []byte)
          "runtime.getRandomData": (t) => {
            t >>>= 0, crypto.getRandomValues(h(t + 8));
          },
          // func finalizeRef(v ref)
          "syscall/js.finalizeRef": (t) => {
            t >>>= 0;
            const e = this.mem.getUint32(t + 8, !0);
            if (this._goRefCounts[e]--, this._goRefCounts[e] === 0) {
              const r = this._values[e];
              this._values[e] = null, this._ids.delete(r), this._idPool.push(e);
            }
          },
          // func stringVal(value string) ref
          "syscall/js.stringVal": (t) => {
            t >>>= 0, n(t + 24, c(t + 8));
          },
          // func valueGet(v ref, p string) ref
          "syscall/js.valueGet": (t) => {
            t >>>= 0;
            const e = Reflect.get(s(t + 8), c(t + 16));
            t = this._inst.exports.getsp() >>> 0, n(t + 32, e);
          },
          // func valueSet(v ref, p string, x ref)
          "syscall/js.valueSet": (t) => {
            t >>>= 0, Reflect.set(s(t + 8), c(t + 16), s(t + 32));
          },
          // func valueDelete(v ref, p string)
          "syscall/js.valueDelete": (t) => {
            t >>>= 0, Reflect.deleteProperty(s(t + 8), c(t + 16));
          },
          // func valueIndex(v ref, i int) ref
          "syscall/js.valueIndex": (t) => {
            t >>>= 0, n(t + 24, Reflect.get(s(t + 8), i(t + 16)));
          },
          // valueSetIndex(v ref, i int, x ref)
          "syscall/js.valueSetIndex": (t) => {
            t >>>= 0, Reflect.set(s(t + 8), i(t + 16), s(t + 24));
          },
          // func valueCall(v ref, m string, args []ref) (ref, bool)
          "syscall/js.valueCall": (t) => {
            t >>>= 0;
            try {
              const e = s(t + 8), r = Reflect.get(e, c(t + 16)), l = u(t + 32), m = Reflect.apply(r, e, l);
              t = this._inst.exports.getsp() >>> 0, n(t + 56, m), this.mem.setUint8(t + 64, 1);
            } catch (e) {
              t = this._inst.exports.getsp() >>> 0, n(t + 56, e), this.mem.setUint8(t + 64, 0);
            }
          },
          // func valueInvoke(v ref, args []ref) (ref, bool)
          "syscall/js.valueInvoke": (t) => {
            t >>>= 0;
            try {
              const e = s(t + 8), r = u(t + 16), l = Reflect.apply(e, void 0, r);
              t = this._inst.exports.getsp() >>> 0, n(t + 40, l), this.mem.setUint8(t + 48, 1);
            } catch (e) {
              t = this._inst.exports.getsp() >>> 0, n(t + 40, e), this.mem.setUint8(t + 48, 0);
            }
          },
          // func valueNew(v ref, args []ref) (ref, bool)
          "syscall/js.valueNew": (t) => {
            t >>>= 0;
            try {
              const e = s(t + 8), r = u(t + 16), l = Reflect.construct(e, r);
              t = this._inst.exports.getsp() >>> 0, n(t + 40, l), this.mem.setUint8(t + 48, 1);
            } catch (e) {
              t = this._inst.exports.getsp() >>> 0, n(t + 40, e), this.mem.setUint8(t + 48, 0);
            }
          },
          // func valueLength(v ref) int
          "syscall/js.valueLength": (t) => {
            t >>>= 0, a(t + 16, parseInt(s(t + 8).length));
          },
          // valuePrepareString(v ref) (ref, int)
          "syscall/js.valuePrepareString": (t) => {
            t >>>= 0;
            const e = f.encode(String(s(t + 8)));
            n(t + 16, e), a(t + 24, e.length);
          },
          // valueLoadString(v ref, b []byte)
          "syscall/js.valueLoadString": (t) => {
            t >>>= 0;
            const e = s(t + 8);
            h(t + 16).set(e);
          },
          // func valueInstanceOf(v ref, t ref) bool
          "syscall/js.valueInstanceOf": (t) => {
            t >>>= 0, this.mem.setUint8(t + 24, s(t + 8) instanceof s(t + 16) ? 1 : 0);
          },
          // func copyBytesToGo(dst []byte, src ref) (int, bool)
          "syscall/js.copyBytesToGo": (t) => {
            t >>>= 0;
            const e = h(t + 8), r = s(t + 32);
            if (!(r instanceof Uint8Array || r instanceof Uint8ClampedArray)) {
              this.mem.setUint8(t + 48, 0);
              return;
            }
            const l = r.subarray(0, e.length);
            e.set(l), a(t + 40, l.length), this.mem.setUint8(t + 48, 1);
          },
          // func copyBytesToJS(dst ref, src []byte) (int, bool)
          "syscall/js.copyBytesToJS": (t) => {
            t >>>= 0;
            const e = s(t + 8), r = h(t + 16);
            if (!(e instanceof Uint8Array || e instanceof Uint8ClampedArray)) {
              this.mem.setUint8(t + 48, 0);
              return;
            }
            const l = r.subarray(0, e.length);
            e.set(l), a(t + 40, l.length), this.mem.setUint8(t + 48, 1);
          },
          debug: (t) => {
            console.log(t);
          }
        }
      };
    }
    async run(a) {
      if (!(a instanceof WebAssembly.Instance))
        throw new Error("Go.run: WebAssembly.Instance expected");
      this._inst = a, this.mem = new DataView(this._inst.exports.mem.buffer), this._values = [
        // JS values that Go currently has references to, indexed by reference id
        NaN,
        0,
        null,
        !0,
        !1,
        globalThis,
        this
      ], this._goRefCounts = new Array(this._values.length).fill(1 / 0), this._ids = /* @__PURE__ */ new Map([
        // mapping from JS values to reference ids
        [0, 1],
        [null, 2],
        [!0, 3],
        [!1, 4],
        [globalThis, 5],
        [this, 6]
      ]), this._idPool = [], this.exited = !1;
      let i = 4096;
      const s = (t) => {
        const e = i, r = f.encode(t + "\0");
        return new Uint8Array(this.mem.buffer, i, r.length).set(r), i += r.length, i % 8 !== 0 && (i += 8 - i % 8), e;
      }, n = this.argv.length, h = [];
      this.argv.forEach((t) => {
        h.push(s(t));
      }), h.push(0), Object.keys(this.env).sort().forEach((t) => {
        h.push(s(`${t}=${this.env[t]}`));
      }), h.push(0);
      const c = i;
      h.forEach((t) => {
        this.mem.setUint32(i, t, !0), this.mem.setUint32(i + 4, 0, !0), i += 8;
      });
      const g = 4096 + 8192;
      if (i >= g)
        throw new Error("total length of command line and environment variables exceeds limit");
      this._inst.exports.run(n, c), this.exited && this._resolveExitPromise(), await this._exitPromise;
    }
    _resume() {
      if (this.exited)
        throw new Error("Go program has already exited");
      this._inst.exports.resume(), this.exited && this._resolveExitPromise();
    }
    _makeFuncWrapper(a) {
      const i = this;
      return function() {
        const s = { id: a, this: this, args: arguments };
        return i._pendingEvent = s, i._resume(), s.result;
      };
    }
  };
})();
class y {
  constructor() {
    this.inputWasmUrl = "https://tinyverse.space/wasm/tinyverse_sdk.wasm", this.inputLocalWasm = "../lib/wasm/main.wasm", this.go = new Go(), this.wasm = this.initWasm();
  }
  initWasm() {
    let f, d;
    WebAssembly.instantiateStreaming(fetch(this.inputLocalWasm), this.go.importObject).then((a) => (f = a.module, d = a.instance, { inst: d, mod: f })).catch((a) => (console.error(a), null));
  }
  getWasm() {
    return this.wasm;
  }
  async resetWasm() {
    this.wasm.initWasm = await WebAssembly.instantiate(this.wasm.mod, this.go.importObject);
  }
  callMain() {
    this.wasm.main();
  }
}
export {
  y as TvsWasm
};
