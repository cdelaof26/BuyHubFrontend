function shopping_bag() {let currentScript;const htmlScripts = document.querySelectorAll('script');for (let __i = 0; __i < htmlScripts.length; __i++) {if (/(.*[/\\]shopping_bag\.js)|(^shopping_bag\.js)/g.test(htmlScripts[__i].src)) {currentScript = htmlScripts[__i];break;}}const classData = currentScript.getAttribute('classData');const e0 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');e0.setAttribute('class', `${classData}`);e0.setAttribute('xmlns', "http://www.w3.org/2000/svg");e0.setAttribute('viewBox', "0 0 24 24");e0.setAttribute('fill', "currentColor");const e1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');e1.setAttribute('fill-rule', "evenodd");e1.setAttribute('d', "M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z");e1.setAttribute('clip-rule', "evenodd");e0.appendChild(e1);currentScript.replaceWith(e0);}if (document.readyState === 'loading') {document.addEventListener("DOMContentLoaded", () => shopping_bag());} else {shopping_bag();}