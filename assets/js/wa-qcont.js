"use strict";
(function () {
    const Base64 = {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
        // public method for encoding
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
    
            input = Base64._utf8_encode(input);
    
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
    
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
    
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
    
                output =
                    output +
                    this._keyStr.charAt(enc1) +
                    this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) +
                    this._keyStr.charAt(enc4);
            } // Whend
    
            return output;
        }, // End Function encode
    
        // public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
    
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
    
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
    
                output = output + String.fromCharCode(chr1);
    
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
    
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            } // Whend
    
            output = Base64._utf8_decode(output);
    
            return output;
        }, // End Function decode
    
        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            var utftext = "";
            string = string.replace(/\r\n/g, "\n");
    
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
    
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if (c > 127 && c < 2048) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            } // Next n
    
            return utftext;
        }, // End Function _utf8_encode
    
        // private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c, c1, c2, c3;
            c = c1 = c2 = 0;
    
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
    
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if (c > 191 && c < 224) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            } // Whend
    
            return string;
        }, // End Function _utf8_decode
    };    

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
            closeDelay: null,
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
            if (config.options.closeDelay != null)
                closeTimeoutId = setTimeout(() => changeVisibility(false), Number(config.options.closeDelay));
        };
        let onLinkClick = () => {
            closeTimeoutId = setTimeout(() => changeVisibility(false), 200);
        };
        let toggleBodyClickListenerForClosing = (() => {
            let clickHandler = (e) => {
                if(e.target && !e.target.closest(".wa-qc-core"))
                    changeVisibility(false);
            };
            return (bind = true) => {
                if(bind)
                    document.body.addEventListener("click", clickHandler);
                else
                    document.body.removeEventListener("click", clickHandler);
            };
        })();
        let changeVisibility = (visible) => {
            if (typeof visible === "boolean") closed = !visible;
            else closed = !closed;
            if (!closed) {
                root.classList.add("wa-qc-close");
            }
            else { 
                root.classList.remove("wa-qc-close");
            }
            toggleBodyClickListenerForClosing(!closed);
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
                                        <div class="wa-qc-bordercase">${!!customConfig ? content : Base64.decode(content)}</div>
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
            if(config.options.closeDelay != null){
                root.addEventListener("mouseenter", onMouseEnter);
                root.addEventListener("mouseleave", onMouseLeave);
            }
        }
        document.body.append(root);
        if (config.options.appearDelay) showMainButton(config.options.appearDelay);
        if (config.options.appearDistance) window.addEventListener("scroll", onScroll);
        if(!config.options.appearDelay && !config.options.appearDistance)
            showMainButton(0); 
    };
})();
