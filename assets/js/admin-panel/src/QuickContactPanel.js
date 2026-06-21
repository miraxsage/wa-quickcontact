import Container from "./Container";
import LinksComposer from "./LinksComposer";
import OptionsComposer from "./OptionsComposer";
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { Base64 } from "./services";

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
        mainAttrs: null,
        mainIcon: null,
        pulseAnimation: true,
        swingAnimation: true,
        scrollInertia: false,
        appearDelay: null,
        appearDistance: null,
        closeDelay: null,
        side: "right",
        vertical: "bottom",
        excludePages: [],
    },
};

function codeConfig(config, mode = "encode") {
    const codedConfig = {
        ...config,
        links: config.links.map((link) => ({ ...link })),
        options: { ...config.options },
    };
    codedConfig.links.forEach((link) => {
        if (link.kind == "block" && link.content)
            link.content =
                mode == "encode" ? Base64.encode(link.content) : Base64.decode(link.content);
    });
    if (codedConfig.options.mainAttrs)
        codedConfig.options.mainAttrs =
            mode == "encode"
                ? Base64.encode(codedConfig.options.mainAttrs)
                : Base64.decode(codedConfig.options.mainAttrs);
    return codedConfig;
}

export default function QuickContactPanel() {
    const initialConfig = useRef();
    try {
        if (!initialConfig.current) {
            initialConfig.current = JSON.parse(waQuickContactConfig);
            if (!initialConfig.current) throw new Error();
            // подмешиваем дефолты опций, чтобы старые конфиги без новых полей
            // (например vertical) всегда содержали полный набор и проходили валидацию
            initialConfig.current.options = {
                ...defaultConfig.options,
                ...initialConfig.current.options,
            };
        }
    } catch {
        initialConfig.current = defaultConfig;
    }
    const [config, setConfig] = useState(initialConfig.current);
    const savedConfig = useRef(initialConfig.current);
    useLayoutEffect(() => {
        const decoded = codeConfig(config, "decode");
        savedConfig.current = decoded;
        setConfig(decoded);
    }, []);
    const [status, setStatus] = useState({ status: "normal" });
    const hasChanges = JSON.stringify(config) !== JSON.stringify(savedConfig.current);
    useEffect(() => {
        if (!hasChanges) return;
        const onBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "Несохраненные изменения будут утеряны";
            return e.returnValue;
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [hasChanges]);
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
        else {
            savedConfig.current = config;
            setStatus({ status: "success", message: "Настройки успешно сохранены" });
        }
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
            <Container title="Сохранение">
                <button
                    onClick={onSaveHandler}
                    disabled={status.status == "loading" || !hasChanges}
                    className="button button-primary"
                    style={{ display: "block", width: "100%" }}
                >
                    {status.status == "loading" ? (
                        <span className="button-loader">Сохранение...</span>
                    ) : (
                        "Сохранить"
                    )}
                </button>
                {status.status == "error" && (
                    <div className="wa-error-message">
                        {status.message}
                    </div>
                )}
                {status.status == "success" && !hasChanges && (
                    <div className="wa-success-message">
                        {status.message}
                    </div>
                )}
                {status.status != "error" && status.status != "loading" && hasChanges && (
                    <div className="wa-unsaved-message">
                        Изменения не сохранены
                    </div>
                )}
            </Container>
        </div>
    );
}
