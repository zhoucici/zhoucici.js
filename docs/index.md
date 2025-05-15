---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "zhoucici"
  tagline: 记录一些项目、学习笔记、心得体会
  actions:
    - theme: brand
      text: 开始阅读
      link: /docs/guide/
features:
  - title: 项目杂记
    details: 记录一些项目中发生的一些事情，以及解决的一些问题
  - title: JavaScript
    details: 记录一些JavaScript相关的知识，包括基础语法、数据结构、算法、框架等
---

<div class="contact">
  <img src="/code.jpg" @click="open" alt="avatar">
</div>

<script setup>
  const open = () => {
    console.log('open');
    //打开这个图片
    window.open('/code.jpg');
  }
  </script>
<style>
  .contact{
    margin-top: 50px;
    position: fixed;
    bottom: 30px;
    left: calc(50% + 200px);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    
  }
  .contact img{
    width:50px;
    height: 50px;
    cursor: pointer;
  }
</style>