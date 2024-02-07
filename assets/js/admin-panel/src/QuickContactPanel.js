import Container from "./Container";
import LinksComposer from "./LinksComposer";
import OptionsComposer from "./OptionsComposer";
export default function QuickContactPanel() {
    return (
        <div className="wa-quickcontact-container">
            <Container title="Настройка ссылок">
                <LinksComposer />
            </Container>
            <Container title="Настройки основной кнопки открытия">
                <OptionsComposer />
            </Container>
            <Container title="Сохранение" style={{ minWidth: "200px" }}>
                <button
                    className="button button-primary"
                    style={{ width: "100%" }}
                >
                    Сохранить
                </button>
            </Container>
            <div></div>
        </div>
    );
}
