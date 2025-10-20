import { Link } from 'react-router-dom'
import styles from "./AboutUsPage.module.css"

import aboutUsImage1 from "/images/AboutUsPage1.jpg"
import aboutUsImage2p1 from "/images/AboutUsPage2-1.jpg"
import aboutUsImage2p2 from "/images/AboutUsPage2-2.jpg"
import aboutUsImage2p3 from "/images/AboutUsPage2-3.jpg"
import image01 from "/images/01.png"
import image02 from "/images/02.png"
import aboutUsImage3 from"/images/AboutUsPage3.jpg"

import Principle1Icon from "../../assets/icons/principle1.svg?react"
import Principle2Icon from "../../assets/icons/principle2.svg?react"
import Principle3Icon from "../../assets/icons/principle3.svg?react"
import Principle4Icon from "../../assets/icons/principle4.svg?react"
import SberbankIcon from "../../assets/icons/sberbank.svg?react"
import StroygroupIcon from "../../assets/icons/stroygroup.svg?react"
import MapIcon from "../../assets/icons/map.svg?react"
import PhoneIcon from "../../assets/icons/phone.svg?react"
import EmailIcon from "../../assets/icons/email.svg?react"

import { Input } from '../../components/common/Input/Input'
import Button from '../../components/common/Button/Button'
import BreadcrumbNav from '../../components/common/BreadcrumbNav'

const AboutUsPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.topContainer}>
                <div className={styles.topImageContainer}>
                    <img src={aboutUsImage1}></img>
                    <div className={styles.topImageTriangleOverlay}></div>
                </div>
                <BreadcrumbNav currentPage="О нас" />
                <div className={styles.mottoContainer}>
                    <div className={styles.mottoTopContainer}>
                        <span className={styles.motto + " " + styles.motto1}>С ГК «Кварталика»</span>
                        <span className={styles.motto + " " + styles.motto2}>ваша жизнь становится</span>
                        <span className={styles.motto + " " + styles.motto3}>комфортнее и безопаснее</span>
                    </div>
                    <p className={styles.mottoBottomText}>
                        Мы — девелопер полного цикла, который сочетает глубокие знания рынка с современным видением городской среды.<br/>
                        Наслаждайтесь каждым днём в пространстве, созданном для жизни.
                    </p>
                </div>
            </div>

            <div className={styles.imageRow}>
                <div className={styles.imageRowTriangleOverlay}></div>
                <img src={aboutUsImage2p1}></img>
                <img src={aboutUsImage2p2}></img>
                <img src={aboutUsImage2p3}></img>
            </div>

            <div className={styles.principles}>
                <div className={styles.principle}>
                    <div className={styles.principleTitle}>
                        <img src={image01} className={styles.principleImage}></img>
                        <h2 className={styles.principleTitleText}>
                            НАДЕЖНОСТЬ<br/>
                            КАК ФУНДАМЕНТ
                        </h2>
                    </div>
                    <p className={styles.principleDescription}>
                        Наша репутация основана на принципах прозрачности, ответственности и соблюдения сроков. Мы реализуем полный цикл работ — от проектирования до управления объектами, обеспечивая надёжность на каждом этапе.<br/>
                        Все обязательства перед клиентами подкрепляются современными эскроу-механизмами и строгим контролем качества.
                    </p>
                </div>

                <div className={styles.principle}>
                    <div className={styles.principleTitle}>
                        <img src={image02} className={styles.principleImage}></img>
                        <h2 className={styles.principleTitleText}>
                            ИННОВАЦИИ<br/>
                            И ЭКОЛОГИЧНОСТЬ
                        </h2>
                    </div>
                    <p className={styles.principleDescription}>
                        Мы интегрируем в проекты smart-технологии, энергоэффективные системы и экологичные материалы, создавая комфортную и устойчивую среду для жизни.<br/>
                        Наш подход — это синтез современной архитектуры, технологических решений и бережного отношения к окружающей среде.
                    </p>
                </div>
            </div>

            <div className={styles.ourValues}>
                <div className={styles.valuesImageContainer}>
                    <img src={aboutUsImage3}></img>
                    <div className={styles.valuesImageTriangleOverlay}></div>
                </div>
                <div className={styles.ourValuesList}>
                    <h2 className={styles.ourValuesHeader}>Наши ценности</h2>
                    <div className={styles.ourValuesElements}>
                        <div className={styles.ourValuesElement}>
                            <div className={styles.principleIconContainer}>
                                <Principle1Icon />
                            </div>
                            <div className={styles.ourValuesTextBlock}>
                                <h3 className={styles.ourValuesTextBlockHeader}>Профессионализм</h3>
                                <p className={styles.ourValuesTextBlockDescription}>— экспертиза и опыт нашей команды гарантируют высочайший уровень реализации проектов</p>
                            </div>
                        </div>
                        <div className={styles.ourValuesElement}>
                            <div className={styles.principleIconContainer}>
                                <Principle2Icon />
                            </div>
                            <div className={styles.ourValuesTextBlock}>
                                <h3 className={styles.ourValuesTextBlockHeader}>Качество</h3>
                                <p className={styles.ourValuesTextBlockDescription}>— мы используем проверенные материалы и передовые технологии строительства</p>
                            </div>
                        </div>
                        <div className={styles.ourValuesElement}>
                            <div className={styles.principleIconContainer}>
                                <Principle3Icon />
                            </div>
                            <div className={styles.ourValuesTextBlock}>
                                <h3 className={styles.ourValuesTextBlockHeader}>Ответственность</h3>
                                <p className={styles.ourValuesTextBlockDescription}>— четкое соблюдение обязательств перед клиентами и партнерами</p>
                            </div>
                        </div>
                        <div className={styles.ourValuesElement}>
                            <div className={styles.principleIconContainer}>
                                <Principle4Icon />
                            </div>
                            <div className={styles.ourValuesTextBlock}>
                                <h3 className={styles.ourValuesTextBlockHeader}>Устойчивое развитие</h3>
                                <p className={styles.ourValuesTextBlockDescription}>— создаем современную жилую среду, ориентированную на будущее</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.worksWithUs}>
                <h2 className={styles.worksWithUsHeader}>С нами уже работают</h2>
                <div className={styles.worksWithUsContent}>
                    <div className={styles.worksWithUsCompany}>
                        <SberbankIcon />
                        <div className={styles.worksWithUsCompanyText}>
                            <h3 className={styles.worksWithUsCompanyHeader}>Сбербанк</h3>
                            <span className={styles.worksWithUsCompanyDescription}>Ключевой партнер компании ООО СЗ «Стройгрупп»</span>
                        </div>
                    </div>
                    <div className={styles.worksWithUsCompany}>
                        <StroygroupIcon />
                        <div className={styles.worksWithUsCompanyText}>
                            <h3 className={styles.worksWithUsCompanyHeader}>ООО СЗ «Стройгрупп»</h3>
                            <span className={styles.worksWithUsCompanyDescription}>Застройщик ЖК «Нижний, 51»</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.sendRequestContainer}>
                <div className={styles.sendRequestTriangleOverlay}></div>
                <div className={styles.sendRequestForm}>
                    <div className={styles.sendRequestHeader}>
                        <span className={styles.sendRequestHeaderTopText}>
                            Узнайте больше о наших проектах —<br/>
                            посетите офис продаж<br/>
                            или свяжитесь с нами
                        </span>
                    </div>

                    <div className={styles.sendRequestContent}>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactInfoColumn}>
                                <div className={styles.contactInfoBlock}>
                                    <MapIcon />
                                    <div className={styles.contactInfoContent}>
                                        <span>Томск, площадь Батенькова 2, подъезд 7, этаж 3, офис 310</span>
                                        <span>
                                            Режим работы:<br/>
                                            пн–пт: 9:00 –19:00<br/>
                                            сб: 10:00 –18:00
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.contactInfoColumn}>
                                <div className={styles.contactInfoBlock}>
                                    <PhoneIcon />
                                    <div className={styles.contactInfoContent}>
                                        <span>+7 (3822) 30-99-22</span>
                                    </div>
                                </div>
                                <div className={styles.contactInfoBlock}>
                                    <EmailIcon />
                                    <div className={styles.contactInfoContent}>
                                        <span>info@kvartalika.ru</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.formInputContainer}>
                            <div className={styles.formInputs}>
                                <div className={styles.formRow}>
                                    <Input 
                                        type="text"
                                        placeholder="Имя*"
                                    />
                                    <Input 
                                        type="tel"
                                        placeholder="Номер телефона*"
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <Input 
                                        type="text"
                                        placeholder="Ваш комментарий"
                                    />
                                </div>
                            </div>

                            <div className={styles.formBottom}>
                                <span>Нажимая "Отправить заявку", вы соглашаетесь с <Link to="/privacy" className={styles.formLink}>Политикой конфиденциальности</Link></span>
                                <div>
                                    <Button
                                        includeArrow={true}
                                    >Оставить заявку</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;