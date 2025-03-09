<template>
    <div class="scroll-downs">
      <div class="mousey">
        <div class="scroller"></div>
      </div>
      <p class="text-neutral-white text-center">Scroll</p>
    </div>
  </template>
  
  <style scoped>
  .scroll-downs {
    width: auto;
    height: 55px;
  }
  .mousey {
    width: 3px;
    padding: 10px 15px;
    margin: auto;
    height: 100%;
    border: 2px solid #fff;
    border-radius: 25px;
    opacity: 0.75;
  
  }
  .scroller {
    width: 3px;
    height: 10px;
    border-radius: 25%;
    background-color: #fff;
    position: relative;
    left: -1.5px;
    animation-name: scroll;
    animation-duration: 2.2s;
    animation-timing-function: cubic-bezier(.15,.41,.69,.94);
    animation-iteration-count: infinite;
  }
  @keyframes scroll {
    0% { opacity: 0; }
    10% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(15px); opacity: 0;}
  }
  </style>