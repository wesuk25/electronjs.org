const i18n = require('../../lib/i18n')
const getIds = require('get-crowdin-file-ids')
const { findKey } = require('lodash')

module.exports = (req, res, next) => {
  const doc = i18n.docs[req.language][req.path]
  if (!doc) return next()

  const context = Object.assign(req.context, {
    doc: doc,
    page: {
      title: `${doc.title} | Electron`,
      description: doc.description,
      url: req.url
    },
    layout: 'docs'
  })

  doc.linkToTranslate = 'https://crowdin.com/project/electron'
  if (req.context.currentLocale !== 'en-US') {
    if (process.env.CROWDIN_KEY) {
      let listIds = getIds('electron', process.env.CROWDIN_KEY)
      let id = listIds[`master/content/en-US${doc.href}.md`]
      if (id !== undefined) {
        doc.linkToTranslate = `https://crowdin.com/translate/electron/${id}/en-${
          req.context.currentLocale.replace(/-/g, '')
        }`
      }
    }
  }

  res.render('docs/show', context)
}
