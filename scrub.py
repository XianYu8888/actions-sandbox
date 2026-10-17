#!/usr/bin/env python3
"""Scrub dylib-build repo: delete workflow runs + remove src/*.m files.
Usage: python3 scrub.py
Requires: PYTHONPATH including dynamic_credentials.py, gh.py in same dir.
"""
import sys
sys.path.insert(0, '/opt/muse/skills/custom-connector-setup/bin')
from dynamic_credentials import add_surrogate_to_request, read_json_response
import urllib.request, json

API = 'https://api.github.com'
REPO = 'XianYu8888/dylib-build'

def req(method, path, data=None):
    url = API + path
    body = json.dumps(data).encode() if data else None
    r = urllib.request.Request(url, data=body, method=method)
    r.add_header('Accept', 'application/vnd.github+json')
    r.add_header('User-Agent', 'Muse-agent')
    add_surrogate_to_request(r, 'custom.legacy-github', allowed_hosts=['api.github.com'])
    try:
        return read_json_response(urllib.request.urlopen(r))
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise

# 1. 删除所有 workflow runs
print("== 删除 workflow runs ==")
runs = req('GET', f'/repos/{REPO}/actions/runs?per_page=100')
count = 0
for run in (runs.get('workflow_runs') or []):
    req('DELETE', f'/repos/{REPO}/actions/runs/{run["id"]}')
    count += 1
    print(f"  deleted run {run['id']} ({run['name']})")
print(f"  共删除 {count} 条")

# 2. 删除 artifacts
print("== 删除 artifacts ==")
arts = req('GET', f'/repos/{REPO}/actions/artifacts?per_page=100')
count = 0
for a in (arts.get('artifacts') or []):
    req('DELETE', f'/repos/{REPO}/actions/artifacts/{a["id"]}')
    count += 1
print(f"  共删除 {count} 个")

# 3. 删除 src/ 下所有 .m 文件
print("== 删除 src/*.m ==")
try:
    src = req('GET', f'/repos/{REPO}/contents/src')
except Exception:
    src = None
if src:
    for f in src:
        if f['name'].endswith('.m'):
            req('DELETE', f'/repos/{REPO}/contents/src/{f["name"]}',
                {'message': f'remove {f["name"]}', 'sha': f['sha']})
            print(f"  deleted src/{f['name']}")
else:
    print("  src/ 为空或不存在")

print("\nDone. Git 历史仍保留提交记录，如需彻底抹掉需本地 force-push 重写历史。")
