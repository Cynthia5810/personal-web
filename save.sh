#!/bin/bash
# 快速存档脚本：./save.sh "这次改了什么"
MSG=${1:-"update"}
git add .
git commit -m "$MSG"
git push
echo "✅ 已保存到 GitHub: $MSG"
