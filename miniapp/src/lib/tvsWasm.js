/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-undef */
import wasmUrl from '@/assets/main.wasm?url';
// const wasmUrl = 'http://192.168.1.101:5500/wasm/main.wasm';
(() => {
  const E = () => {
    const M = new Error('not implemented');
    return (M.code = 'ENOSYS'), M;
  };
  if (!globalThis.fs) {
    let M = '';
    globalThis.fs = {
      constants: {
        O_WRONLY: -1,
        O_RDWR: -1,
        O_CREAT: -1,
        O_TRUNC: -1,
        O_APPEND: -1,
        O_EXCL: -1,
      },
      // unused
      writeSync(C, B) {
        M += U.decode(B);
        const I = M.lastIndexOf(`
`);
        return (
          I != -1 && (console.log(M.substring(0, I)), (M = M.substring(I + 1))),
          B.length
        );
      },
      write(C, B, I, y, k, c) {
        if (I !== 0 || y !== B.length || k !== null) {
          c(E());
          return;
        }
        const G = this.writeSync(C, B);
        c(null, G);
      },
      chmod(C, B, I) {
        I(E());
      },
      chown(C, B, I, y) {
        y(E());
      },
      close(C, B) {
        B(E());
      },
      fchmod(C, B, I) {
        I(E());
      },
      fchown(C, B, I, y) {
        y(E());
      },
      fstat(C, B) {
        B(E());
      },
      fsync(C, B) {
        B(null);
      },
      ftruncate(C, B, I) {
        I(E());
      },
      lchown(C, B, I, y) {
        y(E());
      },
      link(C, B, I) {
        I(E());
      },
      lstat(C, B) {
        B(E());
      },
      mkdir(C, B, I) {
        I(E());
      },
      open(C, B, I, y) {
        y(E());
      },
      read(C, B, I, y, k, c) {
        c(E());
      },
      readdir(C, B) {
        B(E());
      },
      readlink(C, B) {
        B(E());
      },
      rename(C, B, I) {
        I(E());
      },
      rmdir(C, B) {
        B(E());
      },
      stat(C, B) {
        B(E());
      },
      symlink(C, B, I) {
        I(E());
      },
      truncate(C, B, I) {
        I(E());
      },
      unlink(C, B) {
        B(E());
      },
      utimes(C, B, I, y) {
        y(E());
      },
    };
  }
  if (
    (globalThis.process ||
      (globalThis.process = {
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
          throw E();
        },
        pid: -1,
        ppid: -1,
        umask() {
          throw E();
        },
        cwd() {
          throw E();
        },
        chdir() {
          throw E();
        },
      }),
    !globalThis.crypto)
  )
    throw new Error(
      'globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)',
    );
  if (!globalThis.performance)
    throw new Error(
      'globalThis.performance is not available, polyfill required (performance.now only)',
    );
  if (!globalThis.TextEncoder)
    throw new Error(
      'globalThis.TextEncoder is not available, polyfill required',
    );
  if (!globalThis.TextDecoder)
    throw new Error(
      'globalThis.TextDecoder is not available, polyfill required',
    );
  const D = new TextEncoder('utf-8'),
    U = new TextDecoder('utf-8');
  globalThis.Go = class {
    constructor() {
      (this.argv = ['js']),
        (this.env = {}),
        (this.exit = (A) => {
          A !== 0 && console.warn('exit code:', A);
        }),
        (this._exitPromise = new Promise((A) => {
          this._resolveExitPromise = A;
        })),
        (this._pendingEvent = null),
        (this._scheduledTimeouts = /* @__PURE__ */ new Map()),
        (this._nextCallbackTimeoutID = 1);
      const M = (A, Q) => {
          this.mem.setUint32(A + 0, Q, !0),
            this.mem.setUint32(A + 4, Math.floor(Q / 4294967296), !0);
        },
        C = (A) => {
          const Q = this.mem.getUint32(A + 0, !0),
            g = this.mem.getInt32(A + 4, !0);
          return Q + g * 4294967296;
        },
        B = (A) => {
          const Q = this.mem.getFloat64(A, !0);
          if (Q === 0) return;
          if (!isNaN(Q)) return Q;
          const g = this.mem.getUint32(A, !0);
          return this._values[g];
        },
        I = (A, Q) => {
          if (typeof Q == 'number' && Q !== 0) {
            if (isNaN(Q)) {
              this.mem.setUint32(A + 4, 2146959360, !0),
                this.mem.setUint32(A, 0, !0);
              return;
            }
            this.mem.setFloat64(A, Q, !0);
            return;
          }
          if (Q === void 0) {
            this.mem.setFloat64(A, 0, !0);
            return;
          }
          let w = this._ids.get(Q);
          w === void 0 &&
            ((w = this._idPool.pop()),
            w === void 0 && (w = this._values.length),
            (this._values[w] = Q),
            (this._goRefCounts[w] = 0),
            this._ids.set(Q, w)),
            this._goRefCounts[w]++;
          let K = 0;
          switch (typeof Q) {
            case 'object':
              Q !== null && (K = 1);
              break;
            case 'string':
              K = 2;
              break;
            case 'symbol':
              K = 3;
              break;
            case 'function':
              K = 4;
              break;
          }
          this.mem.setUint32(A + 4, 2146959360 | K, !0),
            this.mem.setUint32(A, w, !0);
        },
        y = (A) => {
          const Q = C(A + 0),
            g = C(A + 8);
          return new Uint8Array(this._inst.exports.mem.buffer, Q, g);
        },
        k = (A) => {
          const Q = C(A + 0),
            g = C(A + 8),
            w = new Array(g);
          for (let K = 0; K < g; K++) w[K] = B(Q + K * 8);
          return w;
        },
        c = (A) => {
          const Q = C(A + 0),
            g = C(A + 8);
          return U.decode(new DataView(this._inst.exports.mem.buffer, Q, g));
        },
        G = Date.now() - performance.now();
      this.importObject = {
        go: {
          // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
          // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
          // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
          // This changes the SP, thus we have to update the SP used by the imported function.
          // func wasmExit(code int32)
          'runtime.wasmExit': (A) => {
            A >>>= 0;
            const Q = this.mem.getInt32(A + 8, !0);
            (this.exited = !0),
              delete this._inst,
              delete this._values,
              delete this._goRefCounts,
              delete this._ids,
              delete this._idPool,
              this.exit(Q);
          },
          // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
          'runtime.wasmWrite': (A) => {
            A >>>= 0;
            const Q = C(A + 8),
              g = C(A + 16),
              w = this.mem.getInt32(A + 24, !0);
            fs.writeSync(
              Q,
              new Uint8Array(this._inst.exports.mem.buffer, g, w),
            );
          },
          // func resetMemoryDataView()
          'runtime.resetMemoryDataView': (A) => {
            this.mem = new DataView(this._inst.exports.mem.buffer);
          },
          // func nanotime1() int64
          'runtime.nanotime1': (A) => {
            (A >>>= 0), M(A + 8, (G + performance.now()) * 1e6);
          },
          // func walltime() (sec int64, nsec int32)
          'runtime.walltime': (A) => {
            A >>>= 0;
            const Q = /* @__PURE__ */ new Date().getTime();
            M(A + 8, Q / 1e3), this.mem.setInt32(A + 16, (Q % 1e3) * 1e6, !0);
          },
          // func scheduleTimeoutEvent(delay int64) int32
          'runtime.scheduleTimeoutEvent': (A) => {
            A >>>= 0;
            const Q = this._nextCallbackTimeoutID;
            this._nextCallbackTimeoutID++,
              this._scheduledTimeouts.set(
                Q,
                setTimeout(
                  () => {
                    for (this._resume(); this._scheduledTimeouts.has(Q); )
                      console.warn(
                        'scheduleTimeoutEvent: missed timeout event',
                      ),
                        this._resume();
                  },
                  C(A + 8) + 1,
                  // setTimeout has been seen to fire up to 1 millisecond early
                ),
              ),
              this.mem.setInt32(A + 16, Q, !0);
          },
          // func clearTimeoutEvent(id int32)
          'runtime.clearTimeoutEvent': (A) => {
            A >>>= 0;
            const Q = this.mem.getInt32(A + 8, !0);
            clearTimeout(this._scheduledTimeouts.get(Q)),
              this._scheduledTimeouts.delete(Q);
          },
          // func getRandomData(r []byte)
          'runtime.getRandomData': (A) => {
            (A >>>= 0), crypto.getRandomValues(y(A + 8));
          },
          // func finalizeRef(v ref)
          'syscall/js.finalizeRef': (A) => {
            A >>>= 0;
            const Q = this.mem.getUint32(A + 8, !0);
            if ((this._goRefCounts[Q]--, this._goRefCounts[Q] === 0)) {
              const g = this._values[Q];
              (this._values[Q] = null),
                this._ids.delete(g),
                this._idPool.push(Q);
            }
          },
          // func stringVal(value string) ref
          'syscall/js.stringVal': (A) => {
            (A >>>= 0), I(A + 24, c(A + 8));
          },
          // func valueGet(v ref, p string) ref
          'syscall/js.valueGet': (A) => {
            A >>>= 0;
            const Q = Reflect.get(B(A + 8), c(A + 16));
            (A = this._inst.exports.getsp() >>> 0), I(A + 32, Q);
          },
          // func valueSet(v ref, p string, x ref)
          'syscall/js.valueSet': (A) => {
            (A >>>= 0), Reflect.set(B(A + 8), c(A + 16), B(A + 32));
          },
          // func valueDelete(v ref, p string)
          'syscall/js.valueDelete': (A) => {
            (A >>>= 0), Reflect.deleteProperty(B(A + 8), c(A + 16));
          },
          // func valueIndex(v ref, i int) ref
          'syscall/js.valueIndex': (A) => {
            (A >>>= 0), I(A + 24, Reflect.get(B(A + 8), C(A + 16)));
          },
          // valueSetIndex(v ref, i int, x ref)
          'syscall/js.valueSetIndex': (A) => {
            (A >>>= 0), Reflect.set(B(A + 8), C(A + 16), B(A + 24));
          },
          // func valueCall(v ref, m string, args []ref) (ref, bool)
          'syscall/js.valueCall': (A) => {
            A >>>= 0;
            try {
              const Q = B(A + 8),
                g = Reflect.get(Q, c(A + 16)),
                w = k(A + 32),
                K = Reflect.apply(g, Q, w);
              (A = this._inst.exports.getsp() >>> 0),
                I(A + 56, K),
                this.mem.setUint8(A + 64, 1);
            } catch (Q) {
              (A = this._inst.exports.getsp() >>> 0),
                I(A + 56, Q),
                this.mem.setUint8(A + 64, 0);
            }
          },
          // func valueInvoke(v ref, args []ref) (ref, bool)
          'syscall/js.valueInvoke': (A) => {
            A >>>= 0;
            try {
              const Q = B(A + 8),
                g = k(A + 16),
                w = Reflect.apply(Q, void 0, g);
              (A = this._inst.exports.getsp() >>> 0),
                I(A + 40, w),
                this.mem.setUint8(A + 48, 1);
            } catch (Q) {
              (A = this._inst.exports.getsp() >>> 0),
                I(A + 40, Q),
                this.mem.setUint8(A + 48, 0);
            }
          },
          // func valueNew(v ref, args []ref) (ref, bool)
          'syscall/js.valueNew': (A) => {
            A >>>= 0;
            try {
              const Q = B(A + 8),
                g = k(A + 16),
                w = Reflect.construct(Q, g);
              (A = this._inst.exports.getsp() >>> 0),
                I(A + 40, w),
                this.mem.setUint8(A + 48, 1);
            } catch (Q) {
              (A = this._inst.exports.getsp() >>> 0),
                I(A + 40, Q),
                this.mem.setUint8(A + 48, 0);
            }
          },
          // func valueLength(v ref) int
          'syscall/js.valueLength': (A) => {
            (A >>>= 0), M(A + 16, parseInt(B(A + 8).length));
          },
          // valuePrepareString(v ref) (ref, int)
          'syscall/js.valuePrepareString': (A) => {
            A >>>= 0;
            const Q = D.encode(String(B(A + 8)));
            I(A + 16, Q), M(A + 24, Q.length);
          },
          // valueLoadString(v ref, b []byte)
          'syscall/js.valueLoadString': (A) => {
            A >>>= 0;
            const Q = B(A + 8);
            y(A + 16).set(Q);
          },
          // func valueInstanceOf(v ref, t ref) bool
          'syscall/js.valueInstanceOf': (A) => {
            (A >>>= 0),
              this.mem.setUint8(A + 24, B(A + 8) instanceof B(A + 16) ? 1 : 0);
          },
          // func copyBytesToGo(dst []byte, src ref) (int, bool)
          'syscall/js.copyBytesToGo': (A) => {
            A >>>= 0;
            const Q = y(A + 8),
              g = B(A + 32);
            if (!(g instanceof Uint8Array || g instanceof Uint8ClampedArray)) {
              this.mem.setUint8(A + 48, 0);
              return;
            }
            const w = g.subarray(0, Q.length);
            Q.set(w), M(A + 40, w.length), this.mem.setUint8(A + 48, 1);
          },
          // func copyBytesToJS(dst ref, src []byte) (int, bool)
          'syscall/js.copyBytesToJS': (A) => {
            A >>>= 0;
            const Q = B(A + 8),
              g = y(A + 16);
            if (!(Q instanceof Uint8Array || Q instanceof Uint8ClampedArray)) {
              this.mem.setUint8(A + 48, 0);
              return;
            }
            const w = g.subarray(0, Q.length);
            Q.set(w), M(A + 40, w.length), this.mem.setUint8(A + 48, 1);
          },
          debug: (A) => {
            console.log(A);
          },
        },
      };
    }
    async run(M) {
      if (!(M instanceof WebAssembly.Instance))
        throw new Error('Go.run: WebAssembly.Instance expected');
      (this._inst = M),
        (this.mem = new DataView(this._inst.exports.mem.buffer)),
        (this._values = [
          // JS values that Go currently has references to, indexed by reference id
          NaN,
          0,
          null,
          !0,
          !1,
          globalThis,
          this,
        ]),
        (this._goRefCounts = new Array(this._values.length).fill(1 / 0)),
        (this._ids = /* @__PURE__ */ new Map([
          // mapping from JS values to reference ids
          [0, 1],
          [null, 2],
          [!0, 3],
          [!1, 4],
          [globalThis, 5],
          [this, 6],
        ])),
        (this._idPool = []),
        (this.exited = !1);
      let C = 4096;
      const B = (A) => {
          const Q = C,
            g = D.encode(A + '\0');
          return (
            new Uint8Array(this.mem.buffer, C, g.length).set(g),
            (C += g.length),
            C % 8 !== 0 && (C += 8 - (C % 8)),
            Q
          );
        },
        I = this.argv.length,
        y = [];
      this.argv.forEach((A) => {
        y.push(B(A));
      }),
        y.push(0),
        Object.keys(this.env)
          .sort()
          .forEach((A) => {
            y.push(B(`${A}=${this.env[A]}`));
          }),
        y.push(0);
      const c = C;
      y.forEach((A) => {
        this.mem.setUint32(C, A, !0),
          this.mem.setUint32(C + 4, 0, !0),
          (C += 8);
      });
      const G = 4096 + 8192;
      if (C >= G)
        throw new Error(
          'total length of command line and environment variables exceeds limit',
        );
      this._inst.exports.run(I, c),
        this.exited && this._resolveExitPromise(),
        await this._exitPromise;
    }
    _resume() {
      if (this.exited) throw new Error('Go program has already exited');
      this._inst.exports.resume(), this.exited && this._resolveExitPromise();
    }
    _makeFuncWrapper(M) {
      const C = this;
      return function () {
        const B = { id: M, this: this, args: arguments };
        return (C._pendingEvent = B), C._resume(), B.result;
      };
    }
  };
})();
const h = async (E, D) => {
  let U;
  return (
    D ||
      (D = {
        env: {
          abort: () => console.log('Abort!'),
        },
      }),
    WebAssembly.instantiateStreaming
      ? (U = await WebAssembly.instantiateStreaming(fetch(E), D))
      : (U = await (async () => {
          const C = await fetch(E).then((B) => B.arrayBuffer());
          return WebAssembly.instantiate(C, D);
        })()),
    U
  );
};
class p {
  constructor() {
    (this.inputLocalWasm = wasmUrl),
      (this.go = new Go()),
      (this.wasm = null),
      (this.importObject = this.go.importObject);
  }
  async initWasm() {
    let D, U, M;
    return await h(this.inputLocalWasm, this.go.importObject)
      .then((C) => {
        (D = C.module),
          (U = C.instance),
          (M = U.exports),
          (this.wasm = { inst: U, mod: D, exports: M }),
          this.go.run(this.wasm.inst);
      })
      .catch((C) => {
        console.error(C);
      });
  }
  getWasm() {
    return this.wasm;
  }
  /**
   * Creates an account.
   *
   * @param {string}  parameters - jsonString: {"telegramID":"123456","sssData":""} The parameters for creating the account.
   * @return {undefined}
   */
}
export { p as default };
