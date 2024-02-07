import IconButton from "../IconButton";
import LinkTuner from "../LinkTuner";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useState } from "react";
import classes from "classnames";
import "./index.scss";

function AddButton() {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            className="wa-links-composer_add-button"
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={classes("wa-links-composer_side-button", {
                    "wa-links-composer_side-button__shown": isHovered,
                })}
            >
                Блок
                <span class="dashicons dashicons-arrow-left-alt2"></span>
            </div>
            <IconButton
                type="add"
                tooltip="Добавить"
                tooltipPos="top"
                onMouseEnter={() => setIsHovered(true)}
            />
            <div
                className={classes("wa-links-composer_side-button", {
                    "wa-links-composer_side-button__shown": isHovered,
                })}
            >
                <span class="dashicons dashicons-arrow-right-alt2"></span>
                Сообщение
            </div>
        </div>
    );
}

export default function LinksComposer() {
    const kind_clauses = [
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
    return (
        <div>
            <DragDropContext>
                <Droppable droppableId="sidebars-profile-bar-droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="wa-quickcontacts-links"
                        >
                            {provided.placeholder}
                            {kind_clauses.map(([kind, title], i) => (
                                <LinkTuner
                                    kind={kind}
                                    title={title}
                                    index={i}
                                />
                            ))}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <AddButton />
        </div>
    );
}
