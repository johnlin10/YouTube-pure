import style from './Markdown.module.scss'

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/panda-syntax-dark.css'

export default function MarkdownView({ content }) {
  return (
    <div className={style.view}>
      <ReactMarkdown
        remarkPlugins={[gfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
