document.addEventListener("DOMContentLoaded", () => {
  // DOM 元素
  const inputSection = document.getElementById("input-section");
  const loadingSection = document.getElementById("loading-section");
  const playerSection = document.getElementById("player-section");
  const promptInput = document.getElementById("prompt-input");
  const generateBtn = document.getElementById("generate-btn");
  const restartBtn = document.getElementById("restart-btn");

  const statusTitle = document.getElementById("status-title");
  const statusDetail = document.getElementById("status-detail");
  const progressFill = document.getElementById("progress-fill");
  const logContainer = document.getElementById("log-container");

  const videoStage = document.getElementById("video-stage");
  const videoCaption = document.getElementById("video-caption");
  const playbackBar = document.getElementById("playback-bar");

  let currentScenes = [];
  let currentSceneIndex = 0;
  let playbackInterval = null;

  // 预设生成阶段
  const phases = [
    {
      title: "正在提取关键词...",
      detail: "分析文本语义中...",
      progress: 10,
      log: "语义引擎已启动...",
    },
    {
      title: "正在编写剧本...",
      detail: "构建 4 个核心分镜...",
      progress: 25,
      log: "剧本初步完成：深夜、赛博朋克、奔跑...",
    },
    {
      title: "正在绘制分镜...",
      detail: "场景 1: 全景俯瞰",
      progress: 40,
      log: "扩散模型 (Diffusion) 正在绘制场景 1...",
    },
    {
      title: "正在绘制分镜...",
      detail: "场景 2: 细节特写",
      progress: 55,
      log: "渲染光影追踪效果...",
    },
    {
      title: "正在绘制分镜...",
      detail: "场景 3: 动作捕捉",
      progress: 70,
      log: "动态帧插值计算中...",
    },
    {
      title: "正在合成视频...",
      detail: "添加全局特效与调色",
      progress: 85,
      log: "合成器正在进行 4K 降噪渲染...",
    },
    {
      title: "正在同步音频...",
      detail: "生成环境音效与背景音乐",
      progress: 95,
      log: "音频流对齐完成。",
    },
    {
      title: "生成完成！",
      detail: "准备播放...",
      progress: 100,
      log: "本地预览准备就绪。",
    },
  ];

  // 事件监听
  generateBtn.addEventListener("click", startGeneration);
  restartBtn.addEventListener("click", () => {
    playerSection.classList.remove("active");
    inputSection.classList.add("active");
    promptInput.value = "";
  });

  async function startGeneration() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert("请输入一点描述，让我有灵感！");
      return;
    }

    // 切换到加载界面
    inputSection.classList.remove("active");
    loadingSection.classList.add("active");
    logContainer.innerHTML = "";

    // 模拟生成过程
    for (const phase of phases) {
      statusTitle.textContent = phase.title;
      statusDetail.textContent = phase.detail;
      progressFill.style.width = `${phase.progress}%`;

      const logEntry = document.createElement("div");
      logEntry.textContent = `> ${phase.log}`;
      logContainer.prepend(logEntry);

      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 700)
      );
    }

    // 生成完成后，模拟视频分镜数据
    prepareVideoContent(prompt);

    // 切换到播放器
    loadingSection.classList.remove("active");
    playerSection.classList.add("active");

    startPlayback();
  }

    function prepareVideoContent(prompt) {
        // 由于生成配额限制，我们循环使用已生成的 2 张高质量场景图
        currentScenes = [
            { img: 'scene_1.jpg', text: '在一座永不熄灭的数字城市中...' },
            { img: 'scene_2.jpg', text: '霓虹灯的光影在积水中破碎。' },
            { img: 'scene_1.jpg', text: '它穿梭在钢铁的缝隙间。' },
            { img: 'scene_2.jpg', text: '这不仅是生存，更是一场追寻。' }
        ];
        currentSceneIndex = 0;
    }

  function startPlayback() {
    if (playbackInterval) clearInterval(playbackInterval);

    const sceneDuration = 3000; // 每个场景 3 秒
    const totalDuration = currentScenes.length * sceneDuration;
    let startTime = Date.now();

    const updateFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % totalDuration) / totalDuration;
      playbackBar.style.width = `${progress * 100}%`;

      const currentIdx = Math.floor((elapsed % totalDuration) / sceneDuration);
      if (currentIdx !== currentSceneIndex) {
        currentSceneIndex = currentIdx;
        updateScene();
      }

      requestAnimationFrame(updateFrame);
    };

    updateScene();
    requestAnimationFrame(updateFrame);
  }

  function updateScene() {
    const scene = currentScenes[currentSceneIndex];
    videoStage.style.backgroundImage = `url('${scene.img}')`;
    videoCaption.textContent = scene.text;
  }
});
