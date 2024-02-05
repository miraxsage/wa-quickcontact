"use strict";
(function(){
    let defaultConfig = {
        side: 'right',
        link: null,
        showCondition: {
            value: 300,
            unit: 'ms'
        },
        closeDelay: 1000,
        pulse: true,
        swing: true,
    };
    function createElement(markup){
        let template = document.createElement('template');
        template.innerHTML = markup.trim();
        return template.content.children;
    }
    window.WaQuickContact = function(config){
        config = {
            ...defaultConfig,
            ...config
        };
        let closed = true;
        let root = null;
        let closeTimeoutId = null;
        let socials = [];
        let itemsCount = 0;
        let onMouseEnter = () => {
            clearTimeout(closeTimeoutId);
        }
        let onMouseLeave = () => {
            if(typeof config.closeDelay == 'number')
                closeTimeoutId = setTimeout(() => changeVisibility(false), config.closeDelay);
        }
        let onLinkClick = () => {
            closeTimeoutId = setTimeout(() => changeVisibility(false), 200);
        }
        let changeVisibility = (visible) => {
            if(typeof(visible) === 'boolean')
                closed = !visible;
            else
                closed = !closed;
            if(!closed)
                root.classList.add('wa-qc-close');
            else
                root.classList.remove('wa-qc-close');
        }
        let showMainButton = (delay) => {
            setTimeout(() => root.classList.add('wa-qc-shown'), delay ?? 0);
        }
        let onScroll = () => {
            if((window.scrollY || document.documentElement.scrollTop) > config.showCondition.value && config.showCondition.unit == "px"){
                window.removeEventListener('scroll', onScroll);
                showMainButton();
            }
        }
        if(!config.link && config.links){
            let link;
            socials = [['whatsapp', 'WhatsApp'], ['telegram', 'Telegram'], ['email', 'E-mail'], ['phone', 'Call'], ['vk', 'VK'], ['ok', 'OK'], ['instagramm', 'Inst'], ['message'], ['block']].map(([kind, title]) => {
                itemsCount++;
                if(link = config.links[kind]){
                    if(kind == 'message'){
                        title = config.links[kind].title;
                        link = config.links[kind].link;
                    }
                    else if(kind == 'block')
                       return `<div class="wa-qc-contact-block" style="--item-number:${itemsCount}"><div class="wa-qc-freecase">${config.links[kind].title}</div><div class="wa-qc-bordercase">${config.links[kind].content}</div></div>`;
                    return `<div style="--item-number:${itemsCount}" class="wa-qc-contact"><b>${title}</b><a href="${link}" class="wa-qc-${kind}"><div class="wa-qc-icon"><img alt="${title}" src="icons/${kind}.svg"></div></a></div>`;
                }
                itemsCount--;
                return null;
            }).filter(Boolean);
        }
        let totalDelay = Math.round(socials.length * 5 / 9) / 10;
        let markup = `<div class="wa-qc-core wa-qc-${config.side == 'left' ? 'left': 'right'}${config.pulse ? ' wa-qc-pulse' : ''}${config.swing ? ' wa-qc-swing' : ''}" style="--total-items: ${socials.length};--total-delay: ${totalDelay}s;">
            <div class="wa-qc-list">
                ${socials.join(" ")}
            </div>
            ${config.link ? `<a href="${config.link}">` : ''}
                <div class="wa-qc-circle">      
                    <div class="wa-qc-open">
                        <img alt="contact" class="wa-qc-open-img" src="icons/message.svg">
                        <img alt="contact" class="wa-qc-close-img" src="icons/close.svg">
                    </div>
                </div>
            ${config.link ? '</a>' : ''}
        </div>`;
        root = createElement(markup)[0];
        root.querySelector('.wa-qc-circle').addEventListener('click', changeVisibility);
        root.querySelectorAll('a').forEach(el => el.addEventListener('click', onLinkClick));
        root.addEventListener('mouseenter', onMouseEnter);
        root.addEventListener('mouseleave', onMouseLeave);
        document.body.append(root);
        if(config.showCondition.unit == "ms")
            showMainButton(config.showCondition.value);
        else
            window.addEventListener('scroll', onScroll);
    };
})();