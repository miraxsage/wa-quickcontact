import Container from "./Container";
import LinksComposer from "./LinksComposer";
import OptionsComposer from "./OptionsComposer";
import { useState } from "react";

const defaultConfig = {
    links: [
        { kind: "whatsapp", title: null, link: null, active: true },
        { kind: "telegram", title: null, link: null, active: true },
        { kind: "email", title: null, link: null, active: true },
        { kind: "phone", title: null, link: null, active: true },
        { kind: "vk", title: null, link: null, active: true },
        { kind: "ok", title: null, link: null, active: true },
        { kind: "instagram", title: null, link: null, active: true },
        //{ kind: "message", id: "sdf0skkd", title: null, link: null, active: true, bg: null, icon: null },
        //{ kind: "block", id: "sdf0skkd", active: true, content: null },
    ],
    options: {
        mainLink: null,
        mainIcon: null,
        pulseAnimation: true,
        swingAnimation: true,
        appearDelay: null,
        appearDistance: null,
        side: "right",
        excludePages: [],
    },
};

export default function QuickContactPanel() {
    const [config, setConfig] = useState(defaultConfig);
    console.log(config);
    return (
        <div className="wa-quickcontact-container">
            <Container title="Настройка ссылок">
                <LinksComposer
                    config={config.links}
                    onChange={(c) => setConfig({ ...config, links: c })}
                />
            </Container>
            <Container title="Настройки основной кнопки открытия">
                <OptionsComposer
                    config={config.options}
                    onChange={(c) => setConfig({ ...config, options: c })}
                />
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
