import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function HelpTab() {
  const [searchTerm, setSearchTerm] = useState('');

  const commands = [
    { category: '帮助', icon: '🆘', cmd: '/help', desc: '查看所有命令和工作流', scene: '不知道该用什么命令时' },
    { category: '写作类', icon: '✍️', cmd: '/write [主题]', desc: '完整写作流程（8步）', scene: '日常写作' },
    { category: '写作类', icon: '⚡', cmd: '/write-auto [热点]', desc: '全自动爆款生成', scene: '快速产出' },
    { category: '写作类', icon: '🔄', cmd: '/write-rewrite', desc: '文章翻新改写', scene: '洗稿/翻新' },
    { category: '热点类', icon: '🔥', cmd: '/hotspot', desc: 'AI热点扫描+爆款评估', scene: '找选题' },
    { category: '热点类', icon: '📅', cmd: '/daily', desc: '每日热点扫描+自动写作', scene: '日更模式' },
    { category: '标题类', icon: '🎯', cmd: '/title-gen [主题]', desc: '生成5个爆款标题', scene: '标题灵感' },
    { category: '标题类', icon: '📊', cmd: '/title-score [标题]', desc: '7维度标题评分', scene: '标题优化' },
    { category: '标题类', icon: '✅', cmd: '/pre-check', desc: '发文前8维度检查', scene: '发布前' },
    { category: '标题类', icon: '🎯', cmd: '/topic-filter [选题]', desc: 'V3双轨制选题过滤', scene: '写作前必用' },
    { category: '图片类', icon: '🖼️', cmd: '/image', desc: '自动添加配图', scene: '文章美化' },
    { category: '图片类', icon: '📊', cmd: '/infographic', desc: '生成信息图', scene: '数据可视化' },
    { category: '数据类', icon: '📥', cmd: '/data-collect', desc: '收集微信公众号数据', scene: '数据采集' },
    { category: '数据类', icon: '📈', cmd: '/data-analyze', desc: '深度分析文章数据', scene: '爆款规律挖掘' },
    { category: '工具类', icon: '🔧', cmd: '/test-mcp', desc: '测试MCP工具可用性', scene: '排障' },
    { category: '工具类', icon: '🤖', cmd: '/ai-orchestrator', desc: '多AI协作编排', scene: '复杂任务' },
  ];

  const workflows = [
    {
      title: '🚀 日常写作流程',
      steps: [
        { step: 1, cmd: '/topic-filter [选题]', desc: '先过滤选题可行性' },
        { step: 2, cmd: '/write [主题]', desc: '完整写作（自动含标题生成+质量检测）' },
        { step: 3, cmd: '/pre-check', desc: '发文前最终检查' },
        { step: 4, cmd: '/image 或 /infographic', desc: '可选：添加配图/信息图' },
      ]
    },
    {
      title: '⚡ 快速产出流程',
      steps: [
        { step: 1, cmd: '/hotspot', desc: '扫描今日热点' },
        { step: 2, cmd: '/write-auto [热点]', desc: '全自动爆款生成' },
      ]
    },
    {
      title: '📈 数据驱动流程',
      steps: [
        { step: 1, cmd: '/data-collect', desc: '收集历史数据' },
        { step: 2, cmd: '/data-analyze', desc: '分析爆款规律' },
        { step: 3, cmd: '/title-gen [主题]', desc: '根据规律生成标题' },
      ]
    },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.cmd.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.scene.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🆘 帮助中心</h2>
        <p className="text-gray-600">公众号写作助手 V7.2.1 - 完整命令速查表</p>
      </div>

      {/* 搜索框 */}
      <div>
        <Input
          placeholder="搜索命令... (例如: write, 标题, 热点)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* 推荐工作流 */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">📋 推荐工作流</h3>
        <div className="grid grid-cols-3 gap-4">
          {workflows.map((workflow, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-5">
              <h4 className="font-semibold text-gray-900 mb-3">{workflow.title}</h4>
              <div className="space-y-2">
                {workflow.steps.map((s, sIdx) => (
                  <div key={sIdx} className="text-sm">
                    <p className="text-gray-600 mb-1">
                      {s.step}. {s.desc}
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-blue-600">
                      {s.cmd}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 命令速查表 */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          📚 所有命令 ({filteredCommands.length})
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {filteredCommands.map((cmd, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{cmd.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {cmd.cmd}
                    </code>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {cmd.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{cmd.desc}</p>
                  <p className="text-xs text-gray-500">
                    <strong>使用场景：</strong>{cmd.scene}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 质量标准 */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 质量检测标准</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-1">AI腔检测</p>
            <p className="text-gray-600">&lt;20分（越低越好）</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">自然度</p>
            <p className="text-gray-600">&gt;80分（越高越好）</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">真诚度</p>
            <p className="text-gray-600">&gt;75分（越高越好）</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">啰嗦度</p>
            <p className="text-gray-600">&lt;25分（越低越好）</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">重复度</p>
            <p className="text-gray-600">&lt;15%（越低越好）</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">可读性</p>
            <p className="text-gray-600">&gt;85分（越高越好）</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">人味儿指数</p>
            <p className="text-gray-600">&gt;70分（接地气）</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">情感真实性</p>
            <p className="text-gray-600">&gt;75分（真实情感）</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">脏话检测</p>
            <p className="text-gray-600">=0处（零容忍）</p>
          </div>
        </div>
      </div>

      {/* 核心工具池TOP6 */}
      <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 核心工具池 TOP6</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between items-center bg-white rounded px-4 py-2">
            <span className="font-medium text-gray-700">Kimi/月之暗面</span>
            <span className="font-bold text-purple-600">3448阅读</span>
          </div>
          <div className="flex justify-between items-center bg-white rounded px-4 py-2">
            <span className="font-medium text-gray-700">Google/Gemini</span>
            <span className="font-bold text-purple-600">3146阅读</span>
          </div>
          <div className="flex justify-between items-center bg-white rounded px-4 py-2">
            <span className="font-medium text-gray-700">ByteDance/即梦</span>
            <span className="font-bold text-purple-600">2927阅读</span>
          </div>
          <div className="flex justify-between items-center bg-white rounded px-4 py-2">
            <span className="font-medium text-gray-700">Anthropic/Claude</span>
            <span className="font-bold text-purple-600">2118阅读</span>
          </div>
          <div className="flex justify-between items-center bg-white rounded px-4 py-2">
            <span className="font-medium text-gray-700">Cursor</span>
            <span className="font-bold text-purple-600">1246阅读</span>
          </div>
          <div className="flex justify-between items-center bg-white rounded px-4 py-2">
            <span className="font-medium text-gray-700">Codex</span>
            <span className="font-bold text-purple-600">1199阅读</span>
          </div>
        </div>
        <p className="text-xs text-purple-700 mt-3">
          💡 提示：核心工具类平均阅读是泛AI话题类的 <strong>2倍</strong>！
        </p>
      </div>
    </div>
  );
}
