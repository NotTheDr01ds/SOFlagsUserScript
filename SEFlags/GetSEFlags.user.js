// ==UserScript==
// @name         Get SE Post Flags
// @namespace    http://tampermonkey.net/
// @version      2024-04-03
// @description  Retrieve flags for a Stack Exchange site as JSON to clipboard
// @author       NotTheDr01ds
// @match        https://stackoverflow.com/users/flag-summary/*
// @match        https://askubuntu.com/users/flag-summary/*
// @match        https://superuser.com/users/flag-summary/*
// @match        https://serverfault.com/users/flag-summary/*
// @match        https://mathoverflow.net/users/flag-summary/*
// @match        https://stackapps.com/users/flag-summary/*
// @match        https://*.stackexchange.com/users/flag-summary/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// ==/UserScript==

const msBetweenRequests = 2000;

const userIdRegex = /\/users\/flag-summary\/(\d+)/
const userId = window.location.pathname.match(userIdRegex)[1];
const firstPage = `${window.location.origin}/users/flag-summary/${userId}?group=1&page=1`;
const domain = window.location.origin;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve,ms));
}

async function getHtmlDoc(url) {
  await sleep(msBetweenRequests);
	const html = await (await fetch(url)).text();
	const parser = new DOMParser();
	return parser.parseFromString(html, "text/html");
}

async function userScriptGetFlagsMenu(event) {

  let doc = await getHtmlDoc(firstPage);
  const NUM_PAGES = parseInt([...doc.querySelectorAll(".s-pagination--item")].slice(-2,-1)[0].textContent)
  console.log(`Retrieving ${NUM_PAGES} total pages`)
  
  let flags = [];
  //for (let pageNum = 1; pageNum <= NUM_PAGES; pageNum++) {
  for (let pageNum = 1; pageNum <= 2; pageNum++) {
    sleep(msBetweenRequests);
    console.log(`Retrieving page ${pageNum}`);
    let url = `${domain}/users/flag-summary/${userId}?group=1&page=${pageNum}`;
    let doc = await getHtmlDoc(url);
    flags.push(
      ...(
        [...doc.querySelectorAll(".mod-flag")]
      ).map(flag => {
        let post = flag.parentElement;
        let postType;
        let postId;
        let postLink;

        if (post.querySelector('.answer-hyperlink')) {
          postType = "answer"
          postId = parseInt(post.querySelector(".answer-hyperlink").href.split("#")[1]);
          postLink = `${domain}/a/${postId}`
        } else if (post.querySelector('.question-hyperlink')) {
          postType = "question"
          postId = parseInt(post.querySelector('.question-hyperlink').href.split('/')[4]);
          postLink = `${domain}/q/${postId}`
        }

        let flagText = flag.querySelector('.revision-comment')?.textContent.trim();
        let flagHtml = flag.querySelector('.revision-comment')?.innerHTML.trim(); 
        let outcome = flag.querySelector('.flag-outcome')?.textContent || flag.querySelector('.mod-flag-indicator')?.textContent;
        let outcomeParts = outcome.trim().split(" - ");
        let status = outcomeParts[0].trim();
        let modMessage = outcomeParts.slice(1).join(" - ");

        let postTitle = (post.querySelector(".answer-hyperlink")||post.querySelector(".question-hyperlink"))?.textContent.trim();
        let flagCreatedTime = flag.querySelector(".relativetime").getAttribute('title');

        return {
          postId: postId,
          postLink: postLink,
          postTitle: postTitle,
          postType: postType,
          flagText: flagText,
          flagHtml: flagHtml,
          flagCreatedTime: flagCreatedTime,
          flagStatus: status,
          modMessage: modMessage,
        }
      })
    )
  }

  let jFlags = JSON.stringify(flags, null, " ");
  GM_setClipboard(jFlags, "text", () => console.log("Flags have been placed on the clipboard as JSON."))
  
}

(function() {
  'use strict';

  const menu_command_id_1 = GM_registerMenuCommand("Get Post Flags", userScriptGetFlagsMenu);
})();