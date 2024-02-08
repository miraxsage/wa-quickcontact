"use strict";
(function () {
    const initialConfig = waQuickContactConfig ? JSON.parse(waQuickContactConfig) : {
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
    function createElements(markup) {
        let template = document.createElement("template");
        template.innerHTML = markup.trim();
        return template.content.children;
    }
    function createElement(markup) {
        const elements = createElements(markup);
        if(elements && elements.length > 0)
            return elements[0];
        return null;
    }
    window.WaQuickContact = function (customConfig) {
        const config = { ...initialConfig };
        if(customConfig){
            if(customConfig.links && typeof customConfig.links == "object"){
                customConfig.links = Array.from(customConfig.links);
                const customLinks = [];
                customConfig.links.forEach(link => {
                    if(typeof link == "object" && 
                       typeof link.kind == "string" && 
                       link.kind.match(/^whatsapp|telegram|email|phone|vk|ok|instagram|message|block$/i)){
                        customLinks.push({...link, active: true});
                    }
                });
                config.links = customLinks;
            }
            if(customConfig.options && typeof customConfig.options == "object")
                config.options = customConfig.options;
        }
        let closed = true;
        let root = null;
        let closeTimeoutId = null;
        let socials = [];
        let itemsCount = 0;
        let iconsUri = waQuickContactPluginUri
            ? waQuickContactPluginUri + "assets/icons/"
            : "../icons/";
        let onMouseEnter = () => {
            clearTimeout(closeTimeoutId);
        };
        let onMouseLeave = () => {
            if (typeof config.options.closeDelay == "number")
                closeTimeoutId = setTimeout(() => changeVisibility(false), config.options.closeDelay);
        };
        let onLinkClick = () => {
            closeTimeoutId = setTimeout(() => changeVisibility(false), 200);
        };
        let changeVisibility = (visible) => {
            if (typeof visible === "boolean") closed = !visible;
            else closed = !closed;
            if (!closed) root.classList.add("wa-qc-close");
            else root.classList.remove("wa-qc-close");
        };
        let showMainButton = (delay) => {
            if (root.classList.contains("wa-qc-shown")) return;
            setTimeout(() => root.classList.add("wa-qc-shown"), delay ?? 0);
        };
        let onScroll = () => {
            if ((window.scrollY || document.documentElement.scrollTop) > config.options.appearDistance) {
                window.removeEventListener("scroll", onScroll);
                showMainButton();
            }
        };
        if (!config.options.mainLink && config.links) {
            let link;
            const defaultTitles = {
                whatsapp: "WhatsApp",
                telegram: "Telegram",
                email: "E-mail",
                phone: "Call",
                vk: "VK",
                ok: "OK",
                instagram: "Inst",
                message: "Ссылка",
            };
            socials = config.links
                .map(({kind, title, link, active, bg, icon, content}) => {
                    itemsCount++;
                    if (active && kind && kind.match(/^whatsapp|telegram|email|phone|vk|ok|instagram|message|block$/i)) {
                        if (kind == "block")
                            return `<div class="wa-qc-contact-block" style="--item-number:${itemsCount}">
                                        <div class="wa-qc-bordercase">${!!customConfig ? content : atob(content)}</div>
                                    </div>`;
                        else
                            return `<div style="--item-number:${itemsCount}" class="wa-qc-contact">
                                        <b>${title ?? defaultTitles[kind]}</b>
                                        <a href="${link ?? "#"}" class="wa-qc-${kind}">
                                            <div class="wa-qc-icon" 
                                                 ${kind == "message" && bg ? 
                                                    ` style="background-color:${bg};border-radius: 50%;"` 
                                                    : ""}
                                            >
                                                <img alt="${title}" src="${icon ?? iconsUri + `${kind}.svg`}">
                                            </div>
                                        </a>
                                    </div>`;
                    }
                    itemsCount--;
                    return null;
                })
                .filter(Boolean);
        }
        let totalDelay = Math.round((socials.length * 5) / 9) / 10;
        let markup = `
        <div class="wa-qc-core 
                    wa-qc-${config.options.side == "left" ? "left" : "right"}
                    ${config.options.pulseAnimation ? " wa-qc-pulse" : ""}
                    ${config.options.swingAnimation ? " wa-qc-swing" : ""}" 
            style="--total-items: ${socials.length};
                    --total-delay: ${totalDelay}s;"
        >
            <div class="wa-qc-list">
                ${socials.join(" ")}
            </div>
            ${config.options.mainLink ? `<a href="${config.options.mainLink}">` : ""}
                <div class="wa-qc-circle">      
                    <div class="wa-qc-open">
                        <img alt="open contacts" class="wa-qc-open-img" src="${config.options.mainIcon ? config.options.mainIcon : iconsUri + "message.svg"}">
                        <img alt="close contacts" class="wa-qc-close-img" src="${iconsUri}close.svg">
                    </div>
                </div>
            ${config.options.mainLink ? "</a>" : ""}
        </div>`;
        root = createElement(markup);
        if(!config.options.mainLink){
            root.querySelector(".wa-qc-circle").addEventListener("click", changeVisibility);
            root.querySelectorAll("a").forEach((el) => el.addEventListener("click", onLinkClick));
            root.addEventListener("mouseenter", onMouseEnter);
            root.addEventListener("mouseleave", onMouseLeave);
        }
        document.body.append(root);
        if (config.options.appearDelay) showMainButton(config.options.appearDelay);
        if (config.options.appearDistance) window.addEventListener("scroll", onScroll);
        if(!config.options.appearDelay && !config.options.appearDistance)
            showMainButton(0); 
    };
})();
