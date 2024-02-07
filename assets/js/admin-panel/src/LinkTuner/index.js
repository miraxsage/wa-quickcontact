import { Draggable } from "react-beautiful-dnd";
import "./index.scss";
import Toggle from "../Toggle";
import IconButton from "../IconButton";

export default function LinkTuner({
    kind = "message",
    title = "",
    index,
} = {}) {
    return (
        <Draggable draggableId={`linkEditor${index}`} index={index}>
            {(provided, snapshot) => (
                <div
                    className="wa-link-tuner"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <span
                        class="dashicons dashicons-move"
                        {...provided.dragHandleProps}
                    ></span>
                    <div className="wa-link-tuner_content">
                        <div className="wa-link-tuner_title">
                            {kind != "block" &&
                              <div
                                  className={`wa-link-tuner_icon wa-link-tuner_icon__${kind}`}
                              >
                                  <img
                                      src={`${waQuickContactPluginUri}assets/icons/${kind}.svg`}
                                  />
                              </div>
                            }
                            <div className="wa-link-tuner_title-text">
                                {title}
                            </div>
                            <Toggle />
                            {kind == "message" || kind == "block" && <IconButton type="trash" tooltip="Удалить" tooltipPos="left" />}
                        </div>
                        {kind != "block" ? (
                        <>
                            <div className="wa-link-tuner_controls">
                                <input type="text" placeholder="Подсказка" />
                                <input type="text" placeholder="Ссылка" />
                            </div>
                            {kind == "message" && (
                                <div className="wa-link-tuner_controls">
                                    <div className="wa-link-tuner_color-control">
                                        <span>Цвет фона</span>
                                        <input
                                            type="color"
                                            style={{ height: "30px" }}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Ссылка на иконку"
                                    />
                                </div>
                            )}
                        </>)
                        :
                        <>
                          <textarea></textarea>
                        </>}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
