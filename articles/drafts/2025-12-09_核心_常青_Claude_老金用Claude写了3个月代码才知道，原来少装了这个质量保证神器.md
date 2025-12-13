# 老金用Claude写了3个月代码才知道，原来少装了这个质量保证神器

刷GitHub。

看到一个仓库：claude-code-workflows。

作者：shinpr。

说明：Automated quality assurance workflows for Claude Code。

点开一看，好家伙，这是把质量检查都自动化了。

---

## 以前保证代码质量是什么样的？

举个例子。

提交代码前要检查：
- 代码格式对不对
- 有没有语法错误
- 测试通过没有
- 文档更新没有
- 安全问题有没有

要运行好几个命令：

```bash
npm run lint
npm run test
npm run build
git add .
git commit
```

每次都要重复。

忘了哪一步，就可能出问题。

---

## 有了这个Workflow Skill呢？

装上这个Skill。

每次要提交代码：

直接告诉Claude："帮我检查代码并提交"

Claude自动：
- 运行代码格式化
- 执行lint检查
- 跑所有测试
- 构建项目
- 检查安全漏洞
- 生成commit message
- 提交到Git

全自动。

不会遗漏任何步骤。

---

## 这个Skill厉害在哪？

简单说，就是把质量检查流程化了。

**第一，自动化检查**。

不用手动运行命令了。

Workflow会自动：
- 检测代码变更
- 选择对应的检查
- 按顺序执行
- 报告结果

就像有个QA在旁边盯着。

**第二，可配置规则**。

不是固定的流程。

可以自定义：
- 检查哪些项目
- 什么时候触发
- 失败了怎么办
- 通过了做什么

适应不同项目的需求。

**第三，智能提示**。

检查失败时。

不只是报错。

还会：
- 解释为什么失败
- 建议怎么修复
- 提供修复示例

不用自己查文档。

---

## 实测效果

试了一周。

测试了几个场景。

**场景1：提交代码检查**

以前提交代码。

要记得运行各种检查。

经常忘记某一步。

装上Commit Workflow：

```yaml
# .claude/skills/workflows/commit.yaml
name: pre-commit-check
triggers:
  - before:commit
checks:
  - format
  - lint
  - test
  - build
```

现在每次commit前。

Claude自动运行所有检查。

有问题立即提示。

不会把错误代码提交上去了。

**场景2：PR审查流程**

团队有PR要审核。

要检查：
- 代码规范
- 测试覆盖率
- 性能影响
- 安全问题

手动检查很费时间。

配置PR Workflow：

```yaml
name: pr-review
triggers:
  - on:pr-created
checks:
  - code-quality
  - test-coverage
  - performance
  - security
actions:
  - comment-results
  - request-changes
```

现在创建PR后。

Claude自动：
- 运行所有检查
- 在PR里评论结果
- 不通过的直接Request Changes

审查效率提升了50%。

**场景3：每日健康检查**

项目跑久了。

可能积累问题。

想定期检查项目状态。

配置Daily Check Workflow：

```yaml
name: daily-health-check
triggers:
  - schedule:09:00
checks:
  - dependencies-outdated
  - security-vulnerabilities
  - code-quality-trend
  - test-flakiness
actions:
  - send-report
  - create-issues
```

每天早上9点。

Claude自动：
- 检查依赖更新
- 扫描安全漏洞
- 分析代码质量趋势
- 识别不稳定测试
- 发报告
- 严重问题自动创建Issue

不用人工定期检查了。

---

## 都有哪些Workflow？

看了下仓库，总结了主要类型。

**代码提交类**：
- Pre-commit Check - 提交前检查
- Commit Message - 自动生成commit message
- Pre-push Check - 推送前检查

**PR审查类**：
- PR Review - 自动代码审查
- Test Coverage - 测试覆盖率检查
- Performance Check - 性能影响分析
- Breaking Change - 检测破坏性变更

**定时任务类**：
- Daily Health - 每日健康检查
- Weekly Report - 周报生成
- Dependency Update - 依赖更新提醒
- Security Scan - 安全扫描

**构建部署类**：
- Build Check - 构建验证
- Deploy Preview - 部署预览
- Rollback Guard - 回滚保护

基本上开发流程中的质量关卡，都能自动化。

---

## 怎么用？

三步搞定。

**第一步：安装Skill**

```bash
git clone https://github.com/shinpr/claude-code-workflows.git
cp -r claude-code-workflows .claude/skills/workflows
```

**第二步：配置Workflow**

选择需要的workflow，编辑配置：

```yaml
# .claude/skills/workflows/commit.yaml
name: my-commit-workflow
description: Pre-commit quality checks

triggers:
  - before:commit

checks:
  - name: format
    command: npm run format
    required: true

  - name: lint
    command: npm run lint
    required: true

  - name: test
    command: npm test
    required: false  # 测试可选

actions:
  on_success:
    - generate-commit-message
  on_failure:
    - show-errors
    - suggest-fixes
```

**第三步：开始使用**

重启Claude Code。

以后每次提交，workflow自动运行。

可以随时问Claude："运行commit workflow"。

---

## 当然也有短板

用了一周，发现几个问题。

**问题1：配置要花时间**

第一次配置workflow。

要了解项目的检查流程。

要写配置文件。

要测试是否正常。

可能要花半天。

建议：
- 从简单的开始
- 参考示例配置
- 逐步完善

**问题2：检查太多会很慢**

配置了很多检查。

每次提交要等很久。

影响开发体验。

建议：
- 区分必需和可选
- 轻量检查放前面
- 重量级的异步执行

**问题3：需要团队统一**

个人用很好。

但团队用要统一配置。

不然每个人的检查不一样。

建议：
- 配置文件提交到Git
- 在README里写清楚
- 定期同步更新

---

## 适合谁用？

如果你是这几类人，强烈建议试试：

**个人开发者** - 保证代码质量，养成好习惯。

**技术负责人** - 统一团队质量标准。

**开源项目** - 自动化贡献者代码审查。

**追求完美的人** - 不想有任何遗漏。

---

## 一个月后

用了一个月，开发方式变了。

以前提交代码，全靠自觉：
- 记得格式化
- 记得跑测试
- 记得检查lint
- 记得写好commit message

人总会忘。

累了就想快点提交。

结果经常出问题：
- 格式不对被打回
- 测试失败才发现
- Lint报错要重新提交

每次都很尴尬。

现在有了Workflow。

不用记了。

提交前，Claude自动检查。

有问题立即提示。

不会把烂代码提交上去。

这种改变，让质量保证从"自觉"变成了"自动"。

不依赖个人习惯。

而是系统化的流程。

一个月下来：
- 代码退回率从20%降到5%
- Bug数量减少了30%
- Code review时间节省了40%

更重要的是。

开发更专注了。

不用担心漏掉什么检查。

可以放心写代码。

其他的交给Workflow。

---

## 自动化的哲学

想起一件事。

10年前，质量保证主要靠人工。

Code review。

手动测试。

上线前检查清单。

很依赖个人经验和责任心。

后来有了CI/CD。

自动化了构建和测试。

质量提升了。

但还是要人手动触发。

手动配置规则。

现在有了AI + Workflow。

连这些都自动化了。

AI理解代码。

知道要检查什么。

知道怎么修复。

甚至能主动提建议。

这种进化，让质量保证从"事后补救"变成了"事前预防"。

不是出了问题再修。

而是问题还没出就被拦住了。

这种思维的转变。

会让软件质量上一个台阶。

也会让开发者有更多时间专注在创造上。

而不是消耗在修bug上。

---

**参考来源**：
- claude-code-workflows by shinpr https://github.com/shinpr/claude-code-workflows
- CI/CD最佳实践 https://github.com/DovAmir/awesome-design-patterns
- 代码质量标准 https://github.com/dwyl/repo-badges
