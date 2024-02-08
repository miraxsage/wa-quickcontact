import IconButton from "../IconButton";
import LinkTuner from "../LinkTuner";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useState, useRef, useEffect } from "react";
import classes from "classnames";
import "./index.scss";

function AddButton({ onAdd }) {
    const [isHovered, setIsHovered] = useState(false);
    const onClickHandler = (kind) => {
        return () => {
            onAdd(kind);
        };
    };
    return (
        <div className="wa-links-composer_add-button" onMouseLeave={() => setIsHovered(false)}>
            <div
                className={classes("wa-links-composer_side-button", {
                    "wa-links-composer_side-button__shown": isHovered,
                })}
                onClick={onClickHandler("block")}
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
                onClick={onClickHandler("message")}
            >
                <span class="dashicons dashicons-arrow-right-alt2"></span>
                Сообщение
            </div>
        </div>
    );
}

export default function LinksComposer({ config, onChange }) {
    const rootRef = useRef();
    const onDragEnd = (result) => {
        if (!result.destination) return;
        let newConfig = [...config];
        let [item] = newConfig.splice(result.source.index, 1);
        newConfig.splice(result.destination.index, 0, item);
        onChange(newConfig);
    };
    const onAddHandler = (kind) => {
        if (kind == "block")
            onChange([...config, { kind: "block", id: "sdf0skkd", active: true, content: null }]);
        if (kind == "message")
            onChange([
                ...config,
                {
                    kind: "message",
                    id: "sdf0skkd",
                    title: null,
                    link: null,
                    active: true,
                    bg: null,
                    icon: null,
                },
            ]);
    };
    useEffect(() => {
        if (!rootRef.current) return;
        const observer = new MutationObserver(() => {
            const shifter = rootRef.current.querySelector("[data-rbd-placeholder-context-id]");
            if (!shifter || shifter.matches(":last-child")) return;
            const parent = shifter.parentNode;
            parent.appendChild(shifter);
            shifter.style["max-height"] = "unset";
        });
        observer.observe(rootRef.current.querySelector(".wa-quickcontacts-links"), {
            attributes: false,
            childList: true,
            subtree: false,
        });
        return () => observer.disconnect();
    }, []);
    return (
        <div ref={rootRef}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sidebars-profile-bar-droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="wa-quickcontacts-links"
                        >
                            {provided.placeholder}
                            {config.map((c, i) => (
                                <LinkTuner
                                    config={c}
                                    index={i}
                                    onChange={(newConfig) =>
                                        onChange(config.map((_c) => (_c == c ? newConfig : _c)))
                                    }
                                    onDelete={(_c) => onChange(config.filter((c) => c != _c))}
                                />
                            ))}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <AddButton onAdd={onAddHandler} />
        </div>
    );
}
