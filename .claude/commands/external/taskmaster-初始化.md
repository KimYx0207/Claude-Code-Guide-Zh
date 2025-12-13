# Taskmaster项目初始化

请使用 `initialize_project` 工具在当前项目目录初始化Taskmaster。

初始化完成后:
1. 会创建 `.taskmaster/` 目录
2. 生成 `config.json` 配置文件
3. 创建 `tasks.json` 任务列表
4. 生成 `docs/prd.txt` PRD文档模板
5. 创建 `templates/example_prd.txt` 示例模板

初始化成功后,告诉用户下一步可以:
- 编辑 `.taskmaster/docs/prd.txt` 写需求文档
- 或者直接问:"帮我解析PRD文档"
