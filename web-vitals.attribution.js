var t,
  e,
  n,
  r,
  i,
  a = function () {
    return (
      window.performance &&
      performance.getEntriesByType &&
      performance.getEntriesByType('navigation')[0]
    );
  },
  o = function (t) {
    if ('loading' === document.readyState) return 'loading';
    var e = a();
    if (e) {
      if (t < e.domInteractive) return 'loading';
      if (
        0 === e.domContentLoadedEventStart ||
        t < e.domContentLoadedEventStart
      )
        return 'dom-interactive';
      if (0 === e.domComplete || t < e.domComplete) return 'dom-content-loaded';
    }
    return 'complete';
  },
  u = function (t) {
    var e = t.nodeName;
    return 1 === t.nodeType
      ? e.toLowerCase()
      : e.toUpperCase().replace(/^#/, '');
  },
  c = function (t, e) {
    var n = '';
    try {
      for (; t && 9 !== t.nodeType; ) {
        var r = t,
          i = r.id
            ? '#' + r.id
            : u(r) +
              (r.classList &&
              r.classList.value &&
              r.classList.value.trim() &&
              r.classList.value.trim().length
                ? '.' + r.classList.value.trim().replace(/\s+/g, '.')
                : '');
        if (n.length + i.length > (e || 100) - 1) return n || i;
        if (((n = n ? i + '>' + n : i), r.id)) break;
        t = r.parentNode;
      }
    } catch (t) {}
    return n;
  },
  s = function (t) {
    var e = '';
    try {
      if (t && 9 !== t.nodeType) {
        var n = t.getBoundingClientRect(),
          r = n.top,
          i = n.right,
          a = n.bottom,
          o = n.left;
        e = ''.concat(r, ' ').concat(i, ' ').concat(a, ' ').concat(o);
      }
    } catch (t) {}
    return e;
  },
  f = -1,
  d = function () {
    return f;
  },
  l = function (t) {
    addEventListener(
      'pageshow',
      function (e) {
        e.persisted && ((f = e.timeStamp), t(e));
      },
      !0
    );
  },
  m = function () {
    var t = a();
    return (t && t.activationStart) || 0;
  },
  v = function (t, e) {
    var n = a(),
      r = 'navigate';
    d() >= 0
      ? (r = 'back-forward-cache')
      : n &&
        (document.prerendering || m() > 0
          ? (r = 'prerender')
          : document.wasDiscarded
          ? (r = 'restore')
          : n.type && (r = n.type.replace(/_/g, '-')));
    return {
      name: t,
      value: void 0 === e ? -1 : e,
      rating: 'good',
      delta: 0,
      entries: [],
      id: 'v3-'
        .concat(Date.now(), '-')
        .concat(Math.floor(8999999999999 * Math.random()) + 1e12),
      navigationType: r,
    };
  },
  p = function (t, e, n) {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(t)) {
        var r = new PerformanceObserver(function (t) {
          Promise.resolve().then(function () {
            e(t.getEntries());
          });
        });
        return r.observe(Object.assign({type: t, buffered: !0}, n || {})), r;
      }
    } catch (t) {}
  },
  h = function (t, e, n, r) {
    var i, a;
    return function (o) {
      e.value >= 0 &&
        (o || r) &&
        ((a = e.value - (i || 0)) || void 0 === i) &&
        ((i = e.value),
        (e.delta = a),
        (e.rating = (function (t, e) {
          return t > e[1] ? 'poor' : t > e[0] ? 'needs-improvement' : 'good';
        })(e.value, n)),
        t(e));
    };
  },
  g = function (t) {
    requestAnimationFrame(function () {
      return requestAnimationFrame(function () {
        return t();
      });
    });
  },
  T = function (t) {
    var e = function (e) {
      ('pagehide' !== e.type && 'hidden' !== document.visibilityState) || t(e);
    };
    addEventListener('visibilitychange', e, !0),
      addEventListener('pagehide', e, !0);
  },
  y = function (t) {
    var e = !1;
    return function (n) {
      e || (t(n), (e = !0));
    };
  },
  E = -1,
  S = function () {
    return 'hidden' !== document.visibilityState || document.prerendering
      ? 1 / 0
      : 0;
  },
  L = function (t) {
    'hidden' === document.visibilityState &&
      E > -1 &&
      ((E = 'visibilitychange' === t.type ? t.timeStamp : 0), C());
  },
  b = function () {
    addEventListener('visibilitychange', L, !0),
      addEventListener('prerenderingchange', L, !0);
  },
  C = function () {
    removeEventListener('visibilitychange', L, !0),
      removeEventListener('prerenderingchange', L, !0);
  },
  w = function () {
    return (
      E < 0 &&
        ((E = S()),
        b(),
        l(function () {
          setTimeout(function () {
            (E = S()), b();
          }, 0);
        })),
      {
        get firstHiddenTime() {
          return E;
        },
      }
    );
  },
  M = function (t) {
    document.prerendering
      ? addEventListener(
          'prerenderingchange',
          function () {
            return t();
          },
          !0
        )
      : t();
  },
  x = [1800, 3e3],
  A = function (t, e) {
    (e = e || {}),
      M(function () {
        var n,
          r = w(),
          i = v('FCP'),
          a = p('paint', function (t) {
            t.forEach(function (t) {
              'first-contentful-paint' === t.name &&
                (a.disconnect(),
                t.startTime < r.firstHiddenTime &&
                  ((i.value = Math.max(t.startTime - m(), 0)),
                  i.entries.push(t),
                  n(!0)));
            });
          });
        a &&
          ((n = h(t, i, x, e.reportAllChanges)),
          l(function (r) {
            (i = v('FCP')),
              (n = h(t, i, x, e.reportAllChanges)),
              g(function () {
                (i.value = performance.now() - r.timeStamp), n(!0);
              });
          }));
      });
  },
  F = [0.1, 0.25],
  I = function (t, e) {
    !(function (t, e) {
      (e = e || {}),
        A(
          y(function () {
            var n,
              r = v('CLS', 0),
              i = 0,
              a = [],
              o = function (t) {
                t.forEach(function (t) {
                  if (!t.hadRecentInput) {
                    var e = a[0],
                      n = a[a.length - 1];
                    i &&
                    t.startTime - n.startTime < 1e3 &&
                    t.startTime - e.startTime < 5e3
                      ? ((i += t.value), a.push(t))
                      : ((i = t.value), (a = [t]));
                  }
                }),
                  i > r.value && ((r.value = i), (r.entries = a), n());
              },
              u = p('layout-shift', o);
            u &&
              ((n = h(t, r, F, e.reportAllChanges)),
              T(function () {
                o(u.takeRecords()), n(!0);
              }),
              l(function () {
                (i = 0),
                  (r = v('CLS', 0)),
                  (n = h(t, r, F, e.reportAllChanges)),
                  g(function () {
                    return n();
                  });
              }),
              setTimeout(n, 0));
          })
        );
    })(function (e) {
      !(function (t) {
        if (t.entries.length) {
          var e = t.entries.reduce(function (t, e) {
            return t && t.value > e.value ? t : e;
          });
          if (e && e.sources && e.sources.length) {
            var n =
              (r = e.sources).find(function (t) {
                return t.node && 1 === t.node.nodeType;
              }) || r[0];
            if (n)
              return void (t.attribution = {
                largestShiftTarget: c(n.node),
                largestShiftTime: e.startTime,
                largestShiftValue: e.value,
                largestShiftSource: n,
                largestShiftEntry: e,
                loadState: o(e.startTime),
              });
          }
        }
        var r;
        t.attribution = {};
      })(e),
        t(e);
    }, e);
  },
  B = function (t, e) {
    A(function (e) {
      !(function (t) {
        if (t.entries.length) {
          var e = a(),
            n = t.entries[t.entries.length - 1];
          if (e) {
            var r = e.activationStart || 0,
              i = Math.max(0, e.responseStart - r);
            return void (t.attribution = {
              timeToFirstByte: i,
              firstByteToFCP: t.value - i,
              loadState: o(t.entries[0].startTime),
              navigationEntry: e,
              fcpEntry: n,
            });
          }
        }
        t.attribution = {
          timeToFirstByte: 0,
          firstByteToFCP: t.value,
          loadState: o(d()),
        };
      })(e),
        t(e);
    }, e);
  },
  P = {passive: !0, capture: !0},
  D = new Date(),
  k = function (r, i) {
    t || ((t = i), (e = r), (n = new Date()), H(removeEventListener), R());
  },
  R = function () {
    if (e >= 0 && e < n - D) {
      var i = {
        entryType: 'first-input',
        name: t.type,
        target: t.target,
        cancelable: t.cancelable,
        startTime: t.timeStamp,
        processingStart: t.timeStamp + e,
      };
      r.forEach(function (t) {
        t(i);
      }),
        (r = []);
    }
  },
  q = function (t) {
    if (t.cancelable) {
      var e =
        (t.timeStamp > 1e12 ? new Date() : performance.now()) - t.timeStamp;
      'pointerdown' == t.type
        ? (function (t, e) {
            var n = function () {
                k(t, e), i();
              },
              r = function () {
                i();
              },
              i = function () {
                removeEventListener('pointerup', n, P),
                  removeEventListener('pointercancel', r, P);
              };
            addEventListener('pointerup', n, P),
              addEventListener('pointercancel', r, P);
          })(e, t)
        : k(e, t);
    }
  },
  H = function (t) {
    ['mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(function (e) {
      return t(e, q, P);
    });
  },
  N = [100, 300],
  O = function (n, i) {
    (i = i || {}),
      M(function () {
        var a,
          o = w(),
          u = v('FID'),
          c = function (t) {
            t.startTime < o.firstHiddenTime &&
              ((u.value = t.processingStart - t.startTime),
              u.entries.push(t),
              a(!0));
          },
          s = function (t) {
            t.forEach(c);
          },
          f = p('first-input', s);
        (a = h(n, u, N, i.reportAllChanges)),
          f &&
            T(
              y(function () {
                s(f.takeRecords()), f.disconnect();
              })
            ),
          f &&
            l(function () {
              var o;
              (u = v('FID')),
                (a = h(n, u, N, i.reportAllChanges)),
                (r = []),
                (e = -1),
                (t = null),
                H(addEventListener),
                (o = c),
                r.push(o),
                R();
            });
      });
  },
  j = function (t, e) {
    O(function (e) {
      !(function (t) {
        var e = t.entries[0];
        t.attribution = {
          eventTarget: c(e.target),
          eventType: e.name,
          eventTime: e.startTime,
          eventEntry: e,
          loadState: o(e.startTime),
        };
      })(e),
        t(e);
    }, e);
  },
  U = 0,
  V = 1 / 0,
  _ = 0,
  z = function (t) {
    t.forEach(function (t) {
      t.interactionId &&
        ((V = Math.min(V, t.interactionId)),
        (_ = Math.max(_, t.interactionId)),
        (U = _ ? (_ - V) / 7 + 1 : 0));
    });
  },
  G = function () {
    return i ? U : performance.interactionCount || 0;
  },
  J = function () {
    'interactionCount' in performance ||
      i ||
      (i = p('event', z, {type: 'event', buffered: !0, durationThreshold: 0}));
  },
  K = [200, 500],
  Q = 0,
  W = function () {
    return G() - Q;
  },
  X = [],
  Y = {},
  Z = function (t) {
    var e = X[X.length - 1],
      n = Y[t.interactionId];
    if (n || X.length < 10 || t.duration > e.latency) {
      if (n) n.entries.push(t), (n.latency = Math.max(n.latency, t.duration));
      else {
        var r = {id: t.interactionId, latency: t.duration, entries: [t]};
        (Y[r.id] = r), X.push(r);
      }
      X.sort(function (t, e) {
        return e.latency - t.latency;
      }),
        X.splice(10).forEach(function (t) {
          delete Y[t.id];
        });
    }
  },
  $ = function (t, e) {
    (e = e || {}),
      M(function () {
        J();
        var n,
          r = v('INP'),
          i = function (t) {
            t.forEach(function (t) {
              (t.interactionId && Z(t), 'first-input' === t.entryType) &&
                !X.some(function (e) {
                  return e.entries.some(function (e) {
                    return (
                      t.duration === e.duration && t.startTime === e.startTime
                    );
                  });
                }) &&
                Z(t);
            });
            var e,
              i = ((e = Math.min(X.length - 1, Math.floor(W() / 50))), X[e]);
            i &&
              i.latency !== r.value &&
              ((r.value = i.latency), (r.entries = i.entries), n());
          },
          a = p('event', i, {durationThreshold: e.durationThreshold || 40});
        (n = h(t, r, K, e.reportAllChanges)),
          a &&
            ('interactionId' in PerformanceEventTiming.prototype &&
              a.observe({type: 'first-input', buffered: !0}),
            T(function () {
              i(a.takeRecords()),
                r.value < 0 && W() > 0 && ((r.value = 0), (r.entries = [])),
                n(!0);
            }),
            l(function () {
              (X = []),
                (Q = G()),
                (r = v('INP')),
                (n = h(t, r, K, e.reportAllChanges));
            }));
      });
  },
  tt = function (t, e) {
    $(function (e) {
      !(function (t) {
        if (t.entries.length) {
          var e = t.entries.sort(function (t, e) {
            return (
              e.duration - t.duration ||
              e.processingEnd -
                e.processingStart -
                (t.processingEnd - t.processingStart)
            );
          })[0];
          t.attribution = {
            eventTarget: c(e.target),
            eventClientRects: s(e.target),
            eventType: e.name,
            eventTime: e.startTime,
            eventEntry: e,
            loadState: o(e.startTime),
          };
        } else t.attribution = {};
      })(e),
        t(e);
    }, e);
  },
  et = [2500, 4e3],
  nt = {},
  rt = function (t, e) {
    !(function (t, e) {
      (e = e || {}),
        M(function () {
          var n,
            r = w(),
            i = v('LCP'),
            a = function (t) {
              var e = t[t.length - 1];
              e &&
                e.startTime < r.firstHiddenTime &&
                ((i.value = Math.max(e.startTime - m(), 0)),
                (i.entries = [e]),
                n());
            },
            o = p('largest-contentful-paint', a);
          if (o) {
            n = h(t, i, et, e.reportAllChanges);
            var u = y(function () {
              nt[i.id] ||
                (a(o.takeRecords()), o.disconnect(), (nt[i.id] = !0), n(!0));
            });
            ['keydown', 'click'].forEach(function (t) {
              addEventListener(t, u, !0);
            }),
              T(u),
              l(function (r) {
                (i = v('LCP')),
                  (n = h(t, i, et, e.reportAllChanges)),
                  g(function () {
                    (i.value = performance.now() - r.timeStamp),
                      (nt[i.id] = !0),
                      n(!0);
                  });
              });
          }
        });
    })(function (e) {
      !(function (t) {
        if (t.entries.length) {
          var e = a();
          if (e) {
            var n = e.activationStart || 0,
              r = t.entries[t.entries.length - 1],
              i =
                r.url &&
                performance.getEntriesByType('resource').filter(function (t) {
                  return t.name === r.url;
                })[0],
              o = Math.max(0, e.responseStart - n),
              u = Math.max(o, i ? (i.requestStart || i.startTime) - n : 0),
              s = Math.max(u, i ? i.responseEnd - n : 0),
              f = Math.max(s, r ? r.startTime - n : 0),
              d = {
                element: c(r.element),
                timeToFirstByte: o,
                resourceLoadDelay: u - o,
                resourceLoadTime: s - u,
                elementRenderDelay: f - s,
                navigationEntry: e,
                lcpEntry: r,
              };
            return (
              r.url && (d.url = r.url),
              i && (d.lcpResourceEntry = i),
              void (t.attribution = d)
            );
          }
        }
        t.attribution = {
          timeToFirstByte: 0,
          resourceLoadDelay: 0,
          resourceLoadTime: 0,
          elementRenderDelay: t.value,
        };
      })(e),
        t(e);
    }, e);
  },
  it = [800, 1800],
  at = function t(e) {
    document.prerendering
      ? M(function () {
          return t(e);
        })
      : 'complete' !== document.readyState
      ? addEventListener(
          'load',
          function () {
            return t(e);
          },
          !0
        )
      : setTimeout(e, 0);
  },
  ot = function (t, e) {
    e = e || {};
    var n = v('TTFB'),
      r = h(t, n, it, e.reportAllChanges);
    at(function () {
      var i = a();
      if (i) {
        var o = i.responseStart;
        if (o <= 0 || o > performance.now()) return;
        (n.value = Math.max(o - m(), 0)),
          (n.entries = [i]),
          r(!0),
          l(function () {
            (n = v('TTFB', 0)), (r = h(t, n, it, e.reportAllChanges))(!0);
          });
      }
    });
  },
  ut = function (t, e) {
    ot(function (e) {
      !(function (t) {
        if (t.entries.length) {
          var e = t.entries[0],
            n = e.activationStart || 0,
            r = Math.max(e.domainLookupStart - n, 0),
            i = Math.max(e.connectStart - n, 0),
            a = Math.max(e.requestStart - n, 0);
          t.attribution = {
            waitingTime: r,
            dnsTime: i - r,
            connectionTime: a - i,
            requestTime: t.value - a,
            navigationEntry: e,
          };
        } else
          t.attribution = {
            waitingTime: 0,
            dnsTime: 0,
            connectionTime: 0,
            requestTime: 0,
          };
      })(e),
        t(e);
    }, e);
  };
export {
  F as CLSThresholds,
  x as FCPThresholds,
  N as FIDThresholds,
  K as INPThresholds,
  et as LCPThresholds,
  it as TTFBThresholds,
  I as onCLS,
  B as onFCP,
  j as onFID,
  tt as onINP,
  rt as onLCP,
  ut as onTTFB,
};
