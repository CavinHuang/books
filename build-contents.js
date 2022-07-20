const fs = require('fs')
const path = require('path')

const baseDir = path.resolve(__dirname, './src')

const books = fs.readdirSync(baseDir)

let content = `
# 书籍列表

`

let sidebarContent = `
export default {
`

books.forEach((pathStr) => {
  const fullFilePath = path.resolve(baseDir, pathStr)
  if (fs.statSync(fullFilePath).isDirectory() && pathStr !== '.vitepress') {
    buildContents(fullFilePath)

    content += `
- [${pathStr}](./${encodeURIComponent(pathStr)}/index.md)
`
    const infoFile = path.resolve(fullFilePath, 'booInfo.json')
    if (fs.existsSync(infoFile)) {
      buildSideBar(pathStr, JSON.parse(fs.readFileSync(infoFile)))
    }
  }
})

function buildContents(pathStr) {
  const indexPath = path.join(pathStr, 'index.md')
  if (!fs.existsSync(indexPath)) {
    const files = fs.readdirSync(pathStr)
    let indexContent = `
# 目录
    `
    files.forEach(file => {
      if (fs.statSync(path.join(pathStr, file))) {
        indexContent += `
- [${file}](./${file})
        `
        fs.writeFileSync(indexPath, indexContent)
      }
    })
  }
}

/**
 * /aaa/: [{
      text: 'Introduction',
      collapsible: true,
      items: [
        { text: 'What is VitePress?', link: '/guide/what-is-vitepress' },
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Configuration', link: '/guide/configuration' },
        { text: 'Deploying', link: '/guide/deploying' }
      ]
    }]
 * @param {*} path 
 * @param {*} info 
 */
function buildSideBar(path, info) {
  sidebarContent += `"/${path}/": [{
    text: '${path}',
    collapsible: true,
    items: [
`
  info.data.sections.forEach(item => {
    const itemTitle = item.title.replace(/\|/g, '')
                                  .replace(/\//g, ' or ')
                                  .replace(/[：:]/g, '-')
                                  .replace(/\\/g, '')
                                  .replace(/\//g, '')
                                  .replace(/\*/g, '')
                                  .replace(/\?/g, '')
                                  .replace(/\</g, '')
                                  .replace(/\>/g, '')
                                  .replace(/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g, '')
    sidebarContent += `{
      text: '${item.title}',
      link: '/${path}/${itemTitle}.md'
    },`
  })
  sidebarContent += `]
  }
],
`
}
sidebarContent += `
}
`
fs.writeFileSync(path.join(baseDir, '.vitepress', 'sidebar.ts'), sidebarContent)
fs.writeFileSync(path.resolve(baseDir, 'index.md'), content)

const booksDir = fs.readdirSync(baseDir)

booksDir.forEach(dir => {
  if (dir !== '.vitepress' && fs.statSync(path.join(baseDir, dir)).isDirectory()) {
    const files = fs.readdirSync(path.join(baseDir, dir))

    files.forEach(file => {
      if (file.indexOf('.html') > -1) {
        const fullPath = path.join(baseDir, dir, file)
        fs.unlinkSync(fullPath)
        // fs.renameSync(fullPath, fullPath.replace(/.html/g, ''))
      }
    })
    const indexContent = fs.readFileSync(path.join(path.join(baseDir, dir), 'index.md'))
    fs.writeFileSync(path.join(path.join(baseDir, dir), 'index.md'), indexContent.toString().replace(/.html/g, ''))
  }
})