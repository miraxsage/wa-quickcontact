import Container from "../Container";
import Toggle from "../Toggle";
import "./index.scss";

export default function OptionsComposer() {
    return (
        <div className="wa-options-container">
            <Container title="Сделать ссылкой без блока слева">
                <div className="wa-toggle-block">
                    <span>Да</span>
                    <Toggle />
                </div>
                <input type="text" placeholder="Ссылка" />
            </Container>
            <Container title="Альтернативная иконка для открытия">
                <input
                    type="text"
                    placeholder="Ссылка на .png, .jpg, .svg файл"
                />
            </Container>
            <Container title="Анимация кнопки открытия">
                <div className="wa-toggle-block">
                    <span>Пульсирующие волны</span>
                    <Toggle />
                </div>
                <div className="wa-toggle-block">
                    <span>Покачивание</span>
                    <Toggle />
                </div>
            </Container>
            <Container title="Условия появления">
                <div className="wa-input-caption">
                    Прокрутить пикселей от верха
                </div>
                <input type="number" placeholder="px" />
                <div className="wa-input-caption">
                    Миллисекунд с момента загрузки
                </div>
                <input type="number" placeholder="ms" />
            </Container>
            <Container title="Сторона открытия">
                <div className="wa-toggle-block">
                    <span>Слева</span>
                    <Toggle />
                </div>
                <div className="wa-toggle-block">
                    <span>Справа</span>
                    <Toggle />
                </div>
            </Container>
            <Container title="Условия появления">
                <div className="wa-input-caption">
                    Отключить плагин на следующих страницах
                </div>
                <input type="text" placeholder="id страниц через запятую" />
            </Container>
        </div>
    );
}
