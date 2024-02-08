import Container from "./Container";
import LinksComposer from "./LinksComposer";
import OptionsComposer from "./OptionsComposer";
import { useState, useLayoutEffect } from "react";
import classes from "classnames";

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

function codeConfig(config, mode = "encode") {
    const codedConfig = { ...config, links: config.links.map((link) => ({ ...link })) };
    codedConfig.links.forEach((link) => {
        if (link.kind == "block" && link.content)
            link.content = mode == "encode" ? btoa(link.content) : atob(link.content);
    });
    return codedConfig;
}

export default function QuickContactPanel() {
    const [config, setConfig] = useState(
        waQuickContactConfig ? JSON.parse(waQuickContactConfig) : defaultConfig,
    );
    useLayoutEffect(() => {
        setConfig(codeConfig(config, "decode"));
    }, []);
    const [status, setStatus] = useState({ status: "normal" });
    const onChangeHandler = (newConfig) => {
        setStatus({ status: "normal" });
        setConfig(newConfig);
        return;
    };

    const onSaveHandler = async () => {
        setStatus({ status: "loading" });
        const response = await fetch("/wp-admin/admin-ajax.php?action=wa-quickcontact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(codeConfig(config)),
        });
        if (!response.ok) {
            setStatus({ status: "error", message: "Некорректный ответ сервера" });
            return;
        }
        let json = null;
        try {
            json = await response.json();
        } catch (exc) {
            setStatus({ status: "error", message: "Некорректный ответ сервера" });
            return;
        }
        if (!json || typeof json != "object" || !json.success)
            setStatus({
                status: "error",
                message: json.message ? json.message : "Некорректный ответ сервера",
            });
        else setStatus({ status: "success", message: "Настройки успешно сохранены" });
    };
    return (
        <div className="wa-quickcontact-container">
            <Container title="Настройка ссылок">
                <LinksComposer
                    config={config.links}
                    onChange={(c) => onChangeHandler({ ...config, links: c })}
                />
            </Container>
            <Container title="Настройки основной кнопки открытия">
                <OptionsComposer
                    config={config.options}
                    onChange={(c) => onChangeHandler({ ...config, options: c })}
                />
            </Container>
            <Container title="Сохранение" style={{ minWidth: "200px" }}>
                <button
                    onClick={onSaveHandler}
                    className={classes("button button-primary", {
                        "success-button": status.status == "success",
                    })}
                    style={{ width: "100%" }}
                >
                    {status.status == "loading" && (
                        <span className="button-loader">Сохранение...</span>
                    )}
                    {status.status == "success" && "Сохранено"}
                    {(status.status == "error" || status.status == "normal") && "Сохранить"}
                </button>
                {status.status == "success" && (
                    <div className="wa-success-message" style={{ maxWidth: "171px" }}>
                        {status.message}
                    </div>
                )}
                {status.status == "error" && (
                    <div className="wa-error-message" style={{ maxWidth: "171px" }}>
                        {status.message}
                    </div>
                )}
            </Container>
            <div></div>
        </div>
    );
}
