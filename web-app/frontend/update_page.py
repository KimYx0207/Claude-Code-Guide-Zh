import re

# 读取原文件
with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 更新1: 添加导入
import_section = """import dynamic from 'next/dynamic';

// 动态导入Monaco Editor（仅客户端）
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
      <p className="text-gray-500">编辑器加载中...</p>
    </div>
  )
});

"""

content = content.replace(
    '"use client";\n\nimport { useState, useEffect } from \'react\';',
    '"use client";\n\nimport { useState, useEffect } from \'react\';\n' + import_section
)

# 更新2: 修改TabView类型
content = content.replace(
    "type TabView = 'home' | 'hotspot' | 'write' | 'data' | 'docs';",
    "type TabView = 'home' | 'hotspot' | 'write' | 'data' | 'docs' | 'help';"
)

# 更新3: 在导航按钮后添加帮助中心按钮
help_button = """            <button
              onClick={() => setCurrentTab('help')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'help'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🆘 帮助中心
            </button>"""

# 在教程资料按钮后添加
content = content.replace(
    """              📚 教程资料
            </button>
          </div>""",
    """              📚 教程资料
            </button>""" + help_button + """
          </div>"""
)

# 更新4: 在主内容区添加HelpTab
content = content.replace(
    "{currentTab === 'docs' && <DocsTab />}",
    """{currentTab === 'docs' && <DocsTab />}
        {currentTab === 'help' && <HelpTab />}"""
)

# 更新5: 替换textarea为Monaco Editor
textarea_old = """<textarea
          value={article}
          onChange={(e) => setArticle(e.target.value)}
          className="w-full h-96 p-4 border border-gray-200 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="点击上方按钮生成文章，或手动编辑..."
        />"""

monaco_new = """<div className="border border-gray-200 rounded-lg overflow-hidden">
          <MonacoEditor
            height="400px"
            defaultLanguage="markdown"
            value={article}
            onChange={(value) => setArticle(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>"""

content = content.replace(textarea_old, monaco_new)

# 写入更新后的文件
with open('app/page-updated.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 页面基础更新完成！")
print("📝 新文件: app/page-updated.tsx")
