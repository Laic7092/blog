import{_ as n,o as s,c as a,b as p}from"./app-d7610jpZ.js";const t={},e=p(`<h2 id="免责声明" tabindex="-1"><a class="header-anchor" href="#免责声明" aria-hidden="true">#</a> 免责声明</h2><p>本篇完全是本人瞎写的，未经仔细思考的结果，千万别学！！！后续有时间会进一步完善，但是我可能不会修改本篇，这并不是教程，而是我思考过程的记录。</p><h2 id="网格" tabindex="-1"><a class="header-anchor" href="#网格" aria-hidden="true">#</a> 网格</h2><p>中午稍微写了一会，脑子里沙也没有，写完这部分我有非常纠结到底要不要用<code>pixi.js</code>,有点害怕我学艺不精。晚上回去会给出<code>plant</code>和<code>zombie</code>的类，但我感觉还差的好远，尤其是渲染和交互。但是不管怎么样，干就完了。等主面板和僵尸植物的类写完，就是渲染和交互了，我计划是把选择植物，铲子给弄出来。然后依靠向日葵，豌豆射手，普通僵尸制作一个第一关，先从demo感受一下有和不足之处，再思考分析重新规划。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Cell</span> <span class="token punctuation">{</span>
    <span class="token comment">// 贴图和位置还有待思考。。。</span>
    type <span class="token operator">=</span> <span class="token string">&#39;ground&#39;</span> <span class="token comment">// 地板，草地,水面，屋顶</span>
    position <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">x</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token literal-property property">y</span><span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>
    size <span class="token operator">=</span> <span class="token number">20</span>
    baseSprite
    isEmpty <span class="token operator">=</span> <span class="token boolean">true</span>
    curPlant
    extraSprite
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> position</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>type <span class="token operator">=</span> type
        <span class="token keyword">this</span><span class="token punctuation">.</span>position <span class="token operator">=</span> position
    <span class="token punctuation">}</span>

    <span class="token function">plant</span><span class="token punctuation">(</span><span class="token parameter">plant</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>isEmpty<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>curPlant <span class="token operator">=</span> plant
            <span class="token keyword">this</span><span class="token punctuation">.</span>isEmpty <span class="token operator">=</span> <span class="token boolean">false</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>extraSprite <span class="token operator">=</span> plant<span class="token punctuation">.</span>baseSprite
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>isEmpty<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>curPlant <span class="token operator">=</span> <span class="token keyword">null</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>isEmpty <span class="token operator">=</span> <span class="token boolean">true</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>extraSprite <span class="token operator">=</span> <span class="token keyword">null</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


<span class="token keyword">class</span> <span class="token class-name">Floor</span> <span class="token punctuation">{</span>
    row <span class="token operator">=</span> <span class="token number">6</span>
    col <span class="token operator">=</span> <span class="token number">9</span>
    cells <span class="token operator">=</span> <span class="token keyword">null</span>

    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">option</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        option <span class="token operator">=</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">row</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>
            <span class="token literal-property property">col</span><span class="token operator">:</span> <span class="token number">9</span><span class="token punctuation">,</span>
            <span class="token literal-property property">rows</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>
                <span class="token literal-property property">idx</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
                <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;grass&#39;</span>
            <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
            <span class="token literal-property property">cols</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">const</span> <span class="token punctuation">{</span> row<span class="token punctuation">,</span> col <span class="token punctuation">}</span> <span class="token operator">=</span> option
        <span class="token keyword">this</span><span class="token punctuation">.</span>row <span class="token operator">=</span> row
        <span class="token keyword">this</span><span class="token punctuation">.</span>col <span class="token operator">=</span> col
        <span class="token keyword">const</span> cells <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">length</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>row <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">new</span> <span class="token class-name">Array</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>col<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">fill</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Cell</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="植物和僵尸" tabindex="-1"><a class="header-anchor" href="#植物和僵尸" aria-hidden="true">#</a> 植物和僵尸</h2><p>没啥内容植物类，行为树我完不会写</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// plant.js</span>
<span class="token keyword">class</span> <span class="token class-name">BehaviourTree</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
    <span class="token function">attack</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
    <span class="token function">defend</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
    <span class="token function">util</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Plant</span> <span class="token punctuation">{</span>
    health
    sprites
    curSprite
    cost
    cellSize <span class="token operator">=</span> <span class="token number">1</span>
    behaviourTree
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">OneShoot</span> <span class="token keyword">extends</span> <span class="token class-name">Plant</span> <span class="token punctuation">{</span>
    name <span class="token operator">=</span> <span class="token string">&#39;OneShoot&#39;</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>behaviourTree <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BehaviourTree</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样没啥内容动物类。。。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// zoombie.js</span>
<span class="token keyword">class</span> <span class="token class-name">BehaviourTree</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
    <span class="token function">attack</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
    <span class="token function">walk</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
    <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
    <span class="token function">eat</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Zoombie</span> <span class="token punctuation">{</span>
    health
    sprites
    curSprite
    behaviourTree
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">CommonZombie</span> <span class="token keyword">extends</span> <span class="token class-name">Zoombie</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>behaviourTree <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BehaviourTree</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="我承认我在水" tabindex="-1"><a class="header-anchor" href="#我承认我在水" aria-hidden="true">#</a> 我承认我在水</h2><p>这里是老规矩，<code>index.html</code>导入<code>main.js</code></p><p>我承认<code>Floor</code>类写的毫无意义，但是在我打算渲染出来之前我都没有想到要咋办。。。或者说，不太熟悉<code>PIXI.js</code>，说好的效率呢？</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// main.js with PIXI.js</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> <span class="token constant">PIXI</span> <span class="token keyword">from</span> <span class="token string">&#39;./pixi.mjs&#39;</span>
<span class="token keyword">import</span> Floor <span class="token keyword">from</span> <span class="token string">&quot;./modules/gameScene/floor.js&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PIXI<span class="token punctuation">.</span>Application</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">background</span><span class="token operator">:</span> <span class="token string">&#39;#1099bb&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">resizeTo</span><span class="token operator">:</span> window <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>app<span class="token punctuation">.</span>view<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> container <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PIXI<span class="token punctuation">.</span>Container</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
container<span class="token punctuation">.</span>x <span class="token operator">=</span> <span class="token number">100</span>
container<span class="token punctuation">.</span>y <span class="token operator">=</span> <span class="token number">100</span>
app<span class="token punctuation">.</span>stage<span class="token punctuation">.</span><span class="token function">addChild</span><span class="token punctuation">(</span>container<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> sizeX <span class="token operator">=</span> <span class="token number">120</span>
<span class="token keyword">const</span> sizeY <span class="token operator">=</span> <span class="token number">150</span>

<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">5</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> row <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> <span class="token number">9</span><span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token punctuation">(</span>i <span class="token operator">+</span> j<span class="token punctuation">)</span> <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token string">&#39;/assets/img/dark.png&#39;</span> <span class="token operator">:</span> <span class="token string">&#39;/assets/img/light.png&#39;</span>
        <span class="token keyword">const</span> grass <span class="token operator">=</span> <span class="token constant">PIXI</span><span class="token punctuation">.</span>Sprite<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span>
        grass<span class="token punctuation">.</span>position<span class="token punctuation">.</span>x <span class="token operator">=</span> j <span class="token operator">*</span> sizeX
        grass<span class="token punctuation">.</span>position<span class="token punctuation">.</span>y <span class="token operator">=</span> i <span class="token operator">*</span> sizeY
        row<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>grass<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    container<span class="token punctuation">.</span><span class="token function">addChild</span><span class="token punctuation">(</span><span class="token operator">...</span>row<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>效果如下，一共两张图片间隔渲染，丑的很有特色。。。</p><p><img src="https://s2.loli.net/2024/01/04/82GrlkBeysOQD9U.png" alt="image-20240104225656527"></p><p>真的是历经了千辛万苦，完成了1%哈哈哈哈哈哈哈，写的<code>Class</code>不能说毫无关系，只能说啥也不是。。。还需要多多思考，当然<code>PIXI.js</code>用的也是相当不顺手的说，还有一点要说的就是，<code>plant</code>和<code>zoombie</code>的行为树，我是真不会啊，一想就觉得好难55555。是否有点不自量力了呢？但我觉得金坛已经做了足够多了，说不定明天就有UI了，后天就能放置植物(做梦中。。。)</p><p>顺便记录一下目录</p><p><img src="https://s2.loli.net/2024/01/04/ptORlT6f9n37cHY.png" alt="image-20240104225633546"></p><p>今天就到此结束了，明天的工作任务还有蛮重可能不会写，周末要出去玩一天，不加班的话会更新的（也不知道在和谁说话，自言自语这么有意思？）</p>`,20),o=[e];function c(l,i){return s(),a("div",null,o)}const r=n(t,[["render",c],["__file","index.html.vue"]]);export{r as default};
