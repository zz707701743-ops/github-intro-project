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

  // 高清在线素材预设 (Unsplash Cyberpunk 风格)
  const assetPool = [
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545156521-77bd85671d30?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000&auto=format&fit=crop"
  ];

  // 预设生成阶段
  const phases = [
    { title: "正在提取关键词...", detail: "分析文本语义中...", progress: 10, log: "语义引擎已启动..." },
    { title: "正在编写剧本...", detail: "构建 4 个核心分镜...", progress: 25, log: "剧本初步完成：基于 AI 深度学习创作..." },
    { title: "正在绘制分镜...", detail: "场景 1: 画质增强中", progress: 40, log: "扩散模型 (Diffusion) 正在绘制场景 1..." },
    { title: "正在绘制分镜...", detail: "场景 2: 光影追踪渲染", progress: 55, log: "渲染引擎进行 HDR 调色..." },
    { title: "正在绘制分镜...", detail: "场景 3: 动态流体计算", progress: 70, log: "AI 运动补偿技术应用中..." },
    { title: "正在合成视频...", detail: "添加全局特效与配乐", progress: 85, log: "合成器正在进行 4K 质量输出..." },
    { title: "生成完成！", detail: "准备播放...", progress: 100, log: "本地预览已全部就绪。" }
  ];

  // 事件监听
  generateBtn.addEventListener("click", startGeneration);
  restartBtn.addEventListener("click", () => {
    playerSection.classList.remove("active");
    inputSection.classList.add("active");
    promptInput.value = "";
    if (playbackInterval) clearInterval(playbackInterval);
  });

  // 新增：模拟“解锁导出”按钮点击
  const exportBtn = document.querySelector('.action:last-child');
  if (exportBtn) {
    exportBtn.style.cursor = 'pointer';
    exportBtn.addEventListener('click', () => {
      exportBtn.innerHTML = '<i class="icon">⌛</i><span>处理中...</span>';
      setTimeout(() => {
        alert("🎉 导出请求已发送！\n\n注意：当前为[演示范本]，导出的 MP4 视频将会在您的浏览器下载任务中模拟生成。");
        exportBtn.innerHTML = '<i class="icon">⭐</i><span>解锁导出</span>';
      }, 1500);
    });
  }

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
      logEntry.style.marginBottom = "4px";
      logEntry.textContent = `> ${phase.log}`;
      logContainer.prepend(logEntry);

      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 500));
    }

    // 切换到播放器前预加载第一张图
    const firstImg = new Image();
    firstImg.src = assetPool[0];
    await new Promise(resolve => {
        firstImg.onload = resolve;
        firstImg.onerror = resolve; // 即使加载失败也继续
    });

    // 生成完成后，模拟视频分镜数据
    prepareVideoContent(prompt);

    // 切换到播放器
    loadingSection.classList.remove("active");
    playerSection.classList.add("active");

    startPlayback();
  }

  function prepareVideoContent(prompt) {
    const keywords = prompt.split(/[，。！？、\s]/).filter(s => s.length > 1);
    const mainKey = keywords[0] || "这个奇妙的世界";

    currentScenes = [
      { img: assetPool[0], text: `${mainKey}，已经不再是曾经的模样...` },
      { img: assetPool[1], text: `在每一个光影闪烁的瞬间，都有故事在发生。` },
      { img: assetPool[2], text: `人们追逐着数字的幻象，试图找回真实。` },
      { img: assetPool[3], text: `而你，正是这一切的主宰。` }
    ];
    currentSceneIndex = 0;
  }

  function startPlayback() {
    let startTime = Date.now();
    const sceneDuration = 4000;
    const totalDuration = currentScenes.length * sceneDuration;

    if (playbackInterval) clearInterval(playbackInterval);

    playbackInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % totalDuration) / totalDuration;
        playbackBar.style.width = `${progress * 100}%`;

        const currentIdx = Math.floor((elapsed % totalDuration) / sceneDuration);
        if (currentIdx !== currentSceneIndex) {
            currentSceneIndex = currentIdx;
            updateScene();
        }
    }, 50);

    updateScene();
  }

  function updateScene() {
    const scene = currentScenes[currentSceneIndex];
    // 强制先显示，防止黑屏
    videoStage.style.backgroundImage = `url('${scene.img}')`;
    videoStage.style.opacity = 1;
    videoCaption.textContent = scene.text;
  }
});
