// ==UserScript==
// @name         Tinder 自动点赞 // 
// @namespace    http://tampermonkey.net/
// @grant        none
// @version      1.0
// @description  Tinder 自动点赞 - 在 1 到 4 秒的随机间隔内，80% 点赞 20% 不点赞
// @author       
// @match        https://tinder.com/*
// @发行人       Gmlin
// @联系TG       Gmlin
// ==/UserScript==

(function () {
  "use strict";

  var liking = false;
  var likingInterval;

  // 生成随机延迟的函数（1-4秒）
  function getRandomDelay() {
    return Math.floor(Math.random() * 4000) + 1000; // 1-4 秒（以毫秒为单位）
  }

  // 随机决定喜欢或不喜欢的功能（80％的机会喜欢，20％的机会不喜欢）
  function likeOrDislike() {
    var buttons = document.querySelectorAll("button");
    var likeButton, dislikeButton;

    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      if (button.type === "button") {
        if (button.className.includes("Bgi($g-ds-background-like):a")) {
          likeButton = button;
        } else if (button.className.includes("Bgi($g-ds-background-nope):a")) {
          dislikeButton = button;
        }
      }
    }

    if (Math.random() < 0.8) {
      // 80% 的机会喜欢
      likeButton.click();
      console.log("like " + getRandomDelay() + "ms");
    } else {
      // 20% 的机会不喜欢
      dislikeButton.click();
      console.log("dislike " + getRandomDelay() + "ms");
    }
  }

  // 控制自动点赞过程的功能
  function controlLiking() {
    if (liking) {
      // 如果已经喜欢，就停下来
      clearInterval(likingInterval);
      liking = false;
      this.textContent = "♥自动匹配";
    } else {
      // 启动流程
      likingInterval = setInterval(likeOrDislike, getRandomDelay());
      liking = true;
      this.textContent = "♥运行中";
    }
  }

  var controlButton = document.createElement("button");
  controlButton.textContent = "♥中情局";
  controlButton.style.position = "fixed";
  controlButton.style.top = "30px";
  controlButton.style.right = "6px";
  controlButton.style.zIndex = "9999";
  controlButton.style.background = "#FD3A73";
  controlButton.style.borderRadius = "5px";
  controlButton.style.fontWeight = "700";
  controlButton.style.color = "white";
  controlButton.style.padding = "5px 6px";
  controlButton.style.cursor = "pointer";

  // 添加悬停状态
  controlButton.style.transition = "background-color 0.3s";
  controlButton.addEventListener("mouseover", function () {
    controlButton.style.backgroundColor = darkenColor("#FD3A73", 0.1); // 在这里调整暗度
  });
  controlButton.addEventListener("mouseout", function () {
    controlButton.style.backgroundColor = "#FD3A73";
  });

  controlButton.addEventListener("click", controlLiking);

  // 辅助函数使颜色变暗
  function darkenColor(color, amount) {
    // Convert the color to RGB
    var rgb = parseInt(color.slice(1), 16);
    var r = (rgb >> 16) & 0xff;
    var g = (rgb >> 8) & 0xff;
    var b = rgb & 0xff;

    // 将 RGB 值转换回十六进制
    r = Math.round(r * (1 - amount));
    g = Math.round(g * (1 - amount));
    b = Math.round(b * (1 - amount));

    // 将 RGB 值转换回十六进制
    var darkenedColor =
      "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
    return darkenedColor;
  }

  // 将按钮附加到文档或容器元素
  document.body.appendChild(controlButton);
})();