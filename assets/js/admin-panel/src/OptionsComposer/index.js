import Container from "../Container";
import Toggle from "../Toggle";
import "./index.scss";
import { useState } from "react";

function ErrorControl({ children }) {
    return (
        <div
            className="wa-error-message"
            style={{ marginLeft: "0px", marginRight: "0px", maxWidth: "236px" }}
        >
            {children}
        </div>
    );
}
function MainLinkControl({ config, onChange }) {
    return (
        <Container title="Сделать ссылкой без блока слева">
            <div className="wa-toggle-block">
                <span>Да</span>
                <Toggle
                    value={config.mainLink != null}
                    onChange={(id, val) => onChange({ mainLink: !val ? null : "" })}
                />
            </div>
            <input
                type="text"
                placeholder="Ссылка"
                value={config.mainLink || ""}
                readOnly={config.mainLink == null}
                onChange={(e) => onChange({ mainLink: e.target.value })}
            />
        </Container>
    );
}
function MainIconControl({ config, onChange }) {
    return (
        <Container title="Альтернативная иконка для открытия">
            <input
                type="text"
                placeholder="Ссылка на .png, .jpg, .svg файл"
                value={config.mainIcon}
                onChange={(e) => onChange({ mainIcon: e.target.value })}
            />
        </Container>
    );
}
function AnimationsModesControl({ config, onChange }) {
    const onChangeHandler = (kind) => {
        return (id, val) => onChange({ ...config, [kind]: val });
    };
    return (
        <Container title="Анимация кнопки открытия">
            <div className="wa-toggle-block">
                <span>Пульсирующие волны</span>
                <Toggle
                    value={config.pulseAnimation}
                    onChange={onChangeHandler("pulseAnimation")}
                />
            </div>
            <div className="wa-toggle-block">
                <span>Покачивание</span>
                <Toggle
                    value={config.swingAnimation}
                    onChange={onChangeHandler("swingAnimation")}
                />
            </div>
        </Container>
    );
}
function AppearConditionControl({ config, onChange }) {
    const [error, setError] = useState(null);
    const [value, setValue] = useState({ ...config });
    const onChangeHandler = (kind) => {
        return (e) => {
            setValue({ ...value, [kind]: e.target.value });
            if (e.target.value && !e.target.value.match(/^\d+$/))
                setError("Значение должно быть целым положительным числом");
            else {
                setError(null);
                const num = Number(e.target.value);
                onChange({ ...config, [kind]: num ? num : null });
            }
        };
    };
    return (
        <Container title="Условия появления">
            <div className="wa-input-caption">Прокрутить пикселей от верха</div>
            <input
                type="text"
                placeholder="px"
                value={value.appearDistance}
                onChange={onChangeHandler("appearDistance")}
            />
            <div className="wa-input-caption">Миллисекунд с момента загрузки</div>
            <input
                type="text"
                placeholder="ms"
                value={value.appearDelay}
                onChange={onChangeHandler("appearDelay")}
            />
            {error && <ErrorControl>{error}</ErrorControl>}
        </Container>
    );
}
function AppearSideControl({ config, onChange }) {
    const opposite = { left: "right", right: "left" };
    const onChangeHandler = (kind) => {
        return (id, val) => onChange({ side: val ? kind : opposite[kind] });
    };
    return (
        <Container title="Сторона открытия">
            <div className="wa-toggle-block">
                <span>Слева</span>
                <Toggle value={config.side == "left"} onChange={onChangeHandler("left")} />
            </div>
            <div className="wa-toggle-block">
                <span>Справа</span>
                <Toggle value={config.side == "right"} onChange={onChangeHandler("right")} />
            </div>
        </Container>
    );
}
function ExcludePagesControl({ config, onChange }) {
    const configValue =
        config.excludePages && config.excludePages.length ? config.excludePages.join(", ") : "";
    const [error, setError] = useState(null);
    const [value, setValue] = useState(configValue);
    const onChangeHandler = (e) => {
        setValue(e.target.value);
        if (e.target.value && !e.target.value.match(/^\s*\d+(\s*,\s*\d+)*\s*,?\s*$/)) {
            setError("Значение должно быть числами (идентификаторами), разделенными запятыми");
        } else if (error) setError(null);
        onChange({
            excludePages: !e.target.value ? [] : e.target.value.replace(" ", "").split(","),
        });
    };
    return (
        <Container title="Исключить на страницах">
            <div className="wa-input-caption">Отключить плагин на следующих страницах</div>
            <input
                type="text"
                placeholder="id страниц через запятую"
                value={value}
                onChange={onChangeHandler}
            />
            {error && <ErrorControl>{error}</ErrorControl>}
        </Container>
    );
}

export default function OptionsComposer({ config, onChange }) {
    const onChangeHandler = (newPartialConfig) => {
        onChange({ ...config, ...newPartialConfig });
    };
    const controls = [
        MainLinkControl,
        MainIconControl,
        AnimationsModesControl,
        AppearConditionControl,
        AppearSideControl,
        ExcludePagesControl,
    ];
    return (
        <div className="wa-options-container">
            {controls.map((Control) => (
                <Control config={config} onChange={onChangeHandler} />
            ))}
        </div>
    );
}
