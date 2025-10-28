;(function () {
  window.sqlbot_assistant_handler = window.sqlbot_assistant_handler || {}
  const defaultData = {
    id: '1',
    show_guide: false,
    float_icon: '',
    domain_url: 'http://localhost:5173',
    header_font_color: 'rgb(100, 106, 115)',
    x_type: 'right',
    y_type: 'bottom',
    x_val: '30',
    y_val: '30',
    float_icon_drag: false,
  }
  const script_id_prefix = 'sqlbot-assistant-float-script-'
  const guideHtml = `
<div class="sqlbot-assistant-mask">
  <div class="sqlbot-assistant-content"></div>
</div>
<div class="sqlbot-assistant-tips">
  <div class="sqlbot-assistant-close">
    <svg style="vertical-align: middle;overflow: hidden;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.95317 8.73169L15.5511 3.13376C15.7138 2.97104 15.9776 2.97104 16.1403 3.13376L16.7296 3.72301C16.8923 3.88573 16.8923 4.14955 16.7296 4.31227L11.1317 9.9102L16.7296 15.5081C16.8923 15.6708 16.8923 15.9347 16.7296 16.0974L16.1403 16.6866C15.9776 16.8494 15.7138 16.8494 15.5511 16.6866L9.95317 11.0887L4.35524 16.6866C4.19252 16.8494 3.9287 16.8494 3.76598 16.6866L3.17673 16.0974C3.01401 15.9347 3.01401 15.6708 3.17673 15.5081L8.77465 9.9102L3.17673 4.31227C3.01401 4.14955 3.01401 3.88573 3.17673 3.72301L3.76598 3.13376C3.9287 2.97104 4.19252 2.97104 4.35524 3.13376L9.95317 8.73169Z" fill="#ffffff"></path>
    </svg>
  </div>

  <div class="sqlbot-assistant-title"> 🌟 遇见问题，不再有障碍！</div>
  <p>你好，我是你的智能小助手。<br/>
      点我，开启高效解答模式，让问题变成过去式。</p>
  <div class="sqlbot-assistant-button">
      <button>我知道了</button>
  </div>
  <span class="sqlbot-assistant-arrow" ></span>
</div>
`

  const chatButtonHtml = (data) => `
<div class="sqlbot-assistant-chat-button">
  <img style="height:30px;width:30px;display:none;" src="${data.float_icon}">
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_1170_85)">
    <circle cx="15" cy="15" r="14.0625" fill="url(#paint0_linear_1170_85)" />
    <g filter="url(#filter0_di_1170_85)">
      <path
        d="M15.3018 3.38672C16.3145 3.38693 17.1357 4.20794 17.1357 5.2207C17.1357 5.89817 16.767 6.48806 16.2207 6.80566V7.79688C16.995 7.99096 17.6033 8.39036 17.8838 8.8877H18.6621C21.3958 8.88787 23.7464 10.5208 24.7979 12.8633C25.8021 12.876 26.6133 13.897 26.6133 15.1553C26.6132 16.2648 25.9821 17.1895 25.1445 17.4014C24.5797 19.4521 23.0686 21.1096 21.1094 21.876L21.1084 21.8799L12.8545 25.0898V22.3379H11.6309C8.53539 22.3378 5.9299 20.2463 5.14746 17.3994C4.31412 17.1834 3.68759 16.261 3.6875 15.1553C3.6875 13.9006 4.49392 12.8817 5.49414 12.8633C6.5455 10.5206 8.89694 8.88779 11.6309 8.8877H12.417C12.7337 8.32641 13.4683 7.89108 14.3867 7.7334V6.80859C13.8377 6.49167 13.4678 5.90015 13.4678 5.2207C13.4678 4.20781 14.2889 3.38672 15.3018 3.38672Z"
        fill="white" />
    </g>
    <g filter="url(#filter1_i_1170_85)">
      <rect x="8.89062" y="11.9453" width="12.5329" height="7.33634" rx="3.66817" fill="url(#paint1_linear_1170_85)" />
    </g>
    <rect x="12.8633" y="14.082" width="1.22272" height="3.05681" rx="0.611362" fill="white" />
    <path d="M17.4483 14.6953L16.5312 15.6124L17.4483 16.5294" stroke="white" stroke-width="1.2" stroke-linecap="round"
      stroke-linejoin="round" />
  </g>
  <defs>
    <filter id="filter0_di_1170_85" x="2.1875" y="3.08672" width="25.9258" height="24.7031" filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        result="hardAlpha" />
      <feOffset dy="1.2" />
      <feGaussianBlur stdDeviation="0.75" />
      <feComposite in2="hardAlpha" operator="out" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.133333 0 0 0 0 0.572549 0 0 0 0 0.996078 0 0 0 0.26 0" />
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1170_85" />
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1170_85" result="shape" />
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        result="hardAlpha" />
      <feOffset dy="0.3" />
      <feGaussianBlur stdDeviation="0.6" />
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.151799 0 0 0 0 0.70313 0 0 0 0 1 0 0 0 1 0" />
      <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1170_85" />
    </filter>
    <filter id="filter1_i_1170_85" x="8.89062" y="11.9453" width="12.5312" height="8.53594" filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        result="hardAlpha" />
      <feOffset dy="1.2" />
      <feGaussianBlur stdDeviation="0.6" />
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.0741525 0 0 0 0 0.455172 0 0 0 0 0.9886 0 0 0 1 0" />
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1170_85" />
    </filter>
    <linearGradient id="paint0_linear_1170_85" x1="15.2591" y1="-0.285326" x2="15.2591" y2="29.5211"
      gradientUnits="userSpaceOnUse">
      <stop stop-color="#1F64FF" />
      <stop offset="1" stop-color="#29EEFC" />
    </linearGradient>
    <linearGradient id="paint1_linear_1170_85" x1="15.2725" y1="11.6263" x2="15.2725" y2="19.4013"
      gradientUnits="userSpaceOnUse">
      <stop stop-color="#1F64FF" />
      <stop offset="1" stop-color="#29EEFC" />
    </linearGradient>
    <clipPath id="clip0_1170_85">
      <rect width="30" height="30" fill="white" />
    </clipPath>
  </defs>
</svg>
</div>`

  const getChatContainerHtml = (data) => {
    let srcUrl = `${data.domain_url}/#/assistant?id=${data.id}&online=${!!data.online}&name=${encodeURIComponent(data.name)}`
    if (data.userFlag) {
      srcUrl += `&userFlag=${data.userFlag || ''}`
    }
    if (data.history) {
      srcUrl += `&history=${data.history}`
    }
    return `
<div id="sqlbot-assistant-chat-container">
  <iframe id="sqlbot-assistant-chat-iframe-${data.id}" allow="microphone;clipboard-read 'src'; clipboard-write 'src'" src="${srcUrl}"></iframe>
  <div class="sqlbot-assistant-operate">
  <div class="sqlbot-assistant-closeviewport sqlbot-assistant-viewportnone">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7.507 11.6645C7.73712 11.6645 7.94545 11.7578 8.09625 11.9086C8.24706 12.0594 8.34033 12.2677 8.34033 12.4978V16.7976C8.34033 17.0277 8.15378 17.2143 7.92366 17.2143H7.09033C6.86021 17.2143 6.67366 17.0277 6.67366 16.7976V14.5812L3.41075 17.843C3.24803 18.0057 2.98421 18.0057 2.82149 17.843L2.23224 17.2537C2.06952 17.091 2.06952 16.8272 2.23224 16.6645L5.56668 13.3311H3.19634C2.96622 13.3311 2.77967 13.1446 2.77967 12.9145V12.0811C2.77967 11.851 2.96622 11.6645 3.19634 11.6645H7.507ZM16.5991 2.1572C16.7619 1.99448 17.0257 1.99448 17.1884 2.1572L17.7777 2.74645C17.9404 2.90917 17.9404 3.17299 17.7777 3.33571L14.4432 6.66904H16.8136C17.0437 6.66904 17.2302 6.85559 17.2302 7.08571V7.91904C17.2302 8.14916 17.0437 8.33571 16.8136 8.33571H12.5029C12.2728 8.33571 12.0644 8.24243 11.9136 8.09163C11.7628 7.94082 11.6696 7.73249 11.6696 7.50237V3.20257C11.6696 2.97245 11.8561 2.7859 12.0862 2.7859H12.9196C13.1497 2.7859 13.3362 2.97245 13.3362 3.20257V5.419L16.5991 2.1572Z" fill="${data.header_font_color}"/>
    </svg>
  </div>
  <div class="sqlbot-assistant-openviewport">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M7.15209 11.5968C7.31481 11.4341 7.57862 11.4341 7.74134 11.5968L8.3306 12.186C8.49332 12.3487 8.49332 12.6126 8.3306 12.7753L4.99615 16.1086H7.3665C7.59662 16.1086 7.78316 16.2952 7.78316 16.5253V17.3586C7.78316 17.5887 7.59662 17.7753 7.3665 17.7753H3.05584C2.82572 17.7753 2.61738 17.682 2.46658 17.5312C2.31578 17.3804 2.2225 17.1721 2.2225 16.9419V12.6421C2.2225 12.412 2.40905 12.2255 2.63917 12.2255H3.4725C3.70262 12.2255 3.88917 12.412 3.88917 12.6421V14.8586L7.15209 11.5968ZM16.937 2.22217C17.1671 2.22217 17.3754 2.31544 17.5262 2.46625C17.677 2.61705 17.7703 2.82538 17.7703 3.0555V7.35531C17.7703 7.58543 17.5837 7.77198 17.3536 7.77198H16.5203C16.2902 7.77198 16.1036 7.58543 16.1036 7.35531V5.13888L12.8407 8.40068C12.678 8.5634 12.4142 8.5634 12.2515 8.40068L11.6622 7.81142C11.4995 7.64871 11.4995 7.38489 11.6622 7.22217L14.9966 3.88883H12.6263C12.3962 3.88883 12.2096 3.70229 12.2096 3.47217V2.63883C12.2096 2.40872 12.3962 2.22217 12.6263 2.22217H16.937Z" fill="${data.header_font_color}"/>
    </svg>
  </div>
  <div class="sqlbot-assistant-chat-close">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.95317 8.73169L15.5511 3.13376C15.7138 2.97104 15.9776 2.97104 16.1403 3.13376L16.7296 3.72301C16.8923 3.88573 16.8923 4.14955 16.7296 4.31227L11.1317 9.9102L16.7296 15.5081C16.8923 15.6708 16.8923 15.9347 16.7296 16.0974L16.1403 16.6866C15.9776 16.8494 15.7138 16.8494 15.5511 16.6866L9.95317 11.0887L4.35524 16.6866C4.19252 16.8494 3.9287 16.8494 3.76598 16.6866L3.17673 16.0974C3.01401 15.9347 3.01401 15.6708 3.17673 15.5081L8.77465 9.9102L3.17673 4.31227C3.01401 4.14955 3.01401 3.88573 3.17673 3.72301L3.76598 3.13376C3.9287 2.97104 4.19252 2.97104 4.35524 3.13376L9.95317 8.73169Z" fill="${data.header_font_color}"/>
    </svg>
  </div>
</div>
`
  }

  function getHighestZIndexValue() {
    try {
      let maxZIndex = -Infinity
      let foundAny = false

      const allElements = document.all || document.querySelectorAll('*')

      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i]

        if (!element || element.nodeType !== 1) continue

        const styles = window.getComputedStyle(element)

        const position = styles.position
        if (position === 'static') continue

        const zIndex = styles.zIndex
        let zIndexValue

        if (zIndex === 'auto') {
          zIndexValue = 0
        } else {
          zIndexValue = parseInt(zIndex, 10)
          if (isNaN(zIndexValue)) continue
        }

        foundAny = true

        // 快速返回：如果找到很大的z-index，很可能就是最大值
        /* if (zIndexValue > 10000) {
          return zIndexValue;
        } */

        if (zIndexValue > maxZIndex) {
          maxZIndex = zIndexValue
        }
      }
      return foundAny ? maxZIndex : 0
    } catch (error) {
      console.warn('获取最高z-index时出错，返回默认值0:', error)
      return 0
    }
  }

  /**
   * 初始化引导
   * @param {*} root
   */
  const initGuide = (root) => {
    root.insertAdjacentHTML('beforeend', guideHtml)
    const button = root.querySelector('.sqlbot-assistant-button')
    const close_icon = root.querySelector('.sqlbot-assistant-close')
    const close_func = () => {
      root.removeChild(root.querySelector('.sqlbot-assistant-tips'))
      root.removeChild(root.querySelector('.sqlbot-assistant-mask'))
      localStorage.setItem('sqlbot_assistant_mask_tip', true)
    }
    button.onclick = close_func
    close_icon.onclick = close_func
  }
  const initChat = (root, data) => {
    // 添加对话icon
    root.insertAdjacentHTML('beforeend', chatButtonHtml(data))
    // 添加对话框
    root.insertAdjacentHTML('beforeend', getChatContainerHtml(data))
    // 按钮元素
    const chat_button = root.querySelector('.sqlbot-assistant-chat-button')
    let chat_button_img = root.querySelector('.sqlbot-assistant-chat-button > svg')
    if (data.float_icon) {
      chat_button_img = root.querySelector('.sqlbot-assistant-chat-button > img')
    }
    chat_button_img.style.display = 'block'
    //  对话框元素
    const chat_container = root.querySelector('#sqlbot-assistant-chat-container')
    // 引导层
    const mask_content = root.querySelector('.sqlbot-assistant-mask > .sqlbot-assistant-content')
    const mask_tips = root.querySelector('.sqlbot-assistant-tips')
    chat_button_img.onload = (event) => {
      if (mask_content) {
        mask_content.style.width = chat_button_img.width + 'px'
        mask_content.style.height = chat_button_img.height + 'px'
        if (data.x_type == 'left') {
          mask_tips.style.marginLeft =
            (chat_button_img.naturalWidth > 500 ? 500 : chat_button_img.naturalWidth) - 64 + 'px'
        } else {
          mask_tips.style.marginRight =
            (chat_button_img.naturalWidth > 500 ? 500 : chat_button_img.naturalWidth) - 64 + 'px'
        }
      }
    }

    const viewport = root.querySelector('.sqlbot-assistant-openviewport')
    const closeviewport = root.querySelector('.sqlbot-assistant-closeviewport')
    const close_func = () => {
      chat_container.style['display'] =
        chat_container.style['display'] == 'block' ? 'none' : 'block'
      chat_button.style['display'] = chat_container.style['display'] == 'block' ? 'none' : 'block'
    }
    close_icon = chat_container.querySelector('.sqlbot-assistant-chat-close')
    chat_button.onclick = close_func
    close_icon.onclick = close_func
    const viewport_func = () => {
      if (chat_container.classList.contains('sqlbot-assistant-enlarge')) {
        chat_container.classList.remove('sqlbot-assistant-enlarge')
        viewport.classList.remove('sqlbot-assistant-viewportnone')
        closeviewport.classList.add('sqlbot-assistant-viewportnone')
      } else {
        chat_container.classList.add('sqlbot-assistant-enlarge')
        viewport.classList.add('sqlbot-assistant-viewportnone')
        closeviewport.classList.remove('sqlbot-assistant-viewportnone')
      }
    }
    if (data.float_icon_drag) {
      chat_button.setAttribute('draggable', 'true')

      let startX = 0
      let startY = 0
      const img = new Image()
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
      chat_button.addEventListener('dragstart', (e) => {
        startX = e.clientX - chat_button.offsetLeft
        startY = e.clientY - chat_button.offsetTop
        e.dataTransfer.setDragImage(img, 0, 0)
      })

      chat_button.addEventListener('drag', (e) => {
        if (e.clientX && e.clientY) {
          const left = e.clientX - startX
          const top = e.clientY - startY

          const maxX = window.innerWidth - chat_button.offsetWidth
          const maxY = window.innerHeight - chat_button.offsetHeight

          chat_button.style.left = Math.min(Math.max(0, left), maxX) + 'px'
          chat_button.style.top = Math.min(Math.max(0, top), maxY) + 'px'
        }
      })

      let touchStartX = 0
      let touchStartY = 0

      chat_button.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX - chat_button.offsetLeft
        touchStartY = e.touches[0].clientY - chat_button.offsetTop
        e.preventDefault()
      })

      chat_button.addEventListener('touchmove', (e) => {
        const left = e.touches[0].clientX - touchStartX
        const top = e.touches[0].clientY - touchStartY

        const maxX = window.innerWidth - chat_button.offsetWidth
        const maxY = window.innerHeight - chat_button.offsetHeight

        chat_button.style.left = Math.min(Math.max(0, left), maxX) + 'px'
        chat_button.style.top = Math.min(Math.max(0, top), maxY) + 'px'

        e.preventDefault()
      })
    }
    /*  const drag = (e) => {
      if (['touchmove', 'touchstart'].includes(e.type)) {
        chat_button.style.top = e.touches[0].clientY - chat_button_img.clientHeight / 2 + 'px'
        chat_button.style.left = e.touches[0].clientX - chat_button_img.clientHeight / 2 + 'px'
      } else {
        chat_button.style.top = e.y - chat_button_img.clientHeight / 2 + 'px'
        chat_button.style.left = e.x - chat_button_img.clientHeight / 2 + 'px'
      }
      chat_button.style.width = chat_button_img.clientHeight + 'px'
      chat_button.style.height = chat_button_img.clientHeight + 'px'
    }
    if (data.float_icon_drag) {
      chat_button.setAttribute('draggable', 'true')
      chat_button.addEventListener('drag', drag)
      chat_button.addEventListener('dragover', (e) => {
        e.preventDefault()
      })
      chat_button.addEventListener('dragend', drag)
      chat_button.addEventListener('touchstart', drag)
      chat_button.addEventListener('touchmove', drag)
    } */
    viewport.onclick = viewport_func
    closeviewport.onclick = viewport_func
  }
  /**
   * 第一次进来的引导提示
   */
  function initsqlbot_assistant(data) {
    const sqlbot_div = document.createElement('div')
    const root = document.createElement('div')
    const sqlbot_root_id = 'sqlbot-assistant-root-' + data.id
    root.id = sqlbot_root_id
    initsqlbot_assistantStyle(sqlbot_div, sqlbot_root_id, data)
    sqlbot_div.appendChild(root)
    document.body.appendChild(sqlbot_div)
    const sqlbot_assistant_mask_tip = localStorage.getItem('sqlbot_assistant_mask_tip')
    if (sqlbot_assistant_mask_tip == null && data.show_guide) {
      initGuide(root)
    }
    initChat(root, data)
  }

  // 初始化全局样式
  function initsqlbot_assistantStyle(root, sqlbot_assistantId, data) {
    const maxZIndex = getHighestZIndexValue()
    const zIndex = Math.max((maxZIndex || 0) + 1, 10000)
    const maskZIndex = zIndex + 1
    style = document.createElement('style')
    style.type = 'text/css'
    style.innerText = `
  /* 放大 */
  #sqlbot-assistant .sqlbot-assistant-enlarge {
      width: 50%!important;
      height: 100%!important;
      bottom: 0!important;
      right: 0 !important;
  }
  @media only screen and (max-width: 768px){
  #sqlbot-assistant .sqlbot-assistant-enlarge {
      width: 100%!important;
      height: 100%!important;
      right: 0 !important;
      bottom: 0!important;
  }
  }

  /* 引导 */

  #sqlbot-assistant .sqlbot-assistant-mask {
      position: fixed;
      z-index: ${maskZIndex};
      background-color: transparent;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
  }
  #sqlbot-assistant .sqlbot-assistant-mask .sqlbot-assistant-content {
      width: 64px;
      height: 64px;
      box-shadow: 1px 1px 1px 9999px rgba(0,0,0,.6);
      position: absolute;
      ${data.x_type}: ${data.x_val}px;
      ${data.y_type}: ${data.y_val}px;
      z-index: ${maskZIndex};
  }
  #sqlbot-assistant .sqlbot-assistant-tips {
      position: fixed;
      ${data.x_type}:calc(${data.x_val}px + 75px);
      ${data.y_type}: calc(${data.y_val}px + 0px);
      padding: 22px 24px 24px;
      border-radius: 6px;
      color: #ffffff;
      font-size: 14px;
      background: #3370FF;
      z-index: ${maskZIndex};
  }
  #sqlbot-assistant .sqlbot-assistant-tips .sqlbot-assistant-arrow {
      position: absolute;
      background: #3370FF;
      width: 10px;
      height: 10px;
      pointer-events: none;
      transform: rotate(45deg);
      box-sizing: border-box;
      /* left  */
      ${data.x_type}: -5px;
      ${data.y_type}: 33px;
      border-left-color: transparent;
      border-bottom-color: transparent
  }
  #sqlbot-assistant .sqlbot-assistant-tips .sqlbot-assistant-title {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 8px;
  }
  #sqlbot-assistant .sqlbot-assistant-tips .sqlbot-assistant-button {
      text-align: right;
      margin-top: 24px;
  }
  #sqlbot-assistant .sqlbot-assistant-tips .sqlbot-assistant-button button {
      border-radius: 4px;
      background: #FFF;
      padding: 3px 12px;
      color: #3370FF;
      cursor: pointer;
      outline: none;
      border: none;
  }
  #sqlbot-assistant .sqlbot-assistant-tips .sqlbot-assistant-button button::after{
      border: none;
    }
  #sqlbot-assistant .sqlbot-assistant-tips .sqlbot-assistant-close {
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;

  }
  #sqlbot-assistant-chat-container {
        width: 460px;
        height: 640px;
        display:none;
      }
  @media only screen and (max-width: 768px) {
    #sqlbot-assistant-chat-container {
      width: 100%;
      height: 70%;
      right: 0 !important;
    }
  }

  #sqlbot-assistant .sqlbot-assistant-chat-button{
    position: fixed;
    ${data.x_type}: ${data.x_val}px;
    ${data.y_type}: ${data.y_val}px;
    cursor: pointer;
    z-index: ${zIndex};
  }
  #sqlbot-assistant #sqlbot-assistant-chat-container{
    z-index: ${zIndex};
    position: relative;
    border-radius: 8px;
    //border: 1px solid #ffffff;
    background: linear-gradient(188deg, rgba(235, 241, 255, 0.20) 39.6%, rgba(231, 249, 255, 0.20) 94.3%), #EFF0F1;
    box-shadow: 0px 4px 8px 0px rgba(31, 35, 41, 0.10);
    position: fixed;bottom: 16px;right: 16px;overflow: hidden;
  }

  .ed-overlay-dialog {
    margin-top: 50px;
  }
  .ed-drawer {
    margin-top: 50px;
  }

  #sqlbot-assistant #sqlbot-assistant-chat-container .sqlbot-assistant-operate{
    top: 18px;
    right: 15px;
    position: absolute;
    display: flex;
    align-items: center;
    line-height: 18px;
  }
  #sqlbot-assistant #sqlbot-assistant-chat-container .sqlbot-assistant-operate .sqlbot-assistant-chat-close{
    margin-left:15px;
    cursor: pointer;
  }
  #sqlbot-assistant #sqlbot-assistant-chat-container .sqlbot-assistant-operate .sqlbot-assistant-openviewport{

    cursor: pointer;
  }
  #sqlbot-assistant #sqlbot-assistant-chat-container .sqlbot-assistant-operate .sqlbot-assistant-closeviewport{

    cursor: pointer;
  }
  #sqlbot-assistant #sqlbot-assistant-chat-container .sqlbot-assistant-viewportnone{
    display:none;
  }
  #sqlbot-assistant #sqlbot-assistant-chat-container #sqlbot-assistant-chat-iframe-${data.id} {
    height:100%;
    width:100%;
    border: none;
  }
  #sqlbot-assistant #sqlbot-assistant-chat-container {
    animation: appear .4s ease-in-out;
  }
  @keyframes appear {
    from {
      height: 0;;
    }

    to {
      height: 600px;
    }
  }`.replaceAll('#sqlbot-assistant ', `#${sqlbot_assistantId} `)
    root.appendChild(style)
  }
  function getParam(src, key) {
    const url = new URL(src)
    return url.searchParams.get(key)
  }
  function parsrCertificate(config) {
    const certificateList = config.certificate
    if (!certificateList?.length) {
      return null
    }
    const list = certificateList.map((item) => formatCertificate(item)).filter((item) => !!item)
    return JSON.stringify(list)
  }
  function isEmpty(obj) {
    return obj == null || typeof obj == 'undefined'
  }
  function formatCertificate(item) {
    const { type, source, target, target_key, target_val } = item
    let source_val = null
    if (type.toLocaleLowerCase() == 'localstorage') {
      source_val = localStorage.getItem(source)
    }
    if (type.toLocaleLowerCase() == 'sessionstorage') {
      source_val = sessionStorage.getItem(source)
    }
    if (type.toLocaleLowerCase() == 'cookie') {
      source_val = getCookie(source)
    }
    if (type.toLocaleLowerCase() == 'custom') {
      source_val = source
    }
    if (isEmpty(source_val)) {
      return null
    }
    return {
      target,
      key: target_key || source,
      value: (target_val && eval(target_val)) || source_val,
    }
  }
  function getCookie(key) {
    if (!key || !document.cookie) {
      return null
    }
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()

      if (cookie.startsWith(key + '=')) {
        return decodeURIComponent(cookie.substring(key.length + 1))
      }
    }
    return null
  }
  function registerMessageEvent(id, data) {
    const iframe = document.getElementById(`sqlbot-assistant-chat-iframe-${id}`)
    const url = iframe.src
    const eventName = 'sqlbot_assistant_event'
    window.addEventListener('message', (event) => {
      if (event.data?.eventName === eventName) {
        if (event.data?.messageId !== id) {
          return
        }
        if (event.data?.busi == 'ready' && event.data?.ready) {
          const certificate = parsrCertificate(data)
          params = {
            busi: 'certificate',
            certificate,
            eventName,
            messageId: id,
          }
          const contentWindow = iframe.contentWindow
          contentWindow.postMessage(params, url)
        }
      }
    })
  }
  function loadScript(src, id) {
    const domain_url = getDomain(src)
    const online = getParam(src, 'online')
    const userFlag = getParam(src, 'userFlag')
    const history = getParam(src, 'history')
    let url = `${domain_url}/api/v1/system/assistant/info/${id}`
    if (domain_url.includes('5173')) {
      url = url.replace('5173', '8000')
    }
    fetch(url)
      .then((response) => response.json())
      .then((res) => {
        if (!res.data) {
          throw new Error(res)
        }
        const data = res.data
        const config_json = data.configuration
        let tempData = Object.assign(defaultData, data)
        if (tempData.configuration) {
          delete tempData.configuration
        }
        if (config_json) {
          const config = JSON.parse(config_json)
          if (config) {
            delete config.id
            tempData = Object.assign(tempData, config)
          }
        }
        tempData['id'] = id
        tempData['domain_url'] = domain_url

        if (tempData['float_icon'] && !tempData['float_icon'].startsWith('http://')) {
          tempData['float_icon'] =
            `${domain_url}/api/v1/system/assistant/picture/${tempData['float_icon']}`

          if (domain_url.includes('5173')) {
            tempData['float_icon'] = tempData['float_icon'].replace('5173', '8000')
          }
        }

        tempData['online'] = online && online.toString().toLowerCase() == 'true'
        tempData['userFlag'] = userFlag
        tempData['history'] = history
        initsqlbot_assistant(tempData)
        if (data.type == 1) {
          registerMessageEvent(id, tempData)
          // postMessage the certificate to iframe
        }
      })
      .catch((e) => {
        showMsg('嵌入失败', e.message)
      })
  }
  function getDomain(src) {
    return src.substring(0, src.indexOf('/assistant.js'))
  }
  function init() {
    const sqlbotScripts = document.querySelectorAll(`script[id^="${script_id_prefix}"]`)
    const scriptsArray = Array.from(sqlbotScripts)
    const src_list = scriptsArray.map((script) => script.src)
    src_list.forEach((src) => {
      const id = getParam(src, 'id')
      window.sqlbot_assistant_handler[id] = window.sqlbot_assistant_handler[id] || {}
      window.sqlbot_assistant_handler[id]['id'] = id
      const propName = script_id_prefix + id + '-state'
      if (window[propName]) {
        return true
      }
      window[propName] = true
      loadScript(src, id)
      expposeGlobalMethods(id)
    })
  }

  function showMsg(title, content) {
    // 检查并创建容器（如果不存在）
    let container = document.getElementById('messageContainer')
    if (!container) {
      container = document.createElement('div')
      container.id = 'messageContainer'
      container.style.position = 'fixed'
      container.style.bottom = '20px'
      container.style.right = '20px'
      container.style.zIndex = '1000'
      document.body.appendChild(container)
    } else {
      // 如果容器已存在，先移除旧弹窗
      const oldMessage = container.querySelector('div')
      if (oldMessage) {
        oldMessage.style.transform = 'translateX(120%)'
        oldMessage.style.opacity = '0'
        setTimeout(() => {
          container.removeChild(oldMessage)
        }, 300)
      }
    }

    // 创建弹窗元素
    const messageBox = document.createElement('div')
    messageBox.style.width = '240px'
    messageBox.style.minHeight = '100px'
    messageBox.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e8e)'
    messageBox.style.borderRadius = '8px'
    messageBox.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
    messageBox.style.padding = '15px'
    messageBox.style.color = 'white'
    messageBox.style.fontFamily = 'Arial, sans-serif'
    messageBox.style.display = 'flex'
    messageBox.style.flexDirection = 'column'
    messageBox.style.transform = 'translateX(120%)'
    messageBox.style.transition = 'transform 0.3s ease-out'
    messageBox.style.opacity = '0'
    messageBox.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
    messageBox.style.overflow = 'hidden'

    // 创建标题元素
    const titleElement = document.createElement('div')
    titleElement.style.fontSize = '18px'
    titleElement.style.fontWeight = 'bold'
    titleElement.style.marginBottom = '10px'
    titleElement.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)'
    titleElement.style.paddingBottom = '8px'
    titleElement.textContent = title

    // 创建内容元素
    const contentElement = document.createElement('div')
    contentElement.style.fontSize = '14px'
    contentElement.style.flexGrow = '1'
    contentElement.style.overflow = 'auto'
    contentElement.textContent = content

    // 组装元素
    messageBox.appendChild(titleElement)
    messageBox.appendChild(contentElement)

    // 添加到容器
    container.appendChild(messageBox)

    // 触发显示动画
    setTimeout(() => {
      messageBox.style.transform = 'translateX(0)'
      messageBox.style.opacity = '1'
    }, 10)

    // 3秒后自动隐藏
    setTimeout(() => {
      messageBox.style.transform = 'translateX(120%)'
      messageBox.style.opacity = '0'
      setTimeout(() => {
        container.removeChild(messageBox)
        // 如果容器是空的，也移除容器
        if (container.children.length === 0) {
          document.body.removeChild(container)
        }
      }, 300)
    }, 5000)
  }

  /* function hideMsg() {
    const container = document.getElementById('messageContainer');
    if (container) {
        const messageBox = container.querySelector('div');
        if (messageBox) {
            messageBox.style.transform = 'translateX(120%)';
            messageBox.style.opacity = '0';
            setTimeout(() => {
                container.removeChild(messageBox);
                // 如果容器是空的，也移除容器
                if (container.children.length === 0) {
                    document.body.removeChild(container);
                }
            }, 300);
        }
    }
  } */

  function updateParam(target_url, key, newValue) {
    try {
      const url = new URL(target_url)
      const [hashPath, hashQuery] = url.hash.split('?')
      let searchParams
      if (hashQuery) {
        searchParams = new URLSearchParams(hashQuery)
      } else {
        searchParams = url.searchParams
      }
      searchParams.set(key, newValue)
      if (hashQuery) {
        url.hash = `${hashPath}?${searchParams.toString()}`
      } else {
        url.search = searchParams.toString()
      }
      return url.toString()
    } catch (e) {
      console.error('Invalid URL:', target_url)
      return target_url
    }
  }
  function expposeGlobalMethods(id) {
    window.sqlbot_assistant_handler[id]['setOnline'] = (online) => {
      if (online != null && typeof online != 'boolean') {
        throw new Error('The parameter can only be of type boolean')
      }
      const iframe = document.getElementById(`sqlbot-assistant-chat-iframe-${id}`)
      if (iframe) {
        const url = iframe.src
        const eventName = 'sqlbot_assistant_event'
        const params = {
          busi: 'setOnline',
          online,
          eventName,
          messageId: id,
        }
        const contentWindow = iframe.contentWindow
        contentWindow.postMessage(params, url)
      }
    }
    window.sqlbot_assistant_handler[id]['refresh'] = (online, userFlag) => {
      if (online != null && typeof online != 'boolean') {
        throw new Error('The parameter can only be of type boolean')
      }
      const iframe = document.getElementById(`sqlbot-assistant-chat-iframe-${id}`)
      if (iframe) {
        const url = iframe.src
        let new_url = updateParam(url, 't', Date.now())
        if (online != null) {
          new_url = updateParam(new_url, 'online', online)
        }
        if (userFlag != null) {
          new_url = updateParam(new_url, 'userFlag', userFlag)
        }
        iframe.src = 'about:blank'
        setTimeout(() => {
          iframe.src = new_url
        }, 500)
      }
    }
    window.sqlbot_assistant_handler[id]['destroy'] = () => {
      const sqlbot_root_id = 'sqlbot-assistant-root-' + id
      const container_div = document.getElementById(sqlbot_root_id)
      if (container_div) {
        const root_div = container_div.parentNode
        if (root_div?.parentNode) {
          root_div.parentNode.removeChild(root_div)
        }
      }

      const scriptDom = document.getElementById(`sqlbot-assistant-float-script-${id}`)
      if (scriptDom) {
        scriptDom.parentNode.removeChild(scriptDom)
      }
      const propName = script_id_prefix + id + '-state'
      if (window[propName]) {
        delete window[propName]
      }
      delete window.sqlbot_assistant_handler[id]
    }
    window.sqlbot_assistant_handler[id]['setHistory'] = (show) => {
      if (show != null && typeof show != 'boolean') {
        throw new Error('The parameter can only be of type boolean')
      }
      const iframe = document.getElementById(`sqlbot-assistant-chat-iframe-${id}`)
      if (iframe) {
        const url = iframe.src
        const eventName = 'sqlbot_assistant_event'
        const params = {
          busi: 'setHistory',
          show,
          eventName,
          messageId: id,
        }
        const contentWindow = iframe.contentWindow
        contentWindow.postMessage(params, url)
      }
    }
    window.sqlbot_assistant_handler[id]['createConversation'] = (param) => {
      const iframe = document.getElementById(`sqlbot-assistant-chat-iframe-${id}`)
      if (iframe) {
        const url = iframe.src
        const eventName = 'sqlbot_assistant_event'
        const params = {
          busi: 'createConversation',
          param,
          eventName,
          messageId: id,
        }
        const contentWindow = iframe.contentWindow
        contentWindow.postMessage(params, url)
      }
    }
  }
  // window.addEventListener('load', init)
  const executeWhenReady = (fn) => {
    if (
      document.readyState === 'complete' ||
      (document.readyState !== 'loading' && !document.documentElement.doScroll)
    ) {
      setTimeout(fn, 0)
    } else {
      const onReady = () => {
        document.removeEventListener('DOMContentLoaded', onReady)
        window.removeEventListener('load', onReady)
        fn()
      }
      document.addEventListener('DOMContentLoaded', onReady)
      window.addEventListener('load', onReady)
    }
  }

  executeWhenReady(init)
})()
