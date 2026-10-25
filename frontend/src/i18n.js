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
      addProperty: 'Add property',
      favorites: 'Favorites',
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
      back: 'Back to all properties',
      notFound: 'Property not found.',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      area: 'Area',
      description: 'Description',
      address: 'Address',
      listedBy: 'Listed by',
      status_available: 'Available',
      status_sold: 'Sold',
      status_rented: 'Rented',
      save: 'Save to favorites',
      saved: 'Saved to favorites',
      favoriteError: 'Could not update your favorites.',
    },
    favorites: {
      title: 'My favorites',
      empty: 'You have not saved any properties yet.',
    },
    add: {
      title: 'Add a new property',
      agentsOnly: 'Only agents can add properties.',
      fieldTitle: 'Title',
      description: 'Description',
      type: 'Property type',
      selectType: 'Select a type',
      listingType: 'Listing type',
      price: 'Price',
      currency: 'Currency',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      areaSize: 'Area size',
      areaUnit: 'Unit',
      city: 'City',
      selectCity: 'Select a city',
      district: 'District',
      selectDistrict: 'Select a district (optional)',
      address: 'Address',
      photos: 'Photos (optional, up to 10, max 4 MB each)',
      submit: 'Publish property',
      photoError: 'The property was created, but the photos could not be uploaded.',
      viewProperty: 'View the property',
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