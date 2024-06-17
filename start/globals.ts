import edge from 'edge.js'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as phIcons } from '@iconify-json/ph'

addCollection(phIcons)
edge.use(edgeIconify)

/**
 * Globals are used to store application state
 */
edge.global('config', {
  appName: 'Adonisjs Example',
  colorScheme: 'dark',
  menu: [],
  socialLinks: [],
})
