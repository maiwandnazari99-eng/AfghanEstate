import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// All texts of the website live here.
// Later we will add Dari (fa) and Pashto (ps) next to "en".
const en = {
  translation: {
    app: {
      title: 'Afghan Estate',
      latest: 'Latest properties',
    },
    nav: {
      login: 'Log in',
      register: 'Sign up',
      logout: 'Log out',
      hello: 'Hello, {{name}}',
    },
    auth: {
      loginTitle: 'Log in to your account',
      registerTitle: 'Create an account',
      name: 'Full name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      role: 'I am a...',
      roleBuyer: 'Buyer',
      roleTenant: 'Tenant',
      roleAgent: 'Agent',
      loginButton: 'Log in',
      registerButton: 'Sign up',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      working: 'Please wait...',
    },
    common: {
      loading: 'Loading...',
      noPhoto: 'No photo',
      noProperties: 'No properties yet.',
      loadError: 'Could not load properties: {{message}}',
      networkError: 'Cannot reach the server. Is it running?',
    },
    property: {
      forSale: 'For sale',
      forRent: 'For rent',
      beds: '{{value}} bed',
      baths: '{{value}} bath',
    },
  },
}

i18n.use(initReactI18next).init({
  resources: { en },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n