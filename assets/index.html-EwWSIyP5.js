import{_ as n,o as s,c as a,b as p}from"./app-PV69FY-z.js";const t={},e=p(`<h2 id="多少有一点进展" tabindex="-1"><a class="header-anchor" href="#多少有一点进展" aria-hidden="true">#</a> 多少有一点进展</h2><p><img src="https://s2.loli.net/2024/01/24/FKZjXukRBeV4zxd.png" alt="image-20240124010054344"></p><p>因为很心虚，先上图，托更了这么久。。。可以看到我已经实现了点击上方ui选择植物，然后将选中的植物的图片，放到地板上。。。没错就是图片，没有任何状态和行为哈哈哈哈哈。</p><p>之后会慢慢加上膨胀检测，加上僵尸，我感觉有进一步接近我想要的demo了，虽然还差很远。现在最困扰我的问题就是<code>PIXIJS</code>和我内部用到的对象之间的关系，总感觉写起来不对劲。我希望可以做到，在用户输入引发（也不仅仅是用户输入，所有可以改变内部对象状态的都应该触发）更新后，我能够分析区别，然后更新<code>PIXIJS</code>的对象，这个过程应该是所谓的响应式？类似于vue那种，数据驱动视图的变化（不过我这里因为利用了<code>PIXiJS</code>,所以正确的是我的内部数据驱动<code>PIXIJS</code>内的数据变化，随后视图自会变化，<code>PIXIJS</code>帮我完成了这一步，很滑稽的是我需要做前一步，但我不太会。</p><h2 id="垃圾代码-hand" tabindex="-1"><a class="header-anchor" href="#垃圾代码-hand" aria-hidden="true">#</a> 垃圾代码-hand</h2><p>首先定义了一个hand，可以抓取对象，释放对象，丢出对象（为什么是三个因为我现在也不知道咋写）。在顶部UI栏，选中某个植物后，该植物就会出现在鼠标附近并跟随移动。</p><p>事件监听暂时用到了<code>globalpointermove</code>,用于跟随鼠标显示，通常会把handmodel暴露出去，其他对象触发事件并需要获取hand中的对象则调用<code>releaseObject</code>。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Renderer<span class="token punctuation">,</span> Interaction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../basic/basic.js&#39;</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> <span class="token constant">PIXI</span> <span class="token keyword">from</span> <span class="token string">&#39;../../pixi.mjs&#39;</span>

<span class="token keyword">class</span> <span class="token class-name">Hand</span> <span class="token punctuation">{</span>
    <span class="token comment">// 手中有？可以和啥交互？感觉这海曼重要</span>
    content
    source
    target
    #renderer
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">get</span> <span class="token function">renderer</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>#renderer
    <span class="token punctuation">}</span>

    <span class="token keyword">set</span> <span class="token function">renderer</span><span class="token punctuation">(</span><span class="token parameter">renderer</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>#renderer <span class="token operator">=</span> renderer
        <span class="token keyword">if</span> <span class="token punctuation">(</span>renderer<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> content <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>content
            <span class="token keyword">const</span> <span class="token punctuation">{</span> type <span class="token operator">=</span> <span class="token string">&#39;img&#39;</span> <span class="token punctuation">}</span> <span class="token operator">=</span> content
            <span class="token keyword">if</span> <span class="token punctuation">(</span>type <span class="token operator">===</span> <span class="token string">&#39;img&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">const</span> item <span class="token operator">=</span> <span class="token constant">PIXI</span><span class="token punctuation">.</span>Sprite<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>content<span class="token punctuation">.</span>baseSpritePath<span class="token punctuation">)</span>
                item<span class="token punctuation">.</span>position<span class="token punctuation">.</span>x <span class="token operator">=</span> <span class="token number">1</span>
                item<span class="token punctuation">.</span>position<span class="token punctuation">.</span>y <span class="token operator">=</span> <span class="token number">1</span>
                item<span class="token punctuation">.</span>width <span class="token operator">=</span> <span class="token number">75</span>
                item<span class="token punctuation">.</span>height <span class="token operator">=</span> <span class="token number">75</span>
                handView<span class="token punctuation">.</span><span class="token function">addChild</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>handView<span class="token punctuation">.</span>children<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            handView<span class="token punctuation">.</span><span class="token function">removeChildAt</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>

    <span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>content <span class="token operator">=</span> <span class="token keyword">null</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>renderer <span class="token operator">=</span> <span class="token keyword">null</span>
    <span class="token punctuation">}</span>

    <span class="token function">holdObject</span><span class="token punctuation">(</span><span class="token parameter">content</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>content <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>content<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>content <span class="token operator">=</span> content
            <span class="token keyword">const</span> config <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">size</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">width</span><span class="token operator">:</span> <span class="token number">75</span><span class="token punctuation">,</span> <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token number">75</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>renderer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Renderer</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token function">releaseObject</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> _content <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>content
        <span class="token keyword">if</span> <span class="token punctuation">(</span>_content<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> _content
    <span class="token punctuation">}</span>

    <span class="token function">throwObject</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> handView <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PIXI<span class="token punctuation">.</span>Container</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
handView<span class="token punctuation">.</span>eventMode <span class="token operator">=</span> <span class="token string">&#39;dynamic&#39;</span>
handView<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;globalpointermove&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> x<span class="token punctuation">,</span> y <span class="token punctuation">}</span> <span class="token operator">=</span> e
    handView<span class="token punctuation">.</span>x <span class="token operator">=</span> x
    handView<span class="token punctuation">.</span>y <span class="token operator">=</span> y
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> handModel <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Hand</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">export</span> <span class="token punctuation">{</span>
    handModel<span class="token punctuation">,</span>
    handView
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="垃圾代码-floor" tabindex="-1"><a class="header-anchor" href="#垃圾代码-floor" aria-hidden="true">#</a> 垃圾代码-floor</h2><p>充满了注释，混乱无序的floor,也就是我们看到的草地。</p><p>目前来说，floor根容器监听<code>pointermove</code>和<code>pointerdown</code>，检查当前鼠标悬浮于哪个cell。鼠标点击后则会释放hand中的对象，floor接受并尝试渲染（图片）</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> <span class="token constant">PIXI</span> <span class="token keyword">from</span> <span class="token string">&#39;../../pixi.mjs&#39;</span>
<span class="token keyword">import</span> Cell <span class="token keyword">from</span> <span class="token string">&#39;./cell.js&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> handModel <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../utils/hand.js&#39;</span>

<span class="token keyword">const</span> sizeX <span class="token operator">=</span> <span class="token number">120</span>
<span class="token keyword">const</span> sizeY <span class="token operator">=</span> <span class="token number">150</span>

<span class="token comment">// 我内部有floor对象，我根据floor对象生成了pixijs内部对象，然后pixijs根据这些对象进行渲染</span>
<span class="token comment">// 那我的model层到底是哪一个呢？我自己的，还是pixijs的？</span>
<span class="token comment">// 暂时一种理解是，pixijs只用于渲染的原则，如果我把pixijs完全看作view层，感觉合适一点？</span>
<span class="token comment">// 想想gameloop，每次循环我会监听输入，然后修改我自己的对象，貌似需要一种同步机制，监听我的对象的变更，修改pixi内部的对象</span>

<span class="token keyword">class</span> <span class="token class-name">Floor</span> <span class="token punctuation">{</span>
    row
    col
    cells
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">option</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        option <span class="token operator">=</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">row</span><span class="token operator">:</span> <span class="token number">6</span><span class="token punctuation">,</span>
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
        <span class="token keyword">this</span><span class="token punctuation">.</span>cells <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Array</span><span class="token punctuation">(</span>row<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">fill</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">new</span> <span class="token class-name">Array</span><span class="token punctuation">(</span>col<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">fill</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">new</span> <span class="token class-name">Cell</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>cells<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">row<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            row<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">cell<span class="token punctuation">,</span> j</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
                cell<span class="token punctuation">.</span>position<span class="token punctuation">.</span>x <span class="token operator">=</span> j <span class="token operator">*</span> sizeX
                cell<span class="token punctuation">.</span>position<span class="token punctuation">.</span>y <span class="token operator">=</span> i <span class="token operator">*</span> sizeY
                cell<span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token punctuation">(</span>i <span class="token operator">+</span> j<span class="token punctuation">)</span> <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token string">&#39;ground&#39;</span> <span class="token operator">:</span> <span class="token string">&#39;ground_dark&#39;</span>
            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token function">getCell</span><span class="token punctuation">(</span><span class="token parameter">x<span class="token punctuation">,</span> y</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> floorView<span class="token punctuation">.</span><span class="token function">getChildAt</span><span class="token punctuation">(</span>x <span class="token operator">*</span> <span class="token keyword">this</span><span class="token punctuation">.</span>row <span class="token operator">+</span> y<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token function">updateCell</span><span class="token punctuation">(</span><span class="token parameter">x<span class="token punctuation">,</span> y</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> content <span class="token operator">=</span> handModel<span class="token punctuation">.</span><span class="token function">releaseObject</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>content<span class="token punctuation">)</span> <span class="token keyword">return</span>
        <span class="token comment">// debugger</span>
        <span class="token keyword">const</span> mcell <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>cells<span class="token punctuation">[</span>x<span class="token punctuation">]</span><span class="token punctuation">[</span>y<span class="token punctuation">]</span>
        <span class="token comment">// const vcell = this.getCell(x, y)</span>
        <span class="token keyword">const</span> vcell <span class="token operator">=</span> mcell<span class="token punctuation">.</span>test
        <span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token literal-property property">baseSpritePath</span><span class="token operator">:</span> path <span class="token punctuation">}</span> <span class="token operator">=</span> content
        <span class="token keyword">const</span> sprite <span class="token operator">=</span> <span class="token constant">PIXI</span><span class="token punctuation">.</span>Sprite<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span>
        sprite<span class="token punctuation">.</span>width <span class="token operator">=</span> <span class="token number">75</span>
        sprite<span class="token punctuation">.</span>height <span class="token operator">=</span> <span class="token number">75</span>
        vcell<span class="token punctuation">.</span><span class="token function">addChild</span><span class="token punctuation">(</span>sprite<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> floorModel <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Floor</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> floorView <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PIXI<span class="token punctuation">.</span>Container</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
floorView<span class="token punctuation">.</span>x <span class="token operator">=</span> <span class="token number">100</span>
floorView<span class="token punctuation">.</span>y <span class="token operator">=</span> <span class="token number">100</span>

<span class="token keyword">const</span> <span class="token punctuation">{</span> cells<span class="token punctuation">,</span> row<span class="token punctuation">,</span> col <span class="token punctuation">}</span> <span class="token operator">=</span> floorModel
<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> row<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> row <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> col<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> cell <span class="token operator">=</span> cells<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span>
        <span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token literal-property property">baseSpritePath</span><span class="token operator">:</span> path<span class="token punctuation">,</span> position <span class="token punctuation">}</span> <span class="token operator">=</span> cell 
        <span class="token keyword">const</span> grass <span class="token operator">=</span> <span class="token constant">PIXI</span><span class="token punctuation">.</span>Sprite<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span>
        grass<span class="token punctuation">.</span>position<span class="token punctuation">.</span>x <span class="token operator">=</span> position<span class="token punctuation">.</span>x
        grass<span class="token punctuation">.</span>position<span class="token punctuation">.</span>y <span class="token operator">=</span> position<span class="token punctuation">.</span>y
        cell<span class="token punctuation">.</span>test <span class="token operator">=</span> grass
        row<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>grass<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    floorView<span class="token punctuation">.</span><span class="token function">addChild</span><span class="token punctuation">(</span><span class="token operator">...</span>row<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

floorView<span class="token punctuation">.</span>eventMode <span class="token operator">=</span> <span class="token string">&#39;static&#39;</span>
floorView<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;pointerdown&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> x<span class="token punctuation">,</span> y <span class="token punctuation">}</span> <span class="token operator">=</span> e
    <span class="token keyword">const</span> localX <span class="token operator">=</span> x <span class="token operator">-</span> <span class="token number">100</span>
    <span class="token keyword">const</span> loclaY <span class="token operator">=</span> y <span class="token operator">-</span> <span class="token number">100</span>
    <span class="token keyword">const</span> _x <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>loclaY <span class="token operator">/</span> sizeY<span class="token punctuation">)</span>
    <span class="token keyword">const</span> _y <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>localX <span class="token operator">/</span> sizeX<span class="token punctuation">)</span>
    floorModel<span class="token punctuation">.</span><span class="token function">updateCell</span><span class="token punctuation">(</span>_x<span class="token punctuation">,</span> _y<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token comment">// floorView.on(&#39;pointermove&#39;, (e) =&gt; {</span>
<span class="token comment">//     const { x, y } = e</span>
<span class="token comment">//     const localX = x - 100</span>
<span class="token comment">//     const loclaY = y - 100</span>
<span class="token comment">//     const row = Math.floor(loclaY / sizeY)</span>
<span class="token comment">//     const col = Math.floor(localX / sizeX)</span>
<span class="token comment">// })</span>

<span class="token keyword">export</span> <span class="token punctuation">{</span>
    floorModel<span class="token punctuation">,</span>
    floorView
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="浑水摸鱼结尾" tabindex="-1"><a class="header-anchor" href="#浑水摸鱼结尾" aria-hidden="true">#</a> 浑水摸鱼结尾</h2><p>明天，不，今天上线忙完之后估计会悠闲（两三天？？？）一阵子，希望能够抓紧把pvz系列的demo做出来啊！！！</p><p>很晚了，就这样吧，这篇博客完全是记录形式，顺便激励一下自己不要断更这么久，准备睡觉了。</p><h2 id="复活了" tabindex="-1"><a class="header-anchor" href="#复活了" aria-hidden="true">#</a> 复活了</h2><blockquote><p>update： 2024-01-24 17:56</p></blockquote><p><img src="https://s2.loli.net/2024/01/24/ZsLHv71z9P5nETB.png" alt="image-20240124163211455"></p><p>今天在看<code>vuejs设计与实现</code>这本书，虽然很久之前看过，不过只是略微看了一会。看着看着注意到这句话，昨天晚上写的时候就有结合<code>vuejs</code>响应系统的想法了。因为我觉得要完美处理我内部的和<code>PIXIJS</code>内部的对象，分析差异并且最小更新。然后渲染函数就是描述这个对象对应的渲染内容。</p><p><img src="https://s2.loli.net/2024/01/24/Cv7PEj21bpOXTqK.png" alt="image-20240124163926265"></p><p>这是编写前端页面需要注意的内容，对应到游戏，对应到<code>PIXIJS</code>，我发现这些概念都是通用的。</p><ol><li>container和div类似</li><li>sprite，text就是img和文本节点（再加上css的知识？）</li><li>属性？事件？层级结构？完全吻合</li></ol><p>然后想想渲染循环。。。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// Listen for animate update
app.ticker.add((delta) =&gt; {
	// 用户输入事件处理
	// 状态更新
	。。。响应系统
	// PIXIJS内部状态更新
	。。。接下来交给PIXI去做
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和我熟悉的前端页面不同，我需要？等等，我又突然想到我完全可以把整个游戏当成前端的页面来看。组件化配合响应系统，这两个东西大大的减少了我的心理负担，虽然我可能只是在天方夜谭？PIXIJS\`提供的app就是我所知道的根组件？切换场景和前端路由是类似的，页面也只是组件的组合？假设我的整个游戏都是图片文本的组合，我可以参考虚拟dom。或者说我写的就是虚拟dom</p><ol><li>我内部的对象就是虚拟dom</li><li>真实dom（不是，类比）就是PIXI内的对象</li><li>响应式，组件化，虚拟dom加diff可以大幅提到我的效率</li><li>更进一步的话，就是参考vue写法,支持声明式</li></ol>`,26),o=[e];function c(l,i){return s(),a("div",null,o)}const r=n(t,[["render",c],["__file","index.html.vue"]]);export{r as default};
