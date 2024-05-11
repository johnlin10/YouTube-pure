import style from './Footer.module.scss'

export default function Footer() {
  return (
    <div className={style.view}>
      <div className={style.container}>
        <span>Copyright @ Johnlin</span>
        <a href="/#/termsOfUse">Terms of Use</a>
        <a
          href="https://github.com/johnlin10/youpure"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}
