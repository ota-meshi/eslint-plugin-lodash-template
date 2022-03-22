import Cookie from 'cookie'
import JsCookie from 'js-cookie'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { nuxtI18nSeo } from './seo-head'
import { validateRouteParams } from './utils'

Vue.use(VueI18n)

// Options
const LOCALE_CODE_KEY = '<%= options.LOCALE_CODE_KEY %>'
const LOCALE_DOMAIN_KEY = '<%= options.LOCALE_DOMAIN_KEY %>'
const STRATEGIES = <%= JSON.stringify(options.STRATEGIES) %>
const STRATEGY = '<%= options.strategy %>'
const lazy = <%= options.lazy %>
const vuex = <%= JSON.stringify(options.vuex) %>
// Helpers
const getLocaleCodes = <%= options.getLocaleCodes %>
const localeCodes = getLocaleCodes(<%= JSON.stringify(options.locales) %>)

export default async (context) => {
  const { app, route, store, req, res, redirect } = context

  // Helpers
  const getLocaleFromRoute = <%= options.getLocaleFromRoute %>
  const getHostname = <%= options.getHostname %>
  const getForwarded = <%= options.getForwarded %>
  const getLocaleDomain = <%= options.getLocaleDomain %>
  const syncVuex = <%= options.syncVuex %>

  <% if (options.vuex) { %>
  // Register Vuex module
  if (store) {
    store.registerModule(vuex.moduleName, {
      namespaced: true,
      state: () => ({
        <% if (options.vuex.syncLocale) { %>locale: '',<% } %>
        <% if (options.vuex.syncMessages) { %>messages: {},<% } %>
        <% if (options.vuex.syncRouteParams) { %>routeParams: {}<% } %>
      }),
      actions: {
        <% if (options.vuex.syncLocale) { %>
        setLocale ({ commit }, locale) {
          commit('setLocale', locale)
        },
        <% } if (options.vuex.syncMessages) { %>
        setMessages ({ commit }, messages) {
          commit('setMessages', messages)
        },
        <% } if (options.vuex.syncRouteParams) { %>
        setRouteParams ({ commit }, params) {
          if (process.env.NODE_ENV === 'development') {
            validateRouteParams(params)
          }
          commit('setRouteParams', params)
        }
        <% } %>
      },
      mutations: {
        <% if (options.vuex.syncLocale) { %>
          setLocale (state, locale) {
          state.locale = locale
        },
        <% } if (options.vuex.syncMessages) { %>
        setMessages (state, messages) {
          state.messages = messages
        },
        <% } if (options.vuex.syncRouteParams) { %>
        setRouteParams (state, params) {
          state.routeParams = params
        }
        <% } %>
      },
      getters: {
        <% if (options.vuex.syncRouteParams) { %>
        localeRouteParams: ({ routeParams }) => locale => routeParams[locale] || {}
        <% } %>
      }
    }, { preserveState: !!store.state[vuex.moduleName] })
  }
  <% } %>

  const detectBrowserLanguage = <%= JSON.stringify(options.detectBrowserLanguage) %>
  const { useCookie, cookieKey } = detectBrowserLanguage

  const getLocaleCookie = () => {
    if (useCookie) {
      if (process.client) {
        return JsCookie.get(cookieKey)
      } else if (req && typeof req.headers.cookie !== 'undefined') {
        const cookies = req.headers && req.headers.cookie ? Cookie.parse(req.headers.cookie) : {}
        return cookies[cookieKey]
      }
    }
  }

  const setLocaleCookie = locale => {
    if (!useCookie) {
      return
    }
    const date = new Date()
    if (process.client) {
      JsCookie.set(cookieKey, locale, {
        expires: new Date(date.setDate(date.getDate() + 365)),
        path: '/'
      })
    } else if (res) {
      let headers = res.getHeader('Set-Cookie') || []
      if (typeof headers == 'string') {
        headers = [headers]
      }

      const redirectCookie = Cookie.serialize(cookieKey, locale, {
        expires: new Date(date.setDate(date.getDate() + 365)),
        path: '/'
      })
      headers.push(redirectCookie)

      res.setHeader('Set-Cookie', headers)
    }
  }

  const loadAndSetLocale = async (newLocale, { initialSetup = false } = {}) => {
    // Abort if different domains option enabled
    if (!initialSetup && app.i18n.differentDomains) {
      return
    }

    // Abort if newLocale did not change
    if (newLocale === app.i18n.locale) {
      return
    }

    const oldLocale = app.i18n.locale

    if (!initialSetup) {
      app.i18n.beforeLanguageSwitch(oldLocale, newLocale)

      if (useCookie) {
        app.i18n.setLocaleCookie(newLocale)
      }
    }

    // Lazy-loading enabled
    if (lazy) {
      const { loadLanguageAsync } = require('./utils')

      // Load fallback locale.
      if (app.i18n.fallbackLocale && newLocale !== app.i18n.fallbackLocale) {
        await loadLanguageAsync(context, app.i18n.fallbackLocale)
      }

      await loadLanguageAsync(context, newLocale)
    }

    app.i18n.locale = newLocale

    if (!initialSetup) {
      app.i18n.onLanguageSwitched(oldLocale, newLocale)
    }

    await syncVuex(newLocale, app.i18n.getLocaleMessage(newLocale))

    if (!initialSetup && STRATEGY !== STRATEGIES.NO_PREFIX) {
      const route = app.i18n.__route
      const routeName = route && route.name ? app.getRouteBaseName(route) : 'index'
      const redirectPath = app.localePath(Object.assign({}, route, { name: routeName }), newLocale)

      if (route && route.path !== redirectPath) {
        redirect(redirectPath)
      }
    }
  }

  // Set instance options
  app.i18n = new VueI18n(<%= JSON.stringify(options.vueI18n) %>)
  app.i18n.locales = <%= JSON.stringify(options.locales) %>
  app.i18n.defaultLocale = '<%= options.defaultLocale %>'
  app.i18n.differentDomains = <%= options.differentDomains %>
  app.i18n.forwardedHost = <%= options.forwardedHost %>
  app.i18n.beforeLanguageSwitch = <%= options.beforeLanguageSwitch %>
  app.i18n.onLanguageSwitched = <%= options.onLanguageSwitched %>
  app.i18n.setLocaleCookie = setLocaleCookie
  app.i18n.getLocaleCookie = getLocaleCookie
  app.i18n.setLocale = (locale) => loadAndSetLocale(locale)

  // Current route. Updated from middleware also.
  app.i18n.__route = route

  // Inject seo function
  Vue.prototype.$nuxtI18nSeo = nuxtI18nSeo

  if (store && store.state.localeDomains) {
    app.i18n.locales.forEach(locale => {
      locale.domain = store.state.localeDomains[locale.code]
    })
  }

  let locale = app.i18n.defaultLocale || null

  if (app.i18n.differentDomains) {
    const domainLocale = getLocaleDomain()
    locale = domainLocale ? domainLocale : locale
  } else if (STRATEGY !== STRATEGIES.NO_PREFIX) {
    const routesNameSeparator = '<%= options.routesNameSeparator %>'
    const defaultLocaleRouteNameSuffix = '<%= options.defaultLocaleRouteNameSuffix %>'

    const routeLocale = getLocaleFromRoute(route, routesNameSeparator, defaultLocaleRouteNameSuffix, app.i18n.locales)
    locale = routeLocale ? routeLocale : locale
  } else if (useCookie) {
      locale = getLocaleCookie() || locale
  }

  await loadAndSetLocale(locale, { initialSetup: true })

  app.i18n.__detectBrowserLanguage = async route => {
    const { alwaysRedirect, fallbackLocale } = detectBrowserLanguage

    if (detectBrowserLanguage) {
      let browserLocale

      if (useCookie && (browserLocale = getLocaleCookie()) && browserLocale !== 1 && browserLocale !== '1') {
        // Get preferred language from cookie if present and enabled
        // Exclude 1 for backwards compatibility and fallback when fallbackLocale is empty
      } else if (process.client && typeof navigator !== 'undefined' && navigator.language) {
        // Get browser language either from navigator if running on client side, or from the headers
        browserLocale = navigator.language.toLocaleLowerCase().substring(0, 2)
      } else if (req && typeof req.headers['accept-language'] !== 'undefined') {
        browserLocale = req.headers['accept-language'].split(',')[0].toLocaleLowerCase().substring(0, 2)
      }

      if (browserLocale) {
        // Handle cookie option to prevent multiple redirections
        if (!useCookie || alwaysRedirect || !getLocaleCookie()) {
          let redirectToLocale = fallbackLocale

          // Use browserLocale if we support it, otherwise use fallbackLocale
          if (localeCodes.includes(browserLocale)) {
            redirectToLocale = browserLocale
          }

          if (redirectToLocale && localeCodes.includes(redirectToLocale)) {
            if (redirectToLocale !== app.i18n.locale) {
              // We switch the locale before redirect to prevent loops
              await app.i18n.setLocale(redirectToLocale)
            } else if (useCookie && !getLocaleCookie()) {
              app.i18n.setLocaleCookie(redirectToLocale)
            }
          }

          return true
        }
      }
    }

    return false
  }

  await app.i18n.__detectBrowserLanguage(route)
}
