<template>
  <footer
    class="footer flex flex-wrap justify-between items-center sm:footer-horizontal bg-neutral text-neutral-content px-[25px] md:pt-10 md:pb-5 md:px-[10%]"
  >
    <NuxtImg src="blog-favion.webp" class="rounded-full W-[80px] h-[80px]" />
    <nav class="ml-[10px] mr-auto">
      <h6 class="footer-title">Follow Me</h6>
      <div class="grid grid-flow-col gap-4">
        <a
          href="https://www.linkedin.com/in/思惇-rafael-huang-黃-1074a7199"
          target="”_blank”"
        >
          <Icon name="mingcute:linkedin-line" size="36" />
        </a>
        <a
          href="https://github.com/yhosutun2490"
          target="”_blank”"
        >
          <Icon name="mingcute:github-fill" size="36" />
        </a>
        <a
          href="https://www.facebook.com/nick.haung"
          target="”_blank”"
        >
          <Icon name="mingcute:facebook-fill" size="36" />
        </a>
      </div>
    </nav>
    <div class="contact-me">
      <h6 class="footer-title">Contact Me</h6>
      <p class="email-link">
        <a href="mailto:yhosutun2491@gmail.com"> yhosutun2491@gmail.com </a>
      </p>
    </div>
    <aside class="w-[100%] flex">
      <p class="mx-auto">Copyright © 2025 - All right reserved by Rafael</p>
    </aside>
  </footer>
</template>
