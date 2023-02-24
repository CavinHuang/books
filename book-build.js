const fs = require('fs')
const path = require('path')
const { slugify } = require('transliteration')

const baseTargetDir = path.resolve(__dirname, './src')
const baseBookDir = path.resolve(__dirname, './origin-books')

// 拿出所有的书籍
const books = fs.readdirSync(baseBookDir)
let bookListIndex = `
# 目录
`
let sidebarContent = `export default {
`

books.forEach(book => {
  const bookPath = path.join(baseBookDir, book)
  if (fs.statSync(bookPath).isDirectory()) {
    buildBook(bookPath, book)
  }
});
sidebarContent += `
}
`
// 保存目录
fs.writeFileSync(path.join(baseTargetDir, 'index.md'), bookListIndex)
fs.writeFileSync(path.join(baseTargetDir, '.vitepress', 'sidebar.ts'), sidebarContent)

function buildBook(bookPath, book) {
  const indexPath = path.join(bookPath, 'index.md')
  let hasIndex = true
  let indexContent = (() => {
    if (fs.existsSync(indexPath)) {
      hasIndex = true
      return fs.readFileSync(indexPath).toString()
    } else {
      hasIndex = false
      return `# 目录
`
    }
  })()

  const sections = fs.readdirSync(bookPath)

  // 目标文件夹简历
  const bookName = slugify(book)
  const newBookPath = path.join(baseTargetDir, bookName)
  if (!fs.existsSync(newBookPath)) {
    fs.mkdirSync(newBookPath)
  }

  bookListIndex += `
[${book}](./${bookName}/index.md)
`
  sidebarContent += `'/${bookName}/': [{
    text: '${book}',
    collapsible: true,
    items: [`
  sections.forEach(section => {
    const sectionPath = path.join(bookPath, section)
    if (section !== 'index.md' && section.endsWith('.md')) {
      const newPath = slugify(section)
      indexContent = hasIndex ? indexContent.replace(section, newPath) : indexContent + `
- [${section.replace('.md', '')}](./${newPath})
`
      sidebarContent += `{
        text: '${section.replace('.md', '')}',
        link: '/${bookName}/${newPath}'
      },
`
      fs.cpSync(sectionPath, path.join(newBookPath, newPath))
    }
  })

  fs.writeFileSync(path.join(newBookPath, 'index.md'), indexContent)
  sidebarContent +=`
    ]
  }],`
}
