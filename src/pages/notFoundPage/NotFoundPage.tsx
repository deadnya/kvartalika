import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"
import styles from "./NotFoundPage.module.css"

import Image404 from "/images/404.png"
import NotFoundPageSrc from "/images/NotFoundPage.jpg"

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.topContainer}>
                <img src={Image404}></img>
                <div className={styles.textTopContainer}>
                    <div className={styles.textContainer}>
                        <span className={styles.text}>Страница не найдена.</span>
                        <span className={styles.text}>Перейдите на главную страницу или воспользуйтесь меню.</span>
                    </div>

                    <Button
                        variant="outlined"
                        onClick={() => {navigate("/")}}
                    >На главную</Button>
                </div>
            </div>

            <div className={styles.imageContainer}>
                <img src={NotFoundPageSrc}></img>
                <div className={styles.imageTriangleOverlay}></div>
            </div>
        </div>
    )
}

export default NotFoundPage