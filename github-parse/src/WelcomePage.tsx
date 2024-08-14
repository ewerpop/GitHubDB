import style from './App.module.scss'

export default function WelcomePage() {
    return(
        <main className={style.main}>
            <h1 className={style.welcomeText}>
                Добро пожаловать
            </h1>
        </main>
    )
}