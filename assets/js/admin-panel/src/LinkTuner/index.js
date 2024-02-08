import { Draggable } from "react-beautiful-dnd";
import "./index.scss";
import Toggle from "../Toggle";
import IconButton from "../IconButton";
import { Base64 } from "../services";

const kindsDefaultTitles = [
    ["whatsapp", "WhatsApp"],
    ["telegram", "Telegram"],
    ["email", "E-mail"],
    ["phone", "Телефон"],
    ["vk", "Вконтакте"],
    ["ok", "Одноклассники"],
    ["instagram", "Инстаграм"],
    ["message", "Произвольный контакт"],
    ["block", "Произвольный блок"],
];

export default function LinkTuner({
    config: { kind, title, link, active, id, bg, icon, content },
    config,
    index,
    onChange,
    onDelete,
} = {}) {
    const onChangeHandler = (option) => {
        return (event, val) => {
            onChange({ ...config, [option]: option == "active" ? val : event.target.value });
        };
    };
    return (
        <Draggable draggableId={`linkEditor${index}`} index={index}>
            {(provided, snapshot) => (
                <div
                    key={`${kind}-${id ?? 0}`}
                    className="wa-link-tuner"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <span class="dashicons dashicons-move" {...provided.dragHandleProps}></span>
                    <div className="wa-link-tuner_content">
                        <div className="wa-link-tuner_title">
                            {kind != "block" && (
                                <div
                                    className={`wa-link-tuner_icon wa-link-tuner_icon__${kind}`}
                                    style={{
                                        ...(kind == "message"
                                            ? { backgroundColor: bg ?? "#c7092c" }
                                            : {}),
                                    }}
                                >
                                    <img
                                        src={
                                            kind == "message" && icon
                                                ? icon
                                                : `${waQuickContactPluginUri}assets/icons/${kind}.svg`
                                        }
                                    />
                                </div>
                            )}
                            <div className="wa-link-tuner_title-text">
                                {title
                                    ? title
                                    : kindsDefaultTitles.reduce(
                                          (prev, [k, t]) => (k == kind ? t : prev),
                                          "",
                                      )}
                            </div>
                            <Toggle value={active} onChange={onChangeHandler("active")} />
                            {(kind == "message" || kind == "block") && (
                                <IconButton
                                    type="trash"
                                    tooltip="Удалить"
                                    tooltipPos="left"
                                    onClick={() => onDelete(config)}
                                />
                            )}
                        </div>
                        {kind != "block" ? (
                            <>
                                <div className="wa-link-tuner_controls">
                                    <input
                                        type="text"
                                        value={title}
                                        placeholder="Подсказка"
                                        onChange={onChangeHandler("title")}
                                    />
                                    <input
                                        type="text"
                                        value={link}
                                        placeholder="Ссылка"
                                        onChange={onChangeHandler("link")}
                                    />
                                </div>
                                {kind == "message" && (
                                    <div className="wa-link-tuner_controls">
                                        <div className="wa-link-tuner_color-control">
                                            <span>Цвет фона</span>
                                            <input
                                                type="color"
                                                value={bg ?? "#c7092c"}
                                                style={{ height: "30px" }}
                                                onChange={onChangeHandler("bg")}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={icon}
                                            placeholder="Ссылка на иконку"
                                            onChange={onChangeHandler("icon")}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <textarea
                                    onChange={onChangeHandler("content")}
                                    value={content}
                                ></textarea>
                            </>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
